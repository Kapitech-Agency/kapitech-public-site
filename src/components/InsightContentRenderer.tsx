import React, { useState } from 'react';
import { Check, Copy, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { InsightBlock } from '../data/insightTypes';
import { buildInsightHeadingIds } from '../lib/insightHeadingIds';
import { InsightContextualPromo } from './InsightContextualPromo';

function resolveSafeUrl(rawUrl: unknown): { url: string; external: boolean; internalTo: string } | null {
  const value = typeof rawUrl === 'string' ? rawUrl.trim() : '';
  if (!value) return null;

  try {
    const parsed = new URL(value, window.location.origin);
    if (!['http:', 'https:'].includes(parsed.protocol)) return null;

    return {
      url: parsed.toString(),
      external: parsed.origin !== window.location.origin,
      internalTo: parsed.pathname + parsed.search + parsed.hash
    };
  } catch {
    return null;
  }
}

function inlineMarkdown(value: unknown): React.ReactNode[] {
  const safeValue = typeof value === 'string' ? value : String(value ?? '');
  const tokens = safeValue
    .split(/(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^\)]+\))/g)
    .filter(Boolean);

  return tokens.map((token, index) => {
    if (token.startsWith('**') && token.endsWith('**')) {
      return <strong key={index} className="font-semibold text-white">{token.slice(2, -2)}</strong>;
    }

    if (token.startsWith('*') && token.endsWith('*')) {
      return <em key={index}>{token.slice(1, -1)}</em>;
    }

    const match = token.match(/^\[([^\]]+)\]\(([^\)]+)\)$/);
    if (!match) return <React.Fragment key={index}>{token}</React.Fragment>;

    const [, label, rawUrl] = match;
    const resolved = resolveSafeUrl(rawUrl);
    if (!resolved) return <React.Fragment key={index}>{label}</React.Fragment>;

    const className = "font-medium text-white underline decoration-white/25 underline-offset-4 transition-colors hover:text-brand-red hover:decoration-brand-red/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/55";

    if (resolved.external) {
      return (
        <a
          key={index}
          href={resolved.url}
          target="_blank"
          rel="noopener noreferrer"
          className={className}
        >
          {label}
          <ExternalLink size={11} className="ml-1 inline-block align-[1px]" aria-hidden="true" />
        </a>
      );
    }

    return (
      <Link
        key={index}
        to={resolved.internalTo}
        className={className}
      >
        {label}
      </Link>
    );
  });
}

export const InsightContentRenderer: React.FC<{
  blocks: InsightBlock[];
  headingIds?: string[];
  language?: 'id' | 'en';
}> = ({ blocks, headingIds = buildInsightHeadingIds(blocks).map((id) => id || ''), language = 'en' }) => {
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<number | null>(null);

  const copyCode = async (code: string, index: number) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCodeIndex(index);
      window.setTimeout(
        () => setCopiedCodeIndex((current) => current === index ? null : current),
        1600
      );
    } catch {}
  };

  return (
    <div className="kapi-insight-body max-w-none">
      {blocks.map((block, index) => {
        if (!block || typeof block !== 'object') return null;

        if (block.type === 'paragraph') {
          return (
            <p key={index} className="mb-5 max-w-[72ch] text-[15px] font-light leading-[1.82] text-[#C3C7D0] sm:text-[15.5px] sm:leading-[1.84]">
              {inlineMarkdown(block.text)}
            </p>
          );
        }

        if (block.type === 'heading') {
          const isSection = block.level !== 3;
          const Heading = isSection ? 'h2' : 'h3';

          return (
            <Heading
              key={index}
              id={headingIds[index] || undefined}
              className={[
                'scroll-mt-28 font-display font-semibold text-white',
                isSection
                  ? 'mb-4 mt-12 first:mt-2 text-[1.85rem] leading-[1.12] tracking-[-0.04em] sm:text-[2rem]'
                  : 'mb-3 mt-8 border-l border-brand-red/35 pl-4 text-xl leading-[1.2] tracking-[-0.025em] sm:text-[1.3rem]'
              ].join(' ')}
            >
              {block.text}
              {block.text === 'When should you build a Prototype?' && (
                <span id="insight-when-should-you-build-one" className="block h-0 scroll-mt-28" aria-hidden="true" />
              )}
            </Heading>
          );
        }

        if (block.type === 'list') {
          const ListTag = block.ordered ? 'ol' : 'ul';

          return (
            <ListTag
              key={index}
              className={[
                block.ordered ? 'list-decimal' : 'list-disc',
                'mb-6 pl-6 text-[15px] font-light leading-7 text-[#C3C7D0] sm:text-base',
                block.ordered ? 'space-y-3' : 'space-y-2.5'
              ].join(' ')}
            >
              {(Array.isArray(block.items) ? block.items : []).map((item, itemIndex) => (
                <li key={itemIndex} className="pl-1 marker:text-brand-red">
                  {inlineMarkdown(item)}
                </li>
              ))}
            </ListTag>
          );
        }

        if (block.type === 'quote') {
          return (
            <figure key={index} className="my-8 border-l-2 border-brand-red/45 pl-5 sm:my-10 sm:pl-6">
              <blockquote className="max-w-3xl font-display text-[1.18rem] leading-[1.55] tracking-[-0.015em] text-white sm:text-[1.35rem]">
                {inlineMarkdown(block.text)}
              </blockquote>
              {block.attribution && (
                <figcaption className="mt-3 text-xs text-[#747C88]">
                  {block.attribution}
                </figcaption>
              )}
            </figure>
          );
        }

        if (block.type === 'image') {
          if (!block.url?.trim()) return null;

          const width = Number.isFinite(block.width) && Number(block.width) > 0 ? Number(block.width) : undefined;
          const height = Number.isFinite(block.height) && Number(block.height) > 0 ? Number(block.height) : undefined;

          return (
            <figure key={index} className="my-9 sm:my-10">
              <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0F1013]">
                <img
                  src={block.url}
                  alt={block.alt || ''}
                  width={width}
                  height={height}
                  loading="lazy"
                  decoding="async"
                  className="block h-auto w-full object-contain"
                  onError={(event) => {
                    const fallback = '/insights/mvp-vs-prototype-vs-proof-of-concept/visual-fallback.svg';
                    if (event.currentTarget.src.endsWith(fallback)) return;
                    event.currentTarget.src = fallback;
                    event.currentTarget.alt = language === 'id'
                      ? 'Visual artikel Kapitech'
                      : 'Kapitech article visual';
                  }}
                />
              </div>
              {block.caption && (
                <figcaption className="mt-3 max-w-[70ch] text-xs leading-5 text-[#737B88]">
                  {block.caption}
                </figcaption>
              )}
            </figure>
          );
        }

        if (block.type === 'table') {
          const headers = Array.isArray(block.headers) ? block.headers : [];
          const rows = Array.isArray(block.rows) ? block.rows : [];

          return (
            <div key={index} className="my-8 overflow-hidden border-y border-white/[0.08]">
              <div className="border-b border-white/[0.06] px-0 py-2.5 sm:hidden">
                <p className="text-[9px] font-mono uppercase tracking-[0.12em] text-[#666E7B]">
                  {language === 'id' ? 'Geser untuk melihat perbandingan' : 'Swipe to compare'}
                </p>
              </div>
              <div
                className="overflow-x-auto rounded-[16px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/55 focus-visible:ring-inset"
                tabIndex={0}
                role="region"
                aria-label={block.caption || (language === 'id' ? 'Tabel artikel' : 'Article table')}
              >
                <table className="w-full min-w-[560px] border-collapse text-left text-sm">
                  {block.caption && (
                    <caption className="caption-top px-4 py-3 text-left text-xs leading-5 text-[#7A8290]">
                      {block.caption}
                    </caption>
                  )}
                  <thead>
                    <tr className="bg-white/[0.035]">
                      {headers.map((header, headerIndex) => (
                        <th
                          key={headerIndex}
                          scope="col"
                          className="sticky left-0 z-10 border-b border-white/[0.08] bg-[#0F1013] px-4 py-3.5 text-[10px] font-mono uppercase tracking-[0.1em] text-[#8E96A4] first:shadow-[1px_0_0_rgba(255,255,255,0.06)]"
                        >
                          {inlineMarkdown(header)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, rowIndex) => (
                      <tr key={rowIndex} className="border-b border-white/[0.06] last:border-b-0">
                        {headers.map((_, cellIndex) => (
                          <td key={cellIndex} className="sticky left-0 z-[5] bg-[#0F1013] px-4 py-3.5 align-top leading-6 text-[#B6BBC5] first:shadow-[1px_0_0_rgba(255,255,255,0.045)]">
                            {inlineMarkdown(Array.isArray(row) ? row[cellIndex] || '' : '')}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        }

        if (block.type === 'callout') {
          const tone = block.tone || 'neutral';
          const toneClass = tone === 'warning'
            ? 'border-amber-400/45'
            : tone === 'success'
              ? 'border-emerald-400/45'
              : 'border-brand-red/40';

          return (
            <aside
              key={index}
              className={'my-7 border-l-2 pl-5 ' + toneClass}
            >
              {block.title && (
                <p className="mb-1 text-sm font-semibold text-white">{block.title}</p>
              )}
              <p className="text-sm font-light leading-7 text-[#B9BEC8]">
                {inlineMarkdown(block.text)}
              </p>
            </aside>
          );
        }

        if (block.type === 'code') {
          const copied = copiedCodeIndex === index;

          return (
            <div key={index} className="my-7 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#08090B]">
              <div className="flex items-center justify-between gap-3 border-b border-white/[0.07] px-4 py-3">
                <span className="text-[9px] font-mono uppercase tracking-[0.13em] text-[#69717D]">
                  {block.language || (language === 'id' ? 'Kode' : 'Code')}
                </span>
                <button
                  type="button"
                  onClick={() => void copyCode(block.code, index)}
                  className="inline-flex min-h-8 items-center gap-2 rounded-full border border-[#262930] bg-[#16181D] px-3 text-[9px] font-semibold uppercase tracking-[0.1em] text-white transition-colors hover:border-brand-red hover:bg-brand-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60"
                >
                  {copied ? <Check size={12} aria-hidden="true" /> : <Copy size={12} aria-hidden="true" />}
                  {copied ? (language === 'id' ? 'Disalin' : 'Copied') : (language === 'id' ? 'Salin' : 'Copy')}
                </button>
              </div>
              <pre className="overflow-x-auto p-5 text-xs leading-6 text-[#D7DAE0] sm:p-6">
                <code>{block.code}</code>
              </pre>
            </div>
          );
        }

        if (block.type === 'link') {
          const resolved = resolveSafeUrl(block.url);
          if (!resolved) return null;

          return (
            <p key={index} className="my-5">
              {resolved.external ? (
                <a
                  href={resolved.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-white underline decoration-white/25 underline-offset-4 transition-colors hover:text-brand-red hover:decoration-brand-red/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/55"
                >
                  {block.label}
                  <ExternalLink size={13} aria-hidden="true" />
                </a>
              ) : (
                <Link
                  to={resolved.internalTo}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-white underline decoration-white/25 underline-offset-4 transition-colors hover:text-brand-red hover:decoration-brand-red/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/55"
                >
                  {block.label}
                </Link>
              )}
            </p>
          );
        }

        if (block.type === 'promo') {
          return (
            <InsightContextualPromo
              key={index}
              block={block}
              language={language}
            />
          );
        }

        if (block.type === 'checklist') {
          return (
            <section
              key={index}
              className="my-8"
              aria-label={block.title || (language === 'id' ? 'Daftar periksa' : 'Checklist')}
            >
              {block.title && (
                <h3 className="mb-4 font-display text-xl font-semibold leading-[1.2] tracking-[-0.025em] text-white sm:text-[1.35rem]">
                  {block.title}
                </h3>
              )}
              <ul className="space-y-3 border-l border-white/[0.12] pl-5">
                {(Array.isArray(block.items) ? block.items : []).map((item, itemIndex) => (
                  <li key={itemIndex} className="flex gap-3 text-sm leading-6 text-[#C3C7D0]">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-red" aria-hidden="true" />
                    <span>{inlineMarkdown(item)}</span>
                  </li>
                ))}
              </ul>
            </section>
          );
        }

        if (block.type === 'divider') {
          return <div key={index} className="my-8 h-px bg-white/[0.07]" aria-hidden="true" />;
        }

        console.error('[Kapitech Insight] Unsupported content block reached the renderer:', {
          index,
          type: (block as { type?: string }).type || 'unknown'
        });
        return null;
      })}
    </div>
  );
};

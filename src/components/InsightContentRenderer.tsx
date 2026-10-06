import React, { useState } from 'react';
import { ArrowRight, Check, Copy, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { InsightContextualPromo } from './InsightContextualPromo';
import type { InsightBlock } from '../data/insightTypes';
import { buildInsightHeadingIds } from '../lib/insightHeadingIds';

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

const VALIDATION_DECISION_HEADINGS = new Set([
  'When should you build a Prototype?',
  'When should you build an MVP?',
  'When should you use a PoC?',
  'Kapan sebaiknya membuat Prototype?',
  'Kapan sebaiknya membuat MVP?',
  'Kapan sebaiknya menggunakan PoC?'
]);

function isValidationDecisionHeading(value: unknown): boolean {
  return typeof value === 'string' && VALIDATION_DECISION_HEADINGS.has(value);
}

const calloutStyles: Record<string, string> = {
  info: 'border-white/[0.09] bg-white/[0.025]',
  warning: 'border-amber-400/20 bg-amber-400/[0.035]',
  success: 'border-emerald-400/20 bg-emerald-400/[0.035]',
  neutral: 'border-white/[0.08] bg-white/[0.018]'
};

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

  let sectionNumber = 0;

  return (
    <div className="kapi-insight-body max-w-none">
      {blocks.map((block, index) => {
        if (!block || typeof block !== 'object') return null;

        if (block.type === 'paragraph') {
          return (
            <p key={index} className="mb-6 max-w-[72ch] text-[15px] font-light leading-[1.82] text-[#C3C7D0] sm:text-[15.5px] sm:leading-[1.84]">
              {inlineMarkdown(block.text)}
            </p>
          );
        }

        if (block.type === 'heading') {
          const isSection = block.level !== 3;
          const isValidationDecision = !isSection && isValidationDecisionHeading(block.text);
          const Heading = isSection ? 'h2' : 'h3';
          const currentSectionNumber = isSection ? ++sectionNumber : sectionNumber;

          if (isSection) {
            return (
              <Heading
                key={index}
                id={headingIds[index] || undefined}
                className="scroll-mt-28 mb-6 mt-16 first:mt-2"
              >
                <span className="mb-3 flex items-center gap-3 border-t border-white/[0.07] pt-5">
                  <span className="font-mono text-[9px] font-semibold tabular-nums tracking-[0.14em] text-brand-red">
                    {String(currentSectionNumber).padStart(2, '0')}
                  </span>
                  <span className="h-px w-8 bg-brand-red/45" aria-hidden="true" />
                  <span className="text-[9px] font-mono uppercase tracking-[0.16em] text-[#69717D]">
                    {language === 'id' ? 'Bagian' : 'Section'}
                  </span>
                </span>
                <span className="block font-display text-[1.95rem] font-semibold leading-[1.08] tracking-[-0.045em] text-white sm:text-[2.1rem] lg:text-[2.3rem]">
                  {block.text}
                </span>
              </Heading>
            );
          }

          return (
            <Heading
              key={index}
              id={isValidationDecision && block.text === 'When should you build a Prototype?'
                ? 'insight-when-should-you-build-one'
                : headingIds[index] || undefined}
              className={[
                'group scroll-mt-28 mb-4 mt-10 font-display text-xl font-semibold leading-[1.16] tracking-[-0.03em] text-white sm:text-[1.35rem]',
                isValidationDecision
                  ? 'rounded-r-xl border-y border-r border-white/[0.07] border-l border-l-brand-red/55 bg-white/[0.018] px-4 py-3.5'
                  : 'border-l border-white/[0.08] pl-4'
              ].join(' ')}
            >
              {isValidationDecision && (
                <span className="mb-2 block text-[8px] font-mono font-semibold uppercase tracking-[0.17em] text-brand-red">
                  {language === 'id' ? 'Panduan keputusan' : 'Decision guide'}
                </span>
              )}
              {block.text}
            </Heading>
          );
        }

        if (block.type === 'list') {
          const previousBlock = blocks[index - 1];
          const isDecisionList = Boolean(
            previousBlock?.type === 'heading' && isValidationDecisionHeading(previousBlock.text)
          );
          const ListTag = block.ordered ? 'ol' : 'ul';

          if (isDecisionList) {
            return (
              <ul
                key={index}
                className="mb-9 grid gap-3 sm:grid-cols-2"
              >
                {(Array.isArray(block.items) ? block.items : []).map((item, itemIndex) => (
                  <li
                    key={itemIndex}
                    className="flex gap-3 rounded-xl border border-white/[0.07] bg-white/[0.018] px-4 py-3.5 text-[13px] leading-6 text-[#C3C7D0] transition-[border-color,background-color] duration-300 hover:border-white/[0.12] hover:bg-white/[0.028] sm:text-sm"
                  >
                    <span
                      className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded border border-brand-red/40 bg-brand-red/[0.06]"
                      aria-hidden="true"
                    >
                      <Check size={10} className="text-brand-red" />
                    </span>
                    <span>{inlineMarkdown(item)}</span>
                  </li>
                ))}
              </ul>
            );
          }

          return (
            <ListTag
              key={index}
              className={[
                block.ordered ? 'list-decimal' : 'list-disc',
                'mb-8 space-y-3 pl-6 text-[15px] font-light leading-7 text-[#C3C7D0] sm:text-base'
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
            <figure key={index} className="my-11 border-y border-white/[0.08] py-7 sm:py-8">
              <p className="mb-3 text-[9px] font-mono uppercase tracking-[0.16em] text-[#69717D]">
                {language === 'id' ? 'Catatan' : 'Editorial note'}
              </p>
              <blockquote className="max-w-3xl font-display text-[1.22rem] leading-[1.45] tracking-[-0.02em] text-white sm:text-[1.45rem]">
                {inlineMarkdown(block.text)}
              </blockquote>
              {block.attribution && (
                <figcaption className="mt-5 text-[9px] font-mono uppercase tracking-[0.13em] text-[#7D8492]">
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
            <figure key={index} className="my-12">
              <div className="relative overflow-hidden rounded-[22px] border border-white/[0.08] bg-[#0B0C0E]">
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
                <figcaption className="mt-3 flex gap-2 text-xs leading-5 text-[#707684]">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand-red/70" aria-hidden="true" />
                  <span>{block.caption}</span>
                </figcaption>
              )}
            </figure>
          );
        }

        if (block.type === 'table') {
          const headers = Array.isArray(block.headers) ? block.headers : [];
          const rows = Array.isArray(block.rows) ? block.rows : [];

          return (
            <div key={index} className="my-12 overflow-hidden rounded-[18px] border border-white/[0.08] bg-white/[0.012]">
              <div className="border-b border-white/[0.06] px-4 py-2.5 sm:hidden">
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
                          className="border-b border-white/[0.08] px-4 py-3.5 text-[10px] font-mono uppercase tracking-[0.1em] text-[#8E96A4]"
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
                          <td key={cellIndex} className="px-4 py-3.5 align-top leading-6 text-[#B6BBC5]">
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

          const calloutLabel = tone === 'warning'
            ? (language === 'id' ? 'Perhatian' : 'Watch')
            : tone === 'success'
              ? (language === 'id' ? 'Prinsip' : 'Principle')
              : tone === 'info'
                ? (language === 'id' ? 'Catatan' : 'Note')
                : (language === 'id' ? 'Insight' : 'Insight');

          return (
            <aside
              key={index}
              className={'my-9 rounded-[18px] border p-5 sm:p-6 ' + (calloutStyles[tone] || calloutStyles.neutral)}
            >
              <p className="mb-2 text-[9px] font-mono font-semibold uppercase tracking-[0.16em] text-brand-red">
                {calloutLabel}
              </p>
              {block.title && (
                <p className="mb-2 text-sm font-semibold tracking-[-0.01em] text-white">{block.title}</p>
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
            <div key={index} className="my-9 overflow-hidden rounded-[22px] border border-white/[0.08] bg-[#08090B]">
              <div className="flex items-center justify-between gap-3 border-b border-white/[0.07] bg-white/[0.02] px-4 py-3">
                <span className="text-[9px] font-mono uppercase tracking-[0.13em] text-[#69717D]">
                  {block.language || (language === 'id' ? 'Kode' : 'Code')}
                </span>
                <button
                  type="button"
                  onClick={() => void copyCode(block.code, index)}
                  className="inline-flex min-h-[34px] items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.025] px-3 text-[9px] font-semibold uppercase tracking-[0.1em] text-[#9DA4B0] transition-[background-color,border-color,color] duration-300 hover:border-brand-red/30 hover:bg-brand-red/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/55"
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
            <p key={index} className="my-8">
              {resolved.external ? (
                <a
                  href={resolved.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[42px] items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.035] px-4 py-2.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-white transition-[background-color,border-color] duration-300 hover:border-brand-red/35 hover:bg-brand-red/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/55"
                >
                  {block.label}
                  <ExternalLink size={13} aria-hidden="true" />
                </a>
              ) : (
                <Link
                  to={resolved.internalTo}
                  className="inline-flex min-h-[42px] items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.035] px-4 py-2.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-white transition-[background-color,border-color] duration-300 hover:border-brand-red/35 hover:bg-brand-red/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/55"
                >
                  {block.label}
                  <ArrowRight size={13} aria-hidden="true" />
                </Link>
              )}
            </p>
          );
        }

        if (block.type === 'promo') {
          return <InsightContextualPromo key={index} block={block} language={language} />;
        }

        if (block.type === 'checklist') {
          return (
            <section
              key={index}
              className="my-12 border-y border-white/[0.08] py-8 sm:py-9"
              aria-label={block.title || (language === 'id' ? 'Daftar periksa' : 'Checklist')}
            >
              {block.title && (
                <h3 className="mb-5 text-xl font-display font-semibold leading-[1.12] tracking-[-0.03em] text-white sm:text-[1.35rem]">
                  {block.title}
                </h3>
              )}
              <ul className="grid gap-3 sm:grid-cols-2">
                {(Array.isArray(block.items) ? block.items : []).map((item, itemIndex) => (
                  <li key={itemIndex} className="flex gap-3 rounded-xl border border-white/[0.06] bg-white/[0.018] px-4 py-3.5 text-sm leading-6 text-[#C3C7D0]">
                    <span className="mt-1.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border border-brand-red/40 bg-brand-red/[0.06]" aria-hidden="true">
                      <Check size={10} className="text-brand-red" />
                    </span>
                    <span>{inlineMarkdown(item)}</span>
                  </li>
                ))}
              </ul>
            </section>
          );
        }

        if (block.type === 'divider') {
          return (
            <div key={index} className="my-14 flex items-center gap-4" aria-hidden="true">
              <span className="h-px flex-1 bg-white/[0.07]" />
              <span className="h-1 w-1 rounded-full bg-brand-red/70" />
              <span className="h-px flex-[0.18] bg-white/[0.07]" />
            </div>
          );
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

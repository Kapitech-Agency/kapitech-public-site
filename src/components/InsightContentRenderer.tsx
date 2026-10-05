import React, { useState } from 'react';
import { ArrowRight, Check, Copy, ExternalLink } from 'lucide-react';
import { InsightContextualPromo } from './InsightContextualPromo';
import type { InsightBlock } from '../data/insightTypes';
import { buildInsightHeadingIds } from '../lib/insightHeadingIds';

function inlineMarkdown(value: unknown): React.ReactNode[] {
  const safeValue = typeof value === 'string' ? value : String(value ?? '');
  const tokens = safeValue.split(/(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^\)]+\))/g).filter(Boolean);

  return tokens.map((token, index) => {
    if (token.startsWith('**') && token.endsWith('**')) {
      return <strong key={index} className="font-semibold text-white">{token.slice(2, -2)}</strong>;
    }

    if (token.startsWith('*') && token.endsWith('*')) {
      return <em key={index}>{token.slice(1, -1)}</em>;
    }

    const match = token.match(/^\[([^\]]+)\]\(([^\)]+)\)$/);
    if (match) {
      const [, label, rawUrl] = match;
      let url = '';

      try {
        const parsed = new URL(rawUrl, window.location.origin);
        if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
          url = parsed.toString();
        }
      } catch {}

      if (url) {
        const external = new URL(url).origin !== window.location.origin;

        return (
          <a
            key={index}
            href={url}
            target={external ? '_blank' : undefined}
            rel={external ? 'noreferrer' : undefined}
            className="font-medium text-white underline decoration-white/25 underline-offset-4 transition-colors hover:text-brand-red hover:decoration-brand-red/60"
          >
            {label}
            {external ? <ExternalLink size={11} className="ml-1 inline-block align-[1px]" aria-hidden="true" /> : null}
          </a>
        );
      }
    }

    return <React.Fragment key={index}>{token}</React.Fragment>;
  });
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
}> = ({ blocks, headingIds = buildInsightHeadingIds(blocks).map(id => id || ''), language = 'en' }) => {
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<number | null>(null);

  const copyCode = async (code: string, index: number) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCodeIndex(index);
      window.setTimeout(() => setCopiedCodeIndex(current => current === index ? null : current), 1600);
    } catch {}
  };

  return (
    <div className="kapi-insight-body max-w-none">
      {blocks.map((block, index) => {
        if (!block || typeof block !== 'object') return null;
        if (block.type === 'paragraph') {
          return (
            <p key={index} className="mb-7 text-[15px] font-light leading-[1.9] text-[#C3C7D0] sm:text-[16px]">
              {inlineMarkdown(block.text)}
            </p>
          );
        }

        if (block.type === 'heading') {
          const Heading = block.level === 3 ? 'h3' : 'h2';

          return (
            <Heading
              key={index}
              id={headingIds[index] || undefined}
              className={
                block.level === 3
                  ? 'group mb-4 mt-10 scroll-mt-32 text-xl font-display font-semibold leading-[1.12] tracking-[-0.03em] text-white sm:text-[1.35rem]'
                  : 'group mb-5 mt-14 scroll-mt-32 text-2xl font-display font-semibold leading-[1.08] tracking-[-0.045em] text-white sm:text-[2rem] lg:text-[2.2rem]'
              }
            >
              {block.text}
            </Heading>
          );
        }

        if (block.type === 'list') {
          const ListTag = block.ordered ? 'ol' : 'ul';

          return (
            <ListTag
              key={index}
              className={(block.ordered ? 'list-decimal ' : 'list-disc ') + 'mb-8 space-y-3 pl-6 text-[15px] font-light leading-7 text-[#C3C7D0] sm:text-base'}
            >
              {(block.items || []).map((item, itemIndex) => (
                <li key={itemIndex} className="pl-1 marker:text-brand-red">
                  {inlineMarkdown(item)}
                </li>
              ))}
            </ListTag>
          );
        }

        if (block.type === 'quote') {
          return (
            <figure key={index} className="relative my-10 overflow-hidden rounded-[22px] border border-white/[0.08] bg-white/[0.018] p-6 sm:p-8">
              <div className="absolute left-0 top-0 h-full w-[2px] bg-brand-red/70" />
              <blockquote className="max-w-2xl font-display text-xl leading-[1.45] tracking-[-0.02em] text-white/92 sm:text-2xl">
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
          return (
            <figure key={index} className="my-12">
              <div className="overflow-hidden rounded-[22px] border border-white/[0.08] bg-[#0B0C0E] shadow-[0_26px_70px_-54px_rgba(0,0,0,0.92)]">
                <img
                  src={block.url}
                  alt={block.alt}
                  loading="lazy"
                  className="block w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.012]"
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
          return (
            <div key={index} className="my-12 overflow-hidden rounded-[18px] border border-white/[0.08] bg-white/[0.012]">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="bg-white/[0.035]">
                      {(Array.isArray(block.headers) ? block.headers : []).map((header, headerIndex) => (
                        <th
                          key={headerIndex}
                          className="border-b border-white/[0.08] px-4 py-3.5 text-[10px] font-mono uppercase tracking-[0.1em] text-[#8E96A4]"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(Array.isArray(block.rows) ? block.rows : []).map((row, rowIndex) => (
                      <tr key={rowIndex} className="border-b border-white/[0.06] last:border-b-0 hover:bg-white/[0.015]">
                        {(Array.isArray(row) ? row : []).map((cell, cellIndex) => (
                          <td key={cellIndex} className="px-4 py-3.5 align-top leading-6 text-[#B6BBC5]">
                            {inlineMarkdown(cell)}
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

          return (
            <aside
              key={index}
              className={'relative my-9 overflow-hidden rounded-[22px] border p-5 sm:p-6 ' + (calloutStyles[tone] || calloutStyles.neutral)}
            >
              <div className="absolute left-0 top-0 h-full w-[2px] bg-brand-red/55" />
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
            <div key={index} className="my-9 overflow-hidden rounded-[22px] border border-white/[0.08] bg-[#08090B] shadow-[inset_0_1px_0_rgba(255,255,255,0.025)]">
              <div className="flex items-center justify-between gap-3 border-b border-white/[0.07] bg-white/[0.02] px-4 py-3">
                <span className="text-[9px] font-mono uppercase tracking-[0.13em] text-[#69717D]">
                  {block.language || (language === 'id' ? 'Kode' : 'Code')}
                </span>
                <button
                  type="button"
                  onClick={() => void copyCode(block.code, index)}
                  className="inline-flex min-h-[34px] items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.025] px-3 text-[9px] font-semibold uppercase tracking-[0.1em] text-[#9DA4B0] transition-[background-color,border-color,color] duration-300 hover:border-brand-red/30 hover:bg-brand-red/10 hover:text-white"
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
          const external = /^https?:\/\//.test(block.url) && !block.url.startsWith(window.location.origin);

          return (
            <p key={index} className="my-8">
              <a
                href={block.url}
                target={external ? '_blank' : undefined}
                rel={external ? 'noreferrer' : undefined}
                className="inline-flex items-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.025] px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.11em] text-white transition-[background-color,border-color,color,transform] duration-300 hover:-translate-y-0.5 hover:border-brand-red/35 hover:bg-brand-red/10"
              >
                {block.label}
                {external ? <ExternalLink size={13} aria-hidden="true" /> : <ArrowRight size={13} aria-hidden="true" />}
              </a>
            </p>
          );
        }

        if (block.type === 'promo') {
          return (
            <InsightContextualPromo
              key={index}
              block={block}
            />
          );
        }

        if (block.type === 'checklist') {
          return (
            <section key={index} className="my-12 border-y border-white/[0.08] py-8 sm:py-9" aria-label={block.title || (language === 'id' ? 'Daftar periksa' : 'Checklist')}>
              {block.title && (
                <h3 className="mb-5 text-xl font-display font-semibold leading-[1.12] tracking-[-0.03em] text-white sm:text-[1.35rem]">
                  {block.title}
                </h3>
              )}
              <ul className="grid gap-3 sm:grid-cols-2">
                {(block.items || []).map((item, itemIndex) => (
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
            <div key={index} className="my-12 flex items-center gap-3" aria-hidden="true">
              <span className="h-px flex-1 bg-white/[0.07]" />
              <span className="h-1 w-1 rounded-full bg-brand-red/60" />
              <span className="h-px w-10 bg-white/[0.07]" />
            </div>
          );
        }

        return null;
      })}
    </div>
  );
};

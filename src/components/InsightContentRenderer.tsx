import React, { useEffect, useRef, useState } from 'react';
import { AlertTriangle, Check, CheckCircle2, Copy, ExternalLink, Info, Maximize2, Quote, X } from 'lucide-react';
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

const INSIGHT_VISUAL_BASENAMES = [
  'validate',
  'learning-loop',
  'comparison',
  'decision-tree',
  'framework'
] as const;

function resolveInsightVisualUrl(rawUrl: string, language: 'id' | 'en'): string {
  if (!rawUrl) return rawUrl;

  const match = rawUrl.match(/^(.*\/(validate|learning-loop|comparison|decision-tree|framework))(?:-id)?(\.svg)$/i);
  if (!match) return rawUrl;

  const [, base, basename, extension] = match;
  if (!INSIGHT_VISUAL_BASENAMES.includes(basename as typeof INSIGHT_VISUAL_BASENAMES[number])) {
    return rawUrl;
  }

  return base + (language === 'id' ? '-id' : '') + extension;
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

    const className = "font-medium text-white underline decoration-white/25 underline-offset-4 transition-colors hover:text-brand-red hover:decoration-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35";

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
  const [activeVisual, setActiveVisual] = useState<{
    src: string;
    alt: string;
    caption?: string;
  } | null>(null);

  const activeVisualCloseRef = useRef<HTMLButtonElement | null>(null);
  const previousBodyOverflowRef = useRef('');
  const previousVisualTriggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!activeVisual) return;

    const previousOverflow = document.body.style.overflow;
    previousBodyOverflowRef.current = previousOverflow;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveVisual(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    window.requestAnimationFrame(() => {
      activeVisualCloseRef.current?.focus();
    });

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousBodyOverflowRef.current || previousOverflow;

      const trigger = previousVisualTriggerRef.current;
      previousVisualTriggerRef.current = null;
      window.requestAnimationFrame(() => {
        trigger?.focus();
      });
    };
  }, [activeVisual]);

  const openVisual = (visual: {
    src: string;
    alt: string;
    caption?: string;
  }) => {
    previousVisualTriggerRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    setActiveVisual(visual);
  };

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

  let articleVisualIndex = 0;

  return (
    <div className="kapi-insight-body max-w-none">
      {blocks.map((block, index) => {
        if (!block || typeof block !== 'object') return null;

        if (block.type === 'paragraph') {
          return (
            <p key={index} className="mb-5 max-w-none text-[15px] font-light leading-[1.82] text-[#C3C7D0] sm:text-[15.5px] sm:leading-[1.84]">
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
                  : 'mb-3 mt-8 border-l border-white/[0.12] pl-4 text-xl leading-[1.2] tracking-[-0.025em] sm:text-[1.3rem]'
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
            <figure
              key={index}
              className="my-8 overflow-hidden rounded-[20px] border border-white/[0.08] bg-[#111216] shadow-[inset_0_1px_0_rgba(255,255,255,0.018)] sm:my-9"
            >
              <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] px-5 py-3.5 sm:px-6">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/[0.045] text-[#8E96A4]">
                  <Quote size={13} aria-hidden="true" />
                </span>
                <span className="text-[8px] font-mono font-semibold uppercase tracking-[0.16em] text-[#626A76]">
                  {language === 'id' ? 'Catatan' : 'Field note'}
                </span>
              </div>
              <div className="px-5 py-6 sm:px-6 sm:py-7">
                <blockquote className="w-full font-display text-[1.18rem] font-medium leading-[1.55] tracking-[-0.018em] text-white sm:text-[1.35rem]">
                  {inlineMarkdown(block.text)}
                </blockquote>
                {block.attribution && (
                  <figcaption className="mt-4 flex items-center gap-2 text-xs text-[#7A8290]">
                    <span className="h-px w-5 bg-white/[0.12]" aria-hidden="true" />
                    {block.attribution}
                  </figcaption>
                )}
              </div>
            </figure>
          );
        }

        if (block.type === 'image') {
          if (!block.url?.trim()) return null;

          const width = Number.isFinite(block.width) && Number(block.width) > 0 ? Number(block.width) : undefined;
          const height = Number.isFinite(block.height) && Number(block.height) > 0 ? Number(block.height) : undefined;
          const visualIndex = articleVisualIndex++;
          const resolvedSrc = resolveInsightVisualUrl(block.url, language);
          const openLabel = language === 'id' ? 'Perbesar visual' : 'Open visual';

          return (
            <figure
              key={index}
              className="my-10 sm:my-12"
              data-kapi-article-visual="true"
              data-visual-index={visualIndex + 1}
            >
              <div className="relative overflow-hidden rounded-[16px] border border-white/[0.08] bg-[#0B0C0E] shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
                <button
                  type="button"
                  onClick={() => openVisual({
                    src: resolvedSrc,
                    alt: block.alt || (language === 'id' ? 'Visual artikel Kapitech' : 'Kapitech article visual'),
                    caption: block.caption
                  })}
                  className="group relative block w-full cursor-zoom-in text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/40"
                  aria-label={openLabel + ': ' + (block.alt || (language === 'id' ? 'Visual artikel' : 'Article visual'))}
                >
                  <span
                    className="pointer-events-none absolute bottom-3 right-3 z-10 inline-flex items-center gap-2 rounded-full border border-white/[0.09] bg-[#0B0C0E]/82 px-2.5 py-1.5 text-[8px] font-mono font-semibold uppercase tracking-[0.14em] text-[#B1B7C2] opacity-100 backdrop-blur-md transition-opacity duration-200 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
                  >
                    <Maximize2 size={11} aria-hidden="true" />
                    {language === 'id' ? 'Perbesar' : 'Expand'}
                  </span>

                  <img
                    src={resolvedSrc}
                    alt={block.alt || ''}
                    width={width}
                    height={height}
                    loading={visualIndex === 0 ? 'eager' : 'lazy'}
                    fetchPriority={visualIndex === 0 ? 'high' : 'auto'}
                    decoding="async"
                    className="block h-auto w-full max-w-full object-contain"
                    sizes="(min-width: 1280px) 1024px, calc(100vw - 2rem)"
                    onError={(event) => {
                      const fallback = '/insights/mvp-vs-prototype-vs-proof-of-concept/visual-fallback.svg';
                      if (event.currentTarget.src.endsWith(fallback)) return;
                      event.currentTarget.src = fallback;
                      event.currentTarget.alt = language === 'id'
                        ? 'Visual artikel Kapitech'
                        : 'Kapitech article visual';
                    }}
                  />
                </button>
              </div>

              {(block.caption || block.alt) && (
                <figcaption className="mt-3 flex items-start gap-3 px-1">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-red/70" aria-hidden="true" />
                  <span className="max-w-[74ch] text-xs leading-6 text-[#7A8290]">
                    {block.caption || block.alt}
                  </span>
                </figcaption>
              )}
            </figure>
          );
        }

        if (block.type === 'table') {
          const headers = Array.isArray(block.headers) ? block.headers : [];
          const rows = Array.isArray(block.rows) ? block.rows : [];
          const hasMultipleColumns = headers.length > 1;

          if (!headers.length) return null;

          return (
            <div key={index} className="my-8 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0F1013]">
              <div className="border-b border-white/[0.06] px-4 py-2.5 sm:hidden">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[9px] font-mono uppercase tracking-[0.12em] text-[#737B88]">
                    {language === 'id' ? 'Geser untuk membandingkan' : 'Swipe to compare'}
                  </p>
                  {hasMultipleColumns && (
                    <span className="shrink-0 rounded-full bg-white/[0.035] px-2 py-1 font-mono text-[8px] font-semibold tabular-nums text-[#626A76]">
                      {headers.length} {language === 'id' ? 'kolom' : 'columns'}
                    </span>
                  )}
                </div>
              </div>

              <div className="relative">
                <div
                  className="pointer-events-none absolute inset-y-0 left-0 z-20 hidden w-6 bg-gradient-to-r from-[#0F1013] to-transparent sm:block"
                  aria-hidden="true"
                />
                <div
                  className="pointer-events-none absolute inset-y-0 right-0 z-20 w-8 bg-gradient-to-l from-[#0F1013] to-transparent"
                  aria-hidden="true"
                />
                <div
                  className="overflow-x-auto overscroll-x-contain scroll-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35 focus-visible:ring-inset"
                  tabIndex={0}
                  role="region"
                  aria-label={block.caption || (language === 'id' ? 'Tabel artikel, geser secara horizontal untuk melihat semua kolom' : 'Article table, scroll horizontally to view all columns')}
                >
                <table className="w-full min-w-[760px] border-collapse text-left text-sm">
                  {block.caption && (
                    <caption className="caption-top border-b border-white/[0.06] px-4 py-3.5 text-left text-xs leading-5 text-[#7A8290]">
                      {block.caption}
                    </caption>
                  )}

                  <thead>
                    <tr className="bg-[#141519]">
                      {headers.map((header, headerIndex) => (
                        <th
                          key={headerIndex}
                          scope="col"
                          className={[
                            'border-b border-white/[0.08] px-4 py-4 text-left text-[10px] font-mono font-semibold uppercase leading-4 tracking-[0.1em] text-[#A2A9B6]',
                            headerIndex === 0
                              ? 'sticky left-0 z-10 bg-[#141519] shadow-[1px_0_0_rgba(255,255,255,0.07)]'
                              : ''
                          ].join(' ')}
                        >
                          {inlineMarkdown(header)}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {rows.map((row, rowIndex) => (
                      <tr
                        key={rowIndex}
                        className="border-b border-white/[0.055] transition-colors duration-150 last:border-b-0 hover:bg-white/[0.018]"
                      >
                        {headers.map((_, cellIndex) => (
                          <td
                            key={cellIndex}
                            className={[
                              'min-w-0 px-4 py-4 align-top text-[13px] leading-[1.65] text-[#B9BEC8] sm:text-[13.5px]',
                              cellIndex === 0
                                ? 'sticky left-0 z-[5] bg-[#0F1013] font-medium text-white shadow-[1px_0_0_rgba(255,255,255,0.055)]'
                                : ''
                            ].join(' ')}
                          >
                            {inlineMarkdown(Array.isArray(row) ? row[cellIndex] || '' : '')}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              </div>
            </div>
          );
        }

        if (block.type === 'callout') {
          const tone = block.tone || 'neutral';
          const toneMeta = tone === 'warning'
            ? {
                icon: AlertTriangle,
                iconClass: 'bg-amber-400/[0.1] text-amber-300',
                label: language === 'id' ? 'Perhatian' : 'Attention'
              }
            : tone === 'success'
              ? {
                  icon: CheckCircle2,
                  iconClass: 'bg-emerald-400/[0.1] text-emerald-300',
                  label: language === 'id' ? 'Tervalidasi' : 'Validated'
                }
              : {
                  icon: Info,
                  iconClass: 'bg-white/[0.05] text-[#A2A9B6]',
                  label: language === 'id' ? 'Catatan' : 'Note'
                };
          const ToneIcon = toneMeta.icon;

          return (
            <aside
              key={index}
              className="my-8 rounded-[20px] border border-white/[0.08] bg-[#111216] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.018)] sm:p-6"
            >
              <div className="flex items-start gap-3.5">
                <span className={'mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full ' + toneMeta.iconClass}>
                  <ToneIcon size={14} aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                    <span className="text-[8px] font-mono font-semibold uppercase tracking-[0.16em] text-[#626A76]">
                      {toneMeta.label}
                    </span>
                    {block.title && (
                      <span className="text-sm font-semibold text-white">
                        {block.title}
                      </span>
                    )}
                  </div>
                  <p className="mt-2.5 text-[13px] leading-7 text-[#B9BEC8] sm:text-[14px]">
                    {inlineMarkdown(block.text)}
                  </p>
                </div>
              </div>
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
                  className="inline-flex min-h-8 items-center gap-2 rounded-full border border-[#262930] bg-[#16181D] px-3 text-[9px] font-semibold uppercase tracking-[0.1em] text-white transition-colors hover:border-white/[0.16] hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35"
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
                  className="inline-flex items-center gap-2 text-sm font-semibold text-white underline decoration-white/25 underline-offset-4 transition-colors hover:text-brand-red hover:decoration-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35"
                >
                  {block.label}
                  <ExternalLink size={13} aria-hidden="true" />
                </a>
              ) : (
                <Link
                  to={resolved.internalTo}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-white underline decoration-white/25 underline-offset-4 transition-colors hover:text-brand-red hover:decoration-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35"
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
              className="my-8 rounded-[20px] border border-white/[0.08] bg-[#111216] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.018)] sm:p-6"
              aria-label={block.title || (language === 'id' ? 'Daftar periksa' : 'Checklist')}
            >
              <div className="flex items-end justify-between gap-4">
                <div className="min-w-0">
                  <span className="text-[8px] font-mono font-semibold uppercase tracking-[0.16em] text-[#626A76]">
                    {language === 'id' ? 'Checklist' : 'Checklist'}
                  </span>
                  {block.title && (
                    <h3 className="mt-1.5 font-display text-xl font-semibold leading-[1.2] tracking-[-0.025em] text-white sm:text-[1.35rem]">
                      {block.title}
                    </h3>
                  )}
                </div>
                <span className="shrink-0 rounded-full bg-white/[0.035] px-2.5 py-1 font-mono text-[8px] font-semibold tabular-nums text-[#626A76]">
                  {Array.isArray(block.items) ? block.items.length : 0}
                </span>
              </div>
              <ul className="mt-5 space-y-2.5">
                {(Array.isArray(block.items) ? block.items : []).map((item, itemIndex) => (
                  <li key={itemIndex} className="flex gap-3 rounded-xl bg-white/[0.022] px-3.5 py-3 text-sm leading-6 text-[#C3C7D0] transition-colors duration-200 hover:bg-white/[0.035]">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-red/[0.12] text-brand-red" aria-hidden="true">
                      <Check size={11} strokeWidth={2.5} />
                    </span>
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

      {activeVisual && (
        <div
          className="fixed inset-0 z-[140] flex items-center justify-center bg-[#050607]/92 p-4 backdrop-blur-md sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={language === 'id' ? 'Visual artikel diperbesar' : 'Expanded article visual'}
          onPointerDown={(event) => {
            if (event.target === event.currentTarget) {
              setActiveVisual(null);
            }
          }}
          onKeyDown={(event) => {
            if (event.key !== 'Tab') return;
            event.preventDefault();
            activeVisualCloseRef.current?.focus();
          }}
        >
          <div className="relative flex max-h-[94vh] w-full max-w-[1400px] flex-col overflow-hidden rounded-[18px] border border-white/[0.1] bg-[#0B0C0E] shadow-2xl">
            <div className="flex shrink-0 items-center justify-between gap-4 border-b border-white/[0.07] px-4 py-3 sm:px-5">
              <div className="min-w-0">
                <p className="text-[8px] font-mono font-semibold uppercase tracking-[0.16em] text-brand-red">
                  {language === 'id' ? 'Visual artikel' : 'Article visual'}
                </p>
                <p className="mt-1 line-clamp-1 text-xs text-[#A2A9B6]">
                  {activeVisual.caption || activeVisual.alt}
                </p>
              </div>

              <button
                type="button"
                ref={activeVisualCloseRef}
                onClick={() => setActiveVisual(null)}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/[0.09] bg-white/[0.025] text-[#A2A9B6] transition-colors hover:border-white/[0.16] hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35"
                aria-label={language === 'id' ? 'Tutup visual' : 'Close visual'}
              >
                <X size={16} aria-hidden="true" />
              </button>
            </div>

            <div
              className="min-h-0 overflow-auto p-2 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/35 sm:p-3"
              tabIndex={0}
              aria-label={language === 'id' ? 'Visual artikel, dapat digeser atau diperbesar' : 'Article visual, scrollable'}
            >
              <img
                src={activeVisual.src}
                alt={activeVisual.alt}
                className="mx-auto block max-h-[calc(94vh-84px)] w-auto max-w-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

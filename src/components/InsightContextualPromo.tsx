import React from 'react';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { InsightPromoBlock } from '../data/insightTypes';

function resolvePromoUrl(rawUrl: string): { href: string; internal: boolean } {
  try {
    const parsed = new URL(rawUrl, window.location.origin);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return { href: '/contact', internal: true };
    }

    return {
      href: parsed.pathname + parsed.search + parsed.hash,
      internal: parsed.origin === window.location.origin
    };
  } catch {
    return { href: '/contact', internal: true };
  }
}

export const InsightContextualPromo: React.FC<{
  block: InsightPromoBlock;
  language?: 'id' | 'en';
}> = ({ block, language = 'en' }) => {
  const target = resolvePromoUrl(block.ctaUrl);

  const action = target.internal ? (
    <Link
      to={target.href}
      className="inline-flex min-h-[42px] shrink-0 items-center justify-center gap-2 rounded-[13px] border border-brand-red/25 bg-brand-red/[0.09] px-4 py-2.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-white transition-[background-color,border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-brand-red/45 hover:bg-brand-red/[0.15] hover:shadow-[0_14px_30px_-24px_rgba(229,9,20,0.8)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/55"
    >
      {block.ctaLabel}
      <ArrowUpRight size={14} aria-hidden="true" />
    </Link>
  ) : (
    <a
      href={target.href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-h-[42px] shrink-0 items-center justify-center gap-2 rounded-[13px] border border-brand-red/25 bg-brand-red/[0.09] px-4 py-2.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-white transition-[background-color,border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-brand-red/45 hover:bg-brand-red/[0.15] hover:shadow-[0_14px_30px_-24px_rgba(229,9,20,0.8)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/55"
    >
      {block.ctaLabel}
      <ArrowUpRight size={14} aria-hidden="true" />
    </a>
  );

  return (
    <aside
      className="group/promo relative my-14 overflow-hidden rounded-[24px] border border-white/[0.08] bg-[#111318] shadow-[0_28px_80px_-58px_rgba(0,0,0,0.95)]"
      aria-label={block.title}
      data-kapi-ad="true"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_18%,rgba(229,9,20,0.16),transparent_28%),radial-gradient(circle_at_90%_90%,rgba(255,255,255,0.035),transparent_30%)]" />
      <div className="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full border border-brand-red/10 transition-transform duration-700 group-hover/promo:scale-110" />
      <div className="pointer-events-none absolute right-8 top-8 h-1.5 w-1.5 rounded-full bg-brand-red/70 shadow-[0_0_0_5px_rgba(220,20,60,0.06)]" />

      <div className="relative grid lg:grid-cols-[64px_minmax(0,1fr)_auto] lg:items-stretch">
        <div className="hidden border-r border-white/[0.06] bg-white/[0.012] p-4 lg:flex lg:flex-col lg:items-center lg:justify-between">
          <span className="flex h-9 w-9 items-center justify-center rounded-[11px] border border-brand-red/20 bg-brand-red/[0.06] text-brand-red">
            <Sparkles size={15} aria-hidden="true" />
          </span>
          <span className="font-mono text-[8px] font-semibold uppercase tracking-[0.16em] text-[#5F6773]">
            {language === 'id' ? 'Terkait' : 'Relevant'}
          </span>
        </div>

        <div className="min-w-0 p-5 sm:p-6 lg:p-7">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[9px] font-mono font-semibold uppercase tracking-[0.17em] text-brand-red">
              {language === 'id' ? 'Rekomendasi Kapitech' : 'Kapitech recommendation'}
            </span>
            <span className="h-1 w-1 rounded-full bg-white/[0.18]" aria-hidden="true" />
            <span className="rounded-full border border-white/[0.07] bg-white/[0.025] px-2 py-1 text-[8px] font-mono font-semibold uppercase tracking-[0.12em] text-[#767E8B]">
              {block.serviceReference
                ? (language === 'id' ? 'Layanan terkait' : 'Relevant service')
                : (language === 'id' ? 'Promosi' : 'Sponsored')}
            </span>
          </div>

          <h3 className="mt-4 max-w-[38rem] text-[21px] font-display font-semibold leading-[1.18] tracking-[-0.035em] text-white sm:text-[23px]">
            {block.title}
          </h3>
          <p className="mt-2.5 max-w-[52ch] text-[13px] leading-6 text-[#9299A6]">
            {block.description}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
            {block.serviceReference && (
              <span className="text-[9px] font-mono uppercase tracking-[0.11em] text-[#626A77]">
                {block.serviceReference}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-end p-5 pt-0 sm:p-6 sm:pt-0 lg:items-center lg:p-7 lg:pl-2">
          {action}
        </div>
      </div>
    </aside>
  );
};

import React from 'react';
import { ArrowUpRight } from 'lucide-react';
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

  const actionClass = "group inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-brand-red px-5 text-[9px] font-semibold uppercase tracking-[0.12em] text-white shadow-lg shadow-brand-red/15 transition-[background-color,transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:bg-[#FF1E27] hover:shadow-xl hover:shadow-brand-red/20 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60";

  const action = target.internal ? (
    <Link to={target.href} className={actionClass}>
      {block.ctaLabel}
      <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
    </Link>
  ) : (
    <a href={target.href} target="_blank" rel="noopener noreferrer" className={actionClass}>
      {block.ctaLabel}
      <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
    </a>
  );

  return (
    <aside
      className="group/promo relative my-14 overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.014] shadow-[inset_0_1px_0_rgba(255,255,255,0.018)]"
      aria-label={block.title}
      data-kapi-ad="true"
    >
      <span
        className="pointer-events-none absolute inset-x-5 top-0 h-px origin-left scale-x-0 bg-brand-red/80 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/promo:scale-x-100 sm:inset-x-6"
        aria-hidden="true"
      />

      <div className="flex flex-col gap-6 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:p-7">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="kapi-section-label">
              {language === 'id' ? 'REKOMENDASI KAPITECH' : 'KAPITECH RECOMMENDATION'}
            </span>
            <span className="text-[8px] font-mono uppercase tracking-[0.12em] text-[#6F757F]">
              {block.serviceReference || (language === 'id' ? 'Layanan terkait' : 'Related service')}
            </span>
          </div>

          <h3 className="mt-5 max-w-[42rem] text-[1.5rem] font-display font-semibold leading-[1.05] tracking-[-0.045em] text-white sm:text-[1.7rem]">
            {block.title}
          </h3>
          <p className="mt-3 max-w-[58ch] text-sm font-light leading-[1.8] text-[#8A909D]">
            {block.description}
          </p>
        </div>

        <div className="shrink-0">
          {action}
        </div>
      </div>
    </aside>
  );
};
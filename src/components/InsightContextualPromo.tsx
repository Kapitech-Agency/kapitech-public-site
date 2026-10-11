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
      href: parsed.origin === window.location.origin
        ? parsed.pathname + parsed.search + parsed.hash
        : parsed.toString(),
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

  const actionClass =
    'inline-flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-full bg-brand-red px-5 text-[9px] font-semibold uppercase tracking-[0.12em] text-white transition-[background-color,border-color,box-shadow] duration-300 hover:bg-[#C40F34] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 sm:w-auto';

  const action = target.internal ? (
    <Link to={target.href} className={actionClass}>
      {block.ctaLabel}
      <ArrowUpRight size={14} aria-hidden="true" />
    </Link>
  ) : (
    <a
      href={target.href}
      target="_blank"
      rel="noopener noreferrer"
      className={actionClass}
    >
      {block.ctaLabel}
      <ArrowUpRight size={14} aria-hidden="true" />
    </a>
  );

  return (
    <aside
      className="relative my-9 overflow-hidden rounded-[20px] border border-white/[0.08] bg-[#111216] shadow-[inset_0_1px_0_rgba(255,255,255,0.018)] sm:my-10"
      aria-label={block.title}
      data-kapi-ad="true"
    >
      <div className="absolute right-[-5rem] top-[-5rem] h-40 w-40 rounded-full bg-brand-red/[0.08] blur-3xl" aria-hidden="true" />
      <div className="relative p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1.5">
            <p className="text-[9px] font-mono font-semibold uppercase tracking-[0.17em] text-brand-red">
              {block.eyebrow}
            </p>
            <span className="text-[8px] font-mono uppercase tracking-[0.12em] text-[#626A76]">
              {block.serviceReference || (language === 'id' ? 'Layanan terkait' : 'Related service')}
            </span>
          </div>
          <span className="hidden shrink-0 rounded-full bg-white/[0.035] px-2.5 py-1 text-[8px] font-mono font-semibold uppercase tracking-[0.12em] text-[#646C78] sm:inline-flex">
            {language === 'id' ? 'Kapitech' : 'Kapitech'}
          </span>
        </div>

        <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
          <div className="min-w-0 max-w-[620px]">
            <h3 className="font-display text-[1.4rem] font-semibold leading-[1.12] tracking-[-0.03em] text-white sm:text-[1.55rem]">
              {block.title}
            </h3>
            <p className="mt-2.5 text-[13px] leading-6 text-text-body">
              {block.description}
            </p>
          </div>

          <div className="shrink-0">{action}</div>
        </div>
      </div>
    </aside>
  );
};

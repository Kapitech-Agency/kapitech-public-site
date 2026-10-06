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
    'inline-flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-full bg-brand-red px-5 text-[9px] font-semibold uppercase tracking-[0.12em] text-white transition-[background-color,border-color,box-shadow] duration-300 hover:bg-[#FF1E27] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60 sm:w-auto';

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
      className="my-9 rounded-2xl border border-white/[0.08] border-l-2 border-l-brand-red/55 bg-white/[0.018] p-5 sm:my-10 sm:p-6"
      aria-label={block.title}
      data-kapi-ad="true"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
        <div className="min-w-0 max-w-[620px]">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <p className="text-[9px] font-mono font-semibold uppercase tracking-[0.17em] text-brand-red">
              {block.eyebrow}
            </p>
            <span className="text-[8px] font-mono uppercase tracking-[0.12em] text-[#626A76]">
              {block.serviceReference || (language === 'id' ? 'Layanan terkait' : 'Related service')}
            </span>
          </div>
          <h3 className="mt-2.5 font-display text-[1.35rem] font-semibold leading-[1.14] tracking-[-0.03em] text-white sm:text-[1.5rem]">
            {block.title}
          </h3>
          <p className="mt-2.5 text-[13px] leading-6 text-[#8A909D]">
            {block.description}
          </p>
        </div>

        <div className="shrink-0">{action}</div>
      </div>
    </aside>
  );
};

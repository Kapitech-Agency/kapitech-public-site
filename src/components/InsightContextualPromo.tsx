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
}> = ({ block }) => {
  const target = resolvePromoUrl(block.ctaUrl);

  const content = (
    <>
      <div className="max-w-[620px]">
        <p className="text-[9px] font-mono font-medium uppercase tracking-[0.17em] text-brand-red">
          {block.eyebrow}
        </p>
        <h3 className="mt-2.5 text-[20px] font-display font-semibold leading-[1.18] tracking-[-0.03em] text-white sm:text-[22px]">
          {block.title}
        </h3>
        <p className="mt-2.5 max-w-xl text-[13px] leading-6 text-[#9299A6]">
          {block.description}
        </p>
        {block.serviceReference && (
          <p className="mt-3 text-[9px] font-mono uppercase tracking-[0.12em] text-[#646C78]">
            {block.serviceReference}
          </p>
        )}
      </div>

      {target.internal ? (
        <Link
          to={target.href}
          className="inline-flex min-h-[42px] w-full shrink-0 items-center justify-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.035] px-5 py-2.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-white transition-[background-color,border-color,color] duration-300 hover:border-brand-red/35 hover:bg-brand-red/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/55 sm:w-auto"
        >
          {block.ctaLabel}
          <ArrowUpRight size={14} aria-hidden="true" />
        </Link>
      ) : (
        <a
          href={target.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-[42px] w-full shrink-0 items-center justify-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.035] px-5 py-2.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-white transition-[background-color,border-color,color] duration-300 hover:border-brand-red/35 hover:bg-brand-red/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/55 sm:w-auto"
        >
          {block.ctaLabel}
          <ArrowUpRight size={14} aria-hidden="true" />
        </a>
      )}
    </>
  );

  return (
    <aside
      className="my-12 overflow-hidden rounded-[20px] border border-white/[0.08] bg-[rgba(15,17,22,0.72)] p-5 backdrop-blur-xl sm:my-14 sm:p-6"
      aria-label={block.title}
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
        {content}
      </div>
    </aside>
  );
};

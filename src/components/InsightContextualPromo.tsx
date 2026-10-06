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
      className="relative my-12 overflow-hidden rounded-[22px] border border-brand-red/25 bg-[linear-gradient(135deg,rgba(229,9,20,0.075),rgba(15,17,22,0.88)_42%,rgba(15,17,22,0.94))] p-5 shadow-[0_24px_60px_-48px_rgba(229,9,20,0.7)] sm:my-14 sm:p-6"
      aria-label={block.title}
      data-kapi-ad="true"
    >
      <div className="absolute inset-x-0 top-0 h-[2px] bg-brand-red" aria-hidden="true" />
      <div className="mb-5 flex items-center justify-between gap-4 border-b border-brand-red/10 pb-3.5">
        <span className="inline-flex items-center gap-2 text-[9px] font-mono font-semibold uppercase tracking-[0.17em] text-brand-red">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-red" aria-hidden="true" />
          Kapitech recommendation
        </span>
        <span className="rounded-full border border-brand-red/20 bg-brand-red/[0.07] px-2.5 py-1 text-[8px] font-mono font-semibold uppercase tracking-[0.13em] text-brand-red/85">
          {block.serviceReference ? 'Relevant service' : 'Sponsored'}
        </span>
      </div>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
        {content}
      </div>
    </aside>
  );
};

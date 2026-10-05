import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { InsightPromoBlock } from '../data/insightTypes';

export const InsightContextualPromo: React.FC<{
  block: InsightPromoBlock;
}> = ({ block }) => (
  <aside className="my-14 border-y border-white/[0.08] py-7 sm:my-16 sm:py-8" aria-label={block.title}>
    <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end sm:gap-8">
      <div className="max-w-[640px]">
        <p className="text-[9px] font-mono uppercase tracking-[0.17em] text-brand-red">
          {block.eyebrow}
        </p>
        <h3 className="mt-2.5 text-xl font-display font-semibold leading-[1.15] tracking-[-0.03em] text-white sm:text-2xl">
          {block.title}
        </h3>
        <p className="mt-2.5 text-sm leading-6 text-[#959CA8]">
          {block.description}
        </p>
      </div>
      <Link
        to={block.ctaUrl}
        className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-full border border-white/[0.1] px-4 py-2.5 text-[9px] font-semibold uppercase tracking-[0.11em] text-white transition-[border-color,background-color,color,transform] duration-200 hover:-translate-y-0.5 hover:border-brand-red/35 hover:bg-brand-red/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60"
      >
        {block.ctaLabel}
        <ArrowUpRight size={13} aria-hidden="true" />
      </Link>
    </div>
  </aside>
);

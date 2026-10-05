import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { InsightPromoBlock } from '../data/insightTypes';

export const InsightContextualPromo: React.FC<{
  block: InsightPromoBlock;
}> = ({ block }) => (
  <aside
    className="my-12 overflow-hidden rounded-[22px] border border-white/[0.08] bg-[rgba(15,17,22,0.72)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03),0_22px_60px_-48px_rgba(0,0,0,0.9)] backdrop-blur-xl sm:my-14 sm:p-6"
    aria-label={block.title}
  >
    <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
      <div className="max-w-[620px]">
        <p className="text-[9px] font-mono font-medium uppercase tracking-[0.17em] text-brand-red">
          {block.eyebrow}
        </p>

        <h3 className="mt-2.5 text-[21px] font-display font-semibold leading-[1.16] tracking-[-0.035em] text-white sm:text-2xl">
          {block.title}
        </h3>

        <p className="mt-2.5 max-w-xl text-[13px] leading-6 text-[#9299A6]">
          {block.description}
        </p>
      </div>

      <Link
        to={block.ctaUrl}
        className="inline-flex min-h-[42px] w-full shrink-0 items-center justify-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.035] px-5 py-2.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-[background-color,border-color,box-shadow,color] duration-300 hover:border-brand-red/35 hover:bg-brand-red/10 hover:text-white hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_12px_28px_-24px_rgba(229,9,20,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/55 sm:w-auto"
      >
        {block.ctaLabel}
        <ArrowUpRight size={14} strokeWidth={2} aria-hidden="true" />
      </Link>
    </div>
  </aside>
);
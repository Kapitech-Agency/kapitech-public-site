import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { InsightLanguage } from '../data/insightTypes';

export const InsightBookingCta: React.FC<{
  language: InsightLanguage;
  mobile?: boolean;
}> = ({ language, mobile = false }) => (
  <Link
    to="/contact"
    className={[
      'group flex min-h-12 items-center justify-between gap-4 rounded-2xl border border-brand-red/25 bg-brand-red px-4 py-3.5 text-white shadow-[0_12px_28px_-18px_rgba(229,9,20,0.75)]',
      'transition-[background-color,border-color,box-shadow,transform] duration-200',
      'hover:border-brand-red/45 hover:bg-[#F01924] hover:shadow-[0_16px_32px_-18px_rgba(229,9,20,0.85)]',
      'active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70',
      mobile ? 'w-full xl:hidden' : 'shrink-0'
    ].join(' ')}
    aria-label={language === 'id' ? 'Book a call dengan Kapitech' : 'Book a call with Kapitech'}
    data-analytics-event="insight_book_call"
  >
    <span>
      <span className="block text-[8px] font-mono uppercase tracking-[0.16em] text-white/70">
        {language === 'id' ? 'Siap berdiskusi?' : 'Ready to discuss?'}
      </span>
      <span className="mt-0.5 block text-[12px] font-semibold tracking-[-0.01em]">
        Book a call
      </span>
    </span>
    <span
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.08] transition-transform duration-200 group-hover:translate-x-0.5"
      aria-hidden="true"
    >
      <ArrowUpRight size={15} strokeWidth={2.2} />
    </span>
  </Link>
);

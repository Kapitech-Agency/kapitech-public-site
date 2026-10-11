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
      'group flex min-h-12 items-center justify-between gap-4 rounded-2xl border border-white/[0.1] bg-brand-red px-4 py-3.5 text-white shadow-[0_12px_28px_-18px_rgba(220, 20, 60,0.75)]',
      'transition-[background-color,border-color,box-shadow,transform] duration-200',
      'hover:border-white/[0.18] hover:bg-brand-red-bright hover:shadow-[0_16px_32px_-18px_rgba(220, 20, 60,0.85)]',
      'active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/45',
      mobile ? 'w-full xl:hidden' : 'shrink-0'
    ].join(' ')}
    aria-label={language === 'id' ? 'Jadwalkan konsultasi dengan Kapitech' : 'Book a call with Kapitech'}
    data-analytics-event="insight_book_call"
  >
    <span>
      <span className="block text-[8px] font-mono uppercase tracking-[0.16em] text-white/70">
        {language === 'id' ? 'Siap berdiskusi?' : 'Ready to discuss?'}
      </span>
      <span className="mt-0.5 block text-[12px] font-semibold tracking-[-0.01em]">
        {language === 'id' ? 'Jadwalkan konsultasi' : 'Book a call'}
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

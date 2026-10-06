import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { InsightLanguage } from '../data/insightTypes';

export const InsightBookACall: React.FC<{ language: InsightLanguage }> = ({ language }) => (
  <div className="shrink-0 rounded-[20px] border border-white/[0.08] bg-[rgba(15,17,22,0.74)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.035),0_18px_42px_-34px_rgba(0,0,0,0.9)] backdrop-blur-xl">
    <p className="text-[9px] font-mono font-medium uppercase tracking-[0.17em] text-brand-red">
      {language === 'id' ? 'Langkah berikutnya' : 'Next step'}
    </p>

    <h2 className="mt-2.5 text-[15px] font-display font-semibold leading-[1.3] tracking-[-0.025em] text-white">
      {language === 'id' ? 'Butuh partner untuk mengubah insight menjadi langkah nyata?' : 'Need a partner to turn an insight into a clear next step?'}
    </h2>

    <p className="mt-2 text-[11px] leading-[1.7] text-[#8A919D]">
      {language === 'id'
        ? 'Bicarakan konteks, scope, dan langkah berikutnya yang paling masuk akal.'
        : 'Talk through the context, scope, and most sensible next step.'}
    </p>

    <Link
      to="/contact"
      className="mt-4 inline-flex min-h-[42px] w-full items-center justify-center gap-2 rounded-full border border-brand-red/35 bg-brand-red/70 px-4 text-[9px] font-semibold uppercase tracking-[0.12em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.11),0_12px_28px_-22px_rgba(229,9,20,0.75)] transition-[background-color,border-color,box-shadow,color] duration-300 hover:border-brand-red/55 hover:bg-brand-red/80 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_16px_32px_-22px_rgba(229,9,20,0.62)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/55"
    >
      {language === 'id' ? 'Jadwalkan Konsultasi' : 'Book a Call'}
      <ArrowUpRight size={14} strokeWidth={2} aria-hidden="true" />
    </Link>
  </div>
);
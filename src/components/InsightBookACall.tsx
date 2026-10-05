import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { InsightLanguage } from '../data/insightTypes';

export const InsightBookACall: React.FC<{ language: InsightLanguage }> = ({ language }) => (
  <div className="mt-5 shrink-0 border-t border-white/[0.08] pt-5">
    <p className="text-[9px] font-mono uppercase tracking-[0.17em] text-brand-red">
      {language === 'id' ? 'Langkah berikutnya' : 'Next step'}
    </p>
    <h2 className="mt-2 text-base font-display font-semibold leading-[1.25] tracking-[-0.02em] text-white">
      {language === 'id' ? 'Butuh partner untuk memvalidasi produk?' : 'Need a partner to validate your product?'}
    </h2>
    <p className="mt-2 text-xs leading-5 text-[#737B88]">
      {language === 'id'
        ? 'Bicarakan scope, risiko, dan jalur validasi yang paling masuk akal.'
        : 'Talk through scope, risk, and the most sensible validation path.'}
    </p>
    <Link
      to="/contact"
      className="mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full bg-brand-red px-4 text-[9px] font-semibold uppercase tracking-[0.11em] text-white transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-[#FF1E27] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60"
    >
      {language === 'id' ? 'Book a Call' : 'Book a Call'}
      <ArrowUpRight size={13} aria-hidden="true" />
    </Link>
  </div>
);

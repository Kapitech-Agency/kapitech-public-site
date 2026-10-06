import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { InsightLanguage } from '../data/insightTypes';

export const InsightBookACall: React.FC<{ language: InsightLanguage }> = ({ language }) => (
  <div className="shrink-0 border-t border-white/[0.08] pt-4">
    <p className="text-[9px] font-mono font-semibold uppercase tracking-[0.17em] text-brand-red">
      {language === 'id' ? 'Langkah berikutnya' : 'Next step'}
    </p>

    <h2 className="mt-2.5 text-[14px] font-display font-semibold leading-[1.35] tracking-[-0.02em] text-white">
      {language === 'id'
        ? 'Butuh partner untuk menerapkan insight ini?'
        : 'Need a partner to turn this insight into action?'}
    </h2>

    <p className="mt-2 text-[11px] leading-[1.7] text-[#7F8794]">
      {language === 'id'
        ? 'Bicarakan konteks dan langkah berikutnya tanpa menambah scope yang belum perlu.'
        : 'Talk through the context and next step without adding unnecessary scope.'}
    </p>

    <Link
      to="/contact"
      className="mt-4 inline-flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.12em] text-white transition-colors duration-300 hover:text-brand-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/55"
    >
      {language === 'id' ? 'Jadwalkan konsultasi' : 'Book a call'}
      <ArrowUpRight size={13} strokeWidth={2} aria-hidden="true" />
    </Link>
  </div>
);
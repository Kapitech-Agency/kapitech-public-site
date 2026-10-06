import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { InsightLanguage } from '../data/insightTypes';

export const InsightBookACall: React.FC<{ language: InsightLanguage }> = ({ language }) => (
  <aside className="rounded-2xl border border-white/[0.07] bg-white/[0.014] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.018)]">
    <span className="kapi-section-label">
      {language === 'id' ? 'LANGKAH BERIKUTNYA' : 'NEXT STEP'}
    </span>

    <h2 className="mt-5 text-[1.35rem] font-display font-semibold leading-[1.08] tracking-[-0.04em] text-white">
      {language === 'id'
        ? 'Siap mengubah insight ini menjadi keputusan yang bisa dijalankan?'
        : 'Ready to turn this insight into a decision you can act on?'}
    </h2>

    <p className="mt-3 text-xs font-light leading-[1.75] text-[#8A909D]">
      {language === 'id'
        ? 'Ceritakan konteks produk, UX, atau engineering Anda. Kami bantu menentukan starting point yang masuk akal.'
        : 'Share the product, UX, or engineering context. We will help you find the most sensible starting point.'}
    </p>

    <Link
      to="/contact"
      className="group mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-red px-5 text-[10px] font-semibold uppercase tracking-[0.13em] text-white shadow-lg shadow-brand-red/20 transition-[background-color,transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:bg-[#FF1E27] hover:shadow-xl hover:shadow-brand-red/20 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60"
    >
      <span>{language === 'id' ? 'Mulai diskusi' : 'Start a discussion'}</span>
      <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
    </Link>
  </aside>
);
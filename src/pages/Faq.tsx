import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { faqItems } from '../data/faqData';
import { useLanguage } from '../lib/LanguageContext';

export const Faq = () => {
  const { language } = useLanguage();
  const [open, setOpen] = useState(0);
  const categories = Array.from(new Set(faqItems.map((item) => item.category)));
  return <main className="min-h-screen bg-[#0B0C0E] px-5 pb-24 pt-32 text-white sm:px-8 lg:px-12"><div className="mx-auto max-w-5xl"><p className="text-[10px] font-mono uppercase tracking-[0.16em] text-brand-red">FAQ</p><h1 className="mt-4 text-4xl font-display font-semibold leading-[0.98] tracking-[-0.055em] sm:text-6xl">{language === 'id' ? 'Jawaban sebelum Anda memulai proyek.' : 'Answers before you start a project.'}</h1><p className="mt-6 max-w-3xl text-base leading-8 text-[#8E96A2] sm:text-lg">{language === 'id' ? 'Pahami cara kerja, proses, commercial expectations, security, careers, dan jalur untuk memulai percakapan dengan Kapitech.' : 'Understand working models, process, commercial expectations, security, careers, and the path to start a conversation with Kapitech.'}</p><div className="mt-12 space-y-10">{categories.map((category) => <section key={category}><h2 className="text-2xl font-display font-semibold tracking-[-0.035em] sm:text-3xl">{category}</h2><div className="mt-4 overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.018]">{faqItems.filter((item) => item.category === category).map((item) => { const index = faqItems.indexOf(item); const isOpen = open === index; return <div key={item.question} className="border-b border-white/[0.07] last:border-b-0"><button type="button" onClick={() => setOpen(isOpen ? -1 : index)} className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"><span className="text-sm font-semibold leading-6 text-white sm:text-base">{item.question}</span><ChevronDown size={17} className={'shrink-0 text-[#707986] transition-transform ' + (isOpen ? 'rotate-180' : '')}/></button>{isOpen ? <div className="px-5 pb-5 text-sm leading-7 text-[#8E96A2]">{item.answer}</div> : null}</div>; })}</div></section>)}</div></div></main>;
};

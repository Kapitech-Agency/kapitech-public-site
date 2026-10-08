import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Download } from 'lucide-react';
import { resources } from '../data/resourcesData';
import { useLanguage } from '../lib/LanguageContext';

export const Resources = () => {
  const { language } = useLanguage();
  return <main className="min-h-screen bg-[#0B0C0E] px-5 pb-24 pt-32 text-white sm:px-8 lg:px-12"><div className="mx-auto max-w-7xl"><p className="text-[10px] font-mono uppercase tracking-[0.16em] text-brand-red">Resources</p><h1 className="mt-4 max-w-5xl text-4xl font-display font-semibold leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-[5.25rem]">{language === 'id' ? 'Resource praktis sebelum Anda memulai proyek digital.' : 'Practical resources for better digital project decisions.'}</h1><p className="mt-6 max-w-3xl text-base leading-8 text-[#8E96A2] sm:text-lg">{language === 'id' ? 'Checklist, template, dan guide yang bisa langsung digunakan oleh founder, product team, marketing team, dan buyer teknologi.' : 'Checklists, templates, and guides for founders, product teams, marketing teams, and technology buyers.'}</p><div className="mt-12 grid gap-5 lg:grid-cols-2">{resources.map((resource) => <Link key={resource.slug} to={'/resources/' + resource.slug} className="group rounded-3xl border border-white/[0.08] bg-white/[0.018] p-6 sm:p-7"><div className="flex items-center justify-between"><span className="rounded-full border border-white/[0.08] px-3 py-1.5 text-[9px] font-mono uppercase tracking-[0.12em] text-brand-red">{resource.type}</span><ArrowUpRight size={15} className="text-[#5E6672] group-hover:text-white"/></div><h2 className="mt-6 text-3xl font-display font-semibold tracking-[-0.04em]">{resource.title}</h2><p className="mt-3 text-sm leading-7 text-[#7F8793]">{resource.summary}</p><div className="mt-7 inline-flex items-center gap-2 text-xs font-semibold text-white"><Download size={14}/> Open resource</div></Link>)}</div></div></main>;
};

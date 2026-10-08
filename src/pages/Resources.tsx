import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Download } from 'lucide-react';
import { resources } from '../data/resourcesData';
import { useLanguage } from '../lib/LanguageContext';
import PublicPageHero from '../components/ui/PublicPageHero';

export const Resources = () => {
  const { language } = useLanguage();
  return (
    <main className="kapi-page-bg min-h-screen bg-[#0B0C0E] text-white">
      <PublicPageHero
        eyebrow="Resources"
        title={language === 'id' ? 'Resource praktis sebelum Anda memulai proyek digital.' : 'Practical resources for better digital project decisions.'}
        description={language === 'id' ? 'Checklist, template, dan guide yang bisa langsung digunakan oleh founder, product team, marketing team, dan buyer teknologi.' : 'Checklists, templates, and guides for founders, product teams, marketing teams, and technology buyers.'}
      />
      <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 md:px-12">
        <div className="mt-12 grid gap-5 lg:grid-cols-2">{resources.map((resource) => <Link key={resource.slug} to={'/resources/' + resource.slug} className="group rounded-3xl border border-white/[0.08] bg-white/[0.018] p-6 sm:p-7 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0C0E]"><div className="flex items-center justify-between"><span className="rounded-full border border-white/[0.08] px-3 py-1.5 text-[9px] font-mono uppercase tracking-[0.12em] text-brand-red">{language === 'id' ? resource.typeId : resource.type}</span><ArrowUpRight size={15} className="text-[#5E6672] group-hover:text-white"/></div><h2 className="mt-6 text-3xl font-display font-semibold tracking-[-0.04em]">{language === 'id' ? resource.titleId : resource.title}</h2><p className="mt-3 text-sm leading-7 text-[#7F8793]">{language === 'id' ? resource.summaryId : resource.summary}</p><div className="mt-7 inline-flex items-center gap-2 text-xs font-semibold text-white"><Download size={14}/> {language === 'id' ? 'Buka resource' : 'Open resource'}</div></Link>)}</div>
      </div>
    </main>
  );
};

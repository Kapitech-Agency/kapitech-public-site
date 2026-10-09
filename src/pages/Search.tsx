import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Fuse from 'fuse.js';
import { ArrowUpRight, Search as SearchIcon } from 'lucide-react';
import { api } from '../lib/apiClient';
import { fetchServerCmsProjects, fetchServerCmsServices, getCmsProjects, getCmsServices } from '../lib/cmsStore';
import { allProjects } from '../data/projectsData';
import { allSolutionsAndServices } from '../data/servicesData';
import { projectSlug } from '../lib/publicContent';
import { useLanguage } from '../lib/LanguageContext';
import PublicPageHero from '../components/ui/PublicPageHero';

type SearchItem = { type: 'Service' | 'Case Study' | 'Insight'; title: string; description: string; href: string; keywords: string[] };

export const Search = () => {
  const { language } = useLanguage();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get('q') || '');
  const [insights, setInsights] = useState<SearchItem[]>([]);

  useEffect(() => {
    setQuery(params.get('q') || '');
  }, [params]);
  const [contentReady, setContentReady] = useState(false);

  useEffect(() => { void Promise.all([fetchServerCmsProjects(), fetchServerCmsServices(), api.cms.getInsights({ page: 1, pageSize: 100 })]).then(([, , insightResponse]) => { if (insightResponse.success && Array.isArray(insightResponse.data?.insights)) { setInsights(insightResponse.data.insights.map((item) => ({ type: 'Insight', title: item.title, description: item.excerpt || '', href: '/insights/' + item.slug, keywords: [...(item.tags || []).map((tag) => tag.name), item.category?.displayName || '', item.title] }))); } }).finally(() => setContentReady(true)); }, []);

  const items = useMemo<SearchItem[]>(() => {
    const projects = getCmsProjects().length ? getCmsProjects() : allProjects;
    const services = getCmsServices().length ? getCmsServices() : allSolutionsAndServices;
    return [
      ...services.map((item) => ({ type: 'Service', title: item.title, description: item.heroSubtitle || item.description || '', href: '/services/' + item.slug, keywords: [item.category, item.title] })),
      ...projects.map((item) => ({ type: 'Case Study', title: item.title, description: item.desc || '', href: '/work/' + projectSlug(item), keywords: [item.client, item.industry, item.service, item.title] })),
      ...insights
    ];
  }, [insights, contentReady]);

  const fuse = useMemo(() => new Fuse(items, { keys: [{ name: 'title', weight: 0.5 }, { name: 'description', weight: 0.25 }, { name: 'keywords', weight: 0.25 }], threshold: 0.34 }), [items]);
  const results = query.trim() ? fuse.search(query.trim()).map((entry) => entry.item) : items.slice(0, 18);
  const submit = (event: React.FormEvent) => { event.preventDefault(); const value = query.trim(); setParams(value ? { q: value } : {}); };

  return (
    <div className="kapi-page-bg min-h-screen bg-[#0B0C0E] text-white">
      <PublicPageHero
        eyebrow="Search"
        title={language === 'id' ? 'Cari di seluruh website.' : 'Search across the website.'}
        description={language === 'id' ? 'Temukan layanan, studi kasus, dan insight dari satu pencarian.' : 'Find services, case studies, and insights from one search.'}
      />
      <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 md:px-12">
        <form onSubmit={submit} className="mt-8 flex max-w-3xl gap-2"><label className="flex min-h-12 flex-1 items-center gap-3 rounded-full border border-white/[0.09] bg-white/[0.02] px-4"><SearchIcon size={17} className="text-[#69717D]"/><input value={query} onChange={(event) => setQuery(event.target.value)} autoComplete="off" enterKeyHint="search" placeholder={language === 'id' ? 'Cari layanan, case study, insight...' : 'Search services, case studies, insights...'} className="w-full bg-transparent text-sm text-white outline-none placeholder:text-[#5F6773]" aria-label={language === 'id' ? 'Pencarian global' : 'Global search'}/></label><button type="submit" className="min-h-12 rounded-full bg-brand-red px-5 text-xs font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0C0E]">{language === 'id' ? 'Cari' : 'Search'}</button></form><div className="mt-10 grid gap-3 md:grid-cols-2 xl:grid-cols-3">{results.map((item) => <Link key={item.href} to={item.href} className="group rounded-3xl border border-white/[0.08] bg-white/[0.018] p-5 hover:border-white/[0.14] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0C0E]"><div className="flex items-center justify-between gap-3"><span className="text-[9px] font-mono uppercase tracking-[0.12em] text-brand-red">{language === 'id' ? ({ Service: 'Layanan', 'Case Study': 'Case Study', Insight: 'Insight' } as const)[item.type] : item.type}</span><ArrowUpRight size={14} className="text-[#59616D] group-hover:text-white"/></div><h2 className="mt-3 text-xl font-display font-semibold tracking-[-0.03em] text-white">{item.title}</h2><p className="mt-2 line-clamp-3 text-sm leading-6 text-[#7E8692]">{item.description}</p></Link>)}</div>{query.trim() && results.length === 0 ? <div className="mt-10 rounded-3xl border border-white/[0.08] bg-white/[0.018] p-6 sm:p-8"><p className="text-sm text-[#9AA1AC]">{language === 'id' ? 'Tidak ada hasil yang cocok dengan pencarian Anda.' : 'No matching results for your search.'}</p><button type="button" onClick={() => { setQuery(''); setParams({}); }} className="mt-4 inline-flex min-h-10 items-center rounded-full border border-white/[0.1] px-4 py-2 text-xs font-semibold text-white transition-colors hover:border-brand-red/40 hover:text-brand-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70">{language === 'id' ? 'Reset pencarian' : 'Reset search'}</button></div> : null}</div>
    </div>
  );
};

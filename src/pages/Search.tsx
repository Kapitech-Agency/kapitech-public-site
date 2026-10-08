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

type SearchItem = { type: string; title: string; description: string; href: string; keywords: string[] };

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

  return <main className="min-h-screen bg-[#0B0C0E] px-5 pb-24 pt-32 text-white sm:px-8 lg:px-12"><div className="mx-auto max-w-7xl"><p className="text-[10px] font-mono uppercase tracking-[0.16em] text-brand-red">Search</p><h1 className="mt-4 text-4xl font-display font-semibold tracking-[-0.055em] sm:text-6xl">{language === 'id' ? 'Cari di seluruh website.' : 'Search across the website.'}</h1><form onSubmit={submit} className="mt-8 flex max-w-3xl gap-2"><label className="flex min-h-12 flex-1 items-center gap-3 rounded-full border border-white/[0.09] bg-white/[0.02] px-4"><SearchIcon size={17} className="text-[#69717D]"/><input value={query} onChange={(event) => setQuery(event.target.value)} autoComplete="off" enterKeyHint="search" placeholder={language === 'id' ? 'Cari layanan, case study, insight...' : 'Search services, case studies, insights...'} className="w-full bg-transparent text-sm text-white outline-none placeholder:text-[#5F6773]" aria-label="Global search"/></label><button type="submit" className="min-h-12 rounded-full bg-brand-red px-5 text-xs font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0C0E]">Search</button></form><div className="mt-10 grid gap-3 md:grid-cols-2 xl:grid-cols-3">{results.map((item) => <Link key={item.href} to={item.href} className="group rounded-3xl border border-white/[0.08] bg-white/[0.018] p-5 hover:border-white/[0.14]"><div className="flex items-center justify-between gap-3"><span className="text-[9px] font-mono uppercase tracking-[0.12em] text-brand-red">{item.type}</span><ArrowUpRight size={14} className="text-[#59616D] group-hover:text-white"/></div><h2 className="mt-3 text-xl font-display font-semibold tracking-[-0.03em] text-white">{item.title}</h2><p className="mt-2 line-clamp-3 text-sm leading-6 text-[#7E8692]">{item.description}</p></Link>)}</div>{query.trim() && results.length === 0 ? <p className="mt-10 text-sm text-[#7D8591]">No matching results.</p> : null}</div></main>;
};

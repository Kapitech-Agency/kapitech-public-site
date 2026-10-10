import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Fuse from 'fuse.js';
import {
  ArrowRight,
  ArrowUpRight,
  BookOpenText,
  BriefcaseBusiness,
  Layers3,
  Search as SearchIcon,
  X,
} from 'lucide-react';
import { api } from '../lib/apiClient';
import { fetchServerCmsProjects, fetchServerCmsServices, getCmsProjects, getCmsServices } from '../lib/cmsStore';
import { allProjects } from '../data/projectsData';
import { allSolutionsAndServices } from '../data/servicesData';
import { projectSlug } from '../lib/publicContent';
import { useLanguage } from '../lib/LanguageContext';
import PublicPageHero from '../components/ui/PublicPageHero';

type SearchItem = {
  type: 'Service' | 'Case Study' | 'Insight';
  title: string;
  description: string;
  href: string;
  keywords: string[];
};
type SearchFilter = 'All' | SearchItem['type'];

const CONTENT_TYPES: SearchItem['type'][] = ['Service', 'Case Study', 'Insight'];

export const Search = () => {
  const { language } = useLanguage();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get('q') || '');
  const [insights, setInsights] = useState<SearchItem[]>([]);
  const [contentReady, setContentReady] = useState(false);
  const [activeType, setActiveType] = useState<SearchFilter>('All');

  useEffect(() => {
    const urlQuery = params.get('q') || '';
    setQuery((current) => current === urlQuery ? current : urlQuery);
  }, [params]);

  // Keep the shareable URL in sync without navigating on every keystroke.
  useEffect(() => {
    const value = query.trim();
    const currentValue = params.get('q') || '';
    if (value === currentValue) return;

    const timeoutId = window.setTimeout(() => {
      setParams(value ? { q: value } : {}, { replace: true });
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [query, params, setParams]);

  useEffect(() => {
    let cancelled = false;

    const loadSearchContent = async () => {
      try {
        const responses = await Promise.allSettled([
          fetchServerCmsProjects(),
          fetchServerCmsServices(),
          api.cms.getInsights({ page: 1, pageSize: 100 }),
        ]);

        if (cancelled) return;

        const insightResponse = responses[2];
        if (
          insightResponse.status === 'fulfilled'
          && insightResponse.value.success
          && Array.isArray(insightResponse.value.data?.insights)
        ) {
          setInsights(insightResponse.value.data.insights.map((item) => ({
            type: 'Insight',
            title: item.title,
            description: item.excerpt || '',
            href: '/insights/' + item.slug,
            keywords: [
              ...(item.tags || []).map((tag) => tag.name),
              item.category?.displayName || '',
              item.title,
            ],
          })));
        }
      } finally {
        if (!cancelled) setContentReady(true);
      }
    };

    void loadSearchContent();

    return () => {
      cancelled = true;
    };
  }, []);

  const items = useMemo<SearchItem[]>(() => {
    const cmsProjects = getCmsProjects();
    const cmsServices = getCmsServices();
    const projects = cmsProjects.length ? cmsProjects : allProjects;
    const services = cmsServices.length ? cmsServices : allSolutionsAndServices;

    return [
      ...services.map((item) => ({
        type: 'Service' as const,
        title: item.title,
        description: item.heroSubtitle || item.description || '',
        href: '/services/' + item.slug,
        keywords: [item.category, item.title],
      })),
      ...projects.map((item) => ({
        type: 'Case Study' as const,
        title: item.title,
        description: item.desc || '',
        href: '/work/' + projectSlug(item),
        keywords: [item.client, item.industry, item.service, item.title],
      })),
      ...insights,
    ];
  }, [insights, contentReady]);

  const fuse = useMemo(
    () => new Fuse(items, {
      keys: [
        { name: 'title', weight: 0.5 },
        { name: 'description', weight: 0.25 },
        { name: 'keywords', weight: 0.25 },
      ],
      threshold: 0.34,
      ignoreLocation: true,
      minMatchCharLength: 2,
    }),
    [items],
  );

  const searchTerm = query.trim();
  const queryMatches = useMemo(
    () => searchTerm ? fuse.search(searchTerm).map((entry) => entry.item) : items,
    [fuse, items, searchTerm],
  );
  const filteredMatches = useMemo(
    () => activeType === 'All' ? queryMatches : queryMatches.filter((item) => item.type === activeType),
    [activeType, queryMatches],
  );
  const results = useMemo(() => {
    if (searchTerm) return filteredMatches;
    if (activeType !== 'All') return filteredMatches.slice(0, 6);

    // Show a balanced starting point instead of letting one content type dominate the page.
    return CONTENT_TYPES.flatMap((type) => queryMatches.filter((item) => item.type === type).slice(0, 2));
  }, [activeType, filteredMatches, queryMatches, searchTerm]);

  const filterOptions: { value: SearchFilter; label: string; count: number }[] = [
    {
      value: 'All',
      label: language === 'id' ? 'Semua' : 'All content',
      count: queryMatches.length,
    },
    ...CONTENT_TYPES.map((type) => ({
      value: type,
      label: type === 'Service'
        ? (language === 'id' ? 'Layanan' : 'Services')
        : type === 'Case Study'
          ? (language === 'id' ? 'Studi kasus' : 'Case studies')
          : 'Insights',
      count: queryMatches.filter((item) => item.type === type).length,
    })),
  ];

  const activeTypeLabel = filterOptions.find((option) => option.value === activeType)?.label || '';
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const value = query.trim();
    setParams(value ? { q: value } : {});
  };

  const clearSearch = () => {
    setQuery('');
    setParams({});
    setActiveType('All');
  };

  const renderTypeIcon = (type: SearchItem['type']) => {
    if (type === 'Service') return <Layers3 size={14} aria-hidden="true" />;
    if (type === 'Case Study') return <BriefcaseBusiness size={14} aria-hidden="true" />;
    return <BookOpenText size={14} aria-hidden="true" />;
  };

  const typeLabel = (type: SearchItem['type']) => {
    if (type === 'Service') return language === 'id' ? 'Layanan' : 'Service';
    if (type === 'Case Study') return language === 'id' ? 'Studi kasus' : 'Case study';
    return 'Insight';
  };

  return (
    <div className="kapi-page-bg min-h-screen bg-[#0B0C0E] text-white">
      <PublicPageHero
        eyebrow={language === 'id' ? 'Pencarian Website' : 'Website Search'}
        title={language === 'id' ? 'Temukan yang Anda cari.' : 'Find what you’re looking for.'}
        description={language === 'id'
          ? 'Cari layanan, studi kasus, dan insight Kapitech dari satu tempat.'
          : 'Search Kapitech services, case studies, and insights in one place.'}
      >
        <form onSubmit={submit} role="search" className="w-full max-w-3xl">
          <div className="group flex min-h-[64px] w-full min-w-0 items-center gap-3.5 rounded-2xl border border-white/[0.11] bg-[#111216]/90 px-4 transition-[border-color,background-color,box-shadow] duration-200 hover:border-white/[0.16] focus-within:border-white/[0.24] focus-within:bg-[#121318] focus-within:shadow-[0_0_0_3px_rgba(255,255,255,0.025)] sm:gap-4 sm:px-5">
            <SearchIcon
              size={19}
              aria-hidden="true"
              className="shrink-0 text-[#8A909D] transition-colors duration-200 group-focus-within:text-white"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              autoComplete="off"
              enterKeyHint="search"
              spellCheck={false}
              placeholder={language === 'id'
                ? 'Cari layanan, studi kasus, atau insight...'
                : 'Search services, case studies, or insights...'}
              className="kapi-global-search-input block h-12 min-w-0 flex-1 appearance-none border-0 bg-transparent px-0 py-0 text-sm font-normal leading-6 text-white outline-none ring-0 placeholder:text-[#737B87] focus:border-0 focus:outline-none focus:ring-0 sm:text-base [&::-webkit-search-cancel-button]:hidden"
              aria-label={language === 'id' ? 'Cari di website Kapitech' : 'Search the Kapitech website'}
            />
            {query ? (
              <button
                type="button"
                onClick={clearSearch}
                aria-label={language === 'id' ? 'Hapus pencarian' : 'Clear search'}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#8A909D] transition-colors duration-200 hover:bg-white/[0.07] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70"
              >
                <X size={16} aria-hidden="true" />
              </button>
            ) : null}
          </div>
          <p className="mt-3 px-1 text-[11px] leading-relaxed text-[#858D99]">
            {language === 'id'
              ? 'Hasil diperbarui otomatis saat Anda mengetik.'
              : 'Results update automatically as you type.'}
          </p>
        </form>
      </PublicPageHero>

      <section className="relative border-b border-white/[0.07] px-4 py-12 sm:px-6 sm:py-16 md:px-12" aria-labelledby="search-results-heading">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <span className="kapi-section-label">
                {searchTerm ? (language === 'id' ? 'Hasil Pencarian' : 'Search Results') : (language === 'id' ? 'Jelajahi Website' : 'Explore the Website')}
              </span>
              <h2 id="search-results-heading" className="mt-3 text-2xl font-display font-semibold leading-tight tracking-[-0.04em] text-white sm:text-3xl">
                {searchTerm
                  ? (language === 'id' ? <>Hasil untuk <span className="text-brand-red">“{searchTerm}”</span></> : <>Results for <span className="text-brand-red">“{searchTerm}”</span></>)
                  : activeType === 'All'
                    ? (language === 'id' ? 'Mulai dari sini' : 'A good place to start')
                    : (language === 'id' ? 'Jelajahi' : 'Explore') + ' ' + activeTypeLabel}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#8A909D]">
                {searchTerm
                  ? (language === 'id'
                    ? 'Pilih hasil yang paling relevan, atau gunakan filter untuk mempersempit pencarian.'
                    : 'Choose the most relevant result, or use the filters to narrow your search.')
                  : (language === 'id'
                    ? 'Pilih kategori untuk menelusuri konten, atau masukkan kata kunci di kolom pencarian.'
                    : 'Choose a category to browse, or enter a keyword in the search field above.')}
              </p>
            </div>
            <p aria-live="polite" className="shrink-0 text-xs font-medium text-[#A7ACB5]">
              {searchTerm
                ? `${filteredMatches.length} ${language === 'id' ? 'hasil' : 'results'}`
                : activeType === 'All'
                  ? (language === 'id' ? 'Pilihan dari berbagai kategori' : 'A mix of content types')
                  : `${Math.min(filteredMatches.length, 6)} / ${filteredMatches.length} ${language === 'id' ? 'ditampilkan' : 'shown'}`}
            </p>
          </div>

          <div className="mt-7 flex gap-2 overflow-x-auto pb-2" role="group" aria-label={language === 'id' ? 'Filter tipe konten' : 'Filter by content type'}>
            {filterOptions.map((option) => {
              const selected = activeType === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setActiveType(option.value)}
                  aria-pressed={selected}
                  className={`inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-xs font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0C0E] ${selected
                    ? 'border-white/[0.22] bg-white/[0.085] text-white'
                    : 'border-white/[0.08] bg-white/[0.015] text-[#9AA1AC] hover:border-white/[0.15] hover:bg-white/[0.04] hover:text-white'}`}
                >
                  <span>{option.label}</span>
                  <span className={`rounded-full px-1.5 py-0.5 text-[10px] tabular-nums ${selected ? 'bg-white/[0.1] text-white' : 'bg-white/[0.04] text-[#8A909D]'}`}>
                    {option.count}
                  </span>
                </button>
              );
            })}
          </div>

          {results.length > 0 ? (
            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="group flex min-h-[230px] min-w-0 flex-col rounded-2xl border border-white/[0.08] bg-white/[0.018] p-5 transition-[border-color,background-color,transform] duration-200 hover:-translate-y-0.5 hover:border-white/[0.16] hover:bg-white/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0C0E] sm:p-6"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex min-w-0 items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.025] px-2.5 py-1.5 text-[10px] font-medium text-[#B3B9C3]">
                      {renderTypeIcon(item.type)}
                      <span>{typeLabel(item.type)}</span>
                    </span>
                    <ArrowUpRight size={15} aria-hidden="true" className="shrink-0 text-[#69717D] transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
                  </div>
                  <h3 className="mt-5 text-lg font-display font-semibold leading-snug tracking-[-0.025em] text-white sm:text-xl">
                    {item.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#9299A5]">
                    {item.description || (language === 'id' ? 'Lihat detail dan informasi selengkapnya.' : 'Open this result to see more details.')}
                  </p>
                  <span className="mt-auto inline-flex items-center gap-2 pt-6 text-xs font-semibold text-[#B8BEC7] transition-colors group-hover:text-white">
                    {language === 'id' ? 'Lihat detail' : 'View details'}
                    <ArrowRight size={14} aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
          ) : !contentReady ? (
            <div className="mt-6 rounded-2xl border border-white/[0.08] bg-white/[0.018] px-5 py-8 sm:px-7">
              <p className="text-sm text-[#A7ACB5]" aria-live="polite">
                {language === 'id' ? 'Memuat seluruh konten yang dapat dicari...' : 'Loading searchable content...'}
              </p>
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-white/[0.08] bg-white/[0.018] px-5 py-9 sm:px-7 sm:py-10">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.025] text-[#9AA1AC]">
                <SearchIcon size={18} aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-lg font-display font-semibold text-white">
                {queryMatches.length > 0
                  ? (language === 'id' ? 'Tidak ada hasil di kategori ini' : 'No results in this category')
                  : (language === 'id' ? 'Belum ada hasil yang cocok' : 'No matching results yet')}
              </h3>
              <p className="mt-2 max-w-xl text-sm leading-6 text-[#8A909D]">
                {queryMatches.length > 0
                  ? (language === 'id' ? 'Pilih filter “Semua” untuk melihat hasil di kategori lain.' : 'Choose “All content” to see matches in other categories.')
                  : (language === 'id'
                    ? 'Coba kata kunci yang lebih umum atau periksa ejaan Anda.'
                    : 'Try a broader keyword or check the spelling.')}
              </p>
              <button
                type="button"
                onClick={clearSearch}
                className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-full border border-white/[0.12] px-4 text-xs font-semibold text-white transition-colors hover:border-white/[0.22] hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70"
              >
                <X size={14} aria-hidden="true" />
                {language === 'id' ? 'Hapus pencarian & filter' : 'Clear search & filters'}
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Search;

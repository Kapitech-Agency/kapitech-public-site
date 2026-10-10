import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Fuse from 'fuse.js';
import { ArrowRight, ArrowUpRight, BookOpen, Briefcase, Building2, FileText, Layers, Search as SearchIcon, X, type LucideIcon } from 'lucide-react';
import { api } from '../lib/apiClient';
import {
  CMS_EVENT_KEY,
  fetchServerCmsProjects,
  fetchServerCmsServices,
  getCmsProjects,
  getCmsServices,
} from '../lib/cmsStore';
import { allProjects } from '../data/projectsData';
import { allSolutionsAndServices } from '../data/servicesData';
import { projectSlug } from '../lib/publicContent';
import { getAllInsightFallbacks } from '../data/insightFallbacks';
import type { InsightItem } from '../data/insightTypes';
import { industryCatalog } from '../data/industryCatalog';
import { useLanguage } from '../lib/LanguageContext';
import PublicPageHero from '../components/ui/PublicPageHero';

type SearchItemType = 'Page' | 'Service' | 'Case Study' | 'Insight' | 'Industry';
type SearchFilter = 'All' | SearchItemType;

const SEARCH_FILTERS: SearchFilter[] = ['All', 'Service', 'Case Study', 'Insight', 'Industry', 'Page'];
const SEARCH_TYPE_ICONS: Record<SearchItemType, LucideIcon> = {
  Page: FileText,
  Service: Layers,
  'Case Study': Briefcase,
  Insight: BookOpen,
  Industry: Building2,
};

function getFilterLabel(filter: SearchFilter, language: 'id' | 'en'): string {
  if (filter === 'All') return language === 'id' ? 'Semua' : 'All';
  return getTypeLabel(filter, language);
}

function getSuggestedResults(items: SearchItem[]): SearchItem[] {
  const order: SearchItemType[] = ['Service', 'Case Study', 'Insight', 'Industry', 'Page'];
  const groups = new Map<SearchItemType, SearchItem[]>();
  order.forEach((type) => groups.set(type, items.filter((item) => item.type === type)));
  const suggested: SearchItem[] = [];
  for (let index = 0; index < 3; index += 1) {
    order.forEach((type) => {
      const item = groups.get(type)?.[index];
      if (item) suggested.push(item);
    });
  }
  return suggested;
}

type SearchItem = {
  type: SearchItemType;
  title: string;
  description: string;
  href: string;
  keywords: string[];
};

type SitePage = {
  title: string;
  titleId: string;
  description: string;
  descriptionId: string;
  href: string;
  keywords: string[];
};

const SITE_PAGES: SitePage[] = [
  {
    title: 'Home',
    titleId: 'Beranda',
    description: 'Explore Kapitech digital product design, development, and brand capabilities.',
    descriptionId: 'Jelajahi layanan desain produk digital, pengembangan, dan branding Kapitech.',
    href: '/',
    keywords: ['homepage', 'main page', 'beranda', 'halaman utama', 'Kapitech Agency'],
  },
  {
    title: 'Services & Solutions',
    titleId: 'Layanan & Solusi',
    description: 'Explore strategic solutions and specialized services across branding, design, and development.',
    descriptionId: 'Jelajahi solusi strategis dan layanan branding, desain, serta pengembangan.',
    href: '/services',
    keywords: ['services', 'solutions', 'branding', 'design', 'development', 'layanan', 'solusi', 'jasa'],
  },
  {
    title: 'Work & Case Studies',
    titleId: 'Portofolio & Studi Kasus',
    description: 'Browse Kapitech project work, case studies, clients, industries, and delivery outcomes.',
    descriptionId: 'Lihat portofolio, studi kasus, klien, industri, dan hasil proyek Kapitech.',
    href: '/work',
    keywords: ['portfolio', 'projects', 'case study', 'case studies', 'client work', 'portofolio', 'proyek', 'klien'],
  },
  {
    title: 'Insights',
    titleId: 'Insight',
    description: 'Read practical guides and editorial articles about digital products, UX, websites, and SEO.',
    descriptionId: 'Baca panduan praktis tentang produk digital, UX, website, dan SEO.',
    href: '/insights',
    keywords: ['articles', 'blog', 'guides', 'editorial', 'artikel', 'panduan', 'wawasan'],
  },
  {
    title: 'About Kapitech',
    titleId: 'Tentang Kapitech',
    description: 'Learn about Kapitech, its company information, working principles, and team.',
    descriptionId: 'Kenali Kapitech, informasi perusahaan, prinsip kerja, dan tim kami.',
    href: '/about',
    keywords: ['about us', 'company profile', 'corporate information', 'tentang kami', 'profil perusahaan', 'informasi perusahaan'],
  },
  {
    title: 'Careers',
    titleId: 'Karier',
    description: 'Explore career opportunities and job openings at Kapitech.',
    descriptionId: 'Jelajahi peluang karier dan lowongan kerja di Kapitech.',
    href: '/careers',
    keywords: ['jobs', 'vacancies', 'recruitment', 'hiring', 'career opportunities', 'lowongan', 'rekrutmen', 'pekerjaan'],
  },
  {
    title: 'Contact Kapitech',
    titleId: 'Hubungi Kapitech',
    description: 'Send a project inquiry or contact the Kapitech team.',
    descriptionId: 'Kirim kebutuhan proyek atau hubungi tim Kapitech.',
    href: '/contact',
    keywords: ['contact', 'project inquiry', 'consultation', 'email', 'whatsapp', 'kontak', 'hubungi', 'konsultasi'],
  },
  {
    title: 'Frequently Asked Questions',
    titleId: 'Pertanyaan Umum',
    description: 'Find answers to common questions about Kapitech services and project delivery.',
    descriptionId: 'Temukan jawaban atas pertanyaan seputar layanan dan proses kerja Kapitech.',
    href: '/faq',
    keywords: ['FAQ', 'questions', 'answers', 'help', 'pertanyaan', 'jawaban', 'bantuan'],
  },
  {
    title: 'Privacy Policy',
    titleId: 'Kebijakan Privasi',
    description: 'Read how Kapitech handles personal information and privacy.',
    descriptionId: 'Pelajari cara Kapitech menangani informasi pribadi dan privasi.',
    href: '/privacy',
    keywords: ['privacy', 'personal data', 'data protection', 'privasi', 'data pribadi', 'perlindungan data'],
  },
  {
    title: 'Terms of Service',
    titleId: 'Ketentuan Layanan',
    description: 'Review the terms that govern use of the Kapitech website and services.',
    descriptionId: 'Baca ketentuan penggunaan website dan layanan Kapitech.',
    href: '/terms',
    keywords: ['terms', 'conditions', 'terms and conditions', 'legal', 'syarat', 'ketentuan', 'hukum'],
  },
  {
    title: 'Cookie Policy',
    titleId: 'Kebijakan Cookie',
    description: 'Learn how cookies and similar technologies are used on the website.',
    descriptionId: 'Pelajari penggunaan cookie dan teknologi serupa di website.',
    href: '/cookie-policy',
    keywords: ['cookies', 'tracking', 'consent', 'cookie', 'pelacakan', 'persetujuan'],
  },
  {
    title: 'Editorial Policy',
    titleId: 'Kebijakan Editorial',
    description: 'Review Kapitech standards for editorial quality, factual accuracy, and corrections.',
    descriptionId: 'Pelajari standar editorial Kapitech untuk kualitas, akurasi fakta, dan koreksi.',
    href: '/editorial-policy',
    keywords: ['editorial', 'publishing', 'accuracy', 'content standards', 'publikasi', 'akurasi', 'konten'],
  },
  {
    title: 'AI Instructions & Ethics',
    titleId: 'Instruksi & Etika AI',
    description: 'Read Kapitech principles for responsible AI use, privacy, and technical review.',
    descriptionId: 'Baca prinsip Kapitech tentang penggunaan AI yang bertanggung jawab, privasi, dan peninjauan teknis.',
    href: '/ai-instructions',
    keywords: ['AI', 'artificial intelligence', 'ethics', 'governance', 'kecerdasan buatan', 'etika', 'tata kelola'],
  },
];

const asKeywords = (...values: Array<string | null | undefined | string[]>): string[] =>
  values
    .flatMap((value) => Array.isArray(value) ? value : value ? [value] : [])
    .map((value) => value.trim())
    .filter(Boolean);

function toInsightSearchItem(item: InsightItem): SearchItem {
  const categoryNames = item.category?.name ? Object.values(item.category.name) : [];
  const contentText = Array.isArray(item.content) ? JSON.stringify(item.content) : '';

  return {
    type: 'Insight',
    title: item.title,
    description: item.excerpt || item.seoDescription || '',
    href: '/insights/' + encodeURIComponent(item.slug),
    keywords: asKeywords(
      item.slug,
      item.title,
      item.excerpt,
      item.seoTitle,
      item.seoDescription,
      item.author?.name,
      item.category?.displayName,
      categoryNames,
      (item.tags || []).map((tag) => tag.name),
      item.keyTakeaways || [],
      contentText,
    ),
  };
}

function getInsightFallbackSearchItems(language: 'id' | 'en'): SearchItem[] {
  return getAllInsightFallbacks()
    .filter((item) => item.status === 'published' && item.language === language)
    .map(toInsightSearchItem);
}

function getTypeLabel(type: SearchItemType, language: 'id' | 'en'): string {
  if (language !== 'id') return type;
  const labels: Record<SearchItemType, string> = {
    Page: 'Halaman',
    Service: 'Layanan',
    'Case Study': 'Studi Kasus',
    Insight: 'Insight',
    Industry: 'Industri',
  };
  return labels[type];
}

export const Search = () => {
  const { language } = useLanguage();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get('q') || '');
  const [insights, setInsights] = useState<SearchItem[]>(() => getInsightFallbackSearchItems(language));
  const [cmsRevision, setCmsRevision] = useState(0);
  const [activeFilter, setActiveFilter] = useState<SearchFilter>('All');

  useEffect(() => {
    setQuery(params.get('q') || '');
  }, [params]);

  // Refresh the search index whenever public CMS data hydrates or changes.
  useEffect(() => {
    let cancelled = false;
    const handleCmsUpdate = () => setCmsRevision((revision) => revision + 1);

    window.addEventListener(CMS_EVENT_KEY, handleCmsUpdate);
    void Promise.allSettled([fetchServerCmsProjects(), fetchServerCmsServices()]).finally(() => {
      if (!cancelled) setCmsRevision((revision) => revision + 1);
    });

    return () => {
      cancelled = true;
      window.removeEventListener(CMS_EVENT_KEY, handleCmsUpdate);
    };
  }, []);

  // Keep local published editorial packs searchable while AMS is unavailable or empty.
  // Published CMS articles override matching fallback slugs, and the active language is respected.
  useEffect(() => {
    let cancelled = false;
    const fallbackItems = getInsightFallbackSearchItems(language);
    setInsights(fallbackItems);

    void api.cms.getInsights({ language, page: 1, pageSize: 100 })
      .then((response) => {
        if (cancelled || !response.success) return;

        const rawRemoteItems = response.data?.insights;
        const remoteItems = Array.isArray(rawRemoteItems)
          ? rawRemoteItems.filter((item) =>
              Boolean(item) && item.status === 'published' && item.language === language,
            )
          : [];

        const localRecords = getAllInsightFallbacks().filter(
          (item) => item.status === 'published' && item.language === language,
        );
        const allBySlug = new Map<string, InsightItem>();
        localRecords.forEach((item) => allBySlug.set(item.slug, item));
        remoteItems.forEach((item) => allBySlug.set(item.slug, item));

        if (!cancelled) setInsights(Array.from(allBySlug.values()).map(toInsightSearchItem));
      })
      .catch(() => {
        // The local fallback index remains usable when the API request fails.
      });

    return () => {
      cancelled = true;
    };
  }, [language]);

  const items = useMemo<SearchItem[]>(() => {
    const projects = getCmsProjects().length > 0 ? getCmsProjects() : allProjects;
    const services = getCmsServices().length > 0 ? getCmsServices() : allSolutionsAndServices;

    const serviceItems: SearchItem[] = services
      .filter((item) => item.isPublished !== false)
      .map((item) => ({
        type: 'Service',
        title: item.title,
        description: language === 'id'
          ? item.heroSubtitleId || item.navSubtitleId || item.heroHeadlineId || ''
          : item.heroSubtitle || item.navSubtitle || item.heroHeadline || '',
        href: (item.type === 'solution' || item.category === 'Solutions' ? '/solutions/' : '/services/') + encodeURIComponent(item.slug),
        keywords: asKeywords(
          item.category,
          item.type,
          item.title,
          item.navSubtitle,
          item.navSubtitleId,
          item.heroHeadline,
          item.heroHeadlineId,
          item.heroSubtitle,
          item.heroSubtitleId,
          item.tools || [],
          (item.capabilities || []).flatMap((capability) => [capability.title, capability.titleId, capability.desc, capability.descId]),
          (item.faqs || []).flatMap((faq) => [faq.q, faq.qId, faq.a, faq.aId]),
        ),
      }));

    const projectItems: SearchItem[] = projects
      .filter((item) => item.isPublished !== false)
      .map((item) => ({
        type: 'Case Study',
        title: item.title,
        description: language === 'id' ? item.descId || item.desc || '' : item.desc || item.descId || '',
        href: '/work/' + encodeURIComponent(projectSlug(item)),
        keywords: asKeywords(
          item.title,
          item.client,
          item.industry,
          item.service,
          item.pillar,
          item.desc,
          item.descId,
          item.challenge,
          item.challengeId,
          item.solution,
          item.solutionId,
          item.execution,
          item.executionId,
          item.outcome,
          item.outcomeId,
          item.technologies || [],
          item.deliverables || [],
        ),
      }));

    const industryItems: SearchItem[] = industryCatalog.map((item) => ({
      type: 'Industry',
      title: item.label,
      description: item.description,
      href: '/industries/' + encodeURIComponent(item.slug),
      keywords: asKeywords(
        item.label,
        item.shortLabel,
        item.eyebrow,
        item.title,
        item.description,
        item.keywords,
        item.needs,
        item.capabilities,
        item.solutionTypes.flatMap((solution) => [solution.title, solution.description]),
        item.deliveryFocus,
        item.principles.flatMap((principle) => [principle.title, principle.description]),
        item.faq.flatMap((faq) => [faq.question, faq.answer]),
        item.relatedSlugs,
      ),
    }));

    const pageItems: SearchItem[] = SITE_PAGES.map((page) => ({
      type: 'Page',
      title: language === 'id' ? page.titleId : page.title,
      description: language === 'id' ? page.descriptionId : page.description,
      href: page.href,
      keywords: asKeywords(page.title, page.titleId, page.description, page.descriptionId, page.keywords),
    }));

    return [
      ...serviceItems,
      ...projectItems,
      ...insights,
      ...industryItems,
      ...pageItems,
    ];
  }, [cmsRevision, insights, language]);

  const fuse = useMemo(
    () => new Fuse(items, {
      keys: [
        { name: 'title', weight: 0.48 },
        { name: 'description', weight: 0.22 },
        { name: 'keywords', weight: 0.3 },
      ],
      threshold: 0.34,
      ignoreLocation: true,
      minMatchCharLength: 2,
    }),
    [items],
  );

  const trimmedQuery = query.trim();
  const matchedItems = trimmedQuery
    ? fuse.search(trimmedQuery).map((entry) => entry.item)
    : items;
  const defaultSuggestions = useMemo(() => getSuggestedResults(items), [items]);
  const resultSource = !trimmedQuery && activeFilter === 'All' ? defaultSuggestions : matchedItems;
  const results = activeFilter === 'All'
    ? resultSource
    : resultSource.filter((item) => item.type === activeFilter);
  const filterCounts = SEARCH_FILTERS.reduce<Record<SearchFilter, number>>((counts, filter) => {
    counts[filter] = filter === 'All'
      ? matchedItems.length
      : matchedItems.filter((item) => item.type === filter).length;
    return counts;
  }, { All: 0, Page: 0, Service: 0, 'Case Study': 0, Insight: 0, Industry: 0 });

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const value = query.trim();
    setParams(value ? { q: value } : {});
  };

  return (
    <div className="kapi-page-bg min-h-screen bg-[#0B0C0E] text-white">
      <PublicPageHero
        eyebrow={language === 'id' ? 'Pencarian' : 'Search'}
        title={language === 'id' ? 'Cari di seluruh website.' : 'Search across the website.'}
        description={language === 'id' ? 'Temukan layanan, studi kasus, dan insight dari satu pencarian.' : 'Find services, case studies, and insights from one search.'}
      >
        <form onSubmit={submit} className="mt-8 flex w-full max-w-4xl flex-col gap-3 sm:flex-row sm:items-center">
          <label className="group flex min-h-14 flex-1 items-center gap-3 rounded-full border border-white/[0.1] bg-[#0B0C0E]/65 px-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)] backdrop-blur-xl transition-[border-color,background-color,box-shadow] duration-300 focus-within:border-brand-red/55 focus-within:bg-[#0B0C0E]/80 focus-within:shadow-[0_0_0_3px_rgba(229,9,20,0.08)]">
            <SearchIcon size={18} className="shrink-0 text-[#8A909D] transition-colors group-focus-within:text-white" aria-hidden="true" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              autoComplete="off"
              enterKeyHint="search"
              placeholder={language === 'id' ? 'Cari layanan, studi kasus, insight...' : 'Search services, case studies, insights...'}
              className="min-w-0 w-full bg-transparent py-3 text-sm text-white outline-none placeholder:text-[#737B87]"
              aria-label={language === 'id' ? 'Pencarian global' : 'Global search'}
            />
            {query ? (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setParams({});
                }}
                aria-label={language === 'id' ? 'Hapus kata pencarian' : 'Clear search'}
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#818894] transition-colors hover:bg-white/[0.07] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70"
              >
                <X size={15} aria-hidden="true" />
              </button>
            ) : null}
          </label>
          <button
            type="submit"
            className="inline-flex min-h-14 shrink-0 items-center justify-center gap-2 rounded-full bg-brand-red px-7 text-[10px] font-bold uppercase tracking-[0.14em] text-white shadow-[0_8px_24px_rgba(229,9,20,0.12)] transition-[background-color,box-shadow,transform] duration-300 hover:bg-[#F01825] hover:shadow-[0_10px_28px_rgba(229,9,20,0.2)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0C0E]"
          >
            {language === 'id' ? 'Cari' : 'Search'}
            <ArrowRight size={14} aria-hidden="true" />
          </button>
        </form>
        <p className="mt-4 flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.1em] text-[#7F8794]">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-red" aria-hidden="true" />
          {language === 'id' ? 'Cari berdasarkan layanan, klien, teknologi, atau topik.' : 'Search by service, client, technology, or topic.'}
        </p>
      </PublicPageHero>

      <section className="mx-auto w-full max-w-7xl px-4 pb-24 pt-10 sm:px-6 sm:pt-12 md:px-12" aria-label={language === 'id' ? 'Hasil pencarian' : 'Search results'}>
        <div className="flex flex-col justify-between gap-5 border-b border-white/[0.07] pb-6 md:flex-row md:items-end">
          <div className="min-w-0">
            <span className="kapi-section-label">{trimmedQuery ? (language === 'id' ? 'HASIL PENCARIAN' : 'SEARCH RESULTS') : (language === 'id' ? 'JELAJAHI KAPITECH' : 'EXPLORE KAPITECH')}</span>
            <h2 className="mt-4 font-display text-2xl font-semibold tracking-[-0.045em] text-white sm:text-3xl">
              {trimmedQuery
                ? (language === 'id' ? 'Hasil untuk ' : 'Results for ') + '“' + trimmedQuery + '”'
                : (language === 'id' ? 'Mulai dari sini.' : 'Start here.')}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#818894]">
              {trimmedQuery
                ? (language === 'id' ? 'Persempit hasil berdasarkan jenis konten.' : 'Narrow the results by content type.')
                : (language === 'id' ? 'Jelajahi halaman dan konten pilihan, atau ketik kata kunci untuk menemukan hal yang lebih spesifik.' : 'Browse a few starting points, or enter a keyword to find something specific.')}
            </p>
          </div>
          <p className="shrink-0 text-xs font-mono uppercase tracking-[0.12em] text-[#858D99]" role="status" aria-live="polite">
            <span className="text-white">{results.length}</span>{' '}
            {trimmedQuery
              ? (language === 'id' ? 'hasil ditemukan' : 'results found')
              : (language === 'id' ? 'pilihan ditampilkan' : 'suggested results')}
          </p>
        </div>

        <div className="flex gap-2 overflow-x-auto py-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="group" aria-label={language === 'id' ? 'Filter jenis hasil' : 'Filter result type'}>
          {SEARCH_FILTERS.map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                aria-pressed={isActive}
                className={[
                  'inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-[10px] font-semibold uppercase tracking-[0.1em] transition-[background-color,border-color,color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0C0E]',
                  isActive
                    ? 'border-brand-red bg-brand-red text-white'
                    : 'border-white/[0.09] bg-white/[0.018] text-[#9AA1AC] hover:border-white/[0.18] hover:bg-white/[0.04] hover:text-white',
                ].join(' ')}
              >
                {getFilterLabel(filter, language)}
                <span className={isActive ? 'text-white/75' : 'text-[#626B76]'}>{filterCounts[filter]}</span>
              </button>
            );
          })}
        </div>

        {results.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((item) => {
              const TypeIcon = SEARCH_TYPE_ICONS[item.type];
              return (
                <Link
                  key={item.type + ':' + item.href}
                  to={item.href}
                  className="group relative flex min-h-[218px] flex-col overflow-hidden rounded-2xl border border-white/[0.075] bg-white/[0.014] p-5 transition-[transform,border-color,background-color,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-brand-red/30 hover:bg-white/[0.026] hover:shadow-[0_16px_38px_-30px_rgba(229,9,20,0.32)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0C0E] sm:p-6"
                >
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-red/0 to-transparent transition-colors duration-300 group-hover:via-brand-red/55" aria-hidden="true" />
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex min-w-0 items-center gap-2 text-[9px] font-mono uppercase tracking-[0.13em] text-brand-red">
                      <TypeIcon size={13} className="shrink-0" aria-hidden="true" />
                      <span className="truncate">{getTypeLabel(item.type, language)}</span>
                    </span>
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.025] text-[#858D99] transition-[border-color,background-color,color,transform] duration-300 group-hover:translate-x-0.5 group-hover:border-brand-red/40 group-hover:bg-brand-red group-hover:text-white" aria-hidden="true">
                      <ArrowUpRight size={14} />
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-lg font-semibold leading-[1.12] tracking-[-0.035em] text-white sm:text-xl">
                    {item.title}
                  </h3>
                  <p className="mt-3 line-clamp-3 text-[13px] font-light leading-6 text-[#858D99]">
                    {item.description}
                  </p>
                  <div className="mt-auto flex items-center gap-2 pt-6 text-[9px] font-mono uppercase tracking-[0.13em] text-[#626B76] transition-colors group-hover:text-white">
                    {language === 'id' ? 'Lihat detail' : 'Explore'}
                    <ArrowRight size={12} className="transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.12] px-6 py-14 text-center">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/[0.09] bg-white/[0.025] text-[#7F8794]">
              <SearchIcon size={18} aria-hidden="true" />
            </span>
            <h3 className="mt-5 font-display text-xl font-semibold tracking-[-0.035em] text-white">
              {language === 'id' ? 'Belum ada hasil yang cocok.' : 'No matching results yet.'}
            </h3>
            <p className="mt-2 max-w-md text-sm leading-6 text-[#858D99]">
              {language === 'id'
                ? 'Coba kata kunci yang lebih singkat atau gunakan istilah lain yang berkaitan dengan layanan, industri, atau topik yang Anda cari.'
                : 'Try a shorter phrase or a different term related to the service, industry, or topic you are looking for.'}
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setParams({});
                setActiveFilter('All');
              }}
              className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.02] px-4 text-[10px] font-semibold uppercase tracking-[0.1em] text-white transition-colors hover:border-brand-red/45 hover:bg-brand-red/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70"
            >
              {language === 'id' ? 'Hapus filter' : 'Clear filters'}
              <X size={13} aria-hidden="true" />
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

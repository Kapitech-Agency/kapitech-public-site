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
        eyebrow="Search"
        title={language === 'id' ? 'Cari di seluruh website.' : 'Search across the website.'}
        description={language === 'id' ? 'Temukan layanan, studi kasus, dan insight dari satu pencarian.' : 'Find services, case studies, and insights from one search.'}
      />
      <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 md:px-12">
        <form onSubmit={submit} className="mt-8 flex max-w-3xl gap-2">
          <label className="flex min-h-12 flex-1 items-center gap-3 rounded-full border border-white/[0.09] bg-white/[0.02] px-4">
            <SearchIcon size={17} className="text-[#69717D]" aria-hidden="true" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              autoComplete="off"
              enterKeyHint="search"
              placeholder={language === 'id' ? 'Cari layanan, studi kasus, insight, halaman...' : 'Search services, case studies, insights, pages...'}
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-[#5F6773]"
              aria-label={language === 'id' ? 'Pencarian global' : 'Global search'}
            />
          </label>
          <button
            type="submit"
            className="min-h-12 rounded-full bg-brand-red px-5 text-xs font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0C0E]"
          >
            {language === 'id' ? 'Cari' : 'Search'}
          </button>
        </form>

        <p className="mt-5 text-xs leading-5 text-[#737B87]" role="status" aria-live="polite">
          {trimmedQuery
            ? (language === 'id'
                ? results.length + ' hasil ditemukan untuk “' + trimmedQuery + '”.'
                : results.length + ' results found for “' + trimmedQuery + '”.')
            : (language === 'id'
                ? 'Mulai mengetik untuk mencari layanan, studi kasus, insight, industri, dan halaman website.'
                : 'Start typing to search services, case studies, insights, industries, and site pages.')}
        </p>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {results.map((item) => (
            <Link
              key={item.type + ':' + item.href}
              to={item.href}
              className="group rounded-3xl border border-white/[0.08] bg-white/[0.018] p-5 hover:border-white/[0.14] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0C0E]"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-[9px] font-mono uppercase tracking-[0.12em] text-brand-red">{getTypeLabel(item.type, language)}</span>
                <ArrowUpRight size={14} className="text-[#59616D] group-hover:text-white" aria-hidden="true" />
              </div>
              <h2 className="mt-3 text-xl font-display font-semibold tracking-[-0.03em] text-white">{item.title}</h2>
              <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#7E8692]">{item.description}</p>
            </Link>
          ))}
        </div>

        {trimmedQuery && results.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-white/[0.08] bg-white/[0.018] p-6 sm:p-8">
            <p className="text-sm text-[#9AA1AC]">
              {language === 'id' ? 'Tidak ada hasil yang cocok dengan pencarian Anda.' : 'No matching results for your search.'}
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setParams({});
              }}
              className="mt-4 inline-flex min-h-10 items-center rounded-full border border-white/[0.1] px-4 py-2 text-xs font-semibold text-white transition-colors hover:border-brand-red/40 hover:text-brand-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70"
            >
              {language === 'id' ? 'Reset pencarian' : 'Reset search'}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

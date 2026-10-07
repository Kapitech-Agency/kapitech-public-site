import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, Search, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { InsightAmbientBackground } from '../components/InsightAmbientBackground';
import { InsightCard } from '../components/InsightCard';
import { InsightSeoMeta } from '../components/InsightSeoMeta';
import { api } from '../lib/apiClient';
import { useLanguage } from '../lib/LanguageContext';
import type { InsightCategory, InsightItem } from '../data/insightTypes';

export const Insights: React.FC = () => {
  const { language } = useLanguage();
  const [items, setItems] = useState<InsightItem[]>([]);
  const [categories, setCategories] = useState<InsightCategory[]>([]);
  const [categoryId, setCategoryId] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [languageFallback, setLanguageFallback] = useState<'id' | null>(null);
  const [retryToken, setRetryToken] = useState(0);
  const resultsHeadingRef = useRef<HTMLHeadingElement | null>(null);
  const pendingResultsNavigationRef = useRef(false);

  useEffect(() => {
    setPage(1);
  }, [language, categoryId, search]);

  useEffect(() => {
    let cancelled = false;

    void api.cms.getInsightCategories(language)
      .then((categoryRes) => {
        if (cancelled || !categoryRes.success) return;
        setCategories(categoryRes.data?.categories || []);
      })
      .catch(() => {
        if (!cancelled) setCategories([]);
      });

    return () => {
      cancelled = true;
    };
  }, [language]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    setLanguageFallback(null);

    void api.cms.getInsights({
      language,
      categoryId: categoryId || undefined,
      search: search || undefined,
      page,
      pageSize: 9
    }).then(async (insightRes) => {
      if (cancelled) return;

      let displayRes = insightRes;
      let fallbackLanguage: 'id' | null = null;

      if (
        language === 'en' &&
        insightRes.success &&
        Number(insightRes.data?.meta?.total || 0) === 0
      ) {
        const fallbackRes = await api.cms.getInsights({
          language: 'id',
          categoryId: categoryId || undefined,
          search: search || undefined,
          page,
          pageSize: 9
        });

        if (fallbackRes.success && Number(fallbackRes.data?.meta?.total || 0) > 0) {
          displayRes = fallbackRes;
          fallbackLanguage = 'id';
        }
      }

      if (cancelled) return;

      if (!displayRes.success) {
        setError(displayRes.error || (language === 'id' ? 'Insight belum dapat dimuat.' : 'Insights could not be loaded.'));
        setItems([]);
        setTotal(0);
        setTotalPages(1);
      } else {
        setItems(displayRes.data?.insights || []);
        setTotal(displayRes.data?.meta?.total || 0);
        setTotalPages(displayRes.data?.meta?.totalPages || 1);
        setLanguageFallback(fallbackLanguage);
      }

    }).catch(() => {
      if (cancelled) return;
      setError(language === 'id' ? 'Terjadi masalah saat memuat Insight.' : 'Something went wrong while loading Insights.');
      setItems([]);
      setTotal(0);
      setTotalPages(1);
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });

    return () => { cancelled = true; };
  }, [language, categoryId, search, page, retryToken]);

  const featured = useMemo(
    () => page === 1 && !search && !categoryId ? items.find(item => item.isFeatured) || null : null,
    [items, page, search, categoryId]
  );

  const latest = useMemo(
    () => featured ? items.filter(item => item.id !== featured.id) : items,
    [items, featured]
  );

  const queueResultsNavigation = () => {
    pendingResultsNavigationRef.current = true;
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    queueResultsNavigation();
    setSearch(searchInput.trim());
    setPage(1);
  };

  const clearFilters = () => {
    queueResultsNavigation();
    setSearchInput('');
    setSearch('');
    setCategoryId('');
    setPage(1);
  };

  useEffect(() => {
    if (loading || !pendingResultsNavigationRef.current) return;

    pendingResultsNavigationRef.current = false;
    const heading = resultsHeadingRef.current;
    if (!heading) return;

    window.requestAnimationFrame(() => {
      heading.focus({ preventScroll: true });
      heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, [loading, page, total, error, items]);

  const scrollToLibrary = () => {
    document.getElementById('insight-library')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };

  const selectedCategory = categories.find(category => category.id === categoryId);
  const selectedCategoryLabel = selectedCategory?.displayName
    || selectedCategory?.name?.[language]
    || selectedCategory?.name?.en
    || selectedCategory?.name?.id
    || selectedCategory?.slug;
  const hasActiveFilters = Boolean(search || categoryId);
  const effectiveContentLanguage = languageFallback === 'id' ? 'id' : language;

  const intro = language === 'id'
    ? 'Perspektif praktis tentang desain, teknologi, produk digital, dan cara membangun pengalaman digital yang lebih baik.'
    : 'Practical perspectives on design, technology, digital products, and how teams build better digital experiences.';

  const eyebrow = language === 'id' ? 'Knowledge / Perspective / Practice' : 'Knowledge / Perspective / Practice';
  const title = language === 'id' ? 'Insight' : 'Insights';
  const latestLabel = hasActiveFilters
    ? (language === 'id' ? 'Hasil Insight' : 'Insight results')
    : (language === 'id' ? 'Insight terbaru' : 'Latest insights');
  const libraryLabel = language === 'id' ? 'Telusuri semua insight' : 'Browse the insight library';

  return (
    <>
      <InsightSeoMeta />
      <div className="relative w-full overflow-hidden bg-[#0B0C0E]">
        <section className="relative isolate flex min-h-[620px] items-center overflow-hidden border-b border-white/[0.07] px-4 pb-20 pt-36 sm:min-h-[680px] sm:px-6 sm:pt-40 md:px-12 lg:min-h-[740px] lg:pt-44">
          <InsightAmbientBackground intensity="hero" />

          <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-[minmax(0,1.15fr)_360px] lg:items-end lg:gap-16">
            <div className="max-w-4xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/[0.09] bg-[#0B0C0E]/45 px-3.5 py-2 text-[9px] font-mono uppercase tracking-[0.16em] text-[#A2A8B4] backdrop-blur-md">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inset-0 animate-ping rounded-full bg-brand-red/70" />
                  <span className="relative block h-1.5 w-1.5 rounded-full bg-brand-red" />
                </span>
                {eyebrow}
              </div>

              <h1 className="max-w-4xl font-display text-5xl font-semibold leading-[0.94] tracking-[-0.06em] text-white sm:text-7xl lg:text-[6.2rem]">
                {title}
              </h1>

              <p className="mt-6 max-w-2xl text-sm leading-7 text-[#9AA1AE] sm:mt-7 sm:text-base sm:leading-8 lg:text-[1.05rem]">
                {intro}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={scrollToLibrary}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand-red px-6 text-[10px] font-semibold uppercase tracking-[0.12em] text-white shadow-[0_16px_35px_-24px_rgba(229,9,20,0.9)] transition-[background-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:bg-[#FF1E27] active:scale-[0.985]"
                >
                  {libraryLabel}
                  <ArrowDown size={14} aria-hidden="true" />
                </button>
                <span className="text-[10px] font-mono uppercase tracking-[0.13em] text-[#676F7C]">
                  {language === 'id' ? 'Dibuat untuk tim yang ingin berpikir lebih tajam.' : 'Built for teams that want to think sharper.'}
                </span>
              </div>
            </div>

            <div className="rounded-[24px] border border-white/[0.08] bg-[#0B0C0E]/48 p-5 backdrop-blur-xl sm:p-6">
              <div className="flex items-center justify-between gap-3 border-b border-white/[0.07] pb-4">
                <span className="text-[9px] font-mono uppercase tracking-[0.16em] text-[#6F7682]">
                  {language === 'id' ? 'Editorial desk' : 'Editorial desk'}
                </span>
                <Sparkles size={14} className="text-brand-red" aria-hidden="true" />
              </div>
              <div className="pt-5">
                <p className="text-xs leading-6 text-[#A8AEB9]">
                  {language === 'id'
                    ? 'Baca pendekatan, kerangka berpikir, dan pembelajaran yang kami gunakan saat mengerjakan design, product, dan engineering.'
                    : 'Read the approaches, frameworks, and lessons we use across design, product, and engineering work.'}
                </p>
                <div className="mt-6 grid grid-cols-2 gap-2">
                  <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] px-4 py-3">
                    <p className="text-[9px] font-mono uppercase tracking-[0.12em] text-[#69717D]">{language === 'id' ? 'Bahasa konten' : 'Content language'}</p>
                    <p className="mt-1 text-sm font-semibold text-white">{effectiveContentLanguage === 'id' ? 'Bahasa Indonesia' : 'English'}</p>
                  </div>
                  <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] px-4 py-3">
                    <p className="text-[9px] font-mono uppercase tracking-[0.12em] text-[#69717D]">
                      {hasActiveFilters ? (language === 'id' ? 'Hasil' : 'Results') : (language === 'id' ? 'Artikel' : 'Articles')}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white">{total || '—'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="insight-library"
          className="relative w-full scroll-mt-24 px-4 py-10 sm:px-6 sm:py-14 md:px-12 lg:py-16"
          aria-label={language === 'id' ? 'Temukan Insight' : 'Discover Insights'}
        >
          <div className="mx-auto w-full max-w-7xl">
          <div className="flex flex-col gap-4 rounded-[22px] border border-white/[0.07] bg-white/[0.018] p-3 backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between lg:p-3.5">
            <div className="flex min-w-0 items-center gap-2 overflow-x-auto px-1 pb-1 lg:flex-1 lg:pb-0">
              <button
                type="button"
                onClick={() => { queueResultsNavigation(); setCategoryId(''); setPage(1); }}
                aria-pressed={!categoryId}
                className={[
                  'shrink-0 rounded-full border px-3.5 py-2 text-[9px] font-semibold uppercase tracking-[0.12em] transition-[background-color,border-color,color] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/55',
                  !categoryId
                    ? 'border-brand-red/35 bg-brand-red/12 text-white'
                    : 'border-white/[0.08] bg-transparent text-[#858C99] hover:border-white/[0.16] hover:text-white'
                ].join(' ')}
              >
                {language === 'id' ? 'Semua' : 'All'}
              </button>

              {categories.map(category => {
                const active = category.id === categoryId;
                const label = category.displayName || category.name?.[language] || category.name?.en || category.name?.id || category.slug;
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => { queueResultsNavigation(); setCategoryId(category.id); setPage(1); }}
                    aria-pressed={active}
                    className={[
                      'shrink-0 rounded-full border px-3.5 py-2 text-[9px] font-semibold uppercase tracking-[0.12em] transition-[background-color,border-color,color] duration-300',
                      active
                        ? 'border-brand-red/35 bg-brand-red/12 text-white'
                        : 'border-white/[0.08] bg-transparent text-[#858C99] hover:border-white/[0.16] hover:text-white'
                    ].join(' ')}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            <form onSubmit={handleSearch} className="flex w-full gap-2 lg:w-[330px] lg:shrink-0" role="search">
              <label htmlFor="insight-search" className="sr-only">
                {language === 'id' ? 'Cari Insight' : 'Search Insights'}
              </label>
              <div className="relative min-w-0 flex-1">
                <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#666E7B]" aria-hidden="true" />
                <input
                  id="insight-search"
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  className="h-10 w-full rounded-full border border-white/[0.08] bg-[#0B0C0E]/62 pl-9 pr-4 text-xs text-white outline-none transition-[border-color,box-shadow] duration-300 placeholder:text-[#606774] focus:border-brand-red/40 focus:shadow-[0_0_0_3px_rgba(229,9,20,0.07)]"
                  placeholder={language === 'id' ? 'Cari topik...' : 'Search topics...'}
                />
              </div>
              <button
                type="submit"
                className="inline-flex h-10 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.035] px-4 text-[9px] font-semibold uppercase tracking-[0.12em] text-white transition-[background-color,border-color] duration-300 hover:border-brand-red/35 hover:bg-brand-red/10"
              >
                {language === 'id' ? 'Cari' : 'Search'}
              </button>
            </form>
          </div>
          </div>
        </section>

        <section className="relative w-full px-4 pb-20 sm:px-6 sm:pb-24 md:px-12" aria-busy={loading}>
          <div className="mx-auto w-full max-w-7xl">
          {languageFallback === 'id' && (
            <div className="mb-4 rounded-2xl border border-white/[0.07] bg-white/[0.018] px-4 py-3 text-xs leading-6 text-[#858C99]">
              {language === 'en'
                ? 'The latest Insight is currently available in Bahasa Indonesia.'
                : 'Insight terbaru tersedia dalam Bahasa Indonesia.'}
            </div>
          )}

          {hasActiveFilters && !loading && (
            <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.018] px-4 py-3 sm:flex-row sm:items-center sm:justify-between" role="status" aria-live="polite">
              <p className="min-w-0 text-xs leading-6 text-[#858C99]">
                {language === 'id' ? 'Menampilkan' : 'Showing'} <span className="font-semibold text-white">{total}</span> {language === 'id' ? 'artikel' : 'articles'}
                {search ? <>{language === 'id' ? ' untuk ' : ' for '}<span className="font-medium text-white">“{search}”</span></> : null}
                {selectedCategoryLabel ? <>{language === 'id' ? ' dalam ' : ' in '}<span className="font-medium text-white">{selectedCategoryLabel}</span></> : null}.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex min-h-9 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.025] px-3.5 text-[9px] font-semibold uppercase tracking-[0.11em] text-[#A3A9B5] transition-[background-color,border-color,color] duration-300 hover:border-brand-red/35 hover:bg-brand-red/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/55"
              >
                {language === 'id' ? 'Reset filter' : 'Clear filters'}
              </button>
            </div>
          )}

          {loading ? (
            <div
              className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
              role="status"
              aria-label={language === 'id' ? 'Memuat Insight' : 'Loading insights'}
            >
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.014]"
                  aria-hidden="true"
                >
                  <div className="aspect-[16/9] animate-pulse bg-white/[0.035]" />
                  <div className="space-y-3 p-5 sm:p-6">
                    <div className="h-2.5 w-32 animate-pulse rounded-full bg-white/[0.045]" />
                    <div className="h-5 w-5/6 animate-pulse rounded-full bg-white/[0.05]" />
                    <div className="h-4 w-full animate-pulse rounded-full bg-white/[0.035]" />
                    <div className="h-4 w-4/5 animate-pulse rounded-full bg-white/[0.035]" />
                    <div className="mt-6 flex justify-between gap-4">
                      <div className="h-3 w-28 animate-pulse rounded-full bg-white/[0.035]" />
                      <div className="h-9 w-20 animate-pulse rounded-full bg-white/[0.045]" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="rounded-[26px] border border-brand-red/20 bg-brand-red/[0.045] p-8">
              <p className="text-sm font-semibold text-white">{language === 'id' ? 'Insight tidak tersedia' : 'Insights unavailable'}</p>
              <p className="mt-2 max-w-xl text-sm leading-6 text-[#858C99]">{error}</p>
              <button
                type="button"
                onClick={() => {
                  pendingResultsNavigationRef.current = false;
                  setRetryToken(value => value + 1);
                }}
                className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.035] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:border-brand-red/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/55"
              >
                {language === 'id' ? 'Coba lagi' : 'Try again'}
              </button>
            </div>
          ) : total === 0 ? (
            <div className="relative overflow-hidden rounded-[28px] border border-white/[0.07] bg-white/[0.018] px-6 py-20 text-center backdrop-blur-xl">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(229,9,20,0.08),transparent_44%)]" />
              <div className="relative">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] text-[#717885]" aria-hidden="true">
                  <Sparkles size={16} />
                </div>
                <p className="mt-5 text-[9px] font-mono uppercase tracking-[0.17em] text-brand-red">
                  {language === 'id' ? 'Editorial queue' : 'Editorial queue'}
                </p>
                <h2
                  ref={resultsHeadingRef}
                  tabIndex={-1}
                  className="mt-3 scroll-mt-28 text-2xl font-display font-semibold tracking-[-0.03em] text-white outline-none focus-visible:outline-none sm:text-3xl"
                >
                  {search || categoryId
                    ? (language === 'id' ? 'Belum ada Insight yang cocok' : 'No matching Insights')
                    : (language === 'id' ? 'Insight sedang disiapkan' : 'Insights are being prepared')}
                </h2>
                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#7E8592]">
                  {search || categoryId
                    ? (language === 'id' ? 'Coba kata kunci atau kategori lain, atau reset filter untuk melihat semua artikel.' : 'Try another keyword or category, or clear the filters to see all articles.')
                    : (language === 'id' ? 'Belum ada artikel yang dipublikasikan. Saat artikel siap, konten akan muncul di sini.' : 'No articles have been published yet. Published editorial content will appear here.')}
                </p>
                {(search || categoryId) && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="relative mt-5 inline-flex min-h-10 items-center justify-center rounded-full border border-white/[0.09] bg-white/[0.03] px-4 text-[9px] font-semibold uppercase tracking-[0.11em] text-white transition-[background-color,border-color] duration-300 hover:border-brand-red/35 hover:bg-brand-red/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/55"
                  >
                    {language === 'id' ? 'Reset filter' : 'Clear filters'}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-16">
              {featured && (
                <section aria-labelledby="featured-insight-title">
                  <div className="mb-5 flex items-end justify-between gap-4">
                    <div>
                      <p className="text-[9px] font-mono uppercase tracking-[0.18em] text-brand-red">
                        {language === 'id' ? 'Pilihan editor' : 'Featured insight'}
                      </p>
                      <h2 id="featured-insight-title" className="mt-2 text-2xl font-display font-semibold tracking-[-0.035em] text-white sm:text-3xl">
                        {language === 'id' ? 'Satu ide untuk dibawa minggu ini.' : 'One idea worth carrying this week.'}
                      </h2>
                    </div>
                    <span className="hidden text-[9px] font-mono uppercase tracking-[0.14em] text-[#656D79] sm:block">
                      01 / {Math.max(1, total).toString().padStart(2, '0')}
                    </span>
                  </div>
                  <InsightCard insight={featured} language={language} featured />
                </section>
              )}

              <section aria-labelledby="latest-insights-title">
                <div className="mb-6 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[9px] font-mono uppercase tracking-[0.18em] text-[#69717D]">
                      {language === 'id' ? 'Library' : 'Library'}
                    </p>
                    <h2
                      ref={resultsHeadingRef}
                      id="latest-insights-title"
                      tabIndex={-1}
                      className="mt-2 scroll-mt-28 text-3xl font-display font-semibold tracking-[-0.04em] text-white outline-none focus-visible:outline-none sm:text-[2.45rem]"
                    >
                      {latestLabel}
                    </h2>
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.12em] text-[#626A76]">
                    {total} {language === 'id' ? 'artikel' : 'articles'}
                  </span>
                </div>

                {latest.length > 0 ? (
                  <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {latest.map(item => (
                      <InsightCard key={item.id} insight={item} language={language} />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[#7E8592]">
                    {language === 'id' ? 'Tidak ada artikel tambahan pada halaman ini.' : 'There are no additional articles on this page.'}
                  </p>
                )}
              </section>

              {totalPages > 1 && (
                <nav
                  className="flex flex-col gap-3 border-t border-white/[0.07] pt-5 sm:flex-row sm:items-center sm:justify-between"
                  aria-label={language === 'id' ? 'Navigasi halaman Insight' : 'Insight pagination'}
                >
                  <span className="text-[9px] font-mono uppercase tracking-[0.13em] text-[#646C78]">
                    {language === 'id' ? 'Halaman' : 'Page'} {String(page).padStart(2, '0')} / {String(totalPages).padStart(2, '0')}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={page === 1}
                      onClick={() => { queueResultsNavigation(); setPage(value => Math.max(1, value - 1)); }}
                      className="inline-flex h-10 items-center gap-2 rounded-full border border-white/[0.08] px-4 text-[9px] font-semibold uppercase tracking-[0.1em] text-white transition-[background-color,border-color,color] duration-300 hover:border-white/[0.16] hover:bg-white/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/55 disabled:cursor-not-allowed disabled:opacity-35"
                    >
                      <ArrowLeft size={13} aria-hidden="true" />
                      {language === 'id' ? 'Sebelumnya' : 'Previous'}
                    </button>
                    <button
                      type="button"
                      disabled={page === totalPages}
                      onClick={() => { queueResultsNavigation(); setPage(value => Math.min(totalPages, value + 1)); }}
                      className="inline-flex h-10 items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.035] px-4 text-[9px] font-semibold uppercase tracking-[0.1em] text-white transition-[background-color,border-color,color] duration-300 hover:border-brand-red/35 hover:bg-brand-red/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/55 disabled:cursor-not-allowed disabled:opacity-35"
                    >
                      {language === 'id' ? 'Berikutnya' : 'Next'}
                      <ArrowRight size={13} aria-hidden="true" />
                    </button>
                  </div>
                </nav>
              )}
            </div>
          )}
          </div>
        </section>

        <section className="relative w-full px-4 pb-24 sm:px-6 md:px-12">
          <div className="mx-auto w-full max-w-7xl">
          <div className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-white/[0.018] p-6 backdrop-blur-xl sm:p-8 lg:p-10">
            <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-brand-red/[0.07] blur-3xl" />
            <div className="relative flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-[9px] font-mono uppercase tracking-[0.18em] text-brand-red">
                  {language === 'id' ? 'Dari insight ke eksekusi' : 'From insight to execution'}
                </p>
                <h2 className="mt-3 text-3xl font-display font-semibold leading-[1.02] tracking-[-0.04em] text-white sm:text-4xl">
                  {language === 'id'
                    ? 'Temukan ide yang relevan. Lalu bangun sesuatu yang bekerja.'
                    : 'Find the idea that matters. Then build something that works.'}
                </h2>
                <p className="mt-4 text-sm leading-7 text-[#89909D]">
                  {language === 'id'
                    ? 'Kalau ada topik yang ingin Anda terapkan ke website, produk, atau sistem digital, kami bisa membantu menerjemahkannya menjadi delivery.'
                    : 'When an idea needs to become a website, product, or digital system, we can help translate it into delivery.'}
                </p>
              </div>

              <Link
                to="/contact"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.035] px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-white transition-[background-color,border-color,color,transform] duration-300 hover:-translate-y-0.5 hover:border-brand-red/35 hover:bg-brand-red/10"
              >
                {language === 'id' ? 'Mulai Project' : 'Start a Project'}
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>
          </div>
          </div>
        </section>
      </div>
    </>
  );
};

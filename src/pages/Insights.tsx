import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Search, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
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

  useEffect(() => {
    setPage(1);
  }, [language, categoryId, search]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');

    void Promise.all([
      api.cms.getInsights({
        language,
        categoryId: categoryId || undefined,
        search: search || undefined,
        page,
        pageSize: 9
      }),
      api.cms.getInsightCategories(language)
    ]).then(([insightRes, categoryRes]) => {
      if (cancelled) return;

      if (!insightRes.success) {
        setError(insightRes.error || (language === 'id' ? 'Insight belum dapat dimuat.' : 'Insights could not be loaded.'));
        setItems([]);
      } else {
        setItems(insightRes.data?.insights || []);
        setTotal(insightRes.data?.meta?.total || 0);
        setTotalPages(insightRes.data?.meta?.totalPages || 1);
      }

      if (categoryRes.success) {
        setCategories(categoryRes.data?.categories || []);
      }
    }).catch(() => {
      if (cancelled) return;
      setError(language === 'id' ? 'Terjadi masalah saat memuat Insight.' : 'Something went wrong while loading Insights.');
      setItems([]);
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });

    return () => { cancelled = true; };
  }, [language, categoryId, search, page]);

  const featured = useMemo(
    () => page === 1 && !search && !categoryId ? items.find(item => item.isFeatured) || null : null,
    [items, page, search, categoryId]
  );

  const latest = useMemo(
    () => featured ? items.filter(item => item.id !== featured.id) : items,
    [items, featured]
  );

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setSearch(searchInput.trim());
    setPage(1);
  };

  const intro = language === 'id'
    ? 'Perspektif praktis tentang desain, teknologi, produk digital, dan cara membangun pengalaman digital yang lebih baik.'
    : 'Practical perspectives on design, technology, digital products, and how teams build better digital experiences.';

  const title = language === 'id' ? 'Insight' : 'Insights';
  const latestLabel = language === 'id' ? 'Insight terbaru' : 'Latest insights';

  return (
    <>
      <InsightSeoMeta />
      <div className="w-full">
        <section className="mx-auto w-full max-w-[1240px] px-5 pb-12 pt-28 sm:px-8 sm:pb-16 sm:pt-36 lg:px-10 lg:pt-40">
          <div className="max-w-3xl">
            <div className="mb-5 flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.18em] text-brand-red">
              <Sparkles size={13} aria-hidden="true" />
              <span>{language === 'id' ? 'Knowledge & Perspective' : 'Knowledge & Perspective'}</span>
            </div>
            <h1 className="font-display text-4xl font-semibold leading-[1.02] tracking-[-0.045em] text-white sm:text-6xl">
              {title}
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-[#9BA1AE] sm:text-base sm:leading-8">
              {intro}
            </p>
          </div>
        </section>

        <section className="mx-auto w-full max-w-[1240px] px-5 sm:px-8 lg:px-10" aria-label={language === 'id' ? 'Temukan Insight' : 'Discover Insights'}>
          <div className="flex flex-col gap-4 border-y border-white/[0.07] py-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-center gap-2 overflow-x-auto pb-1 lg:max-w-[72%]">
              <button
                type="button"
                onClick={() => { setCategoryId(''); setPage(1); }}
                className={'shrink-0 rounded-full border px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] transition-colors ' + (
                  categoryId
                    ? 'border-white/[0.08] text-[#8A909D] hover:border-white/[0.16] hover:text-white'
                    : 'border-brand-red/30 bg-brand-red/10 text-white'
                )}
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
                    onClick={() => { setCategoryId(category.id); setPage(1); }}
                    className={'shrink-0 rounded-full border px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] transition-colors ' + (
                      active
                        ? 'border-brand-red/30 bg-brand-red/10 text-white'
                        : 'border-white/[0.08] text-[#8A909D] hover:border-white/[0.16] hover:text-white'
                    )}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            <form onSubmit={handleSearch} className="flex w-full max-w-md items-center gap-2 lg:w-auto" role="search">
              <label htmlFor="insight-search" className="sr-only">{language === 'id' ? 'Cari Insight' : 'Search Insights'}</label>
              <div className="relative min-w-0 flex-1">
                <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#707684]" aria-hidden="true" />
                <input
                  id="insight-search"
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  className="h-10 w-full rounded-full border border-white/[0.08] bg-[#0D0F12]/80 pl-9 pr-4 text-xs text-white outline-none transition-colors placeholder:text-[#5E6470] focus:border-brand-red/35"
                  placeholder={language === 'id' ? 'Cari topik...' : 'Search topics...'}
                />
              </div>
              <button type="submit" className="inline-flex h-10 shrink-0 items-center justify-center rounded-full border border-white/[0.09] bg-white/[0.04] px-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:border-brand-red/35 hover:bg-brand-red/10">
                {language === 'id' ? 'Cari' : 'Search'}
              </button>
            </form>
          </div>
        </section>

        <section className="mx-auto w-full max-w-[1240px] px-5 py-10 sm:px-8 sm:py-14 lg:px-10">
          {loading ? (
            <div className="rounded-[24px] border border-white/[0.07] bg-white/[0.02] p-8 text-sm text-[#7E8592]" role="status">
              {language === 'id' ? 'Memuat Insight...' : 'Loading insights...'}
            </div>
          ) : error ? (
            <div className="rounded-[24px] border border-brand-red/20 bg-brand-red/5 p-8">
              <p className="text-sm font-semibold text-white">{language === 'id' ? 'Insight tidak tersedia' : 'Insights unavailable'}</p>
              <p className="mt-2 text-sm leading-6 text-[#858C99]">{error}</p>
              <button type="button" onClick={() => window.location.reload()} className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.04] px-4 py-2.5 text-xs font-semibold text-white hover:border-brand-red/35">
                {language === 'id' ? 'Coba lagi' : 'Try again'}
              </button>
            </div>
          ) : total === 0 ? (
            <div className="flex min-h-[360px] flex-col items-center justify-center rounded-[24px] border border-white/[0.07] bg-white/[0.02] px-6 py-16 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] text-[#717885]" aria-hidden="true">
                <Sparkles size={16} />
              </div>
              <h2 className="mt-4 text-xl font-display font-semibold text-white">
                {search || categoryId
                  ? (language === 'id' ? 'Belum ada Insight yang cocok' : 'No matching Insights')
                  : (language === 'id' ? 'Insight sedang disiapkan' : 'Insights are being prepared')}
              </h2>
              <p className="mt-2 max-w-md text-sm leading-6 text-[#7E8592]">
                {search || categoryId
                  ? (language === 'id' ? 'Coba kata kunci atau kategori lain.' : 'Try another keyword or category.')
                  : (language === 'id' ? 'Belum ada artikel yang dipublikasikan. Saat artikel siap, konten akan muncul di sini.' : 'No articles have been published yet. Published editorial content will appear here.')}
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {featured && (
                <section aria-labelledby="featured-insight-title">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <p id="featured-insight-title" className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#747B88]">{language === 'id' ? 'Pilihan editor' : 'Featured Insight'}</p>
                  </div>
                  <InsightCard insight={featured} language={language} featured />
                </section>
              )}

              <section aria-labelledby="latest-insights-title">
                <div className="mb-5 flex items-end justify-between gap-4">
                  <h2 id="latest-insights-title" className="text-2xl font-display font-semibold tracking-[-0.025em] text-white sm:text-3xl">{latestLabel}</h2>
                  <span className="text-xs text-[#68707C]">{total} {language === 'id' ? 'artikel' : 'articles'}</span>
                </div>
                {latest.length > 0 ? (
                  <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {latest.map(item => <InsightCard key={item.id} insight={item} language={language} />)}
                  </div>
                ) : (
                  <p className="text-sm text-[#7E8592]">{language === 'id' ? 'Tidak ada artikel tambahan pada halaman ini.' : 'There are no additional articles on this page.'}</p>
                )}
              </section>

              {totalPages > 1 && (
                <nav className="flex items-center justify-center gap-2 pt-2" aria-label={language === 'id' ? 'Navigasi halaman Insight' : 'Insight pagination'}>
                  <button
                    type="button"
                    disabled={page === 1}
                    onClick={() => setPage(value => Math.max(1, value - 1))}
                    className="inline-flex h-10 items-center gap-2 rounded-full border border-white/[0.08] px-4 text-xs font-semibold text-white transition-colors hover:border-white/[0.16] disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    <ArrowLeft size={14} aria-hidden="true" />
                    {language === 'id' ? 'Sebelumnya' : 'Previous'}
                  </button>
                  <span className="px-2 text-xs text-[#6F7682]" aria-current="page">{page} / {totalPages}</span>
                  <button
                    type="button"
                    disabled={page === totalPages}
                    onClick={() => setPage(value => Math.min(totalPages, value + 1))}
                    className="inline-flex h-10 items-center gap-2 rounded-full border border-white/[0.08] px-4 text-xs font-semibold text-white transition-colors hover:border-white/[0.16] disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    {language === 'id' ? 'Berikutnya' : 'Next'}
                    <ArrowRight size={14} aria-hidden="true" />
                  </button>
                </nav>
              )}
            </div>
          )}
        </section>

        <section className="mx-auto w-full max-w-[1240px] px-5 pb-20 sm:px-8 lg:px-10">
          <div className="flex flex-col items-start justify-between gap-5 rounded-[24px] border border-white/[0.07] bg-white/[0.02] p-6 sm:flex-row sm:items-center sm:p-8">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-brand-red">{language === 'id' ? 'Butuh eksekusi?' : 'Ready to execute?'}</p>
              <h2 className="mt-2 max-w-xl text-2xl font-display font-semibold tracking-[-0.025em] text-white">
                {language === 'id' ? 'Ubah insight menjadi project digital yang terukur.' : 'Turn useful insight into a measurable digital project.'}
              </h2>
            </div>
            <Link to="/contact" className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.04] px-5 py-3 text-xs font-semibold text-white transition-colors hover:border-brand-red/35 hover:bg-brand-red/10">
              {language === 'id' ? 'Mulai Project' : 'Start a Project'}
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ChevronRight, Clock3 } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { InsightAmbientBackground } from '../components/InsightAmbientBackground';
import { InsightCard } from '../components/InsightCard';
import { InsightContentRenderer } from '../components/InsightContentRenderer';
import { InsightLeftRail } from '../components/InsightLeftRail';
import { InsightRightRail } from '../components/InsightRightRail';
import { InsightSeoMeta } from '../components/InsightSeoMeta';
import { InsightTableOfContents } from '../components/InsightTableOfContents';
import { api } from '../lib/apiClient';
import { useLanguage } from '../lib/LanguageContext';
import type { InsightItem } from '../data/insightTypes';
import { buildInsightHeadingIds, buildInsightToc } from '../lib/insightHeadingIds';
import { validateInsightContent } from '../lib/insightContentValidation';

function formatDate(value: string | null | undefined, language: 'id' | 'en'): string {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat(language === 'id' ? 'id-ID' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
}

function clamp(value: number): number {
  return Math.max(0, Math.min(100, value));
}

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function validFaq(article: InsightItem): Array<{ question: string; answer: string }> {
  return (Array.isArray(article.faq) ? article.faq : [])
    .filter((item) => Boolean(item?.question?.trim()) && Boolean(item?.answer?.trim()));
}

function getRelatedInsights(article: InsightItem): InsightItem[] {
  const seen = new Set<string>();

  return (Array.isArray(article.relatedInsights) ? article.relatedInsights : [])
    .filter((item) => {
      if (!item || item.id === article.id || item.slug === article.slug) return false;
      if (item.status !== 'published' || item.language !== article.language || !item.slug) return false;
      if (seen.has(item.slug)) return false;
      seen.add(item.slug);
      return true;
    })
    .slice(0, 3);
}

function hasPrerenderedInsight(): boolean {
  return typeof document !== 'undefined'
    && Boolean(document.getElementById('kapi-prerendered-insight'));
}

function removePrerenderedInsight(): void {
  document.getElementById('kapi-prerendered-insight')?.remove();
}

function enablePrerenderedInsightFallback(): void {
  const prerender = document.getElementById('kapi-prerendered-insight');
  if (!prerender) return;

  prerender.classList.remove('pointer-events-none');
  prerender.classList.add('pointer-events-auto');
  prerender.setAttribute('data-kapi-prerender-fallback', 'true');
}

class InsightDetailErrorBoundary extends React.Component<
  { children: React.ReactNode; language: 'id' | 'en' },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: unknown): void {
    console.error('[Kapitech Insight] detail render failed:', error);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <section className="relative flex min-h-[70vh] w-full items-center overflow-hidden bg-[#0B0C0E] px-4 pt-28 sm:px-6 md:px-12">
        <div className="mx-auto w-full max-w-[980px]">
          <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-brand-red">
            Insight / Render error
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl font-display font-semibold leading-[1.02] tracking-[-0.05em] text-white sm:text-6xl">
            {this.props.language === 'id' ? 'Artikel gagal ditampilkan' : 'This insight could not be rendered'}
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-7 text-[#8B929F]">
            {this.props.language === 'id'
              ? 'Data artikel berhasil ditemukan, tetapi ada bagian konten yang tidak valid. Silakan muat ulang halaman.'
              : 'The article was found, but part of its content is invalid. Please reload the page.'}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-brand-red px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.11em] text-white transition-colors hover:bg-[#FF1E27] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60"
            >
              {this.props.language === 'id' ? 'Muat ulang' : 'Reload'}
            </button>
            <Link
              to="/insights"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.04] px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.11em] text-white transition-colors hover:border-white/[0.16] hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60"
            >
              {this.props.language === 'id' ? 'Kembali ke Insight' : 'Back to Insights'}
            </Link>
          </div>
        </div>
      </section>
    );
  }
}

export const InsightDetail: React.FC = () => {
  const { slug = '' } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const articleReadingRef = useRef<HTMLElement | null>(null);
  const readingEndRef = useRef<HTMLElement | null>(null);
  const languageInitializedRef = useRef(false);
  const articleLanguageRef = useRef<InsightItem['language'] | null>(null);
  const [article, setArticle] = useState<InsightItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [loadError, setLoadError] = useState<'network' | 'content' | null>(null);
  const [shareState, setShareState] = useState<'idle' | 'copied' | 'shared'>('idle');
  const [readingProgress, setReadingProgress] = useState(0);
  const [relatedInsights, setRelatedInsights] = useState<InsightItem[]>([]);

  useEffect(() => {
    languageInitializedRef.current = false;
    articleLanguageRef.current = null;
    setArticle(null);
    setLoading(true);
    setNotFound(false);
    setLoadError(null);
    setReadingProgress(0);
    setRelatedInsights([]);

    let cancelled = false;

    void api.cms.getInsightBySlug(slug)
      .then((res) => {
        if (cancelled) return;

        if (!res.success || !res.data?.insight || res.data.insight.status !== 'published') {
          const isNotFound = /(?:HTTP\s+)?404\b/.test(res.error || '');

          if (isNotFound) {
            removePrerenderedInsight();
            setNotFound(true);
          } else {
            console.error('[Kapitech Insight] article request failed:', res.error || 'Unknown API error');
            enablePrerenderedInsightFallback();
            setLoadError('network');
          }
          return;
        }

        const nextArticle = res.data.insight;
        const validation = validateInsightContent(nextArticle.content);

        if (validation.errors.length > 0) {
          console.error('[Kapitech Insight] published content failed validation:', {
            slug: nextArticle.slug,
            errors: validation.errors,
            warnings: validation.warnings
          });
          enablePrerenderedInsightFallback();
          setLoadError('content');
          return;
        }

        if (validation.warnings.length > 0) {
          console.warn('[Kapitech Insight] published content warnings:', {
            slug: nextArticle.slug,
            warnings: validation.warnings
          });
        }

        setArticle(nextArticle);
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        console.error('[Kapitech Insight] article request failed:', error);
        enablePrerenderedInsightFallback();
        setLoadError('network');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    if (!article || languageInitializedRef.current) return;

    languageInitializedRef.current = true;
    articleLanguageRef.current = article.language;

    if (article.language !== language) {
      setLanguage(article.language);
    }
  }, [article, language, setLanguage]);

  useEffect(() => {
    if (!article || !languageInitializedRef.current) return;
    if (articleLanguageRef.current === language) return;

    const alternate = (Array.isArray(article.alternateLanguages) ? article.alternateLanguages : [])
      .find((item) => item.language === language && item.slug);

    if (alternate?.slug && alternate.slug !== slug) {
      articleLanguageRef.current = language;
      navigate('/insights/' + alternate.slug, { replace: true });
      return;
    }

    setLanguage(article.language);
    articleLanguageRef.current = article.language;
  }, [article, language, navigate, setLanguage, slug]);

  useEffect(() => {
    let rafId = 0;

    const update = () => {
      rafId = 0;
      const articleElement = articleReadingRef.current;
      if (!articleElement) return;

      const endElement = readingEndRef.current;
      if (!endElement) return;

      const startRect = articleElement.getBoundingClientRect();
      const endRect = endElement.getBoundingClientRect();
      const start = window.scrollY + startRect.top;
      const end = window.scrollY + endRect.bottom;
      const travel = Math.max(1, end - start - window.innerHeight);
      setReadingProgress(clamp(((window.scrollY - start) / travel) * 100));
    };

    const schedule = () => {
      if (rafId !== 0) return;
      rafId = window.requestAnimationFrame(update);
    };

    const resizeObserver = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(schedule)
      : null;

    if (resizeObserver) {
      if (articleReadingRef.current) resizeObserver.observe(articleReadingRef.current);
      if (readingEndRef.current) resizeObserver.observe(readingEndRef.current);
    }

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);

    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      resizeObserver?.disconnect();
      if (rafId !== 0) window.cancelAnimationFrame(rafId);
    };
  }, [article]);

  useEffect(() => {
    if (!article) return;
    removePrerenderedInsight();
  }, [article]);

  useEffect(() => {
    return () => {
      removePrerenderedInsight();
    };
  }, []);

  useEffect(() => {
    if (!article) return;

    let cancelled = false;
    const seeded = getRelatedInsights(article);

    if (seeded.length >= 3) {
      setRelatedInsights(seeded);
      return () => {
        cancelled = true;
      };
    }

    const loadRelated = async () => {
      const response = await api.cms.getInsights({
        language: article.language,
        categoryId: article.categoryId || article.category?.id || undefined,
        page: 1,
        pageSize: 6
      });

      if (cancelled) return;

      const candidates = response.success
        ? (response.data?.insights || [])
        : [];

      const seen = new Set(seeded.map((item) => item.slug));
      const fallback = candidates.filter((item) => {
        if (!item || item.status !== 'published' || item.language !== article.language || !item.slug) return false;
        if (item.id === article.id || item.slug === article.slug || seen.has(item.slug)) return false;
        seen.add(item.slug);
        return true;
      });

      setRelatedInsights([...seeded, ...fallback].slice(0, 3));

      if (!response.success) {
        console.warn('[Kapitech Insight] related-content fallback unavailable:', response.error || 'Unknown API error');
      }
    };

    void loadRelated().catch((error: unknown) => {
      if (!cancelled) {
        console.warn('[Kapitech Insight] related-content fallback failed:', error);
        setRelatedInsights(seeded);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [article]);

  const blocks = useMemo(
    () => (article && Array.isArray(article.content) ? article.content : []),
    [article]
  );

  const firstHeadingIndex = useMemo(
    () => blocks.findIndex((block) => block?.type === 'heading'),
    [blocks]
  );

  const introductionBlocks = useMemo(
    () => firstHeadingIndex > -1 ? blocks.slice(0, firstHeadingIndex) : blocks,
    [blocks, firstHeadingIndex]
  );

  const bodyBlocks = useMemo(
    () => firstHeadingIndex > -1 ? blocks.slice(firstHeadingIndex) : [],
    [blocks, firstHeadingIndex]
  );

  const headingIds = useMemo(() => buildInsightHeadingIds(bodyBlocks), [bodyBlocks]);

  const faq = useMemo(
    () => article ? validFaq(article) : [],
    [article]
  );

  const toc = useMemo(() => {
    const items = buildInsightToc(bodyBlocks, headingIds);

    if (faq.length > 0 && !items.some((item) => item.id === 'faq-title')) {
      items.push({
        id: 'faq-title',
        text: article?.language === 'id' ? 'Pertanyaan yang sering diajukan' : 'Frequently asked questions',
        level: 2
      });
    }

    return items;
  }, [article?.language, bodyBlocks, faq, headingIds]);

  const shareArticle = async () => {
    try {
      let nextState: 'copied' | 'shared' = 'copied';

      if (navigator.share) {
        try {
          await navigator.share({
            title: article?.title || 'Kapitech Insight',
            url: window.location.href
          });
          nextState = 'shared';
        } catch (error: unknown) {
          if (error instanceof DOMException && error.name === 'AbortError') return;
          await navigator.clipboard.writeText(window.location.href);
        }
      } else {
        await navigator.clipboard.writeText(window.location.href);
      }

      setShareState(nextState);
      window.setTimeout(() => setShareState('idle'), 1800);
    } catch {}
  };

  const hasPrerender = hasPrerenderedInsight();

  if ((loading || loadError) && hasPrerender) return null;

  if (loadError === 'content') {
    return (
      <section className="relative flex min-h-[70vh] w-full items-center overflow-hidden bg-[#0B0C0E] px-5 pt-28 sm:px-8">
        <div className="mx-auto w-full max-w-[980px]">
          <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-brand-red">Insight / Content validation</p>
          <h1 className="mt-4 max-w-2xl text-4xl font-display font-semibold leading-[1.02] tracking-[-0.05em] text-white sm:text-6xl">
            {language === 'id' ? 'Konten artikel perlu diperbaiki' : 'This article needs a content fix'}
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-7 text-[#8B929F]">
            {language === 'id'
              ? 'Artikel belum dapat ditampilkan karena struktur kontennya tidak valid.'
              : 'The article cannot be displayed because its content structure is invalid.'}
          </p>
          <Link
            to="/insights"
            className="mt-7 inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.035] px-5 py-3 text-[9px] font-semibold uppercase tracking-[0.12em] text-white transition-[background-color,border-color] duration-300 hover:border-brand-red/35 hover:bg-brand-red/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/55"
          >
            <ArrowLeft size={14} aria-hidden="true" />
            {language === 'id' ? 'Kembali ke Insight' : 'Back to Insights'}
          </Link>
        </div>
      </section>
    );
  }

  if (loadError === 'network') {
    return (
      <section className="relative flex min-h-[70vh] w-full items-center overflow-hidden bg-[#0B0C0E] px-5 pt-28 sm:px-8">
        <div className="mx-auto w-full max-w-[980px]">
          <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-brand-red">Insight / Network error</p>
          <h1 className="mt-4 max-w-2xl text-4xl font-display font-semibold leading-[1.02] tracking-[-0.05em] text-white sm:text-6xl">
            {language === 'id' ? 'Insight belum dapat dimuat' : 'This insight could not be loaded'}
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-7 text-[#8B929F]">
            {language === 'id'
              ? 'Terjadi masalah saat mengambil artikel. Silakan coba lagi.'
              : 'There was a problem loading this article. Please try again.'}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-brand-red px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.11em] text-white transition-colors hover:bg-[#FF1E27] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60"
            >
              {language === 'id' ? 'Muat ulang' : 'Reload'}
            </button>
            <Link
              to="/insights"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.035] px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.11em] text-white transition-colors hover:border-white/[0.16] hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60"
            >
              {language === 'id' ? 'Kembali ke Insight' : 'Back to Insights'}
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <div className="relative flex min-h-[62vh] items-center justify-center overflow-hidden px-4 pt-28 sm:px-6 md:px-12" role="status" aria-live="polite">
        <InsightAmbientBackground intensity="detail" />
        <div className="relative z-10 text-center">
          <span className="mx-auto mb-4 block h-1.5 w-1.5 animate-pulse rounded-full bg-brand-red" />
          <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#727A87]">
            {language === 'id' ? 'Memuat artikel...' : 'Loading article...'}
          </p>
        </div>
      </div>
    );
  }

  if (notFound || !article) {
    return (
      <section className="relative flex min-h-[70vh] w-full items-center overflow-hidden px-4 pt-28 sm:px-6 md:px-12">
        <InsightAmbientBackground intensity="detail" />
        <div className="relative z-10 mx-auto w-full max-w-7xl">
          <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-brand-red">404 / Insight</p>
          <h1 className="mt-4 max-w-2xl text-4xl font-display font-semibold leading-[1.02] tracking-[-0.05em] text-white sm:text-6xl">
            {language === 'id' ? 'Insight tidak ditemukan' : 'Insight not found'}
          </h1>
          <p className="mt-5 max-w-lg text-sm leading-7 text-[#8B929F]">
            {language === 'id'
              ? 'Artikel mungkin belum dipublikasikan atau URL-nya sudah berubah.'
              : 'The article may not be published yet or its URL may have changed.'}
          </p>
          <Link
            to="/insights"
            className="mt-7 inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.035] px-5 py-3 text-[9px] font-semibold uppercase tracking-[0.12em] text-white transition-[background-color,border-color] duration-300 hover:border-brand-red/35 hover:bg-brand-red/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/55"
          >
            <ArrowLeft size={14} aria-hidden="true" />
            {language === 'id' ? 'Kembali ke Insight' : 'Back to Insights'}
          </Link>
        </div>
      </section>
    );
  }

  const category = article.category?.displayName
    || article.category?.name?.[article.language]
    || article.category?.name?.en
    || article.category?.name?.id
    || article.category?.slug;

  const coverWidth = Number.isFinite(article.coverImageWidth) && Number(article.coverImageWidth) > 0
    ? Number(article.coverImageWidth)
    : undefined;
  const coverHeight = Number.isFinite(article.coverImageHeight) && Number(article.coverImageHeight) > 0
    ? Number(article.coverImageHeight)
    : undefined;

  return (
    <InsightDetailErrorBoundary language={article.language}>
      <>
        <InsightSeoMeta article={article} />

        <header className="relative isolate overflow-hidden border-b border-white/[0.07]">
          <InsightAmbientBackground intensity="detail" />

          <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-14 pt-28 sm:px-6 sm:pb-18 sm:pt-36 md:px-12 lg:pb-20 lg:pt-40">
            <nav className="mb-9 flex items-center gap-2 overflow-x-auto text-[9px] font-mono uppercase tracking-[0.13em] text-[#646C78]" aria-label="Breadcrumb">
              <Link to="/" className="shrink-0 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/55">
                {article.language === 'id' ? 'Beranda' : 'Home'}
              </Link>
              <ChevronRight size={11} className="shrink-0" aria-hidden="true" />
              <Link to="/insights" className="shrink-0 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/55">
                {article.language === 'id' ? 'Insight' : 'Insights'}
              </Link>

            </nav>

            <div className="max-w-[980px]">
              <div className="max-w-[920px]">
                <div className="flex flex-wrap items-center gap-2.5 text-[9px] font-mono uppercase tracking-[0.15em]">
                  {category && (
                    <span className="rounded-full border border-white/[0.09] bg-white/[0.03] px-3 py-1.5 text-[#B0B6C0]">
                      {category}
                    </span>
                  )}
                  <span className="text-[#68707C]">{article.language.toUpperCase()}</span>
                  {article.editorialMeta?.editorialType && (
                    <>
                      <span className="h-1 w-1 rounded-full bg-white/15" aria-hidden="true" />
                      <span className="text-[#68707C]">{article.editorialMeta.editorialType}</span>
                    </>
                  )}
                  {article.readingTime ? (
                    <>
                      <span className="h-1 w-1 rounded-full bg-white/15" aria-hidden="true" />
                      <span className="inline-flex items-center gap-1.5 text-[#737A87]">
                        <Clock3 size={11} aria-hidden="true" />
                        {article.readingTime} {article.language === 'id' ? 'menit baca' : 'min read'}
                      </span>
                    </>
                  ) : null}
                </div>

                <h1 className="mt-6 max-w-[980px] font-display text-4xl font-semibold leading-[0.98] tracking-[-0.055em] text-white sm:text-6xl lg:text-[5rem]">
                  {article.title}
                </h1>

                {article.excerpt && (
                  <p className="mt-6 max-w-3xl text-base leading-8 text-[#A3A9B5] sm:text-lg sm:leading-8">
                    {article.excerpt}
                  </p>
                )}

                <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-white/[0.07] pt-5 text-xs text-[#737A87]">
                  {article.author?.name && (
                    <span className="font-medium text-white">
                      {article.language === 'id' ? 'Ditulis oleh ' : 'Written by '}
                      {article.author.name}
                      {article.author.role ? <span className="font-normal text-[#737A87]"> · {article.author.role}</span> : null}
                    </span>
                  )}
                  {article.editorialMeta?.reviewedBy && (
                    <span>{article.language === 'id' ? 'Ditinjau oleh ' : 'Reviewed by '}{article.editorialMeta.reviewedBy}</span>
                  )}
                  {article.editorialMeta?.factCheckedBy && (
                    <span>{article.language === 'id' ? 'Diperiksa fakta oleh ' : 'Fact checked by '}{article.editorialMeta.factCheckedBy}</span>
                  )}
                  {article.publishedAt && (
                    <time dateTime={article.publishedAt}>{formatDate(article.publishedAt, article.language)}</time>
                  )}
                  {article.updatedAt && article.updatedAt !== article.publishedAt && (
                    <span>{article.language === 'id' ? 'Diperbarui ' : 'Updated '}{formatDate(article.updatedAt, article.language)}</span>
                  )}
                </div>
              </div>
            </div>

            {article.coverImage && (
              <figure className="relative mt-12 max-w-[1120px] overflow-hidden rounded-[24px] border border-white/[0.08] bg-[#0B0C0E]">
                <img
                  src={article.coverImage}
                  alt={article.coverImageAlt?.trim() || article.title}
                  width={coverWidth}
                  height={coverHeight}
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  className="block h-auto max-h-[720px] w-full object-cover"
                />
              </figure>
            )}
          </div>
        </header>

        <div className="mx-auto w-full max-w-7xl scroll-mt-28 px-4 pb-16 pt-8 sm:px-6 sm:pt-10 md:px-12 lg:pb-20 lg:pt-14">
          <div className="mb-5 xl:hidden">
            <InsightLeftRail
              mobile
              language={article.language}
              readingProgress={readingProgress}
              shareState={shareState}
              onShare={() => void shareArticle()}
            />
            {toc.length > 0 && (
              <InsightTableOfContents items={toc} language={article.language} variant="mobile" />
            )}
          </div>

          <div className="grid items-start gap-7 xl:grid-cols-[56px_minmax(0,1fr)_304px]">
            <InsightLeftRail
              language={article.language}
              readingProgress={readingProgress}
              shareState={shareState}
              onShare={() => void shareArticle()}
            />

            <article
              ref={articleReadingRef}
              className="min-w-0 w-full max-w-[820px] justify-self-center text-[#C3C7D0]"
            >
              {introductionBlocks.length > 0 && (
                <section className="mb-12 sm:mb-14" aria-label={article.language === 'id' ? 'Pendahuluan' : 'Introduction'}>
                  <InsightContentRenderer
                    blocks={introductionBlocks}
                    headingIds={[]}
                    language={article.language}
                  />
                </section>
              )}

              {Array.isArray(article.keyTakeaways) && article.keyTakeaways.length > 0 && (
                <section className="mb-12 border-y border-white/[0.08] py-8 sm:mb-14 sm:py-9" aria-labelledby="key-takeaways-title">
                  <div className="grid gap-6 sm:grid-cols-[170px_minmax(0,1fr)] sm:gap-10">
                    <div>
                      <p id="key-takeaways-title" className="text-[9px] font-mono uppercase tracking-[0.18em] text-brand-red">
                        {article.language === 'id' ? 'Poin utama' : 'Article key takeaways'}
                      </p>
                      <p className="mt-2 max-w-[155px] text-xs leading-5 text-[#7D8592]">
                        {article.language === 'id'
                          ? 'Gagasan yang paling penting untuk dibawa setelah membaca.'
                          : 'The ideas worth carrying forward.'}
                      </p>
                    </div>
                    <ul className="space-y-3">
                      {article.keyTakeaways.map((item, index) => (
                        <li key={index} className="flex gap-3 text-sm leading-7 text-[#CBD0D8] sm:text-[15px]">
                          <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-red/75" aria-hidden="true" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>
              )}

              {bodyBlocks.length > 0 && (
                <InsightContentRenderer
                  blocks={bodyBlocks}
                  headingIds={headingIds.map((id) => id || '')}
                  language={article.language}
                />
              )}

              <div data-insight-article-end aria-hidden="true" className="h-px w-full" />

              {article.author && (
                <section className="mt-12 border-t border-white/[0.07] pt-8" aria-labelledby="author-title">
                  <p id="author-title" className="text-[9px] font-mono uppercase tracking-[0.16em] text-[#747B88]">
                    {article.language === 'id' ? 'Tentang penulis' : 'About the author'}
                  </p>
                  <div className="mt-5 flex items-start gap-4">
                    {article.author.avatar ? (
                      <img
                        src={article.author.avatar}
                        alt=""
                        width="48"
                        height="48"
                        loading="lazy"
                        decoding="async"
                        className="h-12 w-12 shrink-0 rounded-full border border-white/[0.08] object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04] text-sm font-semibold text-white" aria-hidden="true">
                        {article.author.name.slice(0, 1).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white">{article.author.name}</p>
                      {article.author.role && <p className="mt-1 text-xs text-[#747B88]">{article.author.role}</p>}
                      {article.author.bio && <p className="mt-3 max-w-xl text-sm leading-6 text-[#9BA2AF]">{article.author.bio}</p>}
                    </div>
                  </div>
                </section>
              )}
            </article>

            <InsightRightRail items={toc} language={article.language} />
          </div>
        </div>

        {relatedInsights.length > 0 && (
          <section className="mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6 md:px-12" aria-labelledby="related-title">
            <div className="flex items-end justify-between gap-4 border-t border-white/[0.07] pt-10">
              <div>
                <p className="text-[9px] font-mono uppercase tracking-[0.18em] text-[#69717D]">
                  {article.language === 'id' ? 'Library' : 'Library'}
                </p>
                <h2 id="related-title" className="mt-2 text-3xl font-display font-semibold tracking-[-0.04em] text-white sm:text-[2.45rem]">
                  {article.language === 'id' ? 'Insight terkait' : 'Related insights'}
                </h2>
              </div>
              <Link
                to="/insights"
                className="hidden items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.11em] text-[#858C99] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60 sm:inline-flex"
              >
                {article.language === 'id' ? 'Lihat semua' : 'View all'}
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>
            <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {relatedInsights.map((item) => (
                <InsightCard key={item.id || item.slug} insight={item} language={article.language} />
              ))}
            </div>
          </section>
        )}

        {faq.length > 0 && (
          <section className="mx-auto w-full max-w-[820px] px-4 py-8 sm:px-6 sm:py-10 md:px-8" aria-labelledby="faq-title">
            <div className="border-t border-white/[0.08] pt-10">
              <h2 id="faq-title" className="scroll-mt-28 text-2xl font-display font-semibold tracking-[-0.03em] text-white sm:text-3xl">
                {article.language === 'id' ? 'Pertanyaan yang sering diajukan' : 'Frequently asked questions'}
              </h2>
              <div className="mt-5 space-y-3">
                {faq.map((item, index) => (
                  <details
                    key={index}
                    className="group rounded-2xl border border-white/[0.08] bg-white/[0.018] px-5 py-4 transition-[background-color,border-color] duration-300 open:border-brand-red/20 open:bg-brand-red/[0.025]"
                  >
                    <summary className="cursor-pointer list-none text-sm font-semibold leading-6 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0C0E]">
                      <span className="flex items-center justify-between gap-4">
                        {item.question}
                        <ChevronRight size={15} className="shrink-0 text-[#68707C] transition-transform duration-300 group-open:rotate-90" aria-hidden="true" />
                      </span>
                    </summary>
                    <p className="pt-3 text-sm leading-7 text-[#9BA2AF]">{item.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        )}

        <section
          ref={readingEndRef}
          className="mx-auto w-full max-w-[820px] px-5 py-8 sm:px-8 sm:py-10"
          aria-labelledby="insight-final-cta"
        >
          <div className="border-y border-white/[0.08] py-8 sm:py-9">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
              <div className="max-w-2xl">
                <p className="text-[9px] font-mono uppercase tracking-[0.18em] text-brand-red">
                  {article.language === 'id' ? 'Diskusi proyek' : 'Project discussion'}
                </p>
                <h2 id="insight-final-cta" className="mt-3 text-2xl font-display font-semibold leading-[1.08] tracking-[-0.035em] text-white sm:text-3xl">
                  {article.language === 'id'
                    ? 'Sudah tahu apa yang ingin Anda bangun atau perbaiki berikutnya?'
                    : 'Know what you want to build or improve next?'}
                </h2>
                <p className="mt-3 text-sm leading-7 text-[#89909D]">
                  {article.language === 'id'
                    ? 'Bawa konteks, pertanyaan, atau tantangan utamanya. Kami bisa membantu memetakan langkah berikutnya.'
                    : 'Bring the context, question, or challenge. We can help map the next step.'}
                </p>
              </div>
              <Link
                to="/contact"
                className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-2 rounded-full border border-brand-red/35 bg-brand-red/70 px-5 py-3 text-[9px] font-semibold uppercase tracking-[0.12em] text-white transition-[background-color,border-color,color] duration-300 hover:border-brand-red/55 hover:bg-brand-red/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/55"
              >
                {article.language === 'id' ? 'Mulai diskusi' : 'Start a discussion'}
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        <div className="mx-auto w-full max-w-[1240px] px-5 pb-12 sm:px-8 lg:px-10">
          <Link
            to="/insights"
            className="inline-flex min-h-[42px] items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.11em] text-[#858C99] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60"
          >
            <ArrowLeft size={14} aria-hidden="true" />
            {article.language === 'id' ? 'Kembali ke Insight' : 'Back to Insights'}
          </Link>
        </div>
      </>
    </InsightDetailErrorBoundary>
  );
};

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
import { deriveInsightFaq, normalizeInsightFaq } from '../lib/insightFaq.mjs';
import { getInsightFallback } from '../data/insightFallbacks';

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
  const explicit = normalizeInsightFaq(article.faq);

  return explicit.length > 0
    ? explicit
    : deriveInsightFaq(article.content, article.language);
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
  const readingEndRef = useRef<HTMLDivElement | null>(null);
  const languageInitializedRef = useRef(false);
  const articleLanguageRef = useRef<InsightItem['language'] | null>(null);
  const initialFallback = getInsightFallback(slug);
  const [article, setArticle] = useState<InsightItem | null>(() => initialFallback);
  const [loading, setLoading] = useState(() => !initialFallback);
  const [notFound, setNotFound] = useState(false);
  const [loadError, setLoadError] = useState<'network' | 'content' | null>(null);
  const [shareState, setShareState] = useState<'idle' | 'copied' | 'shared'>('idle');
  const [readingProgress, setReadingProgress] = useState(0);
  const [relatedInsights, setRelatedInsights] = useState<InsightItem[]>([]);

  useEffect(() => {
    languageInitializedRef.current = false;
    articleLanguageRef.current = null;
    const localFallback = getInsightFallback(slug);
    setArticle(localFallback);
    setLoading(!localFallback);
    setNotFound(false);
    setLoadError(null);
    setReadingProgress(0);
    setRelatedInsights([]);

    let cancelled = false;

    void api.cms.getInsightBySlug(slug)
      .then((res) => {
        if (cancelled) return;

        if (!res.success || !res.data?.insight || res.data.insight.status !== 'published') {
          const fallbackArticle = getInsightFallback(slug);

          if (fallbackArticle) {
            console.warn('[Kapitech Insight] using local editorial fallback:', {
              slug: fallbackArticle.slug,
              language: fallbackArticle.language,
              reason: res.error || 'Published CMS article unavailable'
            });
            setArticle(fallbackArticle);
            setLoadError(null);
            return;
          }

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
        const contentBlocks = Array.isArray(nextArticle.content) ? nextArticle.content : [];
        const hasRenderableContent = contentBlocks.some((block) =>
          block?.type === 'paragraph' || block?.type === 'heading' || block?.type === 'list' || block?.type === 'quote'
        );

        if (validation.errors.length > 0) {
          console.error('[Kapitech Insight] published content failed validation:', {
            slug: nextArticle.slug,
            errors: validation.errors,
            warnings: validation.warnings
          });

          const fallbackArticle = getInsightFallback(slug);

          if (fallbackArticle) {
            console.warn('[Kapitech Insight] using local editorial fallback after validation failure:', {
              slug: fallbackArticle.slug,
              language: fallbackArticle.language
            });
            setArticle(fallbackArticle);
            setLoadError(null);
            return;
          }

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

        if (!hasRenderableContent) {
          const fallbackArticle = getInsightFallback(slug);

          if (fallbackArticle) {
            console.warn('[Kapitech Insight] CMS returned no renderable body; keeping local editorial fallback:', {
              slug: fallbackArticle.slug,
              language: fallbackArticle.language
            });
            setArticle(fallbackArticle);
            setLoadError(null);
            return;
          }

          enablePrerenderedInsightFallback();
          setLoadError('content');
          return;
        }

        setArticle(nextArticle);
      })
      .catch((error: unknown) => {
        if (cancelled) return;

        const fallbackArticle = getInsightFallback(slug);

        if (fallbackArticle) {
          console.warn('[Kapitech Insight] using local editorial fallback after request exception:', {
            slug: fallbackArticle.slug,
            language: fallbackArticle.language
          });
          setArticle(fallbackArticle);
          setLoadError(null);
          return;
        }

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

  const bodyBlocks = useMemo(() => {
    const source = firstHeadingIndex > -1 ? blocks.slice(firstHeadingIndex) : [];

    const isMvpValidationInsight = article?.slug?.startsWith('mvp-vs-prototype-vs-proof-of-concept');

    if (!isMvpValidationInsight) {
      return source;
    }

    let promoCount = 0;
    return source.filter((block) => {
      if (block?.type !== 'promo') return true;
      promoCount += 1;
      return promoCount === 1;
    });
  }, [article?.slug, blocks, firstHeadingIndex]);

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
      <section className="relative flex min-h-[70vh] w-full items-center overflow-hidden bg-[#0B0C0E] px-4 pt-28 sm:px-6 md:px-12">
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
      <section className="relative flex min-h-[70vh] w-full items-center overflow-hidden bg-[#0B0C0E] px-4 pt-28 sm:px-6 md:px-12">
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
        <div className="relative z-10 mx-auto w-full max-w-[980px]">
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
          <InsightAmbientBackground intensity="hero" />

          <div className="relative z-10 w-full px-4 pb-14 pt-32 sm:px-6 sm:pb-16 sm:pt-36 md:px-12 lg:pb-20 lg:pt-40">
            <div className="mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-[minmax(0,1.04fr)_minmax(320px,0.76fr)] lg:gap-14">
              <div className="min-w-0">
                <nav
                  className="mb-7 flex items-center gap-2 overflow-x-auto text-[9px] font-mono uppercase tracking-[0.13em] text-[#69717D]"
                  aria-label="Breadcrumb"
                >
                  <Link
                    to="/"
                    className="shrink-0 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/55"
                  >
                    {article.language === 'id' ? 'Beranda' : 'Home'}
                  </Link>
                  <ChevronRight size={11} className="shrink-0" aria-hidden="true" />
                  <Link
                    to="/insights"
                    className="shrink-0 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/55"
                  >
                    {article.language === 'id' ? 'Insight' : 'Insights'}
                  </Link>
                  <ChevronRight size={11} className="shrink-0" aria-hidden="true" />
                  <span className="truncate text-[#A2A8B4]">{category || 'Insight'}</span>
                </nav>

                <div className="inline-flex max-w-full flex-wrap items-center gap-2 rounded-full border border-white/[0.09] bg-[#0B0C0E]/45 px-3.5 py-2 text-[9px] font-mono uppercase tracking-[0.16em] text-[#A2A8B4] backdrop-blur-md">
                  <span className="relative flex h-1.5 w-1.5 shrink-0">
                    <span className="absolute inset-0 rounded-full bg-brand-red/35" />
                    <span className="relative block h-1.5 w-1.5 rounded-full bg-brand-red" />
                  </span>
                  <span className="text-brand-red">{category || 'Insight'}</span>
                  <span className="text-[#5E6672]">/</span>
                  <span>{article.editorialMeta?.editorialType || (article.language === 'id' ? 'Panduan' : 'Guide')}</span>
                </div>

                <h1 className="mt-7 max-w-[880px] font-display text-[2.8rem] font-semibold leading-[0.96] tracking-[-0.058em] text-white sm:text-6xl lg:text-[5.3rem]">
                  {article.title}
                </h1>

                {article.excerpt && (
                  <p className="mt-6 max-w-2xl text-[15px] leading-7 text-[#A2A8B4] sm:text-base sm:leading-8 lg:text-[1.03rem]">
                    {article.excerpt}
                  </p>
                )}

                <div className="mt-8 grid max-w-2xl gap-4 border-t border-white/[0.07] pt-5 sm:grid-cols-[minmax(0,1.35fr)_auto_auto] sm:items-end">
                  <div className="min-w-0">
                    <p className="text-[9px] font-mono uppercase tracking-[0.15em] text-[#626A76]">
                      {article.language === 'id' ? 'Ditulis oleh' : 'Written by'}
                    </p>
                    <p className="mt-1 truncate text-sm font-medium text-white">
                      {article.author?.name || 'Kapitech Editorial'}
                    </p>
                    {article.author?.role && (
                      <p className="mt-0.5 truncate text-[10px] text-[#6E7582]">{article.author.role}</p>
                    )}
                  </div>

                  <div className="sm:border-l sm:border-white/[0.07] sm:pl-5">
                    <p className="text-[9px] font-mono uppercase tracking-[0.15em] text-[#626A76]">
                      {article.language === 'id' ? 'Waktu baca' : 'Reading time'}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white">
                      {article.readingTime || '—'} {article.readingTime ? (article.language === 'id' ? 'menit' : 'min') : ''}
                    </p>
                  </div>

                  <div className="sm:border-l sm:border-white/[0.07] sm:pl-5">
                    <p className="text-[9px] font-mono uppercase tracking-[0.15em] text-[#626A76]">
                      {article.language === 'id' ? 'Diterbitkan' : 'Published'}
                    </p>
                    <time dateTime={article.publishedAt || undefined} className="mt-1 block text-sm font-semibold text-white">
                      {article.publishedAt ? formatDate(article.publishedAt, article.language) : '—'}
                    </time>
                  </div>
                </div>
              </div>

              <figure className="relative overflow-hidden rounded-[28px] border border-white/[0.09] bg-[#0B0C0E]/58 shadow-[0_28px_90px_-58px_rgba(0,0,0,0.95)] backdrop-blur-xl">
                <div className="border-b border-white/[0.07] px-5 py-3.5 sm:px-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[9px] font-mono uppercase tracking-[0.16em] text-brand-red">
                        {article.language === 'id' ? 'Peta validasi' : 'Validation map'}
                      </p>
                      <p className="mt-1 text-[10px] text-[#68707C]">
                        {article.language === 'id'
                          ? 'Pengalaman / Nilai / Kelayakan'
                          : 'Experience / Value / Feasibility'}
                      </p>
                    </div>
                    <span className="rounded-full border border-white/[0.08] bg-white/[0.025] px-2.5 py-1 font-mono text-[8px] font-semibold tracking-[0.12em] text-[#7A8290]">
                      01 / 03
                    </span>
                  </div>
                </div>

                <div className="aspect-[4/3] bg-[#090A0C]">
                  <img
                    src={article.language === 'id'
                      ? '/insights/mvp-vs-prototype-vs-proof-of-concept/hero.svg'
                      : '/insights/mvp-vs-prototype-vs-proof-of-concept/hero-en.svg'}
                    alt={article.coverImageAlt?.trim() || article.title}
                    width={coverWidth || 1600}
                    height={coverHeight || 900}
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                    className="block h-full w-full object-cover"
                    onError={(event) => {
                      const fallback = '/insights/mvp-vs-prototype-vs-proof-of-concept/hero.svg';
                      if (event.currentTarget.src.endsWith(fallback)) return;
                      event.currentTarget.src = fallback;
                    }}
                  />
                </div>

                <figcaption className="flex items-center justify-between gap-4 border-t border-white/[0.07] px-5 py-3.5 sm:px-6">
                  <span className="text-[9px] font-mono uppercase tracking-[0.14em] text-[#69717D]">
                    {article.language === 'id'
                      ? 'Satu pertanyaan utama, satu alat validasi.'
                      : 'One key question, one validation instrument.'}
                  </span>
                  <span className="shrink-0 text-[9px] font-semibold uppercase tracking-[0.12em] text-white">
                    Kapitech
                  </span>
                </figcaption>
              </figure>
            </div>
          </div>
        </header>

        <section
          className="w-full border-b border-white/[0.07]"
          aria-label={article.language === 'id' ? 'Artikel Insight' : 'Insight article'}
        >
          <div className="mx-auto w-full max-w-7xl">
            <div className="border-b border-white/[0.07] px-4 py-4 sm:px-6 md:px-12 xl:hidden">
              <InsightLeftRail
                mobile
                language={article.language}
                readingProgress={readingProgress}
                shareState={shareState}
                onShare={() => void shareArticle()}
              />
              {toc.length > 0 && (
                <div className="mt-3">
                  <InsightTableOfContents items={toc} language={article.language} variant="mobile" />
                </div>
              )}
            </div>

            <div className="xl:grid xl:grid-cols-[56px_minmax(0,1fr)_320px]">
              <div className="hidden border-r border-white/[0.07] px-2 py-12 xl:block">
                <InsightLeftRail
                  language={article.language}
                  readingProgress={readingProgress}
                  shareState={shareState}
                  onShare={() => void shareArticle()}
                />
              </div>

              <article
                ref={articleReadingRef}
                className="min-w-0 w-full max-w-[820px] justify-self-center px-4 py-10 text-[#C3C7D0] sm:px-6 sm:py-14 xl:px-0 xl:py-16"
              >
                {introductionBlocks.length > 0 && (
                  <section
                    className="mb-12 border-b border-white/[0.07] pb-10 sm:mb-14 sm:pb-12"
                    aria-label={article.language === 'id' ? 'Pendahuluan' : 'Introduction'}
                  >
                    <p className="mb-5 text-[9px] font-mono uppercase tracking-[0.18em] text-[#69717D]">
                      {article.language === 'id' ? 'Mulai dari sini' : 'Start here'}
                    </p>
                    <InsightContentRenderer
                      blocks={introductionBlocks}
                      headingIds={[]}
                      language={article.language}
                    />
                  </section>
                )}

                {Array.isArray(article.keyTakeaways) && article.keyTakeaways.length > 0 && (
                  <section
                    className="mb-14 border-y border-white/[0.08] py-8 sm:py-10"
                    aria-labelledby="key-takeaways-title"
                  >
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
                      <ul className="space-y-3.5">
                        {article.keyTakeaways.map((item, index) => (
                          <li key={index} className="flex gap-3 text-[14px] leading-7 text-[#CBD0D8] sm:text-[15px]">
                            <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-red" aria-hidden="true" />
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

                {article.author && (
                  <section className="mt-14 border-t border-white/[0.07] pt-8" aria-labelledby="author-title">
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

                <div ref={readingEndRef} data-insight-article-end aria-hidden="true" className="h-px w-full" />
              </article>

              <div className="hidden border-l border-white/[0.07] px-5 py-12 xl:block">
                <InsightRightRail items={toc} language={article.language} />
              </div>
            </div>
          </div>
        </section>

        {relatedInsights.length > 0 && (
          <section className="w-full border-t border-white/[0.07] px-4 py-14 sm:px-6 sm:py-16 md:px-12" aria-labelledby="related-title">
            <div className="mx-auto w-full max-w-7xl">
            <div className="flex items-end justify-between gap-4">
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
          </div>
          </section>
        )}

        {faq.length > 0 && (
          <section className="w-full border-t border-white/[0.07] px-4 py-14 sm:px-6 sm:py-16 md:px-12" aria-labelledby="faq-title">
            <div className="mx-auto w-full max-w-[820px]">
              <p className="text-[9px] font-mono uppercase tracking-[0.18em] text-[#69717D]">
                {article.language === 'id' ? 'Pertanyaan' : 'Questions'}
              </p>
              <h2 id="faq-title" className="mt-2 scroll-mt-28 text-2xl font-display font-semibold tracking-[-0.03em] text-white sm:text-3xl">
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

        <div className="w-full px-4 pb-12 sm:px-6 md:px-12">
          <div className="mx-auto w-full max-w-7xl">
          <Link
            to="/insights"
            className="inline-flex min-h-[42px] items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.11em] text-[#858C99] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60"
          >
            <ArrowLeft size={14} aria-hidden="true" />
            {article.language === 'id' ? 'Kembali ke Insight' : 'Back to Insights'}
          </Link>
          </div>
        </div>
      </>
    </InsightDetailErrorBoundary>
  );
};

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ChevronRight } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { InsightContentRenderer } from '../components/InsightContentRenderer';
import PatternWaves from '../components/ui/PatternWaves/PatternWavesTyped';
import { InsightLeftRail } from '../components/InsightLeftRail';
import { InsightRightRail } from '../components/InsightRightRail';
import { InsightSeoMeta } from '../components/InsightSeoMeta';
import { InsightTableOfContents } from '../components/InsightTableOfContents';
import { InsightBookingCta } from '../components/InsightBookingCta';
import { InsightCard } from '../components/InsightCard';
import { api } from '../lib/apiClient';
import { useLanguage } from '../lib/LanguageContext';
import type { InsightItem } from '../data/insightTypes';
import { buildInsightHeadingIds, buildInsightToc } from '../lib/insightHeadingIds';
import { validateInsightContent } from '../lib/insightContentValidation';
import { deriveInsightFaq, normalizeInsightFaq } from '../lib/insightFaq.mjs';
import { getAllInsightFallbacks, getInsightFallback } from '../data/insightFallbacks';
import { splitInsightBlocks } from '../lib/insightArticlePresentation.mjs';
import { trackEvent } from '../lib/analytics';

type InsightShareState = 'idle' | 'copied' | 'shared';

function isPinnedEditorialSnapshot(slug: string): boolean {
  return slug === 'mvp-vs-prototype-vs-proof-of-concept-guide'
    || slug === 'mvp-vs-prototype-vs-proof-of-concept';
}

function validFaq(article: InsightItem): Array<{ question: string; answer: string }> {
  const explicit = normalizeInsightFaq(article.faq);

  return explicit.length > 0
    ? explicit
    : deriveInsightFaq(article.content, article.language);
}

function getLocalRelatedInsights(article: InsightItem): InsightItem[] {
  const currentTags = new Set((article.tags || []).map((tag) => tag.slug));
  const candidates = getAllInsightFallbacks()
    .filter((item) => item.slug !== article.slug && item.language === article.language && item.status === 'published')
    .map((item) => ({
      item,
      score: (item.tags || []).reduce((score, tag) => score + (currentTags.has(tag.slug) ? 2 : 0), 0)
        + (item.categoryId && item.categoryId === article.categoryId ? 1 : 0)
    }))
    .sort((a, b) => b.score - a.score);

  return candidates.slice(0, 3).map(({ item }) => item);
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

  prerender.classList.remove('pointer-events-none', 'fixed', 'z-0', 'opacity-0');
  prerender.classList.add('pointer-events-auto', 'relative');
  prerender.setAttribute('aria-hidden', 'false');
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
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-brand-red px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.11em] text-white transition-colors hover:bg-[#FF1E27] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35"
            >
              {this.props.language === 'id' ? 'Muat ulang' : 'Reload'}
            </button>
            <Link
              to="/insights"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.04] px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.11em] text-white transition-colors hover:border-white/[0.16] hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35"
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
  const languageInitializedRef = useRef(false);
  const articleLanguageRef = useRef<InsightItem['language'] | null>(null);
  const initialFallback = getInsightFallback(slug);
  const [article, setArticle] = useState<InsightItem | null>(() => initialFallback);
  const [loading, setLoading] = useState(() => !initialFallback);
  const [notFound, setNotFound] = useState(false);
  const [loadError, setLoadError] = useState<'network' | 'content' | null>(null);
  const [shareState, setShareState] = useState<InsightShareState>('idle');
  const [readingProgress, setReadingProgress] = useState(0);
  const [relatedInsights, setRelatedInsights] = useState<InsightItem[]>([]);
  const trackedProgressRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    languageInitializedRef.current = false;
    articleLanguageRef.current = null;
    const localFallback = getInsightFallback(slug);
    setArticle(localFallback);
    setLoading(!localFallback);
    setNotFound(false);
    setLoadError(null);
    setShareState('idle');
    setReadingProgress(0);

    let cancelled = false;

    // Keep the approved bilingual MVP guide pinned to its editorial source. Other local
    // packs are resilience fallbacks and must still be refreshed from the CMS when available.
    if (localFallback && isPinnedEditorialSnapshot(slug)) {
      setLoading(false);
      return () => {
        cancelled = true;
      };
    }

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
        const hasRenderableContent = contentBlocks.some((block) => block && block.type !== 'divider');

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
    if (!article) {
      setRelatedInsights([]);
      return;
    }

    if (Array.isArray(article.relatedInsights) && article.relatedInsights.length > 0) {
      setRelatedInsights(
        article.relatedInsights
          .filter((item) => item?.id && item.id !== article.id && item.status === 'published')
          .slice(0, 3)
      );
      return;
    }

    let cancelled = false;

    void api.cms.getInsights({
      language: article.language,
      categoryId: article.categoryId || undefined,
      page: 1,
      pageSize: 9
    }).then((res) => {
      if (cancelled || !res.success) return;

      const source = Array.isArray(res.data?.insights) ? res.data.insights : [];
      const currentTags = new Set((article.tags || []).map((tag) => tag.slug));

      const ranked = source
        .filter((item) => item?.id && item.id !== article.id && item.status === 'published')
        .map((item) => ({
          item,
          score: (item.tags || []).reduce((score, tag) => score + (currentTags.has(tag.slug) ? 2 : 0), 0)
            + (item.categoryId && item.categoryId === article.categoryId ? 1 : 0)
        }))
        .sort((a, b) => b.score - a.score)
        .map(({ item }) => item)
        .slice(0, 3);

      setRelatedInsights(ranked.length > 0 ? ranked : getLocalRelatedInsights(article));
    }).catch(() => {
      if (!cancelled) setRelatedInsights(getLocalRelatedInsights(article));
    });

    return () => {
      cancelled = true;
    };
  }, [article]);

  useEffect(() => {
    if (!article) return;

    trackedProgressRef.current = new Set();
    trackEvent('article_view', {
      article_slug: article.slug,
      article_title: article.title,
      article_category: article.category?.slug || article.categoryId || undefined,
      reading_time_minutes: article.readingTime || undefined
    });
  }, [article]);

  useEffect(() => {
    if (!article) return;

    for (const threshold of [25, 50, 75, 90]) {
      if (readingProgress >= threshold && !trackedProgressRef.current.has(threshold)) {
        trackedProgressRef.current.add(threshold);
        trackEvent('article_scroll_depth', {
          article_slug: article.slug,
          depth_percent: threshold
        });
      }
    }
  }, [article, readingProgress]);

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

  useLayoutEffect(() => {
    if (!article) return;
    removePrerenderedInsight();
  }, [article]);

  useEffect(() => {
    return () => {
      removePrerenderedInsight();
    };
  }, []);

  const presentation = useMemo(
    () => splitInsightBlocks(article && Array.isArray(article.content) ? article.content : []),
    [article]
  );

  const { introductionBlocks, bodyBlocks } = presentation;

  const headingIds = useMemo(() => buildInsightHeadingIds(bodyBlocks), [bodyBlocks]);

  const faq = useMemo(
    () => article ? validFaq(article) : [],
    [article]
  );

  const toc = useMemo(
    () => buildInsightToc(bodyBlocks, headingIds),
    [bodyBlocks, headingIds]
  );

  useEffect(() => {
    let rafId = 0;

    const update = () => {
      rafId = 0;
      const articleNode = articleReadingRef.current;
      if (!articleNode) return;

      const articleTop = window.scrollY + articleNode.getBoundingClientRect().top;
      const articleBottom = articleTop + articleNode.offsetHeight;
      const travel = Math.max(1, articleBottom - articleTop - window.innerHeight);
      const next = ((window.scrollY - articleTop) / travel) * 100;

      setReadingProgress(Math.max(0, Math.min(100, next)));
    };

    const schedule = () => {
      if (rafId !== 0) return;
      rafId = window.requestAnimationFrame(update);
    };

    const resizeObserver = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(schedule)
      : null;

    if (resizeObserver && articleReadingRef.current) {
      resizeObserver.observe(articleReadingRef.current);
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

  const copyLink = async () => {
    const url = window.location.href;
    let copied = false;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        copied = true;
      }
    } catch {
      copied = false;
    }

    if (!copied) {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = url;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        copied = document.execCommand('copy');
        textarea.remove();
      } catch {
        copied = false;
      }
    }

    setShareState(copied ? 'copied' : 'idle');

    if (copied) {
      window.setTimeout(() => {
        setShareState('idle');
      }, 1800);
    }
  };

  const shareArticle = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: article?.title || 'Kapitech Insight',
          url: window.location.href
        });
        setShareState('shared');
      } else {
        await copyLink();
        return;
      }

      window.setTimeout(() => {
        setShareState('idle');
      }, 1800);
    } catch {
      setShareState('idle');
    }
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
            className="mt-7 inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.035] px-5 py-3 text-[9px] font-semibold uppercase tracking-[0.12em] text-white transition-[background-color,border-color] duration-300 hover:border-white/[0.16] hover:bg-brand-red/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35"
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
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-brand-red px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.11em] text-white transition-colors hover:bg-[#FF1E27] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35"
            >
              {language === 'id' ? 'Muat ulang' : 'Reload'}
            </button>
            <Link
              to="/insights"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.035] px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.11em] text-white transition-colors hover:border-white/[0.16] hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35"
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
        <div className="mx-auto w-full max-w-[980px]">
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
            className="mt-7 inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.035] px-5 py-3 text-[9px] font-semibold uppercase tracking-[0.12em] text-white transition-[background-color,border-color] duration-300 hover:border-white/[0.16] hover:bg-brand-red/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35"
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

  return (
    <InsightDetailErrorBoundary language={article.language}>
      <>
        <InsightSeoMeta article={article} />

        <header className="kapi-page-hero relative overflow-hidden border-b border-white/[0.07] bg-[#0B0C0E]">
          <PatternWaves
            preset="lines"
            color="#E50914"
            backgroundColor="#0B0C0E"
            opacity={0.32}
            fade="edges"
            fadeSize={0.72}
            interactive
            cursorSize={52}
            cursorStrength={0.38}
            speed={0.2}
            scale={1.06}
            depth={0.62}
            shine={0.5}
            contrast={1.03}
            intro
          />
          <div
            className="absolute inset-0 bg-[#0B0C0E]/15"
            aria-hidden="true"
          />
          <div
            className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent via-[#0B0C0E]/40 to-[#0B0C0E]"
            aria-hidden="true"
          />
          <div className="relative mx-auto w-full max-w-[1600px] px-4 pb-16 pt-32 sm:px-6 sm:pb-20 sm:pt-36 md:px-12 md:pb-24 md:pt-40">
            <div className="grid items-start xl:grid-cols-[48px_minmax(0,1120px)_280px] xl:gap-6">
              <div className="min-w-0 xl:col-start-2 xl:px-12">
            <nav
              className="mb-9 flex items-center gap-2 overflow-x-auto text-[9px] font-mono uppercase tracking-[0.13em] text-[#646C78]"
              aria-label="Breadcrumb"
            >
              <Link
                to="/"
                className="shrink-0 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35"
              >
                {article.language === 'id' ? 'Beranda' : 'Home'}
              </Link>
              <ChevronRight size={11} className="shrink-0" aria-hidden="true" />
              <Link
                to="/insights"
                className="shrink-0 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35"
              >
                {article.language === 'id' ? 'Insight' : 'Insights'}
              </Link>
              {category && (
                <>
                  <ChevronRight size={11} className="shrink-0" aria-hidden="true" />
                  <span className="truncate text-[#A2A8B4]">{category}</span>
                </>
              )}
            </nav>

            <div className="max-w-none">
              <div className="flex flex-wrap items-center gap-2.5">
                {category && (
                  <span className="kapi-section-label mb-0">
                    {category}
                  </span>
                )}
                {article.editorialMeta?.editorialType && (
                  <span className="rounded-full border border-white/[0.08] bg-white/[0.018] px-3 py-1.5 text-[9px] font-mono uppercase tracking-[0.14em] text-[#8A909D]">
                    {article.editorialMeta.editorialType}
                  </span>
                )}
              </div>

              <h1 className="mt-6 max-w-5xl font-display text-4xl font-semibold leading-[0.98] tracking-[-0.055em] text-white sm:text-6xl lg:text-[5.25rem]">
                {article.title}
              </h1>

              {article.excerpt && (
                <p className="mt-6 max-w-3xl text-base leading-8 text-[#A3A9B5] sm:text-lg">
                  {article.excerpt}
                </p>
              )}

              <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-white/[0.07] pt-5">
                {article.author?.name && (
                  <span className="inline-flex items-center rounded-full border border-white/[0.1] bg-white/[0.035] px-3.5 py-1.5 text-[9px] font-mono font-semibold tracking-[0.08em] text-white">
                    {article.language === 'id' ? 'Ditulis oleh ' : 'Written by '}
                    {article.author.name}
                  </span>
                )}
                {article.author?.role && (
                  <span className="inline-flex items-center rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1.5 text-[9px] font-mono uppercase tracking-[0.14em] text-[#A2A9B6]">
                    {article.author.role}
                  </span>
                )}
                {article.readingTime ? (
                  <span className="inline-flex items-center rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1.5 text-[9px] font-mono tabular-nums text-[#A2A9B6]">
                    {article.readingTime} {article.language === 'id' ? 'menit baca' : 'min read'}
                  </span>
                ) : null}
                {article.editorialMeta?.reviewedBy && (
                  <span className="inline-flex items-center rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1.5 text-[9px] font-mono tracking-[0.08em] text-[#A2A9B6]">
                    {article.language === 'id' ? 'Ditinjau oleh ' : 'Reviewed by '}
                    {article.editorialMeta.reviewedBy}
                  </span>
                )}
                {article.publishedAt && (
                  <time
                    dateTime={article.publishedAt}
                    className="inline-flex items-center rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1.5 text-[9px] font-mono tabular-nums text-[#7D8592]"
                  >
                    {article.language === 'id' ? 'Terbit ' : 'Published '}
                    {new Date(article.publishedAt).toLocaleDateString(article.language === 'id' ? 'id-ID' : 'en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </time>
                )}
                {article.updatedAt && article.updatedAt !== article.publishedAt && (
                  <time
                    dateTime={article.updatedAt}
                    className="inline-flex items-center rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1.5 text-[9px] font-mono tabular-nums text-[#7D8592]"
                  >
                    {article.language === 'id' ? 'Diperbarui ' : 'Updated '}
                    {new Date(article.updatedAt).toLocaleDateString(article.language === 'id' ? 'id-ID' : 'en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </time>
                )}
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Link
                  to="/editorial-policy"
                  className="inline-flex min-h-9 items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.025] px-3.5 text-[9px] font-semibold uppercase tracking-[0.11em] text-[#A2A9B6] transition-[background-color,border-color,color] duration-200 hover:border-brand-red/35 hover:bg-brand-red/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35"
                >
                  {article.language === 'id' ? 'Standar editorial' : 'Editorial standards'}
                </Link>
                <a
                  href="#insight-content"
                  data-analytics-event="insight_start_reading"
                  className="inline-flex min-h-9 items-center gap-2 rounded-full border border-brand-red/30 bg-brand-red/[0.08] px-3.5 text-[9px] font-semibold uppercase tracking-[0.11em] text-white transition-[background-color,border-color] duration-200 hover:border-brand-red/55 hover:bg-brand-red/[0.14] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35"
                >
                  {article.language === 'id' ? 'Mulai membaca' : 'Start reading'}
                  <ArrowRight size={13} aria-hidden="true" />
                </a>
              </div>
              </div>
            </div>
            </div>
          </div>
        </header>

        <div className="mx-auto w-full max-w-[1600px] scroll-mt-28 px-5 pb-16 pt-8 sm:px-8 sm:pt-10 lg:px-10 lg:pb-20 lg:pt-12">
          <div className="mb-5 xl:hidden">
            <InsightLeftRail
              mobile
              language={article.language}
              readingProgress={readingProgress}
              shareState={shareState}
              onShare={() => void shareArticle()}
              onCopy={() => void copyLink()}
            />
            {toc.length > 0 && (
              <InsightTableOfContents items={toc} language={article.language} variant="mobile" />
            )}
            <div className="mt-3">
              <InsightBookingCta language={article.language} mobile />
            </div>
          </div>

          <div className="grid items-start gap-8 xl:grid-cols-[64px_minmax(0,1120px)_304px]">
            <InsightLeftRail
              language={article.language}
              readingProgress={readingProgress}
              shareState={shareState}
              onShare={() => void shareArticle()}
              onCopy={() => void copyLink()}
            />

            <article
              id="insight-content"
              ref={articleReadingRef}
              className="min-w-0 w-full justify-self-center scroll-mt-28 px-0 sm:px-2 lg:px-8 text-[#C3C7D0]"
            >
              {introductionBlocks.length > 0 && (
                <section
                  className="mb-12 sm:mb-14"
                  aria-label={article.language === 'id' ? 'Pendahuluan' : 'Introduction'}
                >
                  <InsightContentRenderer
                    blocks={introductionBlocks}
                    headingIds={[]}
                    language={article.language}
                  />
                </section>
              )}

              {Array.isArray(article.keyTakeaways) && article.keyTakeaways.length > 0 && (
                <section
                  className="mb-10 overflow-hidden rounded-[18px] border border-white/[0.08] bg-[#111216] shadow-[inset_0_1px_0_rgba(255,255,255,0.018)] sm:mb-12"
                  aria-labelledby="key-takeaways-title"
                >
                  <div className="flex items-center justify-between gap-4 border-b border-white/[0.06] px-5 py-4 sm:px-6">
                    <div className="min-w-0">
                      <p id="key-takeaways-title" className="text-[9px] font-mono font-semibold uppercase tracking-[0.18em] text-brand-red">
                        {article.language === 'id' ? 'Poin utama' : 'Key takeaways'}
                      </p>
                      <p className="mt-1.5 text-xs leading-5 text-[#7D8592]">
                        {article.language === 'id'
                          ? 'Inti yang perlu diingat sebelum membaca detail.'
                          : 'The main ideas to keep in mind before the details.'}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full border border-white/[0.07] bg-white/[0.025] px-2.5 py-1 font-mono text-[8px] font-semibold tabular-nums text-[#626A76]">
                      {article.keyTakeaways.length}
                    </span>
                  </div>

                  <ul className="grid gap-px bg-white/[0.045] sm:grid-cols-2">
                    {article.keyTakeaways.map((item, index) => (
                      <li
                        key={index}
                        className="flex gap-3 bg-[#111216] px-5 py-3.5 text-sm leading-6 text-[#CBD0D8] transition-colors duration-200 hover:bg-[#15161A] sm:px-6"
                      >
                        <span
                          className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-red/[0.11] font-mono text-[8px] font-semibold tabular-nums text-brand-red"
                          aria-hidden="true"
                        >
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {bodyBlocks.length > 0 && (
                <InsightContentRenderer
                  blocks={bodyBlocks}
                  headingIds={headingIds.map((id) => id || '')}
                  language={article.language}
                />
              )}

            </article>

            <InsightRightRail items={toc} language={article.language} />
          </div>

          {faq.length > 0 && (
            <div className="grid items-start gap-8 xl:grid-cols-[64px_minmax(0,1120px)_304px]">
              <div className="hidden xl:block" aria-hidden="true" />
              <section
              className="mx-auto mt-16 w-full max-w-[1120px] border-t border-white/[0.07] px-0 pt-10 sm:px-2 sm:pt-12 lg:px-8 sm:mt-20"
              aria-labelledby="faq-title"
            >
              <div className="max-w-2xl">
                <span className="kapi-section-label mb-4">
                  FAQ
                </span>
                <h2
                  id="faq-title"
                  className="mt-3 font-display text-2xl font-semibold tracking-[-0.035em] text-white sm:text-3xl"
                >
                  {article.language === 'id' ? 'Pertanyaan yang sering diajukan' : 'Frequently asked questions'}
                </h2>
                <p className="mt-3 text-sm leading-7 text-[#8A909D]">
                  {article.language === 'id'
                    ? 'Jawaban singkat untuk pertanyaan yang paling sering muncul setelah membaca artikel ini.'
                    : 'Short answers to the questions readers are most likely to have after this article.'}
                </p>
              </div>

              <div className="mt-6 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.012]">
                {faq.map((item, index) => (
                  <details
                    key={index}
                    className="group border-b border-white/[0.07] last:border-b-0 transition-colors duration-200"
                  >
                    <summary className="list-none cursor-pointer px-4 py-4 transition-colors duration-200 group-open:bg-white/[0.018] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/35 sm:px-5 sm:py-5">
                      <span className="grid grid-cols-[28px_minmax(0,1fr)_20px] items-start gap-3">
                        <span
                          className="pt-0.5 font-mono text-[9px] font-semibold tabular-nums text-[#5E6672] transition-colors duration-200 group-open:text-brand-red"
                          aria-hidden="true"
                        >
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className="text-sm font-semibold leading-6 text-white transition-colors duration-200 group-open:text-brand-red sm:text-[15px]">
                          {item.question}
                        </span>
                        <ChevronRight
                          size={15}
                          className="mt-1 text-[#666E7B] transition-[transform,color] duration-200 group-open:rotate-90 group-open:text-brand-red"
                          aria-hidden="true"
                        />
                      </span>
                    </summary>
                    <div className="grid grid-cols-[28px_minmax(0,1fr)_20px] gap-3 px-4 pb-5 sm:px-5">
                      <span aria-hidden="true" />
                      <p className="text-sm leading-7 text-[#9BA2AF]">
                        {item.answer}
                      </p>
                      <span aria-hidden="true" />
                    </div>
                  </details>
                ))}
              </div>
              </section>
              <div className="hidden xl:block" aria-hidden="true" />
            </div>
          )}

          {relatedInsights.length > 0 && (
            <section
              className="mx-auto mt-16 w-full max-w-[1120px] border-t border-white/[0.07] px-0 pt-10 sm:px-2 sm:pt-12 lg:px-12 sm:mt-20"
              aria-labelledby="related-insights-title"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div className="max-w-2xl">
                  <span className="kapi-section-label mb-4">
                    {article.language === 'id' ? 'Lanjut membaca' : 'Continue reading'}
                  </span>
                  <h2
                    id="related-insights-title"
                    className="mt-3 font-display text-2xl font-semibold tracking-[-0.035em] text-white sm:text-3xl"
                  >
                    {article.language === 'id' ? 'Insight yang masih relevan' : 'More insights worth reading'}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-[#8A909D]">
                    {article.language === 'id'
                      ? 'Lanjutkan dari topik yang paling dekat dengan keputusan produk Anda.'
                      : 'Continue with topics closest to the product decision you are making.'}
                  </p>
                </div>
                <Link
                  to="/insights"
                  className="inline-flex min-h-9 items-center gap-2 self-start rounded-full border border-white/[0.08] bg-white/[0.025] px-3.5 text-[9px] font-semibold uppercase tracking-[0.11em] text-[#A2A9B6] transition-[background-color,border-color,color] duration-200 hover:border-brand-red/35 hover:bg-brand-red/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35 sm:self-auto"
                >
                  {article.language === 'id' ? 'Semua Insight' : 'All Insights'}
                  <ArrowRight size={13} aria-hidden="true" />
                </Link>
              </div>

              <div className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {relatedInsights.map((item) => (
                  <InsightCard key={item.id} insight={item} language={article.language} analyticsContext="related" />
                ))}
              </div>
            </section>
          )}

          <div className="grid items-start gap-8 xl:grid-cols-[64px_minmax(0,1120px)_304px]">
            <div className="hidden xl:block" aria-hidden="true" />
            <section
              className="w-full mt-16 px-0 sm:mt-20 sm:px-2 lg:px-8"
              aria-labelledby="article-final-cta-title"
            >
            <div className="overflow-hidden rounded-[24px] border border-white/[0.08] bg-[#111216] shadow-[inset_0_1px_0_rgba(255,255,255,0.018)]">
              <div className="flex flex-col gap-7 p-6 sm:p-8 lg:flex-row lg:items-end lg:justify-between lg:p-9">
                <div className="max-w-2xl">
                  <span className="kapi-section-label mb-4">
                    {article.language === 'id' ? 'Dari insight ke eksekusi' : 'From insight to execution'}
                  </span>
                  <h2
                    id="article-final-cta-title"
                    className="mt-3 font-display text-2xl font-semibold leading-[1.08] tracking-[-0.035em] text-white sm:text-3xl"
                  >
                    {article.language === 'id'
                      ? 'Ingin menerapkan insight ini ke proyek Anda?'
                      : 'Have a question about applying this insight?'}
                  </h2>
                  <p className="mt-3 max-w-xl text-sm leading-7 text-[#8A909D]">
                    {article.language === 'id'
                      ? 'Ceritakan hal yang ingin Anda perbaiki. Kami bantu menentukan langkah berikutnya, mulai dari strategi, desain, hingga engineering.'
                      : 'Tell us what you are trying to improve. We will help identify the next practical step across strategy, design, or engineering.'}
                  </p>
                </div>

                <Link
                  to="/contact"
                  data-analytics-event="insight_contact_cta_click"
                  className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-brand-red px-5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white transition-[background-color,box-shadow,transform] duration-200 hover:bg-brand-red-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/45"
                >
                  {article.language === 'id' ? 'Diskusikan proyek Anda' : 'Discuss your project'}
                  <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </div>
            </div>
            </section>
            <div className="hidden xl:block" aria-hidden="true" />
          </div>

          <div className="grid items-start gap-8 xl:grid-cols-[64px_minmax(0,1120px)_304px]">
            <div className="hidden xl:block" aria-hidden="true" />
            <div className="w-full mt-8 px-0 sm:px-2 lg:px-8">
              <Link
                to="/insights"
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#8C94A1] underline decoration-white/15 underline-offset-4 transition-colors hover:text-white hover:decoration-white/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35"
              >
                <ArrowLeft size={14} aria-hidden="true" />
                {article.language === 'id' ? 'Kembali ke Insight' : 'Back to Insights'}
              </Link>
            </div>
            <div className="hidden xl:block" aria-hidden="true" />
          </div>
        </div>
      </>
    </InsightDetailErrorBoundary>
  );
};

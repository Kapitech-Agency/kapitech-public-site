import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
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

type InsightShareState = 'idle' | 'copied' | 'shared';

function validFaq(article: InsightItem): Array<{ question: string; answer: string }> {
  const explicit = normalizeInsightFaq(article.faq);

  return explicit.length > 0
    ? explicit
    : deriveInsightFaq(article.content, article.language);
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
  const languageInitializedRef = useRef(false);
  const articleLanguageRef = useRef<InsightItem['language'] | null>(null);
  const initialFallback = getInsightFallback(slug);
  const [article, setArticle] = useState<InsightItem | null>(() => initialFallback);
  const [loading, setLoading] = useState(() => !initialFallback);
  const [notFound, setNotFound] = useState(false);
  const [loadError, setLoadError] = useState<'network' | 'content' | null>(null);
  const [copied, setCopied] = useState(false);
  const [shareState, setShareState] = useState<InsightShareState>('idle');
  const [readingProgress, setReadingProgress] = useState(0);


  useEffect(() => {
    languageInitializedRef.current = false;
    articleLanguageRef.current = null;
    const localFallback = getInsightFallback(slug);
    setArticle(localFallback);
    setLoading(!localFallback);
    setNotFound(false);
    setLoadError(null);
    setCopied(false);
    setShareState('idle');
    setReadingProgress(0);

    let cancelled = false;

    // This editorial snapshot is the authoritative source for the MVP comparison article.
    // The CMS remains available to the rest of the Insight library, but an incomplete CMS
    // payload must never blank this published article.
    if (localFallback) {
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
    if (!article) return;
    removePrerenderedInsight();
  }, [article]);

  useEffect(() => {
    return () => {
      removePrerenderedInsight();
    };
  }, []);

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

  useEffect(() => {
    const updateProgress = () => {
      const articleNode = articleReadingRef.current;

      if (!articleNode) {
        setReadingProgress(0);
        return;
      }

      const rect = articleNode.getBoundingClientRect();
      const articleTop = rect.top + window.scrollY;
      const articleBottom = articleTop + articleNode.offsetHeight;
      const start = Math.max(0, articleTop - 120);
      const end = Math.max(start + 1, articleBottom - window.innerHeight + 120);
      const progress = ((window.scrollY - start) / (end - start)) * 100;

      setReadingProgress(Math.max(0, Math.min(100, progress)));
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);

    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, [article]);

  const copyLink = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: article?.title || 'Kapitech Insight',
          url: window.location.href
        });
        setShareState('shared');
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setShareState('copied');
      }
      setCopied(true);
      window.setTimeout(() => {
        setCopied(false);
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

  return (
    <InsightDetailErrorBoundary language={article.language}>
      <>
        <InsightSeoMeta article={article} />

        <header className="border-b border-white/[0.07] bg-[#0B0C0E]">
          <div className="mx-auto w-full max-w-[1240px] px-5 pb-12 pt-28 sm:px-8 sm:pb-14 sm:pt-36 lg:px-10 lg:pb-16 lg:pt-40">
            <nav
              className="mb-9 flex items-center gap-2 overflow-x-auto text-[9px] font-mono uppercase tracking-[0.13em] text-[#646C78]"
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
              {category && (
                <>
                  <ChevronRight size={11} className="shrink-0" aria-hidden="true" />
                  <span className="truncate text-[#A2A8B4]">{category}</span>
                </>
              )}
            </nav>

            <div className="max-w-[980px]">
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

              <h1 className="mt-6 max-w-5xl font-display text-4xl font-semibold leading-[0.98] tracking-[-0.055em] text-white sm:text-6xl lg:text-[4.5rem]">
                {article.title}
              </h1>

              {article.excerpt && (
                <p className="mt-6 max-w-3xl text-base leading-8 text-[#A3A9B5] sm:text-lg">
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
                {article.readingTime ? (
                  <span>
                    {article.readingTime} {article.language === 'id' ? 'menit baca' : 'min read'}
                  </span>
                ) : null}
                {article.editorialMeta?.reviewedBy && (
                  <span>
                    {article.language === 'id' ? 'Ditinjau oleh ' : 'Reviewed by '}
                    {article.editorialMeta.reviewedBy}
                  </span>
                )}
                {article.publishedAt && (
                  <time dateTime={article.publishedAt}>
                    {new Date(article.publishedAt).toLocaleDateString(article.language === 'id' ? 'id-ID' : 'en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </time>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="mx-auto w-full max-w-[1240px] scroll-mt-28 px-5 pb-16 pt-8 sm:px-8 sm:pt-10 lg:px-10 lg:pb-20 lg:pt-12">
          <div className="mb-5 xl:hidden">
            <InsightLeftRail
              mobile
              language={article.language}
              readingProgress={readingProgress}
              shareState={shareState}
              onShare={() => void copyLink()}
            />
            {toc.length > 0 && (
              <InsightTableOfContents items={toc} language={article.language} variant="mobile" />
            )}
          </div>

          <div className="grid items-start gap-7 xl:grid-cols-[56px_minmax(0,820px)_304px] xl:justify-center">
            <InsightLeftRail
              language={article.language}
              readingProgress={readingProgress}
              shareState={shareState}
              onShare={() => void copyLink()}
            />

            <article
              ref={articleReadingRef}
              className="min-w-0 w-full justify-self-center text-[#C3C7D0]"
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
                  className="mb-12 border-y border-white/[0.08] py-7 sm:mb-14 sm:py-8"
                  aria-labelledby="key-takeaways-title"
                >
                  <div className="grid gap-5 sm:grid-cols-[170px_minmax(0,1fr)] sm:gap-9">
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
                    <ul className="space-y-2.5">
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

            </>
    </InsightDetailErrorBoundary>
  );
};

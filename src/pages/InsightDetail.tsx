import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { InsightContentRenderer } from '../components/InsightContentRenderer';
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
  const languageInitializedRef = useRef(false);
  const articleLanguageRef = useRef<InsightItem['language'] | null>(null);
  const initialFallback = getInsightFallback(slug);
  const [article, setArticle] = useState<InsightItem | null>(() => initialFallback);
  const [loading, setLoading] = useState(() => !initialFallback);
  const [notFound, setNotFound] = useState(false);
  const [loadError, setLoadError] = useState<'network' | 'content' | null>(null);


  useEffect(() => {
    languageInitializedRef.current = false;
    articleLanguageRef.current = null;
    const localFallback = getInsightFallback(slug);
    setArticle(localFallback);
    setLoading(!localFallback);
    setNotFound(false);
    setLoadError(null);


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

        <header className="bg-[#0B0C0E]">
          <div className="mx-auto w-full max-w-7xl px-4 pb-12 pt-28 sm:px-6 sm:pb-14 sm:pt-32 md:px-12 lg:pb-16 lg:pt-36">
            <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(360px,500px)] lg:items-center lg:gap-14">
              <div className="min-w-0">
                <nav
                  className="mb-6 flex items-center gap-2 overflow-x-auto text-[9px] font-mono uppercase tracking-[0.13em] text-[#69717D]"
                  aria-label="Breadcrumb"
                >
                  <Link
                    to="/insights"
                    className="shrink-0 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/55"
                  >
                    {article.language === 'id' ? 'Insight' : 'Insights'}
                  </Link>
                  <ChevronRight size={11} className="shrink-0" aria-hidden="true" />
                  <span className="truncate text-[#A2A8B4]">{category || 'Insight'}</span>
                </nav>

                <p className="text-[9px] font-mono font-semibold uppercase tracking-[0.16em] text-brand-red">
                  {article.editorialMeta?.editorialType || (article.language === 'id' ? 'Panduan' : 'Guide')}
                </p>

                <h1 className="mt-4 max-w-[860px] font-display text-[2.7rem] font-semibold leading-[0.98] tracking-[-0.055em] text-white sm:text-6xl lg:text-[4.6rem]">
                  {article.title}
                </h1>

                {article.excerpt && (
                  <p className="mt-5 max-w-2xl text-[15px] leading-7 text-[#9EA5B1] sm:text-base sm:leading-8">
                    {article.excerpt}
                  </p>
                )}

                <p className="mt-6 text-xs leading-5 text-[#69717D]">
                  <span className="text-white">{article.author?.name || 'Kapitech Editorial'}</span>
                  <span className="mx-2 text-[#404651]">·</span>
                  {article.readingTime || '—'} {article.readingTime ? (article.language === 'id' ? 'menit baca' : 'min read') : ''}
                </p>
              </div>

              <figure className="overflow-hidden rounded-xl border border-white/[0.07] bg-[#101114]">
                <div className="overflow-hidden bg-[#0B0C0E]">
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
                    className="block aspect-[16/9] h-auto w-full object-contain"
                    onError={(event) => {
                      const fallback = '/insights/mvp-vs-prototype-vs-proof-of-concept/hero.svg';
                      if (event.currentTarget.src.endsWith(fallback)) return;
                      event.currentTarget.src = fallback;
                    }}
                  />
                </div>
                <figcaption className="px-4 py-3 text-xs leading-5 text-[#737B88]">
                  {article.language === 'id'
                    ? 'Gunakan pertanyaan utama untuk memilih alat validasi yang tepat.'
                    : 'Use the core question to choose the right validation tool.'}
                </figcaption>
              </figure>
            </div>
          </div>
        </header>

        <section
          className="w-full bg-[#0B0C0E]"
          aria-label={article.language === 'id' ? 'Artikel Insight' : 'Insight article'}
        >
          <div className="mx-auto w-full max-w-7xl">
            {toc.length > 0 && (
              <div className="px-4 pt-5 sm:px-6 md:px-12 xl:hidden">
                <InsightTableOfContents items={toc} language={article.language} variant="mobile" />
              </div>
            )}

            <div className="xl:grid xl:grid-cols-[minmax(0,860px)_300px] xl:justify-center xl:gap-16">
              <article className="min-w-0 w-full justify-self-center px-4 py-10 text-[#C3C7D0] sm:px-6 sm:py-14 xl:px-0 xl:py-16">
                {introductionBlocks.length > 0 && (
                  <section
                    className="mb-14"
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
                    className="mb-14 border-l-2 border-brand-red/45 pl-5 sm:pl-6"
                    aria-labelledby="key-takeaways-title"
                  >
                    <h2
                      id="key-takeaways-title"
                      className="mb-4 font-display text-xl font-semibold tracking-[-0.025em] text-white sm:text-[1.35rem]"
                    >
                      {article.language === 'id' ? 'Poin utama' : 'Key takeaways'}
                    </h2>
                    <ul className="space-y-3">
                      {article.keyTakeaways.map((item, index) => (
                        <li key={index} className="flex gap-3 text-[14px] leading-7 text-[#CBD0D8] sm:text-[15px]">
                          <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-red" aria-hidden="true" />
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

              <div className="hidden py-16 xl:block">
                <InsightRightRail items={toc} language={article.language} />
              </div>
            </div>
          </div>
        </section>

        {faq.length > 0 && (
          <section className="w-full bg-[#0B0C0E] px-4 pb-14 pt-10 sm:px-6 sm:pb-16 md:px-12" aria-labelledby="faq-title">
            <div className="mx-auto w-full max-w-[860px]">
              <h2 id="faq-title" className="scroll-mt-28 font-display text-2xl font-semibold tracking-[-0.035em] text-white sm:text-3xl">
                {article.language === 'id' ? 'Pertanyaan yang sering diajukan' : 'Frequently asked questions'}
              </h2>
              <div className="mt-5 divide-y divide-white/[0.08] border-y border-white/[0.08]">
                {faq.map((item, index) => (
                  <details key={index} className="group py-4">
                    <summary className="cursor-pointer list-none text-sm font-semibold leading-6 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60">
                      <span className="flex items-center justify-between gap-4">
                        {item.question}
                        <ChevronRight size={15} className="shrink-0 text-[#68707C] transition-transform duration-300 group-open:rotate-90" aria-hidden="true" />
                      </span>
                    </summary>
                    <p className="max-w-[72ch] pt-3 text-sm leading-7 text-[#9BA2AF]">{item.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        )}

        <div className="w-full bg-[#0B0C0E] px-4 pb-12 sm:px-6 md:px-12">
          <div className="mx-auto w-full max-w-[860px]">
            <Link
              to="/insights"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#8C94A1] underline decoration-white/15 underline-offset-4 transition-colors hover:text-white hover:decoration-brand-red/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60"
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

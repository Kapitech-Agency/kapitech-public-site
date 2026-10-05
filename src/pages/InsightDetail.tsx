import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, ChevronRight, Clock3, Share2 } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { InsightAmbientBackground } from '../components/InsightAmbientBackground';
import { InsightCard } from '../components/InsightCard';
import { InsightContentRenderer } from '../components/InsightContentRenderer';
import { InsightTableOfContents } from '../components/InsightTableOfContents';
import { InsightSeoMeta } from '../components/InsightSeoMeta';
import { api } from '../lib/apiClient';
import { useLanguage } from '../lib/LanguageContext';
import type { InsightItem } from '../data/insightTypes';
import { buildInsightHeadingIds, buildInsightToc } from '../lib/insightHeadingIds';

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
      <section className="relative flex min-h-[70vh] w-full items-center overflow-hidden bg-[#0B0C0E] px-5 pt-28 sm:px-8">
        <div className="mx-auto w-full max-w-[980px]">
          <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-brand-red">Insight / Render error</p>
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
              className="inline-flex items-center gap-2 rounded-full bg-brand-red px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.11em] text-white transition-colors hover:bg-[#FF1E27]"
            >
              {this.props.language === 'id' ? 'Muat ulang' : 'Reload'}
            </button>
            <a
              href="/insights"
              className="inline-flex items-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.04] px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.11em] text-white transition-colors hover:border-white/[0.16] hover:bg-white/[0.06]"
            >
              {this.props.language === 'id' ? 'Kembali ke Insight' : 'Back to Insights'}
            </a>
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
  const initialLanguageSyncPendingRef = useRef(false);
  const [article, setArticle] = useState<InsightItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    languageInitializedRef.current = false;
    articleLanguageRef.current = null;
    initialLanguageSyncPendingRef.current = false;
    let cancelled = false;
    setLoading(true);
    setNotFound(false);

    void api.cms.getInsightBySlug(slug).then((res) => {
      if (cancelled) return;
      if (!res.success || !res.data?.insight) {
        setNotFound(true);
        setArticle(null);
        return;
      }
      setArticle(res.data.insight);
    }).catch(() => {
      if (cancelled) return;
      setNotFound(true);
      setArticle(null);
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });

    return () => { cancelled = true; };
  }, [slug]);

  useEffect(() => {
    if (!article || languageInitializedRef.current) return;

    languageInitializedRef.current = true;
    articleLanguageRef.current = article.language;

    // A direct article URL owns the initial language. Apply it once, then
    // wait for a real language change before navigating to an alternate URL.
    if (article.language !== language) {
      initialLanguageSyncPendingRef.current = true;
      setLanguage(article.language);
    }
  }, [article, language, setLanguage]);

  useEffect(() => {
    if (!article || !languageInitializedRef.current) return;

    // The previous effect may have just changed the global language to match
    // the article. Do not interpret the old render's language as a manual
    // language switch.
    if (initialLanguageSyncPendingRef.current) {
      if (language === article.language) {
        initialLanguageSyncPendingRef.current = false;
      }
      return;
    }

    if (articleLanguageRef.current === language) return;

    const alternate = (Array.isArray(article.alternateLanguages) ? article.alternateLanguages : [])
      .find(item => item.language === language);
    if (alternate?.slug && alternate.slug !== slug) {
      articleLanguageRef.current = language;
      navigate('/insights/' + alternate.slug, { replace: true });
    }
  }, [article, language, navigate, slug]);

  const blocks = useMemo(
    () => (article && Array.isArray(article.content) ? article.content : []),
    [article]
  );
  const headingIds = useMemo(() => buildInsightHeadingIds(blocks), [blocks]);
  const toc = useMemo(() => buildInsightToc(blocks, headingIds), [blocks, headingIds]);
  useEffect(() => {
    const updateProgress = () => {
      const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
      const nextProgress = pageHeight <= 0 ? 0 : (window.scrollY / pageHeight) * 100;
      setReadingProgress(Math.max(0, Math.min(100, nextProgress)));
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
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  if (loading) {
    return (
      <div className="relative flex min-h-[70vh] items-center justify-center overflow-hidden px-5 pt-28">
        <InsightAmbientBackground intensity="detail" />
        <div className="relative z-10 text-center">
          <span className="mx-auto mb-4 block h-1.5 w-1.5 rounded-full bg-brand-red animate-pulse" />
          <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#727A87]" role="status">
            {language === 'id' ? 'Memuat artikel...' : 'Loading article...'}
          </p>
        </div>
      </div>
    );
  }

  if (notFound || !article) {
    return (
      <section className="relative flex min-h-[70vh] w-full items-center overflow-hidden px-5 pt-28 sm:px-8">
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
            className="mt-7 inline-flex items-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.04] px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.11em] text-white transition-[background-color,border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-brand-red/35 hover:bg-brand-red/10"
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
      <article className="relative w-full overflow-hidden bg-[#0B0C0E]">
      <InsightSeoMeta article={article} />

      <div className="pointer-events-none fixed inset-x-0 top-0 z-[1000] h-px bg-white/[0.06]" aria-hidden="true">
        <div
          className="h-full bg-brand-red shadow-[0_0_16px_rgba(229,9,20,0.65)] transition-[width] duration-100"
          style={{ width: readingProgress + '%' }}
        />
      </div>

      <header className="relative isolate overflow-hidden border-b border-white/[0.07]">
        <InsightAmbientBackground intensity="detail" />

        <div className="relative z-10 mx-auto w-full max-w-[1240px] px-5 pb-14 pt-28 sm:px-8 sm:pb-18 sm:pt-36 lg:px-10 lg:pb-20 lg:pt-40">
          <nav className="mb-9 flex items-center gap-2 overflow-x-auto text-[9px] font-mono uppercase tracking-[0.13em] text-[#646C78]" aria-label="Breadcrumb">
            <Link to="/" className="shrink-0 transition-colors hover:text-white">{article.language === 'id' ? 'Beranda' : 'Home'}</Link>
            <ChevronRight size={11} className="shrink-0" aria-hidden="true" />
            <Link to="/insights" className="shrink-0 transition-colors hover:text-white">{article.language === 'id' ? 'Insight' : 'Insights'}</Link>
            {category && (
              <>
                <ChevronRight size={11} className="shrink-0" aria-hidden="true" />
                <span className="shrink-0 text-[#848B97]">{category}</span>
              </>
            )}
          </nav>

          <div className="max-w-[980px]">
            <div className="max-w-[920px]">
              <div className="flex flex-wrap items-center gap-2.5 text-[9px] font-mono uppercase tracking-[0.15em]">
                {category && (
                  <span className="rounded-full border border-brand-red/25 bg-brand-red/[0.08] px-3 py-1.5 text-brand-red">
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
                {article.readingTime && (
                  <>
                    <span className="h-1 w-1 rounded-full bg-white/15" aria-hidden="true" />
                    <span className="inline-flex items-center gap-1.5 text-[#737A87]">
                      <Clock3 size={11} aria-hidden="true" />
                      {article.readingTime} {article.language === 'id' ? 'menit baca' : 'min read'}
                    </span>
                  </>
                )}
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
                    {article.language === 'id' ? 'Ditulis oleh ' : 'Written by '}{article.author.name}
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
                  <span>
                    {article.language === 'id' ? 'Diperbarui' : 'Updated'} {formatDate(article.updatedAt, article.language)}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => void copyLink()}
                  className="inline-flex items-center gap-1.5 text-white/78 transition-colors hover:text-brand-red"
                >
                  {copied ? <Check size={13} aria-hidden="true" /> : <Share2 size={13} aria-hidden="true" />}
                  {copied
                    ? (article.language === 'id' ? 'Tautan disalin' : 'Link copied')
                    : (article.language === 'id' ? 'Bagikan' : 'Share')}
                </button>
              </div>
            </div>

          </div>

          {article.coverImage && (
            <figure className="relative mt-12 max-w-[1120px] overflow-hidden rounded-[24px] border border-white/[0.08] bg-[#0B0C0E] shadow-[0_30px_90px_-58px_rgba(0,0,0,0.95)]">
              <div className="absolute inset-0 bg-gradient-to-t from-black/24 via-transparent to-white/[0.03] pointer-events-none" />
              <img
                src={article.coverImage}
                alt={article.language === 'id'
                  ? 'Kerangka visual untuk memilih Prototype, MVP, atau Proof of Concept berdasarkan ketidakpastian terbesar.'
                  : 'Editorial framework for choosing Prototype, MVP, or Proof of Concept based on the biggest product uncertainty.'}
                loading="eager"
                className="block max-h-[720px] w-full object-cover"
              />
            </figure>
          )}
        </div>
      </header>

      {Array.isArray(article.keyTakeaways) && article.keyTakeaways.length > 0 && (
        <section className="mx-auto w-full max-w-[900px] px-5 pt-10 sm:px-8 sm:pt-14" aria-labelledby="key-takeaways-title">
          <div className="border-y border-white/[0.08] py-8 sm:py-9">
            <div className="grid gap-6 sm:grid-cols-[170px_minmax(0,1fr)] sm:gap-10">
              <div>
                <p id="key-takeaways-title" className="text-[9px] font-mono uppercase tracking-[0.18em] text-brand-red">
                  {article.language === 'id' ? 'Poin utama' : 'Key takeaways'}
                </p>
                <p className="mt-2 max-w-[155px] text-xs leading-5 text-[#7D8592]">
                  {article.language === 'id' ? 'Hal yang perlu dibawa dari artikel ini.' : 'The ideas worth carrying forward.'}
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
          </div>
        </section>
      )}


      <div className="mx-auto w-full max-w-[1240px] px-5 pb-12 pt-10 sm:px-8 sm:pb-16 sm:pt-14 lg:px-10 lg:pt-16">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_240px] lg:gap-14 xl:grid-cols-[minmax(0,820px)_240px] xl:justify-between xl:gap-20">
          <div className="min-w-0 lg:col-start-1 lg:row-start-1">
            <InsightContentRenderer
              blocks={blocks}
              headingIds={headingIds.map(id => id || '')}
              language={article.language}
            />

            {Array.isArray(article.faq) && article.faq.length > 0 && (
              <section className="mt-16 border-t border-white/[0.08] pt-10" aria-labelledby="faq-title">
                <h2 id="faq-title" className="scroll-mt-24 text-2xl font-display font-semibold tracking-[-0.03em] text-white sm:text-3xl">
                  {article.language === 'id' ? 'Pertanyaan yang sering diajukan' : 'Frequently asked questions'}
                </h2>
                <div className="mt-5 space-y-3">
                  {article.faq.map((item, index) => (
                    <details key={index} className="group rounded-2xl border border-white/[0.08] bg-white/[0.018] px-5 py-4 transition-[background-color,border-color] duration-300 open:border-brand-red/20 open:bg-brand-red/[0.025]">
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
              </section>
            )}
          </div>

          {toc.length > 0 && (
            <aside className="order-first lg:sticky lg:top-24 lg:order-none lg:col-start-2 lg:row-start-1">
              <InsightTableOfContents items={toc} language={article.language} />
            </aside>
          )}
        </div>
      </section>

      <section className="mx-auto w-full max-w-[820px] px-5 py-8 sm:px-8 sm:py-10">
        <div className="flex flex-col gap-5 border-y border-white/[0.08] py-7 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
          <div className="max-w-2xl">
            <p className="text-[9px] font-mono uppercase tracking-[0.18em] text-brand-red">
              {article.language === 'id' ? 'Diskusi Proyek' : 'Project discussion'}
            </p>
            <h2 className="mt-3 text-2xl font-display font-semibold leading-[1.08] tracking-[-0.035em] text-white sm:text-3xl">
              {article.language === 'id'
                ? 'Butuh partner untuk langkah berikutnya?'
                : 'Need a partner for the next step?'}
            </h2>
            <p className="mt-3 text-sm leading-7 text-[#89909D]">
              {article.language === 'id'
                ? 'Mulai dari pertanyaan yang perlu dibuktikan, lalu tentukan ruang lingkup yang masuk akal untuk dibangun.'
                : 'Start with the question that needs evidence, then define a sensible scope to build.'}
            </p>
          </div>
          <Link
            to="/contact"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-white/[0.1] px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-white transition-[background-color,border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-brand-red/35 hover:bg-brand-red/10"
          >
            {article.language === 'id' ? 'Mulai Proyek' : 'Start a Project'}
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </section>

      {article.author && (
        <section className="mx-auto w-full max-w-[820px] px-5 pb-10 pt-0 sm:px-8 sm:pb-12" aria-labelledby="author-title">
          <div className="border-y border-white/[0.07] py-6">
            <p id="author-title" className="text-[9px] font-mono uppercase tracking-[0.16em] text-[#747B88]">
              {article.language === 'id' ? 'Tentang penulis' : 'About the author'}
            </p>
            <div className="mt-5 flex items-start gap-4">
              {article.author.avatar ? (
                <img src={article.author.avatar} alt="" className="h-12 w-12 shrink-0 rounded-full border border-white/[0.08] object-cover" />
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
          </div>
        </section>
      )}

      {Array.isArray(article.relatedInsights) && article.relatedInsights.length > 0 && (
        <section className="mx-auto w-full max-w-[1240px] px-5 pb-16 sm:px-8 lg:px-10" aria-labelledby="related-title">
          <div className="flex items-end justify-between gap-4 border-t border-white/[0.07] pt-10">
            <div>
              <p className="text-[9px] font-mono uppercase tracking-[0.18em] text-[#69717D]">{article.language === 'id' ? 'Perpustakaan' : 'Library'}</p>
              <h2 id="related-title" className="mt-2 text-3xl font-display font-semibold tracking-[-0.04em] text-white sm:text-[2.45rem]">
                {article.language === 'id' ? 'Insight terkait' : 'Related insights'}
              </h2>
            </div>
            <Link to="/insights" className="hidden items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.11em] text-[#858C99] transition-colors hover:text-white sm:inline-flex">
              {article.language === 'id' ? 'Lihat semua' : 'View all'}
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {article.relatedInsights.map(item => <InsightCard key={item.id} insight={item} language={article.language} />)}
          </div>
        </section>
      )}

      <div className="mx-auto w-full max-w-[1240px] px-5 pb-12 sm:px-8 lg:px-10">
        <Link
          to="/insights"
          className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.11em] text-[#858C99] transition-colors hover:text-white"
        >
          <ArrowLeft size={14} aria-hidden="true" />
          {article.language === 'id' ? 'Kembali ke Insight' : 'Back to Insights'}
        </Link>
      </div>
      </article>
    </InsightDetailErrorBoundary>
  );
};

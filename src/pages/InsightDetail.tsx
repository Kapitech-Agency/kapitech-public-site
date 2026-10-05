import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, ChevronRight, Clock3, Share2 } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { InsightAmbientBackground } from '../components/InsightAmbientBackground';
import { InsightCard } from '../components/InsightCard';
import { InsightContentRenderer } from '../components/InsightContentRenderer';
import { InsightSeoMeta } from '../components/InsightSeoMeta';
import { api } from '../lib/apiClient';
import { useLanguage } from '../lib/LanguageContext';
import type { InsightBlock, InsightItem } from '../data/insightTypes';

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

function buildToc(blocks: InsightBlock[]) {
  return blocks
    .filter((block): block is Extract<InsightBlock, { type: 'heading' }> => block.type === 'heading')
    .map((block, index) => ({
      ...block,
      id: 'insight-section-' + index
    }));
}

export const InsightDetail: React.FC = () => {
  const { slug = '' } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const articleRef = useRef<HTMLElement | null>(null);
  const [article, setArticle] = useState<InsightItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [activeHeading, setActiveHeading] = useState('');

  useEffect(() => {
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
    if (!article || article.language === language) return;
    const alternate = article.alternateLanguages?.find(item => item.language === language);
    if (alternate?.slug && alternate.slug !== slug) {
      navigate('/insights/' + alternate.slug, { replace: true });
    }
  }, [article, language, navigate, slug]);

  const blocks = article?.content || [];
  const toc = useMemo(() => buildToc(blocks), [blocks]);

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

  useEffect(() => {
    if (!toc.length) {
      setActiveHeading('');
      return;
    }

    const headingNodes = toc
      .map(item => document.getElementById(item.id))
      .filter((node): node is HTMLElement => Boolean(node));

    if (!headingNodes.length) return;

    const observer = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]) {
          setActiveHeading(visible[0].target.id);
        }
      },
      {
        rootMargin: '-18% 0px -68% 0px',
        threshold: [0, 0.25, 0.75]
      }
    );

    headingNodes.forEach(node => observer.observe(node));
    return () => observer.disconnect();
  }, [toc]);

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

  const languageMismatch = article.language !== language
    && !(article.alternateLanguages || []).some(item => item.language === language);

  return (
    <article ref={articleRef} className="relative w-full overflow-hidden bg-[#0B0C0E]">
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

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_270px] lg:items-end lg:gap-16">
            <div className="max-w-[910px]">
              <div className="flex flex-wrap items-center gap-2.5 text-[9px] font-mono uppercase tracking-[0.15em]">
                {category && (
                  <span className="rounded-full border border-brand-red/25 bg-brand-red/[0.08] px-3 py-1.5 text-brand-red">
                    {category}
                  </span>
                )}
                <span className="text-[#68707C]">{article.language.toUpperCase()}</span>
                {article.readingTime && (
                  <>
                    <span className="h-1 w-1 rounded-full bg-white/15" aria-hidden="true" />
                    <span className="inline-flex items-center gap-1.5 text-[#737A87]">
                      <Clock3 size={11} aria-hidden="true" />
                      {article.readingTime} min read
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
                    {article.author.name}
                    {article.author.role ? <span className="font-normal text-[#737A87]"> · {article.author.role}</span> : null}
                  </span>
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

            <aside className="rounded-[22px] border border-white/[0.08] bg-[#0B0C0E]/46 p-5 backdrop-blur-xl sm:p-6">
              <p className="text-[9px] font-mono uppercase tracking-[0.16em] text-[#69717D]">
                {article.language === 'id' ? 'Reading signal' : 'Reading signal'}
              </p>
              <div className="mt-5">
                <div className="flex items-end justify-between gap-3">
                  <span className="font-display text-4xl font-semibold leading-none tracking-[-0.05em] text-white">
                    {Math.round(readingProgress)}%
                  </span>
                  <span className="pb-1 text-[9px] font-mono uppercase tracking-[0.12em] text-[#6C7480]">
                    {article.language === 'id' ? 'dibaca' : 'read'}
                  </span>
                </div>
                <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/[0.06]">
                  <div className="h-full rounded-full bg-brand-red transition-[width] duration-100" style={{ width: readingProgress + '%' }} />
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] px-3 py-3">
                  <p className="text-[8px] font-mono uppercase tracking-[0.1em] text-[#616976]">Format</p>
                  <p className="mt-1 text-xs font-semibold text-white">Editorial</p>
                </div>
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] px-3 py-3">
                  <p className="text-[8px] font-mono uppercase tracking-[0.1em] text-[#616976]">Language</p>
                  <p className="mt-1 text-xs font-semibold text-white">{article.language.toUpperCase()}</p>
                </div>
              </div>
            </aside>
          </div>

          {article.coverImage && (
            <figure className="relative mt-10 overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#0B0C0E] shadow-[0_34px_100px_-62px_rgba(0,0,0,0.95)]">
              <div className="absolute inset-0 bg-gradient-to-t from-black/24 via-transparent to-white/[0.03] pointer-events-none" />
              <img
                src={article.coverImage}
                alt={article.title}
                loading="eager"
                className="block max-h-[720px] w-full object-cover"
              />
            </figure>
          )}
        </div>
      </header>

      {languageMismatch && (
        <div className="mx-auto w-full max-w-[900px] px-5 pt-8 sm:px-8">
          <aside className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 text-sm leading-6 text-[#9AA1AE]">
            {language === 'id'
              ? 'Versi Bahasa Indonesia untuk artikel ini belum tersedia. Anda sedang membaca versi English.'
              : 'An English version of this article is not available yet. You are viewing the Indonesian version.'}
          </aside>
        </div>
      )}

      {article.keyTakeaways && article.keyTakeaways.length > 0 && (
        <section className="mx-auto w-full max-w-[980px] px-5 pt-10 sm:px-8 sm:pt-12" aria-labelledby="key-takeaways-title">
          <div className="relative overflow-hidden rounded-[24px] border border-brand-red/18 bg-brand-red/[0.035] p-6 sm:p-8">
            <div className="absolute -right-12 -top-16 h-40 w-40 rounded-full bg-brand-red/[0.07] blur-3xl" />
            <div className="relative grid gap-6 lg:grid-cols-[170px_minmax(0,1fr)] lg:gap-8">
              <div>
                <p id="key-takeaways-title" className="text-[9px] font-mono uppercase tracking-[0.18em] text-brand-red">
                  {article.language === 'id' ? 'Poin utama' : 'Key takeaways'}
                </p>
                <p className="mt-2 max-w-[150px] text-xs leading-5 text-[#7D8592]">
                  {article.language === 'id' ? 'Hal yang perlu dibawa dari artikel ini.' : 'The ideas worth carrying forward.'}
                </p>
              </div>
              <ul className="grid gap-3 sm:grid-cols-2">
                {article.keyTakeaways.map((item, index) => (
                  <li key={index} className="flex gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.018] px-4 py-4 text-sm leading-6 text-[#CBD0D8]">
                    <span className="mt-0.5 tabular-nums text-[9px] font-mono text-brand-red/85">{String(index + 1).padStart(2, '0')}</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      <div className="mx-auto grid w-full max-w-[1240px] grid-cols-1 gap-10 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[210px_minmax(0,1fr)] lg:px-10 lg:py-20">
        {toc.length > 0 ? (
          <aside className="lg:sticky lg:top-28 lg:self-start" aria-label={article.language === 'id' ? 'Daftar isi' : 'Table of contents'}>
            <details className="rounded-[20px] border border-white/[0.08] bg-white/[0.018] p-4 backdrop-blur-xl lg:open:border-white/[0.1]" open>
              <summary className="cursor-pointer list-none text-[9px] font-mono uppercase tracking-[0.16em] text-[#7A818D]">
                {article.language === 'id' ? 'Daftar isi' : 'Table of contents'}
              </summary>
              <nav className="mt-4 space-y-1.5">
                {toc.map((item, index) => {
                  const active = activeHeading === item.id;
                  return (
                    <a
                      key={index}
                      href={'#' + item.id}
                      className={[
                        'group flex items-start gap-2.5 rounded-lg px-2.5 py-2 text-xs leading-5 transition-[background-color,color] duration-300',
                        item.level === 3 ? 'ml-2' : '',
                        active
                          ? 'bg-brand-red/[0.08] text-white'
                          : 'text-[#747C88] hover:bg-white/[0.025] hover:text-white'
                      ].join(' ')}
                    >
                      <span className={[
                        'mt-2 h-1 w-1 shrink-0 rounded-full transition-colors duration-300',
                        active ? 'bg-brand-red' : 'bg-white/15 group-hover:bg-white/35'
                      ].join(' ')} />
                      <span>{item.text}</span>
                    </a>
                  );
                })}
              </nav>
            </details>
          </aside>
        ) : (
          <div className="hidden lg:block" />
        )}

        <div className="min-w-0">
          <div className="max-w-[780px]">
            <InsightContentRenderer blocks={blocks} headingIds={toc.map(item => item.id)} />

            {article.faq && article.faq.length > 0 && (
              <section className="mt-16 border-t border-white/[0.08] pt-10" aria-labelledby="faq-title">
                <h2 id="faq-title" className="text-2xl font-display font-semibold tracking-[-0.03em] text-white sm:text-3xl">
                  {article.language === 'id' ? 'FAQ' : 'Frequently asked questions'}
                </h2>
                <div className="mt-5 space-y-3">
                  {article.faq.map((item, index) => (
                    <details key={index} className="group rounded-2xl border border-white/[0.08] bg-white/[0.018] px-5 py-4 transition-[background-color,border-color] duration-300 open:border-brand-red/20 open:bg-brand-red/[0.025]">
                      <summary className="cursor-pointer list-none text-sm font-semibold leading-6 text-white">
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

            {article.author && (
              <section className="mt-14 border-t border-white/[0.08] pt-8" aria-labelledby="author-title">
                <p id="author-title" className="text-[9px] font-mono uppercase tracking-[0.16em] text-[#747B88]">
                  {article.language === 'id' ? 'Tentang penulis' : 'About the author'}
                </p>
                <div className="mt-5 flex items-start gap-4 rounded-[22px] border border-white/[0.07] bg-white/[0.018] p-5 sm:p-6">
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
              </section>
            )}
          </div>
        </div>
      </div>

      {article.relatedInsights && article.relatedInsights.length > 0 && (
        <section className="mx-auto w-full max-w-[1240px] px-5 pb-16 sm:px-8 lg:px-10" aria-labelledby="related-title">
          <div className="flex items-end justify-between gap-4 border-t border-white/[0.07] pt-10">
            <div>
              <p className="text-[9px] font-mono uppercase tracking-[0.18em] text-[#69717D]">Library</p>
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

      <section className="mx-auto w-full max-w-[1240px] px-5 pb-20 pt-8 sm:px-8 lg:px-10">
        <div className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-white/[0.018] p-6 backdrop-blur-xl sm:p-8 lg:p-10">
          <div className="absolute -right-14 -top-20 h-56 w-56 rounded-full bg-brand-red/[0.07] blur-3xl" />
          <div className="relative flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-[9px] font-mono uppercase tracking-[0.18em] text-brand-red">
                {article.language === 'id' ? 'Diskusi Project' : 'Project discussion'}
              </p>
              <h2 className="mt-3 text-3xl font-display font-semibold leading-[1.02] tracking-[-0.04em] text-white sm:text-4xl">
                {article.language === 'id'
                  ? 'Butuh bantuan menerapkan insight ini?'
                  : 'Need help applying this insight?'}
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#89909D]">
                {article.language === 'id'
                  ? 'Mari terjemahkan ide ini menjadi website, product experience, atau sistem digital yang benar-benar bisa digunakan.'
                  : 'Let’s turn the idea into a website, product experience, or digital system that can actually be used.'}
              </p>
            </div>
            <Link
              to="/contact"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.035] px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-white transition-[background-color,border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-brand-red/35 hover:bg-brand-red/10"
            >
              {article.language === 'id' ? 'Diskusikan Project' : 'Discuss Your Project'}
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

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
  );
};

import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, ChevronRight, Clock3, Link2, Share2 } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { InsightCard } from '../components/InsightCard';
import { InsightContentRenderer } from '../components/InsightContentRenderer';
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
  const [article, setArticle] = useState<InsightItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[65vh] w-full max-w-[980px] items-center justify-center px-5 pt-28">
        <p className="text-sm text-[#717885]" role="status">{language === 'id' ? 'Memuat artikel...' : 'Loading article...'}</p>
      </div>
    );
  }

  if (notFound || !article) {
    return (
      <section className="mx-auto flex min-h-[70vh] w-full max-w-[980px] flex-col items-start justify-center px-5 pt-28 sm:px-8">
        <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-brand-red">404</p>
        <h1 className="mt-4 text-4xl font-display font-semibold tracking-[-0.04em] text-white">
          {language === 'id' ? 'Insight tidak ditemukan' : 'Insight not found'}
        </h1>
        <p className="mt-4 max-w-lg text-sm leading-7 text-[#8B929F]">
          {language === 'id'
            ? 'Artikel mungkin belum dipublikasikan atau URL-nya sudah berubah.'
            : 'The article may not be published yet or its URL may have changed.'}
        </p>
        <Link to="/insights" className="mt-7 inline-flex items-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.04] px-5 py-3 text-xs font-semibold text-white hover:border-brand-red/35">
          <ArrowLeft size={14} aria-hidden="true" />
          {language === 'id' ? 'Kembali ke Insight' : 'Back to Insights'}
        </Link>
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
    <article className="w-full">
      <header className="mx-auto w-full max-w-[1180px] px-5 pb-10 pt-28 sm:px-8 sm:pb-14 sm:pt-36 lg:px-10 lg:pt-40">
        <nav className="mb-7 flex items-center gap-2 overflow-x-auto text-[10px] font-mono uppercase tracking-[0.12em] text-[#6F7682]" aria-label="Breadcrumb">
          <Link to="/" className="shrink-0 transition-colors hover:text-white">{article.language === 'id' ? 'Beranda' : 'Home'}</Link>
          <ChevronRight size={12} className="shrink-0" aria-hidden="true" />
          <Link to="/insights" className="shrink-0 transition-colors hover:text-white">{article.language === 'id' ? 'Insight' : 'Insights'}</Link>
          {category && (
            <>
              <ChevronRight size={12} className="shrink-0" aria-hidden="true" />
              <span className="shrink-0 text-[#8B929F]">{category}</span>
            </>
          )}
        </nav>

        <div className="max-w-4xl">
          <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono uppercase tracking-[0.14em]">
            {category && <span className="text-brand-red">{category}</span>}
            <span className="text-[#69707B]">{article.language.toUpperCase()}</span>
            {article.readingTime && (
              <span className="inline-flex items-center gap-1.5 text-[#69707B]">
                <Clock3 size={12} aria-hidden="true" />
                {article.readingTime} min
              </span>
            )}
          </div>

          <h1 className="mt-5 text-4xl font-display font-semibold leading-[1.02] tracking-[-0.045em] text-white sm:text-6xl lg:text-[72px]">
            {article.title}
          </h1>

          {article.excerpt && (
            <p className="mt-6 max-w-3xl text-base leading-8 text-[#A3A9B5] sm:text-lg">
              {article.excerpt}
            </p>
          )}

          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 text-xs text-[#737A87]">
            {article.author?.name && (
              <span className="font-medium text-white">
                {article.author.name}
                {article.author.role ? <span className="font-normal text-[#737A87]"> · {article.author.role}</span> : null}
              </span>
            )}
            {article.publishedAt && <time dateTime={article.publishedAt}>{formatDate(article.publishedAt, article.language)}</time>}
            {article.updatedAt && article.updatedAt !== article.publishedAt && (
              <span>{article.language === 'id' ? 'Diperbarui' : 'Updated'} {formatDate(article.updatedAt, article.language)}</span>
            )}
            <button type="button" onClick={() => void copyLink()} className="inline-flex items-center gap-1.5 text-white/80 transition-colors hover:text-brand-red">
              {copied ? <Check size={13} aria-hidden="true" /> : <Share2 size={13} aria-hidden="true" />}
              {copied ? (article.language === 'id' ? 'Tautan disalin' : 'Link copied') : (article.language === 'id' ? 'Bagikan' : 'Share')}
            </button>
          </div>
        </div>

        {article.coverImage && (
          <figure className="mt-10 overflow-hidden rounded-[24px] border border-white/[0.08] bg-[#0B0C0E]">
            <img src={article.coverImage} alt={article.title} loading="eager" className="w-full max-h-[680px] object-cover" />
          </figure>
        )}
      </header>

      {languageMismatch && (
        <div className="mx-auto w-full max-w-[900px] px-5 sm:px-8">
          <aside className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 text-sm leading-6 text-[#9AA1AE]">
            {language === 'id'
              ? 'Versi Bahasa Indonesia untuk artikel ini belum tersedia. Anda sedang membaca versi English.'
              : 'An English version of this article is not available yet. You are viewing the Indonesian version.'}
          </aside>
        </div>
      )}

      {article.keyTakeaways && article.keyTakeaways.length > 0 && (
        <section className="mx-auto w-full max-w-[900px] px-5 sm:px-8" aria-labelledby="key-takeaways-title">
          <div className="rounded-[24px] border border-brand-red/15 bg-brand-red/[0.045] p-6 sm:p-7">
            <p id="key-takeaways-title" className="text-[10px] font-mono uppercase tracking-[0.18em] text-brand-red">
              {article.language === 'id' ? 'Poin utama' : 'Key takeaways'}
            </p>
            <ul className="mt-4 space-y-3">
              {article.keyTakeaways.map((item, index) => (
                <li key={index} className="flex gap-3 text-sm leading-7 text-[#CBD0D8]">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-red" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <div className="mx-auto grid w-full max-w-[1180px] grid-cols-1 gap-10 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[200px_minmax(0,1fr)] lg:px-10">
        {toc.length > 0 ? (
          <aside className="lg:sticky lg:top-28 lg:self-start" aria-label={article.language === 'id' ? 'Daftar isi' : 'Table of contents'}>
            <details className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 lg:open:border-white/[0.09]" open>
              <summary className="cursor-pointer list-none text-[10px] font-mono uppercase tracking-[0.16em] text-[#7A818D]">
                {article.language === 'id' ? 'Daftar isi' : 'Table of contents'}
              </summary>
              <nav className="mt-4 space-y-2">
                {toc.map((item, index) => (
                  <a
                    key={index}
                    href={'#' + item.id}
                    className={'block text-xs leading-5 transition-colors hover:text-white ' + (item.level === 3 ? 'pl-3 text-[#686F7C]' : 'text-[#8D94A1]')}
                  >
                    {item.text}
                  </a>
                ))}
              </nav>
            </details>
          </aside>
        ) : <div className="hidden lg:block" />}

        <div className="min-w-0">
          {toc.length > 0 && (
            <div className="hidden">
              {toc.map((item) => item)}
            </div>
          )}

          <div className="max-w-[760px]">
            <InsightContentRenderer blocks={blocks.map((block) => {
              if (block.type !== 'heading') return block;
              const headingIndex = toc.findIndex(item => item.text === block.text && item.level === block.level);
              return headingIndex >= 0 ? { ...block, text: block.text } : block;
            })} />

            {article.faq && article.faq.length > 0 && (
              <section className="mt-16 border-t border-white/[0.08] pt-10" aria-labelledby="faq-title">
                <h2 id="faq-title" className="text-2xl font-display font-semibold tracking-[-0.025em] text-white sm:text-3xl">
                  {article.language === 'id' ? 'FAQ' : 'Frequently asked questions'}
                </h2>
                <div className="mt-5 space-y-3">
                  {article.faq.map((item, index) => (
                    <details key={index} className="rounded-2xl border border-white/[0.08] bg-white/[0.02] px-5 py-4">
                      <summary className="cursor-pointer list-none text-sm font-semibold leading-6 text-white">{item.question}</summary>
                      <p className="pt-3 text-sm leading-7 text-[#9BA2AF]">{item.answer}</p>
                    </details>
                  ))}
                </div>
              </section>
            )}

            {article.author && (
              <section className="mt-14 border-t border-white/[0.08] pt-8" aria-labelledby="author-title">
                <p id="author-title" className="text-[10px] font-mono uppercase tracking-[0.16em] text-[#747B88]">
                  {article.language === 'id' ? 'Tentang penulis' : 'About the author'}
                </p>
                <div className="mt-4 flex items-start gap-4">
                  {article.author.avatar ? (
                    <img src={article.author.avatar} alt="" className="h-12 w-12 shrink-0 rounded-full border border-white/[0.08] object-cover" />
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04] text-sm font-semibold text-white" aria-hidden="true">
                      {article.author.name.slice(0, 1).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-white">{article.author.name}</p>
                    {article.author.role && <p className="mt-1 text-xs text-[#747B88]">{article.author.role}</p>}
                    {article.author.bio && <p className="mt-2 text-sm leading-6 text-[#9BA2AF]">{article.author.bio}</p>}
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>

      {article.relatedInsights && article.relatedInsights.length > 0 && (
        <section className="mx-auto w-full max-w-[1180px] px-5 pb-16 sm:px-8 lg:px-10" aria-labelledby="related-title">
          <div className="flex items-end justify-between gap-4">
            <h2 id="related-title" className="text-2xl font-display font-semibold tracking-[-0.025em] text-white sm:text-3xl">
              {article.language === 'id' ? 'Insight terkait' : 'Related insights'}
            </h2>
            <Link to="/insights" className="hidden items-center gap-2 text-xs font-semibold text-[#858C99] transition-colors hover:text-white sm:inline-flex">
              {article.language === 'id' ? 'Lihat semua' : 'View all'}
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {article.relatedInsights.map(item => <InsightCard key={item.id} insight={item} language={article.language} />)}
          </div>
        </section>
      )}

      <section className="mx-auto w-full max-w-[1180px] px-5 pb-20 sm:px-8 lg:px-10">
        <div className="flex flex-col items-start justify-between gap-5 rounded-[24px] border border-white/[0.07] bg-white/[0.02] p-6 sm:flex-row sm:items-center sm:p-8">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-brand-red">
              {article.language === 'id' ? 'Diskusi Project' : 'Project discussion'}
            </p>
            <h2 className="mt-2 text-2xl font-display font-semibold tracking-[-0.025em] text-white">
              {article.language === 'id' ? 'Butuh bantuan menerapkan insight ini?' : 'Need help applying this insight?'}
            </h2>
          </div>
          <Link to="/contact" className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.04] px-5 py-3 text-xs font-semibold text-white transition-colors hover:border-brand-red/35 hover:bg-brand-red/10">
            {article.language === 'id' ? 'Diskusikan Project' : 'Discuss Your Project'}
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <div className="mx-auto w-full max-w-[1180px] px-5 pb-10 sm:px-8 lg:px-10">
        <Link to="/insights" className="inline-flex items-center gap-2 text-xs font-semibold text-[#858C99] transition-colors hover:text-white">
          <ArrowLeft size={14} aria-hidden="true" />
          {article.language === 'id' ? 'Kembali ke Insight' : 'Back to Insights'}
        </Link>
      </div>
    </article>
  );
};

import React from 'react';
import { ArrowUpRight, Clock3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { InsightItem } from '../data/insightTypes';

function formatDate(value?: string | null, language: 'id' | 'en' = 'en'): string {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat(language === 'id' ? 'id-ID' : 'en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date);
}

export const InsightCard: React.FC<{
  insight: InsightItem;
  language: 'id' | 'en';
  featured?: boolean;
}> = ({ insight, language, featured = false }) => {
  const categoryName = insight.category?.displayName
    || insight.category?.name?.[language]
    || insight.category?.name?.en
    || insight.category?.name?.id
    || insight.category?.slug;

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (event.pointerType && event.pointerType !== 'mouse') return;
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--kapi-spotlight-x', (event.clientX - rect.left) + 'px');
    event.currentTarget.style.setProperty('--kapi-spotlight-y', (event.clientY - rect.top) + 'px');
  };

  const tags = (insight.tags || []).slice(0, featured ? 3 : 2);

  return (
    <article
      data-kapi-spotlight="true"
      onPointerMove={handlePointerMove}
      className={[
        'group relative overflow-hidden border bg-[#111318] transition-[border-color,background-color,box-shadow,transform] duration-500',
        'hover:-translate-y-0.5 hover:border-white/[0.14] hover:bg-[#13151A] hover:shadow-[0_28px_80px_-52px_rgba(0,0,0,0.95)]',
        featured
          ? 'rounded-[26px] border-white/[0.09]'
          : 'rounded-[22px] border-white/[0.075]'
      ].join(' ')}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(260px circle at var(--kapi-spotlight-x, 50%) var(--kapi-spotlight-y, 20%), rgba(229,9,20,0.09), transparent 68%)'
        }}
      />

      <div className={featured ? 'grid lg:grid-cols-[1.12fr_0.88fr]' : 'flex flex-col'}>
        {insight.coverImage ? (
          <Link
            to={'/insights/' + insight.slug}
            aria-label={insight.title}
            className={[
              'group/media relative block overflow-hidden bg-[#090A0C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60 focus-visible:ring-inset',
              featured ? 'min-h-[270px] aspect-[16/10] lg:aspect-auto lg:min-h-[420px]' : 'aspect-[16/9]'
            ].join(' ')}
          >
            <img
              src={insight.coverImage}
              alt=""
              loading={featured ? 'eager' : 'lazy'}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/media:scale-[1.035]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,6,8,0.08),transparent_38%,rgba(5,6,8,0.74))]" />
            <div className="absolute left-4 top-4 flex items-center gap-2 rounded-[11px] border border-white/[0.09] bg-[#0B0C0E]/58 px-2.5 py-1.5 font-mono text-[8px] font-semibold uppercase tracking-[0.14em] text-white/80 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-red" aria-hidden="true" />
              {featured
                ? (language === 'id' ? 'Pilihan editor' : 'Editor pick')
                : (insight.language === 'id' ? 'Insight' : 'Insight')}
            </div>

            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
              <span className="font-mono text-[8px] font-semibold uppercase tracking-[0.15em] text-white/52">
                {insight.language.toUpperCase()} / {categoryName || 'Insight'}
              </span>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-[11px] border border-white/[0.10] bg-[#0B0C0E]/55 text-white backdrop-blur-md transition-[background-color,border-color,transform] duration-300 group-hover/media:translate-x-0.5 group-hover/media:border-brand-red/40 group-hover/media:bg-brand-red/12">
                <ArrowUpRight size={15} aria-hidden="true" />
              </span>
            </div>
          </Link>
        ) : (
          <Link
            to={'/insights/' + insight.slug}
            aria-label={insight.title}
            className={[
              'relative flex overflow-hidden bg-[radial-gradient(circle_at_76%_24%,rgba(229,9,20,0.15),transparent_31%),linear-gradient(135deg,#15171D,#090A0C)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60 focus-visible:ring-inset',
              featured ? 'min-h-[270px] lg:min-h-[420px]' : 'aspect-[16/9]'
            ].join(' ')}
          >
            <div className="absolute inset-0 opacity-60" aria-hidden="true">
              <div className="absolute left-[13%] top-[18%] h-20 w-20 rounded-full border border-brand-red/18" />
              <div className="absolute left-[25%] top-[29%] h-32 w-32 rounded-full border border-white/[0.05]" />
              <div className="absolute bottom-[18%] right-[12%] h-24 w-24 rounded-full border border-white/[0.04]" />
              <div className="absolute right-[17%] top-[28%] h-8 w-8 rounded-full bg-brand-red/12 blur-xl" />
            </div>
            <div className="absolute left-4 top-4 rounded-[11px] border border-white/[0.08] bg-black/20 px-2.5 py-1.5 font-mono text-[8px] font-semibold uppercase tracking-[0.14em] text-white/65">
              Kapitech / Insight
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
              <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-white/46">
                {categoryName || 'Editorial'}
              </span>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-[11px] border border-white/[0.09] bg-white/[0.025] text-white">
                <ArrowUpRight size={15} aria-hidden="true" />
              </span>
            </div>
          </Link>
        )}

        <div className={featured ? 'flex min-h-full flex-col justify-between p-6 sm:p-8 lg:p-9' : 'flex flex-1 flex-col p-5 sm:p-6'}>
          <div>
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-[8px] font-mono uppercase tracking-[0.14em] text-[#737B88]">
              {categoryName && <span className="text-brand-red">{categoryName}</span>}
              {insight.readingTime && (
                <>
                  <span className="text-white/[0.18]" aria-hidden="true">/</span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock3 size={10} aria-hidden="true" />
                    {insight.readingTime} min
                  </span>
                </>
              )}
              {insight.publishedAt && (
                <>
                  <span className="text-white/[0.18]" aria-hidden="true">/</span>
                  <span>{formatDate(insight.publishedAt, language)}</span>
                </>
              )}
            </div>

            <Link
              to={'/insights/' + insight.slug}
              className="mt-4 block rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60"
            >
              <h2 className={[
                'font-display font-semibold leading-[1.05] tracking-[-0.045em] text-white transition-colors duration-300 group-hover:text-brand-red',
                featured ? 'text-3xl sm:text-4xl lg:text-[2.62rem]' : 'text-[1.36rem] sm:text-[1.46rem]'
              ].join(' ')}>
                {insight.title}
              </h2>
            </Link>

            {insight.excerpt && (
              <p className={[
                'font-light leading-[1.75] text-[#979FAA]',
                featured ? 'mt-5 max-w-xl text-sm sm:text-[0.98rem]' : 'mt-3 text-[13px] sm:text-sm'
              ].join(' ')}>
                {insight.excerpt}
              </p>
            )}
          </div>

          <div className={featured ? 'mt-9' : 'mt-7'}>
            <div className="flex items-end justify-between gap-4">
              <div className="min-w-0">
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {tags.map(tag => (
                      <span
                        key={tag.id || tag.slug}
                        className="text-[8px] font-mono uppercase tracking-[0.11em] text-[#656D7A]"
                      >
                        #{tag.name}
                      </span>
                    ))}
                  </div>
                )}
                {insight.author?.name && (
                  <p className="mt-3 truncate text-[10px] font-medium text-[#D9DDE4]">
                    {insight.author.name}
                    {insight.author.role ? <span className="text-[#626A76]"> · {insight.author.role}</span> : null}
                  </p>
                )}
              </div>

              <Link
                to={'/insights/' + insight.slug}
                className="group/read inline-flex min-h-9 shrink-0 items-center gap-2 rounded-[11px] border border-white/[0.08] bg-white/[0.02] px-3 text-[9px] font-semibold uppercase tracking-[0.11em] text-[#DDE1E8] transition-[background-color,border-color,color,transform] duration-300 hover:-translate-y-0.5 hover:border-brand-red/35 hover:bg-brand-red/[0.09] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60"
              >
                {language === 'id' ? 'Buka' : 'Open'}
                <ArrowUpRight size={13} aria-hidden="true" className="transition-transform duration-300 group-hover/read:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

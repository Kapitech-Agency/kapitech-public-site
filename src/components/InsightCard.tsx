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
        'group relative overflow-hidden border transition-[border-color,background-color,box-shadow,transform] duration-500',
        'bg-[rgba(15,17,22,0.72)] backdrop-blur-xl',
        'hover:-translate-y-0.5 hover:border-brand-red/30 hover:shadow-[0_24px_70px_-46px_rgba(229,9,20,0.34)]',
        featured
          ? 'rounded-[28px] border-white/[0.09]'
          : 'rounded-[22px] border-white/[0.08]'
      ].join(' ')}
    >
      <div className={featured ? 'grid lg:grid-cols-[1.16fr_0.84fr]' : 'flex flex-col'}>
        {insight.coverImage ? (
          <Link
            to={'/insights/' + insight.slug}
            aria-label={insight.title}
            className={[
              'group/media relative block overflow-hidden bg-[#0B0C0E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60 focus-visible:ring-inset',
              featured ? 'min-h-[280px] aspect-[16/10] lg:aspect-auto lg:min-h-[430px]' : 'aspect-[16/10]'
            ].join(' ')}
          >
            <img
              src={insight.coverImage}
              alt=""
              loading={featured ? 'eager' : 'lazy'}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/media:scale-[1.045]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#07080A]/78 via-[#07080A]/12 to-transparent" />
            {featured && (
              <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#0B0C0E]/58 px-3 py-1.5 text-[9px] font-mono uppercase tracking-[0.16em] text-white/82 backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-red" />
                {language === 'id' ? 'Pilihan editor' : 'Featured insight'}
              </div>
            )}
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
              <span className="text-[9px] font-mono uppercase tracking-[0.16em] text-white/56">
                {insight.language.toUpperCase()}
              </span>
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-[#0B0C0E]/50 text-white backdrop-blur-md transition-[background-color,border-color,transform] duration-300 group-hover/media:translate-x-0.5 group-hover/media:border-brand-red/40 group-hover/media:bg-brand-red/15">
                <ArrowUpRight size={16} aria-hidden="true" />
              </span>
            </div>
          </Link>
        ) : (
          <Link
            to={'/insights/' + insight.slug}
            aria-label={insight.title}
            className={[
              'relative flex overflow-hidden bg-[radial-gradient(circle_at_70%_30%,rgba(229,9,20,0.16),transparent_38%),linear-gradient(135deg,#111319,#090A0C)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60 focus-visible:ring-inset',
              featured ? 'min-h-[280px] lg:min-h-[430px]' : 'aspect-[16/10]'
            ].join(' ')}
          >
            <div className="absolute inset-0 opacity-55">
              <div className="absolute left-[18%] top-[22%] h-24 w-24 rounded-full border border-brand-red/20" />
              <div className="absolute left-[28%] top-[31%] h-32 w-32 rounded-full border border-white/[0.05]" />
              <div className="absolute right-[14%] bottom-[18%] h-16 w-16 rounded-full bg-brand-red/10 blur-2xl" />
            </div>
            <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4">
              <span className="text-[9px] font-mono uppercase tracking-[0.16em] text-white/55">
                {language === 'id' ? 'Kapitech Insight' : 'Kapitech Insight'}
              </span>
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white">
                <ArrowUpRight size={16} aria-hidden="true" />
              </span>
            </div>
          </Link>
        )}

        <div className={featured ? 'flex min-h-full flex-col justify-between p-6 sm:p-8 lg:p-9' : 'flex flex-1 flex-col p-5 sm:p-6'}>
          <div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[9px] font-mono uppercase tracking-[0.15em] text-[#7F8693]">
              {categoryName && (
                <span className="text-brand-red">{categoryName}</span>
              )}
              {insight.readingTime ? (
                <>
                  <span className="h-1 w-1 rounded-full bg-white/15" aria-hidden="true" />
                  <span className="inline-flex items-center gap-1.5">
                    <Clock3 size={11} aria-hidden="true" />
                    {insight.readingTime} min
                  </span>
                </>
              ) : null}
              {insight.publishedAt && (
                <>
                  <span className="h-1 w-1 rounded-full bg-white/15" aria-hidden="true" />
                  <span>{formatDate(insight.publishedAt, language)}</span>
                </>
              )}
            </div>

            <Link to={'/insights/' + insight.slug} className="mt-4 block rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60 focus-visible:ring-offset-4 focus-visible:ring-offset-[#0F1116]">
              <h2 className={[
                'font-display font-semibold leading-[1.06] tracking-[-0.04em] text-white transition-colors duration-300 group-hover:text-brand-red',
                featured ? 'text-3xl sm:text-4xl lg:text-[2.65rem]' : 'text-[1.32rem] sm:text-[1.4rem]'
              ].join(' ')}>
                {insight.title}
              </h2>
            </Link>

            {insight.excerpt && (
              <p className={[
                'text-[#99A0AD] font-light leading-[1.75]',
                featured ? 'mt-5 max-w-xl text-sm sm:text-[0.98rem]' : 'mt-3 text-[13px] sm:text-sm'
              ].join(' ')}>
                {insight.excerpt}
              </p>
            )}
          </div>

          <div className={featured ? 'mt-8' : 'mt-6'}>
            {tags.length > 0 && (
              <div className="mb-5 flex flex-wrap gap-1.5">
                {tags.map(tag => (
                  <span
                    key={tag.id || tag.slug}
                    className="rounded-full border border-white/[0.07] bg-white/[0.025] px-2.5 py-1 text-[9px] font-mono uppercase tracking-[0.1em] text-[#777E8B]"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-end justify-between gap-4 border-t border-white/[0.07] pt-4">
              <div className="min-w-0">
                {insight.author?.name && (
                  <p className="truncate text-xs font-medium text-[#E7E9EE]">{insight.author.name}</p>
                )}
                {insight.author?.role && (
                  <p className="mt-0.5 truncate text-[10px] text-[#6E7582]">{insight.author.role}</p>
                )}
              </div>

              <Link
                to={'/insights/' + insight.slug}
                className="inline-flex shrink-0 items-center gap-2 rounded-md text-[10px] font-semibold uppercase tracking-[0.12em] text-white transition-colors duration-300 group-hover:text-brand-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60 focus-visible:ring-offset-4 focus-visible:ring-offset-[#0F1116]"
              >
                {language === 'id' ? 'Baca Insight' : 'Read insight'}
                <ArrowUpRight size={14} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

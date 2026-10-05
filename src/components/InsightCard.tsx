import React from 'react';
import { ArrowRight, Clock3 } from 'lucide-react';
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

  return (
    <article className={
      featured
        ? 'group overflow-hidden rounded-[26px] border border-white/[0.09] bg-[#101216] transition-colors duration-300 hover:border-white/[0.16]'
        : 'group overflow-hidden rounded-[22px] border border-white/[0.08] bg-[#101216]/80 transition-colors duration-300 hover:border-white/[0.15]'
    }>
      {insight.coverImage && (
        <Link to={'/insights/' + insight.slug} aria-label={insight.title} className={'block overflow-hidden ' + (featured ? 'aspect-[16/7]' : 'aspect-[16/10]')}>
          <img
            src={insight.coverImage}
            alt=""
            loading={featured ? 'eager' : 'lazy'}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
          />
        </Link>
      )}

      <div className={featured ? 'p-6 sm:p-8' : 'p-5 sm:p-6'}>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[10px] font-mono uppercase tracking-[0.14em] text-[#8A909D]">
          {categoryName && <span className="text-brand-red">{categoryName}</span>}
          {insight.readingTime ? (
            <span className="inline-flex items-center gap-1.5">
              <Clock3 size={12} aria-hidden="true" />
              {insight.readingTime} min
            </span>
          ) : null}
          {insight.publishedAt && <span>{formatDate(insight.publishedAt, language)}</span>}
        </div>

        <Link to={'/insights/' + insight.slug} className="mt-3 block">
          <h2 className={(featured ? 'text-2xl sm:text-3xl ' : 'text-xl ') + 'font-display font-semibold leading-tight tracking-[-0.025em] text-white transition-colors group-hover:text-brand-red'}>
            {insight.title}
          </h2>
        </Link>

        {insight.excerpt && (
          <p className={(featured ? 'mt-4 max-w-3xl ' : 'mt-3 ') + 'text-sm leading-6 text-[#9BA1AE]'}>
            {insight.excerpt}
          </p>
        )}

        <div className="mt-5 flex items-center justify-between gap-4">
          <div className="min-w-0">
            {insight.author?.name && <p className="truncate text-xs font-medium text-[#E7E9EE]">{insight.author.name}</p>}
            {insight.author?.role && <p className="mt-0.5 truncate text-[11px] text-[#707684]">{insight.author.role}</p>}
          </div>
          <span className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-white transition-colors group-hover:text-brand-red">
            {language === 'id' ? 'Baca' : 'Read'}
            <ArrowRight size={14} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </article>
  );
};

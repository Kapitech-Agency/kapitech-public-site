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
        'group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.014] shadow-[inset_0_1px_0_rgba(255,255,255,0.018)] transition-[background-color,border-color,transform,box-shadow] duration-300',
        'hover:-translate-y-1 hover:border-brand-red/20 hover:bg-white/[0.022] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.028),0_18px_40px_-30px_rgba(229,9,20,0.25)]'
      ].join(' ')}
    >
      <span
        className="pointer-events-none absolute inset-x-5 top-0 z-20 h-px origin-left scale-x-0 bg-brand-red/75 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
        aria-hidden="true"
      />

      <div className="relative overflow-hidden">
        {insight.coverImage ? (
          <Link to={'/insights/' + insight.slug} aria-label={insight.title} className="group/media relative block aspect-[16/9] overflow-hidden bg-[#101114] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60 focus-visible:ring-inset">
            <img
              src={insight.coverImage}
              alt=""
              loading={featured ? 'eager' : 'lazy'}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover/media:scale-[1.035]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#090A0C] via-transparent to-transparent" />
            <div className="absolute left-4 top-4">
              <span className="kapi-section-label !border-white/[0.08] !bg-[#0B0C0E]/72 !px-3 !py-1.5 !text-[8px]">
                {featured ? (language === 'id' ? 'EDITOR PICK' : 'EDITOR PICK') : 'INSIGHT'}
              </span>
            </div>
            <span className="absolute bottom-4 right-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-red text-white shadow-lg shadow-brand-red/15 transition-transform duration-300 group-hover/media:translate-x-0.5" aria-hidden="true">
              <ArrowUpRight size={15} />
            </span>
          </Link>
        ) : (
          <Link to={'/insights/' + insight.slug} aria-label={insight.title} className="relative flex aspect-[16/9] overflow-hidden bg-[#101114]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_22%,rgba(229,9,20,0.15),transparent_30%),linear-gradient(135deg,#15171D,#090A0C)]" aria-hidden="true" />
            <div className="absolute left-4 top-4">
              <span className="kapi-section-label !border-white/[0.08] !bg-[#0B0C0E]/72 !px-3 !py-1.5 !text-[8px]">
                INSIGHT
              </span>
            </div>
            <span className="absolute bottom-4 right-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-red text-white" aria-hidden="true">
              <ArrowUpRight size={15} />
            </span>
          </Link>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-[8px] font-mono uppercase tracking-[0.14em] text-[#6F757F]">
          {categoryName && <span className="text-brand-red">{categoryName}</span>}
          {insight.readingTime && <><span className="text-white/[0.18]">/</span><span className="inline-flex items-center gap-1.5"><Clock3 size={10} />{insight.readingTime} min</span></>}
          {insight.publishedAt && <><span className="text-white/[0.18]">/</span><span>{formatDate(insight.publishedAt, language)}</span></>}
        </div>

        <Link to={'/insights/' + insight.slug} className="mt-4 block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60">
          <h2 className="font-display font-semibold leading-[1.05] tracking-[-0.045em] text-white transition-colors duration-300 group-hover:text-brand-red sm:text-[1.45rem]">
            {insight.title}
          </h2>
        </Link>

        {insight.excerpt && (
          <p className="mt-3 text-[13px] font-light leading-[1.75] text-[#8A909D]">
            {insight.excerpt}
          </p>
        )}

        <div className="mt-7 flex items-end justify-between gap-4">
          <div className="min-w-0">
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-x-2.5 gap-y-1">
                {tags.map(tag => <span key={tag.id || tag.slug} className="text-[8px] font-mono uppercase tracking-[0.11em] text-[#6F757F]">#{tag.name}</span>)}
              </div>
            )}
            {insight.author?.name && (
              <p className="mt-3 truncate text-[10px] font-medium text-white/80">
                {insight.author.name}{insight.author.role ? <span className="text-[#626872]"> · {insight.author.role}</span> : null}
              </p>
            )}
          </div>

          <Link
            to={'/insights/' + insight.slug}
            className="inline-flex min-h-9 shrink-0 items-center gap-2 rounded-full border border-[#262930] bg-[#16181D] px-3.5 text-[9px] font-semibold uppercase tracking-[0.11em] text-white transition-[background-color,border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-brand-red hover:bg-brand-red hover:text-white active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60"
          >
            {language === 'id' ? 'Buka' : 'Open'}
            <ArrowUpRight size={13} />
          </Link>
        </div>
      </div>
    </article>
  );
};
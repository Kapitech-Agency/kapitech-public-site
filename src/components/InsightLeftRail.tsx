import React from 'react';
import { Check, Share2 } from 'lucide-react';
import type { InsightLanguage } from '../data/insightTypes';

type InsightLeftRailProps = {
  language: InsightLanguage;
  readingProgress: number;
  copied: boolean;
  onShare: () => void;
  mobile?: boolean;
};

const progressText = (language: InsightLanguage) => (
  language === 'id' ? 'Kemajuan membaca artikel' : 'Article reading progress'
);

export const InsightLeftRail: React.FC<InsightLeftRailProps> = ({
  language,
  readingProgress,
  copied,
  onShare,
  mobile = false
}) => {
  const shareLabel = copied
    ? (language === 'id' ? 'Tautan disalin' : 'Link copied')
    : (language === 'id' ? 'Bagikan artikel' : 'Share article');

  if (mobile) {
    return (
      <div
        className="mb-5 flex items-center justify-between gap-4 border-y border-white/[0.08] py-3 xl:hidden"
        aria-label={language === 'id' ? 'Utilitas artikel' : 'Article utilities'}
      >
        <button
          type="button"
          onClick={onShare}
          className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/[0.08] px-3.5 text-[9px] font-semibold uppercase tracking-[0.11em] text-[#A2A8B3] transition-[border-color,color,background-color] duration-200 hover:border-brand-red/35 hover:bg-brand-red/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60"
          aria-label={shareLabel}
        >
          {copied ? <Check size={13} aria-hidden="true" /> : <Share2 size={13} aria-hidden="true" />}
          {copied ? (language === 'id' ? 'Disalin' : 'Copied') : (language === 'id' ? 'Bagikan' : 'Share')}
        </button>

        <div
          className="flex min-w-0 flex-1 items-center justify-end gap-3"
          role="progressbar"
          aria-label={progressText(language)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(readingProgress)}
        >
          <div className="h-px w-full max-w-28 bg-white/[0.08]" aria-hidden="true">
            <div
              className="h-full bg-brand-red transition-[width] duration-200"
              style={{ width: readingProgress + '%' }}
            />
          </div>
          <span className="shrink-0 font-mono text-[9px] tabular-nums text-[#68707C]">
            {Math.round(readingProgress)}%
          </span>
        </div>
      </div>
    );
  }

  return (
    <aside
      className="sticky top-24 hidden h-fit xl:flex xl:flex-col xl:items-center"
      aria-label={language === 'id' ? 'Utilitas artikel' : 'Article utilities'}
    >
      <button
        type="button"
        onClick={onShare}
        className="group flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] text-[#707885] transition-[border-color,color,background-color,transform] duration-200 hover:-translate-y-0.5 hover:border-brand-red/35 hover:bg-brand-red/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60"
        aria-label={shareLabel}
        title={shareLabel}
      >
        {copied ? <Check size={15} aria-hidden="true" /> : <Share2 size={15} aria-hidden="true" />}
      </button>

      <div
        className="mt-8 flex w-full flex-col items-center"
        role="progressbar"
        aria-label={progressText(language)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(readingProgress)}
      >
        <div className="relative h-32 w-px overflow-hidden rounded-full bg-white/[0.08]" aria-hidden="true">
          <div
            className="absolute inset-x-0 bottom-0 rounded-full bg-brand-red transition-[height] duration-200"
            style={{ height: readingProgress + '%' }}
          />
        </div>
        <span className="mt-3 font-mono text-[9px] tabular-nums text-[#5F6672]">
          {Math.round(readingProgress)}%
        </span>
      </div>
    </aside>
  );
};

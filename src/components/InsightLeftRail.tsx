import React from 'react';
import { Check, Share2 } from 'lucide-react';
import type { InsightLanguage } from '../data/insightTypes';

type ShareState = 'idle' | 'copied' | 'shared';

type InsightLeftRailProps = {
  language: InsightLanguage;
  readingProgress: number;
  shareState: ShareState;
  onShare: () => void;
  mobile?: boolean;
};

const progressText = (language: InsightLanguage) => (
  language === 'id' ? 'Kemajuan membaca artikel' : 'Article reading progress'
);

export const InsightLeftRail: React.FC<InsightLeftRailProps> = ({
  language,
  readingProgress,
  shareState,
  onShare,
  mobile = false
}) => {
  const progress = Math.max(0, Math.min(100, Math.round(readingProgress)));
  const shareLabel = shareState === 'copied'
    ? (language === 'id' ? 'Tautan disalin' : 'Link copied')
    : shareState === 'shared'
      ? (language === 'id' ? 'Artikel dibagikan' : 'Article shared')
      : (language === 'id' ? 'Bagikan artikel' : 'Share article');

  const shareText = shareState === 'copied'
    ? (language === 'id' ? 'Disalin' : 'Copied')
    : shareState === 'shared'
      ? (language === 'id' ? 'Terkirim' : 'Shared')
      : (language === 'id' ? 'Bagikan' : 'Share');

  if (mobile) {
    return (
      <div
        className="mb-4 flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.014] p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.018)] xl:hidden"
        aria-label={language === 'id' ? 'Utilitas artikel' : 'Article utilities'}
      >
        <button
          type="button"
          onClick={onShare}
          className={[
            'inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-[9px] font-semibold uppercase tracking-[0.11em] transition-[background-color,border-color,color,box-shadow,transform] duration-300 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60',
            shareState === 'idle'
              ? 'border-[#262930] bg-[#16181D] text-white hover:border-brand-red/45 hover:bg-brand-red/10'
              : 'border-brand-red/35 bg-brand-red text-white shadow-lg shadow-brand-red/15'
          ].join(' ')}
          aria-label={shareLabel}
        >
          {shareState !== 'idle' ? <Check size={13} aria-hidden="true" /> : <Share2 size={13} aria-hidden="true" />}
          {shareText}
        </button>

        <div
          className="min-w-0 flex-1"
          role="progressbar"
          aria-label={progressText(language)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
        >
          <div className="flex items-center justify-between gap-3">
            <span className="text-[8px] font-mono uppercase tracking-[0.14em] text-[#8A909D]">
              {language === 'id' ? 'Membaca' : 'Reading'}
            </span>
            <span className="font-mono text-[10px] font-semibold tabular-nums text-white">{progress}%</span>
          </div>
          <div className="relative mt-2 h-1 overflow-hidden rounded-full bg-white/[0.08]" aria-hidden="true">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-brand-red transition-[width] duration-300"
              style={{ width: progress + '%' }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <aside
      className="sticky top-24 hidden h-fit w-12 xl:flex xl:flex-col xl:items-center"
      aria-label={language === 'id' ? 'Utilitas artikel' : 'Article utilities'}
    >
      <button
        type="button"
        onClick={onShare}
        className={[
          'group relative flex h-11 w-11 items-center justify-center rounded-full border transition-[background-color,border-color,color,transform,box-shadow] duration-300 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60',
          shareState === 'idle'
            ? 'border-[#262930] bg-[#16181D] text-white hover:-translate-y-0.5 hover:border-brand-red/50 hover:bg-brand-red hover:shadow-lg hover:shadow-brand-red/20'
            : 'border-brand-red bg-brand-red text-white shadow-lg shadow-brand-red/20'
        ].join(' ')}
        aria-label={shareLabel}
        title={shareLabel}
      >
        {shareState !== 'idle' ? <Check size={16} aria-hidden="true" /> : <Share2 size={16} aria-hidden="true" />}
      </button>

      <div
        className="mt-7 flex w-full flex-col items-center"
        role="progressbar"
        aria-label={progressText(language)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
      >
        <div className="relative h-32 w-[3px] overflow-hidden rounded-full bg-white/[0.08]" aria-hidden="true">
          <div
            className="absolute inset-x-0 bottom-0 rounded-full bg-brand-red transition-[height] duration-300"
            style={{ height: progress + '%' }}
          />
        </div>
        <div className="mt-3 flex h-7 min-w-10 items-center justify-center rounded-full border border-[#262930] bg-[#16181D] px-2 font-mono text-[9px] font-semibold tabular-nums text-white">
          {progress}%
        </div>
      </div>
    </aside>
  );
};
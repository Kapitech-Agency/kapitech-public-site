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
        className="mb-4 flex items-center gap-3 rounded-[18px] border border-white/[0.08] bg-white/[0.022] p-2.5 backdrop-blur-xl xl:hidden"
        aria-label={language === 'id' ? 'Utilitas artikel' : 'Article utilities'}
      >
        <button
          type="button"
          onClick={onShare}
          className={[
            'inline-flex min-h-10 shrink-0 items-center gap-2 rounded-[13px] border px-3.5 text-[9px] font-semibold uppercase tracking-[0.11em] transition-[background-color,border-color,color,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60',
            shareState === 'idle'
              ? 'border-white/[0.08] bg-white/[0.025] text-[#A2A8B3] hover:border-brand-red/35 hover:bg-brand-red/10 hover:text-white'
              : 'border-brand-red/30 bg-brand-red/[0.10] text-white'
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
            <span className="text-[8px] font-mono uppercase tracking-[0.14em] text-[#68707C]">
              {language === 'id' ? 'Membaca' : 'Reading'}
            </span>
            <span className="font-mono text-[10px] font-semibold tabular-nums text-white">{progress}%</span>
          </div>
          <div className="relative mt-2 h-1 overflow-hidden rounded-full bg-white/[0.08]" aria-hidden="true">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-brand-red transition-[width] duration-300"
              style={{ width: progress + '%' }}
            />
            <span
              className="absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full border border-[#0B0C0E] bg-brand-red shadow-[0_0_0_3px_rgba(220,20,60,0.12)] transition-[left] duration-300"
              style={{ left: 'calc(' + progress + '% - 4px)' }}
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
          'group relative flex h-11 w-11 items-center justify-center rounded-[14px] border transition-[background-color,border-color,color,transform,box-shadow] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60',
          shareState === 'idle'
            ? 'border-white/[0.08] bg-white/[0.022] text-[#757D8A] hover:-translate-y-0.5 hover:border-brand-red/35 hover:bg-brand-red/10 hover:text-white hover:shadow-[0_14px_30px_-24px_rgba(229,9,20,0.8)]'
            : 'border-brand-red/35 bg-brand-red/[0.12] text-white shadow-[0_14px_30px_-24px_rgba(229,9,20,0.8)]'
        ].join(' ')}
        aria-label={shareLabel}
        title={shareLabel}
      >
        {shareState !== 'idle' ? <Check size={16} aria-hidden="true" /> : <Share2 size={16} aria-hidden="true" />}
        <span className="pointer-events-none absolute left-[calc(100%+10px)] top-1/2 hidden -translate-y-1/2 whitespace-nowrap rounded-full border border-white/[0.08] bg-[#111318] px-2.5 py-1.5 text-[8px] font-mono uppercase tracking-[0.12em] text-[#A2A8B3] opacity-0 shadow-[0_12px_34px_-20px_rgba(0,0,0,0.8)] transition-opacity duration-200 group-hover:opacity-100 xl:block">
          {shareText}
        </span>
      </button>

      <div
        className="mt-7 flex w-full flex-col items-center"
        role="progressbar"
        aria-label={progressText(language)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
      >
        <div className="relative h-32 w-[3px] overflow-hidden rounded-full bg-white/[0.07]" aria-hidden="true">
          <div
            className="absolute inset-x-0 bottom-0 rounded-full bg-brand-red transition-[height] duration-300"
            style={{ height: progress + '%' }}
          />
          <span
            className="absolute left-1/2 h-2 w-2 -translate-x-1/2 rounded-full border border-[#0B0C0E] bg-brand-red shadow-[0_0_0_3px_rgba(220,20,60,0.12)] transition-[bottom] duration-300"
            style={{ bottom: 'calc(' + progress + '% - 4px)' }}
          />
        </div>
        <div className="mt-3 flex h-7 min-w-9 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.022] px-2 font-mono text-[9px] font-semibold tabular-nums text-[#7B8491]">
          {progress}%
        </div>
      </div>
    </aside>
  );
};

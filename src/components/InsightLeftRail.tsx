import React from 'react';
import {
  Check,
  Copy,
  Facebook,
  Instagram,
  Linkedin,
  Share2
} from 'lucide-react';
import type { InsightLanguage } from '../data/insightTypes';

type ShareState = 'idle' | 'copied' | 'shared';

type InsightLeftRailProps = {
  language: InsightLanguage;
  readingProgress: number;
  shareState: ShareState;
  onShare: () => void;
  onCopy: () => void;
  mobile?: boolean;
};

const progressText = (language: InsightLanguage) => (
  language === 'id' ? 'Kemajuan membaca artikel' : 'Article reading progress'
);

const toolText = (language: InsightLanguage, key: 'share' | 'copy') => {
  if (key === 'copy') {
    return language === 'id' ? 'Salin tautan artikel' : 'Copy article link';
  }

  return language === 'id' ? 'Bagikan artikel' : 'Share article';
};


const getArticleUrl = () => (
  typeof window !== 'undefined' ? window.location.href : ''
);

const SocialIcon: React.FC<{ type: 'facebook' | 'instagram' | 'x' | 'linkedin' }> = ({ type }) => {
  if (type === 'facebook') return <Facebook size={15} strokeWidth={2} aria-hidden="true" />;
  if (type === 'instagram') return <Instagram size={15} strokeWidth={2} aria-hidden="true" />;
  if (type === 'linkedin') return <Linkedin size={15} strokeWidth={2} aria-hidden="true" />;

  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[15px] w-[15px]"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
};

export const InsightLeftRail: React.FC<InsightLeftRailProps> = ({
  language,
  readingProgress,
  shareState,
  onShare,
  onCopy,
  mobile = false
}) => {
  const progress = Math.max(0, Math.min(100, Math.round(readingProgress)));
  const articleUrl = getArticleUrl();
  const encodedUrl = encodeURIComponent(articleUrl);

  const socialLinks = [
    {
      key: 'facebook',
      label: 'Facebook',
      href: 'https://www.facebook.com/sharer/sharer.php?u=' + encodedUrl,
      type: 'facebook' as const
    },
    {
      key: 'x',
      label: 'X',
      href: 'https://x.com/intent/post?url=' + encodedUrl + '&text=' + encodeURIComponent(
        typeof document !== 'undefined' ? document.title : 'Kapitech Insight'
      ),
      type: 'x' as const
    },
    {
      key: 'linkedin',
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/sharing/share-offsite/?url=' + encodedUrl,
      type: 'linkedin' as const
    }
  ];

  const buttonClass = [
    'group relative inline-flex items-center justify-center rounded-full border transition-[background-color,border-color,color,box-shadow,transform] duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35',
    'active:scale-[0.97]'
  ].join(' ');

  const renderSocialButtons = (compact = false) => (
    <div className={compact ? 'flex items-center gap-1.5' : 'flex flex-col items-center gap-1.5'} aria-label={language === 'id' ? 'Bagikan ke media sosial' : 'Share on social media'}>
      {socialLinks.map((item) => (
        <a
          key={item.key}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={language === 'id' ? 'Bagikan ke ' + item.label : 'Share on ' + item.label}
          title={language === 'id' ? 'Bagikan ke ' + item.label : 'Share on ' + item.label}
          data-analytics-event="insight_social_share"
          data-social-network={item.key}
          className={[
            buttonClass,
            compact ? 'h-9 w-9' : 'h-9 w-9',
            'border-white/[0.08] bg-white/[0.018] text-[#9DA4B0] hover:border-brand-red/60 hover:bg-brand-red hover:text-white'
          ].join(' ')}
        >
          <SocialIcon type={item.type} />
          <span className="pointer-events-none absolute left-[calc(100%+10px)] top-1/2 z-20 hidden -translate-y-1/2 whitespace-nowrap rounded-lg border border-white/[0.08] bg-[#101114] px-2.5 py-1.5 text-[9px] font-mono text-white opacity-0 shadow-lg transition-[opacity,transform] duration-150 group-hover:translate-x-0.5 group-hover:opacity-100 group-focus-visible:translate-x-0.5 group-focus-visible:opacity-100 xl:block">
            {item.label}
          </span>
        </a>
      ))}

      <button
        type="button"
        onClick={onCopy}
        aria-label={language === 'id' ? 'Salin tautan untuk Instagram' : 'Copy link for Instagram'}
        title={language === 'id' ? 'Salin tautan untuk Instagram' : 'Copy link for Instagram'}
        data-analytics-event="insight_copy_link"
        data-social-network="instagram"
        className={[
          buttonClass,
          'h-9 w-9',
          'border-white/[0.08] bg-white/[0.018] text-[#9DA4B0] hover:border-brand-red/60 hover:bg-brand-red hover:text-white'
        ].join(' ')}
      >
        <SocialIcon type="instagram" />
      </button>

      <button
        type="button"
        onClick={onCopy}
        aria-label={toolText(language, 'copy')}
        title={toolText(language, 'copy')}
        data-analytics-event="insight_copy_link"
        className={[
          buttonClass,
          compact ? 'h-9 w-9' : 'h-9 w-9',
          shareState === 'copied'
            ? 'border-white/[0.14] bg-brand-red/[0.14] text-white'
            : 'border-white/[0.08] bg-white/[0.018] text-[#9DA4B0] hover:border-brand-red/60 hover:bg-brand-red hover:text-white'
        ].join(' ')}
      >
        {shareState === 'copied'
          ? <Check size={15} aria-hidden="true" />
          : <Copy size={15} aria-hidden="true" />}
        <span className="pointer-events-none absolute left-[calc(100%+10px)] top-1/2 z-20 hidden -translate-y-1/2 whitespace-nowrap rounded-lg border border-white/[0.08] bg-[#101114] px-2.5 py-1.5 text-[9px] font-mono text-white opacity-0 shadow-lg transition-[opacity,transform] duration-150 group-hover:translate-x-0.5 group-hover:opacity-100 group-focus-visible:translate-x-0.5 group-focus-visible:opacity-100 xl:block">
          {shareState === 'copied'
            ? (language === 'id' ? 'Tautan disalin' : 'Link copied')
            : toolText(language, 'copy')}
        </span>
      </button>
    </div>
  );

  if (mobile) {
    return (
      <div
        className="mb-4 rounded-2xl border border-white/[0.07] bg-white/[0.014] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.018)] xl:hidden"
        aria-label={language === 'id' ? 'Utilitas artikel' : 'Article utilities'}
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onShare}
            className={[
              'inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full border px-3.5 text-[9px] font-semibold uppercase tracking-[0.11em] transition-[background-color,border-color,color,box-shadow,transform] duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35',
              shareState === 'shared'
                ? 'border-white/[0.12] bg-brand-red text-white'
                : 'border-white/[0.08] bg-white/[0.022] text-white hover:border-brand-red/60 hover:bg-brand-red'
            ].join(' ')}
            aria-label={toolText(language, 'share')}
          >
            {shareState === 'shared'
              ? <Check size={13} aria-hidden="true" />
              : <Share2 size={13} aria-hidden="true" />}
            {language === 'id' ? 'Bagikan' : 'Share'}
          </button>

          <div className="min-w-0 flex-1 overflow-x-auto">
            {renderSocialButtons(true)}
          </div>

          <div
            className="hidden min-w-[102px] sm:block"
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
                className="absolute inset-y-0 left-0 rounded-full bg-white transition-[width] duration-300"
                style={{ width: progress + '%' }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <aside
      className="sticky top-24 hidden w-12 shrink-0 xl:flex xl:flex-col xl:items-center xl:justify-self-end"
      aria-label={language === 'id' ? 'Bagikan dan progres artikel' : 'Article sharing and progress'}
    >
      <span className="mb-3 w-full text-center text-[8px] font-mono uppercase tracking-[0.14em] text-[#5E6672]">
        {language === 'id' ? 'Bagikan' : 'Share'}
      </span>

      {renderSocialButtons()}

      <span className="my-4 h-px w-6 bg-white/[0.08]" aria-hidden="true" />

      <div
        className="flex w-full flex-col items-center"
        role="progressbar"
        aria-label={progressText(language)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
      >
        <div className="relative h-28 w-[3px] overflow-hidden rounded-full bg-white/[0.08]" aria-hidden="true">
          <div
            className="absolute inset-x-0 bottom-0 rounded-full bg-white transition-[height] duration-300"
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

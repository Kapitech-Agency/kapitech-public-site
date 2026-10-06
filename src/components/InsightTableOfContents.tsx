import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { InsightLanguage } from '../data/insightTypes';
import type { InsightTocItem } from '../lib/insightHeadingIds';

type TocVariant = 'all' | 'desktop' | 'mobile';

const ANCHOR_OFFSET_PX = 112;

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function currentHash(): string {
  if (typeof window === 'undefined') return '';
  return window.location.hash.replace(/^#/, '');
}

function scrollToHeading(id: string, behavior: ScrollBehavior): void {
  document.getElementById(id)?.scrollIntoView({
    behavior,
    block: 'start'
  });
}

function itemText(language: InsightLanguage, item: InsightTocItem): string {
  return item.level === 3 && language === 'id' ? 'Subbagian: ' + item.text : item.text;
}

export const InsightTableOfContents: React.FC<{
  items: InsightTocItem[];
  language: InsightLanguage;
  variant?: TocVariant;
}> = ({ items, language, variant = 'all' }) => {
  const validItems = useMemo(
    () => items.filter((item) => item?.id && (item.level === 2 || item.level === 3)),
    [items]
  );
  const [activeId, setActiveId] = useState(validItems[0]?.id || '');
  const [mobileOpen, setMobileOpen] = useState(false);
  const desktopItemRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());
  const mobileItemRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());

  useEffect(() => {
    if (!validItems.length) {
      setActiveId('');
      return;
    }

    const hash = currentHash();
    const initial = validItems.some((item) => item.id === hash) ? hash : validItems[0].id;
    setActiveId(initial);

    const headings = validItems
      .map((item) => document.getElementById(item.id))
      .filter((node): node is HTMLElement => Boolean(node));

    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

      if (visible[0]?.target instanceof HTMLElement) {
        setActiveId(visible[0].target.id);
      }
    }, {
      root: null,
      rootMargin: '-' + ANCHOR_OFFSET_PX + 'px 0px -55% 0px',
      threshold: [0, 0.01, 1]
    });

    headings.forEach((heading) => observer.observe(heading));

    const endMarker = document.querySelector<HTMLElement>('[data-insight-article-end]');
    const endObserver = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setActiveId(validItems[validItems.length - 1].id);
      }
    }, {
      root: null,
      rootMargin: '0px 0px -28% 0px',
      threshold: [0, 1]
    });

    if (endMarker) endObserver.observe(endMarker);

    const applyHash = (shouldScroll: boolean) => {
      const hash = currentHash();
      if (!hash || !validItems.some((item) => item.id === hash)) return;

      setActiveId(hash);
      if (shouldScroll) {
        window.requestAnimationFrame(() => {
          scrollToHeading(hash, 'auto');
        });
      }
    };

    const handleHashChange = () => applyHash(true);
    const handlePopState = () => applyHash(true);

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handlePopState);

    if (hash && initial === hash) {
      window.requestAnimationFrame(() => scrollToHeading(hash, 'auto'));
    }

    return () => {
      observer.disconnect();
      endObserver.disconnect();
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [validItems]);

  useEffect(() => {
    if (!activeId) return;

    const reveal = (refMap: Map<string, HTMLAnchorElement>) => {
      const node = refMap.get(activeId);
      if (!node) return;
      node.scrollIntoView({ behavior: 'auto', block: 'nearest' });
    };

    window.requestAnimationFrame(() => {
      reveal(desktopItemRefs.current);
      reveal(mobileItemRefs.current);
    });
  }, [activeId]);

  if (!validItems.length) return null;

  const navigateTo = (item: InsightTocItem, mobile = false) => {
    const target = document.getElementById(item.id);
    if (!target) return;

    setActiveId(item.id);

    if (currentHash() !== item.id) {
      window.history.pushState(null, '', '#' + item.id);
    }

    scrollToHeading(item.id, prefersReducedMotion() ? 'auto' : 'smooth');

    if (mobile) setMobileOpen(false);
  };

  const register = (
    map: Map<string, HTMLAnchorElement>,
    id: string,
    node: HTMLAnchorElement | null
  ) => {
    if (node) map.set(id, node);
    else map.delete(id);
  };

  const renderItems = (refMap: Map<string, HTMLAnchorElement>, mobile = false) => (
    <div className="space-y-1">
      {validItems.map((item, index) => {
        const active = activeId === item.id;
        const isH2 = item.level === 2;

        return (
          <a
            key={item.id}
            ref={(node) => register(refMap, item.id, node)}
            href={'#' + item.id}
            onClick={(event) => {
              event.preventDefault();
              navigateTo(item, mobile);
            }}
            aria-current={active ? 'location' : undefined}
            aria-label={itemText(language, item)}
            className={[
              'relative flex w-full items-start rounded-lg text-left transition-[background-color,color,border-color] duration-200',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60',
              isH2 ? 'px-3 py-2.5' : 'ml-5 px-3 py-2',
              active
                ? 'border-l-2 border-brand-red bg-white/[0.035] text-white'
                : 'border-l-2 border-transparent text-[#737C89] hover:bg-white/[0.02] hover:text-[#C8CDD5]'
            ].join(' ')}
          >
            {isH2 && (
              <span className={[
                'mr-3 shrink-0 pt-0.5 font-mono text-[9px] tabular-nums',
                active ? 'text-brand-red' : 'text-[#59616D]'
              ].join(' ')}>
                {String(validItems.slice(0, index + 1).filter((entry) => entry.level === 2).length).padStart(2, '0')}
              </span>
            )}

            <span className={[
              'min-w-0 leading-[1.45]',
              isH2 ? 'text-[12px] font-medium' : 'text-[11px] font-normal'
            ].join(' ')}>
              {item.text}
            </span>
          </a>
        );
      })}
    </div>
  );

  const label = language === 'id' ? 'Di artikel ini' : 'In this article';
  const navigationLabel = language === 'id' ? 'Daftar isi artikel' : 'Article table of contents';
  const current = validItems.find((item) => item.id === activeId) || validItems[0];
  const h2Count = validItems.filter((item) => item.level === 2).length;

  const mobile = (
    <div className={variant === 'desktop' ? 'hidden' : 'xl:hidden'}>
      <div className="rounded-[18px] border border-white/[0.08] bg-[rgba(15,17,22,0.74)] backdrop-blur-xl">
        <button
          type="button"
          aria-expanded={mobileOpen}
          aria-controls="insight-mobile-toc-list"
          onClick={() => setMobileOpen((value) => !value)}
          className="flex min-h-[60px] w-full items-center justify-between gap-4 px-4 py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-red/60"
        >
          <span className="min-w-0">
            <span className="text-[9px] font-mono uppercase tracking-[0.17em] text-brand-red">{label}</span>
            <span className="mt-1 block truncate text-[13px] font-medium text-white">{current.text}</span>
          </span>
          <ChevronDown
            size={16}
            aria-hidden="true"
            className={[
              'shrink-0 transition-transform duration-200',
              mobileOpen ? 'rotate-180 text-white' : 'text-[#737C89]'
            ].join(' ')}
          />
        </button>

        {mobileOpen && (
          <nav
            id="insight-mobile-toc-list"
            aria-label={navigationLabel}
            className="max-h-[min(70vh,34rem)] overflow-y-auto overscroll-contain border-t border-white/[0.07] p-3"
          >
            {renderItems(mobileItemRefs.current, true)}
          </nav>
        )}
      </div>
    </div>
  );

  const desktop = (
    <div className={variant === 'mobile' ? 'hidden' : 'hidden h-full min-h-0 xl:flex'}>
      <div className="flex h-full min-h-0 flex-1 flex-col rounded-[18px] border border-white/[0.08] bg-[rgba(15,17,22,0.72)] p-3.5 backdrop-blur-xl">
        <div className="flex shrink-0 items-end justify-between gap-4 px-1">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.17em] text-[#8E96A3]">{label}</p>
            <p className="mt-1 text-[9px] leading-4 text-[#5F6773]">
              {h2Count} {language === 'id' ? 'bagian' : h2Count === 1 ? 'section' : 'sections'}
            </p>
          </div>
          <span className="font-mono text-[9px] tabular-nums text-[#606873]">
            {String(validItems.findIndex((item) => item.id === activeId) + 1).padStart(2, '0')} / {String(validItems.length).padStart(2, '0')}
          </span>
        </div>

        <nav
          aria-label={navigationLabel}
          className="mt-4 min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1"
        >
          {renderItems(desktopItemRefs.current)}
        </nav>
      </div>
    </div>
  );

  return (
    <>
      {mobile}
      {desktop}
    </>
  );
};

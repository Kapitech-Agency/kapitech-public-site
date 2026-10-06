import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { InsightLanguage } from '../data/insightTypes';
import type { InsightTocItem } from '../lib/insightHeadingIds';

type TocVariant = 'all' | 'desktop' | 'mobile';

const ARTICLE_SCROLL_OFFSET_PX = 112;
const TOC_ROOT_BOTTOM_GAP = '55%';

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function getHash(): string {
  if (typeof window === 'undefined') return '';
  return decodeURIComponent(window.location.hash.replace(/^#/, ''));
}

function scrollToHeading(id: string, behavior: ScrollBehavior): void {
  document.getElementById(id)?.scrollIntoView({
    behavior,
    block: 'start'
  });
}

function setHash(id: string): void {
  if (typeof window === 'undefined') return;

  const next = '#' + encodeURIComponent(id);
  if (window.location.hash !== next) {
    window.history.pushState(null, '', next);
  }
}

function getSectionNumber(items: InsightTocItem[], index: number): string {
  const number = items
    .slice(0, index + 1)
    .filter((item) => item.level === 2)
    .length;

  return String(number).padStart(2, '0');
}

export const InsightTableOfContents: React.FC<{
  items: InsightTocItem[];
  language: InsightLanguage;
  variant?: TocVariant;
}> = ({ items, language, variant = 'all' }) => {
  const validItems = useMemo(
    () => items.filter((item) => Boolean(item?.id) && (item.level === 2 || item.level === 3)),
    [items]
  );

  const itemMeta = useMemo(
    () => validItems.map((item, index) => ({
      ...item,
      sectionNumber: item.level === 2 ? getSectionNumber(validItems, index) : undefined
    })),
    [validItems]
  );

  const [activeId, setActiveId] = useState(itemMeta[0]?.id || '');
  const [mobileOpen, setMobileOpen] = useState(false);

  const visibleHeadingsRef = useRef<Map<string, IntersectionObserverEntry>>(new Map());
  const desktopItemRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());
  const mobileItemRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());

  useEffect(() => {
    if (!validItems.length) {
      setActiveId('');
      return;
    }

    const headings = validItems
      .map((item) => document.getElementById(item.id))
      .filter((node): node is HTMLElement => Boolean(node));

    const visibleHeadings = visibleHeadingsRef.current;
    visibleHeadings.clear();

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const id = entry.target instanceof HTMLElement ? entry.target.id : '';
        if (!id) continue;

        if (entry.isIntersecting) {
          visibleHeadings.set(id, entry);
        } else {
          visibleHeadings.delete(id);
        }
      }

      const candidates = [...visibleHeadings.values()]
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

      const next = candidates[0]?.target;

      if (next instanceof HTMLElement && validItems.some((item) => item.id === next.id)) {
        setActiveId(next.id);
      }
    }, {
      root: null,
      rootMargin: '-' + ARTICLE_SCROLL_OFFSET_PX + 'px 0px -' + TOC_ROOT_BOTTOM_GAP + ' 0px',
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

    if (endMarker) {
      endObserver.observe(endMarker);
    }

    const syncHash = (shouldScroll: boolean) => {
      const hash = getHash();
      if (!hash || !validItems.some((item) => item.id === hash)) return;

      setActiveId(hash);

      if (shouldScroll) {
        window.requestAnimationFrame(() => {
          scrollToHeading(hash, 'auto');
        });
      }
    };

    const handleHashChange = () => syncHash(true);
    const handlePopState = () => syncHash(true);

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handlePopState);

    const initialHash = getHash();
    if (initialHash && validItems.some((item) => item.id === initialHash)) {
      syncHash(true);
    }

    return () => {
      observer.disconnect();
      endObserver.disconnect();
      visibleHeadings.clear();
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [validItems]);

  useEffect(() => {
    if (!activeId) return;

    const reveal = (
      refMap: Map<string, HTMLAnchorElement>,
      enabled: boolean
    ) => {
      if (!enabled) return;

      const node = refMap.get(activeId);
      if (!node) return;

      const scrollableList = node.parentElement?.parentElement;
      if (!(scrollableList instanceof HTMLElement)) return;

      const nodeTop = node.offsetTop;
      const nodeBottom = nodeTop + node.offsetHeight;
      const viewportTop = scrollableList.scrollTop;
      const viewportBottom = viewportTop + scrollableList.clientHeight;

      if (nodeTop < viewportTop || nodeBottom > viewportBottom) {
        node.scrollIntoView({
          behavior: 'auto',
          block: 'nearest'
        });
      }
    };

    window.requestAnimationFrame(() => {
      reveal(desktopItemRefs.current, variant !== 'mobile');
      reveal(mobileItemRefs.current, variant !== 'desktop' && mobileOpen);
    });
  }, [activeId, mobileOpen, variant]);

  if (!validItems.length) return null;

  const currentIndex = Math.max(
    0,
    itemMeta.findIndex((item) => item.id === activeId)
  );

  const current = itemMeta[currentIndex] || itemMeta[0];
  const h2Count = itemMeta.filter((item) => item.level === 2).length;
  const label = language === 'id' ? 'Di artikel ini' : 'In this article';
  const navigationLabel = language === 'id' ? 'Daftar isi artikel' : 'Article table of contents';

  const register = (
    map: Map<string, HTMLAnchorElement>,
    id: string,
    node: HTMLAnchorElement | null
  ) => {
    if (node) {
      map.set(id, node);
    } else {
      map.delete(id);
    }
  };

  const navigateTo = (item: InsightTocItem, mobile = false) => {
    const target = document.getElementById(item.id);
    if (!target) return;

    setActiveId(item.id);
    setHash(item.id);

    scrollToHeading(
      item.id,
      prefersReducedMotion() ? 'auto' : 'smooth'
    );

    if (mobile) {
      setMobileOpen(false);
    }
  };

  const renderItems = (
    refMap: Map<string, HTMLAnchorElement>,
    mobile = false
  ) => (
    <div className="space-y-0.5">
      {itemMeta.map((item) => {
        const active = activeId === item.id;
        const isH2 = item.level === 2;

        return (
          <a
            key={item.id}
            ref={(node) => register(refMap, item.id, node)}
            href={'#' + encodeURIComponent(item.id)}
            onClick={(event) => {
              event.preventDefault();
              navigateTo(item, mobile);
            }}
            aria-current={active ? 'location' : undefined}
            className={[
              'relative flex w-full items-start text-left',
              'transition-[color,background-color,border-color] duration-200',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-red/60',
              isH2
                ? 'min-h-10 gap-2.5 border-l-2 px-3 py-2'
                : 'ml-4 min-h-9 gap-2 border-l-2 px-3 py-1.5',
              active
                ? 'border-brand-red bg-white/[0.025] text-white'
                : 'border-transparent text-[#747C89] hover:bg-white/[0.018] hover:text-[#C8CDD5]'
            ].join(' ')}
          >
            {isH2 ? (
              <span
                aria-hidden="true"
                className={[
                  'w-5 shrink-0 pt-0.5 font-mono text-[9px] tabular-nums',
                  active ? 'text-brand-red' : 'text-[#59616D]'
                ].join(' ')}
              >
                {item.sectionNumber}
              </span>
            ) : (
              <span
                aria-hidden="true"
                className={[
                  'mt-[7px] h-1 w-1 shrink-0 rounded-full',
                  active ? 'bg-brand-red' : 'bg-[#3A4049]'
                ].join(' ')}
              />
            )}

            <span
              className={[
                'min-w-0 leading-[1.45]',
                isH2
                  ? active
                    ? 'text-[12px] font-semibold'
                    : 'text-[12px] font-medium'
                  : active
                    ? 'text-[11px] font-medium'
                    : 'text-[11px] font-normal'
              ].join(' ')}
            >
              {item.text}
            </span>
          </a>
        );
      })}
    </div>
  );

  const mobile = (
    <div className={variant === 'desktop' ? 'hidden' : 'xl:hidden'}>
      <div className="overflow-hidden rounded-[16px] border border-white/[0.08] bg-[#0F1116]">
        <button
          type="button"
          aria-expanded={mobileOpen}
          aria-controls="insight-mobile-toc-list"
          onClick={() => setMobileOpen((value) => !value)}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              setMobileOpen(false);
            }
          }}
          className="flex min-h-[58px] w-full items-center justify-between gap-4 px-4 py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-red/60"
        >
          <span className="min-w-0">
            <span className="block text-[9px] font-mono uppercase tracking-[0.17em] text-brand-red">
              {label}
            </span>
            <span className="mt-1 block truncate text-[13px] font-medium text-white">
              {current.text}
            </span>
          </span>

          <span className="flex shrink-0 items-center gap-3">
            <span className="font-mono text-[9px] tabular-nums text-[#606873]">
              {String(currentIndex + 1).padStart(2, '0')} / {String(itemMeta.length).padStart(2, '0')}
            </span>
            <ChevronDown
              size={16}
              aria-hidden="true"
              className={[
                'transition-transform duration-200',
                mobileOpen ? 'rotate-180 text-white' : 'text-[#737C89]'
              ].join(' ')}
            />
          </span>
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
      <div className="flex h-full min-h-0 flex-1 flex-col border-y border-white/[0.08] py-3">
        <div className="flex shrink-0 items-end justify-between gap-4 px-1 pb-1">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.17em] text-[#8E96A3]">
              {label}
            </p>
            <p className="mt-1 text-[9px] leading-4 text-[#5F6773]">
              {h2Count} {language === 'id'
                ? 'bagian'
                : h2Count === 1 ? 'section' : 'sections'}
            </p>
          </div>

          <span className="font-mono text-[9px] tabular-nums text-[#606873]">
            {String(currentIndex + 1).padStart(2, '0')} / {String(itemMeta.length).padStart(2, '0')}
          </span>
        </div>

        <nav
          aria-label={navigationLabel}
          className="mt-3 min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1"
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

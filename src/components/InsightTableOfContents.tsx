import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { InsightLanguage } from '../data/insightTypes';
import type { InsightTocItem } from '../lib/insightHeadingIds';

type TocVariant = 'all' | 'desktop' | 'mobile';

const ARTICLE_SCROLL_OFFSET_PX = 112;
const NAVIGATION_SETTLE_TOLERANCE_PX = 36;

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function getHash(): string {
  if (typeof window === 'undefined') return '';

  try {
    return decodeURIComponent(window.location.hash.replace(/^#/, ''));
  } catch {
    return '';
  }
}

function getDocumentMaxScroll(): number {
  if (typeof document === 'undefined' || typeof window === 'undefined') return 0;

  return Math.max(
    0,
    document.documentElement.scrollHeight - window.innerHeight
  );
}

function getHeadingTop(id: string): number | null {
  const heading = document.getElementById(id);
  if (!heading) return null;

  return heading.getBoundingClientRect().top;
}

function scrollToHeading(id: string, behavior: ScrollBehavior): void {
  const heading = document.getElementById(id);
  if (!heading || typeof window === 'undefined') return;

  const top = window.scrollY + heading.getBoundingClientRect().top - ARTICLE_SCROLL_OFFSET_PX;

  window.scrollTo({
    top: Math.max(0, top),
    behavior
  });
}

function setHash(id: string): void {
  if (typeof window === 'undefined') return;

  const next = '#' + encodeURIComponent(id);

  if (window.location.hash !== next) {
    window.history.pushState(null, '', next);
  }
}

function isNearHeading(id: string): boolean {
  const top = getHeadingTop(id);
  if (top === null || typeof window === 'undefined') return false;

  const nearTarget = Math.abs(top - ARTICLE_SCROLL_OFFSET_PX) <= NAVIGATION_SETTLE_TOLERANCE_PX;
  const atDocumentEnd = window.scrollY >= getDocumentMaxScroll() - 4;

  return nearTarget || atDocumentEnd;
}

export const InsightTableOfContents: React.FC<{
  items: InsightTocItem[];
  language: InsightLanguage;
  variant?: TocVariant;
}> = ({ items, language, variant = 'all' }) => {
  const sectionItems = useMemo(
    () => items.filter((item) => Boolean(item?.id) && item.level === 2),
    [items]
  );

  const [activeId, setActiveId] = useState(sectionItems[0]?.id || '');
  const [mobileItemMap] = useState(() => new Map<string, HTMLAnchorElement>());
  const [desktopItemMap] = useState(() => new Map<string, HTMLAnchorElement>());

  const rootRef = useRef<HTMLDivElement | null>(null);
  const activeIdRef = useRef(activeId);
  const navigationTargetRef = useRef('');
  const rafRef = useRef<number | null>(null);

  const isVariantActive = () => {
    if (typeof window === 'undefined') return false;
    if (variant === 'all') return true;

    const desktopViewport = window.matchMedia('(min-width: 1280px)').matches;
    return variant === 'desktop' ? desktopViewport : !desktopViewport;
  };

  useEffect(() => {
    activeIdRef.current = activeId;
  }, [activeId]);

  useEffect(() => {
    if (!activeId && sectionItems.length > 0) {
      activeIdRef.current = sectionItems[0].id;
      setActiveId(sectionItems[0].id);
    }
  }, [activeId, sectionItems]);

  const clearNavigationLock = () => {
    navigationTargetRef.current = '';
  };

  const setActive = (id: string) => {
    if (!id || activeIdRef.current === id) return;

    activeIdRef.current = id;
    setActiveId(id);
  };

  const syncActiveFromScroll = () => {
    if (!sectionItems.length) return;

    const maxScrollTop = getDocumentMaxScroll();

    if (window.scrollY <= 4) {
      setActive(sectionItems[0].id);
      return;
    }

    if (window.scrollY >= maxScrollTop - 4) {
      setActive(sectionItems[sectionItems.length - 1].id);
      return;
    }

    let currentId = sectionItems[0].id;

    for (const item of sectionItems) {
      const top = getHeadingTop(item.id);

      if (top === null) continue;

      if (top <= ARTICLE_SCROLL_OFFSET_PX) {
        currentId = item.id;
      } else {
        break;
      }
    }

    setActive(currentId);
  };

  const scheduleScrollSync = () => {
    if (rafRef.current !== null) return;

    rafRef.current = window.requestAnimationFrame(() => {
      rafRef.current = null;

      const pendingId = navigationTargetRef.current;

      if (pendingId) {
        const targetExists = getHeadingTop(pendingId) !== null;

        if (!targetExists) {
          clearNavigationLock();
          syncActiveFromScroll();
          return;
        }

        setActive(pendingId);

        if (isNearHeading(pendingId)) {
          clearNavigationLock();
          syncActiveFromScroll();
        }

        return;
      }

      syncActiveFromScroll();
    });
  };

  const startNavigation = (id: string) => {
    navigationTargetRef.current = id;
    setActive(id);
  };

  useEffect(() => {
    if (!sectionItems.length) {
      setActiveId('');
      return undefined;
    }

    const syncHash = (shouldScroll: boolean) => {
      const hash = getHash();

      if (!hash || !sectionItems.some((item) => item.id === hash)) {
        clearNavigationLock();
        scheduleScrollSync();
        return;
      }

      startNavigation(hash);

      if (shouldScroll) {
        window.requestAnimationFrame(() => {
          scrollToHeading(hash, 'auto');
          scheduleScrollSync();
        });
      }
    };

    const handleScroll = () => {
      if (isVariantActive()) scheduleScrollSync();
    };

    const handleResize = () => {
      if (isVariantActive()) scheduleScrollSync();
    };

    const handleHashChange = () => {
      if (isVariantActive()) syncHash(true);
    };

    const handlePopState = () => {
      if (isVariantActive()) syncHash(true);
    };

    const cancelOnUserIntent = (event: Event) => {
      if (!isVariantActive()) return;

      if (
        event.target instanceof Node
        && rootRef.current?.contains(event.target)
      ) {
        return;
      }

      clearNavigationLock();
      scheduleScrollSync();
    };

    const handleKeydown = (event: KeyboardEvent) => {
      if (!isVariantActive()) return;

      if (
        event.key === 'ArrowUp'
        || event.key === 'ArrowDown'
        || event.key === 'PageUp'
        || event.key === 'PageDown'
        || event.key === 'Home'
        || event.key === 'End'
        || event.key === ' '
      ) {
        clearNavigationLock();
        scheduleScrollSync();
      }
    };

    const mediaQuery = window.matchMedia('(min-width: 1280px)');
    const handleBreakpointChange = () => {
      clearNavigationLock();

      if (isVariantActive()) {
        window.requestAnimationFrame(syncActiveFromScroll);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);
    mediaQuery.addEventListener?.('change', handleBreakpointChange);
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('wheel', cancelOnUserIntent, { passive: true });
    window.addEventListener('touchstart', cancelOnUserIntent, { passive: true });
    window.addEventListener('pointerdown', cancelOnUserIntent);
    window.addEventListener('keydown', handleKeydown);

    const initialHash = getHash();

    if (!isVariantActive()) {
      return () => {
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleResize);
        mediaQuery.removeEventListener?.('change', handleBreakpointChange);
        window.removeEventListener('hashchange', handleHashChange);
        window.removeEventListener('popstate', handlePopState);
        window.removeEventListener('wheel', cancelOnUserIntent);
        window.removeEventListener('touchstart', cancelOnUserIntent);
        window.removeEventListener('pointerdown', cancelOnUserIntent);
        window.removeEventListener('keydown', handleKeydown);
      };
    }

    if (initialHash && sectionItems.some((item) => item.id === initialHash)) {
      syncHash(true);
    } else {
      window.requestAnimationFrame(syncActiveFromScroll);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('wheel', cancelOnUserIntent);
      window.removeEventListener('touchstart', cancelOnUserIntent);
      window.removeEventListener('pointerdown', cancelOnUserIntent);
      window.removeEventListener('keydown', handleKeydown);
      mediaQuery.removeEventListener?.('change', handleBreakpointChange);

      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }

      navigationTargetRef.current = '';
    };
  }, [sectionItems, variant]);

  useEffect(() => {
    if (!activeId) return;

    const reveal = (
      refs: Map<string, HTMLAnchorElement>,
      enabled: boolean
    ) => {
      if (!enabled) return;

      const node = refs.get(activeId);
      if (!node) return;

      const scrollable = node.closest('nav');

      if (!(scrollable instanceof HTMLElement)) return;

      const nodeRect = node.getBoundingClientRect();
      const scrollRect = scrollable.getBoundingClientRect();

      const outside =
        nodeRect.top < scrollRect.top
        || nodeRect.bottom > scrollRect.bottom;

      if (outside) {
        const targetTop =
          nodeRect.top - scrollRect.top + scrollable.scrollTop;
        const targetBottom =
          nodeRect.bottom - scrollRect.top + scrollable.scrollTop;

        const nextScrollTop = targetTop < scrollable.scrollTop
          ? Math.max(0, targetTop - 8)
          : Math.min(
              scrollable.scrollHeight - scrollable.clientHeight,
              targetBottom - scrollable.clientHeight + 8
            );

        scrollable.scrollTo({
          top: Math.max(0, nextScrollTop),
          behavior: 'auto'
        });
      }
    };

    window.requestAnimationFrame(() => {
      reveal(desktopItemMap, variant !== 'mobile');
      reveal(mobileItemMap, variant !== 'desktop');
    });
  }, [activeId, mobileItemMap, desktopItemMap, variant]);

  if (!sectionItems.length) return null;

  const currentIndex = Math.max(
    0,
    sectionItems.findIndex((item) => item.id === activeId)
  );

  const tocLabel = language === 'id' ? 'Di artikel ini' : 'In this article';
  const navigationLabel = language === 'id' ? 'Navigasi artikel' : 'Article navigation';
  const sectionCountLabel = language === 'id'
    ? 'bagian'
    : sectionItems.length === 1 ? 'section' : 'sections';

  const navigateTo = (item: InsightTocItem) => {
    const target = document.getElementById(item.id);
    if (!target) return;

    startNavigation(item.id);
    setHash(item.id);

    scrollToHeading(
      item.id,
      prefersReducedMotion() ? 'auto' : 'smooth'
    );

    window.requestAnimationFrame(scheduleScrollSync);
  };

  const register = (
    refs: Map<string, HTMLAnchorElement>,
    id: string,
    node: HTMLAnchorElement | null
  ) => {
    if (node) {
      refs.set(id, node);
    } else {
      refs.delete(id);
    }
  };

  const renderList = (mobile = false) => (
    <nav
      aria-label={navigationLabel}
      className={[
        'min-h-0 overflow-y-auto overscroll-contain pr-1 [scrollbar-gutter:stable]',
        mobile
          ? 'max-h-[min(24rem,58vh)]'
          : 'h-full'
      ].join(' ')}
    >
      <div className="space-y-0">
        {sectionItems.map((item, index) => {
          const active = item.id === activeId;

          return (
            <div
              key={item.id}
              className="relative border-b border-white/[0.06] last:border-b-0"
            >
              <a
                ref={(node) => register(
                  mobile ? mobileItemMap : desktopItemMap,
                  item.id,
                  node
                )}
                href={'#' + encodeURIComponent(item.id)}
                onClick={(event) => {
                  event.preventDefault();
                  navigateTo(item);
                }}
                aria-current={active ? 'location' : undefined}
                className={[
                  'flex w-full items-center gap-3 rounded-[10px] px-2.5 py-2.5 text-left transition-[background-color,color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60',
                  active
                    ? 'bg-brand-red/[0.055] text-white'
                    : 'text-[#C1C6CF] hover:bg-white/[0.018] hover:text-white'
                ].join(' ')}
              >
                <span
                  aria-hidden="true"
                  className={[
                    'flex h-6 w-6 shrink-0 items-center justify-center rounded-[7px] font-mono text-[8px] font-semibold tabular-nums transition-[background-color,color] duration-200',
                    active
                      ? 'bg-brand-red/[0.16] text-white'
                      : 'bg-white/[0.02] text-[#69717D]'
                  ].join(' ')}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>

                <span
                  className={[
                    'min-w-0 flex-1 text-[12.5px] leading-[1.42] tracking-[-0.008em]',
                    active
                      ? 'font-semibold text-white'
                      : 'font-medium text-[#C1C6CF]'
                  ].join(' ')}
                >
                  {item.text}
                </span>
              </a>
            </div>
          );
        })}
      </div>
    </nav>
  );

  return (
    <div
      ref={rootRef}
      className="kapi-insight-toc h-full min-h-0"
    >
      <div className={variant === 'desktop' ? 'hidden' : 'xl:hidden'}>
        <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.014] shadow-[inset_0_1px_0_rgba(255,255,255,0.018)]">
          <div className="flex items-center justify-between gap-4 border-b border-white/[0.07] px-4 py-3.5">
            <span className="min-w-0">
              <span className="block text-[9px] font-mono uppercase tracking-[0.17em] text-brand-red">
                {tocLabel}
              </span>
              <span className="mt-1 block truncate text-[13px] font-medium leading-5 text-white">
                {sectionItems[currentIndex]?.text || sectionItems[0].text}
              </span>
            </span>

            <span className="shrink-0 rounded-full border border-white/[0.1] bg-white/[0.035] px-2.5 py-1 font-mono text-[9px] font-semibold tabular-nums text-[#929AA6]">
              {String(currentIndex + 1).padStart(2, '0')} / {String(sectionItems.length).padStart(2, '0')}
            </span>
          </div>

          <div className="p-3">
            {renderList(true)}
          </div>
        </div>
      </div>

      <div className={variant === 'mobile' ? 'hidden' : 'hidden h-full min-h-0 xl:flex'}>
        <div className="flex h-full min-h-0 flex-1 flex-col rounded-2xl border border-white/[0.07] bg-white/[0.014] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.018)]">
          <div className="flex shrink-0 items-end justify-between gap-4">
            <div>
              <span className="kapi-section-label !px-3 !py-1.5 !text-[8px]">
                {tocLabel}
              </span>
              <p className="mt-1 text-[10px] leading-4 text-[#5E6672]">
                {sectionItems.length} {sectionCountLabel}
              </p>
            </div>

            <span className="rounded-full border border-white/[0.1] bg-white/[0.035] px-2.5 py-1 font-mono text-[9px] font-semibold tabular-nums text-[#929AA6]">
              {String(currentIndex + 1).padStart(2, '0')} / {String(sectionItems.length).padStart(2, '0')}
            </span>
          </div>

          <div className="mt-4 min-h-0 flex-1">
            {renderList()}
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { InsightLanguage } from '../data/insightTypes';
import type { InsightTocItem } from '../lib/insightHeadingIds';

type TocVariant = 'all' | 'desktop' | 'mobile';

const ARTICLE_SCROLL_OFFSET_PX = 112;
const ACTIVE_HEADING_TRIGGER_PX = 104;
const ACTIVE_HEADING_RELEASE_PX = 136;
const NAVIGATION_SETTLE_TOLERANCE_PX = 52;
const NAVIGATION_TIMEOUT_MS = 1800;

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

function getHeadingDistanceFromOffset(id: string): number | null {
  const top = getHeadingTop(id);
  if (top === null) return null;

  return top - ARTICLE_SCROLL_OFFSET_PX;
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
  const rootRef = useRef<HTMLDivElement | null>(null);
  const activeIdRef = useRef(activeId);
  const navigationTargetRef = useRef('');
  const navigationStartedAtRef = useRef(0);
  const lastScrollYRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const revealRafRef = useRef<number | null>(null);
  const mobileItemMap = useRef<Map<string, HTMLAnchorElement>>(new Map());
  const desktopItemMap = useRef<Map<string, HTMLAnchorElement>>(new Map());

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
    navigationStartedAtRef.current = 0;
  };

  const setActive = (id: string) => {
    if (!id || activeIdRef.current === id) return;

    activeIdRef.current = id;
    setActiveId(id);
  };

  const syncActiveFromScroll = () => {
    if (!sectionItems.length) return;

    const scrollY = window.scrollY;
    const maxScrollTop = getDocumentMaxScroll();
    const previousScrollY = lastScrollYRef.current;
    const direction = scrollY > previousScrollY
      ? 1
      : scrollY < previousScrollY
        ? -1
        : 0;

    lastScrollYRef.current = scrollY;

    if (scrollY <= 4) {
      setActive(sectionItems[0].id);
      return;
    }

    if (scrollY >= maxScrollTop - 4) {
      setActive(sectionItems[sectionItems.length - 1].id);
      return;
    }

    let rawIndex = 0;

    for (let index = 0; index < sectionItems.length; index += 1) {
      const top = getHeadingTop(sectionItems[index].id);

      if (top === null) continue;
      if (top <= ARTICLE_SCROLL_OFFSET_PX) {
        rawIndex = index;
        continue;
      }

      break;
    }

    const currentIndex = sectionItems.findIndex((item) => item.id === activeIdRef.current);
    const safeCurrentIndex = currentIndex >= 0 ? currentIndex : 0;

    if (direction > 0 && rawIndex > safeCurrentIndex) {
      let stableIndex = safeCurrentIndex;

      for (let index = safeCurrentIndex + 1; index <= rawIndex; index += 1) {
        const top = getHeadingTop(sectionItems[index].id);

        if (top !== null && top <= ACTIVE_HEADING_TRIGGER_PX) {
          stableIndex = index;
        } else {
          break;
        }
      }

      setActive(sectionItems[stableIndex].id);
      return;
    }

    if (direction < 0 && rawIndex < safeCurrentIndex) {
      const currentTop = getHeadingTop(sectionItems[safeCurrentIndex].id);

      if (currentTop !== null && currentTop <= ACTIVE_HEADING_RELEASE_PX) {
        return;
      }

      setActive(sectionItems[rawIndex].id);
      return;
    }

    if (direction === 0) {
      setActive(sectionItems[rawIndex].id);
    }
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

        const distance = getHeadingDistanceFromOffset(pendingId);

        if (distance === null) {
          clearNavigationLock();
          syncActiveFromScroll();
          return;
        }

        setActive(pendingId);

        const reachedDocumentEnd = window.scrollY >= getDocumentMaxScroll() - 4;
        const settled = Math.abs(distance) <= NAVIGATION_SETTLE_TOLERANCE_PX;
        const timedOut =
          navigationStartedAtRef.current > 0
          && performance.now() - navigationStartedAtRef.current >= NAVIGATION_TIMEOUT_MS;

        if (settled || reachedDocumentEnd || timedOut) {
          clearNavigationLock();
          setActive(pendingId);
        }

        return;
      }

      syncActiveFromScroll();
    });
  };

  const startNavigation = (id: string) => {
    navigationTargetRef.current = id;
    navigationStartedAtRef.current = performance.now();
    lastScrollYRef.current = window.scrollY;
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

    const handleLayoutSettled = () => {
      if (!isVariantActive()) return;
      window.requestAnimationFrame(scheduleScrollSync);
    };

    const articleBody = document.querySelector('.kapi-insight-body');
    const resizeObserver = typeof ResizeObserver !== 'undefined' && articleBody
      ? new ResizeObserver(handleLayoutSettled)
      : null;

    resizeObserver?.observe(articleBody as Element);

    const articleImages = articleBody
      ? Array.from(articleBody.querySelectorAll('img'))
      : [];

    articleImages.forEach((image) => {
      image.addEventListener('load', handleLayoutSettled);
      image.addEventListener('error', handleLayoutSettled);
    });

    void document.fonts?.ready?.then(handleLayoutSettled).catch(() => undefined);

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
      window.requestAnimationFrame(() => {
        lastScrollYRef.current = window.scrollY;
        scheduleScrollSync();
      });
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
        resizeObserver?.disconnect();
        articleImages.forEach((image) => {
          image.removeEventListener('load', handleLayoutSettled);
          image.removeEventListener('error', handleLayoutSettled);
        });
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

      if (revealRafRef.current !== null) {
        window.cancelAnimationFrame(revealRafRef.current);
        revealRafRef.current = null;
      }

      navigationTargetRef.current = '';
      navigationStartedAtRef.current = 0;
      lastScrollYRef.current = window.scrollY;
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

    if (revealRafRef.current !== null) {
      window.cancelAnimationFrame(revealRafRef.current);
    }

    revealRafRef.current = window.requestAnimationFrame(() => {
      revealRafRef.current = null;
      reveal(desktopItemMap.current, variant !== 'mobile');
      reveal(mobileItemMap.current, variant !== 'desktop');
    });

    return () => {
      if (revealRafRef.current !== null) {
        window.cancelAnimationFrame(revealRafRef.current);
        revealRafRef.current = null;
      }
    };
  }, [activeId, variant]);

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

    window.requestAnimationFrame(() => {
      scrollToHeading(
        item.id,
        prefersReducedMotion() ? 'auto' : 'smooth'
      );
      scheduleScrollSync();
    });
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
          ? 'max-h-[14.75rem]'
          : 'max-h-[14.75rem]'
      ].join(' ')}
    >
      <div className="space-y-1">
        {sectionItems.map((item, index) => {
          const active = item.id === activeId;

          return (
            <div
              key={item.id}
              className="relative"
            >
              <a
                ref={(node) => register(
                  mobile ? mobileItemMap.current : desktopItemMap.current,
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
                  'flex min-h-11 w-full items-center gap-3 rounded-[11px] border border-transparent px-2.5 py-2.5 text-left transition-[background-color,border-color,color,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35',
                  active
                    ? 'bg-brand-red/[0.09] text-white'
                    : 'text-[#C1C6CF] hover:bg-white/[0.018] hover:text-white'
                ].join(' ')}
              >
                <span
                  aria-hidden="true"
                  className={[
                    'flex h-6 w-6 shrink-0 items-center justify-center rounded-[7px] font-mono text-[8px] font-semibold tabular-nums transition-[background-color,color] duration-200',
                    active
                      ? 'bg-brand-red/[0.16] text-white'
                      : 'bg-white/[0.025] text-[#69717D]'
                  ].join(' ')}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>

                <span
                  className={[
                    'min-w-0 flex-1 line-clamp-2 text-[12.5px] leading-[1.42] tracking-[-0.008em]',
                    active
                      ? 'font-semibold text-white'
                      : 'font-medium text-[#C8CDD5]'
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
        <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#101114] shadow-[inset_0_1px_0_rgba(255,255,255,0.018)]">
          <div className="flex items-center justify-between gap-4 border-b border-white/[0.07] px-4 py-3.5">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-red" aria-hidden="true" />
                <span className="text-[9px] font-mono uppercase tracking-[0.17em] text-brand-red">
                  {tocLabel}
                </span>
              </div>
              <span className="mt-1.5 block line-clamp-2 text-[13px] font-medium leading-5 text-white">
                <span className="text-brand-red">
                  {sectionItems[currentIndex]?.text || sectionItems[0].text}
                </span>
              </span>
            </div>

            <span className="shrink-0 rounded-full border border-white/[0.1] bg-white/[0.035] px-2.5 py-1 font-mono text-[9px] font-semibold tabular-nums text-[#929AA6]">
              {String(currentIndex + 1).padStart(2, '0')} / {String(sectionItems.length).padStart(2, '0')}
            </span>
          </div>

          <div className="p-2.5">
            {renderList(true)}
          </div>
        </div>
      </div>

      <div className={variant === 'mobile' ? 'hidden' : 'hidden h-full min-h-0 xl:flex'}>
        <div className="flex h-full min-h-0 flex-1 flex-col rounded-2xl border border-white/[0.08] bg-[#101114] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.018)]">
          <div className="flex shrink-0 items-end justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-red" aria-hidden="true" />
                <span className="kapi-section-label !px-3 !py-1.5 !text-[8px]">
                  {tocLabel}
                </span>
              </div>
              <p className="mt-1.5 text-[10px] leading-4 text-[#5E6672]">
                {sectionItems.length} {sectionCountLabel}
              </p>
            </div>

            <span className="shrink-0 rounded-full border border-white/[0.1] bg-white/[0.035] px-2.5 py-1 font-mono text-[9px] font-semibold tabular-nums text-[#929AA6]">
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

import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { InsightLanguage } from '../data/insightTypes';
import type { InsightTocItem } from '../lib/insightHeadingIds';

type TocVariant = 'all' | 'desktop' | 'mobile';

const ARTICLE_SCROLL_OFFSET_PX = 112;
const NAVIGATION_TIMEOUT_MS = 2600;
const NAVIGATION_SETTLE_TOLERANCE_PX = 32;

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

function isNearHeading(id: string): boolean {
  const top = getHeadingTop(id);
  if (top === null) return false;

  return Math.abs(top - ARTICLE_SCROLL_OFFSET_PX) <= NAVIGATION_SETTLE_TOLERANCE_PX;
}

export const InsightTableOfContents: React.FC<{
  items: InsightTocItem[];
  language: InsightLanguage;
  variant?: TocVariant;
}> = ({ items, language, variant = 'all' }) => {
  const validItems = useMemo(
    () => items.filter(
      (item) => Boolean(item?.id) && (item.level === 2 || item.level === 3)
    ),
    [items]
  );

  const itemMeta = useMemo(() => {
    let sectionNumber = 0;

    return validItems.map((item) => {
      if (item.level === 2) {
        sectionNumber += 1;
      }

      return {
        ...item,
        sectionNumber: String(sectionNumber).padStart(2, '0')
      };
    });
  }, [validItems]);

  const instanceId = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const mobileNavId = 'insight-mobile-toc-' + instanceId;

  const [activeId, setActiveId] = useState(itemMeta[0]?.id || '');
  const [mobileOpen, setMobileOpen] = useState(false);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const desktopItemRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());
  const mobileItemRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());

  const activeIdRef = useRef(activeId);
  const navigationTargetRef = useRef<string>('');
  const navigationTimerRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    activeIdRef.current = activeId;
  }, [activeId]);

  const clearNavigationLock = () => {
    navigationTargetRef.current = '';

    if (navigationTimerRef.current !== null) {
      window.clearTimeout(navigationTimerRef.current);
      navigationTimerRef.current = null;
    }
  };

  const setActive = (id: string) => {
    if (!id || activeIdRef.current === id) return;

    activeIdRef.current = id;
    setActiveId(id);
  };

  const syncActiveFromScroll = () => {
    if (!validItems.length) return;

    const maxScrollTop = getDocumentMaxScroll();

    if (window.scrollY <= 4) {
      setActive(validItems[0].id);
      return;
    }

    if (window.scrollY >= maxScrollTop - 4) {
      setActive(validItems[validItems.length - 1].id);
      return;
    }

    let currentId = validItems[0].id;

    for (const item of validItems) {
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
        const top = getHeadingTop(pendingId);
        const targetExists = top !== null;
        const settled = targetExists && isNearHeading(pendingId);
        const timedOut = navigationTimerRef.current === null;

        if (settled) {
          clearNavigationLock();
          setActive(pendingId);
          return;
        }

        if (!targetExists || timedOut) {
          clearNavigationLock();
          syncActiveFromScroll();
          return;
        }

        setActive(pendingId);
        return;
      }

      syncActiveFromScroll();
    });
  };

  const startNavigation = (id: string) => {
    navigationTargetRef.current = id;

    if (navigationTimerRef.current !== null) {
      window.clearTimeout(navigationTimerRef.current);
    }

    navigationTimerRef.current = window.setTimeout(() => {
      navigationTimerRef.current = null;
      scheduleScrollSync();
    }, NAVIGATION_TIMEOUT_MS);

    setActive(id);
  };

  useEffect(() => {
    if (!validItems.length) {
      setActiveId('');
      return undefined;
    }

    const syncHash = (shouldScroll: boolean) => {
      const hash = getHash();

      if (!hash || !validItems.some((item) => item.id === hash)) {
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

    const handleScroll = () => scheduleScrollSync();
    const handleResize = () => scheduleScrollSync();
    const handleHashChange = () => syncHash(true);
    const handlePopState = () => syncHash(true);

    const cancelOnUserIntent = (event: Event) => {
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

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('wheel', cancelOnUserIntent, { passive: true });
    window.addEventListener('touchstart', cancelOnUserIntent, { passive: true });
    window.addEventListener('pointerdown', cancelOnUserIntent);
    window.addEventListener('keydown', handleKeydown);

    const initialHash = getHash();

    if (initialHash && validItems.some((item) => item.id === initialHash)) {
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

      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }

      if (navigationTimerRef.current !== null) {
        window.clearTimeout(navigationTimerRef.current);
        navigationTimerRef.current = null;
      }

      navigationTargetRef.current = '';
    };
  }, [validItems]);

  useEffect(() => {
    if (!mobileOpen) return undefined;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [mobileOpen]);

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
        node.scrollIntoView({
          behavior: 'auto',
          block: 'nearest'
        });
      }
    };

    window.requestAnimationFrame(() => {
      reveal(desktopItemRefs.current, variant !== 'mobile');
      reveal(
        mobileItemRefs.current,
        variant !== 'desktop' && mobileOpen
      );
    });
  }, [activeId, mobileOpen, variant]);

  if (!validItems.length) return null;

  const current = itemMeta.find((item) => item.id === activeId) || itemMeta[0];
  const h2Count = itemMeta.filter((item) => item.level === 2).length;
  const currentSection = Math.max(
    1,
    Number.parseInt(current.sectionNumber, 10) || 1
  );

  const label = language === 'id' ? 'Di artikel ini' : 'In this article';
  const navigationLabel = language === 'id'
    ? 'Daftar isi artikel'
    : 'Article table of contents';

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

  const navigateTo = (
    item: InsightTocItem,
    mobile = false
  ) => {
    const target = document.getElementById(item.id);

    if (!target) return;

    startNavigation(item.id);
    setHash(item.id);

    scrollToHeading(
      item.id,
      prefersReducedMotion() ? 'auto' : 'smooth'
    );

    window.requestAnimationFrame(scheduleScrollSync);

    if (mobile) {
      setMobileOpen(false);
    }
  };

  const renderItems = (
    refs: Map<string, HTMLAnchorElement>,
    mobile = false
  ) => (
    <div className="space-y-0.5">
      {itemMeta.map((item) => {
        const active = activeId === item.id;
        const isH2 = item.level === 2;

        return (
          <a
            key={item.id}
            ref={(node) => register(refs, item.id, node)}
            href={'#' + encodeURIComponent(item.id)}
            onClick={(event) => {
              event.preventDefault();
              navigateTo(item, mobile);
            }}
            aria-current={active ? 'location' : undefined}
            className={[
              'group relative flex w-full items-start text-left',
              'transition-[color,background-color,border-color] duration-200',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-red/60',
              isH2
                ? 'min-h-10 gap-3 rounded-r-[7px] border-l-2 px-3 py-2'
                : 'ml-4 min-h-9 gap-2 rounded-r-[6px] border-l px-3 py-1.5',
              active
                ? isH2
                  ? 'border-brand-red bg-white/[0.028] text-white'
                  : 'border-brand-red/70 text-white'
                : isH2
                  ? 'border-transparent text-[#747C89] hover:bg-white/[0.018] hover:text-[#D3D7DE]'
                  : 'border-transparent text-[#747C89] hover:text-[#C8CDD5]'
            ].join(' ')}
          >
            {isH2 ? (
              <span
                aria-hidden="true"
                className={[
                  'w-5 shrink-0 pt-0.5 font-mono text-[9px] font-medium tabular-nums transition-colors duration-200',
                  active ? 'text-[#B7BEC8]' : 'text-[#59616D] group-hover:text-[#737B88]'
                ].join(' ')}
              >
                {item.sectionNumber}
              </span>
            ) : (
              <span
                aria-hidden="true"
                className={[
                  'mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full transition-[background-color,transform] duration-200',
                  active
                    ? 'scale-100 bg-brand-red'
                    : 'scale-75 bg-[#424852] group-hover:scale-90 group-hover:bg-[#66707D]'
                ].join(' ')}
              />
            )}

            <span
              className={[
                'min-w-0 text-balance leading-[1.4] transition-[color,font-weight] duration-200',
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
          aria-controls={mobileNavId}
          onClick={() => setMobileOpen((value) => !value)}
          className="group flex min-h-[58px] w-full items-center justify-between gap-4 px-4 py-3 text-left transition-colors duration-200 hover:bg-white/[0.018] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-red/60"
        >
          <span className="min-w-0">
            <span className="font-mono text-[9px] uppercase tracking-[0.17em] text-[#737B87]">
              {label}
            </span>
            <span className="mt-1.5 block truncate text-[13px] font-medium text-white">
              {current.text}
            </span>
          </span>

          <span className="flex shrink-0 items-center gap-3">
            <span className="font-mono text-[9px] tabular-nums text-[#606873]">
              {current.sectionNumber} / {String(h2Count).padStart(2, '0')}
            </span>
            <ChevronDown
              size={16}
              aria-hidden="true"
              className={[
                'transition-transform duration-200',
                mobileOpen
                  ? 'rotate-180 text-white'
                  : 'text-[#737C89] group-hover:text-white'
              ].join(' ')}
            />
          </span>
        </button>

        {mobileOpen && (
          <nav
            id={mobileNavId}
            aria-label={navigationLabel}
            className="max-h-[min(70vh,34rem)] overflow-y-auto overscroll-contain border-t border-white/[0.07] p-3 [scrollbar-gutter:stable]"
          >
            {renderItems(mobileItemRefs.current, true)}
          </nav>
        )}
      </div>
    </div>
  );

  const desktop = (
    <div className={variant === 'mobile' ? 'hidden' : 'hidden h-full min-h-0 xl:flex'}>
      <div className="flex h-full min-h-0 flex-1 flex-col border-y border-white/[0.08] py-4">
        <div className="flex shrink-0 items-end justify-between gap-4 px-1">
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
            {String(currentSection).padStart(2, '0')} / {String(h2Count).padStart(2, '0')}
          </span>
        </div>

        <nav
          aria-label={navigationLabel}
          className="mt-3 min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1 [scrollbar-gutter:stable]"
        >
          {renderItems(desktopItemRefs.current)}
        </nav>
      </div>
    </div>
  );

  return (
    <div ref={rootRef} className="h-full min-h-0">
      {mobile}
      {desktop}
    </div>
  );
};

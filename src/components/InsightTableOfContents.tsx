import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { InsightLanguage } from '../data/insightTypes';
import type { InsightTocItem } from '../lib/insightHeadingIds';

type TocVariant = 'all' | 'desktop' | 'mobile';

type TocSection = {
  heading: InsightTocItem;
  children: InsightTocItem[];
};

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

  const sections = useMemo<TocSection[]>(() => {
    const result: TocSection[] = [];

    for (const item of validItems) {
      if (item.level === 2) {
        result.push({
          heading: item,
          children: []
        });
        continue;
      }

      const parent = result[result.length - 1];
      if (parent) {
        parent.children.push(item);
      }
    }

    return result;
  }, [validItems]);

  const sectionByItemId = useMemo(() => {
    const map = new Map<string, string>();

    for (const section of sections) {
      map.set(section.heading.id, section.heading.id);

      for (const child of section.children) {
        map.set(child.id, section.heading.id);
      }
    }

    return map;
  }, [sections]);

  const instanceId = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const mobileNavId = 'insight-mobile-toc-' + instanceId;

  const [activeId, setActiveId] = useState(validItems[0]?.id || '');
  const [expandedSectionId, setExpandedSectionId] = useState<string | null>(
    validItems[0] ? (sectionByItemId.get(validItems[0].id) || null) : null
  );
  const [mobileOpen, setMobileOpen] = useState(false);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const desktopItemRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());
  const mobileItemRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());
  const activeIdRef = useRef(activeId);
  const isVariantActive = () => {
    if (typeof window === 'undefined') return false;
    if (variant === 'all') return true;

    const desktopViewport = window.matchMedia('(min-width: 1280px)').matches;
    return variant === 'desktop' ? desktopViewport : !desktopViewport;
  };


  const navigationTargetRef = useRef('');
  const manuallyCollapsedSectionRef = useRef<string | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    activeIdRef.current = activeId;
  }, [activeId]);

  const clearNavigationLock = () => {
    navigationTargetRef.current = '';
  };

  const setActive = (id: string) => {
    if (!id || activeIdRef.current === id) return;

    activeIdRef.current = id;
    setActiveId(id);
  };

  const expandSectionForItem = (id: string, previousSectionId?: string) => {
    const sectionId = sectionByItemId.get(id);
    if (!sectionId) return;

    if (previousSectionId !== sectionId) {
      manuallyCollapsedSectionRef.current = null;
    }

    if (manuallyCollapsedSectionRef.current !== sectionId) {
      setExpandedSectionId(sectionId);
    }
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

    const previousSectionId = sectionByItemId.get(activeIdRef.current);
    setActive(currentId);
    expandSectionForItem(currentId, previousSectionId);
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

  const startNavigation = (id: string, sectionId?: string) => {
    navigationTargetRef.current = id;
    manuallyCollapsedSectionRef.current = null;
    setActive(id);

    if (sectionId) {
      setExpandedSectionId(sectionId);
    }
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

      const sectionId = sectionByItemId.get(hash) || null;
      startNavigation(hash, sectionId || undefined);

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
      window.requestAnimationFrame(syncActiveFromScroll);
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

    if (!isVariantActive()) return () => {
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
      mediaQuery.removeEventListener?.('change', handleBreakpointChange);

      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }

      navigationTargetRef.current = '';
      manuallyCollapsedSectionRef.current = null;
    };
  }, [validItems, sectionByItemId, variant]);

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

  if (!validItems.length || !sections.length) return null;

  const currentSectionId = sectionByItemId.get(activeId) || sections[0].heading.id;
  const currentSectionIndex = Math.max(
    0,
    sections.findIndex((section) => section.heading.id === currentSectionId)
  );
  const currentItem = validItems.find((item) => item.id === activeId) || sections[0].heading;
  const tocLabel = language === 'id' ? 'Di artikel ini' : 'In this article';
  const navigationLabel = language === 'id' ? 'Navigasi artikel' : 'Article navigation';
  const sectionCountLabel = language === 'id'
    ? 'bagian'
    : sections.length === 1 ? 'section' : 'sections';

  const toggleSection = (sectionId: string) => {
    setExpandedSectionId((current) => {
      if (current === sectionId) {
        manuallyCollapsedSectionRef.current = sectionId;
        return null;
      }

      manuallyCollapsedSectionRef.current = null;
      return sectionId;
    });
  };

  const navigateTo = (
    item: InsightTocItem,
    mobile = false
  ) => {
    const target = document.getElementById(item.id);
    if (!target) return;

    const sectionId = sectionByItemId.get(item.id);

    startNavigation(item.id, sectionId);
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

  const renderSection = (
    section: TocSection,
    index: number,
    mobile = false
  ) => {
    const expanded = expandedSectionId === section.heading.id;
    const sectionActive =
      section.heading.id === activeId
      || section.children.some((item) => item.id === activeId);

    return (
      <div
        key={section.heading.id}
        className={[
          'relative border-b border-white/[0.06] last:border-b-0 transition-[background-color,color] duration-250',
          sectionActive ? 'bg-white/[0.012]' : 'bg-transparent hover:bg-white/[0.012]'
        ].join(' ')}
      >
        <div className="relative flex items-center gap-2.5 px-3 py-3 sm:px-3.5 sm:py-3.5">
          <a
            ref={(node) => register(
              mobile ? mobileItemRefs.current : desktopItemRefs.current,
              section.heading.id,
              node
            )}
            href={'#' + encodeURIComponent(section.heading.id)}
            onClick={(event) => {
              event.preventDefault();
              navigateTo(section.heading, mobile);
            }}
            aria-current={activeId === section.heading.id ? 'location' : undefined}
            className="min-w-0 flex-1 rounded-lg px-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60"
          >
            <span className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className={[
                  'flex h-6 w-6 shrink-0 items-center justify-center rounded-[7px] font-mono text-[8px] font-semibold tabular-nums transition-[background-color,color] duration-250',
                  sectionActive
                    ? 'bg-white/[0.075] text-white'
                    : 'bg-white/[0.02] text-[#69717D]'
                ].join(' ')}
              >
                {String(index + 1).padStart(2, '0')}
              </span>

              <span className="min-w-0 flex-1">
                <span
                  className={[
                    'block text-[12.5px] leading-[1.42] tracking-[-0.008em]',
                    sectionActive
                      ? 'font-semibold text-white'
                      : 'font-medium text-[#C1C6CF]'
                  ].join(' ')}
                >
                  {section.heading.text}
                </span>

                {section.children.length > 0 && (
                  <span className="mt-1 flex items-center gap-1.5 text-[8px] font-mono uppercase tracking-[0.15em] text-[#626A77]">
                    <span className={sectionActive ? 'text-white' : 'text-[#59616D]'}>
                      {String(section.children.length).padStart(2, '0')}
                    </span>
                    <span>
                      {language === 'id' ? 'subbagian' : 'subsections'}
                    </span>
                  </span>
                )}
              </span>
            </span>
          </a>

          {section.children.length > 0 && (
            <button
              type="button"
              aria-expanded={expanded}
              aria-controls={section.heading.id + '-subsections-' + instanceId}
              aria-label={
                expanded
                  ? (language === 'id' ? 'Tutup subbagian' : 'Collapse subsections')
                  : (language === 'id' ? 'Buka subbagian' : 'Expand subsections')
              }
              onClick={(event) => {
                event.stopPropagation();
                toggleSection(section.heading.id);
              }}
              className={[
                'flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] border transition-[background-color,border-color,color,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/55',
                expanded || sectionActive
                  ? 'border-white/[0.18] bg-white/[0.06] text-white'
                  : 'border-white/[0.07] bg-white/[0.018] text-[#9AA1AC] hover:border-white/[0.12] hover:bg-white/[0.04] hover:text-white'
              ].join(' ')}
              data-state={expanded ? 'open' : 'closed'}
            >
              <ChevronDown
                size={14}
                strokeWidth={2}
                className={[
                  'transition-transform duration-250',
                  expanded ? 'rotate-180' : ''
                ].join(' ')}
                aria-hidden="true"
              />
            </button>
          )}
        </div>

        {expanded && section.children.length > 0 && (
          <div
            id={section.heading.id + '-subsections-' + instanceId}
            className="px-3 pb-3 pt-0.5"
          >
            <div className="space-y-0.5">
              {section.children.map((child) => {
                const active = child.id === activeId;

                return (
                  <a
                    key={child.id}
                    ref={(node) => register(
                      mobile ? mobileItemRefs.current : desktopItemRefs.current,
                      child.id,
                      node
                    )}
                    href={'#' + encodeURIComponent(child.id)}
                    onClick={(event) => {
                      event.preventDefault();
                      navigateTo(child, mobile);
                    }}
                    aria-current={active ? 'location' : undefined}
                    className={[
                      'group/subsection relative flex w-full items-start gap-2.5 rounded-[10px] px-2.5 py-2 text-left text-[11px] leading-[1.5] transition-[background-color,color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/55',
                      active
                        ? 'bg-white/[0.055] text-white'
                        : 'text-[#737C89] hover:bg-white/[0.018] hover:text-[#C9CED7]'
                    ].join(' ')}
                  >
                    <span
                      aria-hidden="true"
                      className={[
                        'mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full transition-[background-color,transform] duration-200',
                        active ? 'scale-100 bg-white' : 'scale-75 bg-white/[0.14] group-hover/subsection:scale-90'
                      ].join(' ')}
                    />
                    <span className="min-w-0 flex-1">{child.text}</span>
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderList = (mobile = false) => (
    <div className="space-y-2.5">
      {sections.map((section, index) => renderSection(section, index, mobile))}
    </div>
  );

  return (
    <div
      ref={rootRef}
      className="kapi-insight-toc h-full min-h-0"
    >
      <div className={variant === 'desktop' ? 'hidden' : 'xl:hidden'}>
        <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.014] shadow-[inset_0_1px_0_rgba(255,255,255,0.018)]">
          <button
            type="button"
            aria-expanded={mobileOpen}
            aria-controls={mobileNavId}
            onClick={() => setMobileOpen((open) => !open)}
            className={[
              'flex min-h-16 w-full items-center justify-between gap-4 px-4 py-3.5 text-left transition-[background-color,color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-red/60',
              mobileOpen ? 'bg-brand-red/[0.025]' : ''
            ].join(' ')}
          >
            <span className="min-w-0">
              <span className="flex items-center gap-2">
                <span className="text-[9px] font-mono uppercase tracking-[0.17em] text-brand-red">
                  {tocLabel}
                </span>
                <span className="h-1 w-1 rounded-full bg-white/[0.16]" aria-hidden="true" />
                <span className="text-[9px] font-mono uppercase tracking-[0.13em] text-[#656E7A]">
                  {sections.length} {sectionCountLabel}
                </span>
              </span>
              <span className="mt-1.5 block truncate text-[13px] font-medium leading-5 text-white">
                {currentItem.text}
              </span>
            </span>

            <span
              className={[
                'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-[background-color,border-color,color,transform] duration-200',
                mobileOpen
                  ? 'border-brand-red/30 bg-brand-red/[0.08] text-brand-red'
                  : 'border-white/[0.08] bg-white/[0.025] text-white/80'
              ].join(' ')}
              aria-hidden="true"
            >
              <ChevronDown
                size={15}
                className={[
                  'transition-transform duration-200',
                  mobileOpen ? 'rotate-180' : ''
                ].join(' ')}
              />
            </span>
          </button>

          {mobileOpen && (
            <nav
              id={mobileNavId}
              aria-label={navigationLabel}
              className="max-h-[min(24rem,58vh)] overflow-y-auto overscroll-contain border-t border-white/[0.07] p-3 [scrollbar-gutter:stable]"
            >
              {renderList(true)}
            </nav>
          )}
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
                {sections.length} {sectionCountLabel}
              </p>
            </div>

            <span className="rounded-full border border-white/[0.1] bg-white/[0.035] px-2.5 py-1 font-mono text-[9px] font-semibold tabular-nums text-[#929AA6]">
              {String(currentSectionIndex + 1).padStart(2, '0')} / {String(sections.length).padStart(2, '0')}
            </span>
          </div>

          <nav
            aria-label={navigationLabel}
            className="mt-4 min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1 [scrollbar-gutter:stable]"
          >
            {renderList()}
          </nav>
        </div>
      </div>
    </div>
  );
};

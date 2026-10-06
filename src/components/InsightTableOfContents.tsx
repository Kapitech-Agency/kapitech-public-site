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

  try {
    return decodeURIComponent(window.location.hash.replace(/^#/, ''));
  } catch {
    return '';
  }
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

export const InsightTableOfContents: React.FC<{
  items: InsightTocItem[];
  language: InsightLanguage;
  variant?: TocVariant;
}> = ({ items, language, variant = 'all' }) => {
  const validItems = useMemo(
    () => items.filter((item) => Boolean(item?.id) && (item.level === 2 || item.level === 3)),
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

      const scrollableList = node.closest('nav');
      if (!(scrollableList instanceof HTMLElement)) return;

      const nodeRect = node.getBoundingClientRect();
      const listRect = scrollableList.getBoundingClientRect();
      const isVisible = nodeRect.top >= listRect.top && nodeRect.bottom <= listRect.bottom;

      if (!isVisible) {
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

  const current = itemMeta.find((item) => item.id === activeId) || itemMeta[0];
  const h2Count = itemMeta.filter((item) => item.level === 2).length;
  const currentSection = Math.max(
    1,
    Number.parseInt(current.sectionNumber, 10) || 1
  );
  const sectionProgress = h2Count > 0
    ? Math.min(100, (currentSection / h2Count) * 100)
    : 0;
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
    <div className="space-y-1">
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
              'group relative flex w-full items-start text-left',
              'transition-[color,background-color,border-color] duration-200',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-red/60',
              isH2
                ? 'min-h-11 gap-3 rounded-r-[10px] border-l-2 px-3 py-2.5'
                : 'ml-5 min-h-9 gap-2 rounded-r-[8px] border-l px-2.5 py-1.5',
              active
                ? isH2
                  ? 'border-brand-red bg-white/[0.035] text-white'
                  : 'border-brand-red/60 bg-white/[0.02] text-white'
                : isH2
                  ? 'border-transparent text-[#747C89] hover:bg-white/[0.022] hover:text-[#D3D7DE]'
                  : 'border-transparent text-[#747C89] hover:bg-white/[0.018] hover:text-[#C8CDD5]'
            ].join(' ')}
          >
            {isH2 ? (
              <span
                aria-hidden="true"
                className={[
                  'w-5 shrink-0 pt-0.5 font-mono text-[9px] font-medium tabular-nums transition-colors duration-200',
                  active ? 'text-brand-red' : 'text-[#59616D] group-hover:text-[#737B88]'
                ].join(' ')}
              >
                {item.sectionNumber}
              </span>
            ) : (
              <span
                aria-hidden="true"
                className={[
                  'mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full transition-[background-color,transform] duration-200',
                  active ? 'scale-100 bg-brand-red' : 'scale-75 bg-[#424852] group-hover:scale-90 group-hover:bg-[#66707D]'
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
          aria-controls="insight-mobile-toc-list"
          onClick={() => setMobileOpen((value) => !value)}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              setMobileOpen(false);
            }
          }}
          className="group flex min-h-[60px] w-full items-center justify-between gap-4 px-4 py-3 text-left transition-colors duration-200 hover:bg-white/[0.018] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-red/60"
        >
          <span className="min-w-0">
            <span className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.17em] text-[#7E8793]">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-red" aria-hidden="true" />
              {label}
            </span>
            <span className="mt-1.5 block truncate text-[13px] font-medium text-white">
              {current.text}
            </span>
          </span>

          <span className="flex shrink-0 items-center gap-3">
            <span className="font-mono text-[9px] tabular-nums text-[#6B7481]">
              {current.sectionNumber} / {String(h2Count).padStart(2, '0')}
            </span>
            <ChevronDown
              size={16}
              aria-hidden="true"
              className={[
                'transition-transform duration-200',
                mobileOpen ? 'rotate-180 text-white' : 'text-[#737C89] group-hover:text-white'
              ].join(' ')}
            />
          </span>
        </button>

        <div className="h-px bg-white/[0.06]" aria-hidden="true">
          <div
            className="h-full bg-brand-red/70 transition-[width] duration-300"
            style={{ width: sectionProgress + '%' }}
          />
        </div>

        {mobileOpen && (
          <nav
            id="insight-mobile-toc-list"
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
        <div className="shrink-0 px-1">
          <div className="flex items-end justify-between gap-4">
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

            <span className="font-mono text-[9px] tabular-nums text-[#6B7481]">
              {String(currentSection).padStart(2, '0')} / {String(h2Count).padStart(2, '0')}
            </span>
          </div>

          <div className="mt-3 h-px w-full bg-white/[0.06]" aria-hidden="true">
            <div
              className="h-full bg-brand-red/70 transition-[width] duration-300"
              style={{ width: sectionProgress + '%' }}
            />
          </div>
        </div>

        <nav
          aria-label={navigationLabel}
          className="mt-4 min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1 [scrollbar-gutter:stable]"
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

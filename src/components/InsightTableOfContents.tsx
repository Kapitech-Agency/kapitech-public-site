import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { InsightLanguage } from '../data/insightTypes';
import type { InsightTocItem } from '../lib/insightHeadingIds';

type TocSection = {
  heading: InsightTocItem;
  children: InsightTocItem[];
};

export const InsightTableOfContents: React.FC<{
  items: InsightTocItem[];
  language: InsightLanguage;
}> = ({ items, language }) => {
  const sections = useMemo<TocSection[]>(() => {
    const result: TocSection[] = [];

    for (const item of items) {
      if (item.level === 2) {
        result.push({ heading: item, children: [] });
        continue;
      }

      const last = result[result.length - 1];
      if (last) {
        last.children.push(item);
      }
    }

    return result;
  }, [items]);

  const sectionByItemId = useMemo(() => {
    const map = new Map<string, string>();

    sections.forEach(section => {
      map.set(section.heading.id, section.heading.id);
      section.children.forEach(child => map.set(child.id, section.heading.id));
    });

    return map;
  }, [sections]);

  const [activeId, setActiveId] = useState(items[0]?.id || '');
  const [expandedSectionIds, setExpandedSectionIds] = useState<Set<string>>(
    () => new Set(items.find(item => item.level === 2)?.id ? [items.find(item => item.level === 2)?.id as string] : [])
  );
  const [mobileOpen, setMobileOpen] = useState(false);
  const desktopListRef = useRef<HTMLElement | null>(null);
  const mobileListRef = useRef<HTMLElement | null>(null);
  const desktopItemRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());
  const mobileItemRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, '');
    const initialId = items.some(item => item.id === hash) ? hash : (items[0]?.id || '');
    setActiveId(initialId);

    const syncActiveHeading = () => {
      if (!items.length) return;

      const threshold = 128;
      let current = items[0];

      for (const item of items) {
        const heading = document.getElementById(item.id);
        if (!heading) continue;

        if (heading.getBoundingClientRect().top <= threshold) {
          current = item;
        } else {
          break;
        }
      }

      setActiveId(prev => prev === current.id ? prev : current.id);
    };

    const scheduleSync = () => {
      if (rafRef.current !== null) return;

      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;
        syncActiveHeading();
      });
    };

    const headings = items
      .map(item => document.getElementById(item.id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (!headings.length) return undefined;

    const observer = new IntersectionObserver(
      () => {
        scheduleSync();
      },
      {
        rootMargin: '-112px 0px -62% 0px',
        threshold: [0, 0.15, 0.5, 1]
      }
    );

    headings.forEach(heading => observer.observe(heading));
    window.addEventListener('scroll', scheduleSync, { passive: true });
    window.addEventListener('resize', scheduleSync);
    window.addEventListener('hashchange', scheduleSync);
    window.requestAnimationFrame(syncActiveHeading);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', scheduleSync);
      window.removeEventListener('resize', scheduleSync);
      window.removeEventListener('hashchange', scheduleSync);

      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [items]);

  useEffect(() => {
    const sectionId = sectionByItemId.get(activeId);
    if (!sectionId) return;

    setExpandedSectionIds(prev => {
      if (prev.has(sectionId)) return prev;

      const next = new Set(prev);
      next.add(sectionId);
      return next;
    });
  }, [activeId, sectionByItemId]);

  useEffect(() => {
    if (!activeId) return;

    const isDesktop = window.matchMedia('(min-width: 1280px)').matches;
    const container = isDesktop
      ? desktopListRef.current
      : (mobileOpen ? mobileListRef.current : null);
    const itemMap = isDesktop ? desktopItemRefs.current : mobileItemRefs.current;
    const item = itemMap.get(activeId);

    if (!container || !item) return;

    const containerRect = container.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    const padding = 12;

    if (itemRect.top < containerRect.top + padding) {
      container.scrollBy({
        top: itemRect.top - containerRect.top - padding,
        behavior: 'smooth'
      });
    } else if (itemRect.bottom > containerRect.bottom - padding) {
      container.scrollBy({
        top: itemRect.bottom - containerRect.bottom + padding,
        behavior: 'smooth'
      });
    }
  }, [activeId, expandedSectionIds, mobileOpen]);

  if (!items.length || !sections.length) return null;

  const tocLabel = language === 'id' ? 'Di artikel ini' : 'In this article';
  const navigationLabel = language === 'id' ? 'Navigasi artikel' : 'Article navigation';
  const sectionCountLabel = language === 'id'
    ? sections.length === 1 ? 'bagian' : 'bagian'
    : sections.length === 1 ? 'section' : 'sections';

  const toggleSection = (sectionId: string) => {
    setExpandedSectionIds(prev => {
      const next = new Set(prev);

      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }

      return next;
    });
  };

  const navigateTo = (item: InsightTocItem, mobile = false) => {
    const target = document.getElementById(item.id);
    if (!target) return;

    const sectionId = sectionByItemId.get(item.id);
    if (sectionId) {
      setExpandedSectionIds(prev => {
        if (prev.has(sectionId)) return prev;
        const next = new Set(prev);
        next.add(sectionId);
        return next;
      });
    }

    setActiveId(item.id);
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.history.pushState(null, '', '#' + item.id);

    if (mobile) {
      setMobileOpen(false);
    }
  };

  const renderSection = (
    section: TocSection,
    index: number,
    variant: 'desktop' | 'mobile'
  ) => {
    const expanded = expandedSectionIds.has(section.heading.id);
    const sectionActive = section.children.some(item => item.id === activeId)
      || section.heading.id === activeId;

    const itemMap = variant === 'desktop'
      ? desktopItemRefs.current
      : mobileItemRefs.current;

    return (
      <div
        key={section.heading.id}
        className={[
          'relative',
          sectionActive ? 'border-l border-brand-red/45' : 'border-l border-white/[0.06]'
        ].join(' ')}
      >
        <div className="flex items-stretch">
          <a
            ref={node => {
              if (node) itemMap.set(section.heading.id, node);
              else itemMap.delete(section.heading.id);
            }}
            href={'#' + section.heading.id}
            onClick={event => {
              event.preventDefault();
              navigateTo(section.heading, variant === 'mobile');
            }}
            aria-current={activeId === section.heading.id ? 'location' : undefined}
            className={[
              'min-w-0 flex-1 py-2.5 pl-4 pr-2 text-left transition-[color,background-color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-red/60',
              sectionActive ? 'text-white' : 'text-[#7B8390] hover:bg-white/[0.018] hover:text-white'
            ].join(' ')}
          >
            <span className="flex items-start gap-3">
              <span className={[
                'pt-0.5 font-mono text-[9px] tabular-nums',
                sectionActive ? 'text-brand-red' : 'text-[#555D68]'
              ].join(' ')}>
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className={[
                'min-w-0 text-[12px] leading-[1.45]',
                sectionActive ? 'font-medium' : 'font-normal'
              ].join(' ')}>
                {section.heading.text}
              </span>
            </span>
          </a>

          {section.children.length > 0 && (
            <button
              type="button"
              onClick={() => toggleSection(section.heading.id)}
              className="flex w-9 shrink-0 items-center justify-center text-[#5E6672] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-red/60"
              aria-expanded={expanded}
              aria-label={
                expanded
                  ? (language === 'id' ? 'Sembunyikan subbagian' : 'Hide subsections')
                  : (language === 'id' ? 'Tampilkan subbagian' : 'Show subsections')
              }
            >
              <ChevronDown
                size={13}
                className={expanded ? 'rotate-180 transition-transform duration-200' : 'transition-transform duration-200'}
                aria-hidden="true"
              />
            </button>
          )}
        </div>

        {expanded && section.children.length > 0 && (
          <div className="pb-2 pl-9 pr-2">
            {section.children.map(child => {
              const active = child.id === activeId;

              return (
                <a
                  key={child.id}
                  ref={node => {
                    if (node) itemMap.set(child.id, node);
                    else itemMap.delete(child.id);
                  }}
                  href={'#' + child.id}
                  onClick={event => {
                    event.preventDefault();
                    navigateTo(child, variant === 'mobile');
                  }}
                  aria-current={active ? 'location' : undefined}
                  className={[
                    'relative flex w-full items-start gap-2 py-1.5 text-left text-[11px] leading-[1.45] transition-[color,background-color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-red/60',
                    active
                      ? 'text-white'
                      : 'text-[#626B78] hover:bg-white/[0.018] hover:text-[#B8BEC8]'
                  ].join(' ')}
                >
                  <span
                    className={[
                      'mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-200',
                      active ? 'bg-brand-red' : 'bg-white/[0.13]'
                    ].join(' ')}
                    aria-hidden="true"
                  />
                  <span className="min-w-0">{child.text}</span>
                </a>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const renderList = (variant: 'desktop' | 'mobile') => (
    <div className="space-y-1.5">
      {sections.map((section, index) => renderSection(section, index, variant))}
    </div>
  );

  return (
    <>
      <div className="xl:hidden border-y border-white/[0.08]">
        <button
          type="button"
          aria-expanded={mobileOpen}
          aria-controls="insight-mobile-toc"
          onClick={() => setMobileOpen(open => !open)}
          className="flex min-h-14 w-full items-center justify-between gap-4 py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-red/60"
        >
          <span className="min-w-0">
            <span className="flex items-center gap-2">
              <span className="text-[9px] font-mono uppercase tracking-[0.17em] text-brand-red">{tocLabel}</span>
              <span className="h-1 w-1 rounded-full bg-white/[0.16]" aria-hidden="true" />
              <span className="text-[9px] font-mono uppercase tracking-[0.13em] text-[#5F6773]">
                {sections.length} {sectionCountLabel}
              </span>
            </span>
            <span className="mt-1.5 block truncate text-sm text-white">
              {items.find(item => item.id === activeId)?.text || sections[0].heading.text}
            </span>
          </span>
          <ChevronDown
            size={16}
            className={mobileOpen ? 'rotate-180 text-white transition-transform duration-200' : 'text-[#707986] transition-transform duration-200'}
            aria-hidden="true"
          />
        </button>

        {mobileOpen && (
          <nav
            id="insight-mobile-toc"
            aria-label={navigationLabel}
            className="max-h-[58vh] overflow-y-auto overscroll-contain border-t border-white/[0.07] py-3 pr-1"
          >
            {renderList('mobile')}
          </nav>
        )}
      </div>

      <div className="hidden h-full min-h-0 xl:flex xl:flex-col">
        <div className="flex shrink-0 items-end justify-between gap-3">
          <div>
            <p className="text-[9px] font-mono uppercase tracking-[0.18em] text-[#747B88]">{tocLabel}</p>
            <p className="mt-1 text-[10px] leading-5 text-[#555D68]">
              {sections.length} {sectionCountLabel}
            </p>
          </div>
          <span className="font-mono text-[9px] tabular-nums text-[#555D68]">
            {Math.max(0, sections.findIndex(section => section.heading.id === sectionByItemId.get(activeId)) + 1).toString().padStart(2, '0')} / {String(sections.length).padStart(2, '0')}
          </span>
        </div>

        <nav
          ref={desktopListRef}
          aria-label={navigationLabel}
          className="mt-4 min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1"
        >
          {renderList('desktop')}
        </nav>
      </div>
    </>
  );
};

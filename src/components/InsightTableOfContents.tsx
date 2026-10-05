import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
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
      if (last) last.children.push(item);
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
  const [expandedSectionId, setExpandedSectionId] = useState<string | null>(
    sections[0]?.heading.id || null
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

    const initialSectionId = sectionByItemId.get(initialId) || sections[0]?.heading.id || null;
    setExpandedSectionId(initialSectionId);

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

      setActiveId(prev => (prev === current.id ? prev : current.id));
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
      () => scheduleSync(),
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
  }, [items, sectionByItemId, sections]);

  useEffect(() => {
    const nextSectionId = sectionByItemId.get(activeId);
    if (!nextSectionId) return;

    setExpandedSectionId(prev => (prev === nextSectionId ? prev : nextSectionId));
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
    const padding = 14;

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
  }, [activeId, expandedSectionId, mobileOpen]);

  if (!items.length || !sections.length) return null;

  const tocLabel = language === 'id' ? 'Di artikel ini' : 'In this article';
  const navigationLabel = language === 'id' ? 'Navigasi artikel' : 'Article navigation';
  const sectionCountLabel = language === 'id'
    ? 'bagian'
    : sections.length === 1 ? 'section' : 'sections';

  const toggleSection = (sectionId: string) => {
    setExpandedSectionId(prev => (prev === sectionId ? null : sectionId));
  };

  const navigateTo = (item: InsightTocItem, mobile = false) => {
    const target = document.getElementById(item.id);
    if (!target) return;

    const sectionId = sectionByItemId.get(item.id);
    if (sectionId) setExpandedSectionId(sectionId);

    setActiveId(item.id);
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.history.pushState(null, '', '#' + item.id);

    if (mobile) setMobileOpen(false);
  };

  const renderSection = (
    section: TocSection,
    index: number,
    variant: 'desktop' | 'mobile'
  ) => {
    const expanded = expandedSectionId === section.heading.id;
    const sectionActive =
      section.children.some(item => item.id === activeId) || section.heading.id === activeId;

    const itemMap = variant === 'desktop'
      ? desktopItemRefs.current
      : mobileItemRefs.current;

    const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
      if (event.pointerType && event.pointerType !== 'mouse') return;
      const rect = event.currentTarget.getBoundingClientRect();
      event.currentTarget.style.setProperty('--kapi-spotlight-x', (event.clientX - rect.left) + 'px');
      event.currentTarget.style.setProperty('--kapi-spotlight-y', (event.clientY - rect.top) + 'px');
    };

    return (
      <div
        key={section.heading.id}
        data-kapi-spotlight="true"
        onPointerMove={handlePointerMove}
        className={[
          'group relative overflow-hidden rounded-[18px] border bg-[rgba(15,17,22,0.72)] backdrop-blur-xl transition-[border-color,background-color,box-shadow] duration-300',
          sectionActive
            ? 'border-brand-red/25 bg-[rgba(18,20,26,0.9)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_18px_40px_-32px_rgba(229,9,20,0.38)]'
            : 'border-white/[0.08] hover:border-white/[0.13] hover:bg-[rgba(20,22,28,0.82)]'
        ].join(' ')}
      >
        <div className="relative z-[1] flex items-start gap-2.5 px-3.5 py-3.5 sm:px-4 sm:py-4">
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
            className="min-w-0 flex-1 rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60"
          >
            <span className="flex items-start gap-3">
              <span
                className={[
                  'mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-[10px] border font-mono text-[9px] font-semibold tabular-nums transition-[border-color,background-color,color] duration-300',
                  sectionActive
                    ? 'border-brand-red/30 bg-brand-red/10 text-brand-red'
                    : 'border-white/[0.08] bg-white/[0.025] text-[#69717D] group-hover:border-white/[0.12] group-hover:text-[#89919E]'
                ].join(' ')}
              >
                {String(index + 1).padStart(2, '0')}
              </span>

              <span className="min-w-0 pt-0.5">
                <span
                  className={[
                    'block text-[12px] leading-[1.5] tracking-[-0.005em] transition-colors duration-300',
                    sectionActive ? 'font-semibold text-white' : 'font-medium text-[#D1D5DD] group-hover:text-white'
                  ].join(' ')}
                >
                  {section.heading.text}
                </span>

                {section.children.length > 0 && (
                  <span className="mt-1.5 flex items-center gap-2 text-[9px] font-mono uppercase tracking-[0.13em] text-[#68707C]">
                    <span className={sectionActive ? 'text-brand-red' : 'text-[#4F5662]'}>
                      {String(section.children.length).padStart(2, '0')}
                    </span>
                    <span>{language === 'id' ? 'subbagian' : 'subsections'}</span>
                  </span>
                )}
              </span>
            </span>
          </a>

          {section.children.length > 0 && (
            <button
              type="button"
              onClick={() => toggleSection(section.heading.id)}
              className={[
                'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-[background-color,border-color,color,transform] duration-250 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/55',
                expanded
                  ? 'border-brand-red/25 bg-brand-red/10 text-brand-red'
                  : 'border-white/[0.08] bg-white/[0.025] text-[#737B88] hover:border-white/[0.14] hover:bg-white/[0.05] hover:text-white'
              ].join(' ')}
              aria-expanded={expanded}
              aria-controls={section.heading.id + '-subsections'}
              aria-label={
                expanded
                  ? (language === 'id' ? 'Tutup subbagian' : 'Collapse subsections')
                  : (language === 'id' ? 'Buka subbagian' : 'Expand subsections')
              }
            >
              <ChevronDown
                size={14}
                strokeWidth={2}
                className={expanded ? 'rotate-180 transition-transform duration-250' : 'transition-transform duration-250'}
                aria-hidden="true"
              />
            </button>
          )}
        </div>

        {expanded && section.children.length > 0 && (
          <div
            id={section.heading.id + '-subsections'}
            className="relative z-[1] border-t border-white/[0.07] px-3.5 pb-3.5 pt-2 sm:px-4"
          >
            <div className="space-y-1">
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
                      'flex w-full items-start gap-2.5 rounded-xl px-2.5 py-2 text-left text-[11px] leading-[1.5] transition-[background-color,color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/55',
                      active
                        ? 'bg-brand-red/[0.09] text-white'
                        : 'text-[#7C8490] hover:bg-white/[0.035] hover:text-[#C9CED7]'
                    ].join(' ')}
                  >
                    <span
                      className={[
                        'mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-200',
                        active ? 'bg-brand-red' : 'bg-white/[0.16]'
                      ].join(' ')}
                      aria-hidden="true"
                    />
                    <span className="min-w-0">{child.text}</span>
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderList = (variant: 'desktop' | 'mobile') => (
    <div className="space-y-2.5">
      {sections.map((section, index) => renderSection(section, index, variant))}
    </div>
  );

  const currentSectionIndex = Math.max(
    0,
    sections.findIndex(section => section.heading.id === sectionByItemId.get(activeId))
  );

  const currentItem = items.find(item => item.id === activeId) || sections[0].heading;

  return (
    <>
      <div className="xl:hidden">
        <div className="rounded-[20px] border border-white/[0.08] bg-[rgba(15,17,22,0.72)] backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
          <button
            type="button"
            aria-expanded={mobileOpen}
            aria-controls="insight-mobile-toc"
            onClick={() => setMobileOpen(open => !open)}
            className="flex min-h-16 w-full items-center justify-between gap-4 px-4 py-3.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-red/60"
          >
            <span className="min-w-0">
              <span className="flex items-center gap-2">
                <span className="text-[9px] font-mono uppercase tracking-[0.17em] text-brand-red">{tocLabel}</span>
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
                'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-[background-color,border-color,color] duration-200',
                mobileOpen
                  ? 'border-brand-red/25 bg-brand-red/10 text-brand-red'
                  : 'border-white/[0.08] bg-white/[0.025] text-[#737B88]'
              ].join(' ')}
              aria-hidden="true"
            >
              <ChevronDown
                size={15}
                className={mobileOpen ? 'rotate-180 transition-transform duration-200' : 'transition-transform duration-200'}
              />
            </span>
          </button>

          {mobileOpen && (
            <nav
              id="insight-mobile-toc"
              aria-label={navigationLabel}
              className="max-h-[min(24rem,58vh)] overflow-y-auto overscroll-contain border-t border-white/[0.07] p-3"
            >
              {renderList('mobile')}
            </nav>
          )}
        </div>
      </div>

      <div className="hidden h-fit xl:flex xl:flex-col">
        <div className="rounded-[20px] border border-white/[0.08] bg-[rgba(15,17,22,0.72)] p-4 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.03),0_22px_55px_-40px_rgba(0,0,0,0.82)]">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-mono font-medium uppercase tracking-[0.16em] text-[#8A909D]">{tocLabel}</p>
              <p className="mt-1 text-[10px] leading-4 text-[#5E6672]">
                {sections.length} {sectionCountLabel}
              </p>
            </div>

            <span className="rounded-full border border-white/[0.07] bg-white/[0.025] px-2.5 py-1 font-mono text-[9px] font-medium tabular-nums text-[#68717D]">
              {String(currentSectionIndex + 1).padStart(2, '0')} / {String(sections.length).padStart(2, '0')}
            </span>
          </div>

          <nav
            ref={desktopListRef}
            aria-label={navigationLabel}
            className="mt-4 h-[23.5rem] max-h-[calc(100vh-24rem)] overflow-y-auto overscroll-contain pr-1"
          >
            {renderList('desktop')}
          </nav>
        </div>
      </div>
    </>
  );
};

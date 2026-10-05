import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { InsightLanguage } from '../data/insightTypes';
import type { InsightTocItem } from '../lib/insightHeadingIds';

export const InsightTableOfContents: React.FC<{
  items: InsightTocItem[];
  language: InsightLanguage;
}> = ({ items, language }) => {
  const [activeId, setActiveId] = useState(items[0]?.id || '');
  const [mobileOpen, setMobileOpen] = useState(false);
  const desktopListRef = useRef<HTMLElement | null>(null);
  const mobileListRef = useRef<HTMLElement | null>(null);
  const desktopItemRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());
  const mobileItemRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, '');
    setActiveId(items.some(item => item.id === hash) ? hash : (items[0]?.id || ''));

    const headings = items
      .map(item => document.getElementById(item.id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (!headings.length) return;

    const observer = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]?.target instanceof HTMLElement) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: '-112px 0px -58% 0px',
        threshold: [0, 0.1, 0.5]
      }
    );

    headings.forEach(heading => observer.observe(heading));

    return () => observer.disconnect();
  }, [items]);

  useEffect(() => {
    if (!activeId) return;

    const isDesktop = window.matchMedia('(min-width: 1280px)').matches;
    const container = isDesktop ? desktopListRef.current : (mobileOpen ? mobileListRef.current : null);
    const itemMap = isDesktop ? desktopItemRefs.current : mobileItemRefs.current;
    const item = itemMap.get(activeId);
    if (!container || !item) return;

    const top = item.offsetTop;
    const bottom = top + item.offsetHeight;
    const visibleTop = container.scrollTop;
    const visibleBottom = visibleTop + container.clientHeight;

    if (top < visibleTop) {
      container.scrollTo({ top: Math.max(0, top - 12), behavior: 'smooth' });
    } else if (bottom > visibleBottom) {
      container.scrollTo({
        top: Math.max(0, bottom - container.clientHeight + 12),
        behavior: 'smooth'
      });
    }
  }, [activeId, mobileOpen]);

  if (!items.length) return null;

  const tocLabel = language === 'id' ? 'Daftar isi' : 'Table of contents';
  const mobileLabel = language === 'id' ? 'Di artikel ini' : 'In this article';
  const navigationLabel = language === 'id' ? 'Navigasi artikel' : 'Article navigation';

  const renderItems = (variant: 'desktop' | 'mobile') => (
    <div className="space-y-0.5">
      {items.map((item, index) => {
        const active = item.id === activeId;

        return (
          <a
            key={item.id}
undefined
            href={'#' + item.id}
            onClick={event => {
              event.preventDefault();
              const target = document.getElementById(item.id);
              if (!target) return;

              target.scrollIntoView({ behavior: 'smooth', block: 'start' });
              window.history.pushState(null, '', '#' + item.id);
              setActiveId(item.id);
              setMobileOpen(false);
            }}
            aria-current={active ? 'location' : undefined}
            className={[
              'group flex w-full items-start gap-3 border-l-2 py-1.5 text-left leading-5 transition-[border-color,color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0C0E]',
              item.level === 3 ? 'pl-6 text-[11px]' : 'pl-3.5 text-[12px]',
              active
                ? 'border-brand-red text-white'
                : 'border-transparent text-[#757D89] hover:border-white/20 hover:text-white'
            ].join(' ')}
          >
            <span className={active ? 'shrink-0 pt-0.5 font-mono text-[9px] tabular-nums text-brand-red' : 'shrink-0 pt-0.5 font-mono text-[9px] tabular-nums text-[#565D69]'}>
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="min-w-0">{item.text}</span>
          </a>
        );
      })}
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
          className="flex min-h-12 w-full items-center justify-between gap-4 py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0C0E]"
        >
          <span>
            <span className="block text-[9px] font-mono uppercase tracking-[0.17em] text-brand-red">{mobileLabel}</span>
            <span className="mt-1 block text-xs text-[#A5ABB6]">{items.length} {language === 'id' ? 'bagian' : 'sections'}</span>
          </span>
          <ChevronDown size={15} className={['shrink-0 text-[#7B8390] transition-transform duration-200', mobileOpen ? 'rotate-180' : ''].join(' ')} aria-hidden="true" />
        </button>

        {mobileOpen && (
          <nav
            id="insight-mobile-toc"
            aria-label={navigationLabel}
            className="max-h-[55vh] overflow-y-auto border-t border-white/[0.07] py-3 overscroll-contain"
          >
            {renderItems('mobile')}
          </nav>
        )}
      </div>

      <div className="hidden h-full min-h-0 xl:flex xl:flex-col">
        <p className="shrink-0 text-[9px] font-mono uppercase tracking-[0.18em] text-[#747B88]">{tocLabel}</p>
        <nav
          ref={desktopListRef}
          aria-label={navigationLabel}
          className="mt-4 min-h-0 flex-1 overflow-y-auto overscroll-contain pr-2"
        >
          {renderItems('desktop')}
        </nav>
      </div>
    </>
  );
};

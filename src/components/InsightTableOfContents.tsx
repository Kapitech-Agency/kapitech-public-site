import React, { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { InsightLanguage } from '../data/insightTypes';
import type { InsightTocItem } from '../lib/insightHeadingIds';

export const InsightTableOfContents: React.FC<{
  items: InsightTocItem[];
  language: InsightLanguage;
}> = ({ items, language }) => {
  const [activeId, setActiveId] = useState(items[0]?.id || '');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setActiveId(items[0]?.id || '');

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
        rootMargin: '-88px 0px -58% 0px',
        threshold: [0, 0.1, 0.5]
      }
    );

    headings.forEach(heading => observer.observe(heading));

    return () => observer.disconnect();
  }, [items]);

  if (!items.length) return null;

  const tocLabel = language === 'id' ? 'Daftar isi' : 'Table of contents';
  const mobileLabel = language === 'id' ? 'Di artikel ini' : 'In this article';
  const navigationLabel = language === 'id' ? 'Navigasi artikel' : 'Article navigation';

  const renderItems = () => (
    <div className="space-y-0.5">
      {items.map((item, index) => {
        const active = item.id === activeId;

        return (
          <a
            key={item.id}
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
              'group flex w-full items-start gap-3 border-l-2 py-1.5 text-left text-[12px] leading-5 transition-[border-color,color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0C0E]',
              item.level === 3 ? 'pl-6 text-[11px]' : 'pl-3.5',
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
      <div className="lg:hidden border-y border-white/[0.08]">
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
          <nav id="insight-mobile-toc" aria-label={navigationLabel} className="border-t border-white/[0.07] py-3">
            {renderItems()}
          </nav>
        )}
      </div>

      <div className="hidden lg:block">
        <p className="text-[9px] font-mono uppercase tracking-[0.18em] text-[#747B88]">{tocLabel}</p>
        <nav aria-label={navigationLabel} className="mt-4">
          {renderItems()}
        </nav>
      </div>
    </>
  );
};

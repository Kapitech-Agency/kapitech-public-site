import React from 'react';
import type { InsightLanguage } from '../data/insightTypes';
import type { InsightTocItem } from '../lib/insightHeadingIds';
import { InsightTableOfContents } from './InsightTableOfContents';
import { InsightBookingCta } from './InsightBookingCta';

export const InsightRightRail: React.FC<{
  items: InsightTocItem[];
  language: InsightLanguage;
}> = ({ items, language }) => (
  <aside
    className="sticky top-24 hidden h-[calc(100dvh-7rem)] min-h-0 xl:block"
    aria-label={language === 'id' ? 'Navigasi artikel' : 'Article navigation'}
  >
    <div className="flex h-full min-h-0 flex-col gap-3">
      <div className="min-h-0">
        <InsightTableOfContents items={items} language={language} variant="desktop" />
      </div>
      <InsightBookingCta language={language} />
    </div>
  </aside>
);

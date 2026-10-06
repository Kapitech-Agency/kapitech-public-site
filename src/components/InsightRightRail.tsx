import React from 'react';
import type { InsightLanguage } from '../data/insightTypes';
import type { InsightTocItem } from '../lib/insightHeadingIds';
import { InsightBookACall } from './InsightBookACall';
import { InsightTableOfContents } from './InsightTableOfContents';

export const InsightRightRail: React.FC<{
  items: InsightTocItem[];
  language: InsightLanguage;
}> = ({ items, language }) => (
  <aside
    className="sticky top-24 hidden h-[calc(100dvh-7rem)] min-h-0 xl:grid xl:grid-rows-[minmax(0,1fr)_auto] gap-5"
    aria-label={language === 'id' ? 'Navigasi artikel' : 'Article navigation'}
  >
    <InsightTableOfContents items={items} language={language} variant="desktop" />
    <InsightBookACall language={language} />
  </aside>
);

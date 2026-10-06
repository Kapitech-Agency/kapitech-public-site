import React from 'react';
import type { InsightLanguage } from '../data/insightTypes';
import type { InsightTocItem } from '../lib/insightHeadingIds';
import { InsightTableOfContents } from './InsightTableOfContents';

export const InsightRightRail: React.FC<{
  items: InsightTocItem[];
  language: InsightLanguage;
}> = ({ items, language }) => (
  <aside
    className="sticky top-24 hidden h-[calc(100dvh-7rem)] min-h-0 xl:block"
    aria-label={language === 'id' ? 'Navigasi artikel' : 'Article navigation'}
  >
    <InsightTableOfContents items={items} language={language} variant="desktop" />
  </aside>
);

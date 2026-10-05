import React from 'react';
import type { InsightLanguage } from '../data/insightTypes';
import type { InsightTocItem } from '../lib/insightHeadingIds';
import { InsightTableOfContents } from './InsightTableOfContents';
import { InsightBookACall } from './InsightBookACall';

export const InsightRightRail: React.FC<{
  items: InsightTocItem[];
  language: InsightLanguage;
}> = ({ items, language }) => (
  <aside
    className="sticky top-24 hidden h-fit xl:flex xl:flex-col"
    aria-label={language === 'id' ? 'Navigasi dan konversi artikel' : 'Article navigation and conversion'}
  >
    <InsightTableOfContents items={items} language={language} />
    <InsightBookACall language={language} />
  </aside>
);

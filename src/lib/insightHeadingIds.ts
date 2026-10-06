import {
  buildInsightHeadingIdList,
  buildInsightTocList
} from './insightHeadingIdsCore.mjs';
import type { InsightBlock } from '../data/insightTypes';

export type InsightTocItem = {
  id: string;
  text: string;
  level: 2 | 3;
};

export function buildInsightHeadingIds(blocks: InsightBlock[]): Array<string | undefined> {
  return buildInsightHeadingIdList(blocks).map((id) => id || undefined);
}

export function buildInsightToc(
  blocks: InsightBlock[],
  headingIds: Array<string | undefined>
): InsightTocItem[] {
  return buildInsightTocList(blocks, headingIds);
}

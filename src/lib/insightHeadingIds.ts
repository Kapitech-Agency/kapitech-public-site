import type { InsightBlock } from '../data/insightTypes';

export type InsightTocItem = {
  id: string;
  text: string;
  level: 2 | 3;
};

function slugifyHeading(value: string): string {
  const normalized = value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return normalized || 'section';
}

export function buildInsightHeadingIds(blocks: InsightBlock[]): Array<string | undefined> {
  const counts = new Map<string, number>();

  return blocks.map(block => {
    if (block.type !== 'heading') return undefined;

    const base = slugifyHeading(block.text || '');
    const count = (counts.get(base) || 0) + 1;
    counts.set(base, count);

    return count === 1 ? 'insight-' + base : 'insight-' + base + '-' + count;
  });
}

export function buildInsightToc(blocks: InsightBlock[], headingIds: Array<string | undefined>): InsightTocItem[] {
  return blocks.flatMap((block, index) => {
    if (
      block.type !== 'heading'
      || (block.level !== 2 && block.level !== 3)
      || !headingIds[index]
    ) return [];

    return [{
      id: headingIds[index] as string,
      text: block.text || '',
      level: block.level
    }];
  });
}

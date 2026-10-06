export function slugifyInsightHeading(value) {
  const normalized = String(value ?? '')
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

export function buildInsightHeadingIdList(blocks) {
  const counts = new Map();

  return (Array.isArray(blocks) ? blocks : []).map((block) => {
    if (!block || block.type !== 'heading') return '';

    const base = slugifyInsightHeading(block.text);
    const count = (counts.get(base) || 0) + 1;
    counts.set(base, count);

    return 'insight-' + base + (count === 1 ? '' : '-' + count);
  });
}

export function buildInsightTocList(blocks, headingIds) {
  return (Array.isArray(blocks) ? blocks : []).flatMap((block, index) => {
    if (!block || block.type !== 'heading') return [];
    if (block.level !== 2 && block.level !== 3) return [];
    if (!headingIds?.[index]) return [];

    return [{
      id: headingIds[index],
      text: String(block.text || ''),
      level: block.level
    }];
  });
}

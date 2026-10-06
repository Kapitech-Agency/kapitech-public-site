export function limitInsightPromos(blocks, maxPromos = 2) {
  if (!Array.isArray(blocks)) return [];

  let seen = 0;
  return blocks.filter((block) => {
    if (!block || block.type !== 'promo') return true;
    seen += 1;
    return seen <= maxPromos;
  });
}

export function splitInsightBlocks(blocks) {
  const normalized = limitInsightPromos(blocks);
  const firstHeadingIndex = normalized.findIndex((block) => block?.type === 'heading');

  return {
    blocks: normalized,
    introductionBlocks: firstHeadingIndex > -1
      ? normalized.slice(0, firstHeadingIndex)
      : normalized,
    bodyBlocks: firstHeadingIndex > -1
      ? normalized.slice(firstHeadingIndex)
      : []
  };
}

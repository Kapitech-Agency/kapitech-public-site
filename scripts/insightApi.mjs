const DEFAULT_API_BASE = 'https://ams.kapitech.id/api';
const REQUEST_TIMEOUT_MS = 15000;
const DETAIL_CONCURRENCY = 4;

function apiBase() {
  return String(process.env.VITE_AMS_API_BASE_URL || DEFAULT_API_BASE).replace(/\/+$/, '');
}

async function fetchJson(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      headers: { Accept: 'application/json' },
      signal: controller.signal
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error('Insight API returned ' + response.status + ' for ' + url);
    }

    return payload;
  } catch (error) {
    if (error?.name === 'AbortError') {
      throw new Error('Insight API request timed out after ' + REQUEST_TIMEOUT_MS + 'ms: ' + url);
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchPublishedLanguage(language) {
  const results = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const url = apiBase() + '/cms/insights?language=' + encodeURIComponent(language) + '&page=' + page + '&pageSize=100';
    const payload = await fetchJson(url);
    const items = Array.isArray(payload.insights) ? payload.insights : [];

    for (const item of items) {
      if (item?.status === 'published' && item.slug) results.push(item);
    }

    totalPages = Math.max(1, Number(payload.meta?.totalPages || 1));
    page += 1;
  }

  return results;
}

async function mapWithConcurrency(items, worker, concurrency = DETAIL_CONCURRENCY) {
  const output = new Array(items.length);
  let cursor = 0;

  async function runWorker() {
    while (true) {
      const index = cursor;
      cursor += 1;

      if (index >= items.length) return;
      output[index] = await worker(items[index], index);
    }
  }

  const workers = Array.from(
    { length: Math.min(concurrency, Math.max(1, items.length)) },
    () => runWorker()
  );

  await Promise.all(workers);
  return output;
}

export async function fetchPublishedInsightSummaries() {
  const [id, en] = await Promise.all([
    fetchPublishedLanguage('id'),
    fetchPublishedLanguage('en')
  ]);

  const seen = new Set();
  return [...id, ...en].filter((item) => {
    const key = item.language + ':' + item.slug;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export async function fetchPublishedInsights() {
  const summaries = await fetchPublishedInsightSummaries();

  const variants = await mapWithConcurrency(summaries, async (summary) => {
    if (Array.isArray(summary.content)) return summary;

    const url = apiBase() + '/cms/insights/' + encodeURIComponent(summary.slug);
    const payload = await fetchJson(url);
    const detail = payload?.insight;

    if (!detail || detail.status !== 'published' || detail.slug !== summary.slug) {
      throw new Error('Published Insight detail is missing or invalid for ' + summary.slug);
    }

    return { ...summary, ...detail };
  });

  const byGroup = new Map();

  for (const item of variants) {
    const key = item.contentGroupId || item.id;
    if (!byGroup.has(key)) byGroup.set(key, []);
    byGroup.get(key).push(item);
  }

  return { variants, byGroup };
}

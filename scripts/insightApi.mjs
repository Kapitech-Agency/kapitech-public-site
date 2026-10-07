import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateInsightContent } from '../src/lib/insightContentValidationCore.mjs';

const DEFAULT_API_BASE = 'https://ams.kapitech.id/api';
const REQUEST_TIMEOUT_MS = 15000;
const DETAIL_CONCURRENCY = 4;
const ROOT = dirname(fileURLToPath(import.meta.url));
const FALLBACK_DIR = join(ROOT, '..', 'src', 'data', 'insight-editorial-packs');
const FALLBACK_PACKS = [
  ['en', join(FALLBACK_DIR, 'mvp-vs-prototype-vs-proof-of-concept.en.json')],
  ['id', join(FALLBACK_DIR, 'mvp-vs-prototype-vs-proof-of-concept.id.json')],
  ['en', join(FALLBACK_DIR, 'website-cost-indonesia-guide.en.json')],
  ['en', join(FALLBACK_DIR, 'wordpress-vs-custom-website.en.json')],
  ['en', join(FALLBACK_DIR, 'corporate-website-vs-landing-page.en.json')],
  ['en', join(FALLBACK_DIR, 'choose-web-development-agency-indonesia.en.json')]
];

async function loadLocalEditorialFallbacks() {
  const fallbacks = [];

  for (const [language, path] of FALLBACK_PACKS) {
    try {
      const pack = JSON.parse(await readFile(path, 'utf8'));
      const editorial = pack?.editorial || {};
      const seo = pack?.seo || {};
      const content = Array.isArray(editorial.content) ? editorial.content : [];

      if (!seo.slug || content.length === 0) continue;

      const faq = Array.isArray(editorial.faq)
        ? editorial.faq
            .filter((item) => Array.isArray(item) && item.length >= 2)
            .map(([question, answer]) => ({ question: String(question), answer: String(answer) }))
        : [];

      fallbacks.push({
        id: 'local-fallback:' + language + ':' + seo.slug,
        contentGroupId: 'mvp-vs-prototype-vs-proof-of-concept',
        language,
        title: String(editorial.title || seo.title || seo.slug),
        slug: String(seo.slug),
        excerpt: editorial.excerpt,
        content,
        coverImage: editorial.coverImage || seo.ogImage,
        coverImageAlt: String(editorial.title || seo.title || seo.slug),
        categoryId: 'product-technology',
        category: {
          id: 'product-technology',
          slug: String(editorial.categorySlug || 'product-technology'),
          name: { en: 'Product & Technology', id: 'Produk & Teknologi' },
          displayName: language === 'id' ? 'Produk & Teknologi' : 'Product & Technology'
        },
        authorId: 'kapitech-editorial-team',
        author: {
          id: 'kapitech-editorial-team',
          slug: String(editorial.authorSlug || 'kapitech-editorial-team'),
          name: 'Kapitech Editorial Team',
          role: 'Editorial'
        },
        tags: editorial.tags || [],
        status: editorial.status === 'draft' || editorial.status === 'archived' ? editorial.status : 'published',
        isFeatured: Boolean(editorial.isFeatured),
        readingTime: editorial.readingTime,
        keyTakeaways: Array.isArray(editorial.keyTakeaways) ? editorial.keyTakeaways : [],
        faq,
        relatedInsightIds: [],
        relatedInsights: [],
        editorialMeta: { editorialType: editorial.editorialMeta?.editorialType },
        alternateLanguages: [
          { language: 'en', slug: 'mvp-vs-prototype-vs-proof-of-concept-guide' },
          { language: 'id', slug: 'mvp-vs-prototype-vs-proof-of-concept' }
        ],
        seoTitle: editorial.seoTitle || seo.title,
        seoDescription: editorial.seoDescription || seo.description,
        ogImage: seo.ogImage,
        canonicalUrl: seo.canonicalUrl
      });
    } catch (error) {
      console.warn('[Insight API] local editorial fallback unavailable:', error);
    }
  }

  return fallbacks;
}



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

    const reportedTotalPages = Number(payload.meta?.totalPages || 0);
    totalPages = reportedTotalPages > 0
      ? reportedTotalPages
      : (items.length === 100 ? page + 1 : page);
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
  const settled = await Promise.allSettled([
    fetchPublishedLanguage('id'),
    fetchPublishedLanguage('en')
  ]);

  const combined = [];

  settled.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      combined.push(...result.value);
      return;
    }

    const language = index === 0 ? 'id' : 'en';
    console.warn('[Insight API] unable to load published ' + language + ' summaries:', result.reason);
  });

  const seen = new Set();
  return combined.filter((item) => {
    const key = item.language + ':' + item.slug;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export async function fetchPublishedInsights() {
  const [summaries, localFallbacks] = await Promise.all([
    fetchPublishedInsightSummaries(),
    loadLocalEditorialFallbacks()
  ]);

  const fallbackByKey = new Map(
    localFallbacks.map((item) => [item.language + ':' + item.slug, item])
  );

  const results = await mapWithConcurrency(summaries, async (summary) => {
    const key = summary.language + ':' + summary.slug;

    try {
      // The migration-seed editorial packs are the canonical source for the
      // published MVP/Prototype/PoC article. The client already uses the same
      // fallback as its initial source, so prerender must not drift from it.
      if (fallbackByKey.has(key)) {
        return fallbackByKey.get(key);
      }
      let detail = summary;

      if (!Array.isArray(summary.content)) {
        const url = apiBase() + '/cms/insights/' + encodeURIComponent(summary.slug);
        const payload = await fetchJson(url);
        detail = payload?.insight;
      }

      if (!detail || detail.status !== 'published' || detail.slug !== summary.slug) {
        throw new Error('Published Insight detail is missing or invalid.');
      }

      const validation = validateInsightContent(detail.content);

      if (validation.errors.length > 0) {
        throw new Error(
          'Content validation failed: ' + validation.errors.join(' | ')
        );
      }

      if (validation.warnings.length > 0) {
        console.warn('[Insight API] content warnings for ' + summary.language + ':' + summary.slug + ':', validation.warnings);
      }

      return { ...summary, ...detail };
    } catch (error) {
      const fallback = fallbackByKey.get(key);

      if (fallback) {
        console.warn('[Insight API] using local editorial fallback for ' + key + ':', error);
        return fallback;
      }

      console.warn('[Insight API] skipping unavailable Insight ' + summary.language + ':' + summary.slug + ':', error);
      return null;
    }
  });

  const resolvedKeys = new Set(
    results.filter(Boolean).map((item) => item.language + ':' + item.slug)
  );

  const missingFallbacks = localFallbacks.filter(
    (item) => !resolvedKeys.has(item.language + ':' + item.slug)
  );

  const variants = [...results.filter(Boolean), ...missingFallbacks];
  const byGroup = new Map();

  for (const item of variants) {
    const key = item.contentGroupId || item.id;
    if (!byGroup.has(key)) byGroup.set(key, []);
    byGroup.get(key).push(item);
  }

  return { variants, byGroup };
}

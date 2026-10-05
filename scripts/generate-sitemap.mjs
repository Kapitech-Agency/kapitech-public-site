import { readFile, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const manifest = JSON.parse(await readFile(join(root, 'src/data/seoRoutes.json'), 'utf8'));
const distSitemap = join(root, 'dist', 'sitemap.xml');
const apiBase = (process.env.VITE_AMS_API_BASE_URL || 'https://ams.kapitech.id/api').replace(/\/$/, '');

const escapeXml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&apos;');

const urls = new Map();

for (const route of manifest.routes.filter((item) => item.robots?.startsWith('index'))) {
  const loc = manifest.siteUrl + (route.path === '/' ? '/' : route.path);
  urls.set(loc, { loc });
}


for (const language of ['id', 'en']) {
  try {
    let page = 1;
    let totalPages = 1;

    while (page <= totalPages) {
      const response = await fetch(
        apiBase + '/cms/insights?language=' + language + '&page=' + page + '&pageSize=100'
      );
      if (!response.ok) throw new Error('Insight API returned ' + response.status);
      const payload = await response.json();
      const insights = Array.isArray(payload.insights) ? payload.insights : [];

      for (const insight of insights) {
        if (insight.status !== 'published' || !insight.slug) continue;
        const loc = manifest.siteUrl + '/insights/' + insight.slug;
        urls.set(loc, { loc, lastmod: insight.updatedAt || insight.publishedAt || undefined });
      }

      totalPages = Number(payload.meta?.totalPages || 1);
      page += 1;
    }
  } catch (error) {
    console.warn('[seo] unable to load published ' + language + ' Insights:', error instanceof Error ? error.message : error);
  }
}

const entries = [...urls.values()].map((entry) => {
  const parts = ['  <url>', '    <loc>' + escapeXml(entry.loc) + '</loc>'];
  if (entry.lastmod) {
    const date = new Date(entry.lastmod);
    if (!Number.isNaN(date.getTime())) parts.push('    <lastmod>' + date.toISOString() + '</lastmod>');
  }
  parts.push('  </url>');
  return parts.join('\n');
});

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...entries,
  '</urlset>',
  ''
].join('\n');

await writeFile(distSitemap, sitemap, 'utf8');
console.log('[seo] generated sitemap.xml with ' + entries.length + ' canonical indexable URLs');

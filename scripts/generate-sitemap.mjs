import { readFile, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { fetchPublishedInsightSummaries } from './insightApi.mjs';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const manifest = JSON.parse(await readFile(join(root, 'src/data/seoRoutes.json'), 'utf8'));
const distSitemap = join(root, 'dist', 'sitemap.xml');

const escapeXml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&apos;');

const urls = new Map();

for (const route of manifest.routes.filter((item) => item.robots?.startsWith('index'))) {
  const loc = manifest.siteUrl + (route.path === '/' ? '/' : route.path);
  urls.set(loc, { loc, lastmod: undefined });
}

const insights = await fetchPublishedInsightSummaries();

for (const insight of insights) {
  const loc = manifest.siteUrl + '/insights/' + encodeURIComponent(insight.slug);
  urls.set(loc, {
    loc,
    lastmod: insight.updatedAt || insight.publishedAt || undefined
  });
}

const entries = [...urls.values()].map((entry) => {
  const parts = [
    '  <url>',
    '    <loc>' + escapeXml(entry.loc) + '</loc>'
  ];

  if (entry.lastmod) {
    const date = new Date(entry.lastmod);
    if (!Number.isNaN(date.getTime())) {
      parts.push('    <lastmod>' + date.toISOString() + '</lastmod>');
    }
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

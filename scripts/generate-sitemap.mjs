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

const projectsSource = await readFile(join(root, 'src/data/projectsData.ts'), 'utf8');
const projectRecords = [];
const projectPattern = /\{\s*id:\s*'([^']+)'[\s\S]*?title:\s*'([^']+)'[\s\S]*?client:\s*'([^']+)'[\s\S]*?industry:\s*'([^']+)'/g;
for (const match of projectsSource.matchAll(projectPattern)) {
  projectRecords.push({ id: match[1], title: match[2], client: match[3], industry: match[4] });
}

const slugify = (value) => String(value || '')
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .trim()
  .replace(/&/g, ' and ')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

for (const project of projectRecords) {
  const projectSlug = slugify(project.id || project.title);
  const loc = manifest.siteUrl + '/work/' + encodeURIComponent(projectSlug);
  urls.set(loc, { loc, lastmod: undefined });
}

for (const industry of new Set(projectRecords.map((project) => project.industry).filter(Boolean))) {
  const loc = manifest.siteUrl + '/industries/' + encodeURIComponent(slugify(industry));
  urls.set(loc, { loc, lastmod: undefined });
}

const fetchPublicCmsProjects = async () => {
  const apiBase = String(process.env.VITE_AMS_API_BASE_URL || 'https://ams.kapitech.id/api').replace(/\/+$/, '');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(apiBase + '/cms/projects', {
      headers: { Accept: 'application/json' },
      signal: controller.signal
    });
    if (!response.ok) return [];
    const payload = await response.json().catch(() => ({}));
    return Array.isArray(payload.projects) ? payload.projects : [];
  } catch {
    return [];
  } finally {
    clearTimeout(timeout);
  }
};

const cmsProjects = await fetchPublicCmsProjects();
for (const project of cmsProjects) {
  if (project?.isPublished === false) continue;
  const projectSlug = slugify(project.slug || project.id || project.title);
  if (!projectSlug) continue;
  const loc = manifest.siteUrl + '/work/' + encodeURIComponent(projectSlug);
  urls.set(loc, { loc, lastmod: project.updatedAt || project.createdAt || undefined });
  if (project.industry) {
    const industryLoc = manifest.siteUrl + '/industries/' + encodeURIComponent(slugify(project.industry));
    urls.set(industryLoc, { loc: industryLoc, lastmod: undefined });
  }
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

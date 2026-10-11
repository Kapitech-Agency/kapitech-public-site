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

const slugify = (value) => String(value || '')
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .trim()
  .replace(/&/g, ' and ')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

const fetchPublicCmsProjects = async () => {
  const configuredApiBase = String(process.env.VITE_AMS_API_BASE_URL || '').trim().replace(/\/+$/, '');
  const apiBase = configuredApiBase ? (/\/api$/i.test(configuredApiBase) ? configuredApiBase : configuredApiBase + '/api') : 'https://ams.kapitech.id/api';
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

const fetchPublicCmsServices = async () => {
  const configuredApiBase = String(process.env.VITE_AMS_API_BASE_URL || '').trim().replace(/\/+$/, '');
  const apiBase = configuredApiBase
    ? (/\/api$/i.test(configuredApiBase) ? configuredApiBase : configuredApiBase + '/api')
    : 'https://ams.kapitech.id/api';
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(apiBase + '/cms/services', {
      headers: { Accept: 'application/json' },
      signal: controller.signal
    });
    if (!response.ok) return [];
    const payload = await response.json().catch(() => ({}));
    return Array.isArray(payload.services)
      ? payload.services.filter((service) => service?.isPublished !== false && slugify(service.slug || service.id || service.title) !== 'mobile-app-design')
      : [];
  } catch {
    return [];
  } finally {
    clearTimeout(timeout);
  }
};

const cmsServices = await fetchPublicCmsServices();
for (const service of cmsServices) {
  const serviceSlug = slugify(service.slug || service.id || service.title);
  if (!serviceSlug) continue;
  const isSolution = String(service.type || '').toLowerCase() === 'solution';
  const path = (isSolution ? '/solutions/' : '/services/') + encodeURIComponent(serviceSlug);
  const loc = manifest.siteUrl + path;
  urls.set(loc, { loc, lastmod: service.updatedAt || service.createdAt || undefined });
}

const cmsProjects = await fetchPublicCmsProjects();
for (const project of cmsProjects) {
  const candidateSlugs = [project?.slug, project?.id, project?.title]
    .map((value) => slugify(value))
    .filter(Boolean);
  const projectSlug = slugify(project?.slug || project?.id || project?.title);

  // Only explicitly published CMS records are eligible for indexing.
  if (project?.isPublished !== true) {
    for (const candidateSlug of candidateSlugs) {
      urls.delete(manifest.siteUrl + '/work/' + encodeURIComponent(candidateSlug));
    }
    continue;
  }

  if (!projectSlug) continue;
  for (const candidateSlug of candidateSlugs) {
    if (candidateSlug !== projectSlug) {
      urls.delete(manifest.siteUrl + '/work/' + encodeURIComponent(candidateSlug));
    }
  }
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

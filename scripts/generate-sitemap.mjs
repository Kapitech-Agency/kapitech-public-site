import { readFile, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const manifest = JSON.parse(await readFile(join(root, 'src/data/seoRoutes.json'), 'utf8'));
const distSitemap = join(root, 'dist', 'sitemap.xml');

const escapeXml = (value) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&apos;');

const urls = manifest.routes
  .filter((route) => route.robots?.startsWith('index'))
  .map((route) => {
    const loc = manifest.siteUrl + (route.path === '/' ? '/' : route.path);
    return ['  <url>', `    <loc>${escapeXml(loc)}</loc>`, '  </url>'].join('\n');
  });

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...urls,
  '</urlset>',
  '',
].join('\n');

await writeFile(distSitemap, sitemap, 'utf8');
console.log('[seo] generated sitemap.xml with ' + urls.length + ' canonical indexable URLs');

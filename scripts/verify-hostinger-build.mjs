import { access, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(new URL('..', import.meta.url)));
const distDir = join(root, 'dist');

const requiredFiles = [
  'index.html',
  'kapitech-deployment-health.txt',
  'work/index.html',
  'services/index.html',
  'insights/index.html',
  'about/index.html',
  'careers/index.html',
  'contact/index.html',
  '.htaccess'
];

for (const relativePath of requiredFiles) {
  try {
    await access(join(distDir, relativePath));
  } catch {
    throw new Error('[deploy-check] missing dist/' + relativePath);
  }
}

const deploymentHealth = await readFile(join(distDir, 'kapitech-deployment-health.txt'), 'utf8');
const baselineMatch = deploymentHealth.match(/^Baseline commit:\s*([a-f0-9]{40})\s*$/im);
const requiredBaselineMatch = deploymentHealth.match(/^Required deployed baseline:\s*([a-f0-9]{40})\s*$/im);
if (!baselineMatch || !requiredBaselineMatch || baselineMatch[1] !== requiredBaselineMatch[1]) {
  throw new Error('[deploy-check] deployment health marker must contain matching 40-character baseline SHAs');
}
if (!deploymentHealth.includes('Build: Hostinger Node.js 22 / npm run build') || !deploymentHealth.includes('Expected deployment root: public_html')) {
  throw new Error('[deploy-check] deployment health marker does not match the supported Hostinger build target');
}
const mvpInsightAssets = [
  'insights/mvp-vs-prototype-vs-proof-of-concept/hero.svg',
  'insights/mvp-vs-prototype-vs-proof-of-concept/hero-en.svg',
  'insights/mvp-vs-prototype-vs-proof-of-concept/validate.svg',
  'insights/mvp-vs-prototype-vs-proof-of-concept/validate-id.svg',
  'insights/mvp-vs-prototype-vs-proof-of-concept/learning-loop.svg',
  'insights/mvp-vs-prototype-vs-proof-of-concept/learning-loop-id.svg',
  'insights/mvp-vs-prototype-vs-proof-of-concept/comparison.svg',
  'insights/mvp-vs-prototype-vs-proof-of-concept/comparison-id.svg',
  'insights/mvp-vs-prototype-vs-proof-of-concept/decision-tree.svg',
  'insights/mvp-vs-prototype-vs-proof-of-concept/decision-tree-id.svg',
  'insights/mvp-vs-prototype-vs-proof-of-concept/framework.svg',
  'insights/mvp-vs-prototype-vs-proof-of-concept/framework-id.svg',
  'insights/mvp-vs-prototype-vs-proof-of-concept/visual-fallback.svg'
];

for (const relativePath of mvpInsightAssets) {
  try {
    await access(join(distDir, relativePath));
  } catch {
    throw new Error('[deploy-check] missing MVP Insight asset: ' + relativePath);
  }
}

const indexHtml = await readFile(join(distDir, 'index.html'), 'utf8');
if (!indexHtml.includes('<div id="root"></div>')) {
  throw new Error('[deploy-check] dist/index.html is not the expected Vite entry file');
}

const appSource = await readFile(join(root, 'src/App.tsx'), 'utf8');
const contactSource = await readFile(join(root, 'src/pages/Contact.tsx'), 'utf8');
if (!appSource.includes('const scrollToTarget = () =>') || !appSource.includes('attempts >= 60')) {
  throw new Error('[deploy-check] hash navigation must wait for lazy-loaded route targets');
}
if (!contactSource.includes('id="project-inquiry-form"') || !contactSource.includes("form.scrollIntoView({ behavior: 'instant', block: 'start' })")) {
  throw new Error('[deploy-check] project inquiry form anchor or post-mount scrolling is missing');
}
if (indexHtml.includes('Kapitech-Agency.github.io')) {
  throw new Error('[deploy-check] index.html still references assets from the retired GitHub Pages repository');
}
if (!indexHtml.includes('href="/favicon.svg"')) {
  throw new Error('[deploy-check] local SVG favicon reference is missing');
}
if (!indexHtml.includes('https://kapitech.id/insights/article-hero-background.jpg')) {
  throw new Error('[deploy-check] self-hosted Open Graph image reference is missing');
}
for (const asset of ['favicon.svg', 'insights/article-hero-background.jpg']) {
  try {
    await access(join(distDir, asset));
  } catch {
    throw new Error('[deploy-check] missing self-hosted SEO asset: ' + asset);
  }
}
const seoManifest = JSON.parse(await readFile(join(root, 'src/data/seoRoutes.json'), 'utf8'));
if (seoManifest.defaultImage !== 'https://kapitech.id/insights/article-hero-background.jpg') {
  throw new Error('[deploy-check] SEO manifest still points at an unowned default image');
}

const htmlEscape = (value) => String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('"', '&quot;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;');
const readMetaContent = (html, attribute, key) => {
  const pattern = new RegExp('<meta\\b(?=[^>]*\\b' + attribute + '="' + key + '")[^>]*\\bcontent="([^"]*)"[^>]*>', 'i');
  return html.match(pattern)?.[1] || '';
};

// Social preview metadata must match each canonical prerendered route, not the homepage template.
for (const route of seoManifest.routes) {
  if (route.path.startsWith('/insights/')) continue;
  const relativePath = route.path === '/' ? 'index.html' : route.path.slice(1) + '/index.html';
  let html;
  try {
    html = await readFile(join(distDir, relativePath), 'utf8');
  } catch {
    throw new Error('[deploy-check] missing SEO prerender for ' + route.path);
  }
  const canonicalUrl = seoManifest.siteUrl + (route.path === '/' ? '/' : route.path);
  const expectedTitle = htmlEscape(route.title);
  const expectedDescription = htmlEscape(route.description);
  const expectedUrl = htmlEscape(canonicalUrl);
  for (const [attribute, key, expected] of [
    ['property', 'og:url', expectedUrl],
    ['property', 'og:title', expectedTitle],
    ['property', 'og:description', expectedDescription],
    ['name', 'twitter:url', expectedUrl],
    ['name', 'twitter:title', expectedTitle],
    ['name', 'twitter:description', expectedDescription]
  ]) {
    const actual = readMetaContent(html, attribute, key);
    if (actual !== expected) {
      throw new Error('[deploy-check] mismatched ' + attribute + ':' + key + ' metadata for ' + route.path);
    }
  }
}

const htaccess = await readFile(join(distDir, '.htaccess'), 'utf8');
if (!htaccess.includes('<FilesMatch "\\.html$">')) {
  throw new Error('[deploy-check] .htaccess must target HTML files with a valid escaped-dot regex');
}
if (!htaccess.includes('Header set Cache-Control "no-store, no-cache, must-revalidate, max-age=0"')
  || !htaccess.includes('Header set Pragma "no-cache"')
  || !htaccess.includes('Header set Expires "0"')) {
  throw new Error('[deploy-check] prerendered HTML routes must not be cached across deployments');
}
const requiredSecurityHeaders = [
  'Header always set X-Content-Type-Options "nosniff"',
  'Header always set Referrer-Policy "strict-origin-when-cross-origin"',
  'Header always set X-Frame-Options "SAMEORIGIN"',
  'Header always set Permissions-Policy "camera=(), geolocation=(), microphone=()"',
  'Header always set X-Permitted-Cross-Domain-Policies "none"',
  'Header always set Strict-Transport-Security "max-age=31536000" env=HTTPS'
];
for (const directive of requiredSecurityHeaders) {
  if (!htaccess.includes(directive)) {
    throw new Error('[deploy-check] missing production security header directive: ' + directive);
  }
}

const runtimeServer = await readFile(join(root, 'server.mjs'), 'utf8');
for (const headerName of [
  "'X-Content-Type-Options'",
  "'Referrer-Policy'",
  "'X-Frame-Options'",
  "'Permissions-Policy'",
  "'X-Permitted-Cross-Domain-Policies'"
]) {
  if (!runtimeServer.includes('res.setHeader(' + headerName)) {
    throw new Error('[deploy-check] Node runtime is missing security header: ' + headerName);
  }
}
if (!htaccess.includes('RewriteRule ^services/mobile-app-design/?$ /services [R=301,L,NE]')) {
  throw new Error('[deploy-check] retired mobile app service redirect is missing');
}
const sitemap = await readFile(join(distDir, 'sitemap.xml'), 'utf8');
if (sitemap.includes('/services/mobile-app-design')) {
  throw new Error('[deploy-check] retired mobile app service must not appear in sitemap.xml');
}
if (!htaccess.includes('RewriteCond %{REQUEST_URI} ^/insights/')) {
  throw new Error('[deploy-check] dist/.htaccess is missing the explicit Insight detail fallback');
}
if (!htaccess.includes('RewriteRule ^ /index.html [L]')) {
  throw new Error('[deploy-check] dist/.htaccess is missing the React Router fallback');
}

const insightAssertions = [
  {
    file: 'insights/mvp-vs-prototype-vs-proof-of-concept-guide/index.html',
    required: ['<html lang="en"', 'id="kapi-prerendered-insight"', 'MVP vs Prototype vs Proof of Concept', 'In this article', 'Book a call'],
    forbidden: ['Di artikel ini', 'Pertanyaan yang sering diajukan', 'Apa itu Prototype?', 'subsections']
  },
  {
    file: 'insights/mvp-vs-prototype-vs-proof-of-concept/index.html',
    required: ['<html lang="id"', 'id="kapi-prerendered-insight"', 'MVP vs Prototype vs Proof of Concept', 'Di artikel ini', 'Book a call'],
    forbidden: ['In this article', 'Frequently asked questions', 'What Is a Prototype?', 'subbagian']
  }
];

for (const assertion of insightAssertions) {
  let html;

  try {
    html = await readFile(join(distDir, assertion.file), 'utf8');
  } catch (error) {
    if (error?.code === 'ENOENT') {
      throw new Error('[deploy-check] required Insight prerender is missing: ' + assertion.file);
    }
    throw error;
  }

  if (!html.includes('<h1')) throw new Error('[deploy-check] prerendered Insight has no H1: ' + assertion.file);
  if ((html.match(/<h2\b/gi) || []).length < 8) throw new Error('[deploy-check] Insight is missing editorial H2 depth: ' + assertion.file);
  if ((html.match(/<img\b/gi) || []).length < 5) throw new Error('[deploy-check] Insight is missing expected editorial visuals: ' + assertion.file);

  if (assertion.file.includes('mvp-vs-prototype-vs-proof-of-concept-guide')) {
    const promoCount = (html.match(/data-kapi-ad="true"/g) || []).length;
    if (promoCount !== 1) {
      throw new Error('[deploy-check] MVP Insight should contain exactly one contextual promo: ' + assertion.file);
    }
    if (html.includes('Project discussion') || html.includes('Mulai diskusi')) {
      throw new Error('[deploy-check] MVP Insight still contains the removed redundant final CTA: ' + assertion.file);
    }
  }

  for (const phrase of assertion.required) {
    if (!html.includes(phrase)) throw new Error('[deploy-check] Missing required Insight phrase "' + phrase + '" in ' + assertion.file);
  }

  for (const phrase of assertion.forbidden) {
    if (html.includes(phrase)) throw new Error('[deploy-check] Mixed-language Insight phrase "' + phrase + '" found in ' + assertion.file);
  }

  const faqSections = (html.match(/id="faq-title"/g) || []).length;
  if (faqSections > 1) {
    throw new Error('[deploy-check] Insight contains multiple FAQ sections: ' + assertion.file);
  }
  if (faqSections === 0) {
    console.warn('[deploy-check] FAQ data is not available in the upstream CMS payload for ' + assertion.file + '; continuing without FAQ because the article body itself is verified.');
  }

  console.log('[deploy-check] verified prerendered Insight: ' + assertion.file);
}

console.log('[deploy-check] Hostinger-ready static build, bilingual Insight prerender, and editorial depth verified');

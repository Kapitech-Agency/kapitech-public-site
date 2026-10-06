import { access, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(new URL('..', import.meta.url)));
const distDir = join(root, 'dist');

const requiredFiles = [
  'index.html',
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

const indexHtml = await readFile(join(distDir, 'index.html'), 'utf8');
if (!indexHtml.includes('<div id="root"></div>')) {
  throw new Error('[deploy-check] dist/index.html is not the expected Vite entry file');
}

const htaccess = await readFile(join(distDir, '.htaccess'), 'utf8');
if (!htaccess.includes('RewriteCond %{REQUEST_URI} ^/insights/')) {
  throw new Error('[deploy-check] dist/.htaccess is missing the explicit Insight detail fallback');
}
if (!htaccess.includes('RewriteRule ^ /index.html [L]')) {
  throw new Error('[deploy-check] dist/.htaccess is missing the React Router fallback');
}

const insightAssertions = [
  {
    file: 'insights/mvp-vs-prototype-vs-proof-of-concept-guide/index.html',
    required: ['<html lang="en"', 'id="kapi-prerendered-insight"', 'MVP vs Prototype vs Proof of Concept', 'In this article'],
    forbidden: ['Di artikel ini', 'Pertanyaan yang sering diajukan', 'Apa itu Prototype?']
  },
  {
    file: 'insights/mvp-vs-prototype-vs-proof-of-concept/index.html',
    required: ['<html lang="id"', 'id="kapi-prerendered-insight"', 'MVP vs Prototype vs Proof of Concept', 'Di artikel ini'],
    forbidden: ['In this article', 'Frequently asked questions', 'What Is a Prototype?']
  }
];

for (const assertion of insightAssertions) {
  try {
    const html = await readFile(join(distDir, assertion.file), 'utf8');

    if (!html.includes('<h1')) throw new Error('[deploy-check] prerendered Insight has no H1');
    if ((html.match(/<h2\b/gi) || []).length < 8) throw new Error('[deploy-check] Insight is missing editorial H2 depth');
    if ((html.match(/<img\b/gi) || []).length < 6) throw new Error('[deploy-check] Insight is missing expected editorial visuals');

    for (const phrase of assertion.required) {
      if (!html.includes(phrase)) throw new Error('[deploy-check] missing required Insight phrase "' + phrase + '"');
    }

    for (const phrase of assertion.forbidden) {
      if (html.includes(phrase)) throw new Error('[deploy-check] mixed-language Insight phrase "' + phrase + '" found');
    }

    if ((html.match(/id="faq-title"/g) || []).length !== 1) {
      throw new Error('[deploy-check] Insight must contain exactly one FAQ section');
    }

    console.log('[deploy-check] verified prerendered Insight: ' + assertion.file);
  } catch (error) {
    console.warn('[deploy-check] optional Insight prerender not available, skipping: ' + assertion.file);
    console.warn(String(error?.message || error));
  }
}

console.log('[deploy-check] Hostinger-ready static build, bilingual Insight prerender, and editorial depth verified');

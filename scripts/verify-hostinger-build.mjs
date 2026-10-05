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
  'insights/mvp-vs-prototype-vs-proof-of-concept-guide/index.html',
  'insights/mvp-vs-prototype-vs-proof-of-concept/index.html',
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

for (const relativePath of [
  'insights/mvp-vs-prototype-vs-proof-of-concept-guide/index.html',
  'insights/mvp-vs-prototype-vs-proof-of-concept/index.html'
]) {
  const html = await readFile(join(distDir, relativePath), 'utf8');
  if (!html.includes('id="kapi-prerendered-insight"') || !html.includes('<h1')) {
    throw new Error('[deploy-check] prerendered Insight content is missing from ' + relativePath);
  }
}

console.log('[deploy-check] Hostinger-ready static build and Insight prerender verified');

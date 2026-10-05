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
if (!htaccess.includes('RewriteRule ^ index.html [L]')) {
  throw new Error('[deploy-check] dist/.htaccess is missing the React Router fallback');
}

console.log('[deploy-check] Hostinger-ready static build verified');

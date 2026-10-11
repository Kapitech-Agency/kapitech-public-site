import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const sourceRoot = path.resolve('src');
const textExtensions = new Set(['.css', '.ts', '.tsx', '.js', '.jsx']);
const legacyAccent = /#(?:E50914|FF1E27)\b|rgba?\(\s*229\s*,\s*9\s*,\s*20(?:\s*[,/)\s])|rgba?\(\s*229\s+9\s+20(?:\s*[,/)\s])/i;
const sourceFiles = [];

async function collect(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await collect(absolute);
    } else if (entry.isFile() && textExtensions.has(path.extname(entry.name))) {
      sourceFiles.push(absolute);
    }
  }
}

await collect(sourceRoot);

const violations = [];
for (const file of sourceFiles) {
  const content = await readFile(file, 'utf8');
  if (legacyAccent.test(content)) {
    violations.push(path.relative(process.cwd(), file));
  }
}

const tokens = await readFile(path.join(sourceRoot, 'index.css'), 'utf8');
const requiredTokens = [
  '--kapi-color-accent: #DC143C;',
  '--kapi-color-accent-hover: #C40F34;',
  '--kapi-color-accent-text: #FF4D6D;',
  '--color-brand-red: var(--kapi-color-accent);',
  '--color-brand-red-text: var(--kapi-color-accent-text);',
  '--color-dark-base: var(--kapi-color-canvas);',
  '--color-dark-surface: var(--kapi-color-surface);'
];
const missingTokens = requiredTokens.filter((token) => !tokens.includes(token));

if (violations.length || missingTokens.length) {
  if (violations.length) {
    console.error('Legacy accent colors found in source files:');
    for (const file of violations) console.error(` - ${file}`);
  }
  if (missingTokens.length) {
    console.error('Required public design tokens are missing:');
    for (const token of missingTokens) console.error(` - ${token}`);
  }
  process.exitCode = 1;
} else {
  console.log(`Verified shared Kapitech public design tokens across ${sourceFiles.length} source files.`);
}

import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const distStamp = join(root, 'dist', '.kapitech-build-source-hash');
const buildInputs = ['package.json', 'vite.config.ts', 'vite.config.js', 'tsconfig.json', 'scripts', 'src', 'public'];

async function collectFiles(entryPath) {
  let entries;
  try {
    entries = await readdir(entryPath, { withFileTypes: true });
  } catch {
    try {
      await readFile(entryPath);
      return [entryPath];
    } catch {
      return [];
    }
  }

  const files = [];
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.git') continue;
    const child = join(entryPath, entry.name);
    if (entry.isDirectory()) files.push(...await collectFiles(child));
    else if (entry.isFile()) files.push(child);
  }
  return files;
}

const signature = [];
const files = [];
for (const input of buildInputs) files.push(...await collectFiles(join(root, input)));
files.sort();

for (const filePath of files) {
  const data = await stat(filePath);
  signature.push(filePath.slice(root.length) + '|' + String(data.size) + '|' + String(data.mtimeMs));
}

await writeFile(distStamp, signature.join('\\n') + '\\n', 'utf8');
console.log('[build] wrote source fingerprint to dist/.kapitech-build-source-hash');

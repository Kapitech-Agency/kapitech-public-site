import { access } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const distEntry = join(root, 'dist', 'index.html');

try {
  await access(distEntry);
  console.log('[startup] production build found at dist/index.html');
  process.exit(0);
} catch {
  console.log('[startup] dist/index.html is missing; running production build before starting server...');
}

await new Promise((resolvePromise, rejectPromise) => {
  const child = spawn(process.execPath, [resolve(root, 'node_modules/vite/bin/vite.js'), 'build'], {
    cwd: root,
    env: process.env,
    stdio: 'inherit'
  });

  child.on('error', rejectPromise);
  child.on('exit', (code, signal) => {
    if (code === 0) {
      resolvePromise();
      return;
    }

    rejectPromise(new Error(
      '[startup] production build failed' +
      (signal ? ' with signal ' + signal : ' with exit code ' + String(code))
    ));
  });
});

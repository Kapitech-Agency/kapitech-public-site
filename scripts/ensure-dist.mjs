import { access } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const distEntry = join(root, 'dist', 'index.html');
const distStamp = join(root, 'dist', '.kapitech-build-source-hash');

try {
  await access(distEntry);
  await access(distStamp);
  console.log('[startup] production build found at dist/index.html with build stamp');
  process.exit(0);
} catch {
  console.log('[startup] production dist is missing or unverified; running production build before starting server...');
}

await new Promise((resolvePromise, rejectPromise) => {
  const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  const child = spawn(npmCommand, ['run', 'build'], {
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

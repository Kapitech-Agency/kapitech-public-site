import { createReadStream } from 'node:fs';
import { spawn } from 'node:child_process';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('.', import.meta.url)));
const distDir = resolve(join(root, 'dist'));
const parsedPort = Number(process.env.PORT || 3000);
const port = Number.isInteger(parsedPort) && parsedPort > 0 ? parsedPort : 3000;

const BUILD_STAMP_PATH = join(distDir, '.kapitech-build-source-hash');
const BUILD_INPUTS = ['package.json', 'vite.config.ts', 'vite.config.js', 'tsconfig.json', 'scripts', 'src', 'public'];

async function collectFiles(entryPath) {
  try {
    const info = await stat(entryPath);
    if (info.isFile()) return [entryPath];
  } catch {
    return [];
  }

  let entries;
  try {
    entries = await readdir(entryPath, { withFileTypes: true });
  } catch {
    return [];
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

async function sourceHash() {
  const hash = createHash('sha256');
  const files = [];

  for (const input of BUILD_INPUTS) files.push(...await collectFiles(join(root, input)));
  files.sort();

  for (const filePath of files) {
    hash.update(filePath.slice(root.length));
    hash.update('\\0');
    try {
      hash.update(await readFile(filePath));
    } catch {
      // Optional inputs may disappear between scans.
    }
    hash.update('\\0');
  }

  return hash.digest('hex');
}

async function isDistStale() {
  try {
    const recorded = (await readFile(BUILD_STAMP_PATH, 'utf8')).trim();
    if (!recorded) return true;
    return recorded !== await sourceHash();
  } catch {
    return true;
  }
}

const STARTUP_FALLBACK_HTML = '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Kapitech Agency</title><style>html,body{margin:0;min-height:100%;background:#0B0C0E;color:#F3F3F6;font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}body{display:grid;place-items:center;padding:32px;box-sizing:border-box}.shell{width:min(680px,100%);text-align:center}.dot{width:10px;height:10px;border-radius:50%;background:#E50914;margin:0 auto 22px;box-shadow:0 0 0 8px rgba(229,9,20,.10)}h1{font-size:clamp(30px,5vw,46px);line-height:1.02;letter-spacing:-.04em;margin:0 0 14px}p{margin:0;color:#8B919E;line-height:1.7;font-size:15px}</style></head><body><main class="shell"><div class="dot" aria-hidden="true"></div><h1>Kapitech Agency</h1><p>We’re preparing the latest site build. The site will become available automatically once the production bundle is ready.</p></main></body></html>';

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8'
};

function safePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0] || '/');
  const relative = decoded.replace(/^[/\\]+/, '');
  const candidate = resolve(join(distDir, relative));
  return candidate === distDir || candidate.startsWith(distDir + '/') ? candidate : null;
}

async function sendFile(req, res, filePath) {
  const extension = extname(filePath).toLowerCase();
  res.statusCode = 200;
  res.setHeader('Content-Type', contentTypes[extension] || 'application/octet-stream');
  if (extension === '.html') {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
  if (req.method === 'HEAD') {
    res.end();
    return;
  }

  const stream = createReadStream(filePath);
  stream.on('error', (error) => {
    console.error('[server] stream failed:', error);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.end('Internal Server Error');
    } else {
      res.destroy(error);
    }
  });
  stream.pipe(res);
}

let buildState = 'ready';
let buildChild = null;

function startBackgroundBuild() {
  if (buildState !== 'missing' || buildChild) return;

  buildState = 'building';
  const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  buildChild = spawn(npmCommand, ['run', 'build'], {
    cwd: root,
    env: process.env,
    stdio: 'inherit'
  });

  buildChild.once('error', (error) => {
    console.error('[server] background build failed to start:', error);
    buildState = 'failed';
    buildChild = null;
  });

  buildChild.once('exit', (code, signal) => {
    buildChild = null;
    if (code === 0) {
      buildState = 'ready';
      console.log('[server] background production build completed');
      return;
    }

    buildState = 'failed';
    console.error('[server] background production build failed', { code, signal });
  });
}

async function detectDistState() {
  try {
    await stat(join(distDir, 'index.html'));

    if (await isDistStale()) {
      buildState = 'missing';
      console.warn('[server] production dist is stale; starting HTTP server and rebuilding in background');
      return;
    }

    buildState = 'ready';
    return;
  } catch {
    buildState = 'missing';
    console.warn('[server] dist/index.html is missing; starting HTTP server and building in background');
  }
}

const server = createServer(async (req, res) => {
  try {
    if (!req.url || (req.method !== 'GET' && req.method !== 'HEAD' && req.method !== 'OPTIONS')) {
      res.statusCode = 405;
      res.setHeader('Allow', 'GET, HEAD, OPTIONS');
      res.end('Method Not Allowed');
      return;
    }

    if (!req.url || req.method === 'OPTIONS') {
      res.statusCode = req.method === 'OPTIONS' ? 204 : 400;
      res.end();
      return;
    }

    if (req.url.split('?')[0] === '/__health') {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
      res.end(buildState === 'ready' ? 'ok' : 'starting');
      if (buildState !== 'ready') startBackgroundBuild();
      return;
    }

    if (buildState !== 'ready') {
      startBackgroundBuild();
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
      res.setHeader('Retry-After', '5');
      res.end(STARTUP_FALLBACK_HTML);
      return;
    }

    const requested = safePath(req.url);
    if (!requested) {
      res.statusCode = 404;
      res.end('Not Found');
      return;
    }

    const candidate = requested;
    try {
      const fileStat = await stat(candidate);
      if (fileStat.isFile()) {
        await sendFile(req, res, candidate);
        return;
      }
    } catch {
      // Fall through to the SPA entry file.
    }

    const spaEntry = join(distDir, 'index.html');
    await stat(spaEntry);
    await sendFile(req, res, spaEntry);
  } catch (error) {
    console.error('[server] request failed:', error);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
});

server.headersTimeout = 15_000;
server.requestTimeout = 30_000;
server.keepAliveTimeout = 5_000;

server.on('error', (error) => {
  console.error('[server] listener failed:', error);
});

await detectDistState();

server.listen(port, '0.0.0.0', () => {
  console.log('[server] Kapitech public site listening on port ' + port);
  if (buildState === 'missing') startBackgroundBuild();
});

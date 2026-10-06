import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('.', import.meta.url)));
const distDir = resolve(join(root, 'dist'));
const parsedPort = Number(process.env.PORT || 3000);
const port = Number.isInteger(parsedPort) && parsedPort > 0 ? parsedPort : 3000;

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
      const healthEntry = join(distDir, 'index.html');

      try {
        await stat(healthEntry);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
        res.end('ok');
      } catch {
        res.statusCode = 503;
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.setHeader('Retry-After', '5');
        res.end('dist-not-ready');
      }
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

server.listen(port, '0.0.0.0', () => {
  console.log('[server] Kapitech public site listening on port ' + port);
});

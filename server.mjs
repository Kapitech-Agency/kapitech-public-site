import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('.', import.meta.url)));
const distDir = resolve(join(root, 'dist'));
const port = Number(process.env.PORT || 3000);

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

async function sendFile(res, filePath) {
  const extension = extname(filePath).toLowerCase();
  res.statusCode = 200;
  res.setHeader('Content-Type', contentTypes[extension] || 'application/octet-stream');
  createReadStream(filePath).pipe(res);
}

const server = createServer(async (req, res) => {
  try {
    if (!req.url || req.method === 'OPTIONS') {
      res.statusCode = req.method === 'OPTIONS' ? 204 : 400;
      res.end();
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
        await sendFile(res, candidate);
        return;
      }
    } catch {
      // Fall through to the SPA entry file.
    }

    const spaEntry = join(distDir, 'index.html');
    await stat(spaEntry);
    await sendFile(res, spaEntry);
  } catch (error) {
    console.error('[server] request failed:', error);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
});

server.listen(port, '0.0.0.0', () => {
  console.log('[server] Kapitech public site listening on port ' + port);
});

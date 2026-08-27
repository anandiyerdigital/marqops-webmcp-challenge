import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';

const root = new URL('.', import.meta.url).pathname;
const port = Number(process.env.PORT || 4173);
const types = { '.css': 'text/css', '.html': 'text/html', '.js': 'text/javascript' };

createServer((request, response) => {
  const requested = request.url === '/' ? '/index.html' : request.url.split('?')[0];
  const file = normalize(join(root, requested));
  if (!file.startsWith(root) || !existsSync(file) || !statSync(file).isFile()) {
    response.writeHead(404).end('Not found');
    return;
  }
  response.writeHead(200, {
    'Content-Type': types[extname(file)] || 'application/octet-stream',
    'Content-Security-Policy': "default-src 'self'; style-src 'self'; script-src 'self'; img-src 'self' data:; frame-ancestors 'none'",
    'X-Content-Type-Options': 'nosniff',
  });
  createReadStream(file).pipe(response);
}).listen(port, () => console.log(`MarqOps WebMCP demo: http://localhost:${port}`));


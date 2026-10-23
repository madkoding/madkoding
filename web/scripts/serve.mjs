#!/usr/bin/env node
// Servidor estático mínimo para previsualizar dist/ (sin dependencias). PORT=8080 por defecto.
import { createServer } from 'node:http';
import { createReadStream, existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = resolve(dirname(fileURLToPath(import.meta.url)), '../dist');
const port = Number(process.env.PORT || 8080);
// Aplica los headers de vercel.json para que la previsualización se comporte como producción (CSP incluida).
const rules = (JSON.parse(readFileSync(resolve(dist, '../vercel.json'), 'utf8')).headers || []).map((h) => ({
  re: new RegExp('^' + h.source.replace(/\(\.\*\)/g, '.*') + '$'),
  headers: Object.fromEntries(h.headers.map((x) => [x.key, x.value])),
}));
const headersFor = (path) => Object.assign({}, ...rules.filter((r) => r.re.test(path)).map((r) => r.headers));
const types = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml', '.txt': 'text/plain', '.xml': 'application/xml',
};

createServer((req, res) => {
  const path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^(\.\.[/\\])+/, '');
  let file = join(dist, path);
  if (!file.startsWith(dist)) return res.writeHead(403).end();
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
  if (!existsSync(file)) return res.writeHead(404, { 'content-type': 'text/plain' }).end('404');
  res.writeHead(200, { ...headersFor(path), 'content-type': types[extname(file)] || 'application/octet-stream' });
  createReadStream(file).pipe(res);
}).listen(port, () => console.log(`http://localhost:${port}`));

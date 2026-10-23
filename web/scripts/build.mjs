#!/usr/bin/env node
// Build estático sin framework:
//  1. esbuild empaqueta CSS + JS (three.js se carga aparte y bajo demanda).
//  2. Se renderiza index.html a partir de src/index.html + content/*.json.
//  3. Se copia public/ y se generan robots.txt y sitemap.xml.
// Salida: dist/ (outputDirectory de Vercel).
import { build } from 'esbuild';
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { icons } from './icons.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const readJson = (p) => JSON.parse(readFileSync(join(root, p), 'utf8'));

const site = readJson('content/site.json');
const projects = readJson('content/projects.json');
const ui = readJson('content/ui.json');
const LANGS = ['es', 'en'];

// URL pública: SITE_URL > dominio de producción de Vercel > content/site.json
const siteUrl = (
  process.env.SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '') ||
  site.url
).replace(/\/$/, '');

/* ------------------------------------------------------------------ helpers */
const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Texto bilingüe: ambos idiomas en el HTML, CSS muestra el activo (sin JS queda en español). */
const tr = (o) => LANGS.map((l) => `<span data-l="${l}">${esc(o[l] ?? o.es)}</span>`).join('');

/** Atributos bilingües: valor en español + JSON para que main.js los cambie al alternar idioma. */
const ia = (name, o) => `${name}="${esc(o.es)}" data-ia="${esc(JSON.stringify({ [name]: o }))}"`;

const icon = (name, cls = 'icon') => `<svg class="${cls}" aria-hidden="true" focusable="false"><use href="#i-${name}"/></svg>`;

const T = { ...ui, tagline: site.tagline, bio: site.bio };
const lookup = (path) => {
  const node = path.split('.').reduce((o, k) => o?.[k], T);
  if (!node || typeof node.es !== 'string') throw new Error(`Falta el texto "${path}" en content/`);
  return node;
};

/* ------------------------------------------------------------- bloques HTML */
const sprite = Object.entries(icons)
  .map(([id, { viewBox, body }]) => `<symbol id="i-${id}" viewBox="${viewBox}">${body}</symbol>`)
  .join('');

const socialsHtml = site.socials
  .map(
    (s) => `        <li class="reveal"><a class="panel social brand-${s.id}" data-fx href="${esc(s.url)}" target="_blank" rel="noopener" data-social="${s.id}">
          <span class="social__icon">${icon(s.icon)}</span>
          <span class="social__body">
            <span class="social__name">${esc(s.name)}<span class="live-badge" hidden>${tr(ui.socials.live)}</span></span>
            <span class="social__handle mono">${esc(s.handle)}</span>
            <span class="social__desc">${tr(s.desc)}</span>
          </span>
          <span class="social__arrow">${icon('arrow')}</span>
          <span class="sr-only">${tr(ui.socials.open)}</span>
        </a></li>`,
  )
  .join('\n');

const categories = ['all', ...new Set(projects.flatMap((p) => p.category))].filter(
  (c) => c === 'all' || ui.categories[c],
);
const filtersHtml = categories
  .map((c) => {
    const n = c === 'all' ? projects.length : projects.filter((p) => p.category.includes(c)).length;
    return `          <button class="chip" type="button" data-cat="${c}" aria-pressed="${c === 'all'}">${tr(ui.categories[c])}<small class="mono">${n}</small></button>`;
  })
  .join('\n');

// Destacados primero; el resto conserva el orden de content/projects.json (= orden del README).
const ordered = [...projects.filter((p) => p.featured), ...projects.filter((p) => !p.featured)];
const projectsHtml = ordered
  .map((p) => {
    const search = [p.name, ...p.tags, p.desc.es, p.desc.en, ...p.category].join(' ').toLowerCase();
    const kind = p.kind === 'site' ? ui.projects.site : ui.projects.github;
    return `        <li class="reveal${p.featured ? ' is-featured' : ''}" data-cat="${esc(p.category.join(' '))}" data-q="${esc(search)}"><a class="panel project" data-fx href="${esc(p.url)}" target="_blank" rel="noopener">
          <span class="project__top"><span class="project__kind mono kind--${p.kind}">${tr(kind)}</span>${p.featured ? `<span class="project__star mono">${icon('star')}${tr(ui.projects.featured)}</span>` : ''}</span>
          <span class="project__name">${esc(p.name)}${icon('arrow', 'icon project__arrow')}</span>
          <span class="project__desc">${tr(p.desc)}</span>
          ${p.tags.length ? `<span class="tags">${p.tags.map((t) => `<span class="tag mono">${esc(t)}</span>`).join('')}</span>` : ''}
        </a></li>`;
  })
  .join('\n');

const loreHtml = site.lore.es
  .map((_, i) => `          <p class="term__line"><span class="ps">&gt;</span> ${tr({ es: site.lore.es[i], en: site.lore.en[i] })}</p>`)
  .join('\n');

const jsonLd = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: site.name,
  url: `${siteUrl}/`,
  image: `${siteUrl}/img/avatar.webp`,
  description: site.description.es,
  sameAs: site.socials.map((s) => s.url),
}).replace(/</g, '\\u003c');

/* ----------------------------------------------------------------- assets */
rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });
if (existsSync(join(root, 'public'))) cpSync(join(root, 'public'), dist, { recursive: true });

const common = { absWorkingDir: root, minify: true, metafile: true, legalComments: 'none', logLevel: 'warning', target: ['es2020', 'chrome90', 'safari15', 'firefox90'] };

const init = await build({
  ...common,
  entryPoints: ['src/init.js'],
  bundle: true,
  format: 'iife',
  outdir: 'dist/assets',
  entryNames: '[name]-[hash]',
});

const app = await build({
  ...common,
  entryPoints: ['src/main.js', 'src/styles.css'],
  bundle: true,
  splitting: true,
  format: 'esm',
  outdir: 'dist/assets',
  entryNames: '[name]-[hash]',
  chunkNames: 'chunks/[name]-[hash]',
  external: ['/img/*'],
});

const outputOf = (meta, entry) => {
  const hit = Object.entries(meta.outputs).find(([, o]) => o.entryPoint === entry);
  if (!hit) throw new Error(`esbuild no generó ${entry}`);
  return '/' + hit[0].replace(/^dist\//, '');
};

const vars = {
  title: `${site.name} — VTuber, VR y software`,
  description: site.description.es,
  url: siteUrl,
  css: outputOf(app.metafile, 'src/styles.css'),
  mainJs: outputOf(app.metafile, 'src/main.js'),
  initJs: outputOf(init.metafile, 'src/init.js'),
  jsonld: jsonLd,
  twitch: site.twitchLogin,
  email: site.email,
  year: String(new Date().getFullYear()),
  roles: esc(JSON.stringify(site.roles)),
  total: String(projects.length),
  countTpl: esc(JSON.stringify(ui.projects.count)),
  toastMsg: esc(JSON.stringify({ ok: ui.contact.copied, fail: ui.contact.copyFail })),
};

/* ------------------------------------------------------------------ render */
// Variables que ya vienen escapadas o son JSON/rutas seguras.
const RAW = new Set(['jsonld', 'css', 'mainJs', 'initJs', 'roles', 'countTpl', 'toastMsg']);
let html = readFileSync(join(root, 'src/index.html'), 'utf8')
  .replace('<!--@sprite-->', sprite)
  .replace('<!--@socials-->', socialsHtml)
  .replace('<!--@filters-->', filtersHtml)
  .replace('<!--@projects-->', projectsHtml)
  .replace('<!--@lore-->', loreHtml)
  // {{t.ruta.attrs[:atributo]}} -> atributo bilingüe
  .replace(/\{\{t\.([\w.]+)\.attrs(?::([\w-]+))?\}\}/g, (_, path, attr = 'aria-label') => ia(attr, lookup(path)))
  // {{t.ruta}} -> texto bilingüe
  .replace(/\{\{t\.([\w.]+)\}\}/g, (_, path) => tr(lookup(path)))
  // {{variable}}
  .replace(/\{\{(\w+)\}\}/g, (_, k) => {
    if (!(k in vars)) throw new Error(`Variable {{${k}}} sin definir en build.mjs`);
    return RAW.has(k) ? vars[k] : esc(vars[k]);
  });

{ const m = html.match(/.{0,60}\{\{[\w.].{0,60}/); if (m) throw new Error('Placeholder sin resolver: ' + m[0]); }
writeFileSync(join(dist, 'index.html'), html);

writeFileSync(join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`);
writeFileSync(
  join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${siteUrl}/</loc></url>\n</urlset>\n`,
);

const kb = (p) => (readFileSync(join(dist, p.slice(1))).length / 1024).toFixed(1);
console.log(`build ok → dist/  (${siteUrl})`);
console.log(`  html ${kb('/index.html')} kB · css ${kb(vars.css)} kB · main ${kb(vars.mainJs)} kB · init ${kb(vars.initJs)} kB`);
for (const [file, o] of Object.entries(app.metafile.outputs)) {
  if (file.includes('chunks/')) console.log(`  chunk ${file.replace('dist/', '')} ${(o.bytes / 1024).toFixed(1)} kB (carga diferida)`);
}

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const load = (f) => JSON.parse(readFileSync(new URL(`../content/${f}.json`, import.meta.url), 'utf8'));
const site = load('site'), projects = load('projects'), ui = load('ui');

test('todos los textos tienen es y en', () => {
  const walk = (node, path) => {
    if (node && typeof node === 'object' && ('es' in node || 'en' in node)) {
      assert.ok(typeof node.es === 'string' && node.es, `${path}.es vacío`);
      assert.ok(typeof node.en === 'string' && node.en, `${path}.en vacío`);
    } else if (node && typeof node === 'object') {
      for (const [k, v] of Object.entries(node)) walk(v, `${path}.${k}`);
    }
  };
  walk(ui, 'ui');
  walk(site.socials, 'socials');
  projects.forEach((p) => walk(p.desc, `projects.${p.id}.desc`));
  assert.equal(site.lore.es.length, site.lore.en.length, 'lore: mismo número de líneas en ambos idiomas');
});

test('los proyectos tienen id único, URL https y categorías conocidas', () => {
  const ids = new Set();
  for (const p of projects) {
    assert.ok(!ids.has(p.id), `id duplicado ${p.id}`);
    ids.add(p.id);
    assert.match(p.url, /^https:\/\//);
    p.category.forEach((c) => assert.ok(ui.categories[c], `${p.id}: categoría desconocida ${c}`));
  }
});

test('las redes tienen URL https e icono', () => {
  for (const s of site.socials) assert.match(s.url, /^https:\/\//);
});

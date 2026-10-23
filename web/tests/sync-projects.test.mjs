import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseReadmeProjects, mergeProjects, inferCategories, stringify, README_PATH, PROJECTS_PATH } from '../scripts/sync-projects.mjs';

const md = `### Projects

<table><tr><td>

#### [Alpha](https://github.com/x/alpha)
[![License](https://img.shields.io/x)](https://x)

<img src="./a.svg" alt="a"/>

Autonomous **agent** in Go with [docs](https://d) and \`code\`.

\`Go\` \`AI Agents\`

</td></tr></table>

#### [Beta](https://beta.example.com)

Hardware thing with ESP32 firmware.

\`ESP32\` \`C\`

> See all repositories

### Tech Stack
#### [Ignored](https://example.com/ignored)
`;

test('parsea nombre, url, descripción limpia y tags', () => {
  const [a, b, ...rest] = parseReadmeProjects(md);
  assert.equal(rest.length, 0, 'no lee más allá de la sección Projects');
  assert.deepEqual(a, { name: 'Alpha', url: 'https://github.com/x/alpha', tags: ['Go', 'AI Agents'], en: 'Autonomous agent in Go with docs and code.' });
  assert.equal(b.name, 'Beta');
  assert.deepEqual(b.tags, ['ESP32', 'C']);
});

test('el merge conserva traducción, categorías y destacado; agrega y reporta', () => {
  const existing = [
    { id: 'alpha', name: 'Alpha', url: 'https://github.com/x/alpha', kind: 'github', featured: true, category: ['ai'], tags: [], desc: { es: 'Agente', en: 'old' } },
    { id: 'gone', name: 'Gone', url: 'https://github.com/x/gone', kind: 'github', category: [], tags: [], desc: { es: 'x', en: 'x' } },
  ];
  const { projects, added, orphaned } = mergeProjects(existing, parseReadmeProjects(md));
  const alpha = projects.find((p) => p.id === 'alpha');
  assert.equal(alpha.desc.es, 'Agente');
  assert.equal(alpha.desc.en, 'Autonomous agent in Go with docs and code.');
  assert.equal(alpha.featured, true);
  assert.deepEqual(alpha.category, ['ai']);
  assert.deepEqual(added, ['Beta']);
  const beta = projects.find((p) => p.id === 'beta');
  assert.equal(beta.kind, 'site');
  assert.equal(beta.needsTranslation, true);
  assert.deepEqual(beta.category, ['hardware']);
  assert.deepEqual(orphaned, ['Gone']);
});

test('inferCategories reconoce palabras clave', () => {
  assert.deepEqual(inferCategories('Rust LLM Git'), ['ai', 'systems']);
  assert.deepEqual(inferCategories('nothing here'), []);
});

test('stringify deja los arrays de strings en una línea', () => {
  assert.match(stringify([{ tags: ['a', 'b'] }]), /"tags": \["a", "b"\]/);
});

test('projects.json real está sincronizado con readme.source.md', () => {
  const md = readFileSync(README_PATH, 'utf8');
  const existing = JSON.parse(readFileSync(PROJECTS_PATH, 'utf8'));
  const { projects, added } = mergeProjects(existing, parseReadmeProjects(md));
  assert.deepEqual(added, [], 'hay proyectos nuevos: corre `npm run sync:projects`');
  assert.equal(stringify(projects), readFileSync(PROJECTS_PATH, 'utf8'));
});

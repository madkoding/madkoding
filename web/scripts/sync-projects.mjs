#!/usr/bin/env node
// Sincroniza content/projects.json con la sección "Projects" de readme.source.md.
//  - Proyectos nuevos en el README se agregan (con needsTranslation: true).
//  - Los existentes actualizan nombre, tags y descripción en inglés.
//  - Se conservan siempre: descripción en español, categorías, destacado y tipo.
//  - Los proyectos que ya no están en el README se conservan y se reportan.
// Uso: node scripts/sync-projects.mjs [--check]   (--check no escribe y sale 1 si hay cambios)
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
export const README_PATH = resolve(here, '../../readme.source.md');
export const PROJECTS_PATH = resolve(here, '../content/projects.json');

const stripMarkdown = (s) =>
  s
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();

/** Extrae los proyectos de la sección "### Projects" del README. */
export function parseReadmeProjects(md) {
  const start = md.indexOf('### Projects');
  if (start < 0) return [];
  const next = md.indexOf('\n### ', start + 5);
  const section = md.slice(start, next < 0 ? undefined : next);

  const heading = /^#### \[([^\]]+)\]\(([^)]+)\)[ \t]*$/gm;
  const found = [...section.matchAll(heading)];

  return found.map((m, i) => {
    const bodyEnd = i + 1 < found.length ? found[i + 1].index : section.length;
    const lines = section.slice(m.index + m[0].length, bodyEnd).split('\n').map((l) => l.trim());

    const tagLine = lines.find((l) => /^(`[^`]+`\s*)+$/.test(l));
    const tags = tagLine ? [...tagLine.matchAll(/`([^`]+)`/g)].map((t) => t[1]) : [];
    const descLine = lines.find((l) => /^[A-Za-z0-9]/.test(l) && !tagLine?.includes(l));

    return { name: m[1].trim(), url: m[2].trim(), tags, en: descLine ? stripMarkdown(descLine) : '' };
  });
}

const slug = (s) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const RULES = [
  ['ai', /\b(ai|llm|agent|agents|mcp|rag|graphrag|embeddings?|model|models)\b/i],
  ['systems', /\b(linux|go|rust|tui|kernel|shell|archiso|cli|btrfs|pty)\b/i],
  ['hardware', /\b(esp32|nrf\d*|firmware|pcb|vr|slimevr|iot|zephyr)\b/i],
  ['web', /\b(react|web|sso|webrtc|websocket|frontend|microfrontends?)\b/i],
];

export function inferCategories(text) {
  return RULES.filter(([, re]) => re.test(text)).map(([cat]) => cat);
}

/** Mezcla lo leído del README con el JSON existente. */
export function mergeProjects(existing, parsed) {
  const byUrl = new Map(existing.map((p) => [p.url, p]));
  const added = [];
  const projects = parsed.map((p) => {
    const prev = byUrl.get(p.url);
    if (prev) {
      byUrl.delete(p.url);
      return {
        ...prev,
        name: p.name,
        tags: p.tags.length ? p.tags : prev.tags,
        desc: { ...prev.desc, en: p.en || prev.desc?.en || '' },
      };
    }
    added.push(p.name);
    const host = new URL(p.url).hostname;
    return {
      id: slug(p.name),
      name: p.name,
      url: p.url,
      kind: host === 'github.com' ? 'github' : 'site',
      category: inferCategories(`${p.tags.join(' ')} ${p.en}`),
      tags: p.tags,
      desc: { es: p.en, en: p.en },
      needsTranslation: true,
    };
  });
  const orphaned = [...byUrl.values()];
  return { projects: [...projects, ...orphaned], added, orphaned: orphaned.map((p) => p.name) };
}

/** JSON con indentación de 2 espacios pero arrays de strings en una sola línea. */
export function stringify(data) {
  return (
    JSON.stringify(data, null, 2).replace(/\[\n\s+((?:"(?:[^"\\]|\\.)*",?\n\s*)+)\]/g, (_, inner) => {
      const items = inner.trim().replace(/,?\n\s*/g, ', ').replace(/, $/, '');
      return `[${items}]`;
    }) + '\n'
  );
}

function main() {
  const check = process.argv.includes('--check');
  const md = readFileSync(README_PATH, 'utf8');
  const existing = JSON.parse(readFileSync(PROJECTS_PATH, 'utf8'));
  const parsed = parseReadmeProjects(md);
  if (!parsed.length) {
    console.error('No se encontraron proyectos en readme.source.md (¿cambió el formato?).');
    process.exit(2);
  }
  const { projects, added, orphaned } = mergeProjects(existing, parsed);
  const next = stringify(projects);
  const changed = next !== readFileSync(PROJECTS_PATH, 'utf8');

  if (added.length) console.log(`+ nuevos (revisa traducción y categoría): ${added.join(', ')}`);
  if (orphaned.length) console.log(`! ya no están en el README (se conservan): ${orphaned.join(', ')}`);
  console.log(changed ? 'projects.json desactualizado.' : 'projects.json al día.');

  if (check) process.exit(changed ? 1 : 0);
  if (changed) writeFileSync(PROJECTS_PATH, next);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();

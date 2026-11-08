/**
 * Node-only contract checks for the UNMODIFIED v0.4 monolith.
 * Run: node --test tests/legacy/v04-source.test.mjs
 * A pass does not prove gameplay, accessibility, or deployed Pages works.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Script } from 'node:vm';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const read = (name) => readFileSync(resolve(root, name), 'utf8');
const html = read('index.html');
const worker = read('service-worker.js');
const manifest = JSON.parse(read('manifest.webmanifest'));
const workflow = read('.github/workflows/deploy-pages.yml');

test('legacy entry point: Arabic document, canvas, dialog, HUD and controls', () => {
  assert.match(html, /<html[^>]+lang="ar"[^>]+dir="rtl"/);
  for (const id of ['world', 'viewport', 'joy', 'stick', 'action', 'walk',
    'overlay', 'dialog', 'xp', 'complete', 'questTitle']) {
    assert.match(html, new RegExp('id="' + id + '"'), 'missing #' + id);
  }
  assert.match(html, /requestAnimationFrame\(tick\)/);
});

test('all embedded JS scripts parse (static syntax check, not browser execution)', () => {
  const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)];
  assert.ok(scripts.length >= 2, 'expected legacy inline code and data');
  scripts.forEach((match, index) => assert.doesNotThrow(
    () => new Script(match[1], { filename: 'index.html:inline-script-' + index }),
    'inline script ' + index + ' did not parse'
  ));
});

test('non-destructive legacy save key and default fields are present', () => {
  assert.match(html, /creative-quest-2d-v02/);
  for (const field of ['done', 'unlocked', 'xp', 'attempts', 'answers',
    'bossPhase', 'bossPhases', 'started']) {
    assert.match(html, new RegExp(field + ':'), 'missing old save field ' + field);
  }
  assert.match(html, /localStorage\.getItem\(STORAGE\)/);
  assert.match(html, /localStorage\.setItem\(STORAGE/);
});

test('test diagnostics present; diagnostic count is NOT pedagogical proof', () => {
  assert.match(html, /window\.CreativeQuestDiagnostics=/);
  assert.match(html, /getState:/);
  assert.match(html, /openLevel:/);
});

test('Pages links, PWA start and scope are relative to repository subpath', () => {
  assert.match(html, /href="\.\/manifest\.webmanifest"/);
  assert.match(html, /href="\.\/icon\.svg"/);
  assert.match(html, /register\('\.\/service-worker\.js'\)/);
  assert.equal(manifest.id, './');
  assert.equal(manifest.start_url, './index.html');
  assert.equal(manifest.scope, './');
  assert.ok(manifest.icons.every((i) => i.src.startsWith('./')));
  for (const url of ['./', './index.html', './manifest.webmanifest', './icon.svg']) {
    assert.ok(worker.includes("'" + url + "'"), 'not precached: ' + url);
  }
});

test('existing deploy workflow targets main and root', () => {
  assert.match(workflow, /branches:\s*\[main\]/);
  assert.match(workflow, /uses:\s*actions\/upload-pages-artifact@v3/);
  assert.match(workflow, /path:\s*\./);
  assert.match(workflow, /uses:\s*actions\/deploy-pages@v4/);
});

/* Known regressions are documented in qa/BASELINE.md instead of being
   silently waived or marked as passing source contract checks. */
/**
 * Expected-RED QA safety regressions for legacy v0.4.
 * Run: node --test tests/legacy/v04-safety-regressions.test.mjs
 * Both regressions are demonstrated with exact legacy source under isolated
 * Node/V8 fakes, so failure is intentional until the owning agent fixes code.
 * These do NOT claim a full browser or live Pages test.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const read = path => readFileSync(resolve(root, path), 'utf8');

test('QA-P1-001: Space key must NOT be prevented inside an answer textarea', () => {
  const src = read('index.html');
  const match = src.match(/window\.addEventListener\('keydown',e=>\{[\s\S]*?\}\);/);
  assert.ok(match, 'legacy handler missing; refresh test for modern input API');
  let keydown;
  const window = { addEventListener: (type, handler) => {
    if (type === 'keydown') keydown = handler;
  } };
  new Function('window', 'keys', 'mode', 'interact', 'closeDialog', match[0])(
    window, {}, 'dialog', () => {}, () => {}
  );
  assert.equal(typeof keydown, 'function');
  let defaultPrevented = false;
  keydown({
    key: ' ', target: { tagName: 'TEXTAREA' },
    preventDefault: () => { defaultPrevented = true; }
  });
  assert.equal(defaultPrevented, false,
    'P1: the key handler intercepts Space even when writing an Arabic challenge answer');
});

test('QA-P1-002: game SW activation must NOT delete other same-origin project caches', async () => {
  const src = read('service-worker.js');
  let activate;
  const self = { addEventListener: (type, fn) => {
    if (type === 'activate') activate = fn;
  }, clients: { claim: async () => {} } };
  const names = ['portfolio-cache-v1', 'creative-quest-adventure-v04', 'other-app-v2'];
  const deleted = [];
  const caches = {
    keys: async () => [...names],
    delete: async name => { deleted.push(name); return true; }
  };
  new Function('self', 'caches', src)(self, caches);
  assert.equal(typeof activate, 'function');
  let pending;
  activate({ waitUntil: promise => { pending = promise; } });
  await pending;
  assert.deepEqual(deleted, [],
    'P1: activating Creative Quest must not delete unrelated CacheStorage entries');
});


test('QA-P2-004: mobile viewport must not forbid user pinch zoom', () => {
  assert.doesNotMatch(read('index.html'), /<meta[^>]+name="viewport"[^>]+user-scalable=no/i,
    'Viewport forbids pinch zoom, making long Arabic text harder to enlarge');
});

test('QA-P2-004: animations must include reduced-motion opt-out', () => {
  const src = read('index.html');
  assert.match(src, /prefers-reduced-motion\s*:\s*reduce/,
    'Continuous visual motion has no CSS reduced-motion preference fallback');
});

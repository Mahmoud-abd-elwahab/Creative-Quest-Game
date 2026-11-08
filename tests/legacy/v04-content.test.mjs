/**
 * Authored v0.4 content integrity. Run: node --test tests/legacy/v04-content.test.mjs
 * Verifies structural validity, NOT pedagogy or semantic uniqueness.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const html = readFileSync(resolve(root, 'index.html'), 'utf8');
const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(m => m[1]);
assert.ok(scripts.length >= 6, 'Expected legacy v0.4 inline data; update test only with HQ-approved migration');
const data = runInNewContext(scripts.slice(0, 3).join('\n') +
  '\n({LEVELS, EXTRA_LEVELS, CAMPAIGN_LEVELS, BOSS_EXTRA, BOSSES_V4, ALL_ZONES})',
  {}, { timeout: 4000, filename: 'v04-content-data.js' });
const levels = [...data.LEVELS.map((l, i) => ({ ...l, n: i + 1, kind: 'legacy-write' })),
  ...data.EXTRA_LEVELS, ...data.CAMPAIGN_LEVELS];
const bosses = new Map([[10, { title: 'وحش الافتراضات' }],
  ...Object.entries(data.BOSS_EXTRA).map(([n, v]) => [Number(n), v]),
  ...Object.entries(data.BOSSES_V4).map(([n, v]) => [Number(n), v])]);
const norm = s => String(s || '').toLowerCase().normalize('NFKC')
  .replace(/[\u064b-\u065f\u0670\u0640]/g, '').replace(/[إأآ]/g, 'ا')
  .replace(/ى/g, 'ي').replace(/ة/g, 'ه')
  .replace(/[^\p{L}\p{N}]+/gu, ' ').trim().replace(/\s+/g, ' ');
const requireText = (value, context) =>
  assert.ok(typeof value === 'string' && value.trim().length > 3, context);

test('100 sequential distinct level numbers, 10 worlds and 10 Boss nodes', () => {
  assert.equal(data.LEVELS.length, 9);
  assert.equal(data.EXTRA_LEVELS.length, 18);
  assert.equal(data.CAMPAIGN_LEVELS.length, 63);
  assert.equal(bosses.size, 10);
  assert.equal(data.ALL_ZONES.length, 10);
  const ids = [...levels.map(x => x.n), ...bosses.keys()].sort((a, b) => a - b);
  assert.equal(ids.length, 100);
  assert.equal(new Set(ids).size, 100);
  assert.deepEqual(ids, Array.from({ length: 100 }, (_, i) => i + 1));
  for (let n = 10; n <= 100; n += 10) assert.ok(bosses.has(n));
});

test('nonempty content and no EXACT duplicated title, evidence or prompt', () => {
  const titles = new Set(), evidence = new Set(), questions = new Set();
  for (const l of levels) {
    requireText(l.title, 'missing title at ' + l.n);
    requireText(l.question || l.task, 'missing question at ' + l.n);
    assert.ok(Array.isArray(l.notes) && l.notes.length > 0, 'missing evidence at ' + l.n);
    l.notes.forEach(x => requireText(x, 'empty evidence at ' + l.n));
    for (const [value, set, type] of [
      [norm(l.title), titles, 'title'], [norm(l.notes.join(' ')), evidence, 'scenario'],
      [norm(l.question || l.task), questions, 'question']
    ]) {
      assert.ok(!set.has(value), 'exact duplicate ' + type + ' at ' + l.n);
      set.add(value);
    }
  }
  // Similar phrasing is not equivalent to meaningful educational variety.
});

test('all structured answer indices and classifications are valid', () => {
  const allowed = new Set(['legacy-write', 'select', 'pair', 'write',
    'classify', 'evidence', 'repair', 'forge']);
  const labels = new Set('OTDIBRCMASX'.split(''));
  const option = (l, items, answer, label) => {
    assert.ok(Array.isArray(items) && items.length >= 2, l.n + ' ' + label + ' has no choices');
    assert.ok(Number.isInteger(answer) && answer >= 0 && answer < items.length,
      l.n + ' ' + label + ' correct index out of range');
    assert.equal(new Set(items.map(norm)).size, items.length, l.n + ' duplicate choices');
  };
  for (const l of levels) {
    assert.ok(allowed.has(l.kind), 'unknown kind ' + l.kind);
    if (['select', 'repair'].includes(l.kind)) option(l, l.options, l.correct, l.kind);
    if (l.kind === 'pair') {
      assert.ok(l.groups?.length >= 2, 'missing pair at ' + l.n);
      l.groups.forEach((g, i) => option(l, g.options, g.correct, 'group ' + i));
    }
    if (l.kind === 'classify') {
      assert.ok(l.items?.length >= 2, 'missing classify at ' + l.n);
      l.items.forEach(item => {
        requireText(item.text, 'empty classify text at ' + l.n);
        assert.ok(labels.has(item.answer), l.n + ': unknown classify code ' + item.answer);
      });
    }
    if (l.kind === 'evidence') {
      assert.ok(l.correct?.length === 2 && new Set(l.correct).size === 2,
        'evidence requires two distinct answers at ' + l.n);
      l.correct.forEach(i => assert.ok(Number.isInteger(i) && i >= 0 && i < l.options.length,
        'evidence answer out of range at ' + l.n));
    }
    if (l.kind === 'forge') {
      assert.ok(l.steps?.length >= 2, 'missing steps at ' + l.n);
      l.steps.forEach((st, i) => option(l, st.options, st.correct, 'step ' + i));
    }
  }
});

test('all authored Boss data has legal answers and written rubrics', () => {
  for (const n of [20,30,40,50,60,70,80,90,100]) {
    const b = bosses.get(n);
    assert.ok(b, 'boss missing ' + n);
    for (const field of ['title', 'question', 'writing', 'sample'])
      requireText(b[field], 'boss ' + n + ' missing ' + field);
    assert.ok(b.notes?.length, 'boss ' + n + ' no evidence');
    assert.ok(b.checks?.length >= 2, 'boss ' + n + ' no rubric');
    assert.ok(Number.isInteger(b.correct) && b.correct >= 0 && b.correct < b.options.length,
      'boss ' + n + ' invalid answer index');
  }
});

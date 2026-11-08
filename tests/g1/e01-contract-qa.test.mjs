/**
 * Independent QA for integrated G1: compile actual code and exercise actual
 * authored E01 evaluator/save adapter. Does NOT invoke Playwright or Phaser.
 *
 * From checked-out integration PR:
 *   npm ci
 *   node --test tests/g1/e01-contract-qa.test.mjs
 * Deliberately expected RED for currently-unreachable PARTIAL interaction.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { dirname, resolve, join } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const shaHint = 'c976f084243a018a96595b88aaf7b5bbcf733b2f';
const content = JSON.parse(readFileSync(resolve(root, 'src/content/levels/obs-w1-e01-inspect-library.json'), 'utf8'));
const uiSource = readFileSync(resolve(root, 'src/ui/challenge-overlay.ts'), 'utf8');
const hostSource = readFileSync(resolve(root, 'dev/g1/play.ts'), 'utf8');
const temp = mkdtempSync(join(tmpdir(), 'cq-qa-g1-'));
const tsc = resolve(root, 'node_modules/.bin/tsc');
const compiled = spawnSync(tsc, [
  '--strict', '--skipLibCheck', '--target', 'ES2022',
  '--module', 'NodeNext', '--moduleResolution', 'NodeNext',
  '--lib', 'ES2022,DOM', '--rootDir', 'src', '--outDir', temp,
  'src/contracts/v1.ts', 'src/core/g1/challenge-catalog.ts',
  'src/adapters/g1/save-state.ts', 'src/core/g1/technical-fixture.ts',
  'src/core/g1/engine-bridge.ts'
], { cwd: root, encoding: 'utf8' });
if (compiled.status !== 0) {
  rmSync(temp, { force: true, recursive: true });
  throw new Error('G1 independent QA strict transpile failed (target baseline ' +
    shaHint + '): ' + compiled.stdout + compiled.stderr);
}
writeFileSync(join(temp, 'package.json'), '{"type":"module"}\n');
const { evaluateAuthoredChallenge, validateChallengeSpec } =
  await import(pathToFileURL(join(temp, 'core/g1/challenge-catalog.js')).href);
const { loadSave, commitStructuredReceipt } =
  await import(pathToFileURL(join(temp, 'adapters/g1/save-state.js')).href);
test.after(() => rmSync(temp, { force: true, recursive: true }));

const selected = (ids, id) => evaluateAuthoredChallenge(content, id, {
  mode: 'options', selectedIds: ids
}, 0);
const choice = key => 'W1E01_ACT_' + key;
const fixedTime = () => '2026-11-08T13:00:00.000Z';
const memory = (initial = {}) => {
  const raw = new Map(Object.entries(initial));
  return {
    raw,
    port: {
      getItem: key => raw.has(key) ? raw.get(key) : null,
      setItem: (key, value) => { raw.set(key, value); }
    }
  };
};

test('actual authored E01 schema and 2 distinct supported ways: narrative only', () => {
  assert.doesNotThrow(() => validateChallengeSpec(content));
  assert.equal(content.id, 'cq_obs_w01_e01_inspect_v1');
  assert.equal(content.slotId, 'OBS-W1-E01');
  for (const [name, picks] of [
    ['AB', [choice('A'), choice('B')]],
    ['AC', [choice('A'), choice('C')]]
  ]) {
    const result = selected(picks, 'qa-good-' + name);
    assert.equal(result.status, 'PASSED', name);
    assert.equal(result.trust, 'STRUCTURED_VERIFIED');
    assert.equal(result.narrativeCleared, true);
    assert.equal(result.masteryAwarded, false);
  }
});

test('2 partial, 2 unsupported, plus invalid IDs remain unpassed', () => {
  for (const [name, picks] of [
    ['partial-A', [choice('A')]], ['partial-B', [choice('B')]]
  ]) {
    const r = selected(picks, name);
    assert.equal(r.status, 'PARTIAL');
    assert.equal(r.narrativeCleared, false);
    assert.equal(r.masteryAwarded, false);
  }
  for (const [name, picks, error] of [
    ['bad-motive', [choice('A'), choice('E')], 'OBS-E01'],
    ['bad-overclaim', [choice('B'), choice('D')], 'OBS-E03']
  ]) {
    const r = selected(picks, name);
    assert.equal(r.status, 'TRY_AGAIN');
    assert.deepEqual(r.errorCodes, [error]);
    assert.equal(r.narrativeCleared, false);
  }
  assert.equal(selected([choice('A'), 'UNKNOWN'], 'unknown').status, 'TRY_AGAIN');
  assert.equal(selected([choice('A'), choice('A')], 'duplicate').status, 'TRY_AGAIN');
});

test('G1 block: UI must expose one-correct-option PARTIAL to the player', () => {
  // Real evaluator accepts a single correct option as PARTIAL. A fixed-count
  // submit guard prevents this path entirely. This test is expected RED on G1.
  assert.equal(content.validAnswerSets[0].length, 2);
  assert.doesNotMatch(uiSource, /\(count !== null && n !== count\)/,
    'P1 #46: current UI disables submit for n=1, making PARTIAL inaccessible');
});

test('no silent E02/E03 gameplay claims on staging entry', () => {
  assert.match(hostSource, /createChallengeCatalog\(\[content\]\)/);
  assert.match(hostSource, /nodes:\s*\[\{\s*id:\s*nodeId/);
  assert.doesNotMatch(hostSource, /obs-w1-e02|obs-w1-e03|OBS-W1-E02|OBS-W1-E03/);
});

test('legacy bytes and partial Boss are retained but not falsely mastered', () => {
  const legacy = JSON.stringify({
    done: [2], unlocked: 10, xp: 35, attempts: { '10': 2 },
    answers: { '1': 'old free text' }, bossPhase: 2,
    bossPhases: { '20': 1 }, started: true,
    unknownOriginalField: { keepMe: true }
  });
  const data = memory({ 'creative-quest-2d-v02': legacy });
  const initial = loadSave(data.port, fixedTime);
  assert.equal(initial.origin, 'legacy');
  assert.equal(initial.state.xpTotal, 35);
  assert.deepEqual(initial.state.bosses, {});
  assert.deepEqual(initial.state.masteryBySkill, {});
  assert.equal(data.raw.get('creative-quest-2d-v02'), legacy);
  assert.equal(data.raw.has('creative-quest-2d-v1'), false);
  const result = selected([choice('B'), choice('C')], 'qa-once');
  const first = commitStructuredReceipt(data.port, initial.state, result, 20, fixedTime);
  assert.equal(first.saved, true);
  assert.equal(first.duplicate, false);
  assert.equal(first.state.xpTotal, 55);
  assert.equal(first.state.receipts.length, 1);
  assert.equal(first.state.importedLegacy.snapshot.bossPhase, 2);
  assert.equal(data.raw.get('creative-quest-2d-v02'), legacy);
  const again = commitStructuredReceipt(data.port, first.state, result, 20, fixedTime);
  assert.equal(again.duplicate, true);
  assert.equal(again.state.xpTotal, 55);
  assert.equal(again.state.receipts.length, 1);
  const reloaded = loadSave(data.port, fixedTime);
  assert.equal(reloaded.origin, 'v1');
  assert.equal(reloaded.state.xpTotal, 55);
  assert.equal(reloaded.state.receipts.length, 1);
  assert.equal(data.raw.get('creative-quest-2d-v02'), legacy);
});

test('no XP on corrupt old save, corrupt v1 save, unavailable storage, or quota', () => {
  const invalidOld = '{ invalid JSON';
  const oldData = memory({ 'creative-quest-2d-v02': invalidOld });
  const oldLoaded = loadSave(oldData.port, fixedTime);
  assert.equal(oldLoaded.writable, false);
  assert.equal(oldData.raw.get('creative-quest-2d-v02'), invalidOld);
  assert.equal(oldData.raw.has('creative-quest-2d-v1'), false);
  const invalidNew = '{"schemaVersion":1,"xpTotal":999}';
  const v1Data = memory({ 'creative-quest-2d-v1': invalidNew });
  const v1Loaded = loadSave(v1Data.port, fixedTime);
  assert.equal(v1Loaded.writable, false);
  assert.equal(v1Data.raw.get('creative-quest-2d-v1'), invalidNew);
  assert.equal(loadSave({
    getItem: () => { throw new Error('disabled'); }, setItem: () => {}
  }, fixedTime).writable, false);
  const quota = memory();
  const quotaLoad = loadSave(quota.port, fixedTime);
  const quotaPort = { getItem: quota.port.getItem, setItem: () => {
    throw new Error('QuotaExceededError');
  } };
  const outcome = commitStructuredReceipt(quotaPort, quotaLoad.state,
    selected([choice('A'), choice('C')], 'quota'), 20, fixedTime);
  assert.equal(outcome.saved, false);
  assert.equal(outcome.state.xpTotal, 0);
  assert.equal(quota.raw.has('creative-quest-2d-v1'), false);
});

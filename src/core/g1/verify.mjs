/**
 * Repeatable Engine-owned G1 tests. Requires Node >=22, npm ci and Phaser 3.90.
 * Run: node src/core/g1/verify.mjs
 * Compiles ACTUAL source with strict TS into a temporary module directory.
 * Does not alter package.json, root tsconfig or QA-owned tests/.
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { existsSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
const temp = mkdtempSync(join(tmpdir(), 'cq-g1-engine-'));
const tsc = resolve(root, 'node_modules/.bin/tsc');
const exe = existsSync(tsc) ? tsc : 'tsc';
const types = [
  '--strict', '--skipLibCheck', '--pretty', 'false', '--target', 'ES2022',
  '--module', 'NodeNext', '--moduleResolution', 'NodeNext', '--lib', 'ES2022,DOM',
];
function compile(files, args) {
  const job = spawnSync(exe, [...types, ...args, ...files], { cwd: root, encoding: 'utf8' });
  if (job.status !== 0) throw Error('Strict TypeScript compile failed: ' + job.stdout + job.stderr);
}
const sourceFiles = [
  'src/contracts/v1.ts',
  'src/adapters/g1/save-state.ts',
  'src/core/g1/technical-fixture.ts',
  'src/core/g1/challenge-catalog.ts',
  'src/core/g1/engine-bridge.ts',
];
try {
  compile(sourceFiles, ['--rootDir', 'src', '--outDir', temp]);
  // Full scene compile checks Phaser types, even though browser automation is owned by HQ/QA.
  const sceneCheck = spawnSync(exe, [
    '--strict', '--skipLibCheck', '--pretty', 'false', '--target', 'ES2022',
    '--module', 'ESNext', '--moduleResolution', 'Bundler', '--lib', 'ES2022,DOM',
    '--noEmit', 'src/game/g1/observation-scene.ts',
  ], { cwd: root, encoding: 'utf8' });
  if (sceneCheck.status !== 0) throw Error('Phaser scene TS compile failed: ' + sceneCheck.stdout + sceneCheck.stderr);
  writeFileSync(join(temp, 'package.json'), '{"type":"module"}\n');
} catch (error) { rmSync(temp, { recursive: true, force: true }); throw error; }
const adapter = await import(pathToFileURL(join(temp, 'adapters/g1/save-state.js')).href);
const bridgeModule = await import(pathToFileURL(join(temp, 'core/g1/engine-bridge.js')).href);
const catalogModule = await import(pathToFileURL(join(temp, 'core/g1/challenge-catalog.js')).href);
const fixture = await import(pathToFileURL(join(temp, 'core/g1/technical-fixture.js')).href);
const { loadSave, validV1, parseLegacy, commitStructuredReceipt } = adapter;
const { G1EngineBridge } = bridgeModule;
const { createChallengeCatalog, evaluateAuthoredChallenge, validateChallengeSpec } = catalogModule;
const { DIAGNOSTIC_WORLD, DIAGNOSTIC_CHALLENGE_ID, DIAGNOSTIC_NODE_ID } = fixture;
const OLD = 'creative-quest-2d-v02', NEW = 'creative-quest-2d-v1';
const legacyText = JSON.stringify({
  done: [1, 2, 10, 30, 30], unlocked: 31, xp: 275, attempts: { '10': 4 }, answers: { '1': 'old text' },
  bossPhase: 2, bossPhases: { '20': 1 }, started: true, unknownField: { preserve: 'raw' },
});
class Store {
  constructor(values = {}) { this.map = new Map(Object.entries(values)); this.writes = []; this.failWrite = false; }
  getItem(key) { return this.map.get(key) ?? null; }
  setItem(key, text) {
    if (this.failWrite) throw Error('quota');
    this.writes.push(key);
    this.map.set(key, text);
  }
}
const make = (world = DIAGNOSTIC_WORLD, catalog) => {
  const storage = new Store({ [OLD]: legacyText });
  const game = new G1EngineBridge(world, storage, undefined, catalog);
  let position = { x: 600, y: 748 };
  game.bindPlayerPosition(() => position);
  const events = [];
  game.subscribe(event => events.push(event));
  let nextRequest = 0;
  const send = (type, properties = {}) => game.dispatch({
    type, requestId: 'req-' + ++nextRequest, ...properties,
  });
  return { storage, game, events, send, setPosition: p => { position = p; } };
};
test('legacy import retains exact original bytes and partial Boss history without pretending v1 mastery', () => {
  const store = new Store({ [OLD]: legacyText });
  const result = loadSave(store);
  assert.equal(result.origin, 'legacy');
  assert.equal(result.state.xpTotal, 275);
  assert.deepEqual(result.state.importedLegacy.snapshot.done, [1,2,10,30]);
  assert.equal(result.state.importedLegacy.snapshot.bossPhase, 2);
  assert.equal(result.state.importedLegacy.snapshot.bossPhases['20'], 1);
  assert.deepEqual(result.state.bosses, {});
  assert.deepEqual(result.state.masteryBySkill, {});
  assert.equal(store.getItem(OLD), legacyText);
  assert.deepEqual(store.writes, []);
});
test('corrupted legacy/v1 payloads never get replaced silently; no-progress starts fresh', () => {
  assert.equal(loadSave(new Store()).origin, 'fresh');
  assert.equal(loadSave(new Store({ [OLD]: '{no' })).origin, 'blocked');
  assert.equal(loadSave(new Store({ [OLD]: '{"done":"no"}' })).writable, false);
  const old = new Store({ [OLD]: legacyText, [NEW]: '{"schemaVersion":1,"xpTotal":999999}' });
  assert.equal(loadSave(old).origin, 'blocked');
  assert.deepEqual(old.writes, []);
  assert.equal(parseLegacy({ done: [1,1,0,101], xp: -1 }).xp, 0);
  assert.equal(validV1({ schemaVersion: 1, receipts: [] }), false);
});
test('scene-distance command is authoritative; pause/close/resume acknowledgments have request IDs', () => {
  const { game, events, send, setPosition } = make();
  send('interact.request', { nodeId: DIAGNOSTIC_NODE_ID });
  assert.equal(game.snapshot().paused, false, 'remote interaction forbidden');
  setPosition({ x: 600, y: 280 });
  send('interact.request', { nodeId: DIAGNOSTIC_NODE_ID });
  assert.equal(game.snapshot().openChallengeId, DIAGNOSTIC_CHALLENGE_ID);
  assert.deepEqual(events.map(e => e.type), ['engine.paused', 'dialog.opened']);
  send('engine.resume.request');
  assert.equal(game.snapshot().paused, true, 'cannot resume below open dialog');
  const beforeClose = events.length;
  send('dialog.close.request');
  assert.equal(game.snapshot().paused, true, 'closing must NOT resume movement');
  assert.equal(game.snapshot().openChallengeId, undefined);
  assert.deepEqual(events.slice(beforeClose).map(e => e.type), ['dialog.closed'],
    'NO early engine.resumed on close request');
  const closeRequestId = events.at(-1).requestId;
  send('interact.request', { nodeId: DIAGNOSTIC_NODE_ID });
  assert.equal(events.at(-1).requestId, closeRequestId, 'no new challenge until resume ack');
  assert.equal(game.snapshot().paused, true);
  const beforeResume = events.length;
  send('engine.resume.request');
  assert.equal(game.snapshot().paused, false, 'movement may resume only on explicit resume command');
  assert.deepEqual(events.slice(beforeResume).map(e => e.type), ['engine.resumed']);
  assert.notEqual(events.at(-1).requestId, closeRequestId,
    'resume acknowledgement must be correlated to its OWN request ID');
  game.destroy();
  assert.equal(game.canInteract(DIAGNOSTIC_NODE_ID), false);
});
test('hints, wrong, partial, retry and text do not reward; verified selection grants exactly once', () => {
  const { game, events, send, setPosition, storage } = make();
  setPosition({ x: 600, y: 275 });
  send('interact.request', { nodeId: DIAGNOSTIC_NODE_ID });
  send('challenge.hint', { challengeId: DIAGNOSTIC_CHALLENGE_ID });
  assert.equal(events.at(-1).result.trust, 'NOT_ASSESSED');
  assert.equal(events.at(-1).result.hintCount, 1);
  const answer = selectedIds => ({ mode: 'options', selectedIds });
  send('challenge.submit', { challengeId: DIAGNOSTIC_CHALLENGE_ID, answer: answer(['assumed-motive']) });
  assert.equal(events.at(-1).result.status, 'TRY_AGAIN');
  send('challenge.submit', { challengeId: DIAGNOSTIC_CHALLENGE_ID, answer: answer(['visited']) });
  assert.equal(events.at(-1).result.status, 'PARTIAL');
  send('challenge.submit', { challengeId: DIAGNOSTIC_CHALLENGE_ID, answer: { mode: 'text', text: 'anything', selfReviewed: true } });
  assert.equal(events.at(-1).result.trust, 'NOT_ASSESSED');
  assert.equal(storage.getItem(NEW), null);
  send('challenge.submit', { challengeId: DIAGNOSTIC_CHALLENGE_ID, answer: answer(['visited','returned']) });
  assert.equal(events.at(-2).result.status, 'PASSED');
  assert.equal(events.at(-1).type, 'reward.committed');
  assert.equal(game.snapshot().xpTotal, 295);
  assert.equal(storage.getItem(OLD), legacyText);
  send('challenge.submit', { challengeId: DIAGNOSTIC_CHALLENGE_ID, answer: answer(['visited','returned']) });
  assert.equal(events.filter(e => e.type === 'reward.committed').length, 1);
  assert.equal(game.snapshot().xpTotal, 295);
  assert.equal(storage.writes.every(key => key === NEW), true);
  send('dialog.close.request');
  const recovered = new G1EngineBridge(DIAGNOSTIC_WORLD, storage);
  assert.equal(recovered.saveHealth.origin, 'v1');
  assert.equal(recovered.snapshot().xpTotal, 295);
  assert.equal(loadSave(storage).state.receipts.length, 1);
});
test('failed write does not mint in-memory XP and never overwrites legacy', () => {
  const { game, storage, send, events, setPosition } = make();
  setPosition({ x: 600, y: 260 });
  storage.failWrite = true;
  send('interact.request', { nodeId: DIAGNOSTIC_NODE_ID });
  send('challenge.submit', { challengeId: DIAGNOSTIC_CHALLENGE_ID, answer: { mode: 'options', selectedIds: ['visited', 'returned'] } });
  assert.equal(game.snapshot().xpTotal, 275);
  assert.equal(events.at(-1).type, 'save.failed');
  assert.equal(storage.getItem(OLD), legacyText);
  assert.equal(storage.getItem(NEW), null);
});
test('receipt validation rejects arbitrary mastery, corrupt XP and independent duplicate receipts', () => {
  const { storage } = make();
  const state = loadSave(storage).state;
  const result = fixture.evaluateTechnicalFixture(DIAGNOSTIC_CHALLENGE_ID, 'fixed-attempt', { mode: 'options', selectedIds: ['visited','returned'] }, 0);
  const bad = { ...result, masteryAwarded: true };
  assert.equal(commitStructuredReceipt(storage, state, bad, 20).saved, false);
  assert.equal(commitStructuredReceipt(storage, { ...state, xpTotal: 200 }, result, 20).saved, false);
  const receipt = commitStructuredReceipt(storage, state, result, 20);
  assert.equal(receipt.saved, true);
  assert.equal(receipt.duplicate, false);
  assert.equal(commitStructuredReceipt(storage, receipt.state, result, 20).duplicate, true);
});

/** Synthetic contract-shaped mirrors of Content #36 IDs; NOT copied campaign/learning prose.
 * The authored E01/E02/E03 JSON must be injected by HQ after Content PR acceptance. */
function sampleChallenge(id, mode, validAnswerSets, errors = {}) {
  const ids = [...new Set(validAnswerSets.flat().concat(Object.keys(errors)))];
  return {
    schemaVersion: 1, id, slotId: id, scenarioId: 'fixture-' + id, worldId: 'observation',
    primarySkill: 'OBS', secondarySkills: [], difficultyBand: 1, cognitiveOperation: 'structured-fixture',
    interaction: mode === 'order' ? 'arrange' : 'inspect', responseMode: mode,
    industry: 'fictional', audience: 'fictional', situation: 'fictional records',
    objective: 'Practice evidence choice', productTruths: [], prompt: 'Select records',
    evidence: [{ id: 'REC-A', text: 'Example fictional record', type: 'record', source: 'fictional' }],
    options: ids.map(opt => ({ id: opt, text: opt, ...(errors[opt] ? { errorCode: errors[opt] } : {}) })),
    validAnswerSets, rubricVersion: 'OBS@1.1',
    rubric: [{ id: 'R-OBS-CLASS', weight: 60 }, { id: 'R-OBS-TRACE', weight: 40 }],
    feedbackByErrorCode: { 'OBS-E01': 'Unsupported assumption.', PARTIAL: 'Still missing a clue.',
      SUCCESS: 'Evidence supported.', 'OBS-E07': 'Wrong sequence.' },
    hintTiers: ['Authored hint tier one'], novelty: { fingerprint: 'fixture-fingerprint-' + id,
      cognitiveSignature: 'fixture-signature-' + id },
  };
}
const E01 = sampleChallenge('cq_obs_w01_e01_inspect_v1', 'multi-select', [
  ['W1E01_ACT_A','W1E01_ACT_B'], ['W1E01_ACT_A','W1E01_ACT_C'], ['W1E01_ACT_B','W1E01_ACT_C'],
], { W1E01_ACT_E: 'OBS-E01' });
const E02 = sampleChallenge('cq_obs_w01_e02_connect_v1', 'single-select', [
  ['W1E02_LINK_LOG'], ['W1E02_LINK_CALL'],
], { W1E02_LINK_MOTIVE: 'OBS-E01' });
const E03 = sampleChallenge('cq_obs_w01_e03_arrange_v1', 'order', [
  ['W1E03_STEP_A0','W1E03_STEP_A1','W1E03_STEP_B0','W1E03_STEP_B1','W1E03_SCOPE'],
  ['W1E03_STEP_B0','W1E03_STEP_B1','W1E03_STEP_A0','W1E03_STEP_A1','W1E03_SCOPE'],
], { W1E03_DISTRACTOR_CLAIM: 'OBS-E01' });
test('authored ChallengeSpec catalog fail-closed validation; no duplicate/unknown options', () => {
  assert.throws(() => createChallengeCatalog([E01,E01]), /Duplicate/);
  assert.throws(() => validateChallengeSpec({ ...E01, validAnswerSets: [['nonexistent']] }), /answer-set/);
  assert.throws(() => validateChallengeSpec({ ...E01, rubric: [{ id: 'R-OBS-CLASS', weight: 90 }] }), /rubric/);
  assert.throws(() => validateChallengeSpec({ ...E02, validAnswerSets: [['W1E02_LINK_LOG','W1E02_LINK_CALL']] }), /single-select/);
  const catalog = createChallengeCatalog([E01,E02,E03]);
  assert.equal(catalog(E03.id).id, E03.id);
  assert.equal(catalog('missing'), undefined);
});
test('E01 multi-select: multiple valid routes, partial, error code, extra/duplicate IDs', () => {
  const evaluate = picks => evaluateAuthoredChallenge(E01,'select-req', { mode:'options', selectedIds:picks }, 0);
  assert.equal(evaluate(['W1E01_ACT_A']).status, 'PARTIAL');
  assert.equal(evaluate(['W1E01_ACT_A', 'W1E01_ACT_E']).errorCodes[0], 'OBS-E01');
  assert.equal(evaluate(['W1E01_ACT_A','W1E01_ACT_B']).status, 'PASSED');
  assert.equal(evaluate(['W1E01_ACT_C','W1E01_ACT_B']).status, 'PASSED');
  assert.equal(evaluate(['W1E01_ACT_A','W1E01_ACT_B','W1E01_ACT_C']).status, 'TRY_AGAIN');
  assert.equal(evaluate(['W1E01_ACT_A','W1E01_ACT_A']).status, 'TRY_AGAIN');
  assert.equal(evaluate(['missing']).status, 'TRY_AGAIN');
  assert.equal(evaluate(['W1E01_ACT_A','W1E01_ACT_B']).masteryAwarded, false);
});
test('E02 accepts both authored single-select links but not motives/two selections', () => {
  const evalLink = picks => evaluateAuthoredChallenge(E02, 'single-req',
    { mode:'options', selectedIds:picks }, 1);
  assert.equal(evalLink(['W1E02_LINK_LOG']).status, 'PASSED');
  assert.equal(evalLink(['W1E02_LINK_CALL']).status, 'PASSED');
  assert.equal(evalLink(['W1E02_LINK_MOTIVE']).status, 'TRY_AGAIN');
  assert.equal(evalLink(['W1E02_LINK_LOG','W1E02_LINK_CALL']).status, 'TRY_AGAIN');
});
test('E03 ordering: complete alternatives pass; partial prefix and misorder fail safely', () => {
  const evaluate = picks => evaluateAuthoredChallenge(E03,'order-req',
    { mode:'order', orderedIds:picks }, 0);
  assert.equal(evaluate(['W1E03_STEP_A0','W1E03_STEP_A1']).status, 'PARTIAL');
  assert.equal(evaluate(['W1E03_STEP_A1','W1E03_STEP_A0']).status, 'TRY_AGAIN');
  assert.equal(evaluate(E03.validAnswerSets[0]).status, 'PASSED');
  assert.equal(evaluate(E03.validAnswerSets[1]).status, 'PASSED');
  assert.equal(evaluate([...E03.validAnswerSets[0].slice(0,-1), 'W1E03_DISTRACTOR_CLAIM']).errorCodes[0], 'OBS-E01');
  assert.equal(evaluateAuthoredChallenge(E03,'bad-mode',{ mode:'text', text:'I think',selfReviewed:true },0).trust,
    'NOT_ASSESSED');
});
test('real W01 node → authored catalog → assessment → one receipt → close-paused → resume → reload', () => {
  const catalog = createChallengeCatalog([E01,E02,E03]);
  const world = { ...DIAGNOSTIC_WORLD, nodes: [{
    id: 'w01-library-clue', kind: 'clue', position: { x: 600, y: 260 },
    radius: 105, challengeId: E01.id,
  }] };
  const { game, storage, events, send, setPosition } = make(world, catalog);
  setPosition({ x: 600, y: 258 });
  assert.equal(game.getChallengeSpec(E01.id).id, E01.id);
  send('interact.request', { nodeId: 'w01-library-clue' });
  assert.equal(events.at(-1).type, 'dialog.opened');
  assert.equal(events.at(-1).challengeId, E01.id);
  send('challenge.hint', { challengeId: E01.id });
  assert.equal(events.at(-1).result.feedback, 'Authored hint tier one');
  send('challenge.submit', { challengeId: E01.id, answer: { mode:'options', selectedIds:['W1E01_ACT_A'] } });
  assert.equal(events.at(-1).result.status, 'PARTIAL');
  send('challenge.submit', { challengeId: E01.id,
    answer: { mode:'options', selectedIds:['W1E01_ACT_A','W1E01_ACT_B'] } });
  assert.equal(events.at(-1).type, 'reward.committed');
  assert.equal(game.snapshot().xpTotal, 295);
  send('dialog.close.request');
  assert.equal(game.snapshot().paused, true, 'close ACK must retain movement lock');
  assert.equal(events.at(-1).type, 'dialog.closed');
  send('engine.resume.request');
  assert.equal(game.snapshot().paused, false);
  const reloaded = new G1EngineBridge(world, storage, undefined, catalog);
  assert.equal(reloaded.snapshot().xpTotal, 295);
  assert.equal(storage.getItem(OLD), legacyText);
  assert.equal(JSON.parse(storage.getItem(NEW)).receipts[0].challengeId, E01.id);
  assert.equal(events.filter(e => e.type === 'reward.committed').length, 1);
});
test('unregistered authored challenge cannot open or fallback to diagnostic validator', () => {
  const world = { ...DIAGNOSTIC_WORLD, nodes: [{
    id: 'unloaded-node', kind: 'clue', position: { x: 600, y: 260 },
    radius: 105, challengeId: 'missing-authored',
  }] };
  const { game, events, send, setPosition } = make(world);
  setPosition({ x: 600, y: 260 });
  send('interact.request', { nodeId:'unloaded-node' });
  assert.equal(game.snapshot().paused, false);
  assert.equal(events.length, 0);
});

process.on('exit', () => rmSync(temp, { recursive: true, force: true }));

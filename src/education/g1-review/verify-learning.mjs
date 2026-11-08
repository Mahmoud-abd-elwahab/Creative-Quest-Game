#!/usr/bin/env node
/**
 * Issue #45 — independent learning-owner fixture checks.
 * Run: node src/education/g1-review/verify-learning.mjs [--strict-diagnostic]
 * No external packages. Reads integrated authored JSON, learning manifest and
 * legacy inventory. DOES NOT import/execute Engine TypeScript or score free prose.
 * Reported finite outcome is an independent reference implementation following
 * the current challenge-catalog.ts authored-option rules. Browser QA is separate.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
import assert from 'node:assert/strict';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
const read = rel => readFileSync(resolve(ROOT, rel), 'utf8');
const json = rel => JSON.parse(read(rel));
const slots = json('docs/learning/LEARNING-SLOTS.v1.json').slots;
const map = [
  ['E01','obs-w1-e01-inspect-library.json','inspect','multi-select',1,1],
  ['E02','obs-w1-e02-connect-nursery.json','connect','single-select',1,2],
  ['E03','obs-w1-e03-arrange-cinema.json','arrange','order',2,3]
];
const specs = Object.fromEntries(map.map(([short, file]) =>
  [short, json('src/content/levels/' + file)]));
const cases = {
  E01: {
    supported: [['W1E01_ACT_A','W1E01_ACT_B'],['W1E01_ACT_B','W1E01_ACT_C']],
    partial: [['W1E01_ACT_A'],['W1E01_ACT_A','W1E01_ACT_D']],
    unsupported: [['W1E01_ACT_D','W1E01_ACT_E'],['W1E01_ACT_E','W1E01_ACT_F']]
  },
  E02: {
    supported: [['W1E02_LINK_LOG'],['W1E02_LINK_CALL']],
    partial: [['W1E02_LINK_RECEIPT'],['W1E02_LINK_CARD']],
    unsupported: [['W1E02_LINK_OTHER'],['W1E02_LINK_MOTIVE']]
  },
  E03: {
    supported: [
      ['W1E03_STEP_A0','W1E03_STEP_A1','W1E03_STEP_B0','W1E03_STEP_B1','W1E03_SCOPE'],
      ['W1E03_STEP_B0','W1E03_STEP_B1','W1E03_STEP_A0','W1E03_STEP_A1','W1E03_SCOPE']
    ],
    partial: [
      ['W1E03_STEP_A0','W1E03_STEP_A1','W1E03_SCOPE'],
      ['W1E03_STEP_B0','W1E03_STEP_B1','W1E03_STEP_A0','W1E03_STEP_A1']
    ],
    unsupported: [
      ['W1E03_STEP_A1','W1E03_STEP_A0','W1E03_STEP_B1','W1E03_STEP_B0','W1E03_DISTRACTOR_CLAIM'],
      ['W1E03_STEP_A0','W1E03_STEP_B1','W1E03_STEP_B0','W1E03_STEP_A1','W1E03_DISTRACTOR_CLAIM']
    ]
  }
};
let invariantCount = 0;
function invariant(condition, message) {
  assert.ok(condition, message);
  invariantCount += 1;
}
/** Deliberately a separate finite reference model, NOT engine execution. */
function referenceStatus(spec, selected) {
  const order = spec.responseMode === 'order';
  const valid = spec.validAnswerSets;
  const equal = (a,b) => a.length === b.length && a.every((x,i) =>
    order ? x === b[i] : b.includes(x));
  const prefix = (a,b) => a.length <= b.length && a.every((x,i) => x === b[i]);
  const subset = (a,b) => a.every(x => b.includes(x));
  if (selected.some(id => spec.options.find(o => o.id === id)?.errorCode)) return 'TRY_AGAIN';
  if (valid.some(set => equal(selected,set))) return 'PASSED';
  if (valid.some(set => selected.length < set.length &&
    (order ? prefix(selected,set) : subset(selected,set)))) return 'PARTIAL';
  return 'TRY_AGAIN';
}

for (const [key, _file, interaction, mode, band, legacy] of map) {
  const spec = specs[key], slot = slots.find(x => x.slotId === spec.slotId);
  invariant(Boolean(slot), key + ' slot missing');
  invariant(spec.rubric.length === Object.keys(slot.weights).length &&
    spec.rubric.every(r => slot.weights[r.id] === r.weight), key + ' rubric mismatch');
  invariant(spec.rubric.reduce((sum,r) => sum + r.weight,0) === 100,
    key + ' rubric sum != 100');
  invariant(spec.hintTiers.length === 4, key + ' hints != 4');
  invariant(new Set(spec.evidence.map(e => e.id)).size === spec.evidence.length,
    key + ' duplicate evidence ID');
  invariant(spec.validAnswerSets.every(set => set.every(id =>
    spec.options.some(o => o.id === id))), key + ' unknown answer ID');
  invariant(spec.interaction === interaction && spec.responseMode === mode &&
    spec.difficultyBand === band && spec.legacyLevelId === legacy,
    key + ' wrong cognitive slot / mode / legacy mapping');
}
invariant(new Set(Object.values(specs).map(s => s.cognitiveOperation)).size === 3,
  'three different cognitive operation signatures required');
invariant(new Set(Object.values(specs).flatMap(s => s.options.map(o => o.id))).size ===
  Object.values(specs).reduce((n,s) => n + s.options.length, 0),
  'cross-case option ID collision');
invariant(read('docs/learning/LEGACY-100-INVENTORY.md').split('\n')
  .filter(line => /^\|\s*\d+\s*\|/.test(line)).length === 100,
  '100 legacy inventory rows required');

const results = [], mismatchedPartial = [];
for (const [key, labels] of Object.entries(cases)) {
  for (const [semantic, paths] of Object.entries(labels)) {
    for (const [i, path] of paths.entries()) {
      const observed = referenceStatus(specs[key], path);
      invariant(semantic === 'supported' ? observed === 'PASSED' : observed !== 'PASSED',
        `${key} ${semantic} #${i + 1}: surprising finite pass ${observed}`);
      const trial = { key, semantic, index: i + 1, finiteStatus: observed };
      results.push(trial);
      if (semantic === 'partial' && observed !== 'PARTIAL') mismatchedPartial.push(trial);
    }
  }
}
assert.equal(results.length, 18);
// Diagnostic count is intentionally NOT locked: fixes should reduce it to zero.
console.log(JSON.stringify({
  test: 'Issue45 finite-source owner review (not Engine runtime, not semantic AI)',
  invariantsPassed: invariantCount,
  trialPaths: results.length,
  supportedAccepted: results.filter(x => x.semantic==='supported' && x.finiteStatus==='PASSED').length,
  unsupportedRejected: results.filter(x => x.semantic==='unsupported' && x.finiteStatus!=='PASSED').length,
  partialNotPassed: results.filter(x => x.semantic==='partial' && x.finiteStatus!=='PASSED').length,
  partialStatusMismatches: mismatchedPartial,
  educationalSignoff: 'CHANGES_REQUIRED',
}, null, 2));
if (process.argv.includes('--strict-diagnostic') && mismatchedPartial.length) {
  console.error('EXPECTED RED diagnostic: semantic-partial cases not all classified as PARTIAL.');
  process.exitCode = 1;
}

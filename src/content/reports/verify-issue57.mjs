#!/usr/bin/env node
/**
 * #57 content-owned regression/reference probe. Run:
 *   node src/content/reports/verify-issue57.mjs
 *   node src/content/reports/verify-issue57.mjs --strict-partial
 * Does not execute Engine TypeScript or browser UI; exact finite-rule reproduction
 * plus explicit expected diagnostic gaps. Strict mode MUST be RED until
 * cross-owner pair/match evaluation exists.
 */
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
const read = name => readFileSync(join(root, name), 'utf8');
const json = name => JSON.parse(read(name));
const sources = {
  E01: json('src/content/levels/obs-w1-e01-inspect-library.json'),
  E02: json('src/content/levels/obs-w1-e02-connect-nursery.json'),
  E03: json('src/content/levels/obs-w1-e03-arrange-cinema.json')
};
const learning = json('docs/learning/LEARNING-SLOTS.v1.json');
assert.equal(learning.version, 'OBS-W1-SLOTS@1.1-draft');
const slots = new Map(learning.slots.map(s => [s.slotId,s]));
const EXPECTED = [
  ['E01','inspect','multi-select',1], ['E02','connect','single-select',1], ['E03','arrange','order',2]
];
const trial = (id, tag, selected, semantic, expectedFinite, decision, reason) =>
  ({ id, tag, selected, semantic, expectedFinite, decision, reason });

const cases = [
  trial('E01','S1',['W1E01_ACT_A','W1E01_ACT_B'],'SUPPORTED','PASSED','ACCEPT','Two independent receipt comments'),
  trial('E01','S2',['W1E01_ACT_B','W1E01_ACT_C'],'SUPPORTED','PASSED','ACCEPT','Different pair, same evidence rule'),
  trial('E01','P1',['W1E01_ACT_A'],'INCOMPLETE','PARTIAL','RETRY_NO_REWARD','One trace, needs a second'),
  trial('E01','P2',['W1E01_ACT_A','W1E01_ACT_D'],'MIXED_UNSUPPORTED','TRY_AGAIN','REJECT_OVERREACH','One trace + unsupported neighborhood-wide claim; NOT partial final answer'),
  trial('E01','U1',['W1E01_ACT_D','W1E01_ACT_E'],'UNSUPPORTED','TRY_AGAIN','REJECT_OVERREACH','Population extrapolation plus invented boredom'),
  trial('E01','U2',['W1E01_ACT_E','W1E01_ACT_F'],'UNSUPPORTED','TRY_AGAIN','REJECT_INFERENCE','Unknown motive and universal completion claim'),
  trial('E02','S1',['W1E02_LINK_LOG'],'SUPPORTED','PASSED','ACCEPT_SCAFFOLD_ONLY','Inquiry log with same receipt, question, later date'),
  trial('E02','S2',['W1E02_LINK_CALL'],'SUPPORTED','PASSED','ACCEPT_SCAFFOLD_ONLY','Recorded call is independent sufficient trace'),
  trial('E02','P1',['W1E02_LINK_RECEIPT'],'RELEVANT_INSUFFICIENT','TRY_AGAIN','RETRY_PROVENANCE','Purchase log does not establish follow-up question'),
  trial('E02','P2',['W1E02_LINK_CARD'],'RELEVANT_INSUFFICIENT','TRY_AGAIN','RETRY_PROVENANCE','Generic instructions lack identified customer/event'),
  trial('E02','U1',['W1E02_LINK_OTHER'],'UNSUPPORTED','TRY_AGAIN','REJECT_WRONG_PERSON','Wrong receipt and different plant'),
  trial('E02','U2',['W1E02_LINK_MOTIVE'],'UNSUPPORTED','TRY_AGAIN','REJECT_INFERRED_MOTIVE','Fear is not stated anywhere in evidence'),
  trial('E03','S1',['W1E03_STEP_A0','W1E03_STEP_A1','W1E03_STEP_B0','W1E03_STEP_B1','W1E03_SCOPE'],'SUPPORTED','PASSED','ACCEPT','Two same-ID ordered updates, scoped conclusion'),
  trial('E03','S2',['W1E03_STEP_B0','W1E03_STEP_B1','W1E03_STEP_A0','W1E03_STEP_A1','W1E03_SCOPE'],'SUPPORTED','PASSED','ACCEPT','Pair order reversed but valid'),
  trial('E03','P1',['W1E03_STEP_A0','W1E03_STEP_A1','W1E03_SCOPE'],'INCOMPLETE_NONPREFIX','TRY_AGAIN','NEEDS_ENGINE_PAIR_PARTIAL','One complete pair and bounded statement, missing other pair; finite prefix cannot identify it'),
  trial('E03','P2',['W1E03_STEP_B0','W1E03_STEP_B1','W1E03_STEP_A0','W1E03_STEP_A1'],'INCOMPLETE_PREFIX','PARTIAL','RETRY_NO_REWARD','Both paired, missing final bounded conclusion'),
  trial('E03','U1',['W1E03_STEP_A1','W1E03_STEP_A0','W1E03_STEP_B1','W1E03_STEP_B0','W1E03_DISTRACTOR_CLAIM'],'UNSUPPORTED','TRY_AGAIN','REJECT_CAUSAL_LEAP','Reverses both within-ID changes and generalizes'),
  trial('E03','U2',['W1E03_STEP_A0','W1E03_STEP_B1','W1E03_STEP_B0','W1E03_STEP_A1','W1E03_DISTRACTOR_CLAIM'],'UNSUPPORTED','TRY_AGAIN','REJECT_WRONG_PAIR','Cross-ID mismatch and invented motivation')
];

/** Mirror documented finite status branching in src/core/g1/challenge-catalog.ts.
 * This is a reference projection, NOT a direct test/import of Engine code. */
function finiteStatus(spec, selected) {
  const order = spec.responseMode === 'order';
  const options = new Map(spec.options.map(opt => [opt.id, opt]));
  if (!selected.length || new Set(selected).size !== selected.length ||
      selected.some(id => !options.has(id)) ||
      (spec.responseMode === 'single-select' && selected.length !== 1)) return 'TRY_AGAIN';
  const equal = (a,b) => a.length === b.length && a.every((x,i) =>
    order ? x === b[i] : b.includes(x));
  const prefix = (a,b) => a.length <= b.length && a.every((id,i) => id === b[i]);
  const subset = (a,b) => a.every(id => b.includes(id));
  const bad = selected.some(id => Boolean(options.get(id)?.errorCode));
  if (bad) return 'TRY_AGAIN';
  if (spec.validAnswerSets.some(ans => equal(selected, ans))) return 'PASSED';
  if (spec.validAnswerSets.some(ans => selected.length < ans.length &&
      (order ? prefix(selected,ans) : subset(selected,ans)))) return 'PARTIAL';
  return 'TRY_AGAIN';
}
let assertions=0;
const verify = (test,msg) => {assert.ok(test,msg);assertions++;};
const specs=Object.values(sources);
for (const [id,verb,mode,band] of EXPECTED) {
  const spec=sources[id], slot=slots.get(spec.slotId);
  verify(Boolean(slot), id+' missing slot');
  verify(spec.interaction===verb && spec.responseMode===mode && spec.difficultyBand===band,
    id+' wrong interaction/band/mode');
  verify(spec.cognitiveOperation===slot.cognitiveOperation, id+' learning mismatch');
  verify(spec.primarySkill==='OBS' && slot.primarySkill==='OBS', id+' mastery leak');
  verify(JSON.stringify(Object.fromEntries(spec.rubric.map(x=>[x.id,x.weight])))===
    JSON.stringify(slot.weights),id+' rubric mismatch');
  verify(spec.rubric.reduce((n,x)=>n+x.weight,0)===100, id+' rubric != 100');
  verify(spec.evidence.every(e=>e.source==='fictional' && !e.publicSource), id+' private/public leak');
  verify(spec.options.every(o=>!o.errorCode || spec.feedbackByErrorCode[o.errorCode]),
    id+' missing code-specific feedback');
  verify(spec.validAnswerSets.length>=2, id+' lacks second valid route');
  verify(new Set(spec.options.map(o=>o.id)).size===spec.options.length, id+' duplicate option');
  verify(new Set(spec.evidence.map(o=>o.id)).size===spec.evidence.length, id+' duplicate evidence');
  verify(spec.validAnswerSets.every(a=>a.every(x=>spec.options.some(o=>o.id===x))),
    id+' invalid answer ref');
}
verify(sources.E02.responseMode==='single-select' && sources.E02.interaction==='connect',
  'E02 must not falsely claim implemented match');
verify(sources.E03.options.filter(o=>/W1E03_STEP_/.test(o.id)).every(o=>!/^قبل:|^بعد:/.test(o.text)),
  'E03 option reveals chronological key by BEFORE/AFTER label');
verify(sources.E03.validAnswerSets.every(s=>s.length===5 && s.at(-1)==='W1E03_SCOPE'),
  'E03 must require two matched pairs and scoped summary');
verify(/شراء/.test(sources.E02.feedbackByErrorCode['OBS-E04']),
  'E02 purchase-only partial source requires explicit feedback');
const all = list => list.flatMap(x=>x);
const unique = arr => arr.length===new Set(arr).size;
verify(unique(specs.flatMap(s=>[s.id,s.scenarioId,s.slotId])), 'duplicate spec identity');
verify(unique(specs.map(s=>s.novelty.cognitiveSignature)), 'duplicate cognitive signature');
verify(unique(specs.flatMap(s=>s.evidence.map(x=>x.id))), 'global evidence duplicate');
verify(unique(specs.flatMap(s=>s.options.map(x=>x.id))), 'global option duplicate');
verify(!/Mahmoud-creative-library|adsoftheworld\.com|EGF-\d|EGC-\d/i.test(JSON.stringify(specs)),
  'private library provenance leaked');
const legacy = read('docs/learning/LEGACY-100-INVENTORY.md');
verify(legacy.split('\n').filter(s=>/^\|\s*\d+\s*\|/.test(s)).length === 100,
  'legacy 100 census changed');
verify(cases.length===18, '18-case trial matrix');
const issues=[];
for (const test of cases) {
  const actual=finiteStatus(sources[test.id],test.selected);
  verify(actual===test.expectedFinite, test.id+' '+test.tag+' changed finite result '+actual);
  verify((test.semantic==='SUPPORTED') === (actual==='PASSED'),
    test.id+' '+test.tag+' unapproved success');
  if (test.semantic==='RELEVANT_INSUFFICIENT' ||
      test.semantic==='INCOMPLETE_NONPREFIX' ||
      test.semantic==='MIXED_UNSUPPORTED') issues.push({case:test.id+'/'+test.tag,semantic:test.semantic,finite:actual,decision:test.decision});
}
assert.deepEqual(issues.map(x=>x.case),['E01/P2','E02/P1','E02/P2','E03/P1']);
console.log(JSON.stringify({status:'PASS_REFERENCE_ONLY',assertions,finiteCases:cases.length,
  supportedAccepted:6,nonSupportedRejected:12,reportedDiagnosticGaps:issues,
  actualEngineNotExecuted:true,E02MatchNotImplemented:true,E03PairLevelPartialNotImplemented:true,
  independentHumanQA:'PENDING'},null,2));
if (process.argv.includes('--strict-partial') && issues.length) {
  console.error('EXPECTED RED: four cognitive labels not implemented as separate Engine diagnoses; do not change evaluator here.');
  process.exitCode=1;
}

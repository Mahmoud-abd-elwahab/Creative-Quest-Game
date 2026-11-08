import assert from 'node:assert/strict';
import { LEGACY_KEY, SPIKE_KEY, loadSpike, normalizeLegacy, rewardOnce, saveSpike, totalXp } from './legacy-save.js';
class MemoryStorage {
  constructor(initial = {}) { this.values = new Map(Object.entries(initial)); this.writes = []; }
  getItem(k) { return this.values.get(k) ?? null; }
  setItem(k, v) { this.values.set(k, v); this.writes.push(k); }
}
const legacyText = JSON.stringify({done:[1,1,2,100,101,'3'],unlocked:3,xp:60,attempts:{'2':2},answers:{'1':'اختبار'},bossPhase:1,bossPhases:{'10':2},started:true,customFutureField:'retain in old key'});
const store = new MemoryStorage({[LEGACY_KEY]:legacyText});
const importOne = loadSpike(store);
assert.equal(importOne.source, 'legacy');
assert.deepEqual(importOne.data.legacy.done, [1,2,100]);
assert.equal(importOne.data.legacy.xp, 60);
assert.equal(importOne.data.legacy.bossPhases['10'], 2);
assert.equal(importOne.data.legacy.answers['1'], 'اختبار');
assert.equal(totalXp(importOne.data), 60);
const earned = rewardOnce(importOne.data,'guardian-observation-01',20);
assert.equal(totalXp(earned), 80);
assert.equal(rewardOnce(earned,'guardian-observation-01',20), earned, 'no duplicate rewards');
assert.equal(saveSpike(store,earned),true);
assert.equal(store.getItem(LEGACY_KEY),legacyText,'original byte-for-byte preserved');
assert.deepEqual(store.writes,[SPIKE_KEY]);
assert.equal(loadSpike(store).source,'spike','no duplicate legacy re-import');
assert.equal(totalXp(loadSpike(store).data),80);
const missing = new MemoryStorage();
assert.equal(loadSpike(missing).source,'fresh');
const corrupt = new MemoryStorage({[LEGACY_KEY]:'{broken',[SPIKE_KEY]:'{broken'});
assert.equal(loadSpike(corrupt).source,'recovered');
assert.equal(corrupt.writes.length,0);
assert.equal(normalizeLegacy({done:'invalid'}),null);
assert.equal(normalizeLegacy({done:[0,1,1,101],unlocked:999,xp:-2}).unlocked,100);
const denied = {getItem:()=>null,setItem:()=>{throw new Error('quota')}};
assert.equal(saveSpike(denied,importOne.data),false);
console.log('PASS: 14 save/import invariants including legacy preservation, reward dedup, malformed data and denied writes');

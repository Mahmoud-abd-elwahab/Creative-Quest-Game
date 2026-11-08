/** Read-only v0.4 import into an isolated spike key. NEVER writes/deletes the original value. */
export const LEGACY_KEY = 'creative-quest-2d-v02';
export const SPIKE_KEY = 'creative-quest-2d-engine-spike-v01';
export type StoragePort = Pick<Storage, 'getItem' | 'setItem'>;
export type LegacySnapshot = {
  done: number[];
  unlocked: number;
  xp: number;
  attempts: Record<string, number>;
  answers: Record<string, string>;
  bossPhase: number;
  bossPhases: Record<string, number>;
  started: boolean;
};
export type SpikeSave = {
  schemaVersion: 1;
  importedFrom: 'legacy' | 'fresh';
  legacy: LegacySnapshot;
  completed: string[];
  earnedXp: number;
};
export type LoadResult = { data: SpikeSave; source: 'spike' | 'legacy' | 'fresh' | 'recovered'; warning?: string };
const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const bounded = (v: unknown, min: number, max: number, fallback: number): number =>
  typeof v === 'number' && Number.isFinite(v) ? Math.max(min, Math.min(max, Math.floor(v))) : fallback;
const numericMap = (v: unknown): Record<string, number> => {
  const out: Record<string, number> = Object.create(null) as Record<string, number>;
  if (!isRecord(v)) return out;
  for (const [k, value] of Object.entries(v)) {
    if (/^\d{1,3}$/.test(k)) out[k] = bounded(value, 0, 100_000, 0);
  }
  return out;
};
const textMap = (v: unknown): Record<string, string> => {
  const out: Record<string, string> = Object.create(null) as Record<string, string>;
  if (!isRecord(v)) return out;
  for (const [k, value] of Object.entries(v)) {
    if (/^\d{1,3}$/.test(k) && typeof value === 'string') out[k] = value.slice(0, 2000);
  }
  return out;
};
const baseLegacy = (): LegacySnapshot => ({
  done: [], unlocked: 1, xp: 0, attempts: {}, answers: {}, bossPhase: 0, bossPhases: {}, started: false,
});
export function normalizeLegacy(raw: unknown): LegacySnapshot | null {
  if (!isRecord(raw) || !Array.isArray(raw.done)) return null;
  const done = [...new Set(raw.done.filter((x): x is number =>
    typeof x === 'number' && Number.isInteger(x) && x >= 1 && x <= 100))].sort((a, b) => a - b);
  return {
    done,
    unlocked: bounded(raw.unlocked, 1, 100, 1),
    xp: bounded(raw.xp, 0, 1_000_000, 0),
    attempts: numericMap(raw.attempts),
    answers: textMap(raw.answers),
    bossPhase: bounded(raw.bossPhase, 0, 3, 0),
    bossPhases: numericMap(raw.bossPhases),
    started: raw.started === true,
  };
}
function validSpike(raw: unknown): raw is SpikeSave {
  if (!isRecord(raw) || raw.schemaVersion !== 1 || !isRecord(raw.legacy) || !Array.isArray(raw.completed)) return false;
  if (raw.importedFrom !== 'legacy' && raw.importedFrom !== 'fresh') return false;
  return raw.completed.every(x => typeof x === 'string') && typeof raw.earnedXp === 'number'
    && Number.isFinite(raw.earnedXp) && normalizeLegacy(raw.legacy) !== null;
}
function fresh(legacy: LegacySnapshot = baseLegacy(), importedFrom: 'legacy' | 'fresh' = 'fresh'): SpikeSave {
  return { schemaVersion: 1, importedFrom, legacy, completed: [], earnedXp: 0 };
}
export function loadSpike(storage: StoragePort): LoadResult {
  let spikeCorrupt = false;
  try {
    const current = storage.getItem(SPIKE_KEY);
    if (current !== null) {
      const parsed: unknown = JSON.parse(current);
      if (validSpike(parsed)) {
        return { data: { ...parsed, legacy: normalizeLegacy(parsed.legacy)!,
          completed: [...new Set(parsed.completed)], earnedXp: bounded(parsed.earnedXp, 0, 1_000_000, 0) }, source: 'spike' };
      }
      spikeCorrupt = true;
    }
  } catch { spikeCorrupt = true; }
  try {
    const raw = storage.getItem(LEGACY_KEY);
    if (raw !== null) {
      const parsed: unknown = JSON.parse(raw);
      const legacy = normalizeLegacy(parsed);
      if (legacy) return { data: fresh(legacy, 'legacy'), source: spikeCorrupt ? 'recovered' : 'legacy',
        ...(spikeCorrupt ? { warning: 'Spike data invalid; recovered from untouched legacy save.' } : {}) };
      return { data: fresh(), source: 'recovered', warning: 'Legacy save shape invalid; left untouched.' };
    }
  } catch {
    return { data: fresh(), source: 'recovered', warning: 'Storage read failed; no legacy keys were changed.' };
  }
  return { data: fresh(), source: spikeCorrupt ? 'recovered' : 'fresh',
    ...(spikeCorrupt ? { warning: 'Spike data invalid; started isolated progress.' } : {}) };
}
export function rewardOnce(data: SpikeSave, challengeId: string, xp: number): SpikeSave {
  if (data.completed.includes(challengeId)) return data;
  return { ...data, completed: [...data.completed, challengeId], earnedXp: data.earnedXp + xp };
}
export function saveSpike(storage: StoragePort, data: SpikeSave): boolean {
  try { storage.setItem(SPIKE_KEY, JSON.stringify(data)); return true; } catch { return false; }
}
export const totalXp = (data: SpikeSave): number => data.legacy.xp + data.earnedXp;

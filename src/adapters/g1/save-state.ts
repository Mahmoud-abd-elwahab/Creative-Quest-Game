import {
  LEGACY_SAVE_KEY, NEW_SAVE_KEY,
  type AssessmentResultV1, type LegacySnapshotV04,
  type RewardReceipt, type SaveStateV1,
} from '../../contracts/v1.js';

/** Engine-only storage port. No UI or scene may write localStorage directly. */
export interface SaveStorage { getItem(key: string): string | null; setItem(key: string, value: string): void }
export type SaveOrigin = 'v1' | 'legacy' | 'fresh' | 'blocked';
export interface LoadOutcome {
  origin: SaveOrigin;
  state: SaveStateV1 | null;
  /** false when stored data is corrupt/inaccessible. Never overwrite it automatically. */
  writable: boolean;
  warning?: string;
}
const isObject = (x: unknown): x is Record<string, unknown> => !!x && typeof x === 'object' && !Array.isArray(x);
const integer = (x: unknown, fallback: number, lo: number, hi: number): number =>
  typeof x === 'number' && Number.isInteger(x) && x >= lo && x <= hi ? x : fallback;
const uniqueStrings = (x: unknown): x is string[] =>
  Array.isArray(x) && x.every(s => typeof s === 'string' && s.length > 0) && new Set(x).size === x.length;
function numRecord(x: unknown): Record<string, number> {
  const out: Record<string, number> = Object.create(null) as Record<string, number>;
  if (isObject(x)) for (const [key, value] of Object.entries(x)) {
    if (/^\d{1,3}$/.test(key) && typeof value === 'number' && Number.isFinite(value) && value >= 0) {
      out[key] = Math.floor(value);
    }
  }
  return out;
}
function textRecord(x: unknown): Record<string, string> {
  const out: Record<string, string> = Object.create(null) as Record<string, string>;
  if (isObject(x)) for (const [key, value] of Object.entries(x)) {
    if (/^\d{1,3}$/.test(key) && typeof value === 'string') out[key] = value;
  }
  return out;
}
export function parseLegacy(value: unknown): LegacySnapshotV04 | null {
  if (!isObject(value) || !Array.isArray(value.done)) return null;
  const done = [...new Set(value.done.filter((v): v is number =>
    typeof v === 'number' && Number.isInteger(v) && v >= 1 && v <= 100))].sort((a, b) => a - b);
  return {
    done, unlocked: integer(value.unlocked, 1, 1, 100),
    xp: integer(value.xp, 0, 0, 10_000_000),
    attempts: numRecord(value.attempts),
    answers: textRecord(value.answers),
    bossPhase: integer(value.bossPhase, 0, 0, 3),
    bossPhases: numRecord(value.bossPhases),
    started: value.started === true,
  };
}
const fresh = (iso: string, legacy?: LegacySnapshotV04): SaveStateV1 => ({
  schemaVersion: 1,
  ...(legacy ? { importedLegacy: { key: LEGACY_SAVE_KEY, snapshot: legacy } } : {}),
  completedChallengeIds: [],
  unlockedWorldIds: ['observation'],
  // DO NOT copy partial old Boss phases into incompatible v1 phase mechanics.
  // Retain old phases only in importedLegacy; prior narrative completion remains in legacy.done.
  bosses: {},
  receipts: [],
  xpTotal: legacy?.xp ?? 0,
  masteryBySkill: {},
  lastWorldId: 'observation',
  updatedAt: iso,
});
const isReceipt = (v: unknown): v is RewardReceipt => isObject(v)
  && typeof v.id === 'string' && v.id.length > 0
  && typeof v.xp === 'number' && Number.isInteger(v.xp) && v.xp >= 0
  && typeof v.grantedAt === 'string' && Number.isFinite(Date.parse(v.grantedAt))
  && (v.challengeId === undefined || typeof v.challengeId === 'string')
  && (v.bossId === undefined || typeof v.bossId === 'string')
  && ((typeof v.challengeId === 'string') !== (typeof v.bossId === 'string'));
/** Refuse a suspect v1 key rather than silently laundering/saving inconsistent XP. */
export function validV1(v: unknown): v is SaveStateV1 {
  if (!isObject(v) || v.schemaVersion !== 1
    || !uniqueStrings(v.completedChallengeIds) || !uniqueStrings(v.unlockedWorldIds)
    || !v.unlockedWorldIds.includes('observation') || !Array.isArray(v.receipts)
    || !v.receipts.every(isReceipt) || !isObject(v.bosses) || !isObject(v.masteryBySkill)
    || typeof v.lastWorldId !== 'string' || typeof v.updatedAt !== 'string'
    || !Number.isFinite(Date.parse(v.updatedAt))) return false;
  if (v.importedLegacy !== undefined
    && (!isObject(v.importedLegacy) || v.importedLegacy.key !== LEGACY_SAVE_KEY
    || parseLegacy(v.importedLegacy.snapshot) === null)) return false;
  const receipts = v.receipts as RewardReceipt[];
  if (new Set(receipts.map(rec => rec.id)).size !== receipts.length) return false;
  const baseline = v.importedLegacy === undefined ? 0 :
    (v.importedLegacy as { snapshot: LegacySnapshotV04 }).snapshot.xp;
  const expected = receipts.reduce((total, receipt) => total + receipt.xp, baseline);
  return Number.isSafeInteger(expected) && v.xpTotal === expected;
}
/** Read-only migration. Import is persisted only when a later user action commits a receipt. */
export function loadSave(storage: SaveStorage, now = () => new Date().toISOString()): LoadOutcome {
  let newText: string | null;
  try { newText = storage.getItem(NEW_SAVE_KEY); }
  catch { return { origin: 'blocked', state: null, writable: false, warning: 'Save storage unavailable. No progress can be committed.' }; }
  if (newText !== null) {
    try {
      const value: unknown = JSON.parse(newText);
      if (validV1(value)) return { origin: 'v1', state: value, writable: true };
    } catch { /* fail closed below */ }
    return { origin: 'blocked', state: null, writable: false,
      warning: 'The v1 save is damaged. Keep both keys for manual export/recovery; no overwrite attempted.' };
  }
  try {
    const legacyText = storage.getItem(LEGACY_SAVE_KEY);
    if (legacyText === null) return { origin: 'fresh', state: fresh(now()), writable: true };
    const raw: unknown = JSON.parse(legacyText);
    const snapshot = parseLegacy(raw);
    if (!snapshot) return { origin: 'blocked', state: null, writable: false,
      warning: 'The legacy save could not be validated. It was left untouched.' };
    return { origin: 'legacy', state: fresh(now(), snapshot), writable: true };
  } catch {
    return { origin: 'blocked', state: null, writable: false,
      warning: 'The legacy save could not be read or parsed. No replacement was written.' };
  }
}
export interface CommitOutcome { saved: boolean; duplicate: boolean; state: SaveStateV1; receipt?: RewardReceipt; error?: string }
/**
 * Narrative reward is authorized only by a finite, structured, authored check.
 * A text/self-review or external-discussion response cannot mint a verified receipt.
 */
export function commitStructuredReceipt(
  storage: SaveStorage, state: SaveStateV1, result: AssessmentResultV1,
  xp: number, now = () => new Date().toISOString(),
): CommitOutcome {
  if (result.status !== 'PASSED' || !result.narrativeCleared
    || result.trust !== 'STRUCTURED_VERIFIED' || result.masteryAwarded
    || !Number.isInteger(xp) || xp < 0 || !validV1(state)) {
    return { saved: false, duplicate: false, state, error: 'Untrusted assessment or invalid save/reward.' };
  }
  const id = 'challenge:' + result.challengeId;
  const existing = state.receipts.find(r => r.id === id);
  if (existing) return { saved: true, duplicate: true, state, receipt: existing };
  if (state.completedChallengeIds.includes(result.challengeId)) {
    return { saved: false, duplicate: false, state, error: 'Completed challenge has no matching receipt.' };
  }
  const receipt: RewardReceipt = { id, challengeId: result.challengeId, xp, grantedAt: now() };
  const candidate: SaveStateV1 = {
    ...state, completedChallengeIds: [...state.completedChallengeIds, result.challengeId],
    receipts: [...state.receipts, receipt], xpTotal: state.xpTotal + xp, updatedAt: now(),
  };
  if (!validV1(candidate)) return { saved: false, duplicate: false, state, error: 'Receipt invariant failed.' };
  try {
    storage.setItem(NEW_SAVE_KEY, JSON.stringify(candidate));
    return { saved: true, duplicate: false, state: candidate, receipt };
  } catch { return { saved: false, duplicate: false, state, error: 'Unable to save progress. Try again after storage is available.' }; }
}

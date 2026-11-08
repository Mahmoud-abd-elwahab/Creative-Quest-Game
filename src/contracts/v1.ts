/** Creative Quest public integration contracts. G0 REVIEW CANDIDATE, not deployed runtime. */
export const CONTRACT_VERSION = 1 as const;
export const LEGACY_SAVE_KEY = 'creative-quest-2d-v02' as const;
export const NEW_SAVE_KEY = 'creative-quest-2d-v1' as const;

export type SkillId = 'OBS' | 'AUD' | 'TEN' | 'INS' | 'BRAND' | 'TERR' | 'CON' | 'MECH' | 'DIR' | 'CAMP';
export type DifficultyBand = 1 | 2 | 3 | 4 | 5;
export type EvidenceType = 'observation' | 'record' | 'hypothesis' | 'unknown';
export type EvidenceSource = 'fictional' | 'user-provided' | 'externally-verified';
export type InteractionKind = 'inspect' | 'connect' | 'arrange' | 'compare' | 'deflect' | 'route' | 'interview' | 'test' | 'forge' | 'boss-evidence' | 'boss-mirror' | 'boss-forge';
export type ResponseMode = 'single-select' | 'multi-select' | 'order' | 'match' | 'structured-build' | 'open-rubric';

export interface EvidenceSpec {
  id: string;
  text: string;
  type: EvidenceType;
  source: EvidenceSource;
  scope?: string;
  /** Only for externally verified evidence. Never put private-library provenance into public build. */
  publicSource?: { url: string; accessedOn: string };
}
export interface RubricCriterion {
  id: string;  // Learning-owned R-OBS-* or R-PREV-* ID
  weight: number; // integer; all weights sum to 100 per ChallengeSpec
  critical?: boolean;
}
export interface AnswerOption { id: string; text: string; errorCode?: string }
export interface ChallengeSpecV1 {
  schemaVersion: 1;
  id: string; // immutable, globally unique, never numeric-only
  slotId: string; // OBS-W1-E01..E09 or OBS-W1-B01..B03 for W01
  scenarioId: string;
  worldId: string;
  legacyLevelId?: number; // 1..100 mapping only, NOT a replacement ID
  primarySkill: SkillId;
  secondarySkills: SkillId[];
  difficultyBand: DifficultyBand;
  cognitiveOperation: string;
  interaction: InteractionKind;
  responseMode: ResponseMode;
  industry: string;
  audience: string;
  situation: string;
  objective: string;
  productTruths: string[]; // fictional capabilities or public verified facts, not private notes
  prompt: string;
  evidence: EvidenceSpec[];
  options?: AnswerOption[];
  /** Multiple defensible structured routes; never used to judge open creative prose. */
  validAnswerSets?: string[][];
  rubricVersion: string;
  rubric: RubricCriterion[];
  feedbackByErrorCode: Record<string, string>;
  hintTiers: string[];
  novelty: { fingerprint: string; reviewOf?: string; cognitiveSignature: string };
}
export interface LevelSpecV1 {
  schemaVersion: 1;
  id: string;
  worldId: string;
  order: number;
  challengeId: string;
  nodeId: string;
  legacyLevelId?: number;
}

/** 'VERIFIED' means authored structured criteria passed, NOT externally proven creative mastery. */
export type AssessmentTrust = 'STRUCTURED_VERIFIED' | 'HUMAN_REVIEWED' | 'SELF_REVIEWED_UNVERIFIED' | 'EXTERNAL_DISCUSSION_UNVERIFIED' | 'NOT_ASSESSED';
export type AssessmentStatus = 'TRY_AGAIN' | 'PARTIAL' | 'PASSED' | 'NEEDS_REVIEW';
export interface CriterionAssessment { criterionId: string; level: 0 | 1 | 2; feedback: string }
export interface AssessmentResultV1 {
  schemaVersion: 1;
  challengeId: string;
  attemptId: string;
  status: AssessmentStatus;
  trust: AssessmentTrust;
  criteria: CriterionAssessment[];
  errorCodes: string[];
  feedback: string;
  hintCount: number;
  /** Separates narrative game progress from a verified learning-skill badge. */
  narrativeCleared: boolean;
  masteryAwarded: boolean;
  reviewedBy?: string;
}

export type Facing = 'down' | 'left' | 'right' | 'up';
export type SpriteAction = 'idle' | 'walk' | 'inspect' | 'reason' | 'reveal' | 'hit';
export interface Point { x: number; y: number }
export interface Rectangle { x: number; y: number; width: number; height: number }
export interface SpriteAnimationSpec {
  id: string;
  action: SpriteAction;
  facing: Facing;
  file: string;
  frameWidth: number;
  frameHeight: number;
  frameCount: number;
  fps: number;
  pivot: Point; // normalized x,y in [0,1], usually feet center; not hardcoded cell size
}
export interface SpriteManifestV1 {
  schemaVersion: 1;
  characterId: string;
  sourceApproved: boolean;
  displayScale: number; // > 0; engine applies visual scale
  hitbox: Rectangle; // world-pixel footprint relative to feet pivot
  animations: SpriteAnimationSpec[];
}
export type CollisionShape = { id: string; kind: 'rect'; rect: Rectangle } |
  { id: string; kind: 'polygon'; vertices: Point[] };
export interface WorldNode {
  id: string;
  kind: 'challenge' | 'boss' | 'portal' | 'npc' | 'clue';
  position: Point; // top-left origin, world pixels; actor pivot is feet center
  radius: number;
  challengeId?: string;
  bossId?: string;
  targetWorldId?: string;
}
export interface WorldSpecV1 {
  schemaVersion: 1;
  id: string;
  widthPx: number;
  heightPx: number;
  spawn: Point;
  layers: { background: string; ground: string; props: string; foreground: string };
  collisions: CollisionShape[];
  nodes: WorldNode[];
  /** May be absent while original vector graybox is only a design artifact. */
  tileSizePx?: number;
}

export type BossPhaseId = 'evidence' | 'mirror' | 'forge';
export interface BossPhaseSpec {
  id: BossPhaseId;
  slotId: string; // OBS-W1-B01..03
  challengeId: string;
  effectEventId: string; // e.g., fog-cracks, mirror-path, bridge-built
  /** Guards must be checked by Boss/Engine; a button click is never sufficient. */
  guard: {
    requiredCriterionIds: string[];
    requireStructuredStep: boolean;
    allowTransparentSelfReviewForNarrative: boolean;
  };
}
export interface BossSpecV1 {
  schemaVersion: 1;
  id: string;
  worldId: string;
  encounterNodeId: string;
  phases: [BossPhaseSpec, BossPhaseSpec, BossPhaseSpec];
  rewardXp: number;
}
export interface BossProgressV1 {
  bossId: string;
  clearedPhases: BossPhaseId[];
  currentPhase: BossPhaseId | 'complete';
  completionReceiptId?: string;
}

export interface LegacySnapshotV04 {
  done: number[];
  unlocked: number;
  xp: number;
  attempts: Record<string, number>;
  answers: Record<string, string>;
  bossPhase: number;
  bossPhases: Record<string, number>;
  started: boolean;
}
export interface RewardReceipt {
  id: string; // deterministic from a completed challenge/Boss; idempotency key
  challengeId?: string;
  bossId?: string;
  xp: number;
  grantedAt: string;
}
export interface SaveStateV1 {
  schemaVersion: 1;
  importedLegacy?: { key: typeof LEGACY_SAVE_KEY; snapshot: LegacySnapshotV04 };
  completedChallengeIds: string[];
  unlockedWorldIds: string[];
  bosses: Record<string, BossProgressV1>;
  receipts: RewardReceipt[];
  /** Legacy XP + sum of new receipts; never double-award. */
  xpTotal: number;
  masteryBySkill: Partial<Record<SkillId, boolean>>;
  lastWorldId: string;
  updatedAt: string;
}

export type ChallengeAnswer =
  | { mode: 'options'; selectedIds: string[] }
  | { mode: 'order'; orderedIds: string[] }
  | { mode: 'match'; pairs: Array<{ fromId: string; toId: string }> }
  | { mode: 'structured'; fields: Record<string, string> }
  | { mode: 'text'; text: string; selfReviewed: boolean };
export type GameCommand =
  | { type: 'interact.request'; requestId: string; nodeId: string }
  | { type: 'challenge.submit'; requestId: string; challengeId: string; answer: ChallengeAnswer }
  | { type: 'challenge.hint'; requestId: string; challengeId: string }
  | { type: 'dialog.close.request'; requestId: string }
  | { type: 'engine.pause.request'; requestId: string; reason: 'dialog' | 'menu' | 'boss' }
  | { type: 'engine.resume.request'; requestId: string }
  | { type: 'boss.action'; requestId: string; bossId: string; phaseId: BossPhaseId; challengeId: string; answer: ChallengeAnswer }
  | { type: 'boss.retry'; requestId: string; bossId: string };
export type GameEvent =
  | { type: 'engine.paused'; requestId: string }
  | { type: 'engine.resumed'; requestId: string }
  | { type: 'dialog.opened'; requestId: string; challengeId?: string; bossId?: string }
  | { type: 'dialog.closed'; requestId: string }
  | { type: 'assessment.recorded'; requestId: string; result: AssessmentResultV1 }
  | { type: 'reward.committed'; requestId: string; receipt: RewardReceipt; xpTotal: number }
  | { type: 'boss.updated'; boss: BossProgressV1; requestId?: string; phaseEffectId?: string }
  | { type: 'world.updated'; worldId: string }
  | { type: 'save.failed'; requestId?: string; message: string };
export interface GameSnapshotV1 {
  worldId: string;
  xpTotal: number;
  paused: boolean;
  openChallengeId?: string;
  openBossId?: string;
  bosses: Record<string, BossProgressV1>;
}
/** A DOM UI consumes engine snapshots/events; it never owns game progress. */
export interface UIBridgeV1 {
  dispatch(command: GameCommand): void;
  subscribe(listener: (event: GameEvent) => void): () => void;
  snapshot(): Readonly<GameSnapshotV1>;
}
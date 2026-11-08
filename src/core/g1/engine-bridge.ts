import type {
  GameCommand, GameEvent, GameSnapshotV1, UIBridgeV1, Point, WorldSpecV1,
  AssessmentResultV1, ChallengeSpecV1,
} from '../../contracts/v1.js';
import { commitStructuredReceipt, loadSave, type SaveStorage, type LoadOutcome } from '../../adapters/g1/save-state.js';
import { DIAGNOSTIC_CHALLENGE_ID, DIAGNOSTIC_HINTS, evaluateTechnicalFixture } from './technical-fixture.js';
import { evaluateAuthoredChallenge, type ChallengeLookup } from './challenge-catalog.js';

type Listener = (event: GameEvent) => void;
const distance = (a: Point, b: Point): number => Math.hypot(a.x - b.x, a.y - b.y);
/** Gameplay/state authority; never stores a second player transform or duplicates UI progress. */
export class G1EngineBridge implements UIBridgeV1 {
  private readonly listeners = new Set<Listener>();
  private readonly handledRequests = new Set<string>();
  private readonly load: LoadOutcome;
  private positionGetter: (() => Point) | null = null;
  private paused = false;
  /** True after dialog.closed, until a separate engine.resume.request ACK. */
  private waitingForResume = false;
  private openChallengeId: string | undefined;
  private hintCount = 0;
  private destroyed = false;
  readonly world: WorldSpecV1;
  constructor(
    world: WorldSpecV1,
    private readonly storage: SaveStorage,
    now?: () => string,
    private readonly findChallenge: ChallengeLookup = () => undefined,
  ) {
    this.world = world;
    this.load = loadSave(storage, now);
  }
  /** HQ supplies approved content from Content-owned JSON, never via Engine hardcoding. */
  getChallengeSpec(id: string): Readonly<ChallengeSpecV1> | undefined {
    const spec = this.findChallenge(id);
    return spec?.worldId === this.world.id ? spec : undefined;
  }
  get saveHealth(): Readonly<Pick<LoadOutcome, 'origin' | 'warning' | 'writable'>> {
    return { origin: this.load.origin, warning: this.load.warning, writable: this.load.writable };
  }
  /** HQ may display a save warning after UI subscribes. */
  announceSaveHealth(): void {
    if (this.load.warning) this.emit({ type: 'save.failed', message: this.load.warning });
  }
  /** Scene owns live feet position. Unbinding on scene shutdown prevents stale interact requests. */
  bindPlayerPosition(getPosition: () => Point): () => void {
    this.positionGetter = getPosition;
    return () => { if (this.positionGetter === getPosition) this.positionGetter = null; };
  }
  canInteract(nodeId: string): boolean {
    if (!this.positionGetter) return false;
    const node = this.world.nodes.find(n => n.id === nodeId);
    return !!node && distance(this.positionGetter(), node.position) <= node.radius;
  }
  nearbyNodeId(): string | null {
    if (!this.positionGetter) return null;
    return this.world.nodes.find(n => this.canInteract(n.id))?.id ?? null;
  }
  snapshot(): Readonly<GameSnapshotV1> {
    return {
      worldId: this.world.id,
      xpTotal: this.load.state?.xpTotal ?? 0,
      paused: this.paused,
      ...(this.openChallengeId ? { openChallengeId: this.openChallengeId } : {}),
      bosses: this.load.state?.bosses ?? {},
    };
  }
  subscribe(listener: Listener): () => void {
    if (this.destroyed) return () => {};
    this.listeners.add(listener);
    return () => { this.listeners.delete(listener); };
  }
  private emit(event: GameEvent): void {
    for (const listener of [...this.listeners]) {
      try { listener(event); } catch { /* One UI listener must not corrupt Engine progress. */ }
    }
  }
  dispatch(command: GameCommand): void {
    if (this.destroyed || this.handledRequests.has(command.requestId)) return;
    this.handledRequests.add(command.requestId);
    // Bounded de-dup memory for one scene session; durable idempotency is in receipts.
    if (this.handledRequests.size > 2000) this.handledRequests.clear();
    switch (command.type) {
      case 'interact.request': {
        if (this.paused || !this.canInteract(command.nodeId)) return;
        const node = this.world.nodes.find(n => n.id === command.nodeId);
        if (!node || !node.challengeId || (node.kind !== 'clue' && node.kind !== 'challenge')) return;
        if (node.challengeId !== DIAGNOSTIC_CHALLENGE_ID && !this.getChallengeSpec(node.challengeId)) {
          // Never route players to synthetic fixture when real ChallengeSpec is missing.
          return;
        }
        // No diagnostic shortcut: actual player proximity and real interaction call this exact route.
        this.paused = true;
        this.waitingForResume = false;
        this.openChallengeId = node.challengeId;
        this.hintCount = 0;
        this.emit({ type: 'engine.paused', requestId: command.requestId });
        this.emit({ type: 'dialog.opened', requestId: command.requestId, challengeId: node.challengeId });
        break;
      }
      case 'engine.pause.request': {
        this.paused = true;
        this.emit({ type: 'engine.paused', requestId: command.requestId });
        break;
      }
      case 'engine.resume.request': {
        // Distinct command and acknowledgment. Never resume under a live challenge.
        if (this.openChallengeId) {
          this.emit({ type: 'engine.paused', requestId: command.requestId });
          return;
        }
        this.waitingForResume = false;
        this.paused = false;
        this.emit({ type: 'engine.resumed', requestId: command.requestId });
        break;
      }
      case 'dialog.close.request': {
        if (!this.openChallengeId) return;
        this.openChallengeId = undefined;
        this.hintCount = 0;
        this.waitingForResume = true;
        // UI closes its DOM modal, completes focus preparation, THEN sends resume.request.
        // The world MUST remain paused after this ack; no early engine.resumed event.
        this.paused = true;
        this.emit({ type: 'dialog.closed', requestId: command.requestId });
        break;
      }
      case 'challenge.hint': {
        if (!this.paused || this.openChallengeId !== command.challengeId) return;
        this.hintCount += 1;
        const hints = this.getChallengeSpec(command.challengeId)?.hintTiers ?? DIAGNOSTIC_HINTS;
        const hint = hints[Math.min(this.hintCount - 1, hints.length - 1)] ?? 'راجع الأدلة قبل ما تختار.';
        // No dedicated hint event in G0; NOT_ASSESSED distinguishes this from an evaluated attempt.
        const result: AssessmentResultV1 = {
          schemaVersion: 1, challengeId: command.challengeId, attemptId: command.requestId,
          status: 'NEEDS_REVIEW', trust: 'NOT_ASSESSED',
          criteria: [], errorCodes: ['HINT_ONLY'], feedback: hint,
          hintCount: this.hintCount, narrativeCleared: false, masteryAwarded: false,
        };
        this.emit({ type: 'assessment.recorded', requestId: command.requestId, result });
        break;
      }
      case 'challenge.submit': {
        if (!this.paused || this.openChallengeId !== command.challengeId) return;
        const authored = this.getChallengeSpec(command.challengeId);
        const result = authored
          ? evaluateAuthoredChallenge(authored, command.requestId, command.answer, this.hintCount)
          : evaluateTechnicalFixture(command.challengeId, command.requestId, command.answer, this.hintCount);
        this.emit({ type: 'assessment.recorded', requestId: command.requestId, result });
        if (result.status !== 'PASSED' || !result.narrativeCleared) return;
        if (!this.load.state || !this.load.writable) {
          this.emit({ type: 'save.failed', requestId: command.requestId,
            message: this.load.warning ?? 'Saving unavailable; reward not committed.' });
          return;
        }
        const commit = commitStructuredReceipt(this.storage, this.load.state, result, 20);
        if (!commit.saved) {
          this.emit({ type: 'save.failed', requestId: command.requestId,
            message: commit.error ?? 'Reward was not saved.' });
          return;
        }
        this.load.state = commit.state;
        if (!commit.duplicate && commit.receipt) {
          this.emit({ type: 'reward.committed', requestId: command.requestId,
            receipt: commit.receipt, xpTotal: commit.state.xpTotal });
        }
        break;
      }
      // Boss lifecycle belongs to Boss specialist and is deliberately not faked in the Engine diagnostic.
      case 'boss.action':
      case 'boss.retry':
        return;
      default: {
        const unexpected: never = command;
        return unexpected;
      }
    }
  }
  destroy(): void {
    this.destroyed = true;
    this.positionGetter = null;
    this.listeners.clear();
    this.handledRequests.clear();
  }
}
export { DIAGNOSTIC_CHALLENGE_ID };

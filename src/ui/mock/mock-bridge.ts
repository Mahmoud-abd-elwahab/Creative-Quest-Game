import type {
  AssessmentResultV1, GameCommand, GameEvent, GameSnapshotV1,
  RewardReceipt, UIBridgeV1
} from '../../contracts/v1';

/**
 * Demonstration bridge with an authoritative-looking event flow for LOCAL TESTS.
 * DO NOT ship or import it in the real Engine. No localStorage or mastery.
 */
export class MockUIBridge implements UIBridgeV1 {
  private listeners = new Set<(event: GameEvent) => void>();
  private model: GameSnapshotV1 = {
    worldId: 'observation', xpTotal: 0, paused: false, bosses: {}
  };
  private committed = new Map<string, RewardReceipt>();
  private failSave = false;
  private forceTrust = false;
  private failPause = false;
  private simulateDelay = 40;

  snapshot(): Readonly<GameSnapshotV1> {
    return { ...this.model, bosses: { ...this.model.bosses } };
  }

  subscribe(listener: (event: GameEvent) => void): () => void {
    this.listeners.add(listener);
    return () => { this.listeners.delete(listener); };
  }

  configure(options: { saveFailure?: boolean; unverified?: boolean; pauseFailure?: boolean }): void {
    this.failSave = options.saveFailure ?? false;
    this.forceTrust = options.unverified ?? false;
    this.failPause = options.pauseFailure ?? false;
  }

  private emit(event: GameEvent): void {
    for (const listener of this.listeners) listener(event);
  }

  dispatch(command: GameCommand): void {
    // Deterministic finite demo fixture; no real Engine is running.
    window.setTimeout(() => this.apply(command), this.simulateDelay);
  }

  private apply(command: GameCommand): void {
    switch (command.type) {
      case 'interact.request':
        if (this.model.paused || command.nodeId !== 'mock-library-clue' || this.failPause) return;
        // Mimics Engine #37's real world handshake, including synchronous
        // paused->opened event order and authoritative openChallengeId.
        this.model.paused = true;
        this.model.openChallengeId = 'cq-mock-obs-w1-e01';
        this.emit({ type: 'engine.paused', requestId: command.requestId });
        this.emit({ type: 'dialog.opened', requestId: command.requestId,
          challengeId: this.model.openChallengeId });
        break;
      case 'engine.pause.request':
        if (this.failPause) return; // mock-only manual pause test
        this.model.paused = true;
        this.emit({ type: 'engine.paused', requestId: command.requestId });
        break;
      case 'dialog.close.request':
        this.model.openChallengeId = undefined;
        // Required Engine #37 fix: closing the DOM is NOT permission to move.
        // Keep paused until UI explicitly sends engine.resume.request.
        this.emit({ type: 'dialog.closed', requestId: command.requestId });
        break;
      case 'engine.resume.request':
        if (this.model.openChallengeId) {
          this.emit({ type: 'engine.paused', requestId: command.requestId });
          break;
        }
        this.model.paused = false;
        this.emit({ type: 'engine.resumed', requestId: command.requestId });
        break;
      case 'challenge.submit': {
        if (!this.model.paused || this.model.openChallengeId !== command.challengeId) return;
        const answer = command.answer.mode === 'options' ? command.answer.selectedIds : [];
        const correct = answer.length === 2 && answer.includes('loan-return') &&
          answer.includes('reading-start');
        const partial = answer.includes('loan-return') || answer.includes('reading-start');
        const trust = this.forceTrust ? 'SELF_REVIEWED_UNVERIFIED' : 'STRUCTURED_VERIFIED';
        const result: AssessmentResultV1 = {
          schemaVersion: 1, challengeId: command.challengeId,
          attemptId: command.requestId,
          status: correct ? 'PASSED' : partial ? 'PARTIAL' : 'TRY_AGAIN',
          trust,
          criteria: [
            { criterionId: 'R-OBS-TRACE', level: correct ? 2 : partial ? 1 : 0,
              feedback: correct ? 'الاختيارات ليها أثر في سجل المكتبة.' : 'دور على سجل أو فعل اتوثّق.' }
          ],
          errorCodes: correct ? [] : partial ? ['OVER_INTERPRETATION'] : ['NO_EVIDENCE'],
          feedback: correct ? 'اخترت سلوكين حصلوا فعلًا. ده مش دليل على سبب التوقف عن القراءة.'
            : partial ? 'جزء من الاختيار مدعوم، بس فيه تفسير محتاج مصدر.'
            : 'العبارة دي تفسير مش ملاحظة؛ فين الدليل القابل للفحص؟',
          hintCount: 0, narrativeCleared: correct, masteryAwarded: correct && !this.forceTrust
        };
        this.emit({ type: 'assessment.recorded', requestId: command.requestId, result });
        if (correct) {
          if (this.failSave) {
            this.emit({ type: 'save.failed', requestId: command.requestId,
              message: 'دي تجربة Mock: افترضنا إن local save فشل.' });
            break;
          }
          const receiptId = 'mock-receipt-' + command.challengeId;
          let receipt = this.committed.get(receiptId);
          if (!receipt) {
            receipt = { id: receiptId, challengeId: command.challengeId,
              xp: 20, grantedAt: '2026-11-08T00:00:00.000Z' };
            this.committed.set(receiptId, receipt);
            this.model.xpTotal += receipt.xp;
          }
          this.emit({ type: 'reward.committed', requestId: command.requestId,
            receipt, xpTotal: this.model.xpTotal });
        }
        break;
      }
      case 'challenge.hint':
        // Contract has no hint ack; hint presentation is authored locally by UI.
        break;
      case 'boss.action':
      case 'boss.retry':
        // Not in Issue #35's single-challenge implementation scope.
        break;
    }
  }
}

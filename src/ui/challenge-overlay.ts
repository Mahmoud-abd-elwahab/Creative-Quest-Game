import './challenge-overlay.css';
import type {
  AssessmentResultV1, ChallengeSpecV1, GameEvent, GameSnapshotV1,
  RewardReceipt, UIBridgeV1
} from '../contracts/v1';

/**
 * G1 accessible modal. The Engine is the only authority for pause, result,
 * progression, XP and storage. UI state here is ephemeral presentation only.
 */
export type ChallengeOverlayPhase =
  | 'idle' | 'waiting-pause' | 'active' | 'submitting'
  | 'feedback' | 'waiting-close' | 'waiting-resume';

export interface ChallengeOverlayOptions {
  mount: HTMLElement;
  bridge: UIBridgeV1;
  /** Request IDs are unique per component session, never reuse a receipt ID. */
  requestId?: () => string;
  /** How long to show a missing acknowledgment warning; no speculative state transition. */
  acknowledgementMs?: number;
}

export class FirstChallengeOverlay {
  private readonly bridge: UIBridgeV1;
  private readonly root: HTMLElement;
  private readonly dialog: HTMLDialogElement;
  private readonly outsideStatus: HTMLElement;
  private readonly outsideRetry: HTMLButtonElement;
  private readonly title: HTMLElement;
  private readonly description: HTMLElement;
  private readonly evidence: HTMLElement;
  private readonly options: HTMLElement;
  private readonly counter: HTMLElement;
  private readonly hint: HTMLElement;
  private readonly feedback: HTMLElement;
  private readonly status: HTMLElement;
  private readonly submit: HTMLButtonElement;
  private readonly hintButton: HTMLButtonElement;
  private readonly closeButton: HTMLButtonElement;
  private readonly unsubscribe: () => void;
  private readonly requestId: () => string;
  private readonly timeoutMs: number;
  private timeout: ReturnType<typeof setTimeout> | null = null;
  private phaseValue: ChallengeOverlayPhase = 'idle';
  private current: ChallengeSpecV1 | null = null;
  private opener: HTMLElement | null = null;
  private pauseRequestId: string | null = null;
  private closeRequestId: string | null = null;
  private resumeRequestId: string | null = null;
  private submissionRequestId: string | null = null;
  private previousAssessment: AssessmentResultV1 | null = null;
  private receipt: RewardReceipt | null = null;
  private receiptTotal: number | null = null;
  private selections = new Set<string>();
  private hintIndex = 0;
  private pendingSaveFailure = false;
  private destroyed = false;
  private availability: 'ready' | 'offline' | 'locked' = 'ready';

  constructor(options: ChallengeOverlayOptions) {
    this.bridge = options.bridge;
    this.timeoutMs = options.acknowledgementMs ?? 8000;
    let sequence = 0;
    const session = Math.random().toString(36).slice(2);
    this.requestId = options.requestId ?? (() => `ui-${session}-${++sequence}`);
    this.root = document.createElement('section');
    this.root.className = 'cq-ui';
    this.root.dir = 'rtl';
    this.root.lang = 'ar';
    // Template has no untrusted interpolated strings; game copy is inserted using textContent.
    this.root.innerHTML = `
      <div class="cq-global" hidden role="alert">
        <span class="cq-global-text"></span>
        <button class="cq-global-retry" type="button">حاول تاني</button>
      </div>
      <dialog class="cq-dialog" aria-labelledby="cq-title" aria-describedby="cq-description">
        <div class="cq-layout">
          <header class="cq-head">
            <div><span class="cq-kicker"><bdi dir="ltr">WORLD 01 · OBSERVATION</bdi></span>
              <h2 id="cq-title" tabindex="-1"></h2>
            </div>
            <button type="button" class="cq-close" aria-label="اقفل التحدي وارجع للعالم">×</button>
          </header>
          <div class="cq-scroll">
            <p class="cq-description" id="cq-description"></p>
            <section class="cq-evidence" aria-label="الدليل المتاح"></section>
            <fieldset class="cq-fieldset">
              <legend>اختار السلوك اللي عليه دليل</legend>
              <p class="cq-prompt"></p>
              <div class="cq-choices"></div>
            </fieldset>
            <p class="cq-counter" role="status" aria-live="polite"></p>
            <p class="cq-hint" hidden></p>
            <section class="cq-feedback" hidden aria-live="polite" aria-atomic="true"></section>
            <div class="cq-save-error" role="alert" hidden></div>
            <p class="cq-trust-note">الاختيارات المحددة بيتراجعها نظام التحدي. تقييم الأفكار الحرة مش AI تلقائي.</p>
          </div>
          <footer class="cq-foot">
            <p class="cq-status" role="status" aria-live="polite"></p>
            <div class="cq-buttons">
              <button class="cq-hint-button" type="button">تلميح</button>
              <button class="cq-submit" type="button" disabled>راجع اختياري</button>
            </div>
          </footer>
        </div>
      </dialog>`;
    options.mount.append(this.root);
    const get = <T extends Element>(selector: string): T => {
      const node = this.root.querySelector<T>(selector);
      if (!node) throw new Error('UI template element missing: ' + selector);
      return node;
    };
    this.dialog = get<HTMLDialogElement>('.cq-dialog');
    this.outsideStatus = get<HTMLElement>('.cq-global');
    this.outsideRetry = get<HTMLButtonElement>('.cq-global-retry');
    this.title = get<HTMLElement>('#cq-title');
    this.description = get<HTMLElement>('#cq-description');
    this.evidence = get<HTMLElement>('.cq-evidence');
    this.options = get<HTMLElement>('.cq-choices');
    this.counter = get<HTMLElement>('.cq-counter');
    this.hint = get<HTMLElement>('.cq-hint');
    this.feedback = get<HTMLElement>('.cq-feedback');
    this.status = get<HTMLElement>('.cq-status');
    this.submit = get<HTMLButtonElement>('.cq-submit');
    this.hintButton = get<HTMLButtonElement>('.cq-hint-button');
    this.closeButton = get<HTMLButtonElement>('.cq-close');
    this.closeButton.addEventListener('click', this.requestClose);
    this.submit.addEventListener('click', this.submitAnswer);
    this.hintButton.addEventListener('click', this.showHint);
    this.dialog.addEventListener('cancel', this.handleEscape);
    this.outsideRetry.addEventListener('click', this.retryAcknowledgement);
    this.unsubscribe = this.bridge.subscribe(this.handleEvent);
  }

  get phase(): ChallengeOverlayPhase { return this.phaseValue; }

  /**
   * Host/Engine has already discovered the node and provided the corresponding
   * authored ChallengeSpec. No ChallengeSpec delivery event exists in UIBridgeV1.
   */
  open(challenge: ChallengeSpecV1, trigger: HTMLElement): boolean {
    if (this.destroyed || this.phaseValue !== 'idle') return false;
    if (this.availability !== 'ready') {
      this.setOutside(this.availability === 'offline'
        ? 'إنت Offline حاليًا. تشغيل التحدي محتاج تأكيد إن ملفات اللعبة متاحة محليًا.'
        : 'التحدي مقفول في الحالة الحالية. لازم الـEngine يأكد إنه مفتوح.');
      return false;
    }
    if (challenge.schemaVersion !== 1 ||
      challenge.responseMode !== 'multi-select' ||
      challenge.slotId !== 'OBS-W1-E01' ||
      !challenge.options?.length) return false;
    // Explicit close is required for an unrelated paused interface.
    if (this.bridge.snapshot().paused) return false;
    this.current = challenge;
    this.opener = trigger;
    this.pendingSaveFailure = false;
    this.previousAssessment = null;
    this.receipt = null;
    this.receiptTotal = null;
    this.submissionRequestId = null;
    this.selections.clear();
    this.hintIndex = 0;
    this.renderChallenge(challenge);
    this.setOutside('');
    this.phaseValue = 'waiting-pause';
    const id = this.requestId();
    this.pauseRequestId = id;
    this.bridge.dispatch({ type: 'engine.pause.request', requestId: id, reason: 'dialog' });
    this.watchAck('pause');
    return true;
  }

  private readonly handleEvent = (event: GameEvent): void => {
    if (this.destroyed) return;
    switch (event.type) {
      case 'engine.paused':
        if (this.phaseValue !== 'waiting-pause' || event.requestId !== this.pauseRequestId) return;
        this.clearTimeout();
        this.pauseRequestId = null;
        this.setOutside('');
        this.phaseValue = 'active';
        this.dialog.showModal(); // ONLY after authoritative pause ack.
        this.title.focus({ preventScroll: true });
        this.setStatus('اختار دليلين تقدر ترجع لمصدرهم.');
        this.updateSubmit();
        return;
      case 'assessment.recorded':
        if (this.phaseValue !== 'submitting' ||
          event.requestId !== this.submissionRequestId || !this.current ||
          event.result.challengeId !== this.current.id) return;
        this.clearTimeout();
        this.phaseValue = 'feedback';
        this.previousAssessment = event.result;
        this.renderAssessment(event.result);
        return;
      case 'reward.committed':
        if (!this.current || !this.submissionRequestId ||
          event.requestId !== this.submissionRequestId ||
          event.receipt.challengeId !== this.current.id) return;
        if (this.receipt?.id === event.receipt.id) return;
        this.receipt = event.receipt;
        this.receiptTotal = event.xpTotal;
        if (this.phaseValue === 'feedback') this.renderReceipt();
        return;
      case 'save.failed':
        // The contract may omit requestId for global persistence failure.
        if (event.requestId && ![
          this.submissionRequestId, this.pauseRequestId,
          this.closeRequestId, this.resumeRequestId
        ].includes(event.requestId)) return;
        this.pendingSaveFailure = true;
        this.showSaveFailure(event.message);
        return;
      case 'dialog.closed':
        if (this.phaseValue !== 'waiting-close' || event.requestId !== this.closeRequestId) return;
        this.clearTimeout();
        this.closeRequestId = null;
        this.dialog.close();
        this.phaseValue = 'waiting-resume';
        this.resumeRequestId = this.requestId();
        this.bridge.dispatch({ type: 'engine.resume.request', requestId: this.resumeRequestId });
        this.watchAck('resume');
        return;
      case 'engine.resumed':
        if (this.phaseValue !== 'waiting-resume' || event.requestId !== this.resumeRequestId) return;
        this.clearTimeout();
        this.finish();
        return;
      default:
        return;
    }
  };

  private renderChallenge(spec: ChallengeSpecV1): void {
    this.title.textContent = 'عدسة الدليل — المكتبة';
    this.description.textContent = spec.situation || 'لاحظ السلوك من غير ما تخمّن سببه.';
    this.root.querySelector<HTMLElement>('.cq-prompt')!.textContent = spec.prompt;
    this.evidence.replaceChildren();
    if (spec.evidence.length) {
      const heading = document.createElement('h3');
      heading.textContent = 'المعلومات المتاحة';
      this.evidence.append(heading);
      const list = document.createElement('ul');
      for (const item of spec.evidence) {
        const li = document.createElement('li');
        li.textContent = item.text;
        list.append(li);
      }
      this.evidence.append(list);
    }
    this.options.replaceChildren();
    for (const option of spec.options ?? []) {
      const label = document.createElement('label');
      label.className = 'cq-option';
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.value = option.id;
      checkbox.addEventListener('change', () => {
        if (checkbox.checked) this.selections.add(option.id);
        else this.selections.delete(option.id);
        this.updateSubmit();
      });
      const text = document.createElement('span');
      text.textContent = option.text;
      label.append(checkbox, text);
      this.options.append(label);
    }
    this.hint.hidden = true;
    this.hint.textContent = '';
    this.feedback.replaceChildren();
    this.feedback.hidden = true;
    this.root.querySelector<HTMLElement>('.cq-save-error')!.hidden = true;
    this.setStatus('');
  }

  private get requiredCount(): number | null {
    const sets = this.current?.validAnswerSets;
    if (!sets?.length || !sets[0]?.length || !sets.every(x => x.length === sets[0].length)) return null;
    return sets[0].length;
  }

  private updateSubmit(): void {
    const allowed = this.phaseValue === 'active' || this.phaseValue === 'feedback';
    const n = this.selections.size;
    const count = this.requiredCount;
    this.counter.textContent = count === null
      ? `اتحدد ${n} اختيار` : `اتحدد ${n} من ${count}`;
    const locked = !allowed || n === 0 || (count !== null && n !== count);
    this.submit.disabled = locked;
    for (const input of this.options.querySelectorAll<HTMLInputElement>('input')) {
      input.disabled = !allowed || (count !== null && n >= count && !input.checked);
    }
    this.hintButton.disabled = !allowed || !this.current?.hintTiers.length;
    this.closeButton.disabled = this.phaseValue === 'waiting-close';
    this.submit.textContent = this.phaseValue === 'feedback' ? 'حاول تاني' : 'راجع اختياري';
    if (this.previousAssessment?.status === 'PASSED') {
      this.submit.disabled = true;
      this.submit.textContent = 'في انتظار تأكيد الحفظ';
    }
  }

  private readonly submitAnswer = (): void => {
    if (!this.current || !(this.phaseValue === 'active' || this.phaseValue === 'feedback') ||
      this.submit.disabled) return;
    this.phaseValue = 'submitting';
    this.previousAssessment = null;
    this.receipt = null;
    this.receiptTotal = null;
    this.feedback.hidden = true;
    const requestId = this.requestId();
    this.submissionRequestId = requestId;
    this.bridge.dispatch({
      type: 'challenge.submit', requestId, challengeId: this.current.id,
      answer: { mode: 'options', selectedIds: [...this.selections] }
    });
    this.setStatus('بنراجع الاختيارات…');
    this.updateSubmit();
    this.watchAck('assessment');
  };

  private readonly showHint = (): void => {
    if (!this.current || !(this.phaseValue === 'active' || this.phaseValue === 'feedback')) return;
    const tier = this.current.hintTiers[Math.min(this.hintIndex, this.current.hintTiers.length - 1)];
    if (!tier) return;
    this.bridge.dispatch({ type: 'challenge.hint', requestId: this.requestId(), challengeId: this.current.id });
    // UI can display authored hint; UIBridge v1 has no hint acknowledgment to claim consumption.
    this.hint.textContent = 'تلميح من محتوى التحدي: ' + tier;
    this.hint.hidden = false;
    this.hintIndex++;
  };

  private renderAssessment(result: AssessmentResultV1): void {
    this.feedback.hidden = false;
    this.feedback.replaceChildren();
    this.feedback.dataset.state = result.status.toLowerCase();
    const heading = document.createElement('h3');
    heading.textContent = ({
      PASSED: 'تفكير مدعوم بدليل',
      PARTIAL: 'فيه جزء مضبوط وجزء محتاج مراجعة',
      TRY_AGAIN: 'راجع الدليل وجرّب تاني',
      NEEDS_REVIEW: 'الإجابة محتاجة مراجعة'
    } as const)[result.status];
    this.feedback.append(heading);
    const msg = document.createElement('p');
    msg.textContent = result.feedback;
    this.feedback.append(msg);
    if (result.errorCodes.length) {
      const list = document.createElement('ul');
      for (const code of result.errorCodes) {
        const item = document.createElement('li');
        item.textContent = this.current?.feedbackByErrorCode[code] ?? `ملاحظة المراجعة: ${code}`;
        list.append(item);
      }
      this.feedback.append(list);
    }
    if (result.criteria.length) {
      const list = document.createElement('ul');
      for (const c of result.criteria) {
        const item = document.createElement('li');
        item.textContent = c.feedback;
        list.append(item);
      }
      this.feedback.append(list);
    }
    const trust = document.createElement('p');
    trust.className = 'cq-trust';
    trust.textContent = ({
      STRUCTURED_VERIFIED: 'اجتاز فحص الاختيارات المحدد للمهمة. ده مش إثبات لتمكّن إبداعي عام.',
      HUMAN_REVIEWED: 'النتيجة اتراجعت بشريًا حسب الـRubric.',
      SELF_REVIEWED_UNVERIFIED: 'مراجعة ذاتية غير متحقّق منها — مفيش Mastery Badge موثوق.',
      EXTERNAL_DISCUSSION_UNVERIFIED: 'مناقشة خارجية غير متحقّق منها — مش تقييم AI موثوق.',
      NOT_ASSESSED: 'لسه مفيش تقييم مثبت للإجابة.'
    } as const)[result.trust];
    this.feedback.append(trust);
    this.setStatus(result.status === 'PASSED'
      ? 'نتيجة التحدي وصلت. المكافأة مش بتظهر غير بعد تأكيد حفظها.'
      : 'تقدر تعدل اختيارك وتحاول تاني.');
    this.updateSubmit();
    // Reward can precede assessment; only a matching receipt unlocks display.
    this.renderReceipt();
    this.feedback.setAttribute('tabindex', '-1');
    this.feedback.focus({ preventScroll: false });
  }

  private renderReceipt(): void {
    if (!this.previousAssessment || !this.receipt || this.receiptTotal === null ||
      !this.current || this.receipt.challengeId !== this.current.id ||
      !this.dialog.open || this.phaseValue !== 'feedback') return;
    if (this.previousAssessment.status !== 'PASSED' || this.pendingSaveFailure) return;
    const p = document.createElement('p');
    p.className = 'cq-reward';
    p.textContent = `المكافأة اتحفظت: +${this.receipt.xp} XP · الإجمالي ${this.receiptTotal} XP`;
    this.feedback.append(p);
    this.setStatus('المكافأة مؤكدة من الـEngine. تقدر ترجع للعالم.');
    this.updateSubmit();
    this.submit.disabled = true; // no repeated submit or duplicate XP
  }

  private showSaveFailure(message: string): void {
    const text = 'فشل حفظ التقدم. متعتبرش المكافأة محفوظة. ' + message;
    if (this.dialog.open) {
      const area = this.root.querySelector<HTMLElement>('.cq-save-error')!;
      area.textContent = text;
      area.hidden = false;
      this.setStatus('فيه مشكلة في الحفظ. اختار الرجوع لما تكون جاهز.');
    } else this.setOutside(text, false);
  }

  private readonly handleEscape = (event: Event): void => {
    event.preventDefault();
    this.requestClose();
  };

  private readonly requestClose = (): void => {
    if (!this.dialog.open || this.phaseValue === 'waiting-close' ||
      this.phaseValue === 'waiting-resume') return;
    // No closing the DOM until Engine confirms dialog.closed.
    this.phaseValue = 'waiting-close';
    const id = this.requestId();
    this.closeRequestId = id;
    this.bridge.dispatch({ type: 'dialog.close.request', requestId: id });
    this.setStatus('بنقفل التحدي ونرجع للعالم…');
    this.updateSubmit();
    this.watchAck('close');
  };

  private watchAck(what: 'pause' | 'close' | 'resume' | 'assessment'): void {
    this.clearTimeout();
    this.timeout = setTimeout(() => {
      this.timeout = null;
      const msg = ({
        pause: 'الـEngine لسه ما أكّدش إيقاف الحركة. التحدي مش هيفتح قبل التأكيد.',
        close: 'الـEngine ما أكّدش قفل التحدي. تقدر تعيد محاولة الرجوع.',
        resume: 'الـEngine ما أكّدش استكمال اللعب. الحركة ممكن تكون لسه متوقفة.',
        assessment: 'التقييم اتأخر. جرّب إرسال نفس الاختيارات تاني لو حابب.'
      } as const)[what];
      if (what === 'pause' || what === 'resume') this.setOutside(msg, true);
      else {
        this.setStatus(msg);
        if (what === 'close') {
          this.phaseValue = 'feedback';
          this.updateSubmit();
        } else if (what === 'assessment') {
          this.phaseValue = 'active';
          this.updateSubmit();
        }
      }
    }, this.timeoutMs);
  }

  private readonly retryAcknowledgement = (): void => {
    this.setOutside('');
    if (this.phaseValue === 'waiting-pause' && this.current) {
      this.pauseRequestId = this.requestId();
      this.bridge.dispatch({ type: 'engine.pause.request', requestId: this.pauseRequestId, reason: 'dialog' });
      this.watchAck('pause');
    } else if (this.phaseValue === 'waiting-resume') {
      this.resumeRequestId = this.requestId();
      this.bridge.dispatch({ type: 'engine.resume.request', requestId: this.resumeRequestId });
      this.watchAck('resume');
    }
  };

  private setStatus(text: string): void { this.status.textContent = text; }
  private setOutside(text: string, retry = false): void {
    this.outsideStatus.hidden = !text;
    this.outsideStatus.querySelector<HTMLElement>('.cq-global-text')!.textContent = text;
    this.outsideRetry.hidden = !retry;
  }
  private clearTimeout(): void {
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = null;
  }
  private finish(): void {
    this.setOutside('');
    this.phaseValue = 'idle';
    this.current = null;
    this.setStatus('');
    this.previousAssessment = null;
    this.pauseRequestId = null;
    this.closeRequestId = null;
    this.resumeRequestId = null;
    this.submissionRequestId = null;
    this.opener?.focus({ preventScroll: true }); // only after engine.resumed ack
    this.opener = null;
  }

  /** Only call while idle, or after host has separately stopped the Engine. */
  destroy(): void {
    if (this.phaseValue !== 'idle') throw new Error('Cannot destroy UI during an active Engine pause.');
    this.destroyed = true;
    this.clearTimeout();
    this.unsubscribe();
    this.root.remove();
  }

  /**
   * Optional external shell signal until HQ adds availability/capabilities to
   * UIBridgeV1. The UI does NOT independently infer whether cached play is safe.
   * Host must call this only from a trusted runtime/availability decision.
   */
  setAvailability(value: 'ready' | 'offline' | 'locked'): void {
    this.availability = value;
    if (this.phaseValue === 'idle') {
      if (value === 'ready') this.setOutside('');
      else this.setOutside(value === 'offline'
        ? 'إنت Offline. مش هنفترض إن العالم محفوظ على الجهاز أو إنه اتزامن.'
        : 'التحدي مقفول؛ مفيش تأكيد من اللعبة إنه متاح.');
    } else if (this.dialog.open && value !== 'ready') {
      this.setStatus(value === 'offline'
        ? 'الاتصال غير متاح. مش هنوعدك بحفظ التقدم من غير تأكيد.'
        : 'التحدي أصبح غير متاح. الرجوع للعالم من الزر ×.');
    }
  }

  /** Read-only authoritative snapshot, for host HUD integration; never changes state. */
  snapshot(): Readonly<GameSnapshotV1> { return this.bridge.snapshot(); }
}

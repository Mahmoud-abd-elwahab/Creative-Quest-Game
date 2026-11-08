import { FirstChallengeOverlay } from '../challenge-overlay';
import { MockUIBridge } from './mock-bridge';
import { firstChallengeFixture } from './first-challenge';

const mount = document.querySelector<HTMLElement>('#ui-layer');
const trigger = document.querySelector<HTMLButtonElement>('#open-challenge');
const status = document.querySelector<HTMLElement>('#mock-status');
const failSave = document.querySelector<HTMLInputElement>('#simulate-save-failure');
const unverified = document.querySelector<HTMLInputElement>('#simulate-unverified');
const failPause = document.querySelector<HTMLInputElement>('#simulate-pause-failure');
const offline = document.querySelector<HTMLInputElement>('#simulate-offline');
const locked = document.querySelector<HTMLInputElement>('#simulate-locked');
if (!mount || !trigger || !status || !failSave || !unverified || !failPause || !offline || !locked) {
  throw new Error('Mock harness missing required elements');
}
const bridge = new MockUIBridge();
const overlay = new FirstChallengeOverlay({
  mount, bridge, acknowledgementMs: 450,
  resolveOpenedChallenge(challengeId) {
    return challengeId === firstChallengeFixture.id
      ? { challenge: firstChallengeFixture, trigger: trigger! } : null;
  }
});
let requestCounter = 0;
const eventTrace: string[] = [];
function configure(): void {
  bridge.configure({
    saveFailure: failSave!.checked,
    unverified: unverified!.checked,
    pauseFailure: failPause!.checked
  });
  overlay.setAvailability(locked!.checked ? 'locked' : offline!.checked ? 'offline' : 'ready');
}
for (const control of [failSave, unverified, failPause, offline, locked]) control.addEventListener('change', configure);
trigger.addEventListener('click', () => {
  configure();
  status.textContent = 'الحالة: طلب interact.request للـMock Engine (هو اللي هيعمل Pause).';
  if (offline.checked || locked.checked) {
    status.textContent = 'الـHost ما سمحش بالتفاعل: العالم Offline أو التحدي Locked.';
    return;
  }
  if (overlay.phase !== 'idle' || bridge.snapshot().paused) {
    status.textContent = 'التفاعل مش متاح قبل ما يخلص التحدي الحالي.';
    return;
  }
  bridge.dispatch({ type: 'interact.request', requestId: 'mock-world-' + (++requestCounter),
    nodeId: 'mock-library-clue' });
});
bridge.subscribe(event => {
  eventTrace.push(event.type);
  document.documentElement.dataset.mockEventTrace = eventTrace.join('>');
  document.documentElement.dataset.mockPaused = String(bridge.snapshot().paused);
  if (event.type === 'dialog.closed') {
    document.documentElement.dataset.mockPausedAtClose = String(bridge.snapshot().paused);
  }
  if (event.type === 'engine.resumed') {
    document.documentElement.dataset.mockPausedAtResume = String(bridge.snapshot().paused);
  }
  document.documentElement.dataset.mockChallengeId = bridge.snapshot().openChallengeId ?? '';
  status.textContent = 'آخر Mock Event: ' + event.type;
});
document.documentElement.dataset.cqUiMock = 'ready';

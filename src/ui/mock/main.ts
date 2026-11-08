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
const overlay = new FirstChallengeOverlay({ mount, bridge, acknowledgementMs: 450 });
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
  status.textContent = 'الحالة: طلب Pause للـMock Bridge.';
  if (!overlay.open(firstChallengeFixture, trigger)) {
    status.textContent = 'التحدي مش متاح: فيه نافذة مفتوحة أو الـMock paused.';
  }
});
bridge.subscribe(event => {
  status.textContent = 'آخر Mock Event: ' + event.type;
});
document.documentElement.dataset.cqUiMock = 'ready';

/** HQ-only integrated G1 staging entry; distinct from boot proof and published v0.4. */
import Phaser from 'phaser';
import authoredE01 from '../../src/content/levels/obs-w1-e01-inspect-library.json';
import type { ChallengeSpecV1, WorldSpecV1 } from '../../src/contracts/v1';
import { G1EngineBridge } from '../../src/core/g1/engine-bridge';
import { createChallengeCatalog } from '../../src/core/g1/challenge-catalog';
import { ObservationG1Scene } from '../../src/game/g1/observation-scene';
import { DIAGNOSTIC_WORLD } from '../../src/core/g1/technical-fixture';
import { FirstChallengeOverlay } from '../../src/ui/challenge-overlay';

const content = authoredE01 as ChallengeSpecV1;
if (content.id !== 'cq_obs_w01_e01_inspect_v1' || content.slotId !== 'OBS-W1-E01') {
  throw new Error('Unexpected authored W01 E01 ID/slot mismatch');
}
const lookup = createChallengeCatalog([content]); // validate before player sees content
const nodeId = 'g1-observation-w01-e01-clue';
const world: WorldSpecV1 = {
  ...DIAGNOSTIC_WORLD,
  nodes: [{ id: nodeId, kind: 'clue', challengeId: content.id,
    position: { x: 600, y: 640 }, radius: 70 }]
};
const bridge = new G1EngineBridge(world, window.localStorage, undefined, lookup);
const mount = document.getElementById('ui-layer');
const trigger = document.getElementById('inspect') as HTMLButtonElement | null;
const status = document.getElementById('status');
const xpLabel = document.getElementById('xp-label');
const root = document.getElementById('game-root');
if (!mount || !trigger || !status || !xpLabel || !root) throw Error('Missing staging DOM nodes');
const renderXP = (): void => { xpLabel!.textContent = 'XP: ' + bridge.snapshot().xpTotal; };
renderXP();
const overlay = new FirstChallengeOverlay({
  mount, bridge,
  // This resolver is HQ-owned. The Engine decides whether a real interaction opened.
  resolveOpenedChallenge: challengeId => {
    const spec = lookup(challengeId);
    return spec ? { challenge: spec, trigger: trigger! } : null;
  }
});
bridge.subscribe(event => {
  if (event.type === 'dialog.opened') status!.textContent = 'التحدي اتفتح من التفاعل الحقيقي في العالم.';
  if (event.type === 'dialog.closed') status!.textContent = 'النافذة اتقفلت؛ مستني تأكيد استكمال الحركة.';
  if (event.type === 'engine.resumed') status!.textContent = 'الحركة رجعت بعد engine.resume.request.';
  if (event.type === 'reward.committed') {
    renderXP();
    status!.textContent = 'المكافأة اتحفظت مرة واحدة في SaveState الجديد.';
  }
  if (event.type === 'save.failed') status!.textContent = 'الحفظ فشل: ' + event.message;
});
trigger.addEventListener('click', () => {
  if (!bridge.canInteract(nodeId)) {
    status!.textContent = 'اتحرك ناحية علامة CLUE في نص الطريق الأول، وبعدين افحص الدليل.';
    return;
  }
  bridge.dispatch({ type: 'interact.request', nodeId,
    requestId: 'hud-inspect-' + Date.now() + '-' + Math.random().toString(36).slice(2) });
});
const scene = new ObservationG1Scene(bridge, world);
scene.events.once(Phaser.Scenes.Events.CREATE, () => {
  status!.textContent = 'عالم الملاحظة جاهز. قرّب من الدليل واضغط E أو زر الفحص.';
  document.documentElement.dataset.g1Play = 'ready';
});
const game = new Phaser.Game({
  type: Phaser.AUTO, parent: root, backgroundColor: '#1b4038',
  width: 640, height: 360, scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  scene: [scene]
});

bridge.announceSaveHealth();
// Read-only staging browser diagnostic: reports real Bridge proximity/paused/saved XP.
Object.defineProperty(window, '__cqG1Stage', {
  value: Object.freeze({
    state: () => Object.freeze({ near: bridge.nearbyNodeId() === nodeId,
      paused: bridge.snapshot().paused,
      openChallengeId: bridge.snapshot().openChallengeId ?? null,
      xp: bridge.snapshot().xpTotal })
  }), configurable: false
});
window.addEventListener('pagehide', () => { game.destroy(true); bridge.destroy(); }, { once: true });

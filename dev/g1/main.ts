import Phaser from 'phaser';
import type { GameSnapshotV1 } from '../../src/contracts/v1';

// Contract-compatibility proof only. NO real user progress is read or saved.
const provisionalSnapshot: Readonly<GameSnapshotV1> = {
  worldId: 'observation',
  xpTotal: 0,
  paused: false,
  bosses: {},
};
const status = document.querySelector<HTMLElement>('#status');
if (!status) throw new Error('Missing bootstrap status element');

class BootProofScene extends Phaser.Scene {
  constructor() { super({ key: 'BootProof' }); }

  create(): void {
    const width = this.scale.width;
    const height = this.scale.height;
    this.cameras.main.setBackgroundColor('#1b4038');
    this.add.rectangle(width / 2, height / 2, Math.max(140, width - 64), Math.max(90, height - 64), 0x254d41).setStrokeStyle(2, 0xb9d7b7);
    this.add.text(width / 2, height / 2 - 22, 'PHASER 3 · BOOT OK', {
      fontFamily: 'system-ui, sans-serif', fontSize: '24px', color: '#f5f3e8'
    }).setOrigin(0.5);
    this.add.text(width / 2, height / 2 + 22, 'No authored gameplay here', {
      fontFamily: 'system-ui, sans-serif', fontSize: '15px', color: '#dfd4a4'
    }).setOrigin(0.5);
    status!.textContent = 'G1 Boot OK — world: ' + provisionalSnapshot.worldId + ' | محتاج Gameplay Integration وQA.';
    document.documentElement.dataset.g1Boot = 'ok';
  }
}

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game-root',
  backgroundColor: '#1b4038',
  width: 640,
  height: 360,
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  scene: [BootProofScene]
});

// Expose only a technical diagnostic flag, never fake mastery or save state.
window.addEventListener('pagehide', () => { void game.destroy(true); }, { once: true });

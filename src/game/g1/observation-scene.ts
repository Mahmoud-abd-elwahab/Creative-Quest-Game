import Phaser from 'phaser';
import type { CollisionShape, Point, WorldSpecV1 } from '../../contracts/v1.js';
import { G1EngineBridge } from '../../core/g1/engine-bridge.js';
import { DIAGNOSTIC_WORLD } from '../../core/g1/technical-fixture.js';

type MoveKeys = {
  up: Phaser.Input.Keyboard.Key; down: Phaser.Input.Keyboard.Key;
  left: Phaser.Input.Keyboard.Key; right: Phaser.Input.Keyboard.Key;
  w: Phaser.Input.Keyboard.Key; a: Phaser.Input.Keyboard.Key;
  s: Phaser.Input.Keyboard.Key; d: Phaser.Input.Keyboard.Key;
  interact: Phaser.Input.Keyboard.Key;
};
const PLAYER_RADIUS = 15; // collision footprint sample; not a sprite/frame-size standard.
const SPEED_WORLD_PX_PER_SECOND = 225;
const bound = (value: number, low: number, high: number): number => Math.min(high, Math.max(low, value));
const distancePointSegment = (p: Point, a: Point, b: Point): number => {
  const dx = b.x - a.x, dy = b.y - a.y, d2 = dx * dx + dy * dy;
  const t = d2 ? bound(((p.x - a.x) * dx + (p.y - a.y) * dy) / d2, 0, 1) : 0;
  return Math.hypot(p.x - (a.x + dx * t), p.y - (a.y + dy * t));
};
const pointInPolygon = (p: Point, vertices: Point[]): boolean => {
  let inside = false;
  for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
    const a = vertices[i], b = vertices[j];
    if ((a.y > p.y) !== (b.y > p.y)
        && p.x < (b.x - a.x) * (p.y - a.y) / (b.y - a.y) + a.x) inside = !inside;
  }
  return inside;
};
/** Collision in world pixels; feet-anchor center; works for both rect and polygon shapes. */
export function collidesAt(p: Point, shapes: CollisionShape[], radius = PLAYER_RADIUS): boolean {
  return shapes.some(shape => {
    if (shape.kind === 'rect') {
      const r = shape.rect;
      return Math.hypot(p.x - bound(p.x, r.x, r.x + r.width),
        p.y - bound(p.y, r.y, r.y + r.height)) < radius;
    }
    const poly = shape.vertices;
    return poly.length >= 3 && (pointInPolygon(p, poly)
      || poly.some((v, i) => distancePointSegment(p, v, poly[(i + 1) % poly.length]) < radius));
  });
}
/** Avoid hijacking Space/WASD/arrows while a DOM dialog, button, or text field is focused. */
export function gameKeyboardEnabled(element: Element | null = document.activeElement): boolean {
  if (!element || element === document.body || element === document.documentElement) return true;
  const html = element as HTMLElement;
  return !(html.isContentEditable || !!html.closest('input, textarea, select, button, [contenteditable="true"], [role="dialog"]'));
}
/**
 * Actual Phaser 3 scene. HQ should instantiate new ObservationG1Scene(bridge, approvedWorld)
 * from dev/g1/main.ts AFTER QA + producer review. No root edits by Engine.
 */
export class ObservationG1Scene extends Phaser.Scene {
  private hero: Phaser.GameObjects.Container | null = null;
  private keys: MoveKeys | null = null;
  private travelTarget: Point | null = null;
  private virtualAxis: Point = { x: 0, y: 0 };
  private detachPosition: (() => void) | null = null;
  private unsubscribe: (() => void) | null = null;
  private bridgeRequest = 0;
  private indicator: Phaser.GameObjects.Text | null = null;
  private trail: Phaser.GameObjects.Rectangle | null = null;
  constructor(
    private readonly bridge: G1EngineBridge,
    private readonly world: WorldSpecV1 = DIAGNOSTIC_WORLD,
  ) { super({ key: 'G1Observation' }); }

  create(): void {
    this.cameras.main.setBackgroundColor('#184e4e');
    this.cameras.main.setBounds(0, 0, this.world.widthPx, this.world.heightPx);
    const ground = this.add.graphics();
    ground.fillStyle(0x20564c, 1).fillRect(0, 0, this.world.widthPx, this.world.heightPx);
    for (let x = 20; x < this.world.widthPx; x += 90) {
      for (let y = 20; y < this.world.heightPx; y += 90) {
        ground.fillStyle(0x367960, 0.7).fillCircle(x, y, 4);
      }
    }
    this.trail = this.add.rectangle(this.world.spawn.x, this.world.heightPx / 2, 118,
      this.world.heightPx - 90, 0xa3a07d, 0.75).setDepth(1);
    const collision = this.add.graphics().setDepth(2);
    for (const shape of this.world.collisions) {
      collision.fillStyle(0x3a4855, 1).lineStyle(3, 0xbda67c, 1);
      if (shape.kind === 'rect') {
        collision.fillRect(shape.rect.x, shape.rect.y, shape.rect.width, shape.rect.height);
        collision.strokeRect(shape.rect.x, shape.rect.y, shape.rect.width, shape.rect.height);
      } else {
        const points = shape.vertices.map(pt => new Phaser.Math.Vector2(pt.x, pt.y));
        collision.fillPoints(points, true); collision.strokePoints(points, true);
      }
    }
    for (const node of this.world.nodes) {
      const circle = this.add.circle(node.position.x, node.position.y, 33, 0x9d77d0, 1).setDepth(4);
      circle.setStrokeStyle(4, 0xf1edab);
      this.add.text(node.position.x, node.position.y - 78, 'CLUE / INSPECT', {
        fontFamily: 'system-ui', fontSize: '18px', color: '#fff1bd', backgroundColor: '#1e333f',
      }).setOrigin(.5).setDepth(5);
    }
    const spawn = this.world.spawn;
    const shadow = this.add.ellipse(0, 5, 40, 17, 0x152935);
    const body = this.add.rectangle(0, -22, 29, 35, 0x69b7ad);
    const face = this.add.circle(0, -49, 16, 0xffd6ac);
    const head = this.add.rectangle(0, -63, 33, 9, 0x263f4d);
    this.hero = this.add.container(spawn.x, spawn.y, [shadow, body, face, head]).setDepth(10);
    this.cameras.main.startFollow(this.hero, false, .13, .13);
    this.cameras.main.setDeadzone(90, 70);
    this.detachPosition = this.bridge.bindPlayerPosition(() =>
      ({ x: this.hero?.x ?? spawn.x, y: this.hero?.y ?? spawn.y }));
    this.indicator = this.add.text(12, 12, 'WASD / ARROWS · TAP TO MOVE · E TO INSPECT', {
      fontFamily: 'system-ui', fontSize: '14px', color: '#faf5c9', backgroundColor: '#183941',
      padding: { x: 10, y: 9 },
    }).setScrollFactor(0).setDepth(100);
    const keyboard = this.input.keyboard;
    if (keyboard) {
      this.keys = {
        up: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
        down: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
        left: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
        right: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
        w: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
        a: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        s: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
        d: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
        interact: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
      };
    }
    this.input.on(Phaser.Input.Events.POINTER_DOWN, this.handlePointer, this);
    this.unsubscribe = this.bridge.subscribe(event => {
      if (event.type === 'reward.committed' && this.trail) this.trail.setFillStyle(0xb6d886, 1);
    });
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.onSceneShutdown, this);
    this.events.once(Phaser.Scenes.Events.DESTROY, this.onSceneShutdown, this);
  }

  /** Optional virtual joystick adapter for UI specialist; no duplicate player/game state. */
  setVirtualAxis(x: number, y: number): void {
    this.virtualAxis = { x: bound(x, -1, 1), y: bound(y, -1, 1) };
    if (Math.abs(x) + Math.abs(y) > .1) this.travelTarget = null;
  }
  private handlePointer(pointer: Phaser.Input.Pointer): void {
    if (!this.hero || this.bridge.snapshot().paused) return;
    // Phaser pointer.worldX/worldY already accounts for camera scroll/zoom.
    const target = { x: pointer.worldX, y: pointer.worldY };
    const nearby = this.bridge.nearbyNodeId();
    if (nearby && this.world.nodes.some(n => n.id === nearby
      && Math.hypot(target.x - n.position.x, target.y - n.position.y) <= n.radius)) {
      this.requestInspect(nearby); return;
    }
    this.travelTarget = target;
  }
  private requestInspect(nodeId: string): void {
    this.bridge.dispatch({ type: 'interact.request', nodeId, requestId: 'scene:' + ++this.bridgeRequest });
  }
  update(_time: number, delta: number): void {
    if (!this.hero) return;
    if (this.bridge.snapshot().paused || !gameKeyboardEnabled()) {
      this.travelTarget = null;
      this.virtualAxis = { x: 0, y: 0 };
      return;
    }
    const nodeId = this.bridge.nearbyNodeId();
    if (this.indicator) this.indicator.setText(nodeId
      ? 'CLUE IN RANGE · E / TAP TO INSPECT' : 'WASD / ARROWS · TAP TO MOVE · E TO INSPECT');
    if (this.keys && Phaser.Input.Keyboard.JustDown(this.keys.interact) && nodeId) this.requestInspect(nodeId);
    let dx = this.virtualAxis.x, dy = this.virtualAxis.y;
    const keys = this.keys;
    if (keys) {
      dx += Number(keys.d.isDown || keys.right.isDown) - Number(keys.a.isDown || keys.left.isDown);
      dy += Number(keys.s.isDown || keys.down.isDown) - Number(keys.w.isDown || keys.up.isDown);
    }
    if (Math.hypot(dx, dy) > .1) this.travelTarget = null;
    if (this.travelTarget) {
      const dist = Math.hypot(this.travelTarget.x - this.hero.x, this.travelTarget.y - this.hero.y);
      if (dist < 14 || collidesAt(this.travelTarget, this.world.collisions)) this.travelTarget = null;
      else { dx = (this.travelTarget.x - this.hero.x) / dist; dy = (this.travelTarget.y - this.hero.y) / dist; }
    }
    const norm = Math.hypot(dx, dy);
    if (norm < .1) return;
    const dt = Math.min(delta, 40) / 1000;
    const move = SPEED_WORLD_PX_PER_SECOND * dt;
    const x = bound(this.hero.x + dx / norm * move, PLAYER_RADIUS, this.world.widthPx - PLAYER_RADIUS);
    const y = bound(this.hero.y + dy / norm * move, PLAYER_RADIUS, this.world.heightPx - PLAYER_RADIUS);
    // Separate axis sliding avoids getting stuck at obstacle corners.
    if (!collidesAt({ x, y: this.hero.y }, this.world.collisions)) this.hero.x = x;
    if (!collidesAt({ x: this.hero.x, y }, this.world.collisions)) this.hero.y = y;
  }
  private onSceneShutdown(): void {
    this.input.off(Phaser.Input.Events.POINTER_DOWN, this.handlePointer, this);
    this.detachPosition?.(); this.detachPosition = null;
    this.unsubscribe?.(); this.unsubscribe = null;
    this.keys = null; this.hero = null; this.travelTarget = null;
    this.virtualAxis = { x: 0, y: 0 };
    // Bridge is HQ/runtime-owned and may survive a scene transition; do not destroy it here.
  }
}

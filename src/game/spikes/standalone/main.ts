/** Self-contained playable Canvas/TS spike; NOT a Phaser implementation or production entry point. */
import { SpikeBus } from '../../../core/spikes/event-bus.js';
import { loadSpike, rewardOnce, saveSpike, totalXp, type SpikeSave } from '../../../adapters/spikes/legacy-save.js';

const bus = new SpikeBus();
const controller = new AbortController();
const { signal } = controller;
const canvas = document.querySelector<HTMLCanvasElement>('#field');
const action = document.querySelector<HTMLButtonElement>('#action');
const dialog = document.querySelector<HTMLDivElement>('#dialog');
const panel = document.querySelector<HTMLDivElement>('#challenge');
const toast = document.querySelector<HTMLDivElement>('#toast');
const joy = document.querySelector<HTMLDivElement>('#joy');
const stick = document.querySelector<HTMLDivElement>('#stick');
const xpLabel = document.querySelector<HTMLSpanElement>('#xp');
const saveLabel = document.querySelector<HTMLSpanElement>('#save-state');
if (!canvas || !action || !dialog || !panel || !toast || !joy || !stick || !xpLabel || !saveLabel) {
  throw new Error('Spike bootstrap missing one or more required DOM elements');
}
const ctx = canvas.getContext('2d');
if (!ctx) throw new Error('2D canvas is unavailable');
const c: HTMLCanvasElement = canvas;
const g: CanvasRenderingContext2D = ctx;
const actionButton: HTMLButtonElement = action;
const modal: HTMLDivElement = dialog;
const modalBody: HTMLDivElement = panel;
const joystick: HTMLDivElement = joy;
const knob: HTMLDivElement = stick;
const W = 900, H = 900;
const spawn = { x: 450, y: 745 };
const guardian = { x: 450, y: 310 };
const walls = [{ x: 170, y: 430, w: 200, h: 160 }, { x: 535, y: 455, w: 180, h: 160 }, { x: 90, y: 105, w: 230, h: 160 }];
const player = { ...spawn };
const camera = { x: 0, y: 0 };
const joystickAxis = { x: 0, y: 0 };
const keys = new Set<string>();
let target: { x: number; y: number } | null = null;
let stage: 'map' | 'challenge' | 'feedback' = 'map';
let last = performance.now(), frame = 0, viewW = 360, viewH = 640, dpr = 1;
let alive = true, wasNear = false, saved = false;
let data: SpikeSave;
let inputPointer: number | null = null;
let toastTimer = 0;
const storage = window.localStorage;
const loaded = loadSpike(storage);
data = loaded.data;
const near = () => Math.hypot(player.x - guardian.x, player.y - guardian.y) <= 100;
const blocked = (x: number, y: number): boolean => walls.some(r => x > r.x - 21 && x < r.x + r.w + 21 && y > r.y - 21 && y < r.y + r.h + 21);
const clamp = (value: number, low: number, high: number) => Math.max(low, Math.min(high, value));
function resize(): void {
  const rect = c.getBoundingClientRect();
  viewW = Math.max(260, rect.width); viewH = Math.max(320, rect.height);
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  c.width = Math.round(viewW * dpr); c.height = Math.round(viewH * dpr);
  g.setTransform(dpr, 0, 0, dpr, 0, 0);
}
function draw(): void {
  g.clearRect(0, 0, viewW, viewH);
  g.save(); g.translate(-camera.x, -camera.y);
  g.fillStyle = '#174d4e'; g.fillRect(0, 0, W, H);
  for (let x = 24; x < W; x += 55) for (let y = 20; y < H; y += 60) {
    g.fillStyle = (x + y) % 3 === 0 ? '#4b8971' : '#357563';
    g.beginPath(); g.arc(x, y, 3, 0, Math.PI * 2); g.fill();
  }
  g.strokeStyle = '#bd9b72'; g.lineWidth = 135; g.lineCap = 'round';
  g.beginPath(); g.moveTo(spawn.x, 840); g.lineTo(guardian.x, 180); g.stroke();
  g.strokeStyle = '#d9c6a2'; g.lineWidth = 8; g.setLineDash([12, 23]);
  g.beginPath(); g.moveTo(spawn.x, 840); g.lineTo(guardian.x, 180); g.stroke(); g.setLineDash([]);
  for (const r of walls) {
    g.fillStyle = '#193b39'; g.fillRect(r.x + 7, r.y + 8, r.w, r.h);
    g.fillStyle = '#557a6b'; g.fillRect(r.x, r.y, r.w, r.h);
    g.fillStyle = '#8fbc92'; g.fillRect(r.x + 10, r.y + 10, r.w - 20, 12);
  }
  g.fillStyle = '#fff4bc'; g.font = 'bold 18px system-ui'; g.textAlign = 'center';
  g.fillText('OBSERVATION GUARDIAN', guardian.x, guardian.y - 70);
  g.strokeStyle = near() ? '#faff85' : '#da9df6'; g.lineWidth = 4;
  g.beginPath(); g.arc(guardian.x, guardian.y, 53, 0, 2 * Math.PI); g.stroke();
  g.fillStyle = '#6c4c9c'; g.beginPath(); g.arc(guardian.x, guardian.y - 5, 25, 0, 2 * Math.PI); g.fill();
  g.fillStyle = '#eec3ff'; g.beginPath(); g.arc(guardian.x, guardian.y - 19, 14, 0, 2 * Math.PI); g.fill();
  g.fillStyle = '#1a253b'; g.beginPath(); g.ellipse(player.x, player.y + 18, 29, 11, 0, 0, 2 * Math.PI); g.fill();
  g.fillStyle = '#fbd684'; g.fillRect(player.x - 13, player.y + 7, 10, 20); g.fillRect(player.x + 3, player.y + 7, 10, 20);
  g.fillStyle = '#5db4ad'; g.fillRect(player.x - 21, player.y - 22, 42, 39);
  g.fillStyle = '#ffe1b8'; g.beginPath(); g.arc(player.x, player.y - 29, 20, 0, 2 * Math.PI); g.fill();
  g.fillStyle = '#263b4a'; g.fillRect(player.x - 20, player.y - 51, 40, 10);
  g.restore();
}
function step(now: number): void {
  if (!alive) return;
  const dt = Math.min((now - last) / 1000, 0.04); last = now;
  if (stage === 'map') {
    let dx = Number(keys.has('arrowright') || keys.has('d')) - Number(keys.has('arrowleft') || keys.has('a')) + joystickAxis.x;
    let dy = Number(keys.has('arrowdown') || keys.has('s')) - Number(keys.has('arrowup') || keys.has('w')) + joystickAxis.y;
    if (Math.abs(dx) + Math.abs(dy) > .1) target = null;
    if (target) {
      const dist = Math.hypot(target.x - player.x, target.y - player.y);
      if (dist < 12 || blocked(target.x, target.y)) target = null;
      else { dx = (target.x - player.x) / dist; dy = (target.y - player.y) / dist; }
    }
    const length = Math.hypot(dx, dy);
    if (length > .1) {
      dx /= length; dy /= length;
      const move = 245 * dt;
      const nx = clamp(player.x + dx * move, 25, W - 25), ny = clamp(player.y + dy * move, 25, H - 25);
      if (!blocked(nx, player.y)) player.x = nx;
      if (!blocked(player.x, ny)) player.y = ny;
    }
    const isNear = near();
    if (isNear !== wasNear) { wasNear = isNear; bus.emit('map:state', { near: isNear, stage }); }
  }
  camera.x = clamp(player.x - viewW / 2, 0, Math.max(0, W - viewW));
  camera.y = clamp(player.y - viewH / 2, 0, Math.max(0, H - viewH));
  draw(); frame = requestAnimationFrame(step);
}
function requestInteraction(): void {
  if (stage !== 'map') return;
  if (!near()) { bus.emit('toast', { message: 'قرّب من الحارس الأول' }); return; }
  stage = 'challenge'; target = null; keys.clear();
  bus.emit('challenge:open', { id: 'guardian-observation-01' });
  bus.emit('map:state', { near: true, stage });
}
function returnToMap(): void {
  stage = 'map'; target = null; keys.clear();
  joystickAxis.x = 0; joystickAxis.y = 0; knob.style.transform = '';
  bus.emit('map:state', { near: near(), stage });
}
function progress(): void {
  bus.emit('progress:changed', { xp: totalXp(data), completed: data.completed.includes('guardian-observation-01'), source: loaded.source, saved });
}
bus.on('interaction:request', () => requestInteraction(), signal);
bus.on('challenge:close', () => returnToMap(), signal);
bus.on('input:move', axis => { joystickAxis.x = axis.x; joystickAxis.y = axis.y; target = null; }, signal);
bus.on('challenge:submit', ({ answerId }) => {
  if (stage !== 'challenge') return;
  if (answerId !== 'evidence') {
    bus.emit('challenge:feedback', { correct: false, completed: false,
      message: 'ده تفسير نفسي من غير دليل. Observation لازم توصف فعل ظاهر.' });
    return;
  }
  data = rewardOnce(data, 'guardian-observation-01', 20);
  saved = saveSpike(storage, data);
  stage = 'feedback';
  bus.emit('challenge:feedback', { correct: true, completed: true,
    message: 'صح. إنت فرّقت بين السلوك اللي اتشاف وبين تفسير نية الشخص. +20 XP مرة واحدة بس.' });
  progress();
}, signal);
// DOM/UI only communicates with the Canvas runtime through the private typed event bus.
bus.on('challenge:open', () => {
  modal.hidden = false;
  const previouslyDone = data.completed.includes('guardian-observation-01');
  modalBody.innerHTML = `<h2 id="challenge-title">حارس الملاحظة</h2>
    <p>عميل بيقول: «ناس كتير بتدخل المحل، بتصور المنتجات، وبتمشي من غير ما تشتري».</p>
    <p><strong>إيه الـObservation المدعومة بالدليل؟</strong></p>
    <div class="answers">
      <button data-answer="guess">الناس مش واثقة في جودة المنتجات.</button>
      <button data-answer="evidence">بعض الزوار بيصوروا المنتجات وبيمشوا من غير شراء.</button>
      <button data-answer="judgment">الزوار بخلا ومش مقدّرين الأسعار.</button>
    </div><p id="feedback" aria-live="polite"></p>
    <button id="return" class="secondary">ارجع للخريطة</button>`;
  const choices = modalBody.querySelectorAll<HTMLButtonElement>('[data-answer]');
  if (previouslyDone) {
    choices.forEach(btn => { btn.disabled = true; });
    modalBody.querySelector<HTMLParagraphElement>('#feedback')!.textContent = 'التحدي مكتمل. المكافأة مش هتتكرر.';
  } else {
    choices.forEach(btn => btn.addEventListener('click', () => bus.emit('challenge:submit', { answerId: btn.dataset.answer || '' }), { signal }));
  }
  modalBody.querySelector<HTMLButtonElement>('#return')!.addEventListener('click', () => closeModal(), { signal });
  modalBody.querySelector<HTMLButtonElement>('#return')!.focus();
}, signal);
bus.on('challenge:feedback', feedback => {
  const f = modalBody.querySelector<HTMLParagraphElement>('#feedback');
  if (f) f.textContent = feedback.message;
  if (feedback.completed) {
    modalBody.querySelectorAll<HTMLButtonElement>('[data-answer]').forEach(btn => { btn.disabled = true; });
    const btn = modalBody.querySelector<HTMLButtonElement>('#return');
    if (btn) { btn.textContent = 'كمّل استكشاف الخريطة'; btn.focus(); }
  }
}, signal);
function closeModal(): void {
  if (modal.hidden) return;
  modal.hidden = true; modalBody.replaceChildren();
  bus.emit('challenge:close', undefined); actionButton.focus();
}
bus.on('map:state', ({ near: closeEnough, stage: viewStage }) => {
  actionButton.disabled = viewStage !== 'map';
  actionButton.textContent = closeEnough ? 'تفاعل مع الحارس' : 'قرّب من الحارس';
}, signal);
bus.on('progress:changed', ({ xp, completed, source, saved: isSaved }) => {
  xpLabel.textContent = String(xp);
  saveLabel.textContent = `${completed ? 'تحدي مكتمل' : 'تحدي متاح'} · ${source} · ${isSaved ? 'saved' : 'read-only until reward'}`;
}, signal);
bus.on('toast', ({ message }) => {
  toast!.textContent = message; toast!.hidden = false; window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => { toast!.hidden = true; }, 2200);
}, signal);
actionButton.addEventListener('click', () => bus.emit('interaction:request', undefined), { signal });
window.addEventListener('keydown', e => {
  const key = e.key.toLowerCase();
  if (e.key === 'Escape' && !modal.hidden) { e.preventDefault(); closeModal(); return; }
  if (stage !== 'map' || (e.target instanceof HTMLElement && /^(TEXTAREA|INPUT)$/.test(e.target.tagName))) return;
  if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' ', 'e', 'w', 'a', 's', 'd'].includes(key)) e.preventDefault();
  if (key === ' ' || key === 'e') { if (!e.repeat) bus.emit('interaction:request', undefined); }
  else keys.add(key);
}, { signal });
window.addEventListener('keyup', e => { keys.delete(e.key.toLowerCase()); }, { signal });
window.addEventListener('blur', () => { keys.clear(); joystickAxis.x = 0; joystickAxis.y = 0; }, { signal });
window.addEventListener('resize', resize, { signal });
c.addEventListener('pointerdown', e => {
  if (stage !== 'map') return;
  const box = c.getBoundingClientRect();
  target = { x: (e.clientX - box.left) + camera.x, y: (e.clientY - box.top) + camera.y };
}, { signal });
const moveStick = (e: PointerEvent): void => {
  const b = joystick.getBoundingClientRect();
  const x = e.clientX - b.left - b.width / 2, y = e.clientY - b.top - b.height / 2;
  const d = Math.max(1, Math.hypot(x, y)), m = 40;
  knob.style.transform = `translate(${x / d * Math.min(d, m)}px, ${y / d * Math.min(d, m)}px)`;
  bus.emit('input:move', { x: clamp(x / m, -1, 1), y: clamp(y / m, -1, 1) });
};
const endStick = (): void => {
  inputPointer = null; knob.style.transform = '';
  bus.emit('input:move', { x: 0, y: 0 });
};
joystick.addEventListener('pointerdown', e => {
  e.preventDefault(); inputPointer = e.pointerId; joystick.setPointerCapture(e.pointerId); moveStick(e);
}, { signal });
joystick.addEventListener('pointermove', e => { if (inputPointer === e.pointerId) moveStick(e); }, { signal });
joystick.addEventListener('pointerup', endStick, { signal });
joystick.addEventListener('pointercancel', endStick, { signal });
joystick.addEventListener('lostpointercapture', endStick, { signal });
function destroy(): void {
  alive = false; controller.abort(); cancelAnimationFrame(frame); window.clearTimeout(toastTimer);
  keys.clear(); target = null;
}
window.addEventListener('pagehide', destroy, { signal });
resize(); bus.emit('map:state', { near: false, stage }); progress(); requestAnimationFrame(step);
if (loaded.warning) bus.emit('toast', { message: loaded.warning });

/** HQ G1 actual WorldNode -> authored E01 -> DOM UI -> SaveState smoke. NOT production release. */
import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';
import { mkdirSync } from 'node:fs';
import { setTimeout as delay } from 'node:timers/promises';
import { chromium } from 'playwright';

const url = 'http://127.0.0.1:4175/Creative-Quest-Game/g1/play.html';
const evidence = 'dev/g1/evidence/actual-interaction';
mkdirSync(evidence, { recursive: true });
const server = spawn(process.execPath, [
  'node_modules/vite/bin/vite.js', 'preview', '--config', 'vite.g1.config.mjs',
  '--host', '127.0.0.1', '--port', '4175', '--strictPort'
], { stdio: 'pipe' });
let stderr = '';
server.stderr.on('data', data => { stderr += String(data); });
async function waitForServer() {
  for (let i = 0; i < 120; i++) {
    if (server.exitCode !== null) throw new Error('Vite preview exited: ' + stderr);
    try { if ((await fetch(url)).ok) return; } catch {}
    await delay(125);
  }
  throw new Error('Could not start G1 preview: ' + stderr);
}
const legacy = JSON.stringify({
  done: [2], unlocked: 3, xp: 35, attempts: {}, answers: {}, bossPhase: 0,
  bossPhases: {}, started: true, unknownOriginalField: { keepMe: true }
});
let browser;
try {
  await waitForServer();
  browser = await chromium.launch({ headless: true });
  for (const device of [
    { name: 'desktop1280', viewport: { width: 1280, height: 800 }, mobile: false },
    { name: 'mobile360', viewport: { width: 360, height: 740 }, mobile: true }
  ]) {
    const context = await browser.newContext({
      viewport: device.viewport, isMobile: device.mobile, hasTouch: device.mobile,
      deviceScaleFactor: device.mobile ? 2 : 1, reducedMotion: 'reduce'
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    // First visit creates the origin; second visit imports an actual existing v0.4 record.
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.evaluate(old => localStorage.setItem('creative-quest-2d-v02', old), legacy);
    await page.reload({ waitUntil: 'domcontentloaded' });
    try {
      await page.waitForFunction(() => document.documentElement.dataset.g1Play === 'ready', null, { timeout: 8500 });
    } catch (error) {
      const state = await page.evaluate(() => ({
        stageReady: document.documentElement.dataset.g1Play ?? null,
        canvasCount: document.querySelectorAll('#game-root canvas').length,
        stageAvailable: Boolean(window.__cqG1Stage),
        status: document.getElementById('status')?.textContent ?? ''
      }));
      throw new Error('G1 scene did not become ready: ' +
        JSON.stringify({ state, errors, cause: String(error) }));
    }
    const canvas = page.locator('#game-root canvas');
    await canvas.waitFor({ state: 'visible' });
    const stage = () => page.evaluate(() => window.__cqG1Stage.state());
    const start = await stage();
    assert.equal(start.near, false, 'hero must begin away from first clue');
    assert.equal(start.xp, 35, 'G1 imported legacy XP non-destructively');
    assert.equal(await page.evaluate(() => localStorage.getItem('creative-quest-2d-v02')), legacy);
    // Real Phaser keyboard movement, not diagnostics/openLevel shortcut.
    await canvas.click({ position: { x: 15, y: 15 } });
    await page.keyboard.down('ArrowUp');
    try {
      await page.waitForFunction(() => window.__cqG1Stage.state().near, null, { timeout: 6000 });
    } finally {
      await page.keyboard.up('ArrowUp');
    }
    const near = await stage();
    assert.equal(near.near, true, 'moving actor approached physical WorldNode');
    await page.keyboard.press('e', { delay: 130 }); // real scene requests interact
    await page.locator('.cq-dialog[open]').waitFor({ state: 'visible', timeout: 7000 });
    assert.equal((await stage()).paused, true);
    assert.equal((await stage()).openChallengeId, 'cq_obs_w01_e01_inspect_v1');
    assert.match(await page.locator('.cq-prompt').textContent(), /إيصالات|الدليل|اتنين/);
    const picks = page.locator('.cq-option input');
    await picks.nth(0).check();
    await picks.nth(4).check(); // unsupported motive, should not earn XP
    await page.locator('.cq-submit').click();
    await page.locator('.cq-feedback[data-state="try_again"]').waitFor();
    assert.equal((await stage()).xp, 35, 'unsupported motive must never mint XP');
    await page.locator('.cq-hint-button').click();
    await page.locator('.cq-hint:not([hidden])').waitFor();
    await picks.nth(4).uncheck();
    await picks.nth(1).check();
    await page.locator('.cq-submit').click();
    await page.locator('.cq-feedback[data-state="passed"]').waitFor();
    await page.locator('.cq-reward').waitFor();
    assert.match(await page.locator('.cq-reward').textContent(), /\+20 XP/);
    assert.equal((await stage()).xp, 55);
    const save = await page.evaluate(() => JSON.parse(localStorage.getItem('creative-quest-2d-v1')));
    assert.equal(save.xpTotal, 55);
    assert.equal(save.receipts.length, 1);
    assert.equal(await page.evaluate(() => localStorage.getItem('creative-quest-2d-v02')), legacy);
    await page.screenshot({ path: `${evidence}/real-e01-${device.name}.png`, fullPage: true });
    await page.keyboard.press('Escape');
    await page.waitForFunction(() => !document.querySelector('.cq-dialog')?.open);
    await page.waitForFunction(() => window.__cqG1Stage.state().paused === false);
    assert.equal(await page.evaluate(() => document.activeElement?.id), 'inspect');
    assert.equal((await stage()).openChallengeId, null);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => document.documentElement.dataset.g1Play === 'ready');
    assert.equal((await stage()).xp, 55, 'new G1 XP should survive reload');
    assert.equal(await page.evaluate(() => localStorage.getItem('creative-quest-2d-v02')), legacy);
    const after = await page.evaluate(() => JSON.parse(localStorage.getItem('creative-quest-2d-v1')));
    assert.equal(after.receipts.length, 1, 'receipt must survive reload exactly once');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    assert.equal(overflow, false, 'full page must fit viewport horizontally');
    assert.deepEqual(errors, [], 'no browser page errors');
    console.log('PASS:', device.name,
      'real move -> WorldNode -> authored E01 -> wrong/hint/correct -> receipt -> resume/focus -> reload');
    await context.close();
  }
  // QA #48: even reading window.localStorage can throw. Scene must still boot,
  // visibly warn and prohibit progress persistence; never write fake XP.
  {
    const restricted = await browser.newContext({ viewport: { width: 360, height: 740 } });
    await restricted.addInitScript(() => {
      Object.defineProperty(window, 'localStorage', {
        configurable: true,
        get() { throw new DOMException('Storage blocked', 'SecurityError'); }
      });
    });
    const page = await restricted.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => document.documentElement.dataset.g1Play === 'ready', null, { timeout: 18000 });
    const status = await page.locator('#status').innerText();
    assert.match(status, /الحفظ|غير متاح|Save/i, 'restricted storage must show save warning');
    const state = await page.evaluate(() => window.__cqG1Stage.state());
    assert.equal(state.xp, 0, 'inaccessible storage may not invent XP');
    assert.deepEqual(errors, [], 'blocked localStorage getter must not crash stage boot');
    await page.screenshot({ path: `${evidence}/restricted-storage-boot.png`, fullPage: true });
    console.log('PASS: blocked localStorage getter -> safe scene boot + save warning + zero invented XP');
    await restricted.close();
  }
  console.log('G1 staged first-challenge E2E browser smoke PASS — no physical Android or pedagogical signoff.');
} finally {
  if (browser) await browser.close();
  server.kill('SIGTERM');
}

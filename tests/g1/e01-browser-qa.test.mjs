/**
 * Independent QA Playwright test; real playable G1 staging page, NOT production.
 *
 * npm ci && npm run build:g1
 * node --test tests/g1/e01-browser-qa.test.mjs
 * No skip-as-pass; screenshot+JSON in qa/evidence/g1/runtime/.
 * Current G1 EXPECTED RED: inaccessible PARTIAL (Issue #46), stale success
 * status / repeated rubric explanation (Issue #47).
 */
import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { setTimeout as pause } from 'node:timers/promises';
import { chromium } from 'playwright';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const evidence = resolve(root, 'qa/evidence/g1/runtime');
const url = 'http://127.0.0.1:4187/Creative-Quest-Game/g1/play.html';
const legacyKey = 'creative-quest-2d-v02', currentKey = 'creative-quest-2d-v1';
const legacy = JSON.stringify({
  done: [2], unlocked: 10, xp: 35, attempts: {}, answers: {}, bossPhase: 2,
  bossPhases: { '20': 1 }, started: true, unknownOriginalField: { preserve: true }
});
let server, browser, stderr = '';
before(async () => {
  await mkdir(evidence, { recursive: true });
  server = spawn(process.execPath, [
    'node_modules/vite/bin/vite.js', 'preview', '--config', 'vite.g1.config.mjs',
    '--host', '127.0.0.1', '--port', '4187', '--strictPort'
  ], { cwd: root, stdio: 'pipe' });
  server.stderr.on('data', chunk => { stderr += String(chunk); });
  let online = false;
  for (let n = 0; n < 100; n++) {
    if (server.exitCode !== null) throw Error('Vite exited: ' + stderr);
    try { if ((await fetch(url)).ok) { online = true; break; } } catch {}
    await pause(160);
  }
  assert.equal(online, true, 'G1 preview did not load at Pages-safe subpath: ' + stderr);
  browser = await chromium.launch({ headless: true });
});
after(async () => {
  if (browser) await browser.close();
  if (server) server.kill('SIGTERM');
});

async function pageFor(t, name, settings = {}) {
  const context = await browser.newContext({
    viewport: settings.viewport ?? { width: 1280, height: 800 },
    deviceScaleFactor: settings.mobile ? 2 : 1,
    isMobile: settings.mobile ?? false, hasTouch: settings.mobile ?? false,
    reducedMotion: 'reduce'
  });
  if (settings.save !== false) {
    await context.addInitScript(({ key, old }) => {
      if (localStorage.getItem(key) === null) localStorage.setItem(key, old);
    }, { key: legacyKey, old: settings.save ?? legacy });
  }
  const page = await context.newPage();
  const errors = [], network = [];
  page.on('pageerror', error => errors.push('pageerror: ' + error.message));
  page.on('console', message => {
    if (message.type() === 'error') errors.push('console: ' + message.text());
  });
  page.on('requestfailed', req => network.push(req.url() + ' : ' + req.failure()?.errorText));
  t.after(async () => {
    try {
      await page.screenshot({ path: join(evidence, name + '.png'), fullPage: true,
        animations: 'disabled' });
    } catch {}
    await writeFile(join(evidence, name + '.json'), JSON.stringify({
      case: name, pageUrl: page.url(), viewport: page.viewportSize(),
      browserVersion: browser.version(), os: process.platform,
      errors, network, sha: process.env.GITHUB_SHA ?? 'local-unpinned-checkout',
      timestamp: new Date().toISOString()
    }, null, 2));
    await context.close();
  });
  const response = await page.goto(url, { waitUntil: 'domcontentloaded' });
  assert.equal(response?.status(), 200);
  await page.waitForFunction(() => document.documentElement.dataset.g1Play === 'ready',
    null, { timeout: 15000 });
  await page.locator('#game-root canvas').waitFor({ state: 'visible' });
  assert.equal(await page.evaluate(() => localStorage.getItem('creative-quest-2d-v02')),
    settings.save === false ? null : (settings.save ?? legacy));
  return { page, context, errors, network };
}
const stage = page => page.evaluate(() => window.__cqG1Stage.state());
const oldBytes = page => page.evaluate(k => localStorage.getItem(k), legacyKey);
const newState = page => page.evaluate(k => {
  const value = localStorage.getItem(k); return value ? JSON.parse(value) : null;
}, currentKey);

async function openWorldNode(page) {
  const canvas = page.locator('#game-root canvas');
  await canvas.click({ position: { x: 15, y: 15 } });
  await page.keyboard.down('ArrowUp');
  try {
    await page.waitForFunction(() => window.__cqG1Stage.state().near, null, { timeout: 8000 });
  } finally { await page.keyboard.up('ArrowUp'); }
  assert.equal((await stage(page)).near, true);
  await page.keyboard.press('e');
  await page.locator('.cq-dialog[open]').waitFor({ state: 'visible', timeout: 7000 });
  assert.equal((await stage(page)).paused, true);
  assert.equal((await stage(page)).openChallengeId, 'cq_obs_w01_e01_inspect_v1');
  assert.equal(await page.evaluate(() => document.activeElement?.id), 'cq-title');
}
const pick = async (page, a, b) => {
  const inputs = page.locator('.cq-option input');
  await inputs.nth(a).check();
  if (b !== undefined) await inputs.nth(b).check();
};

test('real WorldNode → valid evidence pair → one durable receipt → reload', async t => {
  const { page, errors } = await pageFor(t, '01-desktop-valid-and-reload');
  await openWorldNode(page);
  assert.equal((await stage(page)).xp, 35);
  await pick(page, 0, 1);
  await page.locator('.cq-submit').click();
  await page.locator('.cq-reward').waitFor({ state: 'visible' });
  assert.equal((await stage(page)).xp, 55);
  assert.equal((await newState(page)).receipts.length, 1);
  assert.equal(await oldBytes(page), legacy);
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => !document.querySelector('.cq-dialog')?.open);
  await page.waitForFunction(() => window.__cqG1Stage.state().paused === false);
  assert.equal(await page.evaluate(() => document.activeElement?.id), 'inspect');
  assert.equal((await stage(page)).openChallengeId, null);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.documentElement.dataset.g1Play === 'ready');
  assert.equal((await stage(page)).xp, 55);
  assert.equal((await newState(page)).receipts.length, 1);
  assert.equal((await newState(page)).masteryBySkill.OBS, undefined);
  assert.equal((await newState(page)).bosses['observation'], undefined);
  assert.equal(await oldBytes(page), legacy);
  assert.deepEqual(errors, []);
});

test('real unsupported motive → no XP → hint → retry valid → single receipt', async t => {
  const { page, errors } = await pageFor(t, '02-wrong-hint-retry');
  await openWorldNode(page);
  await pick(page, 0, 4);
  await page.locator('.cq-submit').click();
  await page.locator('.cq-feedback[data-state="try_again"]').waitFor();
  assert.equal((await stage(page)).xp, 35);
  assert.equal((await newState(page)), null, 'wrong answer must not write G1 save');
  await page.locator('.cq-hint-button').click();
  await page.locator('.cq-hint:not([hidden])').waitFor();
  await page.locator('.cq-option input').nth(4).uncheck();
  await page.locator('.cq-option input').nth(2).check();
  await page.locator('.cq-submit').click();
  await page.locator('.cq-reward').waitFor();
  assert.equal((await stage(page)).xp, 55);
  assert.equal((await newState(page)).receipts.length, 1);
  assert.deepEqual(errors, []);
});

test('P1 #46: normal UI must permit partial submission of one valid evidence', async t => {
  const { page } = await pageFor(t, '03-partial-not-reachable');
  await openWorldNode(page);
  await pick(page, 0);
  assert.equal(await page.locator('.cq-submit').isEnabled(), true,
    'E01 evaluator supports PARTIAL but the real UI locks Submit until 2 picked');
  await page.locator('.cq-submit').click();
  await page.locator('.cq-feedback[data-state="partial"]').waitFor();
  assert.equal((await stage(page)).xp, 35);
});

test('P2 #47: confirmed receipt must not show stale waiting message or repeated criterion copy', async t => {
  const { page } = await pageFor(t, '04-success-feedback-clarity');
  await openWorldNode(page);
  await pick(page, 0, 2);
  await page.locator('.cq-submit').click();
  await page.locator('.cq-reward').waitFor();
  assert.doesNotMatch(await page.locator('.cq-submit').innerText(), /في انتظار تأكيد الحفظ/,
    'Save is already committed, but the action still says waiting for confirmation');
  const criteria = await page.locator('.cq-feedback ul li').allTextContents();
  assert.equal(criteria.length, new Set(criteria.map(x => x.trim())).size,
    'Two rubric criteria repeat the same exact sentence');
});

test('real touch pointer navigation, portrait 360 and RTL modal bounds', async t => {
  const { page, errors } = await pageFor(t, '05-mobile-touch-portrait', {
    mobile: true, viewport: { width: 360, height: 740 }
  });
  const canvas = page.locator('#game-root canvas');
  let near = false;
  for (let i = 0; i < 8 && !near; i++) {
    const rect = await canvas.boundingBox();
    await canvas.tap({ position: { x: rect.width * 0.5, y: rect.height * 0.30 } });
    await page.waitForTimeout(650);
    near = (await stage(page)).near;
  }
  assert.equal(near, true, 'Actual touch-to-move should reach the WorldNode on portrait mobile');
  await page.locator('#inspect').tap();
  await page.locator('.cq-dialog[open]').waitFor();
  const bounds = await page.locator('.cq-dialog').boundingBox();
  assert.ok(bounds && bounds.x >= -1 && bounds.x + bounds.width <= 361);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true);
  assert.equal(await page.locator('.cq-close').getAttribute('aria-label'),
    'اقفل التحدي وارجع للعالم');
  await page.locator('.cq-close').tap();
  await page.waitForFunction(() => !document.querySelector('.cq-dialog')?.open);
  await page.waitForFunction(() => window.__cqG1Stage.state().paused === false);
  assert.equal(await page.evaluate(() => document.activeElement?.id), 'inspect');
  assert.deepEqual(errors, []);
});

test('landscape 740x360: no horizontal clipping and focus returned', async t => {
  const { page, errors } = await pageFor(t, '06-mobile-landscape', {
    mobile: true, viewport: { width: 740, height: 360 }
  });
  await openWorldNode(page);
  const bounds = await page.locator('.cq-dialog').boundingBox();
  assert.ok(bounds && bounds.x >= -1 && bounds.x + bounds.width <= 741);
  assert.ok(bounds.y >= -1 && bounds.y + bounds.height <= 361);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true);
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => !document.querySelector('.cq-dialog')?.open);
  assert.equal(await page.evaluate(() => document.activeElement?.id), 'inspect');
  assert.deepEqual(errors, []);
});

test('corrupt old save never overwritten and never mints unverifiable XP', async t => {
  const bad = '{"done":"invalid","xp":999}';
  const { page } = await pageFor(t, '07-corrupt-legacy-save', { save: bad });
  assert.equal((await stage(page)).xp, 0);
  await openWorldNode(page);
  await pick(page, 0, 1);
  await page.locator('.cq-submit').click();
  await page.locator('.cq-save-error:not([hidden])').waitFor({ timeout: 5000 });
  assert.equal((await stage(page)).xp, 0);
  assert.equal((await newState(page)), null);
  assert.equal(await oldBytes(page), bad);
});


test('quota denied: correct answer cannot mint unpersisted XP', async t => {
  const { page } = await pageFor(t, '08-quota-denied');
  await page.addInitScript(key => {
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function (name, value) {
      if (name === key) throw new DOMException('Quota exceeded', 'QuotaExceededError');
      return original.call(this, name, value);
    };
  }, currentKey);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.documentElement.dataset.g1Play === 'ready');
  await openWorldNode(page);
  await pick(page, 0, 1);
  await page.locator('.cq-submit').click();
  await page.locator('.cq-save-error:not([hidden])').waitFor();
  assert.equal((await stage(page)).xp, 35);
  assert.equal(await oldBytes(page), legacy);
  assert.equal(await newState(page), null);
  assert.equal(await page.locator('.cq-reward').count(), 0);
});

test('blocked localStorage getter: fail gracefully rather than crash staging', async t => {
  const context = await browser.newContext({ viewport: { width: 360, height: 740 } });
  await context.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      get() { throw new DOMException('Blocked', 'SecurityError'); }
    });
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  t.after(async () => {
    try {
      await page.screenshot({ path: join(evidence, '09-storage-getter-blocked.png'),
        fullPage: true });
    } catch {}
    await writeFile(join(evidence, '09-storage-getter-blocked.json'),
      JSON.stringify({ url, errors, browser: browser.version(),
        status: 'expected-red if staging script aborts on window.localStorage access'
      }, null, 2));
    await context.close();
  });
  const response = await page.goto(url, { waitUntil: 'domcontentloaded' });
  assert.equal(response?.status(), 200);
  await page.waitForFunction(() => document.documentElement.dataset.g1Play === 'ready',
    null, { timeout: 4000 });
  assert.deepEqual(errors, [], 'LocalStorage getter exception must not abort game bootstrap');
  assert.match(await page.locator('#status').innerText(), /الحفظ|Save|غير متاح/i);
});

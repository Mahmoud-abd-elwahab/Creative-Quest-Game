/**
 * Real browser regression tests for unmodified v0.4, served from the Pages subpath.
 *
 * Prerequisites (HQ CI / developer machine):
 *   npm install --no-save --package-lock=false playwright
 *   npx playwright install chromium
 * Run: node --test tests/legacy/v04-browser.test.mjs
 *
 * Missing Playwright causes explicit prerequisite FAIL and browser test SKIPs,
 * not green CI; browser availability is a release gate.
 * Uses only tests/ and qa/ for test code and generated evidence.
 */
import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, extname, resolve, sep, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const SAVE_KEY = 'creative-quest-2d-v02';
const prefix = '/Creative-Quest-Game/';
const evidenceDir = process.env.QA_EVIDENCE_DIR || resolve(root, 'qa/evidence/runtime');
const types = { '.html': 'text/html', '.svg': 'image/svg+xml',
  '.js': 'text/javascript', '.webmanifest': 'application/manifest+json' };
let pw = null;
try { pw = await import('playwright'); } catch { /* report SKIPPED, never pass */ }
const skipBrowser = pw ? false :
  'BLOCKED: playwright/browser binary unavailable; install prerequisites first';

// Critical gate: skipped tests cannot yield a green CI exit status.
test('Playwright browser test prerequisites are present', () => {
  assert.ok(pw, 'BLOCKED: install Playwright + Chromium. All browser skips are NOT a PASS.');
});
let server, browser, base;

if (pw) {
  before(async () => {
    server = createServer(async (req, res) => {
      const pathname = new URL(req.url || '/', 'http://localhost').pathname;
      if (!pathname.startsWith(prefix)) {
        res.writeHead(404); res.end('not in Pages subpath'); return;
      }
      const relative = decodeURIComponent(pathname.slice(prefix.length)) || 'index.html';
      const absolute = resolve(root, relative);
      if (!absolute.startsWith(root + sep) || relative.includes('..')) {
        res.writeHead(403); res.end('invalid path'); return;
      }
      try {
        const body = await readFile(absolute);
        res.writeHead(200, { 'Content-Type': types[extname(absolute)] || 'application/octet-stream',
          'Cache-Control': 'no-store' });
        res.end(body);
      } catch {
        res.writeHead(404); res.end('not found');
      }
    });
    await new Promise((ok) => server.listen(0, '127.0.0.1', ok));
    base = 'http://127.0.0.1:' + server.address().port + prefix;
    browser = await pw.chromium.launch({ headless: true });
  });
  after(async () => {
    if (browser) await browser.close();
    if (server) await new Promise((ok) => server.close(ok));
  });
}

async function session(t, name, options = {}) {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    serviceWorkers: 'allow',
    ...options.context
  });
  if (options.save) {
    await context.addInitScript(({ key, value }) => {
      if (localStorage.getItem(key) === null) localStorage.setItem(key, JSON.stringify(value));
    }, { key: SAVE_KEY, value: options.save });
  }
  const page = await context.newPage();
  const runtimeErrors = [], consoleErrors = [];
  page.on('pageerror', (error) => runtimeErrors.push(String(error)));
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  t.after(async () => {
    await mkdir(evidenceDir, { recursive: true });
    try { await page.screenshot({ path: join(evidenceDir, name + '.png'), fullPage: true }); }
    catch { /* page might be gone; log continues */ }
    await writeFile(join(evidenceDir, name + '.json'), JSON.stringify({
      test: name, url: page.url(), browser: browser.version(),
      viewport: page.viewportSize(), runtimeErrors, consoleErrors,
      timestamp: new Date().toISOString()
    }, null, 2));
    await context.close();
  });
  await page.goto(base, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => Boolean(window.CreativeQuestDiagnostics));
  return { page, context, runtimeErrors, consoleErrors };
}

async function begin(page) {
  await page.locator('#start').click();
  await page.locator('#overlay').waitFor({ state: 'hidden' });
}

const bossFixture = () => ({
  done: Array.from({ length: 9 }, (_, i) => i + 1),
  unlocked: 10, xp: 180, attempts: {}, answers: {}, bossPhase: 0,
  bossPhases: {}, started: true
});

const state = (page) => page.evaluate(() => window.CreativeQuestDiagnostics.getState());
const stored = (page) => page.evaluate((key) => JSON.parse(localStorage.getItem(key)), SAVE_KEY);

test('initial load: intro, canvas, diagnostics, no uncaught JS exceptions',
  { skip: skipBrowser }, async (t) => {
    const { page, runtimeErrors } = await session(t, '01-initial-load');
    assert.equal(await page.locator('#start').isVisible(), true);
    await begin(page);
    const geometry = await page.locator('#world').evaluate((el) => ({
      width: el.width, height: el.height
    }));
    assert.ok(geometry.width > 0 && geometry.height > 0);
    assert.equal((await state(page)).unlocked, 1);
    assert.deepEqual(runtimeErrors, []);
  });

test('desktop keyboard movement and real in-world interaction',
  { skip: skipBrowser }, async (t) => {
    const { page, runtimeErrors } = await session(t, '02-keyboard-interaction');
    await begin(page);
    // At level 1 the spawn is within interaction radius of the first guardian.
    assert.match(await page.locator('#actionStatus').innerText(), /ابدأ المواجهة/);
    await page.keyboard.down('ArrowLeft');
    await page.waitForTimeout(750);
    await page.keyboard.up('ArrowLeft');
    assert.match(await page.locator('#actionStatus').innerText(), /اقترب/);
    await page.locator('#walk').click(); // real map pathfinding, not openLevel shortcut
    await page.waitForFunction(() => document.querySelector('#actionStatus').textContent.includes('ابدأ'));
    await page.locator('#action').click();
    assert.equal(await page.locator('#answer').isVisible(), true);
    assert.deepEqual(runtimeErrors, []);
  });

test('first real challenge completes and save persists after reload',
  { skip: skipBrowser }, async (t) => {
    const { page, runtimeErrors } = await session(t, '03-first-challenge-save');
    await begin(page);
    await page.locator('#action').click();
    assert.equal(await page.locator('#answer').isVisible(), true);
    await page.locator('#answer').fill('بعض الناس استعاروا كتب ورجعوها للمكتبة قبل ما يخلصوا قرايتها');
    await page.locator('#submit').click();
    assert.equal(await page.locator('#back').isVisible(), true);
    assert.equal((await state(page)).unlocked, 2);
    assert.ok((await stored(page)).done.includes(1));
    await page.locator('#back').click();
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => Boolean(window.CreativeQuestDiagnostics));
    assert.equal((await state(page)).unlocked, 2);
    assert.equal(await page.locator('#start').count(), 0);
    assert.deepEqual(runtimeErrors, []);
  });

test('first Boss: wrong/retry, phase save/reload, written observation, manual finish',
  { skip: skipBrowser }, async (t) => {
    const { page, runtimeErrors } = await session(t, '04-first-boss', { save: bossFixture() });
    assert.equal(await page.evaluate(() => window.CreativeQuestDiagnostics.openLevel(10)), true);
    await page.locator('#bossStage .choice[data-v="0"]').click();
    assert.equal((await stored(page)).bossPhase, 0);
    await page.locator('#close').click();
    await page.evaluate(() => window.CreativeQuestDiagnostics.openLevel(10));
    assert.equal((await stored(page)).bossPhase, 0);
    await page.locator('#bossStage .choice[data-v="1"]').click();
    assert.equal((await stored(page)).bossPhase, 1);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => Boolean(window.CreativeQuestDiagnostics));
    await page.evaluate(() => window.CreativeQuestDiagnostics.openLevel(10));
    assert.equal(await page.locator('#bossAnswer').isVisible(), true);
    await page.locator('#bossAnswer').fill(
      'بعض زوار المعرض بيصوروا المنتجات وبيسجلوا أرقام القطع، وممكن يكونوا بيقارنوا الخيارات لكن ده تفسير مش مثبت.'
    );
    await page.locator('#hitBoss').click();
    assert.equal((await stored(page)).bossPhase, 2);
    assert.equal(await page.locator('#victory').isVisible(), true);
    page.once('dialog', (dialog) => dialog.accept());
    await page.locator('#victory').click();
    assert.equal((await stored(page)).bossPhase, 3);
    assert.equal((await state(page)).unlocked, 11);
    assert.ok((await stored(page)).done.includes(10));
    // This verifies manual self-reporting, NOT independent learning assessment.
    assert.deepEqual(runtimeErrors, []);
  });

test('P1 regression: pressing Space in textarea must insert a space',
  { skip: skipBrowser }, async (t) => {
    const { page } = await session(t, '05-textarea-space');
    await begin(page);
    await page.locator('#action').click();
    await page.locator('#answer').fill('بعض الناس');
    await page.locator('#answer').focus();
    await page.keyboard.press('Space');
    assert.equal(await page.locator('#answer').inputValue(), 'بعض الناس ',
      'Space was intercepted by game-level keydown; Arabic free text is broken');
  });

test('P1 accessibility: opening a dialog moves keyboard focus inside dialog',
  { skip: skipBrowser }, async (t) => {
    const { page } = await session(t, '06-dialog-focus');
    await begin(page);
    await page.locator('#menu').click();
    const inside = await page.evaluate(() => {
      const dialog = document.querySelector('#dialog');
      return dialog.contains(document.activeElement);
    });
    assert.equal(inside, true, 'dialog has no focus entry/management');
  });

test('mobile 360px: on-screen controls, touch action, no dialog clipping',
  { skip: skipBrowser }, async (t) => {
    const { page, runtimeErrors } = await session(t, '07-mobile-360', {
      context: { viewport: { width: 360, height: 740 },
        isMobile: true, hasTouch: true, deviceScaleFactor: 2 }
    });
    await page.locator('#start').tap();
    await page.locator('#action').tap();
    assert.equal(await page.locator('#answer').isVisible(), true);
    const info = await page.locator('#dialog').evaluate((el) => ({
      left: el.getBoundingClientRect().left,
      right: el.getBoundingClientRect().right,
      screen: innerWidth,
      scrollHeight: el.scrollHeight,
      clientHeight: el.clientHeight
    }));
    assert.ok(info.left >= -1 && info.right <= info.screen + 1, JSON.stringify(info));
    assert.ok(info.clientHeight > 0);
    assert.deepEqual(runtimeErrors, []);
  });

test('virtual joystick pointer captures drag and resets on release',
  { skip: skipBrowser }, async (t) => {
    const { page } = await session(t, '08-joystick');
    await begin(page);
    const box = await page.locator('#joy').boundingBox();
    const x = box.x + box.width / 2, y = box.y + box.height / 2;
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x + 25, y);
    await page.waitForTimeout(100);
    const moving = await page.locator('#stick').evaluate((el) => el.style.transform);
    assert.notEqual(moving, 'translate(0,0)');
    await page.mouse.up();
    assert.equal(await page.locator('#stick').evaluate((el) => el.style.transform),
      'translate(0,0)');
  });

test('repository subpath: HTML, PWA assets, service worker and offline reload',
  { skip: skipBrowser }, async (t) => {
    const { page, context, runtimeErrors } = await session(t, '09-subpath-offline');
    for (const asset of ['index.html', 'manifest.webmanifest', 'icon.svg', 'service-worker.js']) {
      const response = await context.request.get(base + asset);
      assert.equal(response.status(), 200, asset);
    }
    await begin(page);
    await page.waitForFunction(() => navigator.serviceWorker?.controller ||
      navigator.serviceWorker?.ready, null, { timeout: 12000 });
    await page.evaluate(async () => { await navigator.serviceWorker.ready; });
    await page.reload({ waitUntil: 'domcontentloaded' }); // establish controller
    await context.setOffline(true);
    await page.reload({ waitUntil: 'domcontentloaded' });
    assert.equal(await page.locator('#world').isVisible(), true);
    assert.deepEqual(runtimeErrors, []);
    // Local subpath success is not a live github.io Pages verification.
  });

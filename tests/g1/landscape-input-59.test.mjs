/**
 * Issue #59 — independent, read-only G1 landscape input forensics.
 * Run against a checked-out integration PR after npm ci and npm run build:g1:
 *   node --test tests/g1/landscape-input-59.test.mjs
 *
 * Deliberately retains actual WorldNode proximity and a normal unmodified 'e'
 * key press as an acceptance gate. An Inspect tap is used ONLY to diagnose a
 * failed key; it NEVER converts a failed keyboard trial into PASS.
 * No Engine hooks, GameEvent monkeypatches, source modifications or sleeps to
 * conceal an intermittent input bug. Evidence under qa/evidence/g1/runtime/issue-59/.
 */
import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { setTimeout as delay } from 'node:timers/promises';
import { chromium } from 'playwright';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const evidence = resolve(root, 'qa/evidence/g1/runtime/issue-59');
const localUrl = 'http://127.0.0.1:4193/Creative-Quest-Game/g1/play.html';
const oldKey = 'creative-quest-2d-v02';
const legacy = JSON.stringify({ done: [2], unlocked: 10, xp: 35,
  attempts: {}, answers: {}, bossPhase: 2, bossPhases: { '20': 1 },
  started: true, unknownOriginalField: { keep: true } });
const cases = [
  { id: 'L740-short-1', width: 740, height: 360, mobile: true, key: 'press' },
  { id: 'L740-short-2', width: 740, height: 360, mobile: true, key: 'press' },
  { id: 'L740-short-3', width: 740, height: 360, mobile: true, key: 'press' },
  { id: 'D1280-rapid-E-edge', width: 1280, height: 800, mobile: false, key: 'rapid' },
  { id: 'L740-rapid-E-edge', width: 740, height: 360, mobile: true, key: 'rapid' },
  { id: 'P360-short-control', width: 360, height: 740, mobile: true, key: 'press' },
  { id: 'L740-held-key-diagnostic', width: 740, height: 360, mobile: true, key: 'held' },
  { id: 'L740-inspect-button-control', width: 740, height: 360, mobile: true, key: 'touch-button' }
];
let server, browser, serverStderr = '';
before(async () => {
  await mkdir(evidence, { recursive: true });
  server = spawn(process.execPath, [
    'node_modules/vite/bin/vite.js', 'preview',
    '--config', 'vite.g1.config.mjs',
    '--host', '127.0.0.1', '--port', '4193', '--strictPort'
  ], { cwd: root, stdio: 'pipe' });
  server.stderr.on('data', bytes => { serverStderr += String(bytes); });
  let started = false;
  for (let i = 0; i < 100; i++) {
    if (server.exitCode !== null) throw Error('G1 preview exited: ' + serverStderr);
    try { if ((await fetch(localUrl)).ok) { started = true; break; } } catch {}
    await delay(150);
  }
  assert.ok(started, 'G1 preview unavailable: ' + serverStderr);
  browser = await chromium.launch({ headless: true });
});
after(async () => {
  if (browser) await browser.close();
  if (server) server.kill('SIGTERM');
});

function readOnlySnapshot() {
  const node = document.activeElement;
  const opened = document.querySelector('.cq-dialog[open]');
  let gameState = null, stageError = null;
  try { gameState = window.__cqG1Stage?.state() ?? null; }
  catch (error) { stageError = String(error); }
  return {
    at: performance.now(), wallTime: new Date().toISOString(),
    state: gameState, stageError,
    gameReady: document.documentElement.dataset.g1Play ?? null,
    active: node ? { tag: node.tagName, id: node.id, className:
      typeof node.className === 'string' ? node.className : '' } : null,
    hasFocus: document.hasFocus(), visibility: document.visibilityState,
    modalOpen: !!opened, modalHeading: opened?.querySelector('#cq-title')?.textContent ?? '',
    status: document.getElementById('status')?.textContent ?? '',
    sceneCanvasCount: document.querySelectorAll('#game-root canvas').length
  };
}

async function setup(t, item) {
  const context = await browser.newContext({
    viewport: { width: item.width, height: item.height },
    isMobile: item.mobile, hasTouch: item.mobile,
    deviceScaleFactor: item.mobile ? 2 : 1, reducedMotion: 'reduce'
  });
  await context.addInitScript(({ key, bytes }) => {
    try { if (localStorage.getItem(key) === null) localStorage.setItem(key, bytes); }
    catch {}
  }, { key: oldKey, bytes: legacy });
  const page = await context.newPage();
  const errors = [], requests = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('requestfailed', req => requests.push({
    url: req.url(), error: req.failure()?.errorText ?? 'unknown'
  }));
  const record = {
    scenario: item, baselineRequested: process.env.G1_QA_BASELINE_SHA ??
      'ca2012f9bf1ddb1cefca310bfabca29691feb31e',
    testedSha: process.env.GITHUB_SHA ?? 'LOCAL_SHA_NOT_PINNED',
    chromium: browser.version(), os: process.platform,
    screenshot: item.id + '.png', errors, requests,
    observations: [], shortKeyAccepted: null, touchControlAccepted: null
  };
  t.after(async () => {
    try {
      record.final = await page.evaluate(readOnlySnapshot);
      record.domTrace = await page.evaluate(() => window.__cqQA59Trace || []);
      await page.screenshot({ path: join(evidence, item.id + '.png'),
        animations: 'disabled', fullPage: true });
    } catch (e) { record.teardownError = String(e); }
    await writeFile(join(evidence, item.id + '.json'),
      JSON.stringify(record, null, 2));
    await context.close();
  });
  const response = await page.goto(localUrl, { waitUntil: 'domcontentloaded' });
  assert.equal(response?.status(), 200, item.id + ' staging subpath status');
  await page.waitForFunction(() => document.documentElement.dataset.g1Play === 'ready',
    null, { timeout: 15000 });
  assert.equal(await page.locator('#game-root canvas').count(), 1);
  assert.equal(await page.evaluate(k => localStorage.getItem(k), oldKey), legacy);
  await page.evaluate(() => {
    const trace = [];
    const describe = (event, kind) => {
      const active = document.activeElement;
      trace.push({
        at: performance.now(), kind, key: event.key ?? null,
        isTrusted: event.isTrusted ?? null, target: event.target?.tagName ?? '',
        targetId: event.target?.id ?? '',
        active: active?.tagName ?? '', activeId: active?.id ?? '',
        defaultPrevented: event.defaultPrevented ?? null,
        near: window.__cqG1Stage?.state()?.near ?? null,
        paused: window.__cqG1Stage?.state()?.paused ?? null
      });
    };
    for (const kind of ['keydown', 'keyup']) {
      document.addEventListener(kind, event => {
        if (event.key === 'e' || event.key === 'E' || event.key === 'ArrowUp')
          describe(event, kind);
      }, true);
    }
    document.addEventListener('focusin', event => describe(event, 'focusin'), true);
    const status = document.getElementById('status');
    if (status) {
      const observer = new MutationObserver(() => trace.push({
        at: performance.now(), kind: 'status.mutation', text: status.textContent,
        near: window.__cqG1Stage?.state()?.near ?? null,
        paused: window.__cqG1Stage?.state()?.paused ?? null,
        challengeId: window.__cqG1Stage?.state()?.openChallengeId ?? null
      }));
      observer.observe(status, { childList: true, subtree: true, characterData: true });
    }
    Object.defineProperty(window, '__cqQA59Trace', { value: trace, configurable: false });
  });
  record.observations.push({ point: 'ready', snapshot: await page.evaluate(readOnlySnapshot) });
  return { context, page, record };
}

async function moveNaturally(page, record) {
  const canvas = page.locator('#game-root canvas');
  await canvas.click({ position: { x: 15, y: 15 } });
  record.observations.push({ point: 'after-canvas-click', snapshot: await page.evaluate(readOnlySnapshot) });
  await page.keyboard.down('ArrowUp');
  try {
    await page.waitForFunction(() => window.__cqG1Stage.state().near === true,
      null, { timeout: 8000 });
  } finally { await page.keyboard.up('ArrowUp'); }
  record.observations.push({ point: 'after-natural-approach-and-keyup',
    snapshot: await page.evaluate(readOnlySnapshot) });
  assert.equal((await page.evaluate(readOnlySnapshot)).state?.near, true,
    'actor must be physically in range after actual Phaser movement');
}

async function waitOpen(page, timeout = 7000) {
  try {
    await page.locator('.cq-dialog[open]').waitFor({ state: 'visible', timeout });
    return true;
  } catch { return false; }
}

test('Issue #59: repeat default and rapid E, held-E, portrait and touch without masking failures',
  async t => {
    const failed = [];
    const summary = [];
    for (const item of cases) {
      await t.test(item.id, async inner => {
        const { page, record } = await setup(inner, item);
        await moveNaturally(page, record);
        record.observations.push({ point: 'before-interaction',
          snapshot: await page.evaluate(readOnlySnapshot) });
        const before = record.observations.at(-1).snapshot;
        assert.equal(before.state?.paused, false, 'Engine should not already be paused');
        assert.equal(before.state?.openChallengeId, null);
        if (item.key === 'press') {
          await page.keyboard.press('e'); // MUST match current flaky baseline
        } else if (item.key === 'rapid') {
          // Intentional quick real key tap; not a shortcut or a modified Engine path.
          // This reproduces a 0.6ms down/up pulse seen in actual CI failure.
          await page.keyboard.down('e');
          await page.keyboard.up('e');
        } else if (item.key === 'held') {
          await page.keyboard.down('e');
          await delay(125); // DIFFERENTIAL DIAGNOSIS, not replacement acceptance
          await page.keyboard.up('e');
        } else {
          await page.locator('#inspect').tap();
        }
        const opened = await waitOpen(page, 7000); // same 7s as original test
        record.observations.push({ point: 'after-primary-interaction',
          snapshot: await page.evaluate(readOnlySnapshot) });
        // Preserve primary result BEFORE diagnostic tap; final screenshot alone could be misleading.
        await page.screenshot({ path: join(evidence, item.id + '-primary-after.png'),
          animations: 'disabled', fullPage: true });
        record.primaryScreenshot = item.id + '-primary-after.png';
        const after = record.observations.at(-1).snapshot;
        record.shortKeyAccepted = (item.key === 'press' || item.key === 'rapid') ? opened : null;
        if (item.key === 'touch-button') record.touchControlAccepted = opened;
        record.domTrace = await page.evaluate(() => [...window.__cqQA59Trace]);
        if (!opened && item.key !== 'touch-button') {
          // ONE diagnostic touch attempt after the failure has been captured.
          // Never clear/fix the original failure via the tap fallback.
          await page.locator('#inspect').tap();
          record.touchControlAccepted = await waitOpen(page, 2500);
          record.observations.push({ point: 'after-diagnostic-inspect-tap',
            snapshot: await page.evaluate(readOnlySnapshot) });
        }
        summary.push({ id: item.id, primaryOpened: opened,
          target: item.key, nearBefore: before.state?.near,
          pausedAfter: after.state?.paused,
          challengeAfter: after.state?.openChallengeId,
          activeBefore: before.active, activeAfter: after.active,
          tapFallbackOpened: record.touchControlAccepted,
          domTrace: record.domTrace });
        if (!opened) {
          failed.push(item.id);
          assert.fail(item.id + ': primary interaction FAILED on real Phaser WorldNode. ' +
            'Near before=' + before.state?.near + ', paused after=' + after.state?.paused +
            ', dialog id after=' + after.state?.openChallengeId +
            ', touch recovery=' + record.touchControlAccepted +
            '. See qa/evidence/g1/runtime/issue-59/' + item.id + '.json');
        }
        assert.equal(after.state?.paused, true, 'Open dialog must hold Engine paused');
        assert.equal(after.state?.openChallengeId, 'cq_obs_w01_e01_inspect_v1');
        await page.keyboard.press('Escape');
        await page.waitForFunction(() =>
          !document.querySelector('.cq-dialog')?.open &&
          window.__cqG1Stage.state().paused === false, null, { timeout: 7000 });
        assert.equal(await page.evaluate(() => document.activeElement?.id), 'inspect');
        assert.equal(await page.evaluate(k => localStorage.getItem(k), oldKey), legacy);
        assert.deepEqual(record.errors, [], 'No browser errors in input test');
      });
    }
    await writeFile(join(evidence, 'summary.json'), JSON.stringify({
      test: 'Issue #59 repeated input acceptance',
      testedSha: process.env.GITHUB_SHA ?? 'LOCAL_SHA_NOT_PINNED',
      chromium: browser.version(), cases: summary, failed
    }, null, 2));
    assert.deepEqual(failed, [], 'Never mask direct keyboard failures via touch fallback');
  });

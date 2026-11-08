/**
 * Browser smoke for UI-owned challenge overlay, NOT integrated Phaser runtime.
 * Run from repo root after npm ci: node src/ui/mock/smoke.mjs
 * Uses Playwright pinned in package.json; Chromium must be installed.
 */
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { setTimeout as delay } from 'node:timers/promises';
import { chromium } from 'playwright';

const port = '4176';
const url = `http://127.0.0.1:${port}/`;
const evidence = 'src/ui/mock/evidence';
mkdirSync(evidence, { recursive: true });
const vite = spawn(process.execPath, [
  'node_modules/vite/bin/vite.js', 'src/ui/mock', '--host', '127.0.0.1',
  '--port', port, '--strictPort', '--base', '/'
], { stdio: 'pipe' });
let stderr = '';
vite.stderr.on('data', b => { stderr += String(b); });
const awaitServer = async () => {
  for (let i = 0; i < 100; i++) {
    if (vite.exitCode !== null) throw new Error('Vite exited: ' + stderr);
    try { if ((await fetch(url)).ok) return; } catch { /* server booting */ }
    await delay(100);
  }
  throw new Error('Vite did not start: ' + stderr);
};
let browser;
try {
  await awaitServer();
  browser = await chromium.launch({ headless: true });
  for (const test of [
    { id: 'mobile360', size: { width: 360, height: 740 }, mobile: true },
    { id: 'desktop1280', size: { width: 1280, height: 800 }, mobile: false },
    { id: 'landscape740', size: { width: 740, height: 360 }, mobile: true }
  ]) {
    const context = await browser.newContext({
      viewport: test.size, isMobile: test.mobile, hasTouch: test.mobile,
      reducedMotion: 'reduce'
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(url, { waitUntil: 'load' });
    await page.waitForFunction(() => document.documentElement.dataset.cqUiMock === 'ready');
    const open = page.locator('#open-challenge');
    await open.focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('.cq-dialog').evaluate(node => node.open), false,
      'Dialog must NOT open before engine.paused ack');
    await page.locator('.cq-dialog[open]').waitFor({ state: 'visible' });
    assert.equal(await page.locator('#cq-title').evaluate(node => node === document.activeElement),
      true, 'On open, heading takes focus');
    const choices = page.locator('.cq-option input');
    await choices.nth(0).focus();
    await page.keyboard.press('Space'); // verifies Space is not globally intercepted by UI
    assert.equal(await choices.nth(0).isChecked(), true);
    assert.equal(await page.locator('.cq-submit').isDisabled(), true);
    await choices.nth(2).check();
    assert.equal(await page.locator('.cq-submit').isEnabled(), true);
    await page.locator('.cq-submit').click();
    await page.locator('.cq-feedback[data-state="partial"]').waitFor({ state: 'visible' });
    assert.match((await page.locator('.cq-feedback').innerText()), /جزء|تفسير/);
    await page.locator('.cq-option input').nth(2).uncheck();
    await page.locator('.cq-option input').nth(1).check();
    await page.locator('.cq-hint-button').click();
    await page.locator('.cq-hint:not([hidden])').waitFor({ state: 'visible' });
    await page.locator('.cq-submit').click();
    await page.locator('.cq-feedback[data-state="passed"]').waitFor({ state: 'visible' });
    await page.locator('.cq-reward').waitFor({ state: 'visible' });
    assert.match(await page.locator('.cq-reward').innerText(), /\+20 XP/);
    assert.equal(await page.locator('.cq-submit').isDisabled(), true, 'No repeat submit after reward');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
    assert.equal(overflow, false, '360px/landscape/desktop must not overflow horizontally');
    const box = await page.locator('.cq-dialog').boundingBox();
    assert.ok(box && box.x >= -1 && box.x + box.width <= test.size.width + 1, 'Modal clips horizontally');
    await page.screenshot({ path: `${evidence}/g1-ui-${test.id}.png`, animations: 'disabled' });
    await page.keyboard.press('Escape');
    await page.waitForFunction(() => !document.querySelector('.cq-dialog')?.open);
    await page.waitForFunction(() => document.activeElement?.id === 'open-challenge');
    assert.deepEqual(errors, [], 'No runtime browser errors');
    await context.close();
    console.log('PASS:', test.id, 'paused before open; keyboard; partial; hint; receipt; focus returned; no horizontal overflow');
  }
  const page = await browser.newPage({ viewport: { width: 360, height: 800 } });
  await page.goto(url);
  await page.locator('#simulate-save-failure').check();
  await page.locator('#open-challenge').click();
  await page.locator('.cq-dialog[open]').waitFor();
  await page.locator('.cq-option input').nth(0).check();
  await page.locator('.cq-option input').nth(1).check();
  await page.locator('.cq-submit').click();
  await page.locator('.cq-save-error:not([hidden])').waitFor();
  assert.equal(await page.locator('.cq-reward').count(), 0,
    'Failed save must never display committed XP');
  console.log('PASS: mock save failure surfaced, no reward claim');
  await page.close();
  console.log('Mock UI browser tests PASS. This is not a Phaser integration/Android device acceptance.');
} finally {
  if (browser) await browser.close();
  vite.kill('SIGTERM');
}

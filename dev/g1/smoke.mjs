// G1 ONLY: proves the compiled Phaser boot screen starts in real Chromium.
// Not a gameplay, SaveState, challenge, Boss or production Pages test.
import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';
import { mkdirSync } from 'node:fs';
import { setTimeout as pause } from 'node:timers/promises';
import { chromium } from 'playwright';

const url = 'http://127.0.0.1:4174/Creative-Quest-Game/g1/';
const evidenceDir = 'dev/g1/evidence';
mkdirSync(evidenceDir, { recursive: true });

const server = spawn(process.execPath, [
  'node_modules/vite/bin/vite.js', 'preview',
  '--config', 'vite.g1.config.mjs',
  '--host', '127.0.0.1', '--port', '4174', '--strictPort'
], { stdio: 'pipe' });
let serverError = '';
server.stderr.on('data', buffer => { serverError += String(buffer); });

async function waitForServer() {
  for (let attempts = 0; attempts < 80; attempts++) {
    if (server.exitCode !== null) throw new Error('Vite preview exited: ' + serverError);
    try {
      const r = await fetch(url);
      if (r.ok) return;
    } catch { /* expected until listening */ }
    await pause(250);
  }
  throw new Error('Vite preview unavailable: ' + serverError);
}
let browser;
try {
  await waitForServer();
  browser = await chromium.launch({ headless: true });
  const cases = [
    { name: 'desktop', viewport: { width: 1280, height: 800 } },
    { name: 'mobile360', viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }
  ];
  for (const scenario of cases) {
    const context = await browser.newContext({
      viewport: scenario.viewport, isMobile: scenario.isMobile ?? false,
      hasTouch: scenario.hasTouch ?? false, deviceScaleFactor: scenario.deviceScaleFactor ?? 1,
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    const r = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    assert.equal(r?.status(), 200, 'preview page should serve on project subpath');
    await page.waitForFunction(() => document.documentElement.dataset.g1Boot === 'ok', null, { timeout: 20000 });
    const status = await page.locator('#status').textContent();
    assert.match(status ?? '', /G1 Boot OK/);
    const canvas = page.locator('#game-root canvas');
    await canvas.waitFor({ state: 'visible' });
    const box = await canvas.boundingBox();
    assert.ok(box && box.width >= 100 && box.height >= 60, 'Phaser Canvas not visible');
    assert.ok(box.x >= -1 && box.x + box.width <= scenario.viewport.width + 1,
      'Canvas overflows the viewport');
    assert.deepEqual(errors, [], 'Browser console/page errors should be empty');
    await page.screenshot({ path: `${evidenceDir}/g1-${scenario.name}.png`, fullPage: true });
    console.log(`PASS: ${scenario.name} Phaser boot / Pages path / no page errors / visible canvas`);
    await context.close();
  }
} finally {
  if (browser) await browser.close();
  server.kill('SIGTERM');
}

# v0.4 legacy-engine inventory (engine-only spike report)

Baseline `main` SHA: `40c76c3aafe6b8bd3d2db0723587e7d02ec9dcc1` (2026-11-08). Source: root `index.html`; old implementation remains published and unchanged.

- **Shape:** self-contained HTML with multiple inline scripts (~164,330 JS/HTML characters; index blob 204,410 UTF-8 bytes); ~442 very long lines. One `<canvas id="world">` renders a custom 2D world; no existing Phaser/Vite/TypeScript scaffold.
- **Main runtime:** globals `player`, `camera`, `joy`, `keys`, `destination`, `mode` initialized near `const STORAGE`. Fixed `WW`/`WH` map, `SPAWN`, `PATHS`, `MARKS`; `syncRoute`, `setupCanvas`, `draw`, `tick`, `interact`, `modal`, `closeDialog` form movement/navigation loop. `requestAnimationFrame(tick)` with `dt` capped at 40ms and speed ~255 units/s.
- **Input:** window `keydown`/`keyup` arrows/WASD, Space for interaction, Escape modal exit; joystick with pointer capture, canvas tap destination, HTML action button. No teardown from the monolithic app. Dialog state gates movement.
- **Challenges:** `challenge`, `check`, `pass`, `advancedChallenge`, `renderQuest`, `aPass`, `wrong`, `openBoss`, `bossScreen`, `openBossExtra`, `extraBossScreen`, later script overrides/patches (not a stable modular API). Successful levels append to `save.done`, advance `save.unlocked`, grant XP, persist and refresh UI. Boss progress tracked separately.
- **Legacy storage key (read-only for this spike):** `creative-quest-2d-v02`. Literal default: `{done:[],unlocked:1,xp:0,attempts:{},answers:{},bossPhase:0,bossPhases:{},started:false}`. Current reader shallow-merges `JSON.parse(localStorage.getItem(...) || '{}')`, checks only `Array.isArray(save.done)`; `persist()` overwrites original value via `localStorage.setItem(...)`. No schema version or robust validation. User can back up via v0.4 menu.
- **Known parity risks:** later script patching means bare function-name export cannot preserve functionality; no lifecycle listener cleanup; superficial validation; reload resume depends on `unlocked`/Boss fields; save writes happen on input as well as rewards; source contains optional clipboard-based ChatGPT self-review but no trusted AI grade.
- **Spike choices:** `src/game/spikes/standalone/play.html` is an entirely separate entry, not published from root, using local Canvas/TS **only until HQ approves Phaser/Vite ADR**. Private typed event bus connects spike canvas and DOM. Private save adapter imports legacy progress to `creative-quest-2d-engine-spike-v01` **without setting or removing the legacy key**, sanitizes malformed values, suppresses duplicate reward IDs. New spike XP does not alter actual v0.4 XP or completed levels.
- **Not a production contract:** TS types and choices here are explicitly private; replace with HQ-approved versioned `SaveState`, `WorldSpec`, `ChallengeSpec`, and UI event types. Placeholder hero/map and single deterministic example are for route verification, **not authored content or art**.
- **Integration blocked until HQ:** assigned release target, architecture ADR, root bootstrap plan, contract approval, QA fixture parity, final manifest availability. Do not merge to `main` simply because this spike runs.

## Local isolated check

From repository root (after compiling source):

```bash
tsc --strict --target ES2022 --module ES2022 --moduleResolution Bundler --lib ES2022,DOM src/core/spikes/event-bus.ts src/adapters/spikes/legacy-save.ts src/game/spikes/standalone/main.ts
node --experimental-default-type=module src/adapters/spikes/legacy-save.verify.mjs
python3 -m http.server 8000
# Open http://localhost:8000/src/game/spikes/standalone/play.html
```

The compilation step emits adjacent `.js` files locally. The generated JS is deliberately not committed; HQ must approve the official package/build system before changing the repository's root tooling or publishing generated bundles.

## Verified local results (2026-11-08)

- `tsc --strict --target ES2022 --module ES2022 --moduleResolution Bundler --lib ES2022,DOM` — PASS (3 TypeScript modules, no compile diagnostics).
- `node --experimental-default-type=module src/adapters/spikes/legacy-save.verify.mjs` — PASS (14 assertions including exact legacy-key value preservation and no duplicate XP).
- Playwright + local Chromium — PASS using an inlined module harness and injected `StoragePort` in an isolated browser document: Desktop 1366×768 imported a real-shape v0.4 fixture (45→65 XP), portrait 390×844 started fresh (0→20 XP); wrong answer/feedback; correct answer; return map; simulated reload retained XP; no page exceptions.
- Additional portrait pointer test — PASS pointer joystick drag / action tap / modal close. This exercises PointerEvent path but is **not** a real Android hardware test.
- Evidence images are local test artifacts, not committed game art. Production HTTP/Pages, hardware Android, real-browser localStorage endurance, 10-minute FPS profile, and full v0.4 regression — **NOT RUN / BLOCKED**. This spike has no root build script because HQ owns root bootstrap; its strict compiler test is not evidence of a Phaser/Vite production build.

# G1 Engine handoff — Issue #33

Branch: `cq/engine/g1-interaction` from integration baseline `e5cf07b5d521d55afdd6b2a6b279a2e3e74d209a`. **Feature-only: no published main/index/CI/contract/UI/content/art changes.**

## Public wiring for HQ (only HQ may modify dev/g1/main.ts)

```ts
import Phaser from 'phaser';
import { G1EngineBridge } from '../../src/core/g1/engine-bridge';
import { DIAGNOSTIC_WORLD, DIAGNOSTIC_CHALLENGE_ID, DIAGNOSTIC_NODE_ID } from '../../src/core/g1/technical-fixture';
import { ObservationG1Scene } from '../../src/game/g1/observation-scene';
// Instantiate from dev/g1/main.ts AFTER HQ review:
const engine = new G1EngineBridge(DIAGNOSTIC_WORLD, window.localStorage);
const game = new Phaser.Game({
  type: Phaser.AUTO, parent: 'game-root', width: 640, height: 360,
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  scene: [new ObservationG1Scene(engine)],
});
const unsubscribe = engine.subscribe(event => {
  // UI must wait for engine.paused BEFORE focusing dialog, and for engine.resumed
  // BEFORE restoring focus. Read engine.snapshot() for current XP/paused status.
  // Present G1 diagnostic fixture only, never claim to be the authored Level 01.
});
engine.announceSaveHealth();
```

This is NOT a second bootstrap or a replacement for HQ-owned `dev/g1/main.ts`. No DOM UI is implemented in Engine; wire commands and accessible focus in `src/ui`/HQ. The new scene takes a real `Phaser.Scene` path with camera follow, Phaser pointer and keyboard handling, world-space collisions and feet pivot. Placeholder objects are procedural, not art-ready sprites. The scene never writes localStorage.

## Command and assessment API

- `engine.bindPlayerPosition(() => ({x, y}))`: scene owns live transform, runtime validates interaction radius using `WorldSpecV1.nodes`; cleanup on scene shutdown.
- `interact.request({ nodeId })` only works when within the node radius; then `engine.paused` ack followed by `dialog.opened`. UI should use the authoritative `snapshot()`, never increment XP itself.
- `challenge.hint` returns `assessment.recorded` with `NOT_ASSESSED`, `NEEDS_REVIEW`, and `HINT_ONLY` for lack of `hint.presented` in G0. This is not graded assessment.
- `challenge.submit` uses synthetic two-clue multi-select fixture; selecting a motive fails, one observation is PARTIAL, two accepted sources PASSED with `STRUCTURED_VERIFIED`. `masteryAwarded=false` always, because this is NOT authored learning content.
- `reward.committed` emitted **only after successful new-key save**, one deterministic receipt `challenge:g1-tech-fixture-clue-01`. Repeat commands can produce assessment feedback but cannot duplicate rewards.
- `dialog.close.request` clears challenge and emits **ONLY `dialog.closed`** while keeping `snapshot().paused === true`. UI closes native modal and prepares focus, then dispatches a **separate** `engine.resume.request` with its own `requestId`; only that command emits `engine.resumed` and enables movement. An early resume while the dialog is open is denied. `engine.pause.request` acknowledges pause; all responses carry request IDs.
- `boss.action`/`boss.retry` intentionally not implemented; Boss owner controls that. No fake HP/fake mastery.
- `window.localStorage` access must be guarded in HQ bootstrap: `new G1EngineBridge(world, window.localStorage)` can throw if the *property accessor itself* is blocked; wrap in `try/catch` and pass an unavailable storage port to report an actionable `save.failed`.

## Save migration v0.4 → G1

- `creative-quest-2d-v02`: **READ ONLY**. Preserve exact original bytes/unknown fields. Never write/delete this key.
- `creative-quest-2d-v1`: **ONLY** output for G1. Read and validate schema/version, receipt ID uniqueness, and `xpTotal === originalXP + receiptXP`. Corrupt v1/legacy key => **blocked** not quietly overwritten.
- Legacy `done/unlocked/xp/attempts/answers/bossPhase/bossPhases/started` kept in `importedLegacy.snapshot`. Old `done` and prior Boss wins are historical **narrative** achievements; not independently assessed v1 mastery.
- Partial old Boss phases are **not** mapped to new 3-phase mechanics; keep raw snapshot and request fair restart/review. `unlockedWorldIds` includes `observation`; the cross-world v0.4-to-v1 ID map needs HQ+World approval before v1 portal unlocks or displaying previous worlds. Do not erase old history.
- Import is read-only until the player gets the first valid G1 structured reward. On denied `setItem`, keep the original in memory and show `save.failed`; XP does **not** advance. To recover corrupt v1 data the user must export it / choose explicit recovery policy, not silent replacement.

## World/Character/UI contract requests to HQ

1. `WorldSpecV1`: need approved visible collision footprints and a named v1-to-legacy world ID map, portal activation rules, and a scene-specific reachability/path hint API; polygon collisions are supported by point-to-edge distance.
2. Camera: we use world pixels, top-left, feet-centered hero. Current diagnostic 1200×900 world, center spawn 600×748, visible obstacles; arbitrary **test values**, not a locked tile size or sprite pivot. Camera Phaser FIT viewport 640×360 from HQ with follow and bounds; test portrait after HQ wiring.
3. `SpriteManifestV1`: need approved art, per-facing idle/walk strips, true feet pivot normalized and tested hitbox; never lock 64×64. Engine placeholder is an ellipse/body/face drawn by Phaser only.
4. G0 GameEvent currently lacks `interaction.rejected`, `hint.presented`, and typed `save.loaded/recovery`. Propose these as a **future HQ contract delta**, not an incompatible local extension. G1 hint is currently a `NOT_ASSESSED` event; consumers must not treat it as test performance.
5. `UIBridgeV1` needs an approved way to obtain the current ChallengeSpec/evidence/hints for DOM without importing private Engine fixtures; otherwise UI can only render the diagnostic content by local dev wiring. A `challenge.presented` event or typed selector would resolve it.
6. Focus #14/#17: Engine never binds Space; input guard suppresses WASD/arrows/E while focused interactive DOM controls. UI owns focus trapping and restore-on-ack. Real player route #22 uses the same `interact.request` handler as the diagnostic; **no direct openLevel shortcut** exists.

## Repeatable test commands from repository root (after `npm ci`)

```sh
node src/core/g1/verify.mjs
npx tsc --noEmit --strict --skipLibCheck --target ES2022 --module ESNext --moduleResolution Bundler --lib ES2022,DOM src/game/g1/observation-scene.ts src/core/g1/engine-bridge.ts src/adapters/g1/save-state.ts
npm run typecheck:g1
npm run build:g1
```

The Engine-owned verification script compiles real `src/core`, `src/adapters`, `src/contracts` and Phaser scene with strict TS; runs Node assertions on malformed storage, legacy preservation, Boss partial history, input distance, hint/retry/partial/pass, pause/resume ack, receipt dedup, denied writes and reload. It creates only OS-temp build files and cleans them up. **Existing `tsconfig.g1.json` does not include Engine-owned paths** and the HQ G1 boot proof does not instantiate this scene; HQ must extend CI/test orchestration and `dev/g1/main.ts` explicitly. A green G1 boot CI is NOT evidence that this engine ran.

## QA acceptance left

- HQ integration-wired real Phaser map/HUD, physical Android 360px/desktop keyboard, pointer movement and modal focus smoke, real-origin localStorage reload, screen captures and 10-minute FPS profile **NOT yet independently verified** in this Engine PR.
- Boss guard, authored E01 challenge, World art/character assets and sprite animation require separate owner PRs. Draft until HQ validation.


## Issue #39 — precise two-owner handshake (reviewed after PR #37)

**Engine is the only owner of pause, openChallengeId and XP. UI owns DOM and focus.** The previous implementation incorrectly sent `engine.resumed` from `dialog.close.request`, before UI's real resume request. Corrected in Engine now.

```text
player actually reaches clue node
  → interact.request {requestId: I, nodeId}
  ← engine.paused {requestId: I}        [movement locked]
  ← dialog.opened {requestId: I, challengeId}
  → HQ maps node.challengeId → approved ChallengeSpecV1; passes spec to UI
  → UI opens native DOM dialog on ALREADY-PAUSED Engine (NO second pause request)
  → challenge.hint / challenge.submit {requestId: S, challengeId, answer}
  ← assessment.recorded {requestId: S, result}
  ← reward.committed {requestId: S, receipt, xpTotal} only after saved
  → dialog.close.request {requestId: C}
  ← dialog.closed {requestId: C}        [STILL PAUSED]
  → UI closes native dialog and prepares focus / pending resume status
  → engine.resume.request {requestId: R}      [R != C]
  ← engine.resumed {requestId: R}       [movement unlocked; UI restores focus]
```

**Critical UI blocker outside Engine ownership:** UI PR #38 `FirstChallengeOverlay.open(spec, trigger)` currently rejects `bridge.snapshot().paused === true` and unconditionally sends `engine.pause.request`. UI owner/HQ must add a pre-paused open flow, e.g. `openFromEngine(spec, trigger, interactionRequestId)`, which accepts the matching `dialog.opened` after Engine pause, does not dispatch another pause, and opens the modal without creating duplicate challenge state. This patch changes ONLY Engine files; do not claim end-to-end UI/Engine gameplay until UI fix is integrated and real browser smoke passes.

A second `dialog.close.request` after closing produces no early resume. `interact.request` while closed-but-paused cannot re-open. `engine.resume.request` is the ONLY unblock transition following close. Engine scene `ObservationG1Scene.update()` checks `bridge.snapshot().paused` each frame.

## ChallengeSpecV1 integration (Content PR #36, Issue #39)

Engine now exposes **`createChallengeCatalog(specs)`** from `src/core/g1/challenge-catalog.ts` and `bridge.getChallengeSpec(challengeId)`; constructor's fourth argument is the catalog lookup. HQ owns JSON import, validation, and UI handoff, e.g.:

```ts
import type { ChallengeSpecV1, WorldSpecV1 } from '../../src/contracts/v1';
import e01 from '../../src/content/levels/obs-w1-e01-inspect-library.json';
import e02 from '../../src/content/levels/obs-w1-e02-connect-nursery.json';
import e03 from '../../src/content/levels/obs-w1-e03-arrange-cinema.json';
import { createChallengeCatalog } from '../../src/core/g1/challenge-catalog';
import { G1EngineBridge } from '../../src/core/g1/engine-bridge';
const catalog = createChallengeCatalog([e01, e02, e03] as ChallengeSpecV1[]);
const realWorld: WorldSpecV1 = {
  // HQ must use approved World-owned map dimensions/collision/spawn, not Engine fixture values.
  ...approvedWorldSpec,
  nodes: [
    // World/Content owners need to provide final positioned node IDs:
    { id: 'w01-library-inspect', kind: 'clue', position: approvedE01CluePosition,
      radius: approvedInteractRadius, challengeId: e01.id },
    // Add E02/E03 nodes only after corresponding interaction/UX acceptance.
  ],
};
const engine = new G1EngineBridge(realWorld, safeStoragePort, undefined, catalog);
const unsub = engine.subscribe(event => {
  if (event.type === 'dialog.opened' && event.challengeId) {
    const spec = engine.getChallengeSpec(event.challengeId);
    if (!spec) { /* HQ shows missing approved content; do NOT route to technical fixture */ return; }
    // UI owner implements pre-paused openFromEngine; never call legacy open() here:
    overlay.openFromEngine(spec, interactionTrigger, event.requestId);
  }
});
```

This is a **wiring sketch**, not copy-paste runnable until World supplies `approvedWorldSpec/approvedE01CluePosition/approvedInteractRadius` and UI exposes pre-paused flow. `as ChallengeSpecV1[]` is a compile-time cast only; HQ must run existing JSON Schema + content semantic validator before passing published files.

**Finite assessment supported now:** E01 multi-select with three defensible two-evidence routes (order-independent, extra/duplicate IDs rejected), E02 single-select with two valid corroborating sources, E03 five-step `order` with two allowed pair-order sequences (wrong before/after and unsupported motive rejected); matches finite `validAnswerSets`, uses option `errorCode` and `feedbackByErrorCode`, `PARTIAL` for valid incomplete routes. Non-supported response modes/text are `NOT_ASSESSED`, never fake AI grading or `masteryAwarded`. A challenge missing from the injected catalog will not open, and **never falls back to the diagnostic evaluator** except for its explicit diagnostic ID. The previous diagnostic fixture remains for isolated Engine tests, not authored W01.

**Reward XP** remains provisional 20 per challenge pending Learning/HQ tuning; `RewardReceipt` is deterministic per challenge ID; duplicate submissions/reload grant no second XP. The v0.4 localStorage key remains byte-for-byte read-only.

**Tests updated:** `node src/core/g1/verify.mjs` now asserts `dialog.closed` cannot unblock movement, requires a distinct resume request and corresponding ack, blocks interaction while paused, tests authored E01/E02/E03 answer patterns (test mirrors of PR #36 IDs, not copied actual JSON), unknown content fallback refusal, trust flags, idempotent receipt and reload. Actual PR #36 JSON+UI #38+real Phaser scene browser integration remains HQ/QA acceptance work.

### Execution/evidence boundary (Nov 8, 2026)

Previous HQ independent suite PASS was on PR #37 SHA `45471137a372d18e3cd110cadaa99745aafd0378`, **not** this new commit. Re-run on updated branch SHA. G0/G1 bootstrap CI is insufficient because it checks only HQ bootstrap. Real Android screenshots / 10-minute Phaser gameplay profile remain NOT RUN; HQ integration is intentionally not modified here.

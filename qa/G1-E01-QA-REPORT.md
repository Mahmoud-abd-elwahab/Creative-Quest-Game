# Independent G1 QA decision — Issue #43

**Review date:** 2026-11-08.
**Reviewed target:** cq/integration/vertical-slice at commit c976f084243a018a96595b88aaf7b5bbcf733b2f.
**Published main:** 40c76c3aafe6b8bd3d2db0723587e7d02ec9dcc1, unchanged.
**Owner:** Independent QA; files limited to tests/ and qa/.
**Previous HQ direction:** PR #13 last Technical Producer comment:
https://github.com/Mahmoud-abd-elwahab/Creative-Quest-Game/pull/13#issuecomment-6722085763

## Decision first

**G1 technical acceptance: CHANGES REQUIRED.**
The single staged E01 WorldNode-to-authoring-to-receipt experience is supported by real CI Chromium logs, but the required PARTIAL path cannot be submitted via the actual UI (P1 #46). That contradiction invalidates full G1 acceptance despite the existing green workflow.

**Production release: NO-GO.** No complete first world, independent physical Android, Boss runtime, complete semantic pedagogy signoff, or deployed Pages verification has been demonstrated. The v0.4 legacy root has unresolved P1 #14–#17 and hotfix PR #29 is not shipped.

## Actual evidence inspected

1. GitHub source HEAD matched exactly to the Issue #43 assigned SHA via same-ref compare. Read README, PROJECT-BIBLE, AGENT-ROLES, SHARED-CONTRACTS, Issue #39, PR #42 and the final Technical Producer comment on previous QA PR #13. Inspected real staged E01 JSON, HQ play.ts/play-smoke.mjs, UI overlay, styles, Engine challenge evaluator/bridge, scene and save adapter.
2. Independent review of GitHub Actions run 42484888738 (job 128744497992) including decoded job logs. Steps npm ci, strict TS, Vite build, desktop/360 Chromium boot, and two E01 real-scene browser flows report SUCCESS. Runner: GitHub ubuntu-latest, Node 22, Playwright Chromium 158.0.8127.18. This is HQ-run CI evidence, NOT independent local rerun.
3. Downloaded artifact ID 13618843676, verified ZIP SHA256 equals 9555c6580d4740c84a4c2e720fa6ed847c08983e160fd666e6d8ac952e9d9a66. Inspected all four screenshots; reviewed actual-interaction/real-e01-desktop1280.png and real-e01-mobile360.png at native resolution. The latter is 720x1480 pixels from 360x740 emulation at scale factor 2, not a physical Android capture.
4. Executed original evaluator function and helpers in isolated V8 with TypeScript type syntax removed (source code otherwise unchanged), actual JSON injected. 8 cases: two PASSED supported, two PARTIAL, two TRY_AGAIN unsupported, two invalid duplicate/unknown TRY_AGAIN. All eight returned expected statuses. This is source-level executable evidence, not a strict tsc Node test or UI playthrough. Exact cases: qa/evidence/g1/issue-43-independent-probes.json.
5. Independent local environment Linux Node v22.16.0/npm 10.9.2; tsc global 5.8.3, Chromium 144.0.7559.96. Chromium can render an in-memory Arabic test page with page.set_content, but page.goto to 127.0.0.1 fixture fails net::ERR_BLOCKED_BY_ADMINISTRATOR. git ls-remote fails DNS (Could not resolve host: github.com), so the full integration source cannot be checked out here and required npm ci/typecheck/build/G1 commands could not be independently rerun. Do not misrepresent HQ CI as local QA execution.

## Evidence-based defects

### P1 — #46: PARTIAL cannot be reached in ordinary UI

- E01 finite evaluator returns PARTIAL for one valid A or B (independently executed twice; narrativeCleared=false).
- Actual UI requiredCount is 2; updateSubmit disables submit when selection count is not exactly 2. Thus one supported option never reaches the evaluator from the real interface.
- UI's existing CI test checks A+E (TRY_AGAIN) then A+B (PASSED). That does NOT exercise PARTIAL.
- **Owner** UI + Learning/HQ; require a genuine Partial state in real browser without awarding XP. QA Node and browser gates delivered.

### P2 — #47: duplicated rubric explanations and contradictory save-state label

- Actual E01 success screenshot has paragraph and two identical rubric bullet paragraphs. Code evaluator populates each criterion with the same SUCCESS sentence; overlay loops each criterion without deduplication or criterion-specific meaning.
- Actual CI screenshot shows +20 XP as confirmed but disabled Submit says waiting for save confirmation. Code renderReceipt calls updateSubmit; updateSubmit sets passed button text to the waiting label regardless of saved receipt.
- This is messaging/UX defect; **not** evidence of failed storage. Fix explanation and confirmed/retry CTA, rerun mobile screenshot.

### P2 — #48: localStorage property getter throws before safe fallback

- HQ staging entry passes window.localStorage directly into Engine; browsers with SecurityError when reading the getter can abort before loadSave's guarded getItem sees it.
- Source-inspected risk only. Expected-red browser test injects a throwing getter; not run locally. Owner HQ/Engine.

## What the existing CI actually proves

- Real Phaser canvas boot and physical keyboard movement from spawn to a WorldNode in desktop and emulated mobile Chromium contexts.
- Correct E01 JSON connected to scene/overlay via HQ adapter. Unsupported A+E receives TRY_AGAIN and no XP; hint visible; supported A+B leads to durable +20 XP receipt; old v0.4 raw string retained; new receipt survives reload once; close returns focus to #inspect and waits for resumed Engine state.
- No general creative free-text mastery: assessments are STRUCTURED_VERIFIED finite authored selections with masteryAwarded=false.
- Only one staged E01 is playable: play.ts catalogs only [content] E01 and one node. E02/E03 are authored, not integrated; 9+3 Boss is design only. Graybox hero and world cannot be approved as final art.

## What is not proven

- Independent re-run of the HQ five mandatory CLI steps (checkout/network block), new QA Node/Chromium tests or failing browser regression paths (new tests authored only).
- Real mobile touch movement/inspect, real Android portrait/landscape, screen reader focus-trap usability, 200% text zoom, measured contrast/tap-target ergonomics and frame/performance budget.
- Corrupt legacy records, partial legacy Boss snapshot import with no false new Boss mastery, denied localStorage getter, quota errors and consistent UI feedback under save failure; QA test code supplied, execution pending.
- Live github.io staging URL (not deployed) and offline/PWA cache, history/reload actual origin. Green workflow is not a published web game.
- Semantic content fairness for E02/E03 or one full realm. Learning Architect and Game Director separately own signoff on #45/#44.

## QA-owned deliverables and execution instructions

Files: tests/g1/e01-contract-qa.test.mjs, tests/g1/e01-browser-qa.test.mjs,
qa/G1-E01-TEST-MATRIX.md, qa/G1-E01-QA-REPORT.md,
qa/evidence/g1/issue-43-independent-probes.json.

To reproduce on a real checked-out feature branch with Node >=22 and pinned dependencies:

    npm ci --no-audit --fund=false
    npm run typecheck:g1
    npm run build:g1
    npm run smoke:g1
    npm run smoke:play:g1
    node --test tests/g1/e01-contract-qa.test.mjs
    node --test tests/g1/e01-browser-qa.test.mjs

The last two commands must be wired by HQ as a **non-optional** QA gate (test red means failure); QA intentionally does not modify package.json or .github/workflows. Runtime screenshot+console JSON outputs should be archived from qa/evidence/g1/runtime/ on every run including failures. Do not mark SKIP as PASS, and do not close P1 #46 on source-only rewrites.

## Release escalation / next acceptance

HQ must fix #46, re-run new QA test suite on its updated exact integration SHA, and attach independent screenshots that show PARTIAL without XP; fix #47 and verify persisted receipt/CTA clarity; triage #48 and corrupt/blocked storage; run real Android mobile touch and landscape; get Game Director #44 and Learning Architect #45 signoff. Publish W01 9+Boss only after its independent full game test. Merge/release remains HQ-only.

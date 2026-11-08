# G1 independent QA matrix — Issue #43

Date: 2026-11-08
Baseline: cq/integration/vertical-slice at c976f084243a018a96595b88aaf7b5bbcf733b2f
Owner: QA only. Scope: tests/ and qa/. Target: G1 staging only.

## Status policy
- SOURCE-PASS / SOURCE-FAIL: QA examined/executed the real source with isolated V8, not a full browser.
- CI-PASS: independently read the exact previously-generated HQ/GitHub workflow log and matched screenshots; not a fresh local QA rerun.
- FAIL: direct reproducible source inconsistency with an acceptance condition, or visual contradiction in real CI artifact.
- NOT RUN: test code authored but never run on a checkout; never treated as PASS.
- BLOCKED: environmental barrier or missing hardware/staging feature; never treated as PASS.

| Test | Objective | Method / device | Outcome | Evidence / caveat |
| --- | --- | --- | --- | --- |
| G1-01 | npm ci on exact source | GitHub Actions ubuntu-latest Node 22 | CI-PASS | Run 42484888738 job 128744497992; QA local npm ci NOT RUN |
| G1-02 | Strict TypeScript G1 | npm run typecheck:g1 | CI-PASS | Run 42484888738; QA local NOT RUN |
| G1-03 | Vite Pages-subpath build | npm run build:g1 | CI-PASS | Run 42484888738; only /g1/ staging path |
| G1-04 | Phaser bootstrap with visible canvas and console quiet | npm run smoke:g1, Chromium 158 | CI-PASS | Desktop+mobile360 emulator, GitHub CI only |
| G1-05 | Real keyboard-moved WorldNode opens authored E01 | npm run smoke:play:g1, Chromium 158 | CI-PASS | ArrowUp + E on both emulated devices; no diagnostic openLevel |
| G1-06 | Supported A+B E01 returns PASSED / no mastery | Real evaluator V8 | SOURCE-PASS | supported-AB; original function body and authored JSON |
| G1-07 | Supported A+C also works | Real evaluator V8 | SOURCE-PASS | supported-AC; not browser-played |
| G1-08 | PARTIAL A-only, B-only actually reachable | Evaluator and actual UI submit guard | FAIL / P1 #46 | Evaluator returns PARTIAL, UI blocks submit for n=1 |
| G1-09 | Unsupported motive + overclaim | Real evaluator V8 | SOURCE-PASS | A+E OBS-E01, B+D OBS-E03, both TRY_AGAIN; no mastery |
| G1-10 | Hint progression, wrong → retry → XP | Real E01 CI browser | CI-PASS | Workflow tests A+E wrong, hint, A+B success; not partial |
| G1-11 | 20 XP only after durable receipt | GitHub Chromium staging | CI-PASS | Receipt count=1, XP 35→55, persisted in new v1 key; independent adversarial run NOT RUN |
| G1-12 | No duplicate XP after reload/retry | CI reload receipt plus QA Node code | PARTIAL | One receipt after reload proven by CI; independent repeated submission still NOT RUN |
| G1-13 | Escape, closed dialog, explicit resume then returned focus | GitHub Chromium staging | CI-PASS | Existing test waits paused=false after close, focus #inspect; no independent request-id trace |
| G1-14 | Legacy v0.4 old bytes unchanged | GitHub CI + source | CI-PASS | CI uses unknown field and xP35; old raw string equal across reload |
| G1-15 | Legacy Boss partial snapshot not falsely mastered | QA Node regression | NOT RUN | Added bossPhase:2, bossPhases[20]:1 and expected no G1 Boss/mastery; existing CI used bossPhase:0 |
| G1-16 | Corrupt v0.4/v1, quota, inaccessible storage | QA Node/browser tests | NOT RUN | New QA tests authored; window.localStorage getter source risk #48 |
| G1-17 | 360px touch-to-move and TAP inspect | Real physical pointer path | NOT RUN | Existing CI uses keyboard even on mobile isMobile:true; independent Playwright touch test authored |
| G1-18 | Portrait overflow and readable labels | 360x740 Chromium emulation | CI-PASS (basic) | CI scrollWidth check and screenshot; not physical Android nor human WCAG check |
| G1-19 | Landscape keyboard + clipping | 740x360 emulation | NOT RUN | Independent QA browser test authored |
| G1-20 | Visual success feedback conveys meaning without duplicates | Actual CI screenshot + UI code | FAIL / P2 #47 | Same criterion line repeated twice plus success paragraph |
| G1-21 | Button accurately reflects persisted reward | Actual CI screenshot + UI updateSubmit code | FAIL / P2 #47 | Confirmed +20 XP but button still says waiting for save |
| G1-22 | E02/E03 cannot be played from staging | HQ play.ts source | SOURCE-PASS | createChallengeCatalog([E01]) and one WorldNode; E02/E03 authored only |
| G1-23 | Full W01 9 challenges + 3-phase Boss | Game runtime | BLOCKED | Not integrated, no actual Boss mechanics; cannot count legacy 100 as release tests |
| G1-24 | Android midrange portrait + landscape + accessibility screen reader | Real device | BLOCKED | No physical Android/test hardware was controlled |
| G1-25 | Offline/PWA cache + reload + history | Actual target Pages context | BLOCKED | Isolated G1 preview not a deployed/cached PWA; prod v0.4 different |
| G1-26 | Staging/live github.io user journey on exact SHA | Actual deployment | BLOCKED | No published integration URL verified; do not infer from CI green |
| G1-27 | Previous legacy P1 #14–#17 fixed | Old root v0.4 / PR #29 | NOT RUN | Legacy root remains separate; #29 unshipped; no auto-close |

## CI artifact provenance
Workflow: https://github.com/Mahmoud-abd-elwahab/Creative-Quest-Game/actions/runs/42484888738
Artifact: https://github.com/Mahmoud-abd-elwahab/Creative-Quest-Game/actions/runs/42484888738/artifacts/13618843676
Verified artifact ZIP SHA256: 9555c6580d4740c84a4c2e720fa6ed847c08983e160fd666e6d8ac952e9d9a66.
Actual reviewed screen paths: actual-interaction/real-e01-desktop1280.png and actual-interaction/real-e01-mobile360.png.
The screenshots show the success state AFTER the actor solved E01; they cannot prove how the actor reached it.

## QA-owned commands for HQ to run on a checked-out PR

1. npm ci --no-audit --fund=false
2. npm run typecheck:g1
3. npm run build:g1
4. npm run smoke:g1
5. npm run smoke:play:g1
6. node --test tests/g1/e01-contract-qa.test.mjs
7. node --test tests/g1/e01-browser-qa.test.mjs

Tests #6 and #7 are new and intentionally expose P1/P2 expected failures. HQ owns CI wiring. Screenshots and JSON errors are saved by QA browser tests to qa/evidence/g1/runtime/; upload that directory even on failed CI. No skip-as-pass. Preserve exact SHA, browser version and device matrix.

## Verdict
**G1 technical acceptance: CHANGES REQUIRED** (#46 must be resolved and retested).
**Production: NO-GO**, until full W01, Boss, creative/learning approval, real Android, live Pages and legacy hotfix regressions pass.

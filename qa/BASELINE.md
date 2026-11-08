# QA v0.4 baseline — independent release gate

**Task:** #5 — first QA deliverable (legacy smoke tests before migration)
**Source HEAD reviewed:** 40c76c3aafe6b8bd3d2db0723587e7d02ec9dcc1 (2026-11-08)
**Owned changes:** tests/ and qa/ only; main and workflows untouched.
**Target site:** https://mahmoud-abd-elwahab.github.io/Creative-Quest-Game/
**Release call:** **NO-GO** for claiming a verified production release. **BLOCKED** for live UI verification.

## Evidence and execution record

- Reviewed README.md, docs/PROJECT-BIBLE.md, docs/AGENT-ROLES.md, docs/SHARED-CONTRACTS.md, index.html, manifest.webmanifest, service-worker.js and .github/workflows/deploy-pages.yml via the connected GitHub repo at source HEAD.
- Source inspection from the connected GitHub file content in JavaScript V8: **11 checks passed / 0 failed**. These were structural checks and JS syntax parsing, including positive *detection* of known risky patterns. Details: qa/evidence/source-inspection-2026-11-08.json. **They are not 11 browser tests.**
- Local environment: Node v22.16.0, npm 10.9.2. Packages playwright and @playwright/test unavailable.
- Tried: git clone --depth 1 https://github.com/Mahmoud-abd-elwahab/Creative-Quest-Game.git /mnt/data/creative-quest-qa -> failed: Could not resolve host: github.com. Therefore the new Node test files could not be executed against a local checkout in this session.
- Tried to access the live GitHub Pages URL and GitHub/raw URLs through web access -> inaccessible from this environment. **Not a 404 confirmation; live deployment load, console, screenshot and actual asset requests are unverified.**
- No browser binary/device controlled. No actual gameplay screenshot or video recorded. No claim that v0.4 mobile, keyboard, Boss or offline flows passed.
- Existing deployment workflow triggers on push to main, uses upload-pages-artifact path: . and deploy-pages@v4. That proves configuration **only**, not Pages successful availability.

## Source-confirmed defects and risks (not browser-reproduced)

| ID | Severity | Evidence at baseline | Consequence / owner |
| --- | --- | --- | --- |
| QA-P1-001 | P1 | Global keydown handler calls preventDefault for key === ' ' without excluding textarea/input/contenteditable or modal state. | Space may be blocked while typing multiword answers, a core learning flow. Engine/UI must fix. Browser regression test provided. |
| QA-P1-002 | P1 | service-worker.js activate handler deletes every cache name except creative-quest-adventure-v04. | GitHub Pages sites under same username share an origin. Activating this worker may delete caches used by other apps on that origin. HQ/Engine must constrain cache deletion by app-specific prefix. |
| QA-P1-003 | P1 | First Boss phase-one fallback button id=discuss directly sets save.bossPhase=2, bypassing the written-rubric attempt; final victory is self-confirmed with confirm(). | Three phase counters are not independent proof of mastering the task. Learning/Boss owner must define an honest, explicit self-review gate. |
| QA-P1-004 | P1 (a11y risk) | modal(...) inserts role=dialog content and displays overlay but does not move focus, trap focus or restore focus on close. | Keyboard and screen-reader dialog navigation likely broken; requires browser reproduction. UI owner. |
| QA-P2-001 | P2 | Real interact() opens challenge(n-1) for n<10, whereas CreativeQuestDiagnostics.openLevel(n) opens observationVariant(n-1). | Testing only the diagnostic shortcut would cover a different challenge format from real gameplay. QA suite explicitly exercises the real #action path. Engine/Learning alignment needed. |

**Severity rule:** P0 = data loss/complete launch failure; P1 = core play or accessibility/learning gate failure; P2 = materially degraded non-blocking feature; P3 = cosmetic/minor. The cache issue is a **risk derived from source**, not evidence that user data was erased. No P0 is asserted without runtime evidence.

## What is complete

- Version-pinned source baseline review and risk inventory.
- tests/legacy/v04-source.test.mjs: dependency-free Node static baseline.
- tests/legacy/v04-browser.test.mjs: Chromium Playwright smoke tests, first-real-encounter, movement, Boss phases/retry/save, mobile and joystick, keyboard space and dialog focus, local Pages subpath and offline reload.
- qa/TEST-MATRIX.md: automated, manual, deferred and unrun checks.
- qa/HQ-CI-REQUEST.md: required CI wiring outside QA ownership.
- Source inspection log committed under qa/evidence/.

## What is NOT complete / release conditions

1. HQ checks out PR branch and runs Node source suite; needs explicit PASS count/output and runtime versions.
2. HQ installs Playwright + Chromium in CI and runs browser tests; collect screenshots and JSON logs. Do not treat SKIPPED browser tests as PASS.
3. Fix P1 source defects; rerun tests against exact new SHA and Chrome desktop + Android 360px touch emulation; manually verify a real Android device for the release.
4. Validate authored content meaning and progression; diagnostic total=100 is **not** evidence of 100 unique, effective levels.
5. Manually navigate real deployed github.io Pages URL: load, first challenge, first Boss, refresh/save, service-worker offline reload, inspect Network and Console; record screenshots, browser/device and exact deployed SHA.
6. HQ alone approves merging to main and release/rollback.

**Final gate: NO-GO** until P1s triaged/fixed, relevant automated tests pass (without skips) and live Pages + mobile journey are verified.

## QA continuation — 2026-11-08, post-PR baseline extension

**Data-only V8 execution of exact inline v0.4 data scripts:** 90 non-Boss challenges + 10 Boss IDs + 10 worlds; ID set exactly 1–100; zero duplicate IDs; zero exact normalized duplicate titles, evidence blocks or prompts; 63 structured non-Boss answer groups reviewed for answer-index validity with **zero structural invalids**. **This does not prove semantic uniqueness, accessibility, or correct pedagogy**. Evidence: qa/evidence/v04-isolated-v8-2026-11-08.json.

**Independent V8 executions of original source with isolated stand-ins (not browser):**
- QA-P1-001: executed actual global keydown callback with a Space event whose target was TEXTAREA, in mode dialog. preventDefault fired. The regression is **confirmed at the callback level**; full browser behavior is still not tested.
- QA-P1-002: executed actual service-worker activation callback using CacheStorage stand-in with names portfolio-cache-v1, creative-quest-adventure-v04, other-app-v2. It deleted BOTH unrelated caches. **Confirmed at the callback level**, with no actual user data accessed or destroyed. Full browser reproduction is blocked.

**Browser availability:** Python Playwright is installed and Chromium 144 is available at /usr/bin/chromium. Explicit-executable browser launched, but navigating to even an isolated loopback fixture returned net::ERR_BLOCKED_BY_ADMINISTRATOR. There was no real browser UI playtest, no screenshot, and no verified Pages response. Git clone still fails container DNS resolution. These remain **BLOCKED**.

**New QA files:** tests/legacy/v04-content.test.mjs; tests/legacy/v04-safety-regressions.test.mjs (two deliberate expected-red checks while P1 issues persist); qa/run-v04-gate.sh (fail-closed runner; call with bash because connector-created file permissions are not executable). The browser suite now includes an explicit failing prerequisite check when Playwright is missing, preventing all-skip green CI.

**Recommended HQ command:** bash qa/run-v04-gate.sh after installing Playwright and a browser. Full actual Node test execution is **NOT RUN** in this environment because the repository cannot be checked out. A passing content audit cannot override the expected-red safety tests.

**Release decision unchanged: NO-GO**, even though data-shape checks passed.

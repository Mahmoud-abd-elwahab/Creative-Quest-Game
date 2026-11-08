# QA HANDOFF — v0.4 before migration
**2026-11-08 — independent QA, release is NOT approved**

- Task: GitHub Issue #5.
- Repository: Mahmoud-abd-elwahab/Creative-Quest-Game (root).
- Source baseline (unchanged main): 40c76c3aafe6b8bd3d2db0723587e7d02ec9dcc1.
- QA branch: cq/qa/5. Draft PR #13, HQ merges only.
- Owned changes: tests/ and qa/ exclusively. This file is not proof that PR has been merged.

## Delivered (12 QA-only files)

Tests: tests/legacy/v04-source.test.mjs; tests/legacy/v04-content.test.mjs;
tests/legacy/v04-safety-regressions.test.mjs; tests/legacy/v04-browser.test.mjs.
Fixture: tests/fixtures/legacy-v04-save-cases.json.
Runner: qa/run-v04-gate.sh.
Reports: qa/BASELINE.md; qa/TEST-MATRIX.md; qa/HQ-CI-REQUEST.md; qa/HANDOFF.md.
Evidence: qa/evidence/source-inspection-2026-11-08.json and
qa/evidence/v04-isolated-v8-2026-11-08.json.

## Counts — distinguish evidence types

- V8 source review: 7 positive structural checks and 4 confirmed source risk patterns; no syntax errors in the legacy inline scripts.
- Data-only V8 execution: 90 playable non-Boss levels + 10 Boss IDs + 10 worlds; 100/100 numeric ID coverage; no exact title/evidence/question duplicates; 63 structured-level answer groups reviewed with zero invalid selections. DOES NOT mean 100 successful playtests or semantic uniqueness.
- V8 isolated direct-handler reproduction: Space is preventDefault-ed in TEXTAREA; foreign Cache Storage entries are deleted by SW activation. Two callback-level regressions confirmed, NOT browser/device reproductions.
- New source/content/safety Node test files: authored and source syntax inspected; NOT EXECUTED with actual Node test runner against full repository checkout.
- Browser suite: authored with 11 scenario tests plus an explicit prerequisite fail check; NOT EXECUTED. Runtime browser screenshots: 0.
- Save fixtures: 5 valid synthetic legacy saves and 2 corrupted records; future Engine migration adapter not yet available.
- Latest QA smoke commands intended for HQ:
  bash qa/run-v04-gate.sh
  (ensure Playwright + Chromium installed before invoking).
- Current v0.4 EXPECTED RED: keyboard, cache safety, viewport zoom accessibility, reduced-motion source tests. Do not mark skipped browser cases green.

## Severity-ranked open findings

- P1 #14: Space blocked in free-text answer input — isolated source callback reproduced.
- P1 #15: Game service worker deletes foreign project caches on same origin — isolated SW callback reproduced; no real user data touched.
- P1 #16: Boss 10 phase progression can bypass genuine written reasoning — code path inspected, browser pending.
- P1 #17: Dialog lacks initial/restored keyboard focus — code path inspected, keyboard/screen-reader run pending.
- P2 #22: Diagnostic Level 1 routes to multiple-choice, but real player action routes to free text.
- P2 #23: Nine first-world actual encounters rehearse virtually the same Observation writing action with varied settings, not progressively different cognitive moves.
- P2 #24: Viewport forbids zoom, small menu/close touch targets and no reduced-motion media query; physical a11y checks pending.

## What is BLOCKED/NOT RUN

- Full Node test execution: container cannot clone GitHub (DNS), GitHub connector files are not an executable checkout.
- Browser integration: Python Playwright installed and Chromium 144 started, but localhost navigation returned net::ERR_BLOCKED_BY_ADMINISTRATOR. No screenshot/video available. Live github.io URL could not be fetched in this environment.
- Real Pages network/console, service-worker offline reload, mobile 360px Android/landscape, keyboard focus, Boss actual full journey, scenario semantic transfer and all 100 gameplay passes: **NOT VERIFIED**.
- Engine TypeScript typecheck, JSON schema, new sprite/map manifest validations, SaveState migration adapter test and new BossSpec tests: **WAITING FOR HQ INPUTS**. They are not applicable to the current pure-HTML prototype.

## HQ required actions

1. Wire bash qa/run-v04-gate.sh into a separate CI gate (do not modify workflow from QA branch).
2. Fix/triage P1 issues with owners; rerun expected-red tests until green with actual browser runtime.
3. Verify old key creative-quest-2d-v02 preserved across migration on fixtures; keep original portfolio game until parity.
4. Manually verify desktop + real Android 360px and Pages on exact deployed SHA; attach screenshots, browser console/network, errors, offline/reload and Boss interaction evidence.
5. Do not merge/release on test authoring or diagnostic level totals alone.

**Independent release decision: NO-GO / live UI BLOCKED.**

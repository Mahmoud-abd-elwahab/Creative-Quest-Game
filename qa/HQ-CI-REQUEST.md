# Cross-owner request to HQ: wire QA into CI and release gate

**Issue:** #5
**Owner requested:** Technical Producer / HQ. QA cannot edit .github/workflows/, package.json or shared contracts.
**Source review baseline:** 40c76c3aafe6b8bd3d2db0723587e7d02ec9dcc1
**QA branch:** cq/qa/5

## Required workflow changes (HQ implements)

Create a separate PR validation job or add a QA dependency before deployment. Keep the existing Pages deployment on main only. Do **not** deploy this QA branch to production.

For pull requests to the HQ integration branch / main, run:

1. Checkout, setup Node >=20.
2. 'node --test tests/legacy/v04-source.test.mjs' (static source contracts).
3. 'npm install --no-save --package-lock=false playwright' and 'npx playwright install --with-deps chromium'.
4. 'node --test tests/legacy/v04-browser.test.mjs' (real browser smoke, expected to find the P1 issues until fixed).
5. Upload 'qa/evidence/runtime/' screenshots and JSON error logs with 'if: always()'.
6. Fail CI on test failures and on browser cases being skipped due to missing Playwright or browsers. A Node test runner returning exit 0 with 9 SKIPPED browser tests must **not** be considered green. Run an explicit import/binary preflight and inspect test summaries.
7. Preserve a machine-readable test report with exact SHA, Node/Playwright/Chromium versions and test counts.
8. On TS/Vite POC arrival, add 'npm ci', 'npm run typecheck', build, JSON schema/unique-ID checks, and save migration fixture tests per HQ-approved package scripts. These are unavailable in the v0.4 monolith.
9. Release gate requires manual desktop + real Android playtest on staging and **actual github.io URL** after deployment, not only a workflow success tick. Capture console/network and screenshots for the exact deployed SHA.
10. Apply a v0.4 rollback fallback and verify the old localStorage key is not destructively overwritten.

## Explicit coordination requests

- **Engine/UI:** Fix global keydown Space suppression for text inputs, and modal keyboard focus entry/return/trap.
- **Engine/HQ:** Restrict service worker cache deletion to cache names prefixed for this game, not every origin cache.
- **Boss/Learning:** Define a phase-one or phase-two honest rubric barrier so clicking 'discuss' does not automatically pass reasoning; update testing hooks accordingly.
- **Engine/Learning:** Align real gameplay first-challenge behavior and diagnostics openLevel(1), or clearly label them as different interfaces; QA cannot use diagnostics to assert real player progress.
- **HQ:** Provide SaveState baseline and migration fixtures, BossSpec, level JSON schema, mobile target matrix, and staging SHA when ready.

## Acceptance / handoff to HQ

HQ must post links to CI run + artifacts; actual commands, device and browser versions; per-test PASS/FAIL/SKIP; defects triaged by severity, screenshots or JS logs, and live Pages navigation confirmation. QA reserves the right to recommend NO-GO. No merging/releasing by QA.
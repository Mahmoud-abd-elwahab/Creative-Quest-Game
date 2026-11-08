# QA Issue #59 — Landscape E-input independent reproduction

**Review:** 2026-11-08. **Exact integration HEAD:** ca2012f9bf1ddb1cefca310bfabca29691feb31e. **Production main:** original v0.4, unchanged. **Scope:** qa/ and tests/ only.

## Decision
**G1 CHANGES REQUIRED; production NO-GO.** A failed first run and successful second attempt on the SAME SHA demonstrate inconsistent E interaction under repeated CI execution. This is NOT proof of an Engine fault; focus/input/harness timing remain unknown. Verify before coding; never relax a timeout, substitute a diagnostic opening, or mark an alternative tap as proof that E works.

## Reviewed governance and separate signoffs
- Issue #59 and QA Issue #43, Producer's final PR #51 comment 6722727068 and Issue #43 comment 6722813662: QA red regressions merged as evidence, not gameplay signoff.
- Game Director PR #50, docs/creative/ISSUE-44-G1-E01-CREATIVE-REVIEW.md: CHANGES REQUIRED; two physically discoverable receipts/real route unlocking/canonical hero and world art not yet approved. Graybox is not production.
- Learning Architect PR #49, docs/learning/G1-ISSUE-45-EDUCATIONAL-REVIEW.md: E01 ACCEPT for bounded prototype, E02 Connect and E03 Arrange CHANGES REQUIRED; no learner/general creative mastery signoff.
- UI Issue #56 owns #46 (P1 PARTIAL) and #47 (P2 duplicate rubric and inaccurate save CTA), pending independent rerun. HQ PR #54 has corrected #48 restricted localStorage issue.
- Original v0.4 P1 issues #14–#17 remain separate from G1, no silent closure.

## Actual CI data

| Run | Source | Landscape | Other QA |
| --- | --- | --- | --- |
| https://github.com/Mahmoud-abd-elwahab/Creative-Quest-Game/actions/runs/42490155855 | 87acc54207659ca8349709d0651ad0f0c4c79d58 | PASS | 7/9 browser PASS; failures #46 #47 |
| https://github.com/Mahmoud-abd-elwahab/Creative-Quest-Game/actions/runs/42490398268 | ca2012f9bf1ddb1cefca310bfabca29691feb31e | FAIL | 6/9 browser PASS, failures #46 #47 #59; #48 PASS |

CI #42490398268 job 128761287840 timed out at the original 7000ms waiting for .cq-dialog[open] after actual ArrowUp movement reached near=true and page.keyboard.press('e'). The result does not say whether the keyboard event was dispatched into Phaser, whether focus moved, or whether Engine emitted dialog.opened.

Artifact: https://github.com/Mahmoud-abd-elwahab/Creative-Quest-Game/actions/runs/42490398268/artifacts/13621007654
ZIP SHA256: dac277b0017cec9196df7650361fc9a3b0487382e320c8e2e119629063dc1f2d.
Inspected 06-mobile-landscape.png, plus the corresponding JSON: viewport 740x360; Chromium 158.0.8127.18; Linux; no console/page errors or request failures; hero sits on the purple CLUE, world text CLUE IN RANGE, and no dialog appears. Screenshot cannot explain WHY interaction failed.

## New independent QA test and coverage
- tests/g1/landscape-input-59.test.mjs boots real G1 Phaser staging page, moves normally to the actual WorldNode, and runs **six fresh-context scenarios**: 3 landscape quick E presses, 1 portrait quick E control, 1 held-E timing contrast, 1 landscape touch inspect control.
- Passive keydown/up, focusin, status MutationObserver, approved window.__cqG1Stage.state() snapshots, before/after document.activeElement and dialog state.
- Original E keyboard assertion and 7000ms window preserved. Failed E stays a FAIL even if a later explicit Inspect-button diagnostic opens the dialog.
- Screenshots+JSON per case, plus summary, saved to qa/evidence/g1/runtime/issue-59/ so the mandatory HQ CI artifact-upload rule actually retains them. The original existing test also now captures pre/post E keydown/focus/bridge state under the same upload directory. The script is mandatory in the QA-owned qa/run-g1-acceptance.sh.
- Success also requires paused true with the real authored E01 ID, Escape/resume/focus return and original save bytes unchanged. No fake fixture screen or direct diagnostic openLevel.
- First source syntax inspection succeeded in isolated V8, NOT equivalent to Node/Playwright execution.

## Approval/dependency boundary
The HQ-approved read-only stage object currently exposes near/paused/openChallengeId/XP; it does NOT expose scene keyboard JustDown, frame timing or raw GameEvent request IDs. This is a **documented observability dependency**, not a reason for QA to monkeypatch Engine or create a private event API. If DOM keyboard events arrive but the modal fails, ask HQ + Engine owner for an approved read-only event trace before treating it as a source-level gameplay defect.

## Execution commands
From an exact PR checkout: npm ci --no-audit --fund=false; npm run typecheck:g1; npm run build:g1; npx playwright install chromium; node --test tests/g1/landscape-input-59.test.mjs; bash qa/run-g1-acceptance.sh. HQ owns the workflow wiring and artifact upload.

**Local environment limitation:** repository clone still fails github.com DNS, and browser localhost navigation is blocked; real Node/Chromium QA test execution must be evidenced by GitHub Actions, NOT claimed from authored code. Real Android device remains BLOCKED; no actual deployed Pages/PWA/offline verification. E02/E03 and W01 Boss not playable in G1.

## Release conclusion
**G1 CHANGES REQUIRED / production NO-GO.** #59 may be closed only after repeatable source-pinned evidence for working E key behavior; #46/#47 remain separate red acceptance gates regardless of landscape result.


## New QA Draft PR #63 CI evidence and artifact correction

- First QA PR run: https://github.com/Mahmoud-abd-elwahab/Creative-Quest-Game/actions/runs/42492196716, exact QA SHA be44ebc7719dd2c3d25232d108429b75fb15d90c (runtime identical to frozen integration; only QA files differ). G0 and G1 bootstrap CI PASS; required independent G1 QA gate correctly FAIL.
- Original independent contract suite 5 PASS / 1 FAIL (#46). Original browser suite 6 PASS / 3 FAIL (#46, #47, and landscape #59 failed again at 7000ms).
- New six-case test independently ran on Chromium 158.0.8127.18 in GitHub CI: all 3 landscape quick-E trials, portrait quick E, held-E contrast, touch inspect **PASS**, with no fallback used to make a failed primary pass. This demonstrates that a different scheduling/test setup can pass within the very same job while original landscape E fails; it still does NOT isolate the cause.
- Artifact #13622550065 sha256 9b4273d47e33fb710d89594adf0abb68cbbb64e367c2d921bb7a7a33c2d5e997 revealed a QA evidence packaging gap: workflow uploads qa/evidence/g1/runtime/ but the newly generated diagnostic JSON/PNG originally lived outside that tree and were not retained in ZIP. QA corrected the evidence path and instrumented the ORIGINAL failing openWorldNode keyboard invocation, preserving its 7000ms timeout and assertions.
- Before the corrective QA commit, raw node/test output proved the 6/6 independent diagnostic trials passed but **did not provide durable per-case key traces** in the artifact. Do not claim trace inspection for that run; only after CI on the corrected QA HEAD and actual artifact download can focus/input root-cause analysis proceed.
- Engine owner independently commented https://github.com/Mahmoud-abd-elwahab/Creative-Quest-Game/issues/59#issuecomment-6722947130 with same-SHA attempt 2 success. Engine patch still UNAUTHORIZED until the QA evidence assigns the failing stage. A green rerun does not close #59.

# UI Issue #56 — independent QA P1/P2 remediation handoff

**Baseline:** `cq/integration/vertical-slice@ca2012f9bf1ddb1cefca310bfabca29691feb31e` (2026-11-08).
**Owned scope only:** `src/ui/`, `public/assets/ui/`. No `main`, Engine, authored Content JSON, `tests/`, `qa/`, CI, or HQ-owned entry files.
**Issue:** https://github.com/Mahmoud-abd-elwahab/Creative-Quest-Game/issues/56.
**Cross-role evidence:** QA #43 PR #51 + QA defects #46/#47; HQ PR #55 mandatory expected-red QA; Learning #45 PR #49; Creative Director #44 PR #50; HQ storage guard PR #54. These were reviewed before implementation.

## Remediation

| Finding | Original observable defect | UI-only change and acceptance |
| --- | --- | --- |
| QA P1 #46 | E01 requires two checked options to enable submit; Engine already supports `PARTIAL` for one trace | For E01-only `multi-select`, permit 1..maximum authored answer-set cardinality (2); never accept zero or more than two. Engine alone assigns `PARTIAL`/`TRY_AGAIN`/`PASSED`. Keep choices available after partial; no XP credited by UI. |
| QA/Director P2 #47, C02 | Identical `SUCCESS` feedback shown as summary and duplicated criterion bullets | One authored `result.feedback` main WHY, plus **distinct** CLASS and TRACE criterion labels with the `0/1/2` levels actually returned by Engine. Only print criterion-provided prose if it differs from the main or previously displayed criterion message; never invent a separate assessment. |
| QA/Director P2 #47, C03 | Saved `+20 XP` alongside disabled `في انتظار تأكيد الحفظ` | After matching `reward.committed`, primary CTA becomes enabled `ارجع للعالم`. Its click calls *existing* `dialog.close.request` → `dialog.closed` → `engine.resume.request` → `engine.resumed` → focus restoration. It never emits another `challenge.submit`. Save warning wins over optimistic receipt. |

## Verification / exact commands

```bash
npm ci
npx tsc --noEmit -p src/ui/tsconfig.json
node src/ui/mock/smoke.mjs
npm run build:g1
bash qa/run-g1-acceptance.sh
```

The mandatory independent QA suite includes actual Phaser interaction and browser tests for the two specific bugs:
`tests/g1/e01-browser-qa.test.mjs`, tests named **P1 #46** and **P2 #47**, and the separate contract regression. No QA-owned assertions have been weakened, changed or skipped. The UI-owned mock smoke adds:
- one correct input → `PARTIAL`, no receipt;
- one correct + one unsupported → `TRY_AGAIN`, no receipt;
- two correct → `PASSED`, exactly-once committed reward;
- saved-receipt CTA enabled and real close/resume/focus handshake;
- mobile 360px, desktop 1280px, landscape 740px, scroll/keyboard, save.fail and locked states.

**Results:** See the GitHub PR and mandatory QA Actions run on its exact HEAD. No execution result is claimed in this source document before CI.

## Dependencies, known limits and ownership

- **QA #59 landscape E-key nondeterminism:** newly filed against Integration `ca2012f9`; failure cause explicitly **UNCONFIRMED** (could be QA harness, Engine focus/timing or UI lifecycle). This Issue #56 does not change movement/input; if real independent QA remains red after the two scoped fixes, log it as an unrelated blocker and leave investigation to QA/Engine per Issue #59. Never increase timeout or bypass the test.
- **Learning #45:** E01 finite observation assessment supported for prototype only; E02 Connect and E03 Arrange remain conceptually unapproved/unplayable, and 4/6 authored partial examples across 3 slots remain mismatched. Do not invent labels or modify scoring semantics; Content/Learning/Engine/HQ own grading.
- **Director #44 C01:** two separate physically inspectable receipt props and a genuinely passable changed world route require World + Engine + HQ wiring and creative acceptance; UI cannot implement that by adding decorative boxes. No prototype art claims.
- **Physical Android, screen reader, genuine learner transfer, full 9 levels/Boss and production Pages:** NOT verified by a green build or Chromium emulation; independent QA and Director signoff required.

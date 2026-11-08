# Issue #45 — frozen-head evidence, tests and reproducibility

**Source reviewed:** integration `c976f084243a018a96595b88aaf7b5bbcf733b2f` (2026-11-08).
**Verdict:** content-only independent learning review **CHANGES REQUIRED**. The previous HQ E01 browser success is *not* an educational or production release gate.

## Evidence provenance table
| Check | Scope / actual execution | Status | Citation / limitation |
|---|---|---|---|
| Issue #45 owner, #43 QA and #44 Creative | GitHub Issues fetched and compared | PASS | `#45` assigns `docs/learning`, `src/education` |
| Latest Technical Producer instruction | PR #20 latest discussion comment ID `6722086422` (2026-11-08T13:28:11Z) | PASS | Requires semantic review of staged E01–E03 |
| Exact frozen integration SHA | GitHub ref fetched before work | PASS | `c976f084243a018a96595b88aaf7b5bbcf733b2f` |
| Learning manifest rubric + IDs | Independent JS source readback using fetched 3 JSON and learning manifest | PASS — 21 assertions | 3 per-case slot references, sums, four hints, distinct evidence IDs, answer ID membership; distinct ops, cross-case IDs, legacy numbering; full manifest version `OBS-W1-SLOTS@1.1-draft` |
| Semantic path coverage | Independently constructed 18 path combinations; reproduced deterministic `challenge-catalog.ts` branch logic | PASS for finite safe rejection; **4 diagnostic discrepancies** | 2 strong + 2 partial + 2 unsupported per E01/E02/E03; classifications authored by Learning reviewer, NOT machine-comprehended |
| Supported choices | 6 scenarios independently accepted | PASS (6/6) | E01(A+B,B+C), E02(LOG,CALL), E03(A-before,B-before and reverse pair order) |
| Unsupported choices | 6 scenarios independently rejected | PASS (6/6) | Each non-supported path rejected, no silent finite pass |
| Partial choices must not win | All 6 rejected as PASSED | PASS (6/6) | However correct `PARTIAL` status returned for **2/6** only |
| Partial diagnostic specificity | Compare human-reviewed partial paths vs reference finite model | FAIL (4/6 mismatch) | E01 P2: TRY_AGAIN; E02 P1/P2: TRY_AGAIN; E03 P1: TRY_AGAIN/INVALID_COMBINATION |
| E01 real interactive browser | Existing HQ CI **not re-executed by Learning owner** | PREVIOUS HQ PASS | [Frozen-head HQ G1 run](https://github.com/Mahmoud-abd-elwahab/Creative-Quest-Game/actions/runs/42484888738), verified its `head_sha=c976f084...`, job succeeded on real E01 desktop + emulated mobile Chromium |
| This branch's `src/education/g1-review/verify-learning.mjs` execution | File committed; command documented, no local repo/remote runner accessible in this review | **NOT RUN** | The in-session independent checks above were executed on connector-fetched JSON, **not** by invoking this committed Node script |
| E02/E03 actual UI runtime | Integration `dev/g1/play.ts` imports only E01 | BLOCKED / NOT PLAYABLE | Authored JSON only, no independent browser test of these levels |
| Real Android, accessibility/manual UX, two human raters | No independent device or learner session | NOT RUN | Must not infer from screenshots or CI |
| Whole 9-encounter W01 + Boss | Not integrated and not tested here | NOT RUN / BLOCKED | No production approval |

## Exact 18 path fixture result
These are *authored-option-ID inputs* and reviewer diagnoses, NOT Arabic open-text NLP scores. Current Engine evaluator is a finite exact-matching function with authored distractor codes, prefix/order logic and flat subsets for options.

| Slot | S1 | S2 | P1 | P2 | U1 | U2 |
|---|---|---|---|---|---|---|
| E01 | PASSED | PASSED | PARTIAL | TRY_AGAIN **[diagnostic mismatch]** | TRY_AGAIN | TRY_AGAIN |
| E02 | PASSED | PASSED | TRY_AGAIN **[diagnostic mismatch]** | TRY_AGAIN **[diagnostic mismatch]** | TRY_AGAIN | TRY_AGAIN |
| E03 | PASSED | PASSED | TRY_AGAIN **[diagnostic mismatch]** | PARTIAL | TRY_AGAIN | TRY_AGAIN |

**No unsupported case was erroneously accepted.** Four weaker-evidence cases were denied success as intended, but lacked the intended distinct *partial* diagnosis. E02 single-select cannot represent a complete record-link action and also lacks partial-credit structured states; don't misread TRY_AGAIN as false positive.

### Reproducible Learning-owner verifier
At a local checkout of the exact integration SHA with this PR's `src/education/` test file present:

```bash
node src/education/g1-review/verify-learning.mjs
node src/education/g1-review/verify-learning.mjs --strict-diagnostic
```

First command should print structured JSON (source integrity and 18 keys). **Expected strict diagnostic exit code 1** on current authored evaluator assumptions because 4 partial cases are not marked PARTIAL. When owners correct those mismatch scenarios, strict should turn green. This test does not execute the TypeScript Engine or substitute for its actual unit test, integration E2E or QA.

Further available HQ checks, **not executed in this branch**:
```bash
python src/contracts/verify-v1.py
python src/content/reports/verify-g1-three.py
npm ci
npm run typecheck:g1
npm run build:g1
npm run smoke:g1
npm run smoke:play:g1
```
Their previous success at other branches/SHA is not direct evidence of this new PR passing.

## Highest-priority remedial tickets (no cross-owner edits)
1. **P1 educational acceptance, E02:** convert choosing a preformed claim into *actual two-source connection*, accept both logs independently with equal credit. HQ may need a versioned match/pair answer; UI/Engine and Content own changes. Current `single-select` only a G1 scaffold.
2. **P1 diagnostic fairness, E03:** one correct pair plus early scope should earn explicit “missing second pair” feedback. Prefix-only Engine matcher currently treats it as invalid combination. Present sourced pair objects instead of a trivial “قبل/بعد” sort.
3. **P2 diagnostic fairness, E01/E02:** criterion-level partial acknowledgment (some correct trace but one unsupported inference, or relevant topic but no matched follow-up) without rewarding a bad answer; split feedback by TRACE and CLASS/SCOPE.
4. **P1 QA gate (independent owner):** real learner/device checks, alt keyboard interactions, match/order if implemented, E01 physical clue evidence requirement, original save and Boss migration edge cases. No production GO.

## Change scope and trust
This review writes only `docs/learning/G1-ISSUE-45-*.md` and `src/education/g1-review/verify-learning.mjs`. Frozen integration, `src/content`, `src/core`, `src/ui`, `src/contracts`, `dev`, main and private library remain unchanged. All scenarios are fictional and no genuine customer claims have been proven.

# Issue #57 — G1 Content Pedagogy Revision / Cross-owner Diagnostic Handoff

**Verdict: CONTENT-OWNER CHANGES DONE; ACTUAL CONNECT / PAIR-PARTIAL BLOCKED ON HQ+Engine+UI.**
**Source baseline:** `cq/integration/vertical-slice@ca2012f9bf1ddb1cefca310bfabca29691feb31e` (2026-11-08); `main` untouched.
**Read:** Issue #57, PR #36 Technical Producer latest comment, integrated Learning PR #49 (`docs/learning/G1-ISSUE-45-EDUCATIONAL-REVIEW.md`), Director PR #50 (`docs/creative/ISSUE-44-G1-E01-CREATIVE-REVIEW.md`), QA PR #51 (`qa/G1-E01-QA-REPORT.md`), Issue #46/#47 UI blockers, Issue #59 mobile landscape failure, current `ChallengeSpecV1`, `challenge-catalog.ts`, Learning slots v1.1 draft, original 3 content JSON and legacy 100 inventory.
**Private Creative Library:** read-only `main@4b856c4baca3470046eeb615665ef7e10cf9ae8e`, consulted only creative-value policy and archived cross-case decision-pattern synthesis; no private campaign copy, raw case ID, origin-to-item provenance or asset passed into public JSON or this report. Text-level interpretation is not externally verified consumer effect.

## 1. Decision-first

1. **E01** remains `inspect/multi-select`, valid answer pairs untouched. Revised `OBS-E03` to explicitly flag a valid receipt mixed with unsupported majority claim; `PARTIAL` now applies only to incomplete *clean* evidence. Remove unsupported assertion that a route physically opens in the current scene: Director C01 shows only a colored line, not a traversability change. World/Engine/Director own that fix.
2. **E02** stays **single-select scaffold**, not renamed/pretended match. Rewrote prompt and all option copy so the finite choice is an independent **record candidate**, not a prewritten conclusion; purchase-only option now maps Learning-owned `OBS-E04`, generic/wrong record to `OBS-E07`. Two sufficient follow-up routes (log or call) unchanged. Full source-to-claim interaction remains **BLOCKED**: current Engine rejects `responseMode:'match'` and flat `validAnswerSets` cannot express `fromId→toId` match pairs. No unsupported fields, no invented local evaluator, no gameplay changes.
3. **E03** stays `arrange/order` with two equally fair booking-pair orders and final bounded conclusion. Removed explicit “قبل/بعد” labels from choice text; the player must use **same booking ID and date of record**, not obvious labels. Revised feedback `OBS-E07` so a correct pair plus too-early conclusion isn't falsely called “wrong source”. The **status** of that partial structure is still `TRY_AGAIN/INVALID_COMBINATION` under Engine prefix matcher — **BLOCKED on Engine** for partial pair/subgraph evaluation. No extra valid-answer keys inserted to manufacture a green test.

**No false certainty:** all newly authored in-game events are fictional. Learning describes correct source inference; there is no real-market evidence or AI semantic grading. Passing a finite answer is a narrow task pass, `masteryAwarded=false`; not confirmed creative mastery.

## 2. Explicit 18-case reconciliation

Status abbreviations: `P` = PASSED, `PA` = PARTIAL, `TA` = TRY_AGAIN. “Authored semantic label” records the **original** Issue #34 intent; “decision” below is the **agreed pedagogical/reviewer disposition**, not an instruction to force Engine into an unapproved status. `reported finite` is deterministic rule result from frozen `challenge-catalog.ts` and present answer IDs, not browser E02/E03 execution.

| Case / finite input | Original semantic label | Finite status | Correct decision | Why / revised coaching |
|---|---|---|---|---|
| E01 S1 A+B | Supported | P | ACCEPT | Two independently documented return actions; no motive inferred. |
| E01 S2 B+C | Supported | P | ACCEPT | Different two-receipt route meets same evidence rule. |
| E01 P1 A | Partial | PA | RETRY / no XP | One accurate trace, second independent receipt still missing. |
| **E01 P2 A+D** | Partial (one good trace) | **TA / OBS-E03** | **REJECT mixed unsupported, not automatic partial** | A is legitimate, D asserts most residents lost interest. One true clause doesn't rescue the false scope claim; replace D with another bounded trace. Revised OBS-E03. |
| E01 U1 D+E | Unsupported | TA / OBS-E03 | REJECT | Unsupported majority generalization plus guessed boredom. |
| E01 U2 E+F | Unsupported | TA / OBS-E01 | REJECT | Invented motive and a universal reading-completion assertion. |
| E02 S1 LINK_LOG | Supported | P | ACCEPT **scaffold only** | Same 0183 receipt + later inquiry about mint watering. |
| E02 S2 LINK_CALL | Supported | P | ACCEPT **scaffold only** | Independent dated call has same identity and question. |
| **E02 P1 LINK_RECEIPT** | Partial topic/source | **TA / OBS-E04** | RETRY relevant-but-insufficient | Purchase confirms mint purchase, not later contact. Engine single-select has no partial score. Revised code-specific feedback; do **not** award mastery. |
| **E02 P2 LINK_CARD** | Partial topic only | **TA / OBS-E07** | RETRY relevant-but-insufficient | General instructions don't prove the same customer's follow-up. Still finite TA; not a broken grade. |
| E02 U1 LINK_OTHER | Unsupported | TA / OBS-E07 | REJECT | 0219/cactus ≠ 0183/mint; coincident date irrelevant. |
| E02 U2 LINK_MOTIVE | Unsupported | TA / OBS-E01 | REJECT | Client fear unobserved, cannot infer motive from question. |
| E03 S1 A0,A1,B0,B1,SCOPE | Supported | P | ACCEPT | Ordered matching 041 and 055 updates, bounded conclusion. |
| E03 S2 B0,B1,A0,A1,SCOPE | Supported | P | ACCEPT | Pair order may be swapped without changing proof. |
| **E03 P1 A0,A1,SCOPE** | Partial | **TA / INVALID_COMBINATION** | **INCOMPLETE PAIR, needs Engine partial subgraph** | One same-ID pair correctly formed, scoped statement premature before second pair. Existing prefix matcher cannot identify this; revised OBS-E07 *explains* but status remains TA. |
| E03 P2 B0,B1,A0,A1 | Partial | PA | RETRY / no XP | Both pairs reconstructed, missing final bounded statement. |
| E03 U1 A1,A0,B1,B0,CLAIM | Unsupported | TA / OBS-E03 | REJECT | Both pairs backwards and unsupported explanation for entire audience. |
| E03 U2 A0,B1,B0,A1,CLAIM | Unsupported | TA / OBS-E03 | REJECT | Cross-ID ordering and conjectured motive without research. |

**Interpretation of 4 former mismatches:** E01 P2 must **stay TA** because unsupported scope is present. E02 P1/P2 can be described as relevant-but-insufficient without falsely promising Engine `PARTIAL`; both remain TA in the current finite single-select contract. E03 P1 *ought* to receive specific pair-level incomplete feedback and potentially `PARTIAL`, but the present prefix-only logic cannot represent this fairly. Never add a fake 3-element `validAnswerSet` that would grant PASSED, or award an unsupported answer. The Learning owner's strict diagnostic is expected red until the cross-owner decision is implemented; it is not a source-schema failure.

## 3. E02 Connect — authoritative proposed interaction (NOT in runtime JSON)

**Player-visible source-to-claim link:** NPC speaks claim `W1E02_NPC` (“owner of purchase 0183 contacted us next day about mint watering”). The player physically inspects **two independent evidence records** and draws a connection from claim to one actual later contact, not to a ready-made conclusion.

- Valid independent route A: `from=W1E02_NPC → to=W1E02_INQUIRY`, same receipt 0183, question about watering mint, later date.
- Valid independent route B: `from=W1E02_NPC → to=W1E02_CALL`, same 0183 and mint-watering question.
- Partial/insufficient: `from=W1E02_NPC → to=W1E02_PURCHASE` proves a purchase only; `W1E02_CARD` only generic care topic. Correct feedback must explain the missing later recorded action.
- Unsupported: link to `W1E02_OTHER` (0219/cactus) or `W1E02_MOTIVE` (invented fear).
- Required proof on UI: two separate inspected sources, both ends explicitly selected, connection drawn/confirmed via keyboard and tap, hint exposes missing identity/topic/time rather than giving correct choice, NPC/path state changes only after approved finite evaluation.

**Blocked contract gap:** `ChallengeAnswer` in v1.ts contains a `mode:'match'` pair type, and schema `responseMode` permits `match`, **but** Engine's `validateChallengeSpec()` permits only single-select/multi-select/order; `validAnswerSets` is flat string[][] with no pair equivalence / from-to grammar. HQ must approve a representation plus matching evaluator, Engine/UI/World must implement. Content will then revise responseMode, keys and tests in a **new approval-bound update**. Do not merge a fictional `match` payload into playable paths now.

## 4. E03 Arrange — authored vs actual play intention

**Timeline requirement:** two separately visible tracks keyed `041` and `055`. Each has **two dated states**, one recorded earlier, one modification recorded later; the player places cards into *each matching booking track*. Can start with either track. Then choose a bounded statement about only the two edited bookings. No silent inference about why the edit happened or preference of all cinema users. The unchanged `071` is an explicit counterexample against “everyone changed”, not a before/after pair.

**Content-only improvement made:** player option text now shows booking ID, dated record and time, **not “قبل/بعد” as built-in answer labels**. Valid sequences retain same two paths to avoid breaking finite evaluator. `E03/P1` incomplete pair plus scope currently triggers generic `INVALID_COMBINATION`, so `OBS-E07` explains *both* possible missing-pair and mislinked-ID reasons without asserting a false wrong-source verdict; however proper targeted partial classification requires an Engine rubric/state decision. Request HQ: either staged pair-to-pair `match` then claim, or versioned order/subgraph completeness; UI draws dual tracks with tap/keyboard alternatives. No schema or runtime modifications in this PR.

## 5. Legacy 100 cognitive novelty vs domain repetition

**Read-only inventory:** original 100 numeric IDs and levels preserved; no changes to `index.html`, save keys or past content numbers. Scenario setting overlap with L01–L03 is intentional under approved W01 GDD, and **cannot** count as a new sector. Distinct operations for authored G1 remain:
- E01 = inspect multiple evidence traces, choose two independently documented actions (not “explain why”).
- E02 = identify proof provenance by *person/reference + topic + later date*, **presently scaffold**, not real Connect gameplay.
- E03 = reconstruct matched temporal records and bound claim, not just category selection; early scope/incomplete pair diagnostic remains missing.

Cross-check concern: legacy L31–39 includes “زمان”/“فرق مبيعات”/“سلسلة وقائع” tasks; E03 must be judged in *actual no-hint independent play* against L34 and L37, not only title. Library cross-case “state-change” should teach evidence limits rather than importing a campaign plot. Final semantic uniqueness and learning outcomes still **NEEDS MANUAL REVIEW**, not a verified global similarity pass.

## 6. Test plan, exact scope and release blockers

**Tests committed:** `src/content/reports/verify-issue57.mjs` (reference finite 18-case run + 100-level ID census + rubric/keys/evidence/novelty, strict expected-red diagnostic), existing `src/content/reports/verify-g1-three.py`. HQ-owned `src/contracts/verify-v1.py` and Learning-owned `src/education/g1-review/verify-learning.mjs` unmodified.

**Commands to run at exact PR checkout** (record per-tool PASS/FAIL; a build is not gameplay):
```bash
python src/contracts/verify-v1.py
python src/content/reports/verify-g1-three.py
node src/content/reports/verify-issue57.mjs
node src/content/reports/verify-issue57.mjs --strict-partial
node src/education/g1-review/verify-learning.mjs
node src/education/g1-review/verify-learning.mjs --strict-diagnostic
```

Strict diagnostic modes are **EXPECTED RED** until the Engine/UI contracts address the four category distinctions, but no supported path should be falsely denied or unsupported path accepted. Test-only data is pedagogically annotated and does not implement NLP grading.

**External owner gates:**
1. **HQ Technical Producer:** approve match representation/answer-set structure, partial subgraph semantics vs `TRY_AGAIN`, world node/effect IDs, and whether E02 can be promoted from scaffold. No contract changes from Content.
2. **Engine:** support true record pairing, staged matched-timeline completion, criteria-specific partial/status, and preserve evidence source truth. No Engine files touched.
3. **UI/World:** separate physical inspectable source props and real traversable reveal; E02 connect gesture and E03 two-track timeline with accessible mobile/keyboard controls. E01 UI #46 partial path and UI #47 duplicate/wait-state label remain external.
4. **Learning Architect:** regrade 18 diagnostics after any HQ contract decision; sign learning mechanics, don't infer general mastery from answer key.
5. **Game Director:** require evidence-in-world and actual route/state consequence, plus final hero/world style. Source-level accepted ≠ interactive signoff.
6. **Independent QA:** execute own red/green browser/landscape/save gates on exact integrated SHA, including QA Issue #59 landscape near-node keyboard failure. QA/CI passing build != game pass; no real Android claim.

**Not executed by this Content change:** E02/E03 runtime, on-device UX, independent 100×3 semantic playtest or Boss mechanics. Keep Draft PR until HQ, Learning, Director and QA accept dependencies.

## 7. Changed-file ownership

Allowed: `src/content/levels/obs-w1-e01-inspect-library.json`, `src/content/levels/obs-w1-e02-connect-nursery.json`, `src/content/levels/obs-w1-e03-arrange-cinema.json`, `src/content/reports/verify-issue57.mjs`, this report. No `main`, `src/contracts`, `src/core`, `src/ui`, `src/education`, `docs`, `qa`, `tests`, `dev`, assets, or private-library modifications. No new game levels.

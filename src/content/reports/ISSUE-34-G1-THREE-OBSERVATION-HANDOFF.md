# Issue #34 — G1 Observation content batch E01–E03: delivery and QA handoff

**Status:** AUTHORED FOR REVIEW; NOT INTEGRATED/SHIPPED.  
**Authoring snapshot:** `cq/integration/vertical-slice@e5cf07b5d521d55afdd6b2a6b279a2e3e74d209a`, 2026-11-08.  
**Private Creative Library checked read-only:** `main@0b67b459abe92ed4c14c9549dcc66f150c7f9df7`, as of this batch. Sources consulted for **general teaching principles only**, including Creative Value First policy, mechanism-retrieval index, cross-case decision patterns, and cross-book workflow. No private campaign provenance/copyrighted material is included in public Challenges or this report.  
**Binding inputs:** Learning `OBS-W1-SLOTS@1.1-draft` manifest (integrated); rubric `OBS@1.1`; Game Director's W01 GDD; HQ's shared **G0 candidate** `ChallengeSpecV1` at `src/contracts/challenge-spec.v1.schema.json`. Issue #34 and latest Technical Producer comment on PR #25 authorize exactly E01–E03 in a feature PR — not full level-bank generation or production release.  
**Scope:** 3 JSON specs in `src/content/levels/`, plus G1 tests/report in `src/content/reports/`. No other authored paths. Public v0.4 HTML and old saves untouched.

## 1. Three original fictional encounters

| Content ID / legacy mapping | Cognitive operation / difficulty | Distinct player action | Evidence reasoning and feedback | Normalized world outcome intent |
|---|---|---|---|---|
| `cq_obs_w01_e01_inspect_v1` → `OBS-W1-E01` / L01 | `inspect-library-loan-evidence`, D1 | Use Evidence Lens on multiple **return receipts with written reader comments**, select **any two** independent accurately described actions; 3 acceptable combinations. | Separate documented return/comment from a hypothesized dislike of reading; counterexample receipt challenges 'everyone'. R-OBS-CLASS 60 + TRACE 40. | Proposed `w01-e01-lens-trail-open`: lens illuminates trail after 2 source-linked selections. |
| `cq_obs_w01_e02_connect_v1` → `OBS-W1-E02` / L02 | `connect-nursery-source-and-clue`, D1 | Match NPC's *specific* 0183 statement to **either** recorded inquiry log or phone record with same receipt ID and irrigation question; 2 valid provenance routes. | Purchase receipt or generic care card cannot prove post-sale inquiry; neither can assumed fear. TRACE 60 + CLASS 40. | Proposed `w01-e02-path-knot-lit`: link transforms a blocked clue knot into traversable path. |
| `cq_obs_w01_e03_arrange_v1` → `OBS-W1-E03` / L03 | `arrange-cinema-before-after`, D2 | Reconstruct two **separate same-booking** before→after pairs from shuffled audit records, finish with bounded conclusion; either pair can come first (2 valid orders). | Keep unchanged third booking outside pairs, never invent work-schedule motivation or citywide trend. TRACE 55 + SCOPE 45. | Proposed `w01-e03-timeline-bridge-restored`: correct ordering connects timeline walkway. |

**Originality:** names, receipts, numeric references, fictional organizations and all teaching copy were newly authored. Story sectors remain **intentionally** the same nine-context Game Director/legacy scaffold; novelty lies in provenance, route/set choice, evidence ordering, error discrimination and interactive state *intent*. Do not claim sector-level uniqueness.

**Creative Library as inspiration, not question bank:** The archive repeatedly distinguishes an attractive creative conclusion from what evidence and product truth allow. E01 practices disciplined observation before an argument; E02 practices cause/source trace over decorative proof; E03 practices a constrained state-change comparison without imaginary motives. These are broad transferable reasoning operations, **not** direct reproductions or attributions to particular campaigns. Library text-level interpretations have unverified causal effectiveness; all in-game source records are declared fictional.

## 2. 2× supported / 2× partial / 2× unsupported test matrix

**These classifications are authored, reviewer-illustrative examples.** The `verify-g1-three.py` script checks deterministic exact answer keys and prevents partial/unsupported examples from passing as verified; it **does not** automatically grade the semantic distinction between partial and unsupported.

### E01 — Inspect (choose exactly two)

- **S1:** ACT_A + ACT_B: both are accurately anchored to separate receipts. Supported, CLASS/TRACE.
- **S2:** ACT_B + ACT_C: different pair; still documented and bounded. Supported, CLASS/TRACE.
- **P1:** ACT_A alone: one grounded fact, incomplete two-source request. Partial; ask for another receipt.
- **P2:** ACT_A + ACT_D: one grounded trace plus 'most residents' extrapolation. Partial trace, unsupported scope; explain it before retry.
- **U1:** ACT_D + ACT_E: a population claim plus unmeasured boredom. Unsupported.
- **U2:** ACT_E + ACT_F: invented motive and a universal 'all complete' conclusion based on one receipt. Unsupported.

### E02 — Connect (choose one evidenced link)

- **S1:** LINK_LOG: connects employee statement to dated inquiry log using receipt 0183 and question content. Supported.
- **S2:** LINK_CALL: same linkage independently established in referenced call log. Supported alternative.
- **P1:** LINK_RECEIPT: correct purchase/plant identification, but receipt cannot establish later question. Partial.
- **P2:** LINK_CARD: instruction exists for the product but no specific follow-up event or customer. Partial topical clue only.
- **U1:** LINK_OTHER: different receipt 0219 and different plant, despite same date. Unsupported link.
- **U2:** LINK_MOTIVE: unsupported fear presumed to be established reason. Unsupported.

### E03 — Arrange (ordered option IDs)

- **S1:** A0,A1,B0,B1,SCOPE: two within-ID before/after pairs, and limited conclusion. Supported.
- **S2:** B0,B1,A0,A1,SCOPE: equally valid pair order; supported alternative.
- **P1:** A0,A1,SCOPE: correct first pair but omits second, incomplete reconstruction. Partial.
- **P2:** B0,B1,A0,A1: reconstructed both pairs but no bounded conclusion for SCOPE rubric. Partial.
- **U1:** A1,A0,B1,B0,DISTRACTOR_CLAIM: reverses both sequences and claims universal preferences. Unsupported.
- **U2:** A0,B1,B0,A1,DISTRACTOR_CLAIM: cross-links incompatible booking IDs and adds unmeasured cause. Unsupported.

**Evidence fairness:** all *validAnswerSets* point exclusively to actual option IDs. E01 has 3 fair combinations, E02 has 2 independent confirmation routes, E03 has 2 valid pair orders. Distractor-specific `OBS-E01/E02/E03/E06/E07` feedback describes the precise unsupported step; `PARTIAL` and `SUCCESS` text are authored and visible but **not yet bound to runtime status transitions**. Four escalating hints are provided per encounter; no automatic narrative bypass.

## 3. Anti-duplication against legacy 100 and within G1

- **Structural inventory baseline:** integrated `docs/learning/LEGACY-100-INVENTORY.md` lists all 100 numeric IDs. Legacy L01–03 are open-wording description prompts, with repeated mental task 'describe a shared behavior'; G1 E01 is **physical evidence selection**, E02 independently checks source **provenance**, E03 checks **matched temporal order + bounded scope**.
- **Cognitive signatures:** E01 `inspect logs → two recorded behavior traces`; E02 `cross-link testimony → dated independent customer follow-up`; E03 `pair transaction-specific timeline → limited changed-direction claim`. Context similarity is acknowledged via `novelty.reviewOf=legacy-L01/L02/L03`.
- **Unique identifiers:** each `id`, `slotId`, `scenarioId`, `cognitiveOperation`, `novelty.fingerprint`, `novelty.cognitiveSignature`, evidence ID and option ID must be unique across the three. Each has a stable `legacyLevelId` **mapping only**; legacy save keys are not overwritten.
- **Automated checks:** `python src/contracts/verify-v1.py` validates schema, option references, local IDs and rubric sum; `python src/content/reports/verify-g1-three.py` extends contract tests with exact slot/mode/weights, unique cross-batch IDs, 100-level inventory integrity and 18 example-key trials. It does **not** validate semantic originality.
- **Manual semantic verdict:** PROVISIONAL / NEEDS INDEPENDENT LEARNING+QA REVIEW. An unchanged legacy *scenario domain* is intentional; claim of 100×3 full semantic uniqueness would be false without two-reviewer judgement of authored scripts and integrated interactions.
- **Wrong-option answer-position controls:** E01 multiple selected pairs, E02 two equivalent correct alternatives, E03 two valid orders. QA should still test location/position bias once the UI presents the options.

## 4. Contract compatibility / exact remaining blockers

**Current G0 ChallengeSpec shape can serialize:** stable IDs, fictional evidence with E-IDs and types/scope, option IDs, finite valid answer sets, rubric IDs/weights, feedback by error codes, hints and novelty signatures. E01=multi-select, E02=single-select with *connect* interaction intent, E03=order. No free-text semantic grading.

**Missing for guaranteed physical world effects:** `ChallengeSpecV1` has no `nodeId`, `effectEventId` or `onSuccessEvent` field and `additionalProperties:false`. `LevelSpecV1.nodeId` can map a single challenge to a WorldNode, but no owner-approved runtime `WorldNode` IDs or effect events exist for this batch. The three event names in section 1 are **proposed handoff labels only**, *not agreed, emitted or integrated*. HQ/Engine/World must confirm mappings through their owned contracts and files. We did **not** smuggle undocumented keys into JSON or edit any shared file.

**Matching limitation:** The schema's `validAnswerSets` contains flat option/evidence ID sets, not pair-to-pair structured matching. E02 therefore authors a **single-select among source-link actions** even though the intended environment gesture is a connect action. HQ/UI/Engine need to clarify whether a future genuine match interaction can encode `ChallengeAnswer.mode='match'` pairs without a new contract; don't pretend it is already implemented.

**Difficulty/rubric state:** exactly D1/D1/D2; primary OBS; rubric weights follow integrated `OBS-W1-SLOTS@1.1-draft` manifest. Structured-key pass proves this narrow authored behavior only, not a universal OBS mastery credential. Reward receipt IDs are **not authored here** (Engine owns rewards).

**Dependencies before integration:**
1. HQ decides outcome-event mapping, node IDs and whether per-option misconception feedback and match/pair semantics need versioned contract support.
2. Engine/UI/World implement player gestures, correct source inspection gating, physical state change and accessible touch/keyboard alternatives; none is implemented by this branch.
3. Learning Architect verifies that each new task asks a cognitive action beyond v0.4 in practice and two valid routes are fair.
4. Game Director checks the visual/gameplay experience, not just JSON wording.
5. Independent QA runs item fairness, alternative input, hint/retry, save compatibility, mobile, semantic comparison and real browser testing.

## 5. Testing evidence and commands

**Authored tests:**
```bash
python src/contracts/verify-v1.py
python src/content/reports/verify-g1-three.py
```

**Expected test coverage:** Draft 2020-12 schema + HQ negative fixtures, 3 authored files, Learning slot identity, rubric sum+bindings, response-mode and finite-answer checks, IDs/fingerprints, 100 legacy inventory count, 18 authored trial answers (6 per encounter), and negative fixtures for unknown option IDs/incorrect rubric sums.

**Execution labels are given in PR #34 from actual tool/CI results.** A file existing is not proof its Python test was executed; distinguish static authoring/preflight from CI execution.

**No running game, no browser/mobile evidence, no shipped content or private-library change is claimed.** 

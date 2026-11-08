# Issue #45 — G1 E01–E03 Independent Learning Review
Review version: G1-LEARNING-REVIEW@1.0 | 2026-11-08
Reviewer role: Learning Architect & Assessment Designer
**Decision: E01 ACCEPT FOR G1 PROTOTYPE; E02 CHANGES REQUIRED for educational novelty; E03 CHANGES REQUIRED for diagnostic fairness. Overall: CHANGES REQUIRED before G1 educational signoff; technical staging may continue.**
This is source/logic and rubric review. It is NOT a human learner trial, independent runtime QA, complete creative approval, or production release.

## Frozen evidence and review authority
- Integration source: `cq/integration/vertical-slice@c976f084243a018a96595b88aaf7b5bbcf733b2f` (HEAD read before review).
- Assigned Issue: [#45](https://github.com/Mahmoud-abd-elwahab/Creative-Quest-Game/issues/45). Other role issues #43 independent QA; #44 Creative Director.
- Prior Learning PR: [#20](https://github.com/Mahmoud-abd-elwahab/Creative-Quest-Game/pull/20) merged. Latest Technical Producer comment ID `6722086422`, 2026-11-08 13:28 UTC, requests #45 semantic review and notes only E01 playable.
- Content review target: [PR #36](https://github.com/Mahmoud-abd-elwahab/Creative-Quest-Game/pull/36) provisionally merged to **technical staging**. Read [HQ Issue #39](https://github.com/Mahmoud-abd-elwahab/Creative-Quest-Game/issues/39) and comments including 13:28 UTC status.
- Authored exact files: `src/content/levels/obs-w1-e01-inspect-library.json` (blob `38ec7dab091a7cb635186acc5178e6ac8b6d4997`), `obs-w1-e02-connect-nursery.json` (fetched at frozen integration), `obs-w1-e03-arrange-cinema.json` (blob `861c6339511579cb2037e356ec2eb6254adaecba`); `docs/learning/LEARNING-SLOTS.v1.json` version `OBS-W1-SLOTS@1.1-draft`; `docs/learning/ASSESSMENT-RUBRICS.md`; `LEGACY-100-INVENTORY.md`.
- Actual runtime scope: `dev/g1/play.ts` imports **only E01**, creates only one WorldNode `g1-observation-w01-e01-clue`. `E02` and `E03` are NOT playable in this integration.
- HQ has successful [CI run 42484888738](https://github.com/Mahmoud-abd-elwahab/Creative-Quest-Game/actions/runs/42484888738) for G1 technical E01 desktop/mobile-emulated Chromium. This review did NOT re-run those jobs. Real Android and final learning validation remain unverified.

## G1 independent scoring criteria
The test is not “three different verbs in JSON”. Ask:
1. Can the player actually identify source evidence and bound a claim without invented psychology?
2. Are the cognitive verbs **inspect (two witnessed actions)**, **connect (proven source linkage)**, **arrange (matched before/after + scope)** truly different in a player's decision?
3. Is each **finite** validAnswerSet grounded, do alternatives receive equal credit, are diagnostic criteria/weights exact?
4. Are **supported / partially supported / unsupported** reasons taught distinctly, not mislabeled because of a generic failure branch?
5. Are hints and feedback specific, unleading, Egyptian Arabic plus English agency vocabulary?
6. Can `narrativeCleared` be true with `masteryAwarded=false`, without claiming general creativity, later-skill or trusted human Insight mastery?
7. What new decision will this teach later in a *different* sector? Reference new G1 interaction, not just a new brand label.

## E01 Inspect — ACCEPT FOR PROTOTYPE (bounded)
- `id=cq_obs_w01_e01_inspect_v1`; `slotId=OBS-W1-E01`; `interaction=inspect`; `responseMode=multi-select`; band 1; rubric R-OBS-CLASS 60 + R-OBS-TRACE 40 = 100, exact Learning Manifest match.
- **Truth-source distinction:** records 41/57/62 record the book's return and self-reported unfinished reading; they do **not** independently measure reading progress. Receipt 75 records a completed book and limits generalisation. Apparent “hate reading” is a fictional shadow's unsupported motive, not actual user research.
- **Multiple correct routes:** any two of ACT_A/ACT_B/ACT_C = 3 accepted sets. No uniquely prescribed exact Arabic sentence, no single correct option position. All source-linked to distinct receipts.
- **Strong paths (2):** ACT_A + ACT_B; ACT_B + ACT_C. They cite different receipts, without assuming user motivation.
- **Partial paths (2):** ACT_A alone (one good source, request two); ACT_A + ACT_D (one grounded action + a bad claim about neighborhood majority). In this mixed case, correct partial credit for *trace* is educative, but the unsupported global claim must be clearly rejected; the engine currently returns TRY_AGAIN and 0 for all criteria for authored bad-option choices.
- **Unsupported paths (2):** ACT_D + ACT_E (“most residents” and “bored”) and ACT_E + ACT_F (unsupported boredom plus “everyone finished”). Neither should pass. Deterministic trace confirmed both rejected.
- **Feedback:** multi-select partially supported A alone is PARTIAL; incorrect A+D is TRY_AGAIN with OBS-E03 explanation. Pass earns narrow STRUCTURED_VERIFIED for finite evidence selection, but `masteryAwarded=false` as required. **Not proof of world-level OBS mastery or actual creative thinking ability.**
- **Required nonblocking improvements:** distinguish user-written comment from independently observed number of pages read explicitly in UI; differentiate mixed correct+unsupported *criterion-level* trace/scope in future evaluator; have QA inspect whether player physically examines two records before selection, not simply clicks a 2-choice answer in a dialog.
- **Later unfamiliar use:** if a brand brief claims “all buyers hate our product”, require the designer to cite specific receipts/interviews and expose unmeasured motive.

## E02 Connect — CHANGES REQUIRED for independent learning-mechanic acceptance
- `id=cq_obs_w01_e02_connect_v1`; `slotId=OBS-W1-E02`; `interaction=connect`; `responseMode=single-select`; band 1; R-OBS-TRACE 60 + R-OBS-CLASS 40 = 100, exact manifest match.
- **Source reasoning is valid:** the nursery employee's claim for receipt 0183 matches later 0183 inquiry log OR 0183 phone inquiry on watering mint. Purchase receipt proves purchase only; generic care card proves instructions exist, NOT that customer returned; 0219 cactus inquiry cannot match 0183 mint. No source proves fear of plants dying.
- **Strong (2):** LINK_LOG or LINK_CALL, independently defensible.
- **Partial (2):** LINK_RECEIPT (relevant receipt but missing post-sale behavior); LINK_CARD (relevant topic, no person or follow-up event).
- **Unsupported (2):** LINK_OTHER (wrong person/plant ID), LINK_MOTIVE (unmeasured fear). All four non-strong finite options are currently TRY_AGAIN, so rubric distinctions in Content PR #36 are not actually conveyed as different AssessmentStatus.
- **PEDAGOGICAL GAP:** user simply picks one already-written *finished linkage sentence*; `interaction:connect` is a label, not proof of the player locating both the NPC and matching independent record. There is no playable E02 screen in the integration. This can remain a transparent **G1 content/schema scaffold only**; do **not** sign off as a working Connect encounter.
- **Required Content + UI + Engine improvement before G2 educational acceptance:** show claim object on left + independent record objects on right. Player explicitly links the claimed receipt ID **and** the matching question/date/source; a distractor must match only product OR only time, to force provenance rather than brand recognition. Accept either 0183 inquiry or call (two paths); keyboard/tap equivalent. If HQ versioned `match` answer representation cannot hold pairs, request HQ interface change; do not hack new JSON fields into existing contract. Emit criterion-specific outcomes (correct source trace vs merely relevant topic vs invented motive).
- **Later unfamiliar use:** link a fictional client feature claim to support ticket/invoice proof rather than to a generic brochure or an unrelated dated note.

## E03 Arrange — CHANGES REQUIRED for diagnostic fidelity (candidate order logic otherwise grounded)
- `id=cq_obs_w01_e03_arrange_v1`; `slotId=OBS-W1-E03`; `interaction=arrange`; `responseMode=order`; band 2; R-OBS-TRACE 55 + R-OBS-SCOPE 45 = 100, exact manifest match.
- **Valid source inference:** ticket 041 changed from 23:00 to 16:00; 055 changed from 22:15 to 10:00. Ticket 071 at 09:00 had no amendment: it is a counterexample to “all bookings moved”. No evidence about citywide preferences, late-night danger, or work schedule.
- **Strong (2):** A0→A1 then B0→B1 then scoped conclusion; OR B0→B1 then A0→A1 then scope. Exact validAnswerSets correctly accept both group orderings. This is a matched source operation, not chronological sorting across different booking IDs.
- **Partial (2):** A0,A1,SCOPE (one pair, omits second) and B0,B1,A0,A1 (both pairs, lacks bounded scope). Under source evaluator's prefix-only `PARTIAL` rule, the first receives `TRY_AGAIN / INVALID_COMBINATION` with generic OBS-E07 “wrong source match” feedback, **misdiagnosing missing evidence**, while second correctly yields PARTIAL. E03 content report describes both as PARTIAL. This is a real authored-intent vs evaluator mismatch, not a creative opinion.
- **Unsupported (2):** A1,A0,B1,B0,DISTRACTOR_CLAIM (reversed and false universal motive), and A0,B1,B0,A1,DISTRACTOR_CLAIM (cross-linked identities + false cause). Neither passes.
- **Easy-cue risk:** option text literally says “قبل”/“بعد”, with matching numeric IDs, so success can reflect arrangement of **labels** rather than extracting change from actual before/after records. It is valid scaffolding for early D2, but not evidence of independent inferential skill. Content should present less signposted evidence on an optional no-hint transfer replay; check that player can justify same booking ID and bounded audience scope.
- **Required Content + Engine/UI improvements:** ensure feedback for “one correct pair + early SCOPE” says “you have one pair; second comparable pair still missing”, not “wrong source”. Decouple matched-pair completeness from final scope completeness in partial assessment, or reorder the task UI into pairing phase then bounded-claim phase. Offer a 071 countercase question to challenge “all bookings”, without treating 071 as a changed pair. QA must verify drag/order keyboard fallback and that shuffled visual positions do not change correct semantic keys.
- **Later unfamiliar use:** distinguish a change in a subset of transactions from a universal market trend and from a causal claim in a social campaign report.

## Distinct cognition vs 100-level legacy bank
- Source inventory `LEGACY-100-INVENTORY.md` lists 1–100, 90 encounters/10 Bosses. Legacy W01 normal route reused keyword-scored “summarize recurring behavior” for 9 screens.
- Candidate E01: select two independently documented behaviors while rejecting motive; E02: source-link named testimony using identity + topic + later date; E03: order two same-record revisions and bound generalization. Three **different cognitive operation signatures** confirmed in authored specs, not merely sector swaps.
- **Actual experiential novelty:** only E01 is mounted by `dev/g1/play.ts`, and does not yet independently demonstrate every inspect mechanic in the fantasy. E02 single-select has **no interactive matching** and E03 not playable. **Do not claim 3 playable levels**, that all 100 old cases are semantically unique, or that G1 education is accepted merely from different `cognitiveOperation` strings.

## Narrative progress vs mastery: approved recommendation to HQ
**YES, `narrativeCleared=true` may coexist with `masteryAwarded=false`** if the content reached an honest finite/provisional narrative gate. In current `evaluateAuthoredChallenge`, PASSED yields `trust=STRUCTURED_VERIFIED`, `narrativeCleared=true`, `masteryAwarded=false` for all three authored finite structured paths. That is appropriate for a first-world *task pass*, but do not award general creative mastery, Insight mastery, Concept mastery, or a human-verified badge. For P3 guided self-review or optional ChatGPT, set narrative clear only with explicit disclosure; `masteryAwarded` remains false, trust unverified, and rewards must not imply a cognitive credential. Existing imported v0.4 Boss progress is narrative history, not graded new skill proof.

## Recommended acceptance gate for HQ + QA
- **E01: ACCEPT FOR G1 PROTOTYPE** as specific structured Evidence selection, subject to independent QA and learning experience validation.
- **E02: CHANGES REQUIRED** to move from one selected finished link sentence to player-authored evidence pairing; interim single-select is permitted for staging fixture only.
- **E03: CHANGES REQUIRED** to correct partial-feedback misdiagnosis and demonstrate actual matched-record reasoning (not only "before/after" label sorting).
- **Overall:** educational **CHANGES REQUIRED**; technical CI green is valid only for its technical checks. Content owner rewrites JSON/feedback where appropriate. Engine/UI own evaluator and accessible matching/ordering. HQ owns schema and all integration/merge. QA is independent acceptance gate.
- **No unapproved edits performed:** `src/content/levels/`, `src/contracts/`, `src/core/`, `src/ui/`, `dev/`, `main` untouched in this Learning branch.

## Testing provenance
Source-level readback and independent, reimplemented deterministic checks are reported separately in `G1-ISSUE-45-TEST-EVIDENCE.md`. Independent 21 assertions and all 18 scenario trials were evaluated against **GitHub-fetched frozen Integration JSON**. The original TypeScript evaluator is inspected, not compiled/run here; results are a faithful limited reproduction of its finite-answer decision branches, not claim of full runtime execution. HQ CI Chromium PASS is cited as prior *external team execution*, not my own browser run. QA needs real Android, learner tests, full E02/E03 gameplay integration, and second human assessment before final approval.

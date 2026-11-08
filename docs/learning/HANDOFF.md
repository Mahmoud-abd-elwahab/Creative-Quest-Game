# Learning Architect Handoff — Issue #3
Artifact: LEARNING-WORLD-1@1.0-draft | 2026-11-08 | Learning owner review-signed; NOT a production acceptance.
Repository: https://github.com/Mahmoud-abd-elwahab/Creative-Quest-Game
Game baseline SHA: 40c76c3aafe6b8bd3d2db0723587e7d02ec9dcc1
Branch: cq/learning/3. Main untouched by Learning Architect.
Issue: https://github.com/Mahmoud-abd-elwahab/Creative-Quest-Game/issues/3

## Decision / actual delivery
- **DONE (document design)**: legacy 100-node source-level inventory and structural audit; prerequisite DAG; five cognitive bands; error codes; rubric profiles; 9 Observation slots and 3-phase Boss; sample adjudicated strong/partial/unsupported responses; evidence trust/progression policy; independent semantic QA checklist; signed learning slot JSON manifest (12 slots, 9 encounters + 3 Boss).
- **NOT DONE**: writing new levels, game integration, secure AI evaluation, schema-driven automated grading, mobile testing or publication. All belong to other owners and depend on approvals.
- **BLOCKED**: Game Director learning experience signoff, HQ ChallengeSpec/event/mastery schema approval, HQ-designated PR integration branch, Scenario Writer/Boss mechanics implementation, QA independent two-reviewer judgement.

## Changed paths (only Learning Architect-owned)
- docs/learning/LEGACY-100-AUDIT.md — source-level findings, risks and fix order.
- docs/learning/LEGACY-100-INVENTORY.md — ID-by-ID 100-level inventory.
- docs/learning/LEARNING-MAP.md — prerequisite graph & later transfer.
- docs/learning/DIFFICULTY-PROGRESSION.md — five bands, assisted retries, revisit policy.
- docs/learning/ASSESSMENT-RUBRICS.md — stable versioned criterion IDs, weights and adjudications.
- docs/learning/OBSERVATION-WORLD.md — 9 encounters + 3 Boss learning slots and novelty.
- docs/learning/ERROR-TAXONOMY-AND-QA.md — mistake codes, hint ladder, semantic checklist, failure log.
- docs/learning/LEARNING-SLOTS.v1.json — structured HANDOFF MANIFEST, NOT production ChallengeSpec.
- docs/learning/HANDOFF.md — this handoff.
No changes to src/content/, src/contracts/, shared docs, index.html, assets, boss engine, root configs or main.

## Signoffs and interface gates
1. **Learning Architect — SIGNED FOR CROSS-ROLE REVIEW**: slot IDs OBS-W1-E01..E09 and OBS-W1-B01..B03, primary OBS, named cognitive operation, band, criterion weights, later transfer. Version OBS-W1-SLOTS@1.0-draft is stable for discussion; changes require a new manifest version.
2. **Game Director — PENDING**: confirm fantasy narrative, scene/journey affordances, Egyptian Arabic tone and concept integrity; can veto repetitive or un-fun encounters.
3. **HQ — PENDING**: approval of versioned ChallengeSpec (not the provisional LevelSpec in SHARED-CONTRACTS), event/rubric semantics, integration branch, save-state trust labels and XP/provisional-completion behavior.
4. **Challenge Generator — WAIT**: do not author/publish JSON levels until (2) and (3) pass. Afterwards consume slot IDs and rubric version, ensure at least nine distinct cognitive operations, cite each fictional E-ID in draft scripts, and provide options with multiple defensible responses where needed.
5. **Boss Designer — WAIT**: consume EXACT R-OBS criterion IDs + weights, three phases (classification → causal repair → unfamiliar transfer); Boss HP may change with deterministic criteria only. Do not pretend free-text or self-check was verified by machine.
6. **Engine — HANDOFF REQUIREMENT**: primary interact() routing currently ignores four OBS_VARIANTS and takes all 9 tasks through legacy check(). Required integration test: World 1 player interaction activates heterogeneous HQ-approved ChallengeSpec; no accidental downgrade to keyword scoring; old save progress non-destructively preserved. No engine files touched here.
7. **QA — HANDOFF REQUIREMENT**: independently grade at least 2 supported, 2 plausible partial, 2 unsupported answer variants per final challenge; include paraphrases, Arabic dialects, English technical terms, contradictory evidence and wrong sample denominators; test exact source IDs, unique scenario/task signatures and Boss phase retries.

## Requirements HQ must settle in ChallengeSpec v1 before content
- Immutable challenge ID, schema version, slot ID, world ID, scenario ID, primary and secondary skill IDs, difficulty band, cognitive verb/signature, evidence records with E-ID + fictional/source type + scope, prompt and allowed response mode.
- Evidence provenance (simulated/user-provided/externally verified with origin and date); explicit observed-vs-hypothesis classification.
- Multiple valid structured answer sets, distractor-to-error-code mappings and fallback explanation. No single correct phrase for prose.
- Rubric version and criteria/weight bindings; critical error gates; distinction between content validation and cognitive scoring.
- Hint ladder per misconception, retry/revisit linkage, transfer target.
- Grading trust modes (STRUCTURED_VERIFIED / HUMAN_REVIEWED / SELF_REVIEWED_UNVERIFIED / EXTERNAL_DISCUSSION_UNVERIFIED / NOT_ASSESSED); save migration map.
- Progression event output fields (status, criterion feedback, assistance, narrative completion, mastery flag, review provenance) and privacy/retention decisions.
- Accessible alternative for drag/drop and mobile tap, authored RTL copy; collision/world/HP mechanics remain with other owners.
Do not let Learning Architect locally define runtime types or update src/contracts/ to unblock itself.

## Evidence / reasoning decisions
- Nine initial LEVELS all use keyword-matched open Observation in the live normal interact() route. OBS_VARIANTS exist for IDs 1/3/5/7 but only appear in diagnostics route.
- Legacy source defines 9 + 18 + 63 encounter entries, plus 10 Bosses. All 100 numeric IDs are present, continuous and unique in enumerated declarations. Type census is in LEGACY-100-AUDIT.md.
- False grade replication: “في المكتبة فيه ناس بتاخد كتب وترجعها قبل ما تخلص القراية” rejects despite defensible observation; “كل اللي بيبدأوا كتب وبيرجعوها قبل ما يخلصوها أغبياء” passes despite unsupported universal assertion.
- Source grounding is read-only from private Creative Library: cross-book creative-development workflow; creative-decision-system/01-consumer-insight-validation, /02-social-first-static-system, /03-creative-brief-and-pitch and /04-static-creative-testing; case-mechanisms-from-the-copy-book. Treat as internal synthesis, NOT external empirical validation or a stream of copied examples. Do not grant the web game access to the private repo.
- Avoid guaranteed “psychological insight” or creativity scores. Distinguish provisional hypothesis from research-supported explanation, and Story/XP from independent assessment.

## QA status (date of handoff)
| Test | Status | Evidence / limits |
|---|---|---|
| Main SHA read, README/Bible/Roles/Contracts read | PASS | Connector read from baseline |
| Legacy 100 ID enumeration and continuous 1..100 | PASS | Generated LEGACY-100-INVENTORY from index.html declarations |
| Format distribution and repeated sequence | PASS | Static source parser against 63 CAMPAIGN and 18 EXTRA entries |
| First-world normal route check | PASS (source-only) | interact() → challenge() vs OBS_VARIANTS diagnostics |
| Legacy keyword false positive/negative | PASS (replication) | Locally replicated check() terms + normalization; examples logged |
| Slot IDs 9+3 unique and rubric weights sum to 100 | PASS | Manifest generation validation; recheck on branch recommended |
| Full independent semantic scoring of all 100 | NOT RUN | Needs QA reviewers |
| Two-reviewer fairness tests for final 9+Boss authored tasks | NOT RUN | Current cases are proposals; content not authored |
| TypeScript / unit / integration tests | NOT RUN | No runtime code changed; HQ bootstrap absent |
| Mobile gameplay / regression / save migration / Pages deploy | NOT RUN | Other owners |
| HQ schema signoff and production ChallengeSpec | BLOCKED | HQ review pending |
| PR integration to designated target | BLOCKED | HQ integration branch not yet designated |

## Decision requested from HQ
Approve/modify task scope, specify PR base branch and release gate, issue ADR for grading trust/schema, then invite Game Director review. Do not merge design files on the strength of an automated check alone. Learning Architect delivers drafts and corrections to this feature branch; HQ alone merges releases.

## Author / signoff
Learning Architect: **learning slot structure signed for review**, not creative acceptance, technical acceptance or mastery certification. All dates, numbers, and student/customer data within the new world examples are deliberately fictional.

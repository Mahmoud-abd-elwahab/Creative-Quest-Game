> **SUPERSEDED FOR CURRENT W01 DESIGN:** See [W01-BOSS-STATE-MACHINE-V2-PROPOSAL.md](./W01-BOSS-STATE-MACHINE-V2-PROPOSAL.md). The Game Director approved a more demanding three-phase design for prototyping: Evidence Lens → Mirror (test tentative interpretation) → Forge (construct an actionable Concept). This older proposal's Phase 2/3 and transitions are retained only as audit history, NOT approved implementation guidance. HQ contracts are still pending.

# First Observation Boss — Transition & Integration Draft

**Status:** PROPOSAL ONLY. Not an approved BossSpec or a runtime implementation.
**Issue:** #2
**Branch:** cq/boss/2
**Baseline:** 40c76c3aafe6b8bd3d2db0723587e7d02ec9dcc1
**Owner/path:** Boss Mechanics / src/gameplay/bosses/ only.
**Approval required:** HQ BossSpec + typed GameEvent contract, Learning's rubric, Game Director encounter signoff, Engine interaction/pause/save hooks.

## 1. Existing v0.4 behavior: preserve and repair

The first Boss is already called **وحش الافتراضات** in **غابة الملاحظة**; its three-shield visual metaphor is useful and should remain subject to Game Director approval. The existing code lives in root index.html around lines 318–319, with the arena visual around lines 391 and 426–432, and v0.4 progress in the legacy key creative-quest-2d-v02.

Current issues:
- First shield is a single static multiple-choice question (observation vs unsupported motive).
- Second shield relies on limited text/keyword heuristics and has a direct 'discuss ChatGPT' bypass.
- Third shield grants a win on a player-asserted ChatGPT grade; no result travels back to the game.
- Presentation HP can fall due to stage number without independent evidence of accepted gameplay reasoning.

**Design direction:** keep the three shields and theme, but use three distinct player-thinking actions and visually show only accepted state transitions. No timers, reflex demands, or losing XP for mistakes.

## 2. Proposed first encounter (content and IDs not authoritative)

**Working Boss ID:** observation-guardian-01 (HQ/Scenario to lock stable ID).
**Working scenario:** A handicrafts exhibition where visitors photograph items, ask about sizes, note product numbers, browse other stands, and some revisit an earlier stand. These observed actions are already represented by BOSS_NOTES in v0.4. All motives (fear of price, intention to buy, boredom) remain *hypotheses*, not facts.

**Player fantasy:** A guardian covers the passage with three protective layers made from unsupported claims. Rather than attacking, the player studies fragments, exposes a made-up reason, then reconstructs a clean evidence-grounded observation. Each accepted cognitive action visibly destroys one specific defense.

### Phase 1 — Inspect Evidence
**Interaction:** Move/tap/focus on evidence fragments inside an arena; reveal evidence cards; connect at least the required verified observations to the observation board. These are actions in the world, not one MCQ.
**Meaning:** distinguish what the source actually says from inferred motivation.
**Acceptance (proposal, awaiting Learning rubric):** all required evidence IDs inspected, required factual fragments correctly included, no unsupported assertion treated as observed. Exact count and evidence IDs authored by Scenario.
**Failure:** explain the misclassification with exact linked evidence; allow correction without losing collected clues.
**Visual:** matching evidence runes light up; defense layer 1 cracks only once acceptance succeeds.

### Phase 2 — Challenge an Assumption
**Interaction:** Select the guardian's unsupported claim (e.g., 'الزوار خايفين من الأسعار'), attach the observations it supposedly rests on, and mark what **cannot** be concluded from those observations. Use a deterministic reasoning action with authored misconception categories, not random choice.
**Meaning:** separate a possible interpretation from an observation; identify the evidence gap.
**Acceptance (proposal):** correct unsupported claim, appropriate source IDs, and correct rationale category (motive inferred without supporting statements); no claim of disproving the hypothesis.
**Failure:** specific feedback ('التصوير مش دليل على الخوف من السعر') and a retry; no false punishment.
**Visual:** guardian's projection of the motive dissolves and shield 2 falls on confirmed acceptance.

### Phase 3 — Repair the Observation
**Interaction:** Build an evidence-linked observation from structured fragments (actor, observable action, scope, source) and optionally write a natural-language summary. Player reviews it against a transparent rubric: witnessed behavior; correct scope; no unverified cause/motive; source traceability.
**Meaning:** turn evidence into a concise, disciplined Observation that can inform future advertising thinking.
**Acceptance:** deterministic checks for required structured fields and evidence links, followed by deliberate learner self-review of the subjective wording and explicit confirmation. Free-text quality is NOT silently or automatically AI-graded.
**Failure/revision:** missing links or scope issues give targeted feedback; self-review may reveal an issue and return to editing. Optional manual ChatGPT discussion is supportive, never a required gate or bypass.
**Visual:** the final false statement fractures; passage opens only after the completion acknowledgement. Display completion badge as 'Self-reviewed' where appropriate, never 'AI verified'.

## 3. Transition table (draft, proposed semantic names only)

State names below are *local design vocabulary*, not approved TypeScript types or event names. Runtime must consume HQ contracts, not invent globals.

| Current state | Trigger / learner action | Guard / evaluation | Next state | Required observable feedback |
|---|---|---|---|---|
| NOT_STARTED | Player interacts with guardian | World gate unlocked; Boss not completed | P1_INSPECT | Focus arena; three intact shields; map paused |
| NOT_STARTED | Player interacts with completed guardian | Boss already completed | COMPLETE | Show existing result; no reward request |
| P1_INSPECT | Reveal/select/arrange evidence | Valid evidence ID; not paused | P1_INSPECT | Evidence tile highlights; draft board updates |
| P1_INSPECT | Submit inspected evidence | Missing, mismatched, or speculative evidence | P1_FEEDBACK | Specific discrepancy and source reference; no shield change |
| P1_FEEDBACK | Retry / edit evidence | Same encounter and unlocked state | P1_INSPECT | Restore editable board, preserve discoveries |
| P1_INSPECT | Submit inspected evidence | Approved P1 rubric satisfied | P1_CLEARED | Shield 1 breaks exactly once; explanation shown |
| P1_CLEARED | Player continues | Phase 1 accepted and effect acknowledged | P2_CHALLENGE | New assumption-claim interaction unlocked |
| P2_CHALLENGE | Challenge claim + evidence + rationale | Wrong claim, unsupported linkage, or wrong inference judgment | P2_FEEDBACK | Explain limitation; no shield damage |
| P2_FEEDBACK | Retry / hint | Encounter active | P2_CHALLENGE | Keep inspected sources available |
| P2_CHALLENGE | Challenge claim + evidence + rationale | Approved P2 rubric satisfied | P2_CLEARED | Shield 2 breaks exactly once; evidence-gap explanation |
| P2_CLEARED | Player continues | Phase 2 accepted and effect acknowledged | P3_REPAIR | Structured builder and optional text revealed |
| P3_REPAIR | Edit fields / attach references / draft writing | Valid editable inputs | P3_REPAIR | Preview sentence and cited fragments update |
| P3_REPAIR | Request review | Missing required fields or bad structural links | P3_FEEDBACK | Highlight field/source mismatch; no shield change |
| P3_FEEDBACK | Revise / show hint | Encounter active | P3_REPAIR | Restore draft; preserve citations |
| P3_REPAIR | Request review | Deterministic structural requirements satisfied | P3_SELF_REVIEW | Show rubric and explicit self-review provenance |
| P3_SELF_REVIEW | Player identifies unresolved rubric item | Player chooses revise | P3_REPAIR | No win, draft preserved |
| P3_SELF_REVIEW | Player confirms reviewed work | Criteria explicitly checked; confirmed by player; required structured parts valid | COMPLETION_PENDING | Shield 3 break requested once; display 'self-reviewed' |
| COMPLETION_PENDING | Engine acknowledges persisted completion | Valid encounter identity and exactly-once completion receipt | COMPLETE | Passage opens; XP/unlock shown once |
| COMPLETION_PENDING | Retry same completion / reload | Already accepted but reward ack pending | COMPLETION_PENDING or COMPLETE | Reconcile idempotently; no duplicate XP |
| Any active, feedback, cleared or pending state | Pause / dialog close / navigation | Save snapshot accepted | PAUSED(exit snapshot) | Freeze input/effects, preserve phase and draft |
| PAUSED | Resume or reload | Saved snapshot validates; not already completed | Previous unpaused state | Restore focus, progress and visual shield states |
| Any active state | Invalid/out-of-order/stale action | Guard fails or event duplicated | Same state | Safe no-op or non-blocking error; no unintended unlock |
| Any active state | Recoverable content/asset failure | Dependency fails validation/loading | RECOVERABLE_ERROR | Retry/exit path; no progress loss or reward |
| RECOVERABLE_ERROR | Retry after resources become valid | Runtime ready | Last safe state | Resume without phantom shield break |
| COMPLETE | Revisit / repeat old completion event | Completion receipt already exists | COMPLETE | Optional replay-only mode; no repeated reward |

**Important:** Failure is a *recoverable feedback state*, not permanent punishment. Hints are always available, carry no XP/timing penalty, and never directly clear a shield. No time-out transition exists. UI/engine pause is a wrapper, not a new earned phase.

## 4. Proposed local state fields — HQ must approve schema

- Stable boss ID, scenario version, active phase, substate, previous state before pause.
- Revealed evidence IDs, linked evidence IDs, selected claim and rationale category.
- Structured observation fragments, optional draft text, rubric checklist and explicit self-review decision.
- Per-phase acceptance markers, last accepted action IDs for duplicate prevention, hints seen.
- Reward/completion status from the Engine-authoritative progression receipt, not locally guessed XP.
- Restore metadata: legacy-save origin (if migrated), content version, last safe checkpoint.

**No arbitrary text or asset filename should be used as an ID.** Evaluation decisions come from approved authored rubric/content plus deterministic structural guards. A text's length or keywords are not proof of semantic correctness.

## 5. Signals to be mapped to HQ GameEvent, not contract declarations

Boss needs approved routes for:
1. Enter/exit encounter and freeze/unfreeze movement.
2. Inspect/reveal/select/cite a source fragment, and submit an authored decision.
3. Accepted/rejected action with criterion IDs and feedback keys (no presentation strings as state).
4. Shield transition #1/#2/#3 with asset animation ID and acknowledgment (one effect per accepted transition).
5. Hint request, accessible non-animated alternative, pause/resume, safe error/retry.
6. User self-review confirmation including provenance 'manual', distinct from external verified assessment.
7. Completion request, durable receipt, XP/unlock acknowledgment, and resumed/revisited completion state.

Illustrative visuals are **requirements**, not asset paths: three shield layers, guardian idle/react/defeated states, evidence tile highlight, attack/impact on accepted cognitive action, quiet error state, portal open. Missing animations must have readable low-motion alternatives.

## 6. Reward and save policy

- Boss module requests completion; the Engine/Progression service owns the persistent atomic, idempotent reward/unlock transaction.
- Reward identity must be stable across reloads (world/boss and reward-version idempotency key). Never add XP directly in Boss module.
- Old key creative-quest-2d-v02 is read-only input to a HQ migration adapter; do not delete or overwrite old progress.
- v0.4 finished level 10 must map to completed without re-awarding; a redesign should not confiscate existing unlocked worlds.
- v0.4 partial bossPhase=1/2 is semantically different from the new phases; migration mapping is **OPEN HQ DECISION**, not silently inferred.
- If a completion acknowledgment is interrupted, retry transaction with the *same* key and resolve from Engine's durable receipt.

## 7. Focused QA cases requested from QA (not executed yet)

| Test | Expected |
|---|---|
| T01 enter unlocked Boss | P1 opens; three intact shields; movement paused |
| T02 attempt entry while gate locked | no entry, actionable feedback |
| T03 reveal + arrange verified evidence | visible board updates; no premature shield break |
| T04 submit speculation as observation | P1 feedback, no shield reduction |
| T05 submit valid P1 evidence | shield 1 breaks once; P2 becomes available |
| T06 submit correct claim but wrong reason | P2 feedback, no shield reduction |
| T07 successful P2 with rationale and references | shield 2 breaks once; P3 builder available |
| T08 missing P3 evidence link | cannot win; structural feedback shown |
| T09 meaningful P3 self-review with revision | remains editable; no auto-grading claim |
| T10 confirm P3 rubric + explicit self-review | pending completion; provenance shown |
| T11 duplicate success events/two taps/reload | exactly one XP/unlock receipt |
| T12 pause during feedback and resume | same selections/phase/focus restored |
| T13 close/reload in P3 draft | draft/checklist restored; no implicit pass |
| T14 asset/event failure/retry | recoverable error; never stuck |
| T15 completed legacy save revisit | old unlock retained; no duplicate reward |
| T16 legacy partial bossPhase=1/2 | behavior matches HQ-approved migration decision |
| T17 mobile 360px/keyboard/reduced motion | all three actions complete without precision/timing demand |
| T18 hint multiple times | rubric feedback helpful, no punishment or free shield break |
| T19 manual ChatGPT discussion absent | player can finish locally through transparent rubric |
| T20 unsupported/stale phase event | guard rejects safely; no progression mutation |

## 8. Interface questions for HQ / other owners

**HQ / Contracts**
1. What is the versioned BossSpec ID/schema, phase requirement representation and criterion ID namespace? Is the first Boss ID observation-guardian-01 or legacy level 10?
2. Which typed GameEvent names/payloads are approved for Boss start, evidence selection, phase acceptance, shield effect acknowledgment, pause/resume and completion receipt? What is event ordering/replay policy?
3. Which HQ integration branch receives the PR? Can the current document-only branch be merged before the runtime spec is signed?
4. What is the official mapping for legacy bossPhase=1/2 and saved ChatGPT/manual confirmations?

**Engine / Save**
5. How does the boss get the guardian interaction, per-world gate and scene pause/resume lifecycle? Does close exit or suspend, and where is the saved Boss snapshot stored?
6. Is progression completion an idempotent command returning a durable receipt? Who guarantees atomic XP, level unlock and repeated event suppression?
7. What happens if an animation finishes after pause/reload, or if an event is delivered twice/out of order?

**Learning / Scenario**
8. What are the exact per-phase deterministic acceptance criteria, misconception categories, evidence IDs, and feedback keys? Which repair elements are structurally graded versus declared self-reviewed?
9. Does Learning approve optional ChatGPT manual review with clearly labeled provenance and an equivalent full offline route? How will the encounter teach rather than just test previous knowledge?

**Game Director / Art / World**
10. Is the legacy 'وحش الافتراضات' theme and 3-shield metaphor approved for the first Observation realm? Which Guardian animation IDs, arenas, evidence objects and portal states are available and licensed?

**UI / Accessibility / QA**
11. Who renders free-text, keyboard focus, hint feedback, disabled actions, checklists, pause overlay and reduced-motion fallbacks? Where is UIBridge state sourced?
12. Which contract-level test fixtures and mobile screenshots does QA require before first runtime implementation PR?

## 9. Current delivery status

- **DONE:** Existing implementation audited; new 3-phase concept, guards, recovery rules, proposed interfaces and test matrix drafted.
- **NOT DONE:** Runtime state machine, typed events, gameplay scene, effects, tests, recording or verified Boss battle.
- **BLOCKED:** HQ-approved BossSpec/GameEvent and save bridge; signed Learning rubric + Scenario data; engine input and UI bridge; approved Guardian animation/event names.
- **Next action:** HQ reviews this issue and resolves interface questions. Only then implement TypeScript under src/gameplay/bosses/ on the feature branch and run integration tests.
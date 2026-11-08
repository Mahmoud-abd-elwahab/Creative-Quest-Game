# Contracts v1 — G0 integration review candidate

**Review status:** HQ-defined candidate for the first Observation vertical slice; NOT yet accepted by all module owners, NOT used by current v0.4 runtime.
**Source:** v1.ts plus challenge-spec.v1.schema.json. Any breaking field change requires an HQ ADR/change request; specialists must not mutate these files directly.
**Baseline:** main@40c76c3aafe6b8bd3d2db0723587e7d02ec9dcc1. W01 slots: OBS-W1-SLOTS@1.1-draft in Learning PR #20.

## Required invariants and cross-field validators

1. Stable distinct ChallengeSpec.id, scenarioId and slotId. W01 slots OBS-W1-E01..E09 plus OBS-W1-B01..B03; 9 distinct cognitive operations. Numeric legacyLevelId 1..100 is a compatibility mapping only, never a new challenge primary ID.
2. rubric items must use approved Learning R-OBS-* / R-PREV-* criterion IDs; each challenge weights sum to **100**; no duplicate criterion/evidence/option IDs. JSON Schema checks shapes only; a separate validator MUST check cross-field totals, references, ID uniqueness, allowed answer set IDs and learning slot alignment.
3. A validAnswerSet may contain multiple equally defensible structured routes. It is never a semantic evaluator for open prose. text/self-review and external ChatGPT discussion are unverified unless separately reviewed with recorded evidence.
4. AssessmentResult.trust modes are explicit. A self-reviewed or external-discussion result must have masteryAwarded=false and must not claim verified cognitive competence. A narrative-clear event may be recorded separately. STRUCTURED_VERIFIED means passed the game's finite authored criteria, NOT scientifically established mastery. Human review requires attributable reviewer provenance.
5. Boss phases are strictly evidence → mirror → forge, tied to Learning slots B01/B02/B03. Passage requires accepted phase-specific decision guards. Pause, hint, retry, resume and reload do not advance a phase. Completion uses a single deterministic receipt ID; never double grant XP.
6. UI sends GameCommand with requestId, consumes GameEvent and snapshots. The Engine alone owns progress, pause state and reward commit. Show XP only on reward.committed, not on button tap; load/save errors must be visible.
7. World coordinates are in world pixels, top-left origin, +x right/+y down; actor feet center is the anchor. Sprite pivot fields normalized 0..1; world-pixel hitbox follows feet pivot. Frame width/height, fps, tile size and display scale require test-based approval; no assumed 64×64 sheet.
8. Public authored JSON must contain only fictional/public-verified evidence and approved teaching rules. It must not contain private Creative Library source material, copyrighted ads or private provenance maps. For externally-verified claims, use publicSource.

## Legacy migration policy

- **Read only** original localStorage key creative-quest-2d-v02; do not alter, clear or reformat it, and do not delete the old published v0.4 entry.
- New v1 state lives under creative-quest-2d-v1 and MUST have an isolated version, schema check and safe recovery behavior. Write only the new key through the Engine adapter, never from UI.
- Validate and copy legacy fields done/unlocked/xp/attempts/answers/bossPhase/bossPhases/started. Keep unknown original fields untouched in the old key. New XP is additive through unique RewardReceipt IDs; imported old done IDs are narrative history, **not independently demonstrated mastery**.
- Old v0.4 Boss phase 1/2 cannot be blindly resumed into a different v1 three-phase design. Retain the original phase snapshot and display a fair restart/review route; user should not lose world progression or receive duplicate rewards.
- Old Boss already-completed state is recognized as prior narrative completion (preserve unlock path); new Boss transfer assessment remains optional/not silently auto-verified. Final edge cases need QA fixture and Game Director review.
- If v1 loading or writing fails: keep original v0.4 data untouched and surface an actionable recovery message. Never quietly reset imported progress.

## Validation performed for candidate

- TS syntax and type definitions: local strict TypeScript compile, no emit (2026-11-08).
- JSON Schema Draft 2020-12: checked schema validity and one valid / four deliberately invalid sample payloads locally (2026-11-08).
- **Not run yet:** versioned game build, authored JSON against learning slots, all cross-field validators, browser/mobile QA, legacy-save fixtures on this candidate, live deployment. Tests will be independently rerun on exact GitHub PR SHA by QA.

## Owners review

- Engine: GameCommand/GameEvent, storage, world model, Phaser binding.
- Learning + Content: ChallengeSpec, rubric IDs, trust and anti-duplication.
- Boss: phase guards and reward receipts.
- UI: pause/resume ack, accessible event flows.
- World + Characters: coordinates, collision and manifest scale.
- QA: fail-closed schema tests and old-save migration regression.

No production Feature PR may invent an incompatible local replacement for these interfaces. Resolve comments on HQ PR before contract freeze.
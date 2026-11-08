# G1 / Issue #44 — Independent Creative Director Review: E01 playable, E02–E03 authored only

**Verdict:** **CHANGES REQUIRED** for Creative Direction signoff. **G1 technical staging is valid for iteration**, not creative acceptance, hero/art approval, educational mastery, or production release.  
**Task:** [Issue #44](https://github.com/Mahmoud-abd-elwahab/Creative-Quest-Game/issues/44) — Game Director / Creative Director only.  
**Exact reviewed integration SHA:** `c976f084243a018a96595b88aaf7b5bbcf733b2f` (`cq/integration/vertical-slice`, 2026-11-08).  
**Context:** previous Director PR #11 merged into integration; latest Technical Producer comment [PR #11 issuecomment-6722086112](https://github.com/Mahmoud-abd-elwahab/Creative-Quest-Game/pull/11#issuecomment-6722086112) assigns this G1 review.  
**Reviewed:** [PR #42](https://github.com/Mahmoud-abd-elwahab/Creative-Quest-Game/pull/42) (merged), [PR #36](https://github.com/Mahmoud-abd-elwahab/Creative-Quest-Game/pull/36) (E01–E03 authoring merged provisionally), `docs/learning/LEARNING-SLOTS.v1.json` (`OBS-W1-SLOTS@1.1-draft`), `dev/g1/play.ts`, `dev/g1/play-smoke.mjs`, `src/game/g1/observation-scene.ts`, `src/ui/challenge-overlay.ts`, `src/core/g1/challenge-catalog.ts`, three content JSONs.  
**Evidence:** [CI run 42484888738](https://github.com/Mahmoud-abd-elwahab/Creative-Quest-Game/actions/runs/42484888738) completed successfully at exact SHA; [downloadable screenshot artifact 13618843676](https://github.com/Mahmoud-abd-elwahab/Creative-Quest-Game/actions/runs/42484888738/artifacts/13618843676) contains `actual-interaction/real-e01-mobile360.png`, `actual-interaction/real-e01-desktop1280.png`, and boot captures. Both actual-interaction screenshots were **visually inspected** as image files. The mobile image is at 360 CSS px with 2× DPR (720 × 1480 pixel image); desktop is 1280 × 800. **They are screenshots of an automated Chromium test, not a real-phone manual playtest or direct unassisted human learner observation.**

## 1. Evidence-based acceptance matrix

| Requirement | Result | Evidence / limit |
|---|---|---|
| Real movement to WorldNode, E key interaction, authored E01 used | **PASS — technical evidence only** | CI job `npm run smoke:play:g1` succeeds on desktop1280 and mobile360; `play.ts` maps one real `clue` node to `cq_obs_w01_e01_inspect_v1`; E2E keyboard moves hero from spawn to node. |
| UI receives authored evidence and 2-of-3 valid selection routes | **PASS — structured** | E01 has 3 valid two-source pairs `A+B, A+C, B+C`; evidence IDs and options self-contained; test asserts wrong/hint/correct. |
| Wrong/hint/WHY feedback, retry, durable XP | **PASS — functional with creative defects** | CI run shows one documented invalid motive → retry → hint → correct → +20 XP and reload preserving one receipt. **Why** copy is anchored to records, but repeated in response view (see C02). |
| True physical **Inspect** of multiple distinct records within the world | **FAIL — creative** | `scene.create()` draws a single generic circle labelled `CLUE / INSPECT`. On interaction the overlay lists all five sources and multi-select checkboxes; the player never finds/inspects two physical receipts in spatial gameplay. |
| Decision transforms traversable scene | **FAIL — creative** | `reward.committed` changes `trail.setFillStyle(...)` only. It does not open a real blocked route or add meaningful evidence discovery; the line in success copy “عدسة الدليل بتفتح الممر الأول” is stronger than the on-screen consequence proven in source. |
| E01 screen visually fits portrait (no global horizontal overflow) | **PASS — automated boundary / REVISE experience** | CI asserts no page horizontal overflow; inspected screenshot shows very tall text-heavy modal, narrow view, header/footer fixed and scroll content. No clipped outer viewport shown, but scene is hidden under modal and hero readability cannot be evaluated. |
| Canonical hero and painterly forest environment | **FAIL — final-art criteria** | `ObservationG1Scene.create()` uses cyan rectangle torso, circle face, solid-color ground and collision boxes. This is openly labelled graybox in `dev/g1/play.html`; correct for proof, never approve as the user-locked teal/leather/maroon hero. |
| E02 Connect and E03 Arrange are playable | **NOT IMPLEMENTED** | `dev/g1/play.ts` validates/imports only E01. E02/E03 JSONs are authored; there is no real encounter screenshot or runtime proof. |
| Boss 3-stage meaningful interactive combat | **NOT IMPLEMENTED** | G1 E01 staging has no Boss arena/progression; design documents are not proof. |
| Real Android touch feel / authentic novice transfer test | **BLOCKED** | Chromium emulation only; no physical Android run, no independent learner using an unseen transfer scenario. |
| G1 overall creative signoff | **CHANGES REQUIRED** | Required physical evidence behavior and truthful world change absent; this is not a release veto on technical staging itself. |

## 2. Specific defects and remediation

### C01 — P1 / creative core: the Evidence Lens is a modal, not world interaction
**Evidence:** `src/game/g1/observation-scene.ts` draws exactly one circular clue; `src/ui/challenge-overlay.ts::renderChallenge()` prints all available `evidence` as list items and presents `options` as checkbox labels. **The user walks to one point, reads five text records and checks two boxes**; the real movement is technically connected, but the thinking act is still a worksheet detached from the scene.

**Required G1-to-G2 prototype change (World + UI + HQ contract only):** first present **at least two separate inspectable physical receipt props** with differentiated record IDs/narrative reveal state (for example two return slips and an optional counterexample slip). Physically encountering/inspecting a prop should reveal its source card in the Evidence Lens; after connecting two compatible sources, a **real blocked shortcut/path** becomes accessible (or a distinct area/character becomes interactable), not merely green. A fully clickable world over every level is not required for this first small test. **Acceptance:** screenshot/short video shows one source found in-world, another obtained through exploration, and accessible route change after evidence decision.

### C02 — P2 / UX feedback density: exact “SUCCESS” copy shown three times
**Evidence:** photographed `actual-interaction/real-e01-mobile360.png` and `real-e01-desktop1280.png` show the sentence beginning “إنت ربطت فعلين بإيصالات محددة...” as (1) assessment main feedback and (2)(3) per-rubric criterion bullet text. `src/core/g1/challenge-catalog.ts` maps *every* passing criterion to `feedbackByErrorCode.SUCCESS`, and `FirstChallengeOverlay.renderAssessment` prints each criterion.

**Remedy (UI and Education owner):** keep **one main WHY explanation** and use **two genuinely different criterion explanations**, e.g. “CLASS — فرّقت بين حدث مسجل وتفسير لدافع” and “TRACE — اخترت إيصالين مستقلين بأرقامهم”. Prefer concise collapsed criteria on 360px; keep an expand-for-detail option. **Acceptance:** one primary success message, no repeated paragraphs, still preserves learning justification.

### C03 — P2 / visually contradictory completion button
**Evidence:** both inspected screenshots show a confirmed `+20 XP` receipt and the footer saying reward confirmed, but the disabled primary button still says **“في انتظار تأكيد الحفظ”**. In `src/ui/challenge-overlay.ts::updateSubmit()` a previously PASSED result unconditionally sets this label even after receipt is rendered. The Escape/close button remains available and functional in CI, so this is **misleading state communication**, not evidence that save failed.

**Remedy (UI owner):** on confirmed receipt, primary button becomes “ارجع للعالم” and works as close/resume request, or is removed leaving clearly labelled close action. “في انتظار…” only before receipt. **Acceptance:** single settled UI frame after reward with correct label and a clear return path, keyboard focus restored after confirmed resume.

### C04 — P2 / semantic assessment taxonomy mismatch (E01–E03)
**Evidence:** `src/content/reports/ISSUE-34-G1-THREE-OBSERVATION-HANDOFF.md` provides 2 supported, 2 partial and 2 unsupported examples per challenge. Independently **replayed the *finite validAnswerSets* decision rules from** `src/core/g1/challenge-catalog.ts` against all 18 authored example IDs (source-level audit; NOT actual E02/E03 playtest):

| Slot / example | Content report labels | Actual deterministic branch | Assessment |
|---|---|---|---|
| E01 S1/S2 | Supported | PASSED / PASSED | aligns |
| E01 P1 | Partial | PARTIAL | aligns |
| **E01 P2** `ACT_A+ACT_D` | Partial trace + unsupported scope | **TRY_AGAIN / OBS-E03** | differs from overall Partial label; an unsupported claim is rightly flagged but needs “one valid trace + one invalid claim” nuance |
| E01 U1/U2 | Unsupported | TRY_AGAIN / OBS-E03, OBS-E01 | aligns as unsupported |
| E02 S1/S2 | Supported | PASSED / PASSED | aligns |
| **E02 P1/P2** `LINK_RECEIPT` / `LINK_CARD` | Partial | **TRY_AGAIN / OBS-E07** | both are relevant but insufficient proof; current flat single-select checker has no PARTIAL classification |
| E02 U1/U2 | Unsupported | TRY_AGAIN / OBS-E07, OBS-E01 | aligns |
| E03 S1/S2 | Supported | PASSED / PASSED | aligns |
| **E03 P1** `A0,A1,SCOPE` | Partial (one pair + bounded conclusion) | **TRY_AGAIN / INVALID_COMBINATION** | current prefix-only order matcher does not acknowledge valid substructure with missing second pair |
| E03 P2 `B0,B1,A0,A1` | Partial | PARTIAL | aligns |
| E03 U1/U2 | Unsupported | TRY_AGAIN / OBS-E03 | aligns |

**Remedy request to Learning Architect + HQ Content/Engine:** agree whether “Partial” is a **cognitive diagnostic** or an executable `PARTIAL` status; revise authored illustrative labels and/or assessor logic with more diagnostic status detail. For E02, single-select may still return TRY_AGAIN while copy acknowledges partial relatedness — but never claim executable PARTIAL tests passed. For E03, assess within-ID paired evidence separately from full exact-prefix correctness, without accepting mismatched bookings. **Do not implement UI/schema changes from this creative branch.**

### C05 — P2 / E02 novelty at risk: Connect is still a single-select sentence
**Evidence:** E02 `interaction="connect"` but `responseMode="single-select"`; each option is a prewritten “أوصل الشهادة بدفتر…” choice. The player is not independently selecting two sources to create a connection. Two defensible valid routes (LOG or CALL) are solid; source provenance logic is stronger than E01, but **the physical Connect verb is not actually demonstrated**.

**G1 authoring disposition:** **ACCEPT CONTENT LOGIC FOR STAGING ONLY / CHANGES REQUIRED FOR PLAYABLE NOVELTY.** Ask HQ/UI for a source-to-record two-point connection or matching action compatible with locked contracts; at minimum visibly connect NPC testimony to chosen evidence card with feedback on ID, type of question and time. Preserve either valid independent source; reject generic care card, unrelated receipt, assumed fear.

### C06 — P2 / E03 should test before-after relationship, not blindly memorize a linear order
**Evidence:** E03 has two valid ordered sequences, each with paired IDs `041`, `055` and the same bounded conclusion, plus unchanged case `071`. This is promising different cognition from E01/E02, but it is **not playable**. The literal linear `order` schema can accidentally test position memory unless the UI ties each ordered card to **the same booking ID** and its temporal direction.

**G1 authoring disposition:** **ACCEPT SCRIPT FOR EXPERIMENT; PLAYABLE CREATIVE SIGNOFF NOT POSSIBLE.** Require drag/tap-to-place pairs onto two visible timeline tracks then choose bounded claim; order of pair tracks irrelevant. Keep explicit unchanged 071 as useful counterexample, not a distractor with no teaching payoff.

### C07 — P3 / copy + hierarchy polish, not release blockers at this stage
- The long 360px modal hides the exploration environment entirely; minimum early-stage improvement is a compact **evidence inventory strip** in the world showing two found receipts and then opening a readable focused source view.
- On screenshots, reading starts well into a scroll window and the footer stays fixed; test at actual 360×740, browser zoom, keyboard/landscape, and a shorter screen. Automated “no page overflow” is necessary, not sufficient.
- `dev/g1/play.html` openly says Graybox/one challenge: **keep this honest label** until actual art and progression are present.
- `dev/g1/play.html` and the scene rely on an English world instruction `CLUE / INSPECT`. Localize instruction around the current Egyptian-Arabic context with English agency words only where meaningful, without sacrificing clarity.

## 3. Hero/world visual signoff gate (no architecture changes)
**Canonical hero source:** `docs/creative/HERO-01-CANONICAL-LOCK.md` and user-approved image in personal Library `/Creative-Quest-Game/Hero-References/hero-CANONICAL-user-approved.png`. A generated turnaround is not a verified sprite. **Do not replace identity or approve the rectangle/circle placeholder**.

**World & Characters first proof request:**
1. HQ confirms world-pixel, feet-center pivots (already proposed and used in `ObservationG1Scene`), approved camera zoom/playable hero height/atlas frame contract and collision relationship. **A shallow stylized 3/4 *visual* look may coexist with 2D ground-plane physics**; no tilted collision plane required. Keep feet contact and prop occlusion consistent.
2. Character specialist supplies same-user-identity master front/back/left/right and one actual game-scale **idle/walk/inspect** animation proof. First target: show hero at real playable scale on 360px and 1280px screenshots; face/hair teal/leather/maroon features must remain coherent.
3. World specialist supplies one **layered playable** start-path art slice with ground, collision obstacle, foreground canopy occlusion, two evidence props and one route whose traversability changes. Painterly/reference-inspired quality should not obscure active clues.
4. UI specialist reduces modal duplication and clarifies save/return state; G1 tests 360px, desktop and a real touch device or explicitly marks device test BLOCKED.
5. Boss Phase 3 and E09 are **preview/transfer activities**, not `INS`/`CON` mastery. No authored Boss/9 encounter claims until the actual play experience exists.

## 4. Learning review coordination
Independent Learning Issue #45 owns final rubric/adjudication. Director proposal for novelty:
- **E01** primary cognitive operation is **classify documented action vs motive** using two independent receipts; 3 alternate valid pairs. Current **modal-based execution insufficient** to fulfill creative “Inspect”.
- **E02** cognitive operation is **cross-source provenance** (NPC speech ↔ follow-up log/call). Preserve two legitimate routes; change interaction into actual source linking.
- **E03** cognitive operation is **within-booking before-after reconstruction and scope**. Preserve either pair ordering and the unchanged case; actual spatial timeline mechanic required.
- No auto-marking mastery for later skills based on `narrativeCleared` or an XP receipt.

## 5. Test boundary / evidence honesty
**Verified from repo/CI:** exact SHA, documentation, source flow and CI job completion, logged Chromium 158.0.8127.18 on GitHub Ubuntu runner with Playwright 1.65.0, desktop1280 + emulated mobile360: `npm ci`, `npm run typecheck:g1`, `npm run build:g1`, `npm run smoke:g1`, `npm run smoke:play:g1` all concluded PASS within referenced job. The run's smoke says “real move → WorldNode → E01 → wrong/hint/correct → receipt → resume/focus → reload”.  
**Independent reviewer check:** visually opened two actual CI `real-e01-*.png` screenshots; inspected `play.ts`, `scene`, `challenge-overlay`, `catalog`, E01–E03 JSON and authored example table; reproduced expected *branch classifications* of all 18 examples by a source-level deterministic walk-through, not by running E02/E03 as gameplay.  
**NOT RUN independently here:** checkout/`npm ci`/`vite preview` in local machine; physical Android tap/gesture; human first-time-player observation; E02/E03/Boss game play; annotated *in-engine* screenshots beyond existing CI artifacts. A separately prepared review image annotates the same mobile/desktop CI captures; it is **not** evidence of any new game implementation.

## 6. Required next handoff / signoff
- **HQ:** keep #42 provisional technical integration; route C01 scene actions and route-state contract to Engine/World; route C02/C03 to UI; reconcile C04 with Learning/Content; do not merge this doc as production approval.
- **World + Engine:** one two-evidence-physical-prop walkthrough and one traversability change in the actual Phaser scene before requesting next creative signoff.
- **Characters:** show canonical teal hero at in-world scale, correct feet-center pivot; do not substitute stylized random dummy.
- **UI:** remove 3× feedback duplication and stale waiting-for-save text; demonstrate return/resume after receipt.
- **Learning + Content:** confirm E01/E02/E03 error taxonomy and partial example classifications; explicitly decide a structured true Connect and bounded Arrange interaction.
- **QA:** independent real Android and unseen-case skill transfer; earlier CI PASS ≠ complete acceptance.

**Final stamp:**  
`E01 TECHNICAL G1 PATH — ACCEPTED AS VERIFIED STAGING EVIDENCE.`  
`E01 CREATIVE GAMEPLAY — CHANGES REQUIRED (C01 P1).`  
`E01 CONTENT REASONING — ACCEPT FOR STAGING, REVISE UX/DIAGNOSTICS (C02–C04).`  
`E02/E03 SCRIPT DESIGN — PROMISING/PROVISIONAL; NOT PLAYABLE OR SIGNED OFF.`  
`HERO, WORLD, NINE ENCOUNTERS, BOSS, PRODUCTION — UNVERIFIED / NO-GO.`

No engine/framework contract, other team-owned files or `main` edits authorized.

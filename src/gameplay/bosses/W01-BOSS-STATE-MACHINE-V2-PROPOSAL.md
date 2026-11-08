# W01 Boss — Creative-aligned state machine v2 (DESIGN ONLY)

Status: PROPOSED / AWAITING HQ BOSS SPEC & EVENT CONTRACT. No runtime integration, type declarations, approved content, or browser-tested battle is claimed.

Issue: #2 and QA defect #16. Branch: cq/boss/2. Main baseline: 40c76c3aafe6b8bd3d2db0723587e7d02ec9dcc1.
Owner: Boss Mechanics / src/gameplay/bosses/ ONLY.
This proposal reconciles the earlier draft with the Game Director's W01-CREATIVE-GDD.md (creative direction approved for prototyping, not implementation), HQ issue #9, UI design map, v0.4 source and QA P1 defect #16.

## 1. Design decision: three different player-thinking mechanics

The Boss is وحش الافتراضات, located in عرين الافتراضات in غابة الملاحظة. Preserve the three-shield metaphor. Player tools are Evidence Lens, Mirror and Forge, not a generic health attack.

| Phase | Meaningful player verbs | Acceptance focus | Observable gameplay change |
|---|---|---|---|
| P1: The Fog — شاف ولا افترض؟ | Inspect three nearby props, reveal fragments; attach two factual observations to two anchors | Exactly the required two source-grounded observations, distinguish unsupported motive | Both anchor points light; fog screen cracks; route to Mirror becomes navigable |
| P2: The Mirror — ده معنى ولا حكم؟ | Compare two tentative interpretations and one overconfident claim; select a plausible route and a discriminating new evidence request | Defensible hypothesis is qualified, proposed missing evidence could test it, unsupported generalization rejected | Chosen mirror rotates / path changes, second screen falls; alternate defensible route stays equally valid |
| P3: The Forge — الفكرة هتعمل إيه؟ | Construct a structured Concept: observed behavior, bounded interpretation, fair-organizer/brand role, concrete audience action; optionally explain in free text | Evidence-linked, acknowledged uncertainty, relevance, genuine action not just slogan, transparent learner review of open-ended quality | Scene bridge rebuilt / projection turns into a useful guide; third screen falls only on accepted completion |

**Correction to v1 design:** P3 is not merely "repair a valid observation". That was insufficient transfer. It must synthesize Observation → tentative human meaning → Brand role → executable Concept, while remaining teaching-scaffolded for a first-world learner. The exact learning bar belongs to Learning Architect.

## 2. Example authored practice flow — NOT FINAL CONTENT

Scenario: hypothetical craft fair. Observed: some visitors photograph pieces, ask for sizes, note item numbers, explore other booths, and a subset revisit earlier stands. Never infer that all visitors have the same intent. The organizer's role as "brand" is an unapproved illustrative placeholder until Scenario provides the brief.

P1:
- Player inspects product/visitor/booth clue zones (keyboard/tab/press and touch equivalent).
- Correct anchors: "بعض الزوار بيصوروا القطع وبيسألوا عن المقاسات" and "في ناس بتسجل أرقام القطع، وبعضهم بيرجع لجناح سابق".
- Bad anchor: "الزوار خايفين من الأسعار" (possible motive, but not directly observed).
- Feedback: "التصوير ظاهر. الخوف من السعر تفسير محتاج دليل تاني."
- Action effect: the two physical anchors visibly activate, then fog cracks once.

P2:
- Mirror shows tentative route A ("يمكن الزوار بيقارنوا تفاصيل القطع") and tentative route B ("يمكن بيسجلوا القطع علشان يرجعولها"), plus invalid universal claim ("كل الزوار خايفين من السعر").
- Route A can pass with a discriminating next research action that tests whether comparison is actually happening (e.g. ask visitors what details they compare / compare observed sequences across alternatives).
- Route B can pass with a discriminating research action testing revisit intent (e.g. ask visitors why they photographed an item and whether they used it to return).
- Selecting route A or B **alone** is not enough. Player must attach appropriate relevant source IDs and a testable missing-evidence request, while labeling motive as tentative.
- Bad choice, misleading reference or a question that presumes the motive gives an actionable explanation and retry. Neither plausible motive may be falsely declared a proven insight.
- Action effect: corresponding mirror lane shifts; second defense actually collapses.

P3:
- A potential organizer/brand role is to remove friction in comparing or revisiting handmade pieces; this is a fictional training proposal, **not a proven consumer or brand claim**.
- Structured Concept route A: keep photos/booth/item details attached to a visitor's temporary fair map to make returning to a saved piece easy. Route B: give accessible detail cards to compare material, size and making process across booths without implying a specific motivation.
- Both routes may pass if linked to observation, caveated rationale, realistic organizer capability and a concrete player-facing action. Text-only "إبداعك بلا حدود!" cannot pass by itself.
- The player may write their own concept in free text, but evaluation of originality and persuasive relevance remains a transparent rubric/self-review or optional human/ChatGPT discussion. **Never claim that a length check, keywords or manual checkbox is semantic AI verification.**
- If assessment cannot verify a wholly open-ended response, UI labels progress "Structured criteria checked + self-reviewed", never "AI-approved masterpiece"; QA validates provenance is visible.
- An accessible path to win must work offline and without paying for AI. Required structural fields are checked against authored, versioned evidence and approved alternatives. Design must not require literal wording.

## 3. Proposed machine states (local pseudonames; not exported interface)

READY; P1_EXPLORE; P1_FEEDBACK; P1_RESOLVED; P2_TEST; P2_FEEDBACK; P2_RESOLVED; P3_BUILD; P3_FEEDBACK; P3_SELF_REVIEW; COMMIT_PENDING; COMPLETE; RECOVERABLE_ERROR.

PAUSED is a serialized wrapper with a pointer to the previous safe non-paused state and the full draft. No reward, shield or scored state is changed by entering/leaving pause.

### Transition table

| From | Player event / system response | Mandatory guard | To | Visible response |
|---|---|---|---|---|
| READY | interact with guardian | gate open; not already rewarded; Engine pause acknowledged | P1_EXPLORE | Three intact defense screens; evidence props active |
| READY | interact after prior completion | Engine says Boss completed | COMPLETE | Old victory view; **no repeat reward** |
| P1_EXPLORE | inspect a clue | known scene evidence ID; not paused | P1_EXPLORE | Source fragment is revealed; source linked |
| P1_EXPLORE | attach anchor fragment | known evidence ID and allowed anchor | P1_EXPLORE | Preview factual statement at physical anchor |
| P1_EXPLORE | submit anchors | two correct links not both present / motive presented as fact | P1_FEEDBACK | Show specific gap; shield remains intact |
| P1_FEEDBACK | retry / hint | encounter still active | P1_EXPLORE | Preserve inspected fragments; edit connections |
| P1_EXPLORE | submit anchors | both required observations grounded, correct scope and no motive fact | P1_RESOLVED | Activate two anchors, crack fog exactly once |
| P1_RESOLVED | acknowledge phase feedback | accepted P1 resolution stable | P2_TEST | Mirror affordances unlock |
| P2_TEST | submit interpretation + proposed research test | unqualified, leading, wrong test, or unsupported universal claim | P2_FEEDBACK | Name specific inference error and missing evidence |
| P2_FEEDBACK | retry / hint | encounter active | P2_TEST | Keep inspected sources, no penalty |
| P2_TEST | submit interpretation + proposed research test | one authored valid route and matching discriminating test + tentative language | P2_RESOLVED | Mirror rotates; second defense breaks once |
| P2_RESOLVED | acknowledge feedback | accepted P2 resolution stable | P3_BUILD | Evidence-to-Concept Forge unlocks |
| P3_BUILD | join observation, hypothesis, brand role, audience action | editable, known stable IDs, valid authored fragments | P3_BUILD | Show concept preview and trace links |
| P3_BUILD | submit structural Concept | missing evidence, missing action, incompatible brand role, slogan-only structure | P3_FEEDBACK | Targeted rubric correction; no shield damage |
| P3_FEEDBACK | revise / hint | encounter active | P3_BUILD | Preserve selected route/draft |
| P3_BUILD | submit structured Concept | all mandatory structural gates met | P3_SELF_REVIEW | Display open-ended criteria and stated assessment provenance |
| P3_SELF_REVIEW | request edits / reject criterion | player elects revision | P3_BUILD | Draft intact; no reward |
| P3_SELF_REVIEW | confirm rubric review | player acknowledged applicable criteria; no failing mandatory structure | COMMIT_PENDING | Begin real bridge effect, request Engine completion receipt once |
| COMMIT_PENDING | persistent progression ack | matching Boss ID / attempt / version + idempotent receipt | COMPLETE | Show committed XP/unlock and opened portal |
| COMMIT_PENDING | ack dropped, reload, or event repeated | same transaction id, no new award request | COMMIT_PENDING or COMPLETE | Reconcile saved receipt; never add XP again |
| Any non-terminal state | pause, close overlay or reload | save successful or safe serialized fallback | PAUSED(safe state) | Freeze controls & animations; no invisible progression |
| PAUSED | resume after world & UI ready | restore snapshot validated; Engine resume/pause handshakes | saved state | Restore focus, props, evidence, shield effects |
| Any active state | stale phase event, duplicate tap, unknown evidence | guard rejects mutation | unchanged | Safe no-op/accessible explanation |
| Any active state | recoverable missing content/event/asset | save safe snapshot first | RECOVERABLE_ERROR | Retry/exit without losing progress |
| RECOVERABLE_ERROR | resources available | restore last safe state | previous safe state | Error clears; no automatic reward |
| COMPLETE | revisit, repeat submit, return to map | existing completion receipt | COMPLETE | Portal stays open; XP unchanged |

### State chart

~~~mermaid
flowchart LR
  READY --> P1[P1 Inspect]
  P1 -->|invalid| F1[P1 feedback]
  F1 --> P1
  P1 -->|valid two anchors| C1[Shield 1 cleared]
  C1 --> P2[P2 Test interpretation]
  P2 -->|invalid| F2[P2 feedback]
  F2 --> P2
  P2 -->|valid qualified route and test| C2[Shield 2 cleared]
  C2 --> P3[P3 Forge Concept]
  P3 -->|invalid| F3[P3 feedback]
  F3 --> P3
  P3 -->|passes structural gates| R[Self review]
  R -->|revise| P3
  R -->|confirmed| W[Completion pending]
  W -->|durable commit receipt| DONE[Complete]
~~~

## 4. Detailed invariants / guard rules

1. No effect or reward on opening a phase, pressing a random choice, reading a hint or requesting optional ChatGPT.
2. Required P1 observations each have stable evidence ID/source links. Inspecting is not the same as proving.
3. Phase 2 requires **both** a qualified interpretation **and** a discriminating evidence request, not merely choosing a plausible statement. Both authored alternative routes can be correct.
4. Phase 3 requires a **concrete audience behavior change** and an implementable Brand role; no "catchy slogan = Concept" shortcut.
5. Wrong selections, missing context and failed structure all lead to feedback and recoverable retry; no timer, life penalty or XP loss.
6. Visually authoritative defense state derives from accepted phase receipts. Animation does not grant completion. With reduced motion, show the equivalent text/progress state.
7. Any in-progress draft must survive pause/close/reload. Completed legacy level 10 remains unlocked without earning again; the treatment of legacy partial phase values needs HQ decision.
8. The Boss module never writes the old localStorage key and never mutates global progression directly.
9. Client-side manual self-review is honest **only when labeled as such**. It does not produce independently verified mastery or a numeric AI score.
10. P1, P2, P3 accepted results and reward idempotency require HQ versioned IDs, guards and test fixtures. Never infer canonical IDs from a title.
11. There must always be a safe exit or retry from every nonterminal state, including asset failure and completion acknowledgment pending.
12. Duplicate input from keyboard + touch, animation callbacks, and reloaded pending actions must not advance an extra phase or award XP twice.

## 5. Boss state persistence / progression handoff

Persist stable Boss/scenario/version identity; current safe state; chosen evidence IDs; two anchor links; tentative interpretation ID; requested discriminating research action ID; structured Concept components; optional text; transparent rubric checklist/assessment mode; hints used; accepted phase receipts; completed transaction ID; last phase effect ack.

- The Engine is the only authority for earned XP, level unlocks and durable completion. Boss requests a single idempotent completion transaction; the result is what the UI announces.
- If a user closes the window after sending completion but before ack, resume reconciles the **same** transaction, not a new one.
- v0.4 save is read via HQ's migration adapter; key is creative-quest-2d-v02. Previously completed level 10 must not be reset or rewarded again.
- v0.4 bossPhase=1/2 maps to **UNDECIDED**: legacy phases have different meaning and a documented QA bypass. HQ must approve how partial snapshots resume without silently granting new skill attainment.
- Persist progress by stable ids/revision; NEVER use Arabic UI text or source quotation as a state key.

## 6. UI & art dependencies (requirements, not invented asset/events)

- Accessibility requires a DOM representation for inspecting, linking and selecting evidence independently of pixel-perfect physical hit areas. Touch, keyboard and screen reader have equivalent commands.
- Game displays two anchor points, three defense screens, two plausible Mirror paths, one invalid universal claim, and the Forge bridge outcome. Text labels accompany every color/animation.
- No unapproved Guardian animation file paths. Ask Character Artist for idle, observing, first-crack, mirror-react, bridge-rebuild, defeated and reduced-motion-equivalent state IDs, or implement approved non-animated placeholders.
- UI owns dialogs, focus, announcements, contrast and 360px layout. Boss owns state transitions, criteria checks and **requests** to visual/audio state changes.
- Engine owns encounter trigger, scene/camera state, pause/resume acknowledgment, asset loading, event ordering and persistent reward.
- Learning Architect owns final rubric, evidence sufficiency, mistake feedback and whether a self-review route counts as course progress.
- Scenario Writer owns actual facts, authored alternative hypotheses/concepts, safe fictional brand brief, source IDs and content variants.
- Game Director owns narrative/creative mechanics and final visual acceptance.

## 7. Approval questions, prioritized for HQ

**BLOCKER A — Contracts:** What are the exact approved and versioned BossSpec, assessment result, Boss/GameEvent and UIBridge types/IDs? Is there a transactional completion API returning durable ack and reward id? Who guarantees event ordering and version checking?

**BLOCKER B — Learning + content:** Which evidence IDs/required two anchors/allowed alternative interpretations and discriminating tests are approved? How much of Concept structure can be checked deterministically? What is the mandatory no-AI completion policy for open-ended Concepts, especially if self-reviewed?

**BLOCKER C — Legacy progress:** What precise migration maps save.done containing 10 and bossPhase 1/2? Do not promote bypassed partial stages as verified learning. Should they restart the new Phase 1, or receive an explicitly nonpunitive equivalency path?

**BLOCKER D — Engine/UI:** How do World interaction, three physical prop clicks, mirrored lane choice, Forge submission, phase effect acknowledgments, pause/focus restoration and portal unlock travel through approved events? Should Boss module process phase effects or only emit semantic requests?

**BLOCKER E — Art:** Which validated sprite/guardian states, layer/map nodes and portal IDs correspond to the above phases? Do not invent asset paths.

**BLOCKER F — Integrator:** HQ issue #9 says PR target cq/integration/vertical-slice. Does HQ approve merging **design-only** documentation before signing runtime contracts? Runtime implementation remains HOLD until G0.

## 8. Targeted test plan for QA / acceptance (DESIGNED, NOT RUN)

| ID | Setup / action | Required outcome |
|---|---|---|
| B01 | Boss is locked; try to interact | denied with specific reason, no state or XP mutation |
| B02 | Unlocked entry, Engine pause ack | P1 with 3 intact screens, movement paused |
| B03 | P1 only one of two required anchors | cannot clear fog; cited feedback |
| B04 | P1 motivation disguised as observation | failure message, no defense reduction |
| B05 | P1 both correct evidence anchors | both anchors activate and first screen cracks once |
| B06 | P2 only chooses plausible interpretation | cannot pass without discriminating research test |
| B07 | P2 selects universal unsupported claim | feedback identifies overgeneralization |
| B08 | P2 chooses plausible route A + valid test | accepted / mirror changes |
| B09 | P2 chooses plausible route B + valid test | accepted too / mirror changes |
| B10 | P2 selects a leading/mismatched evidence request | rejected even if interpretation sounds reasonable |
| B11 | P3 has slogan but no tangible user action | cannot pass structured Concept gate |
| B12 | P3 valid complete route A | self-review shown and grounded evidence maintained |
| B13 | P3 valid complete route B | same acceptance standards, no single memorized answer |
| B14 | P3 open text nonsense + manual rubric claims | not represented as AI-grade or verified; no structural bypass |
| B15 | P3 chooses revise | returns to draft, no shield change or reward |
| B16 | Repeat completion events and rapid taps | exactly one persistent XP and unlock receipt |
| B17 | Refresh after sending completion request before ack | transaction reconciled, exactly one reward |
| B18 | Pause/close/reload during P2 or P3 | intact drafts/links, screen states/focus resume |
| B19 | Hint 3 times, no valid submission | still not passed; no time/XP penalty |
| B20 | No network/no AI API | encounter remains fully completable and feedback honest |
| B21 | Completed v0.4 level 10 migration | completed/no new XP; no progress loss |
| B22 | Partial v0.4 bossPhase=1/2 migration | matches HQ written mapping (BLOCKED pending decision) |
| B23 | Unknown IDs/out-of-order events/asset failure | recoverable response/no dead state |
| B24 | 360px touch, desktop keyboard, reduced motion | complete all phases with accessible equivalent mechanics |

## 9. Review / implementation boundary

DONE: Source-grounded v2 design, alignment with approved-for-prototype Creative GDD, phase transition matrix, alternate success routes, save/reward invariants, QA acceptance matrix and HQ questions.

NOT DONE: Approved canonical IDs/schema, TypeScript Boss engine, runtime effects, browser/Android tests, screenshot/video of actual gameplay.

BLOCKED: HQ issue #9 G0 contracts/ADR, Learning signoff, Scenario Boss content, Engine/UI pause & completion events, Character/World asset IDs.

Next: submit draft PR to HQ integration branch for **design review only**. Implement code solely under src/gameplay/bosses after approval, and coordinate independent QA. 

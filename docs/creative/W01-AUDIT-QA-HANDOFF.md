# W01 — v0.4 Creative Audit, Acceptance & HQ Handoff
**Task ID:** `CQ-DIRECTOR-W01-20261108`  
**Role:** Game Director & Creative Director — creative decision and design review only  
**Baseline HEAD inspected:** `40c76c3aafe6b8bd3d2db0723587e7d02ec9dcc1` (`main`, November 8, 2026)  
**Source read:** `README.md`, `docs/PROJECT-BIBLE.md`, `docs/SHARED-CONTRACTS.md`, `docs/AGENT-ROLES.md`, `index.html` and user-supplied game-style reference imagery.  
**Owned files only:** `docs/creative/`; no change to `index.html`, source engine, assets, `main`, `PROJECT-BIBLE` or `SHARED-CONTRACTS`.

## Findings grounded in v0.4 source (not a playtest)
| Category | Source evidence | Creative verdict |
|---|---|---|
| Navigation | `tick()` reads arrow/WASD, joystick, pointer destination; player and camera update each frame | **KEEP** ability to explore and the low barrier to input. Actual latency, collision and touch feel are **NOT TESTED**. |
| World landscape | `terrain()`, `forest`, `PATHS`, `draw()`, `marker()` construct a procedural canvas map and world-specific palettes | **REVISE** to purposeful, layered, navigable environments and dynamic paths; existing draw calls are not equivalent to an approved collision/world art set. |
| Level content | First nine baseline cases = library, nursery, cinema, clothing, music, coffee, games, gallery and coworking | **KEEP** useful domain diversity and some source dialogues; transform into world-specific cognitive encounters. |
| Existing format variants | `OBS_VARIANTS` makes levels **1 select, 3 evidence, 5 classify, 7 pair**; the other five initially use the `check()` free-text/keyword pipeline | **CREDIT** existing format diversity; **REVISE** nine interactions so agency changes encounter/world state. Do not falsely claim all nine are identical text fields. |
| Free-text | `check()` matches keyword groups; explicitly discloses limitations and enables self-review after two tries | **KEEP** honest disclosure/retry. **REJECT** any claim that this is reliable semantic AI judgment. Improve transfer rubrics without adding fake intelligence. |
| Boss | `bossScreen()` has 3 gates, observation selection, a text/possibility check, and a ChatGPT handoff with manual victory confirmation | **KEEP** 3-stage structure, transparency and original “وحش الافتراضات” theme. **REVISE** 3 phases to produce independent environmental decisions and a real concept-making payoff. |
| Battle dressing | `showArena()` / `updateArena()` render enemy-health / sprite effects connected to advancement | **REVISE** so learning decisions visibly reconfigure the combat environment; avoid false impression of real-time battle from mere HP changes. |
| Sprite implementation | embedded `SPRITE_HERO` / `SPRITE_GUARDIAN`, `heroSheet` / `guardianSheet`; frame drawing with animation offsets | **KEEP** sprite motion as migration baseline; production sprite fidelity against approved identity sheet is **UNVERIFIED**. |
| Saves | `STORAGE='creative-quest-2d-v02'`; `save.done`, `save.unlocked`, Boss states | **PRESERVE** progress semantics; migration/change of IDs is HQ-owned and requires old-save test. |
| Scope / publication | README says v0.4 with 100 authored levels and 10 worlds; source contains extended authored banks | **DO NOT CONFUSE** authored counters with fully playtested RPG quality. GitHub Pages site functioning and full mobile regression are **NOT VERIFIED HERE**. |

### Evidence limitations
- Source review, project docs and reference-image inspection completed.
- **No in-engine 360px or desktop playtest occurred in this review.** Neither actual frame-time, route collision nor game interaction was independently measured.
- **No authentic v0.4 screenshots were captured or annotated.** Do not invent screenshot evidence, fabricate test results or mark the game visually approved. Annotated capture requests appear below.
- **No approved hero master sheet is committed** to this change. The uploaded “MING” example is a turnaround/style study, not the playable hero identity.
- **No finalized Learning Architect taxonomy / rubric artifact was found in the audited root/docs paths**; proposals must be reconciled with that role before authored challenges are signed off.

## Creative quality gate
**Direction-only decision:** `APPROVE FOR PROTOTYPING` for a single improved W01 and L01–10 learning path. **Implemented status:** `UNVERIFIED`.

Source-review risk judgment (not numerical playtest ratings):
- **Learning transfer — NEEDS VALIDATION:** levels practice evidence hygiene, but transfer to a new advertising brief is not tested.
- **Player agency — REVISE:** moving between guards exists; more of the central challenge behavior should happen in the world.
- **Encounter originality — REVISE:** 4 interaction formats are real; physically and cognitively distinct 9 encounters are not proven.
- **Game feel — UNVERIFIED:** animation/camera movement visible in source, but tactile response and feedback timing not tested.
- **Art/world identity — REVISE:** procedural palette/terrain establish a baseline, but reference-level painted art and layered collision are absent from reviewed files.
- **Production feasibility — HQ REVIEW:** preserve baseline, build one vertical slice before committing to world-wide source or art rewrite.

## Screenshot capture requests — NOT YET PRODUCED
QA/UX or HQ should attach **genuine game captures** at `360 × 800 CSS px portrait` and a desktop viewport (e.g. `1366 × 768`) for all items. When captured, annotate as follows:

1. **W01-start-mobile.png — [A] silhouette hero, [B] walkable next turn, [C] visible interact hotspot, [D] joystick/action clear of hero, [E] header/quest not obscuring path.** Reject if hero/ground merge, clipped Arabic or overlapping touch targets.
2. **W01-encounter-mobile.png — [A] observed evidence, [B] exact player choice, [C] hint/return, [D] reasoned feedback, [E] environmental state change on successful reasoning.** Reject if the only change is an XP label.
3. **W01-boss-phase1-mobile.png — [A] claim telegraph, [B] selectable evidence prop, [C] first shield path transformation.** Include a wrong-choice capture with diagnostic text.
4. **W01-boss-phase2-mobile.png — [A] potential Insight caveat, [B] missing-evidence test, [C] altered arena route.** Include a recovery capture.
5. **W01-boss-phase3-mobile.png — [A] actual brand action / Concept, [B] reason for accepting alternate solution, [C] visible resolved exit bridge.**
6. **W01-desktop.png — [A] comfortable hero/world scale, [B] UI not lost at widescreen, [C] keyboard hint, [D] NPC route discovery.**
7. **W01-animation-comparison.png — four hero directions, idle/walk/inspect, frame footprint and proportions; then one actual scaled in-game screenshot.**

**Screenshot policy:** link real captures/PR artifact paths after QA produces them. Do not paste concept art as proof of implementation.

## Acceptance checklist for HQ/QA (check only with evidence)
- [ ] Exact SHA of integrated build recorded; `main` source and saved progress preserved.
- [ ] First world traversable: main path, side paths, obstacles/collisions, guardian interactions, meaningful shortcut; no walkable areas hidden under flat backdrop.
- [ ] W01 has **nine** distinct cognitive verbs and real-world contexts, not nine synonyms of Observation.
- [ ] Each encounter declares primary learning objective, player action, accepted outcomes (including alternate defensible interpretations), rejected reasoning and environment reaction.
- [ ] Novice demonstrates `Observation ≠ Assumption` on an unseen scenario after Boss.
- [ ] Boss stages 1/2/3 change *world/arena state* in response to reasoning (not only enemy HP); failure, hint, retry, pause and recovery tested.
- [ ] Structured choices deterministic and fair; open-text evaluation honest about rubric/manual/optional AI limitations.
- [ ] Hero master turnaround owner-approved; animation frames consistent with sheet, scale and hitbox; four directions checked in animation playback.
- [ ] W01 environment and Boss mood meet approved art bible in **actual playable frames**; no copy of reference art.
- [ ] No clipped Arabic or horizontal overflow on 360px portrait; readable on desktop; RTL/English mixed content, safe areas and back-navigation verified.
- [ ] Joystick and action controls are legible, at least 44 CSS px targets; no overlap; reduced-motion and non-color-only Boss cues.
- [ ] Save/reload/Boss state/XP migration and GitHub Pages deployment checked by HQ/QA.
- [ ] Genuine annotated mobile/desktop screenshots linked, with unresolved issues assigned.

## Handoff and shared-contract requests (DO NOT edit contracts here)
**For HQ / Technical Producer**
- Decide the **camera/view mode** and ground interaction/collision contract (proposed shallow 3/4 exploration) before any environment art coordinates or hero atlas dimensions are frozen.
- Decide how the **Evidence Lens**, clue state, choice consequences, multi-stage Boss transformations and alternative valid routes are represented in game contracts; obtain explicit HQ acceptance before others code.
- Preserve current `creative-quest-2d-v02` save compatibility and original world/level IDs until a tested migration is signed.
- Establish a **single versioned repository reference path** for approved image sources. Current user-provided image attachments do not transfer automatically to art chats.

**For Learning Architect**
- Validate L01–10 objectives and the 3/3.5 difficulty ramp, including W01 as Observation with structured previews of Reasoning → Insight → Concept.
- Approve or revise the Boss rubric and constraints on manual/self-reflected free-text scoring.
- Define the unseen-case transfer test and alternate-valid-answer criteria.

**For Scenario & Level Writer**
- Turn L01–09 encounter briefs into small, evidence-grounded sample level specs under approved interfaces; do not replace baseline IDs or create hundreds before a playable vertical slice.
- Make each level's misleading interpretation *plausible* enough to teach a valuable distinction, not an obviously silly straw man.

**For Character / World Artists**
- First deliver a **single hero master sheet** and a **single W01 start-path visual frame** for owner approval. Use only properly shared/approved style attachments. No full-world batch assets yet.
- After signoff, create layered navigable environment and tested animations, not a standalone illustration.

**For Boss/UI/Engine/QA**
- Prototype one end-to-end path (L01 exploration → evidence → environment reaction → save) followed by Boss phase proof.
- Verify 360px portrait and desktop captures and the fairness of retries before asking for final creative go/no-go.

## Explicit rejection and creative risks
- **Blocker:** final hero likeness and sprite identity not yet approved in current repo.
- **Blocker:** no locked camera / rendering, collision and performance agreement from HQ.
- **Blocker:** no actual mobile/desktop in-engine QA evidence or annotated captures.
- **Risk:** forcing all ten worlds into the same green forest + recolor violates visual differentiation.
- **Risk:** scripted concepts scored as unique “right answers” can punish valid creative alternatives.
- **Risk:** deeper end-to-end skills in one early world may overload a novice; Learning Architect must review what is a preview vs mastery.

## Signoff stamp
**W01 WORLD DIRECTION: CREATIVE APPROVE (prototype stage)**  
**W01 9-ENCOUNTER / 10-LEVEL JOURNEY: CREATIVE APPROVE (curriculum review pending)**  
**BOSS 3-STAGE DESIGN: CREATIVE APPROVE (contracts/implementation pending)**  
**HERO FINAL IDENTITY: NOT APPROVED / AWAITING OWNER REFERENCE LOCK**  
**ACTUAL GAMEPLAY, UX, ART PRODUCTION & RELEASE: UNVERIFIED, NO IMPLEMENTATION SIGNOFF**

**Next decision:** HQ reviews contract-impacting requests and merges docs PR if accepted; Learning Architect validates transfer rubric; then create *one* playable horizontal slice before any asset mass production.

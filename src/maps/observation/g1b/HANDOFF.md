# Issue #58 — W01 G1b physical Evidence Room (World Lead handoff)

**Status: DESIGN / STATIC MAP CANDIDATE — NOT AN INTEGRATED OR PLAYABLE E01.**
**Source:** `cq/integration/vertical-slice@ca2012f9bf1ddb1cefca310bfabca29691feb31e` (2026-11-08). **Task:** [#58](https://github.com/Mahmoud-abd-elwahab/Creative-Quest-Game/issues/58). **Feature:** `cq/world/g1-evidence-path`. **Target:** Integration, never `main`.

## Evidence driving this design

- Technical Producer [PR #10 comments](https://github.com/Mahmoud-abd-elwahab/Creative-Quest-Game/pull/10) / Issue #58: export real **world-pixel** geometry with top-left origin, player at **feet center**, plus testable collisions, separate evidence props and a **truthfully** blocked/open shortcut. Do not touch other owners' contracts or Engine.
- Director [GDD](https://github.com/Mahmoud-abd-elwahab/Creative-Quest-Game/blob/cq/integration/vertical-slice/docs/creative/W01-CREATIVE-GDD.md) and #44 review / PR #50: L01 must be physical Inspect, not a single generic clue circle + full worksheet; real route change, not green trail.
- Learning #45 / PR #49: E01 bounded structured selection acceptable for G1 **prototype only**; all three pairs A+B, A+C, B+C are valid; a passed finite assessment is **not general mastery**. E02/E03 not approved. Do not forge new grading rules in World.
- QA #43 / PR #51: actual staging interaction one clue only. Independent QA has red #46 (PARTIAL in UI), #47 (success copy), #59 (740×360 E-key timeout, untriaged); physical Android, hero scale and E01 player-exploration signoff unverified.

## Deliverables — inspectable files

| Path | Purpose |
| --- | --- |
| `world-closed.v1.json` | `WorldSpecV1`-shaped static before map; 1280×900 world pixels, **3 solid hedges/gate**. |
| `world-open.v1.json` | Same world, spawn, nodes and non-gate solids, but **gate collider removed**. State swap is **not implemented**. |
| `room.manifest.draft.json` | Candidate source/event/FX IDs, evidence-to-content mappings, unlock guard, asset rights and explicit runtime blocker. |
| `validate-g1b.mjs` | Self-contained fail-closed Node 22 design test: graph/path BFS with 15px feet-radius sample, props and content IDs, collider-visual matching, clearance, paths before/after, approximate 360px cue size. |
| `../../../../public/assets/worlds/observation/g1b/{background,ground,props-closed,props-open,foreground,review-overlay,review-overlay-open}.svg` | Seven separate original SVG layer/proof files; gameplay art contains **no Arabic text, answers, dialogs, hero sprites or baked HUD**. |
| `../../../../art-source/worlds/observation/g1b/room-review.html` | Static layering, state switch and **camera focus** review at desktop/mobile CSS widths. It does **not** dispatch GameCommand, change SaveState or render a playable Phaser scene. |

### Coordinate table (all world pixels, origin top-left)

| Point / area | Position | Interaction or gameplay meaning |
| --- | --- | --- |
| Spawn / feet | (700,785) | Safe south clearing; no nearby collider. |
| Receipt 41 | (390,675), radius 65 | Separate physical return-slip lectern; `W1E01_REC_A`, option `W1E01_ACT_A`. |
| Receipt 57 | (970,675), radius 65 | Different receipt-board silhouette; `W1E01_REC_B`, option `W1E01_ACT_B`. |
| Optional receipt 62 | (155,595), radius 64 | Bonus source on long western detour. Preserves canonical A+C/B+C alternatives without changing Content. |
| Evidence linking table | (705,555), radius 65 | Proposed challenge-bearing `w01-e01-linking-table`, maps to authored E01 `cq_obs_w01_e01_inspect_v1`. **Cannot yet lock based on physical discovery**. |
| Shortcut south approach | (705,520) | Open in both states; no invisible wall. |
| Visible stone gate | rect (650,390,110,84) | Closed-state collider `w01-g1b-shortcut-gate-solid`; visibly drawn in `props-closed.svg`. |
| Shortcut north approach | (705,340) | Reachable around hedge ends in closed state; direct passage **blocked** until later signed unlock. |
| North landing | (705,250), radius 70 | Placeholder observation landmark; **not** an approved E02/portal or gameplay transition. |
| West / east hedge solids | (215,390,435,84) / (760,390,335,84) | Always-visible obstacle bodies that leave traversable detours at x≈155 and x≈1170. |

The gate is a **shortcut** rather than an invisible level lock. Before unlock, both long perimeter detours physically work. After unlock, a player can traverse the formerly blocked center gap. The E01 story guard, not geometry alone, will determine when a post-gate scenario is eligible.

## Mini overview (schematic; world pixel placement in JSON/SVG takes precedence)

```text
                       [north landing 705,250]
                   west-detour  /  |  \ east-detour
                                [GATE]
                    ← hedge / BLOCK / hedge →
                              [LINK DESK]
             [REC 41]                       [REC 57]
          [optional REC 62]                    |
                          [SPAWN 700,785]
```

**How this teaches in-world:** player navigates to distinct record props, sees which ID each contains, and chooses whether/how to connect two **independent documented actions** at the physical linking desk. Only after the honest E01 structured assessment and durable state commit should a gate-open effect swap the visible stone door and collision. A tap on the desk, proximity, two unrelated source views, PARTIAL response, or cosmetic green trail must **never** unlock the gate.

## Proposed exact HQ-owned contract delta — STOP until approved

The existing `src/contracts/v1.ts` `WorldSpecV1` can represent both static geometry states, but the **current Engine cannot meaningfully inspect an evidence-only clue**. Its actual scene renders generic nodes and G1EngineBridge permits challenge-bearing interactions only; no receipt-discovery save or route-change event exists.

**Proposal A — strict versioned extension, not implemented here:**

```ts
// Proposed discriminated node kind; do not patch src/contracts until HQ approves:
type EvidenceWorldNode = {
  id: string; kind: 'evidence'; evidenceId: string; // must exist in authored ChallengeSpecV1.evidence
  position: {x: number;y: number}; radius: number;
};

// Compatible fields for a versioned SaveState migration, new v1 key ONLY:
discoveredEvidenceIds: string[]; // stable scoped IDs incl. world/Challenge/evidence
unlockedRouteIds: string[];     // e.g. w01-e01-shortcut-north; persisted, deduped

// Reuse existing interact.request with evidence node ID. Proposed events:
{type:'evidence.discovered';requestId:string;worldId:string;nodeId:string;evidenceId:string}
{type:'world.route.unlocked';requestId:string;worldId:string;routeId:string;effectId:string}
```

**Guard specification (requires Engineer/HQ/Learning signoff):** count distinct inspected source IDs among 41/57/62 (minimum 2), then require `AssessmentResultV1.status=PASSED` with `narrativeCleared=true`, and ensure chosen options are a **valid authored pair whose source IDs were inspected**. Require a successful save/commit before `world.route.unlocked`, otherwise keep visible gate closed and surface save-unavailable feedback; do not invent XP or mastery. Idempotent re-inspection, retry, pause/reload and duplicate `reward.committed` must never double-open or double-award. Engine owns collision toggle or scene reload; UI owns accessible reveal card/labels; Content/Learning own exact answers. The current `WorldNode` entries for evidence-only props are placeholders (`kind='clue'` with no `challengeId`), deliberately **NOT playable** until the new contract is signed.

**Important original E01 limitation:** `W1E01_REC_D` (75) and `W1E01_HYP` remain fictional counterexample/hypothesis content but not physical unlock keys. The current UI shows all E01 evidence in one modal; changing it to progressive reveal is a **UI/HQ/Content decision**, not World authority.

## Static test design, results and explicit nonclaims

Run from the repository root:

```bash
node src/maps/observation/g1b/validate-g1b.mjs
python -m http.server 8000
# open http://localhost:8000/art-source/worlds/observation/g1b/room-review.html
```

**World-owned validator was executed on the actual branch-fetched input contents in a JS V8 evaluator**, with Node imports/file reads replaced by in-memory buffers; the original validator calculation body was unmodified. Result: **PASS, 0 failures**. Exact outputs at 20px grid step and 15px radius foot-sample: direct gate path **blocked before / clear after**, shortest south→north **1020px before, 180px after**; spawn→north **1360px before, 520px after**; source 41 **400px**, source 57 **380px**, optional 62 **720px** from spawn before unlock; 5 unique WorldNodes and separate SVG/WorldSpec assets; minimum nominal 360px node-circle diameter **72 CSS px** under assumed FIT of 640 world logical width to 360 CSS width. All passes are **geometric and deterministic**, not Android findings.

**NOT RUN:** actual Node CLI with full GitHub checkout (network DNS access unavailable here), Phaser gameplay tests on the new room, screenshot playback of new scene, Android/touch input, 740×360 focus failure #59 regression, real persisted discovery/route event, new Scene collision hot-swap, accessible UI/large-text verification, final hero/foreground depth sorting, or production export. Prior independent QA staging is **RED**, regardless of G1 build success.

### Required integration/creative/QA checks before approval

1. HQ approve a versioned evidence discovery + route unlock contract, atomic persistence/rollback behavior and WorldSpec loader policy; define how layer paths resolve under GitHub Pages subpath.
2. Game Director evaluate static Forest of Evidence room, silhouette/route visual clarity and real G1b gameplay after Engineering implementation. Only the approved teal-clad hero is canonical; this graybox includes **no hero**.
3. Character Lead publish approved actor feet pivot, display scale and collider radius; existing 15px radius is only a tested Engine sample from `observation-scene.ts`.
4. UI/Engine: two independent world prop interactions, sourced evidence reveal, valid optional 62 route, assessment constraints, save/reload gate state, collision toggling, accessible interaction cues. Repair E01 #46/#47 and independently verify #59.
5. QA: true Phaser movement over both before/after maps, source discovery order independence, interrupted/blocked save leaves gate closed, one-source/PARTIAL/retry/unsupported paths, duplicate receipt idempotency, no invisible route block, 360px/740×360/1280px camera + Android-scale screenshot, keyboard/virtual stick/touch, collision/foreground/UI overlap, lower-end phone performance. Do not count authored static validator or green build as gameplay pass.

**Conclusion:** accept for **world design + static geometry review only**. Any gameplay integration remains **BLOCKED by unapproved event/save contract** and independent QA/Director signoff.

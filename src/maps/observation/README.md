# Observation Realm — World Layout Concept 0.1

**Status: DESIGN GRAYBOX ONLY / NOT APPROVED / NOT A RUNTIME TILEMAP.**

**Baseline:** main `40c76c3aafe6b8bd3d2db0723587e7d02ec9dcc1` · Issue #4 · Branch `cq/world/4`.

## Current repo evidence and non-destructive approach

The v0.4 `index.html` defines a first world `غابة الملاحظة` with a forest theme, `WW=2350, WH=1550`, spawn `(250,1290)`, nine `MARKS` and a tenth Boss marker. These are **legacy prototype values**, not a signed tilemap or new coordinate contract. In the prototype the encounter spine is essentially linear; terrain draws decorative forest objects around the route. A dedicated collision/tilemap contract is absent. Preserve the original game: do not edit `index.html`, save data, the engine, or `main`.

The proposed Observation world retains forest as a recognizable direction, but adds meaningful routes, sight-line choices, junctions and return paths.

## Player fantasy / environment premise (requires Game Director approval)

Working name: **غابة الملاحظة — Forest of Evidence**.

The first realm teaches the eye to notice what was actually seen before jumping to explanations. It is a forest whose stone trails expose **different kinds of traces**: hoof/foot impressions, repeated marks on tree bark, fallen leaves arranged by wind, witness-sign posts, time marks and a quiet pool showing a second viewpoint. All are visual metaphors, **not canonical challenge content**. Environmental traces must not leak correct answers.

**Visual hierarchy:** walkable path lightest and most continuous; prop masses darker; interactables carry a consistent edge highlight + readable ground decal; silhouettes stay legible against forest floor. No generic magical particles as substitute for interaction cues.

## Mini overview map — topology, not coordinates

```text
                                     [07]───┐
                                    /       │
[SPAWN]──[WEST FORK]──[01]──[02]──[03]──[EAST HUB]──[09]──[BOSS ENTRY]──[ARENA]──[EXIT]
                 │          │            /       \   /
                 └──[04]──[05]──[06]────┘        [08]
                              
                 [02] ⇄ [05] = discoverable cross-trail / shortcut
```

The diagram is schematic: authoritative edges are in `traversal.draft.json`, not the ASCII spacing. **All 9 encounter slots and the Boss entrance are physically reachable**, even when specific interactions are still locked. Players get: a north/upper observation route, a south/lower context route, a connecting shortcut, two approach routes to the final check, and a visible Boss destination. The shortcut is discovered through a recognizable stone trail, never an invisible unlock wall.

**Learning flow is independent from geometry:** Scenario/Learning decides which of slots 01–09 may be activated and in what order. Walking near a later node must not auto-complete or launch an unapproved challenge. Boss/portal interactions have explicit visibly locked states; navigation to the entrance is not blocked by an unexplained collider.

## Layered map proof

`public/assets/worlds/observation/graybox-layer-proof.svg` is an **original vector graybox** with individually named SVG groups. It is not a flattened production map or engine asset. There are no copyrighted externally sourced textures or photos in the proof.

| Layer | Function | Rendering / collision rule |
| --- | --- | --- |
| background | Distant forest shapes/topography | Never collides; low contrast; behind ground |
| ground | Floor + walkable forked trail | Strong material/value difference; constant movement affordance |
| props | Trees, stumps, rocks, trace stations | Props visually sit on floor; solids later have separate collision footprints |
| foreground | Tall canopy/arches | Depth sorting based on actor feet; fade or mask on essential occlusion |
| collision | Non-walkable obstacles (debug red) | Concept-only samples. No final polygons until signed HQ contract |
| interactions | Nodes, Boss/portal cues (debug cyan/gold) | Trigger radii and ownership pending approved contract |
| annotation | Debug labels/legend **only** | Excluded from any final exported gameplay artwork |

**Proof separation:** path graphics and interaction rings can be independently hidden; collision boxes are distinct from ornamental tree art; foreground elements do not bake over player or HUD. Hero is intentionally **not** drawn: Character Lead owns scale/style.

## Preliminary art direction / palette — pending Director approval

- Canopy deep forest: `#25483D` (provisional legacy continuity)
- Understory: `#2B4E41` (provisional legacy continuity)
- Weathered path: `#C3AE91` (legacy continuity, strengthen relative to darkest props)
- Secondary shadow: `#1B352F` (proposed)
- Observation cue: `#B9E6BE` (proposed and accessibility-test-dependent)
- Boss threshold: `#D5B979` (proposed; reserved distinct from ordinary encounter cues)

**Shape language:** wide rounded tree masses; irregular triangular clearings; compact boulders and single readable signposts; route continuity from ground texture, not UI arrows. Future realms must differ in *topology/decision-making* (e.g., elevation switches, dense urban blocks, radial interior hubs), not only color.

**Lighting:** top-down soft dappled shadow anchored to static objects. No heavy parallax on a navigable top-down forest: it falsifies movement cues. Background drift, if later introduced, must be subtle and toggleable via reduced-motion. Avoid large bright bloom near trigger labels.

## Collision and overlap policy (until signed contract)

1. Block only real obstacles and map bounds, never decorative foliage shadows or atmospheric overlays.
2. Draw obstacle footprints at the **base** of a trunk/rock; canopy artwork overlaps through depth-sort and can fade when player is behind it.
3. Leave a predictable clear interaction pad around encounters. Required NPC/guardian space is reserved, not occupied by a foreground object.
4. Boss entrance stays visible before unlock; use a **visible threshold state** and interaction feedback, not an invisible blocking polygon.
5. Render the mobile HUD in screen-space above the world. Foreground scene art must clip to game viewport, never cover HTML HUD.
6. Gameplay collision, minimum corridor width, camera clamping, tile dimensions, object origin, polygon precision and hitbox metrics remain **TBD BY HQ**. The SVG debug rectangle sizes do NOT establish them.

## Asset/export and license plan

**Now:** original custom SVG graybox; UTF-8 JSON topology; Markdown spec. Original primitives have no third-party source material. Repository license/grant for future published assets needs owner/HQ confirmation; do not assume a public-domain license from a public repo.

**After approvals:** editable layered SVG/PSD/Krita source (choose with Art Director), lossless optimized PNG/WebP or approved tilesets, machine-readable HQ-approved tilemap/manifest with explicitly versioned widths, heights, tile units, colliders, zones, spawn and canonical interaction IDs. No baked text, characters, UI or Boss combat art inside the environment tiles. Third-party asset use requires stored source URL, license and attribution when required.

## Quality acceptance and evidence

**Validated at design stage:** 9 encounter slots; all 15 graph nodes BFS-reachable from spawn; Boss entrance physically reachable; north/south branch and cross-trail. Debug sketch has separately authored collision and interaction shapes. The graph has no permanent progress-gated physical edge.

**Not tested / blocked:** authoritative collision geometry, actual map dimensions and loader, taps/joystick on Android portrait, in-engine camera bounds, hero/canopy overlap, text/HUD occlusion, NPC/Boss interaction identifiers, touch/raycast tests, live screenshots. These claims require Engine + QA integration after HQ signs the contract.

## Handoff required from other owners

- **HQ:** approve versioned map origin/grid/coordinates, camera bounds, collision geometry and asset loader; define PR integration target.
- **Game Director:** approve first Observation forest moodboard/shape/palette; choose whether the landscape premise becomes canon.
- **Characters:** frame size, display scale, baseline/foot pivot and collision footprint. `64×64` is *not* assumed.
- **Learning/Scenario:** nine canonical encounter IDs and any required order or unlock cues.
- **Boss/Engine:** Boss entrance interaction ID, arena transition and portal ID. Engine owns loading/rendering/movement.

**Next world task ONLY after approvals:** convert this graph into a dimensioned, versioned tilemap with exact collision polygons and run a real Android viewport traversal test before presenting it as complete.

## 0.2 continuation — collision ownership and design-only preview

The first SVG proof used four abstract debug rectangles. Those would risk becoming invisible walls. **Replaced them** with 9 circular tree-root footprints (visible brown root art) and 1 lake ellipse (visible dark water); these are colliders only in the concept proof, not adopted game engine data. Decorative shadows, rocks without agreed footprints, and empty understory remain unblocked. The floor beyond the bright trail is **freely walkable** in the design preview to avoid unexplained movement walls.

### Additional owned-path deliverables
- `geometry.draft.json`: **1280×760 SVG sketch units** (not pixels/tiles), 15 sketch node centers, 17 linked sketch trail segments, 10 explicitly visible collision owners, and 5 synthetic free/blocked samples.
- `manifest.draft.json`: non-runtime source/export register, provisional color values and licensing status.
- `validate-graybox.mjs`: dependency-free Node checker for IDs, graph reachability, crossing segments, minimum clearances from drawn obstacles, preview layer presence, collision samples, and SVG/JSON consistency.
- `../../../art-source/worlds/observation/interactive-graybox-review.html`: standalone graybox camera/touch test harness using an abstract marker, *not the canonical hero*, engine, UI, or release build.

### How HQ or QA can reproduce locally

From repository root (on a machine with Node and Python):

```bash
node src/maps/observation/validate-graybox.mjs
python -m http.server 8000
```

Open `http://localhost:8000/art-source/worlds/observation/interactive-graybox-review.html` in a browser. Use WASD/arrows or the on-screen D-pad; test reset, layer toggles, and **Check sampled paths**. This fixture uses 10 sketch-unit avatar radius and 145 sketch-units/second **only for design review**. It has no challenge/XP/save interactions. It is intentionally not linked into production `index.html`.

### Evidence, accuracy, and remaining checks

- Read back all JSON/SVG/script files on the branch after commit.
- Graph reachability: **15/15**, nine encounters, 17 unique edges.
- Five authored collision samples independently evaluated: **5/5 PASS**.
- Validator algorithm executed against fetched branch files in a JavaScript evaluator: **PASS**, no failures (10 visible blocker footprints, all route clearances valid).
- Preview module syntax parsing: **PASS**. Its relative source file paths were verified by inspection.
- **NOT RUN:** actual Node CLI execution from a cloned repo, a real browser/Android end-to-end movement test, Phaser/Engine integration, real touch fidelity, frame performance, device screenshot, and production map size/camera tests.

This 0.2 work does **not unblock the production conversion**. HQ must still sign authoritative map coordinates, collision units/shapes, camera, loader and game/hero scale; Learning/Boss IDs and Game Director art approval are still pending. Only after contract signoff should a new runtime-specific tilemap, proper asset set and QA Android traversal evidence be claimed.

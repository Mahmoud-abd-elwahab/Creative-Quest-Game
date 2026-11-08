# W01 — Visual Art Bible, Hero & Realm Direction
**Status:** WORLD STYLE DIRECTION APPROVED FOR SMALL REFERENCE TEST; HERO IDENTITY / SPRITE EXPORT NOT YET APPROVED.  
**Baseline:** `40c76c3aafe6b8bd3d2db0723587e7d02ec9dcc1`  
**Authority:** Game Director creative specification only. Camera dimensions, sprite sheet cell size, tile coordinates, render budget and hitboxes require HQ/Engine contract approval.

## Visual proposition
**غابة الملاحظة — أصداء الأدلة:** a **stylized, painterly 2D fantasy world** where routes and light reveal what is actually supported by evidence. The reference pack includes layered, hand-painted forest/village environments and a stylized game-character turnaround. Adapt their **clarity, silhouette hierarchy, natural depth and controlled brushwork**; do not reproduce recognizable artwork or assume that any uploaded sample is an approved game asset.

**Signature frame:** close dark leaves frame a warm readable trail; interactable evidence flowers project compact visual scenes (book return slip, cinema ticket, music track etc.); a single warm beam marks a clue, never an arbitrary glowing decoration. In the Boss clearing, the same plants/lenses cast misleading reflections into an enormous dark glass figure. When reasoning improves, false projections collapse and usable paths become visible.

### Art/reference index (provided to this ChatGPT conversation, NOT committed in repository)
- **ENV-01** `cf85f132239150848b652ed4737ed503.jpg`: six horizontal painted forest/village biome studies. **Use:** layered atmosphere, guided walkable path and warm/cool contrast. First/second rows are closest to W01 target.
- **ENV-02** `dd9dfd3c95b68a58595b669d7074cf03.jpg`: fantasy and stylized scene lineup. **Use:** world diversity and foreground/landmark composition, **not** a literal W01 map.
- **ENV-03** `fae77b04f6f2ce7265e4be475681e5e8.jpg`: different vista lighting and silhouettes; use as environmental mood reference.
- **ENV-04** `540a0a7e0e483ed727c9a579755d0285.jpg`: landscapes; use for scene atmosphere and depth.
- **ENV-05** `de1936bee8ff57fd0852e7097c075b77.jpg`: outdoor/cave/forest background motifs; use for dramatic destination framing.
- **ENV-06** `b64639d2876ba210c4ea74e5e9792251.jpg`: broad concept scenes; use for distinct world promise, not W01 gameplay background.
- **ENV-07** `0c1f0d33b32e8f71e9c7033fb8ae90e2.jpg`: fantasy landscape studies; **second upload with “(1)” is a duplicate**, not a separate art direction.
- **ENV-08** `cae69bd84f3971ea8d3b97149b1e09e7.jpg`: strong silhouette/fantasy atmosphere; use for Boss destination mood.
- **CHAR-01** `45b93cae297c29c93b98e90de5d18dd0.jpg`: stylized street-boxer character sheet “MING,” showing front/side/back and material callouts. **Use only as an example of turnaround discipline, graphic simplification, body proportions and painterly treatment**. It is **NOT approval to copy the identity, clothes, boxing gloves, logos or body proportions**. Previous user direction asks for a playable hero with their own recognizable facial features; final hero must follow an owner-approved identity sheet.

**Reference transfer rule:** only the original image attachments, or an HQ-approved copy in a documented repository asset location, are valid visual handoff. Filename mentions alone do not make images accessible to other ChatGPT chats. **Action HQ:** request/commit/reference approved images before art agents claim to match them. No mass asset generation until a single style frame + master hero sheet are approved.

## W01 art DNA
- **Visual genre:** authored 2D painterly game art, readable at gameplay scale; clean silhouettes, subtle textured gradients, deliberate illustrative edges. **Not** photorealism, pixel art pasted on painted environments, or noisy generative painterly mush.
- **World camera proposal:** a **shallow elevated 3/4 navigable playfield** compatible in spirit with v0.4's free-roaming overhead navigation; far landscape panels can borrow the horizontal layered feel of the user references. This is a **creative preference, not a camera/engine commitment**. HQ must confirm movement coordinate mapping and collision approach before assets start.
- **Shape grammar:** organic branching lanes and curved leaf arches for safe exploration; angular broken glass / straight misleading projections for assumptions; arched stone supports and coherent grounded architectural silhouette for resolution. Every actionable object has a clear base/ground contact.
- **Dominant W01 palette (directional, not UI token commitment):** deep pine `#183E38`; middle jade `#356F5A`; quiet turquoise `#68A8A0`; sun-warm path `#D5B37F`; evidence amber `#F1CF84`; assumption violet-grey `#756187`; readable neutral cream `#F6F1E5`. Avoid saturating all background layers equally.
- **Lighting:** daylight-filtered canopy in tutorial, cool shadows with localized clue light in mid-world, cold reflected violet in deception area, warm light slowly entering Boss arena as screens break. **Light describes state**, not generic particles.
- **Values:** primary walking route and hero must remain separable from adjacent foliage at small scale; non-interactive trees should be less contrasting than active clue prop. Do not use color alone to communicate `Observed / Potential / Unsupported`.

## World 01 map / traversability
Target one coherent world with **three exploratory districts + a Boss clearing**. This is a **topological sketch**, NOT a locked tilemap or coordinate system.

```text
 [START] -- (L01 Library) -- (L02 Nursery) -- (L03 Cinema)
                \                     /         |
                 [optional clue glade]           v
                /                 [L04 Fitting] - [L05 Music] - [L06 Coffee]
              /                       |                          |
       [scenic loop] ------------------+---------------- [branch / shortcut]
                                                             |
                 [L07 Tabletop] -- [L08 Gallery] -- [L09 Coworking]
                          \              /                   |
                           [optional hypothesis test]      [BOSS]
```

- **Main route:** every required encounter reachable without discovering optional alcoves; no dead-end that requires a secret click.
- **Side spaces:** meaningful optional evidence/revision opportunities, never compulsory grind. A shortcut opens because a clue was reasoned correctly, not because an XP counter changed.
- **Layer split for environment artist:** background / far silhouettes, navigable ground, midground architecture, collision props, interaction hotspots, foreground occlusion, optional VFX cues. **No one flattened panorama supplies collision**.
- **Readable affordances:** clear foot path and destination landmark; clue props animate subtly *only when relevant*. Doors and gates use matching shape language for locked/ready/open states.
- **Staged light shift:** L01–03 sunrise warm, L04–06 cool morning/reflective, L07–09 high-contrast dusk, Boss moonlit reflection and warm resolution. Avoid implying four unrelated biomes in one small realm.
- **NPCs:** functional silhouettes: a witness (carries testimony), an evidence keeper (holds artifact), a projection/assumption (angular outline). Each NPC has a reason to be in that scene.

## Hero canonical style / consistency
**Identity lock is pending owner approval** (no auto-selection of CHAR-01 as the hero). The first art task is **ONE master hero sheet**, not mass sprites.

**Requested hero spec (art-only):**
1. Owner-approved unique identity, facial recognition anchors, hair shape, outfit silhouette and signature accessory **locked and documented**. No uncontrolled substitution of another character's face or costume.
2. One true turnaround: **front, back, left, right** plus explicit three-quarter pose if chosen. Same head/body scale, eye spacing, hair outline, footwear, costume seams, accessory placement, skin tones and light response across directions.
3. Clear game-ready expressions and motion intent: idle, walk/run, face-turn, inspect/evidence raise, reason/think, interact/activate, impact/stagger, success and defeat/recovery. Actions tied to evidence use a **tool/gesture**, not implausible punching.
4. **Same stable feet pivot and floor shadow** across frames; no wandering centerline, changing body mass, floating stance, extra fingers or asymmetrical costume swaps.
5. Source editable layered files → transparent production PNGs → consistent animation strips/grid → manifest in format approved by HQ. `64×64` is merely a prior **candidate**, not an imposed resolution. Use the smallest size that preserves facial identity on 360px display, subject to performance.
6. Visual QC: side-by-side directional lineup + frame-by-frame animated loops on neutral light and dark backdrops + actual scaled screenshot in-game. **A painterly concept turnaround alone is NOT a tested sprite sheet**.

**Creature design:** first Boss “وحش الافتراضات” is a tall broken-glass and branch silhouette, not a generic purple ghost. Three visual layers: (1) fog prints unsupported claims, (2) warped mirrors reflect uncertain motives, (3) empty glowing frame asks player to forge a useful, situated Concept. Exactly three distinct silhouettes/effects readable with reduced motion. No visible injury framing needed; “defeat” = dismantling false certainty.

## Layout hierarchy / readability on 360px portrait and desktop
**Priority order:** (1) hero + nearby path / evidence (2) single next action (3) immediate risk and feedback (4) XP and optional menus. Do not let world-map decoration compete with urgent evidence.

**360px portrait reference frame** (UX spec, verify in-engine):
- **Top:** one compact header/status line; secondary world/XP collapses into menu when space is scarce.
- **Below header:** one short quest objective, max two visible lines; tap to expand; no oversized floating banner across the hero.
- **Center:** navigable gameplay viewport must show hero, the nearby route and next hotspot together at practical scale.
- **Bottom edges:** left movement control; right action/inspect control. Controls and target hotspots must not overlap in normal play; touch targets at least **44×44 CSS px**. Respect phone safe areas.
- **Challenge overlay:** scrollable text with a persistent primary action and visible `Back` / `Hint`; no horizontal scrolling at 360px; real Arabic RTL shaping with correct LTR runs for `Observation`, `Insight`, `Concept`.
- **Feedback overlay:** “what was observed / what was assumed / what to test” as three compact steps, not decorative fanfare.
- **Boss:** the current shield/phase, physical cue and action must remain legible at 360px; screen flashes must be optional/reduced-motion friendly.

**Desktop:** same game state and visual priority, expanded visible map, keyboard arrows/WASD as in v0.4, discoverable interact action, readable dialogue width. Avoid simply scaling a tiny phone UI into a large window.

**Mobile non-negotiables:** no clipped Arabic, no hidden return action, readable character silhouette above environmental clutter, no touch-only hover affordance, no color-only feedback, no decorative controls blocking route.

## Concept and integration approval checkpoints
**A. One style frame:** forest start path with hero size placeholder and **clear walkable path / clue / foreground separation**. Compare to ENV-01 reference qualities at 360px and desktop.  
**B. Hero master turnaround:** owner explicitly approves identity and master style before animation.  
**C. Animated proof:** four directions + inspect + idle tested at gameplay scale, no proportion changes.  
**D. World proof:** layered map with walkable/collision layout and two discovery paths in a real scene.  
**E. Boss proof:** three distinct environmental changes track the thinking phases.

**Approved today:** art *language*, world mood, shape system, learnable affordances and exploration principles as a proposed style direction.  
**Not approved:** final hero appearance, exact camera/scale, asset exports, full map illustration, playable integration or release.

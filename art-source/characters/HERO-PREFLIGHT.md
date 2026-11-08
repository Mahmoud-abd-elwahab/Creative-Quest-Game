# Creative Quest 2D — Hero Sprite Preflight (NOT an approved asset pack)

**Issue:** #7  
**Role:** Character, Sprite & Animation Lead  
**Baseline:** `main @ 40c76c3aafe6b8bd3d2db0723587e7d02ec9dcc1` (2026-11-08)  
**Scope:** `art-source/characters/`, `public/assets/characters/`, `public/assets/guardians/` only  
**Status:** LEGACY AUDIT DONE / APPROVED HERO TEST BLOCKED

## Evidence inspected

- `README.md`, `docs/PROJECT-BIBLE.md`, `docs/AGENT-ROLES.md` and `docs/SHARED-CONTRACTS.md` at baseline.
- `index.html` embeds `SPRITE_HERO` as a `data:image/png;base64` sprite strip. PNG IHDR is **1536 × 256**, bit depth **8**, color type **6 (RGBA)**. Eight equal cells of **192 × 256** fit exactly, with no inferred padding.
- Legacy map function `hero()`: `player.moving ? 2 + floor(clock*10)%4 : floor(clock*2)%2`. Thus:
  - frames **0–1**: idle, 2 fps;
  - frames **2–5**: walk, 10 fps;
  - frames **6–7**: present in source strip, **not selected by the map hero()** (visual inspection suggests raised-weapon poses, but no approved attack mapping);
  - `ctx.scale(player.facing,1)` mirrors the strip horizontally, **not** independently drawn left/right/up/down actions.
- Map rendering maps cell **192 × 256** into destination **84 × 112** at relative `(-42,-77)`. This is a code-level rendering offset, **not an approved normalized pivot or hitbox**.
- Combat CSS has a separate scaled presentation (`.miniSprite`) for the same strip. Do **not** inherit CSS sizing as an approved Phaser atlas scale.
- The strip shows a compact pixel-art adventurer with dark blue headgear/clothing, red scarf, and yellow diagonal accessory. This describes the **legacy prototype**, not a canonical hero design.

## Findings / production risks

| Check | Result | Impact |
| --- | --- | --- |
| PNG dimensions from IHDR | 1536 × 256; 8 × 192 × 256 | **PASS** for inferred legacy strip geometry only |
| PNG alpha *capability* | RGBA (PNG color type 6) | **PASS** for format; pixel-level transparency NOT verified |
| Four uniquely animated directions | None: a single drawn view is mirrored horizontally | **FAIL** relative to new scope |
| Idle animation | 2 existing frames used | **FOUND**, not art-approved |
| Walk animation | 4 existing frames used | **FOUND**, not art-approved |
| Frame edge collision / clipping / opaque alpha | Not tested pixel-by-pixel | **NOT RUN** |
| Body silhouette consistency / ankle anchor jitter | Only quick visual inspection; no measured bounding boxes | **NOT VERIFIED** |
| SpriteManifest, exact fps/pivots/hitbox | Proposed only in `docs/SHARED-CONTRACTS.md` | **BLOCKED** by HQ |
| Editable layered source | Not found as an approved source in investigated paths | **BLOCKED** |
| User-approved hero reference | Not attached to this role chat; no confirmed approved repo reference | **BLOCKED** |
| In-game Android-scale playback | Not tested for new sprite | **BLOCKED** by Engine + QA |

**Important:** the older strip may be reused as an internal comparison fixture only. It must NOT be silently promoted into the final hero.

## Art direction gate (Game Director + owner)

Before designing production sprites, obtain an explicit hero sheet or approved repo asset that shows the identity from multiple directions. Confirm and document:
1. Silhouette, body-to-head ratio, clothing/accessories, palette and pixel-art style.
2. Exact front/back/left/right construction and what details must remain visible.
3. Weapon/tool visibility in neutral states; which props animate versus stay fixed.
4. First-slice minimum: idle + walk in **four directions**. Attack/hit/turn only when approved.
5. Actual mobile game view: target rendered height in CSS px and reference visual scale.

Do not derive a new identity from a prompt or from this legacy strip without the owner and Game Director approving it.

## Technical export gate (HQ + Engine)

`docs/SHARED-CONTRACTS.md` calls **64 × 64 a candidate**. No final exports or production SpriteManifest until HQ approves:
- cell `frameWidth/frameHeight`, between-frame padding and optional trim/bleed;
- strip/atlas naming and action direction IDs, frame order and counts;
- `fps` per animation, frame hold rules and reduced-motion fallback;
- anchor/pivot coordinate convention and playable collision hitbox;
- pixel scale policy, nearest-neighbor filtering, world-to-actor ratio, atlas budget;
- versioned manifest schema and importer expectations.

**Proposed manifest shape for HQ discussion only (NOT locked):**
```json
{
  "schemaVersion": "1.0.0",
  "characterId": "hero",
  "approvalStatus": "pending",
  "animations": [
    {
      "id": "idle-down",
      "file": "hero/idle-down.png",
      "frameWidth": null,
      "frameHeight": null,
      "frames": null,
      "fps": null,
      "direction": "down",
      "pivot": null
    }
  ],
  "scale": null,
  "hitbox": null
}
```

The `null` values deliberately mean unapproved; **this example is not an exportable runtime manifest**. HQ must version and validate real types before implementation.

## First sample after approval

- **One hero only**. Transparent idle + walking sprite strips for front/back/left/right, with consistent identity and exact uniform cell/padding.
- Original editable layered source (where practical), exported strips/atlas, versioned SpriteManifest, contact sheet and GIF/short loop.
- QC machine check: read every frame; verify in-bounds rectangles and alpha, no invisible-only frames, no cropped limbs; measure bbox/foot anchor deviations and inspect silhouette popping. Visual check on actual portrait Android rendering.
- Handoff to Engine (do not implement importer here). Only Engine/QA runtime evidence can make integrated status **VERIFIED**.

## Current handoff

- **DONE:** verified prototype strip geometry, actual runtime frame selection and missing 4-direction coverage; recorded requested approval gates.
- **NOT DONE:** canonical character-sheet assessment, approved character sprites, new PNG/atlas exports, QC image validator, mobile runtime test.
- **BLOCKED:** approved hero sheet, Game Director appearance approval, HQ technical manifest/scale signoff, integration target branch.
- **Repo changes:** this preflight note only, on `cq/characters/7`. `main` untouched.

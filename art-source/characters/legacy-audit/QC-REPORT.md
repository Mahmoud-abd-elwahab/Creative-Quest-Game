# Character Sprite Pixel-QC Report — Legacy v0.4 (AUDIT ONLY)

**Task:** #7  
**Repository:** `Mahmoud-abd-elwahab/Creative-Quest-Game`  
**Source baseline:** `40c76c3aafe6b8bd3d2db0723587e7d02ec9dcc1`  
**Feature branch:** `cq/characters/7`  
**Asset:** `art-source/characters/legacy-audit/legacy-hero.png`  
**Canonical hero status:** NOT APPROVED; do not import as production Hero pack.

## Exact test method and source provenance

1. Retrieved `index.html` from baseline commit and extracted `SPRITE_HERO` data URI.
2. Created GitHub PNG blob directly from its Base64 bytes (Git blob SHA: `255ea45b465efd4fedd2fd7636bcea90220d14ad`, 5,508 PNG bytes).
3. Read PNG IHDR; decoded Base64 and IDAT zlib/DEFLATE in an isolated JavaScript pixel validator; reconstructed all 256 PNG scanlines with PNG filters 0, 1, 2 and 4; tested **every RGBA pixel** in the eight 192×256 cells.
4. Compared per-cell pixel hashes and non-zero-alpha bounds. These measurements are from the **source** bytes, not a scaled screenshot. The destination GitHub blob was written using the same extracted Base64. Browser page has an independent pixel scan for visual recheck.
5. Did NOT run production Phaser/Canvas replacement or a real Android render: no approved importer/scale. Did NOT run a new asset drawing/export validation.

## Machine checks

- PNG header: **1536×256**, 8-bit RGBA (color type 6), correct.
- DEFLATE: decoded **1,573,120 scanline bytes** = 256 × (1 filter byte + 1536 × 4 bytes), correct.
- Frame grid: **8 × 192 × 256**, fits exactly, no grid overrun.
- All 8 frames: contain visible pixels, have unique FNV-1a hashes; no duplicates.
- All frames: have fully transparent background outside the sprite; every non-zero-alpha pixel is fully opaque; partially transparent pixel count = **0** (appropriate to hard-edged pixel style).
- Frames 0–5 (mapped idle/walk): **0 opaque pixels on cell borders**.
- Frames 6–7 (not mapped by map `hero()`): **8 pixels each touch x=191 right boundary**; possible edge crop/insufficient safe margin. **Flag for art fix, not proof of an actual severed limb.**
- Visual bounding lower edge: all **y=235**; apparent base line stable across frames. This does not alone prove the true anatomy/pivot is stable in motion.
- Mean visible pixel x-position across the six mapped frames: 96.2–96.8; low global horizontal displacement, although limb posing still requires manual animation review.

## Per-frame image bounds

| Frame | Legacy runtime | Alpha bounding box (minX,minY,maxX,maxY) | Visible pixels | Border pixels | Hash (FNV-1a RGBA) |
|---:|---|---|---:|---:|---|
| 0 | Idle | 4,16,175,235 | 23040 | 0 | 5706aa45 |
| 1 | Idle | 4,12,175,235 | 23392 | 0 | 509df845 |
| 2 | Walk | 4,20,175,235 | 22912 | 0 | 2879c405 |
| 3 | Walk | 4,16,175,235 | 22816 | 0 | 0ca75bc5 |
| 4 | Walk | 4,20,175,235 | 21776 | 0 | 577b2b45 |
| 5 | Walk | 4,16,175,235 | 23104 | 0 | cfee8545 |
| 6 | Unmapped | 4,8,191,235 | 24496 | 8 | 9e7cd5e5 |
| 7 | Unmapped | 4,16,191,235 | 23776 | 8 | dd77ac45 |

## Sprite design / runtime assessment

**PASS (audited source only):** PNG binary decoded, RGBA data valid, non-empty uniquely drawn frames, consistent cells, mapped-frame transparent borders, stable sprite bottom bbox.  
**WARNING:** Frames 6–7 reach right edge; manual costume/silhouette judgement and foot-plant jitter test have not been done in target engine.  
**FAIL (production requirements):** Only one unique drawn facing direction; left/right is `ctx.scale(player.facing,1)` mirroring; no genuine up/down idles or walks, no approved source artwork or runtime SpriteManifest.  
**BLOCKED:** owner/Director's canonical hero and exact appearance signoff; HQ approved frame grid, pivots, hitbox, scale and animation interface; Android integration footage.

## Preview

Open `probe.html` via local static server. It displays the legacy 2 fps idle and 10 fps walk, 8-frame contact sheet, nearest-neighbor scale, alpha/bbox scan, and horizontal mirror. It does **not** simulate an approved four-direction 2D RPG pack.

## Release gate

**AUDIT PROBE ONLY / NOT MERGE-READY AS CANONICAL HERO.** The integration lead may review the extracted reference/inspection tool separately from production asset approval. Do not conflate this with a working new playable character.

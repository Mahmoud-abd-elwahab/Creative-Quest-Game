# Candidate Hero Reference — Readability / Production Feasibility

**Task:** #7 | **Status:** CONCEPT REFERENCE ONLY / NOT APPROVED FOR SPRITE PRODUCTION

## Source observed

A user-provided, working-context image titled `Teal-Clad Egyptian RPG Hero.png`. This is **not** treated as a signed canonical hero sheet. The original image itself is **not committed** to the public repository because it is a personal character reference and its public publication was not authorized.

- 1024 × 1536 RGBA full-body RPG illustration, one standing view.
- Teal clothing, warm-brown leather/armor and boots, red cape, gold edges; large expressive illustrated face.
- Composed at a slight three-quarter/front view; no dedicated back/left/right construction, no walking cycles, no attack or hit frames, no separated editable costume/limb layers.
- Alpha contains substantial soft transparency (0 to 254, no fully opaque 255 pixels); source needs edge cleanup/reconstruction to achieve crisp consistent alpha if HQ selects a pixel-art sprite style.
- Cutout has non-zero alpha close to bottom/right/top edges due to atmospheric/soft antialiasing; original PNG cannot simply be chopped into frame cells.

## Scale experiment (NOT a locked scale or frame size)

Original artwork resized for side-by-side reference at three **rendered on-screen actor heights**. This is visual assessment only, not export to a sprite cell:

| Test actor height | Width from 2:3 source ratio | Visual feasibility |
|---|---:|---|
| 64 display px | 43 px | Overall hero silhouette visible; detailed facial expression, gold trims and hands lose fidelity. |
| 96 display px | 64 px | Face/teal/brown/cape distinction improves; still requires handcrafted simplification for active animation. |
| 128 display px | 85 px | Character reads clearly but the larger actor may interfere with camera/world layout; needs HQ's world scale test. |

**Important:** `64×64` discussed in SHARED-CONTRACTS is a **sprite cell candidate**, NOT the same thing as an actor drawn 64 CSS px high. Do not confuse source image aspect ratio, atlas cell dimensions, and on-screen draw size. This review is not an argument for arbitrarily locking 96px.

A local non-public screenshot of this scale study was generated for the owner; it is not uploaded to this public repo.

## Decisions necessary before first real hero export

1. Game Director approves **this teal-clad candidate** (or designates a different one) as canonical hero appearance, including pose/face, clothing and accessories.
2. Game Director chooses sprite rendering approach: pixel-art simplification vs HD 2D illustrated sprites; simply resampling the illustration is **not** frame-consistent animation.
3. Game Director signs front/back/side turnaround and frame-wise garment/weapon continuity.
4. HQ/Engine signs dimensions, world-camera scale, anchor/pivot, hitbox and SpriteManifest v1.
5. After these gates: produce the smallest 4-direction idle/walk sample with real separate poses and source layers, then test in runtime/Android.

No guardian, Boss or production hero sprite art has been approved here.

# Legacy Hero Extraction — visual test, not canonical hero

**Issue:** #7 | **Branch:** cq/characters/7

- **legacy-hero.png**: exact 8×192×256 source strip extracted from \`SPRITE_HERO\` embedded in \`index.html\` (v0.4). This is not new commissioned character art.
- **probe.html**: open locally in a browser with a local static server (example: \`python -m http.server 8000\` at repo root, then \`http://localhost:8000/art-source/characters/legacy-audit/probe.html\`). Shows idle 2 fps, walk 10 fps, eight source frames, mirroring and live pixel alpha/bbox scan.
- **audit-manifest.json**: versioned **audit metadata only**; does not conform to an approved runtime SpriteManifest and must not be imported by Engine.
- No changes have been made to \`index.html\`, no fake four-direction walk, no Guardian animation.

## Review findings

Existing sprite is a compact pixel-art hero with dark-blue cap/tunic, red scarf and yellow accessory. A separate owner-supplied image available in the working context named \`Teal-Clad Egyptian RPG Hero.png\` is a **single illustrated front/three-quarter standing pose**, not an exportable animated turnaround. It has not been explicitly approved as canonical in this role chat; do not manufacture four views by cloning/rotating it.

## Verification protocol

Before visual signoff, open the probe and record decoded image, all frame bounding boxes, frame edge warnings and resulting animation. Confirm separately at actual target Android display size. Passing pixel geometry of this audit probe does NOT establish production approval.

## To produce first actual hero pack

1. Owner/Game Director signs character identity (especially the teal-clad illustration versus legacy pixel character).
2. HQ signs \`SpriteManifest v1\`, frame dimensions, padding, pivot, hitbox, target screen scale, fps, and engine atlas format; 64×64 remains merely a candidate.
3. Character Lead draws a one-hero 4-direction idle and walk *sample*, exports alpha PNG strips, source layers, manifest, QC sheet and short animated preview.
4. Engine integrates the sample; QA checks mobile runtime before declaring VERIFIED.

**Status:** existing prototype isolated for inspection; 4-direction production package remains BLOCKED by approval, not completed.

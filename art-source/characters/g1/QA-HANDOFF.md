# G1 Canonical Hero — Source Verification, Art Gate & Character QA Handoff

**GitHub Issue:** #60
**Character branch:** cq/characters/g1-canonical-hero
**Integration baseline:** ca2012f9bf1ddb1cefca310bfabca29691feb31e
**Integration PR:** draft / approval-gated
**Owner file scope:** art-source/characters/, public/assets/characters/, public/assets/guardians/ only.
**Final sprite verdict:** BLOCKED — do not import or sign off any production Hero atlas.

## Exact approved source actually accessed

Game Director's official `docs/creative/HERO-01-CANONICAL-LOCK.md` links the owner-designated hero in the personal Library. Its original file was accessed via the Library and materialized in the workspace, with independently measured:
- PNG dimensions **1024 × 1536**; image mode **RGBA**; SHA-256 **6511fc2434d49fa0fa6a4abc1a410a4369d26171d93660e22c933f0687dcb19f** (exactly matches the signed canonical source record).
- Secondary, **not-approved** concept turnaround PNG in Library: **1448 × 1086**, RGB; SHA-256 **ecf7285dc7d42b15127b546087f5c49608d7e4ad55c3105448d272036d7d052a**.
- The separate recently supplied image `Teal-Clad Egyptian RPG Hero.png` in this conversation has *different* binary SHA-256; it was not substituted for the canonical Library original. Do not infer visual similarity from filenames.
- **No private source PNG, turnaround poster, original face reference, or concept illustration is copied into this public GitHub repository.** Rights/public redistribution for the approved private source needs explicit signoff before public asset publication.

The canonical image has one illustrated body orientation and a dark ambient halo/background; an RGBA container alone does not prove a transparent, separated actor. It is NOT a sprite atlas. The poster has additional front, 3/4, side, back and walk/inspect illustrations, but Game Director explicitly flagged it for face, cape, armor, proportion and pouch correction. Cropping this poster into a fake multi-direction pack would fail the art gate.

## Anatomical identity map — same character at all facings

| Landmark | Down/front view | Left/right views | Up/back view | Reject when |
| --- | --- | --- | --- | --- |
| Curly hair, tapered sides, smile, distinctive rounded nose and thick brows | Exact recognizable face | Hair volume, ear, nose and jaw landmarks carry through | Same fade/hair volume, no generic hairstyle | Changing facial identity or skull size |
| Single LEFT leather shoulder pauldron | On viewer's RIGHT | Stays on anatomical left, not a mirrored duplicate | Same left-shoulder attachment | Both shoulders armored or left/right flips |
| Side pouch on RIGHT hip | On viewer's LEFT | Same anatomical right belt position | Same right hip, not teleported | Switching pouch side |
| Brown diagonal armor strap, squared buckle | Same strap line and hardware | Continuous physically anchored strap | Plausible back fastening | Flipped diagonal, missing clasp |
| Asymmetric maroon cape | Overlapping left shoulder / behind body according to original | Stable fastening / wind weight | Same cape construction | Cape swaps attachment shoulder or clips |
| Teal split tunic, cream sleeves and brass trim | Same split hem / gold lines | Same lengths / color areas | Same waist and garment logic | Generic cuirass replaces tunic |
| Boots and bracers | Same leather color, gold rivets | Boots planted with known contact | Same heel / leg proportions | Foot pivot wanders |

**Design hierarchy:** owner-approved original is higher authority than the generated concept poster, which is higher authority than the old pixel-art red-scarf character. No generic mirrored or AI-improvised directional images count as accepted production frames.

## Interface audit

Current `src/contracts/v1.ts` provides SpriteManifestV1 with `schemaVersion:1`, `characterId`, `sourceApproved`, `displayScale`, world-pixel `hitbox` and `animations[]` with `id/action/facing/file/frameWidth/frameHeight/frameCount/fps/pivot`. Facing is down, left, right, up; action set includes idle, walk, inspect, reason, reveal, hit. Pivot x/y must be normalized 0..1.

**NOT approved numerically:** frame size, strip/atlas padding, frames per action, fps, actor height at 360×740 in the actual Phaser camera, displayScale, hitbox rectangle, camera mapping and true foot pivot. `64×64` is explicitly NOT a locked cell. Do not publish a fictitious valid runtime manifest or set sourceApproved=true to make a schema test green.

## In-scope working deliverables

- `asset-qc.py`: a **production release gate** for future signed SpriteManifestV1 PNG strips. Verifies required idle/walk × 4 facing coverage, source approval, alpha image decoding and transparency, no image path escapes, exact strip dimensions, non-empty frames, bounds, normalized pivot and basic foot/bbox drift diagnostics. Warnings require human visual QC, not machine acceptance. Pillow authoring dependency (not runtime).
- `test-asset-qc.py`: synthetic files and manifests generated **only in OS temporary storage**, not shipped as a placeholder hero. Seven test cases validate pass and fail behavior.
- `scale-lab.html`: purely local-file browser canvas. Owner can choose the canonical private PNG and see it scaled inside **exact 360×740 and 1280×800 canvases** at a provisional 40–180 CSS-pixel actor height. It does not copy image bytes to the repository, upload to any service, or modify gameplay. A flat 96 CSS-pixel example was privately tested. No image isolation, pose replacement, animation or collision is inferred.

## Tests actually executed

| Test | Result | Evidence |
| --- | --- | --- |
| Canonical private source SHA-256 equals Director lock | PASS | SHA-256 shown above, 1024×1536 RGBA |
| Pixel art QC positive temporary eight-animation fixture | PASS | 24 32×40 synthetic cells decoded; 8 actions covered |
| Missing up-walk facing rejected | PASS | Negative unit case |
| sourceApproved=false rejected | PASS | Negative unit case |
| Manifest frame count not matching actual PNG width rejected | PASS | Negative unit case |
| Fully opaque frame background rejected | PASS | Negative unit case |
| Asset path escaping root rejected | PASS | Negative unit case |
| Pivot outside normalized 0..1 rejected | PASS | Negative unit case |
| Python source compile | PASS | py_compile |
| Scale-lab JavaScript syntax (Node 22) | PASS | node --check |
| Chromium local scale lab loaded canonical PNG; 360×740/1280×800 rendered | PASS | Linux Chromium via in-memory page.set_content; source file navigation through file:// was blocked by environment; two *local private conceptual* PNG screenshots captured |
| Eight actual production sprite strips PNG pixel-by-pixel | NOT RUN | Not delivered, art approval blocked |
| Real G1 Phaser game + Android touch/animation | NOT RUN | Engine importer, art signoff and independent QA pending |
| Full game npm/G1 build/CI | NOT RUN by Character branch | Not evidence of Character integration; Game QA has known failing acceptance gates |

Authoring commands:
`python art-source/characters/g1/test-asset-qc.py`
`python art-source/characters/g1/asset-qc.py public/assets/characters/<approved-manifest>.json --assets-root public/assets/characters --report art-source/characters/g1/<versioned-qc>.json`

The second command is intentionally NOT invoked until a genuine signed manifest and real exported strips exist.

## Cross-team findings read

- **HQ** latest notes on Character PR #21 and Issue #60 insist canonical teal hero, four true facings, no guessed cell scale, and no Engine edits.
- **Director PR #50** remains CHANGES REQUIRED: original character not in current graybox, source-inspection/route E01 not yet a compelling playable encounter; illustration approval ≠ sprite release.
- **QA PR #51** accepted testing evidence with production NO-GO. Independent browser regressions reported P1 PARTIAL path #46 and other UI/boot issues; new landscape #59 also unresolved at integration baseline.
- **Learning PR #49**: E01 limited structured staging accepted as prototype only; E02 Connect and E03 Arrange need revised cognition. A sprite pack cannot be treated as game learning acceptance.
- **Integration HEAD** ca2012f9bf1ddb1cefca310bfabca29691feb31e. `main` remains frozen legacy at 40c76c3aafe6b8bd3d2db0723587e7d02ec9dcc1.

## Precise blockers and next handoff

1. **Game Director** sign a corrected four-angle master based on canonical original, with anatomy landmarks overlaid and identical ground reference. Current concept multi-angle poster does NOT have this signoff.
2. **HQ/Engine** publish numeric animation and world scale contract, asset path convention, facing-order policy, fps and hitbox. No arbitrary 64×64 export.
3. **HQ/owner** clarify public-repository distribution rights for private source and production derivatives. Character Lead can author the derivative after that permission, not silently leak the source.
4. Character Lead can then produce corrected layered master, genuine idle/walk ×4 transparent strip proof, versioned SpriteManifestV1 and run the validator on **those actual files**.
5. Engine integrates; QA captures true desktop/Android 360px gameplay (not merely the standalone concept probe). Game Director signs visual identity. HQ alone accepts integration/release.

**Overall:** SOURCE + QA PREP DONE. ART / ANIMATION / SPRITEMANIFEST / GAMEPLAY INTEGRATION NOT DONE. Reason: unapproved corrected turnaround and numeric export geometry, not a technical build failure. Issue #60 stays OPEN.

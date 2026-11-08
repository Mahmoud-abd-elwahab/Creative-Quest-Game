# HERO-01 — Canonical Identity Lock & Sprite Production Brief

**Decision date:** 2026-11-08  
**Authority:** User designated the uploaded teal-clad fantasy character as the **main hero** ("دى الكاركتر الرئيسى كمل").  
**Status:** **CANONICAL HERO IDENTITY AND COSTUME LOCKED BY OWNER.** Generated turnaround is a **concept study requiring corrections**. **No production sprite atlas, animation, engine test or final technical approval exists.**  
**Repo scope:** Creative direction only, `docs/creative/`. Character production files belong to the Character/Sprite team; sprite/coordinate specs belong to HQ.

## Approved canonical source (highest visual priority)
**Personal Library (Game project context):**
- **Source file:** `/Creative-Quest-Game/Hero-References/hero-CANONICAL-user-approved.png`  
  `library_file_id: libfile_60b7ca657b7c8191811b681a96fb54a5`  
  `file_id: file_000000005a548210b258064a34004d69`
- **Noncanonical concept turnaround:** `/Creative-Quest-Game/Hero-References/hero-turnaround-CONCEPT-not-sprites.png`  
  `library_file_id: libfile_3a2b16fbce9c8191a6da958a10d4712a`  
  `file_id: file_00000000e380820a897e01be08e149ee`
- The Library sources are **NOT GitHub repository assets**. File access across separate chats must be verified using personal Library Files search with scope `library` or by attaching the source directly; do not invent `public/assets/...` paths, GitHub raw links or assume the art chats have read these files.
- **Original user upload metadata checked locally:** transparent RGBA PNG, 1024 × 1536 px, approx. 1.3 MB, original name `Teal-Clad Egyptian RPG Hero(1).png`; content SHA-256 `6511fc2434d49fa0fa6a4abc1a410a4369d26171d93660e22c933f0687dcb19f`.
- Original PNG is **single view / concept illustration**, not animation. The source image remains the higher-authority reference if the generated sheet differs.

## Character DNA — locked
**Face and silhouette**
- Male human fantasy adventurer with pronounced friendly caricature proportions; **do not stretch to generic realistic 7.5-head anatomy**.
- Short dark curly hair with tightly tapered/faded sides; same volume and hairline in front/side/back.
- Thick dark eyebrows, warm brown eyes, distinctive rounded nose/ears, broad smiling mouth; neat dark stubble along jaw/chin and moustache.
- Warm medium skin tone; face must remain recognizably the **same person** at every angle and in gameplay scale, not a generic fantasy boy.
- Friendly, confident and inquisitive. Default expression curious/approachable rather than aggressive or menacing.

**Costume — do not substitute**
- Deep teal tunic with narrow gold trim and split hem; cream long undersleeves.
- Brown segmented leather torso armor with diagonal leather strap and metal square buckle.
- Single prominent leather shoulder pauldron (hero's **left shoulder**, viewer right when facing camera), asymmetric maroon cape secured toward opposite shoulder.
- Brown waist belt, gold/brass hardware, substantial leather side pouch at hero's right hip (viewer left in front view), brown bracers with rivets.
- Dark brown pants and reinforced knee-/shin-height brown leather boots with cuff and gold/brass stud details.
- Warm maroon cape; cape direction and fastening logic must be consistent on back/side and idle/walk poses.
- This is a fantasy **research/exploration hero**. Keep costume functional; avoid unrequested sword, shield, gun, helmet, wings, superpowers or branding.

**Design behavior**
- Main discovery action: `Inspect` (look closely, lift evidence lens, point toward useful clue).
- Main reasoning action: `Reason` (compare two clues, brief thinking posture).
- Main breakthrough action: `Reveal` (clear illusion, activate trail, connect facts).
- `Attack` animation, if mechanically requested, must telegraph **evidence-based confrontation** rather than randomly punching enemies.
- Preserve original charismatic smile for idle/win; in attentive poses switch to focused but recognizable facial features.

## Generated sheet review
Generated concept sheet shows front, 3/4, side and back plus idle/walk/inspect. **Directionally useful, NOT final animation source.**

**REVISE before sprite extraction**
1. The proportion guide in the concept sheet claims “≈ 7.5 Heads Tall”, contradicted by its exaggerated cartoon body/head ratio. **Discard this annotation** and match the actual original silhouette in measured scale comparisons.
2. The front vs 3/4 and side poses have variations in armor silhouette, pouch, cape drape and facial shapes. Reconcile them against the approved original.
3. Check cape shoulder attachment and single pauldron from front / back / each side; accidental mirrored costume elements are rejected.
4. The action illustrations differ in pose/scale and include prop/background details; **they are not frame-by-frame animation sprites**.
5. The sheet title “GAME-READY EXAMPLES” is descriptive only and does not mean export/manifest validation or animation tests passed.

**Decision:** identity **APPROVE**, rough turnaround aesthetic **REVISE**, sprite/animation release **UNVERIFIED**.

## Handoff to Character & Sprite Lead
1. **First deliverable — corrected master turnaround**, transparent figures on a neutral comparison grid: exact **front / left / right / back**, optional 3/4 for art study. Match same facial identity, pauldron, straps, pouch, cape seams, tunic trim, boots and accessory locations from the original. Show identical height, common baseline and consistent center-of-feet pivot, no mirrored details. Include a small color/gear detail inset. This master sheet is the **production identity gate**.
2. **Second deliverable — small animation proof only**, after master approved: **idle and 4-direction walk**, plus a one-action `Inspect` test pose if supported. Keep matching anchor, frame bounds, shadows and silhouette. Do **not** generate an entire asset set yet.
3. **Technical contract requirement:** HQ must approve source image-to-world scale, frame cells, frame order, FPS, pivots, hitboxes and atlas/manifest structure first. The 64 × 64 concept in `SHARED-CONTRACTS` is not locked; preserving this hero's face may require a larger cell.
4. Export **editable source + transparent PNG(s) + manifest** in Character team's designated owned paths only, never `docs/creative/` as if that were runtime production art.
5. **QC evidence:** overlay front/left/right/back outlines at equal scale; compare boot/shoulder/cape/face alignment; inspect every frame for wandering proportions. Attach **genuine in-game captures** at 360px mobile and desktop when ready.
6. Avoid passing a single AI-generated poster as a verified sprite sheet. If a generated sequence cannot preserve landmarks across frames, correct it in a deliberate redraw/rig, not with more unverified outputs.

## Specific creative acceptance checklist
- [x] User has named the exact canonical image as the main hero.
- [x] Reference preserved in persistent Library with verified file reference and filename.
- [x] Secondary concept sheet preserved *separately* and marked noncanonical.
- [ ] Production-quality turnaround corrected and approved against original.
- [ ] Left/right/front/back animation proofs with identical landmark proportions.
- [ ] Animations exported, reviewed and working in-game at 360px and desktop.
- [ ] Collision/pivot/atlas/manifest verified by HQ and QA.
- [ ] Original outfit and hero facial identity visually match in gameplay.

## Contract / art coordination for HQ
- This is **not a framework decision** and does not change `PROJECT-BIBLE.md`, `SHARED-CONTRACTS.md` or runtime code.
- Confirm the art chat can access **exact Library file names** or attach canonical PNG directly in that chat. GitHub PR can carry text specs; it cannot magically transfer the binary without an explicit repository asset upload.
- HQ should resolve target camera and gameplay scale before the art team fixes animation cell dimensions.
- Owner already chose hero identity. **Do not re-ask who the hero is**. Only request signoff if the corrected technical turnaround materially deviates from the original.

# G0 — Cross-agent integration checkpoint (2026-11-08)

**Source of truth:** Mahmoud-abd-elwahab/Creative-Quest-Game.
**Frozen published baseline:** main@40c76c3aafe6b8bd3d2db0723587e7d02ec9dcc1 (old v0.4).
**Integration target:** cq/integration/vertical-slice. HQ candidate branch: cq/hq/g0-contracts.
**Release decision:** HOLD / NO-GO. GitHub Pages has successful deployment workflow on old baseline, not proven completed new gameplay.

## Specialist PR intake

| PR | Owner | Recorded stage | Integration limit |
|---|---|---|---|
| #11 | Game Director | W01 creative direction + canonical hero identity | Art and experience **for prototyping**, not complete assets |
| #20 | Learning | 100 legacy ID inventory; 9+3 learning slot manifest and rubrics | Draft; final slot/schema lock pending review |
| #25 | Challenge Generator | Private Creative Library read-only discovery, novelty and difficulty audit | No authored level JSON, no runtime generation |
| #18 | Engine | Independent Canvas/TS diagnostic, read-only legacy import, reported tests | Not Phaser/Vite implementation; no root integration |
| #19 | Boss | 3-phase state machine v2 design | No working Boss mechanics |
| #10 | World | Forest topology/layered graybox and validator | No approved tilemap or Android traversal |
| #21 | Characters | Legacy sprite strip extraction/QC | Not a four-direction sprite pack for canonical teal hero |
| #12 | UI | RTL responsive stand-alone dialog/HUD prototype | Not wired to Engine; no browser screenshots verified |
| #13 | QA | Static baseline, browser test files, P1/P2 defect reports | Browser suite not fully run on integrated build; current QA NO-GO |

All feature PRs must target the integration branch; none is evidence of deployed v1. Do not merge every draft PR at once.

## HQ G0 decisions / pending gates

1. **Architecture direction decided for POC:** ADR-0001 favors Phaser 3 + strict TypeScript + Vite with DOM overlay; old HTML remains production until parity/QA. Actual POC production architecture and package are not built yet.
2. **Contract proposal available:** src/contracts/v1.ts and challenge-spec.v1.schema.json define data, UI, Boss, world, sprite and safe save boundaries. Review/test before any freeze. The old docs/SHARED-CONTRACTS.md stays a design-stage reference until explicit replacement is approved.
3. **First vertical slice:** nine different Observation actions across the approved library/nursery/cinema/fitting-room/music/coffee/board games/gallery/coworking contexts, then crafts-fair Boss evidence/mirror/forge. Later INS/BRAND/CON are previews, not declared mastered.
4. **Privacy:** do not place private Creative Library materials or their identifiable provenance mapping into public game repo/artifacts. No paid AI grading for core gameplay.
5. **Art:** Game Director has locked teal-clad canonical hero identity; legacy strip is reference-only. Frame size and camera scale must be proved together; no 64x64 requirement.
6. **Progress:** deterministic actions can pass authored checks; open writing uses transparent rubric/self-review, and narrative completion is distinct from verified learning mastery.

## QA blockers (tracked Issues)

**P1:** #14 Space intercept in text editor; #15 service worker's global cache deletion; #16 Boss learning-rubric bypass; #17 keyboard dialog focus.
**P2:** #22 diagnostic route differs from actual first level; #23 first-nine repetition; #24 disabled mobile zoom/small touch/reduced-motion gaps.

These are source-audited defects and risks, not all independently reproduced in actual Android browser. Fix in bounded owner PRs with independent QA regression; do not dismiss based on improved design documents.

## Next executable role handoffs (post-contract review)

- Engine #6: independently consume typed G0 event/map/save contracts; propose Phaser/Vite root bootstrap to HQ, then implement one keyboard/touch → inspect → structured check → feedback → receipt/save/reload loop. No v0.4 overwrite.
- Learning #3 + Content #8: agree W01 slot/rubric final mapping, author only first 9 varied challenges + Boss packet against approved schema; compute IDs, rubric totals and semantic anti-repetition against 100 legacy nodes.
- Boss #2: implement stage guards for evidence/mirror/forge; do not use self-report as independently verified learning; QA Issue #16 needs direct regression coverage.
- UI #1: consume UIBridge ack and authoritative events; implement focus management, text-safe keyboard, save failure and accessible Boss states.
- World #4: transform draft graybox to approved dimensioned map after Engine map/collision contract and Character frame/scale handoff.
- Characters #7: corrected canonical hero turnaround from user-approved reference, then 4-facing idle/walk strips with a frame/pivot manifest. Old sprite is not approved new hero.
- QA #5: run tests against merged staging, capture failures and evidence on exact SHA, request CI in HQ paths. Provide real Android and desktop smoke. Never mark skipped browser tests as passed.
- HQ: review comments on this G0 PR, institute branch protection, create scoped CI, accept staged PRs in dependency order, perform rollback check and release only after QA.

## Technical no-merge rules

1. No main push. Every specialist PR must target cq/integration/vertical-slice; HQ alone merges.
2. Design packets can be integrated only after owner scope and cross-role review; they remain labeled design/proposal rather than feature complete.
3. Runtime code cannot merge without reproducible typecheck, tests, schema checks, asset compliance, actual browser and mobile regression (or explicit accepted staged limitations).
4. Main release requires G1–G4 criteria in Project Bible. QA's current release call is NO-GO, so main deployment remains baseline.

**Current status:** first-round audits submitted; HQ G0 contract proposal started, PR review and production engineering follow.
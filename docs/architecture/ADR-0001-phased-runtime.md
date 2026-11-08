# ADR-0001 — Phased runtime modernization

**Status:** HQ ACCEPTED FOR ISOLATED POC / NOT APPROVED FOR PRODUCTION CUTOVER
**Date:** 2026-11-08
**Owner:** HQ Technical Producer
**Baseline:** main@40c76c3aafe6b8bd3d2db0723587e7d02ec9dcc1
**Related:** #9 #26; Engine #18; Learning #20; Game Director #11; QA #13.

## Decision

Adopt **Phaser 3 + strict TypeScript + Vite** as the target 2D engine and static-site build, with **native HTML/CSS DOM** for Arabic/English dialogs, forms, accessibility and responsive HUD. This is a bounded engineering decision to build one testable slice, not evidence that Phaser/Vite are installed or the game has been migrated.

**Keep the published v0.4 single-file Canvas app intact.** Develop the replacement side-by-side under independently owned paths, then test functionality before any entry-point switch. Preserve the legacy code and a rollback commit/tag; no agent overwrites root index.html or main independently. Existing standalone Engine #18 Canvas proof is a diagnostic spike, not the selected production stack.

## Why this choice

- Current root index.html is a monolithic v0.4 app with inline gameplay, UI, assets and save coupling. Expanding it across nine agents creates unreviewable ownership conflicts.
- Phaser supports camera, sprite animation, collision, layers, scene transitions and keyboard/touch for a world-based 2D RPG. Strict TS narrows integration drift, Vite enables build/test and GitHub Pages deployment.
- DOM overlay is more suitable than canvas-only text for long RTL copy, keyboard focus, responsive controls and rubric feedback.
- An independent runtime entry preserves old levels and local save while we measure parity. A one-step rewrite is explicitly rejected.

## Architecture boundaries

- Engine: src/core/, src/game/, src/adapters/ (scene, input, asset load, save, camera, collision).
- Contracts / entry / CI: HQ owns src/contracts/, root config, docs/architecture/, docs/integration/, .github/workflows/.
- Learning: docs/learning/, src/education/; content: src/content/levels/ and src/content/reports/.
- Boss: src/gameplay/bosses/; World: src/maps/, public/assets/worlds/; Characters: public/assets/characters/, public/assets/guardians/, art-source/characters/.
- UI: src/ui/, public/assets/ui/; QA: tests/, qa/.
- Engine is single source of truth for XP, progression and Boss state; UI emits commands and renders authoritative snapshots/acknowledgments.
- All published authored content MUST be self-contained public fictional practice material; no runtime private Creative Library access or confidential source-to-challenge map.

## Coordinate, image and input policy (first integration contract)

- 2D world coordinates in **world pixels**, origin top-left, x right and y down; actor position uses center of feet. Visual 3/4 camera perspective is art direction, not unapproved isometric physics.
- Map dimensions, tile pixel size, hero frame cell size, display scale, camera viewport and collision footprints are **not numerically locked** until Engine + World + Character test one actual render. 64x64 is only a prior candidate.
- Collision shapes are world-space rectangles/polygons; their owners must correspond to visible art footprints. Foreground depth sort/mask cannot hide required interactions.
- DOM overlays must wait for pause acknowledgment before taking focus; return focus to trigger and wait for resume acknowledgment. Arrow/Space game shortcuts cannot intercept text fields, focused buttons or contenteditable.
- First target: 360px mobile width and desktop keyboard; reduced-motion, landscape fallback, pointer joystick, gamepad optional later. No paid API needed.

## GitHub Pages and offline safety

- Production lives under /Creative-Quest-Game/; configure Vite base accordingly, and resolve assets relative to that base (never assume domain root).
- Existing Pages job deploys main only. Feature PRs and integration tests must not deploy main.
- A new service worker must delete **only game-prefixed** Cache Storage keys, never all same-origin caches. Scope registration/cache keys to this repository path. QA issue #15 is an existing P1 source risk.
- Old localStorage key creative-quest-2d-v02 must remain byte-for-byte unchanged; new schema uses a distinct versioned key and can recover if corrupt. Do not delete old game during rollout.

## Proof required before production cutover

1. Architecture/typed contracts reviewed by Engine, Learning, Content, Boss, UI, World, Characters and QA.
2. Strict TS typecheck, pinned reproducible build and schema/unique-ID validation (authored JSON). No test skip counted as PASS.
3. Legacy save migration fixtures, rejected corrupt payloads, no duplicate XP, pause/retry/idempotent Boss, old-level mapping and rollback proof.
4. One world: move (keyboard/touch) → physically inspect → one of nine varied cognitive tasks → reasoned feedback → changed environment → save/reload → 3-phase Boss → unlock.
5. Manual desktop and real Android test with screenshots/logs; confirmed Pages subpath, assets, offline behavior and focus. Game Director approves visual fidelity, hero identity and experience.
6. Independent QA signoff. Only then HQ can approve switching root entry/deployment, with old baseline preserved for rollback.

## Decisions left deliberately open

- First approved map world dimensions, asset loader/file optimization and hero manifest scale/fps/pivot after live engine proof.
- Exact XP rewards, Boss difficulty tuning and progress UX after Learning + Game Director review.
- Final replacement of monolith, package lock and branch protection in separate HQ-owned PRs. Current main is unprotected; require PR-only change policy immediately, enforce rules through GitHub Settings/API when available.
- Phaser/Vite runtime performance, bundle size and midrange Android suitability are **unverified** until implemented and measured.

This ADR approves a **direction and bounded spike**, not G4 release or any user-visible implementation.
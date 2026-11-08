# CREATIVE QUEST — SHARED CONTRACTS v1.0
**Design-stage proposal**; engineering lead must validate through a working vertical slice before locking coordinates and final code architecture.

## Single source of truth
- Repo: `Mahmoud-abd-elwahab/Creative-Quest-Game`
- Game location: `./`
- Branch `main`: stable, published; READ-ONLY for feature agents.
- Feature branches: `cq/engine-modules`, `cq/curriculum`, `cq/level-content`, `cq/hero-art`, `cq/world-art`, `cq/interface`, `cq/boss-system`, `cq/qa`.
- Only the Integrator chat owns release integration, main changes, version tags and rollback.
- Do not give different agents ownership of the same path. Changes to shared interfaces require Integrator approval BEFORE edits.
- Before work: read PROJECT-BIBLE.md, AGENT-ROLES.md, this file, GitHub HEAD, and the status/issue assigned. Report real baseline commit SHA.
- Each agent reports: Branch; changed file paths; assumptions; tests attempted and results; screenshot or evidence; blockers; next step. No claim of completion without evidence.
- Prefer one PR per task. If a chat cannot create PRs, submit a branch / patch and explicit commit details; never patch main as a workaround.

## Language and runtime — proposed
- TypeScript (strict mode), Phaser 3, Vite (engine); HTML5/CSS for responsive UI. Avoid framework sprawl.
- Game data: UTF-8 JSON + TypeScript types / schema validation. UI copy: Egyptian Arabic, preserve technical English.
- Game and save state data must not depend on presentation strings (e.g., key by stable IDs, not Arabic titles).
- No additional paid external API dependencies for the main gameplay. Optional ChatGPT bridge must be manual and clearly labeled as such.
- Do not migrate the monolithic v0.4 HTML in one unreviewed replacement. Make backup + compatibility test first.

## Proposed paths / ownership
`src/core/` Engine chat (state, scene orchestration, movement, collision, asset loader, save migrations)
`src/education/` Curriculum chat (skills, pedagogy, rubrics, progression policy)
`src/content/levels/` Level Content chat (JSON scenarios and responses)
`src/gameplay/bosses/` Boss Mechanics chat (multi-phase combat mechanics; consumes generic challenge interface)
`src/ui/`, `public/assets/ui/` UI/UX chat
`public/assets/characters/`, `public/assets/guardians/`, `public/assets/characters/manifest.json` Character Art chat
`public/assets/worlds/`, `src/maps/` World Art chat
`tests/`, `qa/` QA chat
`docs/`, `releases/`, `ci/` Integrator chat (may delegate tests but owns governance)
No one edits other people's owned folders without a coordinated change request.

## Interfaces (proposed)
LevelSpec:
```ts
type SkillId = 'observation'|'audience'|'tension'|'insight'|'brand-role'|'territory'|'concept'|'mechanism'|'direction'|'campaign';
type ChallengeKind = 'select'|'evidence'|'classify'|'pair'|'free-text'|'repair'|'forge'|'interactive';
type LevelSpec = {
 id: string; worldId: string; order: number; primarySkill: SkillId;
 kind: ChallengeKind; scenarioId: string; objective: string;
 prompt: string; evidence: string[]; options?: {id:string;text:string}[];
 rubric: {criterionId:string;description:string;weight:number}[];
 feedback: {onWeakReasoning:string;onSuccess:string}; 
 difficulty: 1|2|3|4|5;
};
```
The schema is a starting proposal, not the final full interface. No hardcoded game logic in level JSON. Don't accept text fields as code, and validate content in CI.

WorldSpec:` id / skill focus / distinct art palette / map or tilemap asset path / portals / level-node positions / spawn / soundtrack reference / Boss ID `.
SpriteManifest: `characterId / animations[id, file, frameWidth, frameHeight, frames, fps, direction, pivot] / scale / hitbox`.

## Sprite / art export standards — candidate, subject to reference-character approval
- Use actual separate PNG sprite sheets with transparent background and editable original / layer export, not one complex concept image or a "sprite sheet" with inconsistent cell sizes.
- Candidate hero grid: 64×64 pixel cell; down,left,right,up row order; six walk frames each; 4–8 idle frames and attack/hit variants. Export each animation in its own strip or grid and supply machine-readable manifest.
- Character face, outfit, scale, lighting and key costume items must be consistent from every animation angle. No character cropping or limb jump between frames.
- World art should be layered: `background`, `ground`, `props`, `foreground`, `collision`, `interactions`. Collision cannot be guessed from a flat background illustration.
- Distinct worlds need different topography/layouts and encounter patterns, NOT just recolors.
- Only approved reference style and user-provided character sheets determine final sprite appearance. No unapproved changes to identity/look.

## User-visible progression
- XP, level unlock, Boss completion, skill badges must be deterministic and explainable.
- Existing v0.4 local save data must be backed up and migration tested; any changes to storage key/location require explicit migration.
- User cannot be promised secure automatic ChatGPT-based grading/progression from a normal URL; ChatGPT answer and game origin do not share trusted state. For offline/free mode, deterministic correction + open-text rubric/self-check is honest; for automatic trusted grading, a connector or API-backed service is a separate future engineering task.

## Checkpoints
1. Build and type check.
2. Content schema / unique-ID validation (no duplicate IDs, scenarios, primary-skill mismatch).
3. Touch controls and scale checks: at least Android portrait + desktop keyboard.
4. Animation manifest check: frame sizes match PNG dimensions; pivots and hit boxes tested.
5. Save compatibility and reload tests.
6. Accessible RTL UI (tap targets, text clipping, readable fonts, reduced motion where possible).
7. Boss phases tested for failure, retries, hints, fair scoring.
8. GitHub Pages availability / assets / manifest / service worker cache actually verified.
Not all listed tests exist today. QA chat must create and record them incrementally; never claim "zero bugs."

## Issue and handoff template
```
Task ID:
Role:
Baseline commit SHA:
Files allowed to change:
Inputs / refs:
Deliverables:
Acceptance criteria:
Tests performed (pass/fail/not run):
Screenshots / links:
Assumptions & blockers:
Branch / PR / commit:
```

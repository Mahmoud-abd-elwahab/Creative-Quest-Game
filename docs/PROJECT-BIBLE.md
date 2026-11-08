# CREATIVE QUEST — PROJECT BIBLE v1.0
Status: PRE-PRODUCTION / TEAM ALIGNMENT. This document defines the TARGET, not a claim that features are implemented.

## Owner-approved personal learning north star (2026-11-08)

**Product priority supersedes any implied commercial-scale RPG requirement in this Bible.** Creative Quest is a **single-player personal tool to improve Creative Thinking and Advertising through entertaining questions and challenges**, not a game intended for sale or monetization. The RPG wrapper prevents boredom, supports repeated practice, and makes progress rewarding.

**Working effort guideline: ~70% learning design, assessment, transferable thinking practice and actionable WHY-feedback; ~30% meaningful gameplay, hero/world identity, compact Boss challenges and visual reward.** These are priorities, not measured elapsed effort. Keep approved hero/world references and QA infrastructure; **do not** expand big maps, expensive animations or 500 items before proving a useful short-session learning loop.

**First personal release focus:** 15–20 minute sessions of 3–5 varied challenges, honest criteria-based feedback, reliable saved progress and visible RPG motivation. **Near-term training bank: 30 high-quality distinct challenges validated first in batches of 5–10**, not generated in bulk. Improvement on **unseen briefs from different sectors** is the outcome; XP and level count only indicate engagement.

Read the product-priority addendum: [Personal Creative Training RPG direction](PRODUCT-DIRECTION-PERSONAL-LEARNING.md). It changes **scope/sequence**, not existing G0/G1 API contracts or the owner's canonical hero identity; QA blockers and release NO-GO remain.


## Vision — الرؤية
An actual 2D Creative Thinking Adventure RPG, not a quiz with game-themed cards. The player moves through distinct interactive worlds, meets characters, collects clues, fights conceptual Bosses, and learns to reason through real creative advertising problems.

**Learning goal:** Build practical thinking skills: observe evidence → understand people → locate tension → explain insight → assign brand role → articulate proposition → open territories → invent concepts → apply creative mechanisms → direct and evaluate visuals → build campaigns.
**Style:** Egyptian Arabic for teaching, English agency terms retained; visually explanatory, precise feedback, not condescending. The player should understand WHY an answer is stronger.
**Platform:** Mobile-first web PWA, playable via same GitHub Pages path. Offline support where practical, no subscription required for basic play. AI review is OPTIONAL; without API, ChatGPT cannot automatically and securely update game progress.

## Current reality (verified in GitHub on Nov 8 2026)
Repository: Mahmoud-abd-elwahab/Creative-Quest-Game; source at `./`.
v0.4 is deployed from an approximately 164k-character monolithic HTML file. README claims 100 levels, ten worlds, sprites and multiple challenge formats. Preserve it as baseline and **do not claim polished production game exists yet**.
No destructive rewrite of existing progress or the separate portfolio.
First engineering task: modularize safely behind tests, with staged migration and rollback.

## Reference
User's illustrated RPG concept: expansive fantasy world map, clear animated hero, distinct landscape biomes, interactive bosses, skill tree, coherent fantasy-game UI. This is a VISUAL TARGET, not evidence of implemented functionality. Avoid blindly slicing a concept illustration into game assets. Make editable source + properly exported frame assets. The owner will supply character sheets / reference images to the assigned art chats.

## Hard priorities
1. Learning outcome: every challenge exercises a meaningful creative-thinking behavior. No repetition masquerading as novelty.
2. Playability: character navigation, spatial discovery, choices, emotional feedback, intentional boss mechanics.
3. Art direction: consistent approved sprite style, scale, camera, color/value, world readability, animation fidelity.
4. Engineering reliability: separate components, typed contracts, regression tests, save migration, mobile performance.
5. Release honesty: differentiate designed, prototyped, tested, published.

## Learning design
Each level has one primary learning outcome plus optional recall of prior skills. Skills vary: observe, classify, select evidence, infer responsibly, articulate, compare alternatives, repair a flawed idea, ideate divergently, defend a concept, translate abstract meaning visually, combine insights into campaigns.
Each authored scenario must include: industry / audience / real-world situation / facts available / objective / expected cognition / rubrics / feedback for plausible wrong reasoning / links to other skills.
Don't declare human psychological explanations universally true without evidence. In the learning game, hypothetical data and legitimate interpretations are acceptable if explicitly distinguished.
Avoid repeating Samsung upgrade, IKEA small apartments, running beginners, English speaking anxiety, and food delivery selection as the default bank; introduce fresh industries, people, formats, emotional dynamics and business objectives.
No fixed phrase is the only acceptable creative answer. Deterministic evaluation only for suitable structured questions; free-text via criteria-based feedback and user confirmation, or optional ChatGPT discussion. Never simulate a universally semantic AI grader.

## 500-level aspiration (DRAFT; not a current claim)
Worlds/modules can be revisited to promote retention rather than isolating each term forever. Suggested emphasis:
- 1–50 Observation & Evidence
- 51–100 Audience, Desire, Barrier, Context, Consequence
- 101–150 Tension & Behavioral Conflict
- 151–200 Human Insight & Interpretation
- 201–250 Brand Role, RTB, Proposition
- 251–300 Creative Territories / Worlds & Exploration
- 301–350 Concepts, Big Ideas & Campaign Platforms
- 351–400 Creative Mechanisms & Visual Thinking
- 401–450 Creative Direction & Art Direction
- 451–500 Campaign Building, Critique & Creative Direction Leadership
These are proposed curricula, not code-level renumbering. Preserve v0.4 existing level IDs and saved progress until migration is approved and tested.
Each realm should contain multiple types of tasks and a Boss that uses integrated knowledge.

## Gameplay loop
Explore → discover clue/character/brief → make observation or choice → receive explanation / coaching → unlock mechanism/reward → reflect → tackle Boss with applied reasoning → earn progression/skill.
Boss requires multiple meaningful phases (e.g., break cliché, justify tension, build distinct territory, choose suitable visual mechanism) with interactive presentation. No fake combat where correct/incorrect merely subtracts HP without intellectual feedback.
Make a polished VERTICAL SLICE of one complete world with ~10 varied levels and one 3-stage Boss BEFORE a large content expansion.

## Design language — DRAFT
Target engine: Phaser 3 + TypeScript + Vite for 2D runtime; HTML/CSS for responsive accessible HUD and forms, authored RTL. Static data with typed validation. This is a recommended modernization path, not implemented or approved yet. Keep current working build available until verified parity.
Game coordinate system, frame dimensions, grid and camera constraints must be approved in SHARED-CONTRACTS before asset production.
Performance target: playable on midrange Android in portrait, stable touch controls, readable Arabic text, reduced-motion option, accessibility contrast and sensible tap areas.

## Governance / approval gates
G0: this Bible, module boundaries and visual direction approved by owner.
G1: one end-to-end movement/interaction/challenge/save loop works on mobile.
G2: art and UI fit one complete realm; gameplay and pedagogy tested.
G3: Boss battle is interactive and purposeful.
G4: documented release checks passed, versioned build on GitHub Pages verified.
Only the primary integrator merges to main. Every agent submits one bounded change set with path list, tests and evidence. No chat-to-chat automatic communication is assumed.

## Migration provenance
This repository was migrated from `Mahmoud-abd-elwahab/portfolio/creative-quest-2d/` on Nov 8, 2026. The old folder remains intact until its replacement site and save behavior are verified. The original v0.4 app code is copied to the new repository root; do not reset progress.

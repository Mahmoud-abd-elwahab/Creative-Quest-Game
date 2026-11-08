# OWNER-APPROVED PRODUCT DIRECTION — PERSONAL CREATIVE TRAINING RPG

**Owner decision:** 2026-11-08. **Status:** approved product direction for planning and prioritization; **NOT** a technical, creative-art or production-release signoff.

## Purpose / why this game exists

Creative Quest is a **private, single-player creative-thinking training tool for its owner**, packaged as a playful 2D RPG so learning does not become repetitive or boring. It is **not** designed to earn money, win the commercial games market, or require enterprise-grade operational machinery.

**North star:** after repeated short sessions, the learner becomes measurably better at solving unfamiliar creative advertising problems—from observation and evidence to insights, concepts, creative mechanisms, static key visuals and campaign direction.

RPG elements are **motivators and teaching affordances**, not independent delivery targets. Retain the owner-approved hero, fantasy identity, meaningful spaces, skill levels, and practical Boss briefs. Do not add maps, combat systems or animation effort that displaces better challenges and feedback.

## Decision priorities: 70% learning / 30% play presentation

These percentages are **product effort guidelines**, not measured historical hours or a guarantee for each sprint.

### Learning (approx. 70%)
- **Challenge quality and variety:** evidence inspection, compare alternatives, correct a weak strategy, reconstruct a flawed idea, create and defend concepts, and apply visual/art direction constraints. Never count a palette/UI swap as a new learning action.
- **Feedback that teaches WHY:** distinguish observed facts, interpretations and speculation; show better reasoning, rubrics, alternative defensible answers and contextual examples in Egyptian Arabic with familiar agency terms.
- **Honest assessment:** deterministic automatic grading **only** for well-structured selections/matches/orders; open-ended creative responses use transparent self-review, rubric-based reflection or optional external discussion. No pretend AI judge, no awarding verified mastery from unsupported free text.
- **Progress & transfer:** replay a skill under a **different industry, audience and creative brief**; compare baseline and later attempts using the same rubric. XP/completion is engagement data, not proof that thinking skills improved.
- **Adaptive difficulty (incremental, not fictional):** begin with tiered hints and re-practice on observed failure; build an adaptive engine only after real user sessions show it adds value.

### Gamified presentation (approx. 30%)
- Keep a coherent playable hero, compact explorative world(s), satisfying response feedback, XP/progression, skill gates and short Boss challenges.
- Visuals and movement must support the exercise, not block easy access to a 15–20 minute learning session.
- Use **one small, distinctive, reusable world shell** before building many fully animated biomes.
- Boss = a substantial **creative brief / combined-skill challenge**, not expensive generic combat. Boss can be visually dramatic but must evaluate the reasoning steps.
- No subscriptions, monetization, account infrastructure, multiplayer, paid API or 500-level bulk authoring as prerequisites.

## Target daily session (15–20 minutes)

1. **Start / choose skill** (under 1 minute): resume next question or review a weakness.
2. **Practice 3–5 varied challenges** (roughly 12–15 minutes): each has brief/context, actionable thinking response, meaningful feedback and optional hint/retry.
3. **Reflect & transfer** (2–3 minutes): explain one decision; optionally try the same skill on a new scenario. Store a simple skill note and next suggested practice.
4. **Progression:** XP, unlocks and visual reward encourage return; they are separated from skill mastery claims.

Session length/quantity are desired UX targets to be **tested**, not a strict timer or forced daily quota.

## Near-term outcome: 30 high-quality challenges, validated in batches

**Goal:** a useful personal training pack of 30 **distinct** scenarios, gradually covering Observation → Audience/Tension/Insight → Territory/Concept → Mechanism/Art Direction/Creative Brief.

**Execution order** (avoid mass content without a working assessment):
- **First:** fix mandatory G1 defects #46/#47 and independent QA gate; make a fast, accessible practice session.
- **Then:** human-review and actually playtest an initial **5–10 varied challenges** with useful feedback, including one creative mini-brief and a compact Boss-as-synthesis checkpoint. No need for final large world art beforehand.
- **Next:** expand in reviewable batches to **30** only after feedback and learning-transfer checks show the first sample works. Use existing 100 v0.4 levels as a candidate source of ideas, **not** 100 verified new RPG levels.
- **Later/optional:** world expansion, additional Boss cinematics, extensive hero animation, hundreds of levels, advanced AI evaluation only when they demonstrably improve personal learning/motivation.

## Definition of success / acceptance

**Primary outcome:** the player improves on **new, unseen advertising briefs**, not just repeating known correct answers.

For each practiced skill, record an initial baseline, then a later challenge in a different brand/sector. Compare: evidence quality, causal clarity, relevance to audience/product, originality, quality of alternatives and ability to explain WHY. Each comparison uses the same, explicit rubric; don't convert 1–2 practice attempts into scientific learning claims.

**Proxy metrics** (secondary): finish a short session without frustration, meaningful hint usage, retries that lead to better thinking, voluntary return, and variety across challenge types. XP and time played alone never equal improvement.

An acceptable first personal release:
- 15–20 minute accessible session; 3–5 usable exercises across different thinking actions;
- clear Egyptian-Arabic feedback, retry/hint and reliable saved progress, with no fake free-text auto-scoring;
- compact RPG wrapper with a coherent hero; one genuinely instructional Boss-style brief or milestone;
- mobile/browser testing appropriate for intended owner devices, protected original v0.4 saves;
- independently reviewed learning content; no unresolved critical QA blocker.

## Explicit scope decisions

**KEEP:** Phaser 3/TS staged build, existing QA and save infrastructure, approved hero identity, existing design/learning assets, user-owned private Creative Library as read-only research reference.

**REDUCE/DEFER:** ten highly finished worlds, all-direction sprite polish before useful practice, costly Boss combat systems, 500-level target, excessive approval choreography or redundant reports. Existing World/Characters/Boss PRs are **not cancelled automatically**: evaluate them against this new learning-first gate, preserve work already done.

**TEAM OPERATING RULE:** For each new issue or sprint, first state which skill it teaches and how the player will practice/receive feedback. Estimate whether it improves short-session learning; if not, classify as cosmetic or deferred. Keep team ownership and GitHub QA safeguards, but avoid creating governance artifacts unrelated to tested gameplay.

## Implementation and release guardrails

This document updates **product priority** only. It does **not** alter `src/contracts/`, game code, current staged PR ownership, protected canonical hero, published `main` or QA signoff. G1 technical E01 is still a provisional proof, not a complete 30-challenge personal product. **Do not claim release success until the actual training loop is played and independently tested.**

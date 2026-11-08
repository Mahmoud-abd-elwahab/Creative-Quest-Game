# Legacy v0.4 — 100-Level Learning Audit (v1.0-draft)
Status: learning review for HQ; NOT a migration or content rewrite.
Issue: #3 | Baseline: 40c76c3aafe6b8bd3d2db0723587e7d02ec9dcc1 | 2026-11-08.

## Source and method
Read the complete index.html source and first-party README, PROJECT-BIBLE, AGENT-ROLES and SHARED-CONTRACTS. Enumerated all defined encounter entries and Boss entries; inspected normal-play routing and scoring code; sampled individual prompts from every content family. This is a structural census of 100 entries and a targeted semantic audit, NOT a complete human answer-trial on all 100. No production gameplay or mobile QA is claimed.

## Census — exactly 100 authored/prototype nodes
| World | IDs | Normal encounters | Boss | Conceptual focus |
|---|---|---:|---|---|
| 1 | 1–10 | 9 | 10 | Observation |
| 2 | 11–20 | 9 | 20 | Audience / Tension |
| 3 | 21–30 | 9 | 30 | Insight |
| 4 | 31–40 | 9 | 40 | Advanced Observation |
| 5 | 41–50 | 9 | 50 | Advanced Tension |
| 6 | 51–60 | 9 | 60 | Advanced Insight |
| 7 | 61–70 | 9 | 70 | Territories |
| 8 | 71–80 | 9 | 80 | Concepts |
| 9 | 81–90 | 9 | 90 | Mechanisms |
| 10 | 91–100 | 9 | 100 | Art Direction and Campaign |
Total: 90 encounters + 10 Bosses. Level families: 9 initial LEVELS, 18 EXTRA_LEVELS, 63 CAMPAIGN_LEVELS. For the 90 encounter definitions, authored format counts are: 27 write, 20 select, 11 pair, 9 evidence, 9 classify, 7 repair, 7 forge. These are declaration counts, not proof of player-visible variety.

## Confirmed blockers and duplicate mechanisms
**P0 — World-1 variety is inaccessible in normal play.** The interact() branch for n<10 calls challenge(n-1), which uses the original nine LEVELS and the check() keyword heuristic. Four OBS_VARIANTS at IDs 1/3/5/7 have select/evidence/classify/pair behavior but are only used by CreativeQuestDiagnostics.openLevel(), not the normal path. Accordingly, all **nine** normal World-1 missions require the same cognitive output: write a common Observation from quotes. Five superficially different original settings do not produce a new mental operation; all nine are effectively the same task family. **Owner: Engine; we only issue a routing acceptance requirement.**

**P0 — unsupported interpretation can pass, valid observation can fail.** check() requires three substring groups, minimum length and no small list of banned explanation phrases. Source-accurate local replication with level-1 keyword groups:
- Valid: “في المكتبة فيه ناس بتاخد كتب وترجعها قبل ما تخلص القراية” → false negative (missing group 2), despite a directly observed action.
- Valid: “بعض رواد المكتبة بيستعيروا كتب وبيرجعوها قبل ما يخلصوها” → false negative (form بيستعيروا not matched).
- Invalid: “كل اللي بيبدأوا كتب وبيرجعوها قبل ما يخلصوها أغبياء” → automatic pass, despite unsupported universal claim and judgment.
Thus lexicon success is a technical signal only, never trusted creative/semantic mastery.

**P1 — rigid nine-position recipe repeats across 6 worlds.** Worlds 5–10 use exactly select → pair → write → classify → evidence → repair → forge → select → write; World 4 is select → evidence → classify → write → repair → pair → forge → select → write. Format diversity exists, but the predictable pattern of cognitive moves is not evidence of progressively harder work. All 14 select keys across Worlds 4–10 use index 0 or 1 (8 at index 1, 6 at index 0; none at index 2). This is a testable answer-position bias, not evidence the concepts were learned. Correct choices and prompt difficulty must be audited, not just item names.

**P1 — mastery and XP are conflated.** For normal free-text levels, a checkbox self-review after minimum characters unlocks as manual pass. Boss phase 3 can be manually marked completed without independent verification. This can be appropriate for open exploration but must be recorded as SELF_REVIEWED_UNVERIFIED, not validated competence. Bonus/XP must not imply mastery.

**P1 — missing transitions.** Current nominal world order skips explicit Product Truth / RTB and Proposition as first-class prerequisite skills before Territories; Strategy context is embedded late in some prompts. After Observation and Insight, new brand claims can feel arbitrary. No recorded cross-world retrieval history, error taxonomy, adaptive revisit, or calibrated reasons for level difficulty is present in the single-file implementation.

**P1 — formative feedback too generic.** Wrong structured answers often receive a generic “fact vs assumption” response even when the conceptual error is territory/concept or product role. Single correct keys on some questions risk rejecting other defensible readings unless evidence constraints and alternatives are reviewed.

**P2 — scenario/topic collisions (review, not automatic duplicates).** Books/reading recur in levels 1, 51, 78 and other cases; music appears in 5, 16, 43, etc. These may be valuable retrieval cases IF the decision, evidence, difficulty and failure mode change. Sector repeat alone is not a defect. Conversely, nine different sectors asking “summarize the recurring behavior” are a definite cognitive duplicate. Do not label two levels identical solely from similar wording, nor assume unique titles mean unique skills.

## Fix order and non-goals
1. Preserve ALL existing level IDs and save keys; do not rewrite content in this branch.
2. Engine + HQ must route normal first-world encounters through approved heterogeneous ChallengeSpec (not merely route to the four unreviewed OBS_VARIANTS).
3. Learning Architect signs nine unique cognitive slots and the three Boss rubric phases; Challenge Generator writes scenarios against signed slots after HQ schema approval.
4. QA tests at least two defensible answers and two plausible weak answers per authored challenge; sample failure log in ERROR-TAXONOMY-AND-QA.md.
5. Add explicit Product Truth, Brand Role, Proposition prerequisites before Territories and Concepts in new curriculum; bridge to later worlds without invalidating the legacy save.
6. Never let self-check or legacy keyword hit unlock a VERIFIED_SKILL flag.

## Risk / confidence
Verified directly: 100-node source census, type distribution, first-world routing, code-level scoring behavior, repeated world patterns, lack of dedicated src/education and tests in HEAD tree.
Inference requiring playtest: perceived monotony, learner frustration, relative real-world difficulty. Not proven: semantic duplicates across every pair of the 90 encounter scripts. Conduct full human/LLM-assisted semantic audit with signoff before retiring/repurposing legacy content.
Private library consulted read-only as pedagogical reference; no campaign copy or private corpus content is published here.

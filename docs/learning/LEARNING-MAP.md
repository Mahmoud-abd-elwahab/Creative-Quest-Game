# Creative Quest — Learning Map (v1.1-draft)
Issue #3 | Owner: Learning Architect | Baseline: 40c76c3aafe6b8bd3d2db0723587e7d02ec9dcc1
Design status: aligned to Game Director's World-1 creative GDD (PR #11) APPROVED FOR PROTOTYPING; HQ schema approval PENDING.

## North star
The player can examine a new advertising brief, distinguish evidence from assumptions, formulate a conditional human insight, connect it to a demonstrated product truth, invent genuinely different concepts, direct a persuasive static visual and defend decisions with evidence. Success is **transfer to an unfamiliar case**, not recall of the right English label. Explanation language: Egyptian Arabic + standard agency terminology.

## Versioned skill IDs and prerequisites
| Skill ID | Behavior demonstrated | Needs first | Evidence of learning | Later unfamiliar use |
|---|---|---|---|---|
| OBS | Observe and delimit fact, sample, context | none | Trace a claim to an exact observation, reject overreach | Spot what new brief does NOT prove |
| AUD | Identify decision-maker and real context | OBS | Separate user/buyer/influencer and situation | Diagnose a different purchase situation |
| BAR | Distinguish Desire, Barrier, Consequence | OBS, AUD | Quote supported friction; distinguish unknown motives | Find audience friction in unfamiliar category |
| TEN | Express bounded human tension | AUD, BAR | Preserve competing forces with evidence labels | Identify conflict without cliché |
| INS | Propose conditional Insight | OBS, TEN | Compare two plausible explanations and a falsifier | Reframe a new audience moment |
| PT | Verify Product Truth / RTB / boundaries | OBS | Link claim to provable product behavior; flag unknown | Remove unsupported benefit from new client pitch |
| BR | Define Brand Role and limit | INS, PT | Identify what brand can credibly solve | Stop generic competitor-swappable idea |
| PROP | State a single-minded proposition | BAR, BR, PT | Audience + benefit + reason-to-believe without false promise | Condense complex brief into one argument |
| TERR | Open strategically distinct Territories | INS, PROP | Two routes differ by argument, not color/casting | Build directions in a new sector |
| CON | Turn Territory into a clear Concept | TERR, PROP | Explain a distinct action/premise, brand-role connection | Invent a fresh concept in a new medium |
| MEC | Select a useful Creative Mechanism | CON, PT | Show how demonstration/contrast/transformation carries claim | Avoid irrelevant spectacle |
| VIS | Translate into Visual/Art Direction | CON, MEC | Focal order, product role, format, legibility, visual causality | Build KV for an unfamiliar placement |
| CAMP | Make coherent campaign system | VIS, PROP, PT | Multiple executions with different audience jobs and same platform | Transfer from one-post thinking to rollout |
| CRIT | Evaluate and defend work fairly | OBS, PROP, MEC, VIS | Compare multiple valid routes, risks, proof and trade-offs | Critique own unfamiliar client idea |
Edges are prerequisites for **independent mastery claims**, not reasons to hide all future ideas from a learner. INS and PT can be taught in parallel after OBS, then converge at BR.

## Mental model / learning loop
Evidence → Observation → Audience / Barrier → Tension → conditional Insight
                           + Product Truth → Brand Role → Proposition
Proposition + Insight → Territories → Concepts → Mechanisms → Visual Direction → Campaign → Critique.
At every arrow, the player must explain *what changed in their decision*, not merely repeat vocabulary.

## Five bands are cognitive, not cosmetic
See DIFFICULTY-PROGRESSION.md. Recognition → Diagnosis → Reconstruction → Constrained Creation → Transfer & Critique. Higher bands add comparison, contradictory/insufficient evidence, constraints, alternative hypotheses, brand facts and unfamiliar contexts—not a smaller timer or more text.

## Retrieval and interleaving
- First OBS course: 9 encounters using Inspect / Connect / Arrange / Compare / Deflect / Route / Interview / Test / Forge, then a 3-stage crafts-fair Boss (retrieval → hypothesis test → concept transfer). Game Director approved this direction **for prototyping only** in PR #11; actual engine/UI integration and learned capability are unverified. L08/L09/Boss preview Insight and Concept; only Observation can be assessed as first-world mastery.
- Before each later world Boss, retrieve one **earlier** skill in a different brief/industry. Example: World 5 Tension Boss asks which two observations actually support its barrier; World 8 Concept Boss rejects an invented product truth.
- Interleave old/new skills: after introducing a new skill, use one 2-step item drawing from OBS or PT within next 2–4 encounters, then another in a later world. This interval is a design heuristic, not an empirically calibrated optimal spacing claim.
- Do not turn every level into an identical 3-part chain. Maintain one primary scored skill with explicit secondary retrieval targets.
- Optional revisit on trouble; historical failure performance should tailor hints, not force global difficulty escalation.
- Maintain semantic anti-duplicate signature (primary cognitive verb + evidence shape + contradiction + decision constraint + consequence), not just sector/title.

## Learning assets, not runtime content
docs/learning/OBSERVATION-WORLD.md defines the first 9 signed **slot proposals**; Writer owns actual authored items in src/content/levels after approval. This branch creates no level JSON.
Private creative library source grounding consulted read-only: cross-book development workflow and consumer insight, social static, brief/pitch and mechanism syntheses on private main (2026-11-08). They inform *principles* and uncertainty labels only. Source synthesis ≠ scientific proof or audience research; private campaign assets are NOT embedded in this public repo.

## Approval boundaries
Game Director: prototype-approved World-1 fantasy and nine verbs in PR #11; final learning experience needs integrated playtest. HQ: approve versioned ChallengeSpec/event schema, skill names shared with runtime, progression integration and target PR branch. Writer: author varied scenarios after learning slot signoff. Boss: consume rubric IDs verbatim. QA: independently judge each question's answer space. No schema/interface should be silently declared production-ready from this document.

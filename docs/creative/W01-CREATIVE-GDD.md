# W01 — Creative Vision & Game Design Direction
**Project:** Creative Quest 2D | **Status:** CREATIVE DIRECTION APPROVED FOR PROTOTYPING — IMPLEMENTATION UNVERIFIED  
**Reviewed source:** `main@40c76c3aafe6b8bd3d2db0723587e7d02ec9dcc1` (2026-11-08)  
**Scope:** World 01 direction + 9 encounters + Level 10 three-stage Boss. Not a change to architecture or production content files.  
**Decision authority:** Game Director approves the *direction*; user retains final hero/style approval; HQ owns interfaces, integration, release.

## North star
**Player fantasy:** أنت مستكشف بيتعلم يشوف الحقيقة وسط ضوضاء الافتراضات، وبأفكارك بتفتح طرق مش مجرد بتجاوب صح وتاخد XP.  
**Promise:** “مش كل اللي بيتقال حقيقة؛ شوف الدليل، فكّر في السبب، جرّب معنى، وطلّع Concept ينفع يتنفذ.”

**Keep from v0.4:** the name **غابة الملاحظة**, exploratory hero/camera, guardian checkpoints, save/XP progression, idea of three Boss shields, 10-world trajectory, Egyptian Arabic agency vocabulary and transparent non-AI scoring. **Evolve:** isolated question-dialogs into situated encounters whose decisions change traversability, information and tactical state. Preserve existing level IDs/progress subject to HQ migration decisions.

### Three design pillars
1. **Evidence changes the world.** Correctly interpreting a clue physically reveals a bridge, trail, mirror, NPC follow-up, or Boss weak point; wrong reasoning has a recoverable and explanatory consequence.
2. **Agency over answer speed.** Players choose what to inspect, which evidence to trust, which hypothesis to test and which concept to defend. Avoid timer-pressure as an artificial difficulty curve.
3. **Transfer into agency work.** A successful player can explain `Observation → Reasoning → Potential Insight → Concept` for a *new* brief, without relying on memorized jargon.

**Core loop (target):** explore → notice an environmental detail/NPC clue → act on clue (inspect, sort, compare, reject, test or assemble) → receive WHY-feedback → visibly transform encounter/environment → choose the next route → keep a skill artifact → confront the Boss with accumulated reasoning.  
**Pacing:** encounters should be short enough for mobile sessions and offer pause/resume; one meaningful choice per beat, with optional exploration. Avoid nine consecutive static dialogs.

## W01 narrative and spatial journey
**Canonical World name:** غابة الملاحظة. **Theme subtitle (proposal):** أصداء الأدلة.  
A living fantasy forest echoes fragments of ordinary consumer lives. “وحش الافتراضات” projects convincing false explanations onto those fragments. The player uses a reusable **عدسة الدليل / Evidence Lens** to separate visible facts from invented motives. It is a **thinking mechanic**, not another collectible currency.

**Four legible spaces:** (A) بوابة الشهادات [L01–03, first environmental interactions]; (B) مستنقع الظنون [L04–06, misleading projections and route forks]; (C) ورشة التأويل [L07–09, hypothesis testing and concept preview]; (D) عرين الافتراضات [L10 Boss]. Each space has a different silhouette, traversal rhythm, challenge affordance and illumination, but all inhabit the same visual world. Return routes and two optional clue alcoves prevent “walk along one straight corridor → quiz → repeat.”

**World skill policy:** `Observation` remains the **primary skill** of W01 to respect the Project Bible. Levels 08–09 preview Reasoning/Insight/Concept *with guidance*, not assert mastery of later worlds. Learning Architect must validate this scaffold before content freeze.

## Ten-level journey — proposal to content/learning teams
All cases are **invented training scenarios**, not claims about a real brand or target audience. The first nine are nine distinct encounters; the tenth is the Boss. Existing example contexts are retained where useful, but their *interaction* is redesigned.

| Level | Brief / environment | Active player verb & distinct encounter | Measurable learning output | Difficulty |
|---|---|---|---|---|
| **01** | مكتبة عامة: كتب بتترجع قبل ما تتقري كاملة | **Inspect** scattered loans/return slips; identify **two witnessed behaviors** to illuminate the first trail | Describe an observable behavior without invented motivation | 1/5 |
| **02** | مشتل: العملاء بيرجعوا يسألوا عن رعاية النباتات | **Connect** an NPC line to the matching physical clue, leave unsupported “سبب” unconnected | Distinguish source evidence from an inference | 1/5 |
| **03** | سينما: تغيير الحجوزات من متأخر لمبكر | **Arrange** booking tickets on a before/after track; reveal the direction of change | Detect a trend from comparable data, without claiming why | 2/5 |
| **04** | غرفة قياس الملابس: نفس القطعة بمقاسات مختلفة | **Compare** two observable sequences against an illusion that asserts “عدم الثقة بالنفس” | Identify the claim that goes beyond the evidence | 2/5 |
| **05** | تطبيق موسيقى: Skip قبل نهاية التراك | **Deflect** three projected statements by placing each in `Observed / Possible / Unsupported` lanes | Calibrate certainty: fact vs hypothesis vs generalization | 2/5 |
| **06** | كشك قهوة: أيام الشغل سفري، الإجازة قعدة | **Route** an NPC to the weekday or weekend route using context cards; both paths rejoin | Explain that context changes behavior without oversimplifying motivations | 2/5 |
| **07** | محل ألعاب طاولة: بيفحصوا القواعد وبيسيبوا العلب | **Interview** a shopkeeper: choose a discriminating follow-up question, not a leading one | Select missing evidence that can test a hypothesis | 3/5 |
| **08** | جاليري: الزوار بيصوروا ويكملوا الجولة | **Test** two plausible interpretations by selecting evidence to collect next; open one of two equal paths | Frame a **potential** Insight, show uncertainty and a validation path | 3/5 |
| **09** | Coworking: اشتراك شهر واستخدام أيام قليلة | **Forge** an early **Concept seed**: join observed behavior + bounded possible motivation + suitable brand action; compare two divergent concepts | Explain why the creative action responds to a user behavior; avoid claiming speculative insight as fact | 3/5 |
| **10** | معرض حرف يدوية / عرين الوحش | **Boss synthesis:** collect evidence → break assumptions → construct & defend a creative response | Apply an end-to-end, evidence-aware reasoning chain to a *new* case | 3–4/5 |

### Encounter diversity gate
In W01, interaction verbs should not repeat in adjacent levels: inspect, connect, arrange, compare, deflect, route, interview, test, forge. Challenge content must be distinguishable on **brief, cognitive operation, input gesture, decoy logic, feedback and changed game state**. Merely switching select to dropdown or rewriting text is insufficient. Review each with Learning Architect and Scenario Writer; no level bank mass production before W01 playtest.

### Sample agency-accurate microcopy
- NPC: **“أنا قلتلك الزباين عملوا إيه. ما قلتلكش هما عملوا كده ليه.”**
- Evidence Lens: **“ده Observation. إيه الدليل اللي قدامك؟”**
- Wrong, teachable: **“استنتجت إنهم مش واثقين في نفسهم. ده احتمال، بس لسه معندناش Evidence يثبته. جرّب توصف اللي شفته.”**
- Strong: **“دي ملاحظة دقيقة: السلوك + السياق + من غير تعميم.”**
- Concept phase: **“الفكرة دي بتغيّر إيه في تجربة الشخص؟ مجرد Tagline مش كفاية.”**

## Level 10 — Boss: وحش الافتراضات
**Encounter fantasy:** three shifting layers of illusion hide an exit and a real-world mini-brief: visitors to a crafts fair photograph pieces, note sizes/numbers, leave for other booths, and sometimes return. Do **not** claim all visitors do this or assume prices are the cause.

**Telegraph → player action → state effect → feedback → retry** is mandatory in **every** stage.

1. **The Fog / “شاف ولا افترض؟” — Observe.** The monster spawns floating statements near three fair-scene props. Player physically inspects clues and equips **two evidenced observations**; fake claims mislead the lens. Correct evidence reveals two anchor points and cracks one screen of fog. Wrong selection marks the exact unsupported leap, releases the clue for a new choice; no arbitrary HP loss.
2. **The Mirror / “ده معنى ولا حكم؟” — Reason and potential Insight.** Mirrors show two plausible motives plus one confident generalization. Player chooses a **tentative interpretation** and a *discriminating piece of evidence* required to test it. Both defensible routes can work **when supported and qualified**; the unsupported generalization reflects a false attack, explain why and retry. Breaking this layer changes the mirror arena/path layout.
3. **The Forge / “الفكرة هتعمل إيه؟” — Concept transfer.** Player combines **Observation + caveated Insight + Brand role + actual audience action** into one playable response to the crafts-fair brief (e.g., make it easier to revisit items; or compare craft details). Two meaningfully different concepts can pass with clear trade-offs; a slogan-only choice cannot. Mechanically, the selected action rebuilds the exit bridge / turns the enemy projection into a useful guide; Boss victory is tied to a reasoning decision, never to cosmetic damage numbers.

**Fair scoring:** structured actions can be checked deterministically; open creative submissions are **rubric + learner self-review or optional external discussion**, never advertised as secure AI grading. Do not auto-approve arbitrary text or turn self-confirmation into externally verified performance. Offer retry, hint and recovery after every failure; no mandatory paid AI/API.

**Proposed Boss learning rubric (for Learning Architect signoff):** evidence fidelity 35%, reasoning and uncertainty 25%, human/brand relevance 20%, distinctness and tangible execution 20%. A stage can fail despite a good total if evidence fidelity is absent; rubric is a proposal, not a final scoring interface.

## Player journey and fun-factor proof
**Onboarding:** in L01 the player learns movement through a reachable clue and sees path transformation **within the same encounter**. The first real reward is a playable new route, not an XP popup.  
**Mid-world:** at L05, a false conclusion makes a mirror reappear; the player learns to challenge it and understands why it failed. At L07–08, the player chooses *what to find out*, not just from a list of hidden right answers.  
**Payoff:** L09 lets the player form an idea; L10 forces an independent brief and demonstrates transfer.

### Creative acceptance (observable in a playtest)
- A fresh player can state the difference between **Observation** and **Assumption** using a **new example**, without reading a definition.
- In at least **7 of 9** encounters, progress causes a **visible change** to traversable world state or available evidence/route, not merely to a modal, number or HP bar.
- Encounter verbs are all different as above; no adjacent semantic duplicates and at least **4 domain contexts** (9 proposed).
- The Boss has 3 mechanically and cognitively distinct phases; a player can recover from a wrong reason with specific feedback, not guess through it.
- L08 and L09 recognize defensible alternative hypotheses/concepts; the UI never presents a speculative motive as a proven universal truth.
- A novice can pause and resume; controls must be responsive without penalty for slow reading.
- **Progress alone is insufficient as learning evidence**: ask a short unseen-case transfer prompt after Boss in playtesting.

## Rejected directions
- **REJECT:** one continuous straight path with nine guards that only open forms.
- **REJECT:** giant monster HP reduced by generic correct-answer clicks; visual FX cannot substitute for reasoning.
- **REJECT:** nine remixed “إيه الـObservation؟” questions with interchangeable locations.
- **REJECT:** presuming ChatGPT on another site can securely grade/free-text-update local game progress.
- **REJECT:** “Insight = truth” without evidence or treating a tagline as a tangible Concept.
- **REJECT:** drawing beautiful forest panoramas as a single unwalkable background.

## Design signoff
**CREATIVE DIRECTION: APPROVE for one-world vertical-slice prototyping.** **Post-signoff update:** owner supplied and selected a canonical teal-clad hero image; see `HERO-01-CANONICAL-LOCK.md`. This decision approves **that original hero identity** but does **not** approve the generated turnaround as production art, final sprites, data contracts, completed levels, integrated game feel, performance or release. Those remain UNVERIFIED and must pass HQ/owner/QA gates.

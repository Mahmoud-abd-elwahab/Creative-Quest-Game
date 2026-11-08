# Issue #8 — Creative Library Challenge Generator: discovery audit & proposal

**Status:** DESIGN / AUDIT ONLY — NOT APPROVED FOR CONTENT GENERATION OR RUNTIME.  
**Prepared:** 2026-11-08 (Africa/Cairo).  
**Game baseline:** main@40c76c3aafe6b8bd3d2db0723587e7d02ec9dcc1.  
**Private source snapshot inspected:** Mahmoud-creative-library main@547f51e05eddfaced2e70b7459570cb56c09f9c5; this is a time-bound read-only snapshot and may advance independently.  
**Delivery owner:** Issue #8 / Content Generator. **Target:** cq/integration/vertical-slice (design review only).  
**Dependencies:** [Issue #8](https://github.com/Mahmoud-abd-elwahab/Creative-Quest-Game/issues/8), [Learning PR #20](https://github.com/Mahmoud-abd-elwahab/Creative-Quest-Game/pull/20), [Creative Direction PR #11](https://github.com/Mahmoud-abd-elwahab/Creative-Quest-Game/pull/11), [Boss PR #19](https://github.com/Mahmoud-abd-elwahab/Creative-Quest-Game/pull/19).

## 1. Decision and constraints

This report records completed read-only source analysis, an independent static legacy audit, a proposed library-to-learning workflow, nine candidate encounter **plans** and three Boss phase **handoff requirements**. No authored ChallengeSpec, level JSON, scene scripts, gameplay wiring, save changes, registries, private extracts or copyrighted assets are delivered. The runtime schema has not been approved.

**Reconciliation with approved direction:** An earlier unconstrained nine-scenario exploration considered fresh industries and situations. It is **superseded as a production candidate** by Game Director PR #11 and Learning Architect PR #20, which specify the library/nursery/cinema/fitting-room/music/coffee/board-game/gallery/coworking W01 contexts. Do not ship competing nine-level storylines. Their newness must be earned through *different player reasoning/actions* instead of superficial renamed settings. Retain legacy progress and numeric IDs until HQ approves migration.

**Read-only documents checked in the private library (file names only, not campaign extracts):**
- CREATIVE-VALUE-FIRST-POLICY.md
- campaigns/production-batches/CREATIVE-MECHANISM-RETRIEVAL-2026-11-07.md
- campaigns/production-batches/CROSS-CASE-DECISION-PATTERNS-2026-11-07.md
- campaigns/production-batches/CREATIVE-INTELLIGENCE-REVIEW-QUEUE-193.md
- campaigns/production-batches/CREATIVE-INTELLIGENCE-BRIEF-FAILURE-ROUTING-2026-11-08.md
- frameworks/cross-book-creative-development-workflow.md
- Catalogued EGF/EGC source-file locations inspected at tree level; the case ledger and cross-case indices are evidence of archived analysis, not independent ad-performance verification.

The queue document inspected reports **193 raw records, 176 extracted in the specified text-level reviews and 17 not yet extracted**. Historical evidence-workflow labels and geographic origin are not creative-value filters. Do not equate extracted, verified, unique and performance-proven.

## 2. How the private library is used educationally

The game should test a **thinking action**, never memory of a particular existing campaign. Source retrieval starts from a creative decision problem (e.g. evidence missing, service benefit unobservable, claim too broad, mechanism attractive but irrelevant), not a brand name, country, visual style or historical QA label.

**Pipeline (proposed, not implemented):**
1. Retrieve a library decision pattern and record privately: what problem it addresses, mechanism, product truth, evidence boundaries, when it fails, original research confidence, and one counterexample.
2. Turn that into a pedagogical operation: **what the player must inspect, compare, disconfirm, repair, test or forge**. Choose an existing Learning Slot, not a new curriculum.
3. Invent a fictionally coherent brand/audience/situation, with verifiable *within-the-story* evidence IDs, explicit unknowns, constraints, product capabilities and fair competing explanations. Never present NPC fiction as population research.
4. Author an interactive decision and visible world consequence (clue/path/NPC/Boss state), with at least one defensible path, plausible partial/unsupported paths and criterion-specific **why** feedback.
5. Bind only to HQ-approved ChallengeSpec, learning slot + rubric IDs, error taxonomy, hint/retry signals, and safe progression trust states.
6. Run machine ID/schema checks plus human semantic comparison against **all 100 legacy nodes and any accepted content**, including the same logical operation disguised as a new industry.
7. Seek Learning, Game Director and independent QA signoff before proposing merge; evaluate an unseen transfer example, not answer-position memorization.

**Confidentiality boundary:** No campaign-to-level provenance, individual private case IDs, full extracts, unpublished research text, copyrighted images or proprietary creative explanations belong in this public repo, public issue/PR text, runtime assets, build output or logs. A private source-to-skill trace is held in the authorized private handoff only. The table below contains **general teaching principles**, not direct case provenance.

**Confidence labels:** (A) directly inspected game source or learning manifest; (B) archived *text-level library interpretation* without independent original art/performance audit; (C) pedagogical transfer hypothesis; (D) fictional in-game fact, valid only inside its scenario. Do not label B/C/D as empirical consumer truth. Source evidence requirements may block publishing a real-world claim, but do not erase its creative-learning value.

## 3. Legacy 100-level audit / repetition risk

**Executed read-only static enumeration against actual main index.html:** 9 original encounter entries + 18 additional entries + 63 campaign entries + 10 Boss nodes = **100 declared levels**. Derived numeric IDs 1..100 were continuous and unique (100/100). The 63 campaign entries use seven constructors; static counts: select 14, evidence 7, classify 7, write 14, repair 7, pair 7, forge 7. This is *source inventory*, not live route, objective quality or gameplay acceptance.

**Verified by source review:** normal World 1 interaction routes the nine original tasks through open-text keyword check(); the four OBS_VARIANTS are diagnostics, not normal first-world routing. Early tasks repeatedly ask for a common observable behavior. Static replication of Level 1's keyword rules produced:
- A defensible observation (في المكتبة فيه ناس بتاخد كتب وترجعها قبل ما تخلص القراية) **fails** one required keyword family.
- An unsupported universal/insulting statement (كل اللي بيبدأوا كتب وبيرجعوها قبل ما يخلصوها أغبياء) **passes** all three keyword families and the motive-word heuristic.
These are **source-level reproducible grading defects**, not a claim that browser gameplay was retested.

**Important distinction:** W01's nine proposed contexts **intentionally collide with legacy L01–L09** as the Game Director's remake plan. Context collisions are not novel standalone brief claims. Novelty depends on the scripted evidence, cognition, failure pattern and world interaction changing. Preserve baseline numeric IDs and save compatibility; replacement/migration is HQ/Engine responsibility.

**Global anti-duplication specification (future validator + human review):**
- **ID layer:** immutable new content IDs, unique scenario IDs, versioned slot IDs, no accidental use of numeric legacy save keys.
- **Lexical layer:** normalized Egyptian Arabic/English word forms, titles, prompts, evidence clues, option phrasing; exact and high-overlap n-grams.
- **Semantic fingerprint:** [primary skill, prerequisite, audience/industry, situation, available evidence types, cognitive verb, decision operation, hypothesis/claim being tested, defensible solution *logic*, likely error code, interaction state effect, position/revisit link].
- **Crossbank:** compare each new candidate against *100 existing levels*, existing Bosses, other accepted new challenges and all nine within the batch. Source mechanism family is a separate dimension; swapping brand/audience while retaining mental steps triggers a duplicate candidate.
- **Review states:** REWORK if same mental operation + same evidence decision; NEEDS MANUAL REVIEW if similarity or pedagogical value is uncertain; INTENTIONAL_REVISIT only with reviewOf, changed evidence and demonstrably increased demand. No verified uniqueness label from cosine/string scores alone.
- **Fairness:** accept at least two defensible readings when the brief permits them. Ask two reviewers to evaluate supported, partial and unsupported variants, bias from option position, weak claims, Arabic paraphrases and misleading implied denominators.

**Desk-review collision watchlist:** W01 E01 overlaps old L01 and other book-related nodes (e.g. 51/78); E02 old L02 and plant node 36; E03 old L03 plus chronology-related 34/37; E04 old L04 and workwear 17; E05 old L05 and music 16; E06 old L06 and contextual temporal comparisons; E07 old L07 plus game-related 56; E08 old L08 and photo-sharing 27; E09 old L09 and subscription-underuse 18. These are **candidates to scrutinize**, not a verified all-pairs semantic audit.

## 4. First nine encounter **plans** (NOT authored content)

**Authoritative educational input:** Learning PR #20, slot manifest OBS-W1-SLOTS@1.1-draft, rubric OBS@1.1 + PV@1.0; Learning signs for cross-role review, not HQ runtime approval. **Authoritative creative direction:** PR #11, prototype-only. First-world assessed mastery can only be Observation. INS/Brand Role/Concept applications in E08/E09 are guided **previews**.

| Slot / level | Band, cognitive delta and context | Educational library transfer (generic, no case-source mapping) | Player action / plausible weak reasoning / hint direction | Rubric IDs and visible feedback target |
|---|---|---|---|---|
| OBS-W1-E01 / L01 | D1 **Inspect** library loan records | Ground every claim in traceable behavior before arguing | Inspect two loan/return traces. Weak: “مش بيحبوا القراية” as fact. Hint: find the logged action, not a motive. | R-OBS-CLASS, R-OBS-TRACE; Evidence Lens illuminates first trail. |
| OBS-W1-E02 / L02 | D1 **Connect** nursery statement + documented care interaction | Separate provenance of a statement from attractive interpretation | Match NPC statement to *dated* return/inquiry clue. Weak: a generic printed care card alone supposedly proves a return visit. Hint: which record documents the actual contact? | R-OBS-TRACE, R-OBS-CLASS; path knot lights only for linked evidence. |
| OBS-W1-E03 / L03 | D2 **Arrange** same cinema booking IDs before/after changes | Prevent unsupported trend/causality in message claims | Order comparable tickets, leave unrelated booking aside. Weak: “كل الزوار بقوا يفضلوا الصبح”. Hint: check same transaction and sample scope. | R-OBS-TRACE, R-OBS-SCOPE; timeline/passage restores. |
| OBS-W1-E04 / L04 | D2 **Compare** fitting-room garment-size trials | Product/behavior observation is not psychographic proof | Compare records, refute projection of low self-confidence. Partial: propose better fit as *hypothesis* only. Hint: what did the shopper actually try? | R-OBS-CLASS, R-OBS-SCOPE, R-OBS-TRACE; false mirror recedes. |
| OBS-W1-E05 / L05 | D2 **Deflect** music Skip statements | Calibrate mechanism-relevant evidence vs imagined motive | Sort observed Skip, possible mood explanation and unsupported blanket verdict. Weak: treat a plausible motive as proven or impossible. Hint: choose certainty labels. | R-OBS-CLASS, R-OBS-SCOPE; illusion shields reclassify. |
| OBS-W1-E06 / L06 | D2 **Route** workday/weekend coffee behavior | Keep the context constant/variable explicit | Route NPC using context evidence. Weak: “الشغل السبب الوحيد لكل الناس”. Hint: who, on which kind of day? | R-OBS-SCOPE, R-OBS-TRACE; context-sensitive routes reconnect. |
| OBS-W1-E07 / L07 | D3 **Interview** board-game shop visitor/shopkeeper | Identify a missing decision variable before choosing an ad approach | Select/write neutral question differentiating unclear rules vs browsing. Weak: “القواعد صعبة، صح؟”. Hint: ask about last real action without leading. | R-OBS-ALT, R-OBS-TRACE, R-OBS-SCOPE; NPC reveals new evidence. |
| OBS-W1-E08 / L08 | D3 **Test** competing gallery-photo motives | Decide what claim a proposed observation can and cannot support | Choose evidence/test for recall vs sharing explanations. Both qualified routes may work. Weak: assume photographing proves social posting. Hint: what new observation would discriminate? | R-OBS-ALT, R-OBS-SCOPE, R-OBS-TRACE; either fair route opens; Insight preview only. |
| OBS-W1-E09 / L09 | D4 **Forge** coworking low-use observation into constrained Concept preview | Brand/product integration must solve a bounded problem, not add visual spectacle | Assemble observed small-sample usage + tentative mismatch + fictionally proven day-pass + tangible audience action. Weak: fake free/unlimited access or color-only “Concept”. Hint: point to day-pass proof card and who benefits. | R-OBS-TRANSFER, R-OBS-TRACE, R-OBS-SCOPE, R-OBS-ALT; R-PREV-BRAND and R-PREV-CONCEPT **preview only**; show tangible world tool. |

**Non-repetition test for final scripts:** Nine *different verbs* in the draft are necessary, but not sufficient. Inspect must target recorded behavior; Connect source credibility; Arrange matched temporal evidence; Compare psychological leap; Deflect calibrated certainty; Route bounded context; Interview neutral discriminating question; Test rival hypotheses; Forge product-backed transfer. Changing drag/drop to radio buttons does **not** change cognitive demand. Do not classify the batch as nine semantically unique scripts until authored and independently evaluated.

**Cognition vs difficulty:** D1 recognition/evidence (E01–E02) → D2 diagnosis/comparison/uncertainty (E03–E06) → D3 research repair/rival hypothesis tests (E07–E08) → D4 guided synthesis (E09). D4 is preview-only for Concept, and B03 D5 is transfer/critique; these are **Learning PR #20's latest design bands**, overriding earlier provisional D1–D3-only shorthand, without awarding advanced mastery.

**Example reasoning feedback requirement:** “فيه سجل بيقول إنه غيّر المعاد، مش إن كل الناس بقت بتحب مواعيد بدري. حافظ على حدود العينة.” Distinguish false certainty, unlinked evidence, missing test, invented brand promise and superficial Concept using separate error codes (Learning-owned taxonomy); do not reuse generic “صح/غلط” for all.

## 5. Boss content handoff — 3 stages, one new craft-fair context

**Canonical Boss:** وحش الافتراضات / crafts fair, first-world L10. **Design only; Boss owner owns state machine, Engine owns event routing.**

| Slot / band | Required player reasoning | Fair success, plausible failure and hint | Expected state change / scoring |
|---|---|---|---|
| OBS-W1-B01 / D3 | Collect/classify two facts from labeled fair evidence: photos, recorded item IDs/sizes, booth return. | Success: source-linked, appropriately scoped actions. Failure: “الناس بترجع عشان الأسعار غالية” without evidence. Hint: show two physical records. | First fog shield cracked through evidence action; structured R-OBS-TRACE/CLASS/SCOPE. |
| OBS-W1-B02 / D4 | Form **tentative** interpretation, compare rival motivations and request a discriminating observation. | Either comparison or later revisit hypothesis can be defensible with fit-for-purpose test. Failure: universal confident motive, leading question. Hint: “إيه الدليل اللي لو ظهر هيخليك تغير رأيك؟” | Mirror state changes for defensible testing, retries allowed; R-OBS-ALT/SCOPE/TRACE; Insight preview only. |
| OBS-W1-B03 / D5 | Transfer to new fictional organizer service tool and **forge/defend** one tangible Concept tied to evidence and an audience action, comparing at least two valid routes. | Success: truthful fictional organizer function + bounded hypothesis + concrete useful action. Failure: swappable logo/tagline, imaginary product capability or copied past pattern. Hint: return to organizer proof card, not style choices. | Exit bridge reforms, with R-OBS-TRACE/SCOPE and R-PREV-BRAND/CONCEPT; critical R-OBS-TRANSFER human reviewer gate. |

Each phase needs **telegraph → evidence/player action → defendable state transition → explicit why feedback → retry/hint**. No answer timer penalty, generic correct-click HP attack, auto-semantic grading or silently verified self-review. Boss PR #19 must align phase interface and rubric weights after HQ contract approval.

## 6. Grading, adaptation and runtime trust

Learning rubric criterion scale: 0 unsupported, 1 partially supported, 2 supported; weighted applicable criteria sum to 100. The 12 draft slot weight totals and IDs were checked statically in this audit. This is a **rubric completeness score**, not objective proof of originality or campaign performance.

- **Structured finite actions:** deterministic checking of explicit evidence IDs / allowed order / class sets with multiple valid answers where appropriate, *only after* schema and tests.
- **Free-text, rival insight and creative forging:** human rubric or clearly labeled self-review; free-text result remains SELF_REVIEWED_UNVERIFIED unless independently reviewed. Optional ChatGPT discussion remains EXTERNAL_DISCUSSION_UNVERIFIED. Narrative progress/XP must not be presented as externally verified mastery.
- **Adaptive practice proposal:** track error *criterion*, retry count, hint use and evidence choice, not just level number. After 2 errors on same structured criterion offer a different-format micro-remediation with different facts; if 2 of recent 3 reliable OBS checks fail the same skill, recommend revisit (do not punish). Later successful no-hint retrieval after ~2–4 encounters and another world transition. These thresholds are **Learning draft heuristics**, not operational code.
- **Hint ladder:** task reframe → point to source/context → contrast nearest seductive wrong claim → worked parallel case; do not expose the exact key or force ungraded prose to “pass”.
- **Save boundary:** legacy localStorage key creative-quest-2d-v02 and level IDs retained. HQ/Engine owns mapping new content IDs to legacy completion and separate provisional learning status. No runtime credentials or external private-library fetch.

## 7. Actual QA evidence, not production claims

| Check | Result | What was actually performed / limitation |
|---|---|---|
| GitHub repository/issue/PR/branch checks | PASS | Retrieved Issue #8, Learning PR #20, Creative PR #11 and target/incoming branch refs. |
| Source baseline census | PASS (static) | Parsed main index.html declaration groups: 9 + 18 + 63 + 10 = 100; 100 distinct contiguous numeric IDs. |
| Original World 1 context collisions | CONFIRMED (9/9) | All nine chosen narrative sectors correspond to old L01–09 by design; **not** nine freshly disjoint industry cases. |
| Legacy keyword-grader counterexamples | REPRODUCED (static) | One valid false negative and one unsupported false positive from check() predicate, no browser assertion. |
| Learning manifest IDs | PASS (static) | 12 unique slot IDs; nine different nominal cognitiveOperation values for E01–E09; primarySkill OBS for all. |
| Learning manifest rubric weights | PASS (static) | All 12 slot weight maps sum to 100. Rubric criterion authority remains Learning PR #20 draft. |
| Independent per-slot semantic distinction | PROVISIONAL DESK REVIEW | Distinct operations **specified**; authored distractors/interaction absent, so not a verified semantic pass. |
| Full 100×9 pairwise human semantic review | NOT RUN | Requires finalized authored challenge scripts and independent QA/Learning judgement. |
| Actual schema/level-JSON validation | BLOCKED | HQ versioned ChallengeSpec not yet approved, no new level JSON produced. |
| Boss runtime / mobile / save migration / UI screenshots | NOT RUN | Outside scope; awaiting owners' integration and QA. |
| Public content originality/copyright review | PENDING | No public campaign extracts copied; final scripts/assets need fresh review. |

## 8. Dependencies, owners, blockers, acceptance gate

1. **Technical Producer / HQ — BLOCKING:** Approve a **versioned ChallengeSpec** and event contract: immutable challenge/slot IDs, evidence E-IDs, response modes, multiple supported paths, error feedback, rubric version/weights and critical gate, hint ladder, result trust state, save mapping, XP/provisional vs verified learning, asset/UI event hooks. Current SHARED-CONTRACTS LevelSpec is explicitly **proposed**, not authorization.
2. **Learning Architect / PR #20 — REVIEW PENDING:** Accept or revise OBS-W1-SLOTS@1.1-draft, stable rubric IDs and D4/D5 preview policy. Avoid silently changing D4/D5 to D3 or awarding INS/CON mastery.
3. **Game Director / PR #11 — CREATIVE PROTOTYPE SIGNOFF ONLY:** Nine action verbs, approved fiction contexts, evidence lens, **at least 7/9** meaningful environmental state changes and the three-phase crafts-fair Boss; final scripts and experience need later approval.
4. **Boss owner / PR #19:** Accept three content phase requirements and propose typed state transitions only after HQ interface approval.
5. **Engine/UI/World owners:** Expose evidence/NPC/route hooks; mobile-accessible alternatives to drag or timed input. Existing index.html is retained until non-destructive parity/migration passes.
6. **QA:** Run validator + ID/semantic checks on authored JSON, at least 2 supported/2 partial/2 unsupported variants per encounter with dialect paraphrases and genuinely alternative valid paths; mobile/retry/save regression and live build verification.
7. **Content writer (this owner):** After HQ approves contracts, **then** author exactly nine original playable scripts constrained by the signed slots, plus separate Boss content packet, candidate registry/novelty fingerprints and documented source confidence. No private source text or case-to-level map committed publicly.

**No production-ready ChallengeSpec exists here. No PR merge requested. No levels generated. No gameplay code changed.** This audit should be treated as a reviewable design artifact; return it for changes if HQ requires an alternate report path or privacy handling.

# Assessment Rubrics (v1.1-draft)
Issue #3 | Aligned to Game Director's prototype-approved W01 GDD (PR #11), **not** signed runtime/HQ ChallengeSpec.
Review-only scoring model: useful criteria for human or finite structured evaluation, never a magic semantic AI judge. Source scenarios are explicitly fictional.

## Criterion IDs: OBS@1.1 + preview-only PV@1.0
| ID | Cognitive criterion | 2 — supported | 1 — partially supported | 0 — unsupported |
|---|---|---|---|---|
| R-OBS-TRACE | Trace claim to evidence | Cites accurate observation/E-ID and action | Mentions relevant record but misses a qualifier | Misquotes/fabricates evidence or uses wrong source |
| R-OBS-SCOPE | Boundary, uncertainty, denominator | Delimits who, where, when; marks unknown motive/event linkage | Correct direction with overly wide scope | Universal/causal claim contradicted by available record |
| R-OBS-CLASS | Classify observed, possible, unsupported | Labels all with an explanation and confidence | One ambiguity, acknowledges uncertainty | Declares unsupported motives as established data |
| R-OBS-REPAIR | Repair faulty claim | Replaces unsupported assertion with evidence-bound alternative | Removes harmful language but retains hidden leap | Cosmetic rewrite keeps incorrect conclusion |
| R-OBS-ALT | Discriminate rival explanations | Names two plausible hypotheses and an ethical, non-leading differentiating question/log | Plausible alternative but weak/leading test or omits rival | Assumes motive as fact or picks non-discriminating test |
| R-OBS-TRANSFER | Apply evidence discipline to new brief | Preserves method across unfamiliar category and addresses new constraints | Shows method vocabulary but misses critical new evidence | Reuses previous answer despite contradictory new brief |
| R-OBS-CLEAR | Clear checkable claim | Egyptian Arabic or English wording identifies actual actors/actions | Meaning present but missing essential modifier | Unclear what was actually done or observed |
| R-PREV-BRAND | Brand role preview only | Explicit product/organizer fact is genuine **within fictional brief**, its benefit accurately bounded | Product is relevant but weakly integrated or assumption not labeled | Invents capabilities, promises or swappable/generic brand role |
| R-PREV-CONCEPT | Concept preview only | Shows tangible distinct event/system and audience action, explains relation to proof | Coherent tagline or style but limited action or extendability | Pure aesthetic treatment or fake offer with no concept |
**Important:** R-PREV criteria train/coach a later skill; a positive score does NOT award Brand Role, Insight or Concept *mastery*. Scores are reviewer interpretations, not empirically validated creativity metrics.

## Scoring and trust rules
Only **applicable weighted IDs** are scored. Weight totals must equal 100; 0/1/2 per criterion. Derived reviewer percentage = Σ(weight × criterion/2) and is *rubric completeness*, not scientific prediction of creative quality. If a task requires a **critical gate** (e.g. R-OBS-TRANSFER in B03), a 0 blocks independent competence regardless of weighted total. Critical gates must be reviewable and cannot be inferred by keyword presence.

- **Structured finite check:** finite option / E-ID / categorization can be verified deterministically, but only for the explicitly authored task and approved answer sets; multiple defensible paths must be accepted.
- **Human reviewer:** can evaluate open paraphrases and Concept alternatives, record criterion justification, date, version, question evidence. Unreviewed prose stays pending.
- **Self-review:** formative completion, labeled SELF_REVIEWED_UNVERIFIED. Do not silently assign an externally VERIFIED badge or a trusted creativity score.
- **Optional ChatGPT discussion:** educational conversation only, EXTERNAL_DISCUSSION_UNVERIFIED without authenticated reviewed return. It cannot securely update game state from copied text alone.
- **Critical error:** fabricated source, nonexistent discount/benefit, universal psychology or causal invention forces 0 on relevant trace/scope and remediation even if idea sounds interesting.
- **Fairness:** Egyptian grammar, dialect spelling and English agency terms are not mistakes; multiple valid reasons must be represented in keys or handled by review.

## OBS-W1-SLOTS@1.1 — slot-to-rubric binding
| Slot | Cognitive task | Weighted criterion IDs (omit R- prefixes) | Evaluation type | What a pass does **not** prove |
|---|---|---|---|---|
| E01 | Library witnessed behavior | OBS-CLASS 60; OBS-TRACE 40 | structured | why people stop reading |
| E02 | Nursery source linkage | OBS-TRACE 60; OBS-CLASS 40 | structured | universal plant-owner motive |
| E03 | Cinema time-order evidence | OBS-TRACE 55; OBS-SCOPE 45 | structured | why sessions changed |
| E04 | Clothing false psych inference | OBS-CLASS 55; OBS-SCOPE 25; OBS-TRACE 20 | structured | shopper self-confidence |
| E05 | Music three certainty levels | OBS-CLASS 60; OBS-SCOPE 40 | structured | all listener preferences |
| E06 | Coffee weekday/weekend context | OBS-SCOPE 55; OBS-TRACE 45 | structured | cause of scheduling behavior |
| E07 | Board-game neutral interview | OBS-ALT 50; OBS-TRACE 30; OBS-SCOPE 20 | mixed / reviewer where open | which motive is truly right |
| E08 | Gallery two-hypothesis test | OBS-ALT 50; OBS-SCOPE 30; OBS-TRACE 20 | mixed | validated human Insight |
| E09 | Coworking guided Concept seed | OBS-TRANSFER 25; OBS-TRACE 25; OBS-SCOPE 15; OBS-ALT 15; PREV-BRAND 10; PREV-CONCEPT 10 | rubric review + finite evidence keys | Concept or brand-role mastery |
| B01 | Crafts fair fact retrieval | OBS-TRACE 40; OBS-CLASS 40; OBS-SCOPE 20 | structured | why visitors photographed items |
| B02 | Crafts fair rival hypothesis + test | OBS-ALT 45; OBS-SCOPE 30; OBS-TRACE 25 | structured choice with multiple valid routes; open reflection provisional | validated psychology |
| B03 | Crafts fair evidence-based Concept | OBS-TRACE 35; OBS-SCOPE 25; PREV-BRAND 20; PREV-CONCEPT 20; **OBS-TRANSFER CRITICAL** (unweighted) | rubric review / optional external discussion | externally verified creative excellence |

## Two defensible solution paths with critique — E07 / board-game shop
Fictional records: E1 “قريت قواعد لعبتين في المحل”; E2 “سِبت العلب ومشتريتش”. No documented cause.
- **SUPPORTED A:** “احكيلي عن آخر لعبة قريت قواعدها وبعدين سيبتها، إيه اللي حصل بعد القراية؟” Non-leading, asks process, can distinguish comprehension/other causes. R-OBS-ALT=2.
- **SUPPORTED B:** “إيه اللي كنت بتدور عليه في طريقة اللعب؟ وإيه اللي خلاك تكمل أو توقف عندها؟” Accept; could reveal goal and actual decision. ALT=2.
- **PARTIAL A:** “هل حسيت إن القواعد صعبة؟” One plausible theory but leading. ALT=1; coach neutral wording.
- **PARTIAL B:** “ليه مشتريتش؟” Relevant but vague; needs precise episode and competing explanations. ALT=1.
- **UNSUPPORTED A:** “قولنا إزاي صعوبة القواعد هي اللي منعتك” Assumes hypothesis as fact; ALT=0.
- **UNSUPPORTED B:** “كل اللي بيسيبوا اللعبة مش بيفهموا قواعدها” Unsupported psychological generalization; ALT=0 and SCOPE=0.

## Two creative routes with evidence boundary — E09 / coworking
Fictional records: a monthly subscriber uses space on few days; another visits four days per month. In this task ONLY, fictional brand card confirms **per-day pass** is available; no other brand promise is proven.
- **SUPPORTED A:** “فيه اشتراكات استخدام أصحابها متقطع؛ احتمال الدفع الشهري مش مناسب لبعضهم. نعرض رزنامة بتظهر الأيام المدفوعة بس في الـDay Pass المؤكد.” Observation bounded, hypothesis qualified, tangible visual system and true task card.
- **SUPPORTED B:** “في العينات دي بعض الناس مش بتيجي كل يوم. يمكن المرونة تهمهم؛ الـKV مكتب بيظهر بس في اليوم اللي الشخص يختاره، ومعاه طريقة استخدام الـDay Pass الفعلية.” Different execution can be defended; do not demand identical tagline.
- **PARTIAL A:** “الناس بتحب المرونة، نعمل بوست مريح.” Plausible direction but lacks evidence scope, tangible mechanism/product proof.
- **PARTIAL B:** “نصور شخص مبسوط في Coworking ومعاه Caption يومك بإيدك.” Has broad audience link but weak product action; coaching asks “إيه المختلف في Day Pass؟”.
- **UNSUPPORTED A:** “الـDay Pass مجاني ومتاح في أي مكان بالعالم.” Fabricated offer/location.
- **UNSUPPORTED B:** “العميل الفاشل اللي مش بيستخدم اشتراكه يستحق حملة عن الكسل.” Unsupported motive/judgment; no concept/product relevance.

## Boss — separate skills, same approved rubric
B01 checks facts from new crafts-fair props; B02 permits **more than one plausible motive** (revisit vs comparison) when tied to a distinguishing evidence request; B03 requires one of at least two viable Concept mechanisms bound to the organizer's **fictional verified booth map/item reference tool**, as defined in OBSERVATION-WORLD.md. A valid path must qualify the human interpretation and explain organizer action; a pure tagline or claim of guaranteed discount is unsupported. R-OBS-TRANSFER is a critical cross-context review gate, not a fake automatic “AI judgment”. Real Boss HP, save events, badges and schema fields await HQ.

## Independent acceptance
For EVERY authored slot, QA needs 2 independent defensible, 2 plausible partial, 2 unsupported responses; in particular multi-key B02 and Concept B03 must pass a second reviewer. If two reasonable reviewers disagree on the preferred answer, preserve both paths or tighten the question; do not punish creativity because it differs from a sample sentence.

# Error Taxonomy, Hint Sequences and Independent Semantic QA
Version: LEARN-QA@1.1-draft | Issue #3 | No claim of in-engine execution.

## Diagnostic error taxonomy (error ≠ player identity)
| Code | Error pattern | Evidence to detect | Coaching action / later transfer |
|---|---|---|---|
| OBS-E01 | INVENTED_MOTIVE | Claimed “they're anxious/lazy” without research | Mark hypothesis, request grounded quote; later protects Insight |
| OBS-E02 | CAUSAL_LEAP | Correlation/log count → because | Identify unmeasured cause; later protects performance claims |
| OBS-E03 | SCOPE_OVERREACH | “all/most/always” outside sample | Show denominator, segment, channel, date; later segmentation |
| OBS-E04 | FACT_INFERENCE_CONFUSION | Labels a guessed reason as Observation | Place statements into evidence vs possible explanation |
| OBS-E05 | MISSING_DENOMINATOR | Uses clicks as conversions, rates without base | Build metric ledger and label unknown; later campaign testing |
| OBS-E06 | DISMISSED_COUNTEREXAMPLE | Ignores contradictory record | Bound statement; name exceptions; later research synthesis |
| OBS-E07 | FALSE_SOURCE / WRONG_TRACE | Misquotes evidence ID or invents a new fact | Link claim-to-source explicitly; later RTB |
| OBS-E08 | COSMETIC_REPAIR | Rephrases same speculative promise | Strip and rebuild from supported facts; later brief repair |
| OBS-E09 | NON_DISCRIMINATING_TEST | Asks a leading or irrelevant question | Compare rival hypotheses and what measurement separates them |
| OBS-E10 | TEMPLATE_TRANSFER | Recycles old phrase with new brand labels | Explain new source/constraint before drafting |
| OBS-E11 | LINGUISTIC_FALSE_NEGATIVE | Accurate Egyptian paraphrase misses keyword list | Accept meaning in reviewed open response; QA test counterexamples |
| OBS-E12 | SELF_REVIEW_MISLABEL | Checkbox / ChatGPT claim reported as verified mastery | Label unverified and request independent rubric review |
| OBS-E13 | ACCIDENTAL_PATTERN_CLUE | Same correct option position or obvious “أكيد/كل” trick | Rewrite plausible wrong reasoning without absurd villains |
| OBS-E14 | UNFAIR_ANSWER_KEY | Two defensible correct readings but one key | Allow multiple supported keys or add evidence/constraint |
| OBS-E15 | STYLE_OVER_SUBSTANCE | Fancy visual idea substituted for evidence | Recenter claim and product proof; later Concept/Art Direction |

## Hints: same ladder, diagnostic content
- H1 clarify cognitive verb only: “المهمة هنا توصف فعل، ولا تفسّر السبب؟”
- H2 source anchor: show relevant E-ID and what it literally records, without telling final choice.
- H3 contrast: present one plausible but overreaching claim next to one bounded **parallel** example; let player identify why.
- H4 remediation: change context and evidence format, repeat SAME target skill, explain decision after the attempt.
The script must reflect the error code:
  - OBS-E03: “قول كام شخص، فين وإمتى؛ متعممش على كل الجمهور.”
  - OBS-E05: “الـQR scans مش معناها registrations؛ فين سجل الإتمام؟”
  - OBS-E06: “في سجل مخالف، هتضيّق جملتك لإيه؟”
  - OBS-E09: “السؤال ده هيفرق إزاي بين الاحتمالين؟”
  - OBS-E11: “المعنى صحيح؛ الصياغة مختلفة. مش هنعاقبك على اللهجة.”
No auto-pass, reveal or XP inflation because hints were requested.

## Independent semantic QA checklist before approving ANY authored challenge
1. What EXACT new cognitive verb does it teach, distinct from previous 2 levels?
2. What observable action or decision changes for the player (not just brand/name/style)?
3. Which evidence IDs support each permissible answer? Can an auditor trace it without reading hidden intent?
4. Does the question ask for a fact, inference, hypothesis, next evidence, or creative application? Is that labeled?
5. Are at least two **independently worded** supported answers defensible?
6. Are partially supported answers identified and coached, not merely marked all wrong?
7. Can two rational reviewers reach different keys? If yes, add constraint or accept multiple.
8. Do distractors reflect plausible professional mistakes rather than obvious absurd claims?
9. Would answer-position, linguistic trigger, or repeated template let a player win without thinking?
10. Is an unsupported psychology/brand/product effect smuggled in as fact?
11. Would same task still be distinct if replaced by an unfamiliar brand/industry?
12. Do dialect, punctuation, inflection and English agency vocabulary affect scoring unfairly?
13. Does feedback explain the specific evidence-to-claim error and suggest the next cognitive action?
14. Is deterministic evaluation used only on objectively checkable finite answers?
15. Is the mastery label honest about self-report/optional discussion?
16. Does a later unknown context demonstrably reuse this skill?
17. If using a campaign in the private library, did the author abstract a mechanism without copying campaign IP or implying consumer outcome?
18. Was the rubric version and reason for item acceptance recorded?

## Scenario-signature anti-duplicate rule
For each authored item register:
primary skill | cognitive verb | evidence shape | uncertainty/contradiction | constraint | player output | likely misconception | later transfer | sector.
Two levels are **semantic near-duplicates** when at least the cognitive verb, evidence shape, uncertainty type, required decision and misconception are effectively the same. Different products, proper nouns, pictures, score positions or reordered choices do NOT rescue a duplicate. Revisit is permitted when explicitly tagged RETRIEVAL and at least one context and evidence constraint changes. Record intentional reprise plus timing. Count “unique cognitive operations” using signatures, not JSON kind labels.

## Desk-based contrasting answer trials (not AI grading)
These are **fictional W01 cases** aligned to Game Director's approved-for-prototype creative GDD. Answer trials are hand-authored rubric examples and NOT independent learner tests. All final authored items require two QA reviewers and 2 supported/2 partial/2 unsupported samples each.

### L07 / Board-game shop (Interview)
Given E1: customer reads board-game rules, E2: some leave without purchase; reasons unmeasured.
- S1 **SUPPORTED**: “احكيلي عن آخر لعبة قريت قواعدها في المحل ومشتريتهاش، حصل إيه بعدها؟” Non-leading episodic interview; ALT=2.
- S2 **SUPPORTED**: “كنت بتدور على إيه في طريقة اللعب، وإيه اللي خلاك تختار اللعبة أو تسيبها؟” Contrasts goals/decision, no assumed reason; ALT=2.
- P1 **PARTIAL**: “هل القواعد صعبة؟” Anchors one possibility but leading; ALT=1.
- P2 **PARTIAL**: “ليه مش بتشتري؟” Relevant but misses incident/other explanations; ALT=1.
- U1 **UNSUPPORTED**: “فهمنا إزاي صعوبة القواعد منعتك من الشراء.” Presupposes unverified causal claim; ALT=0.
- U2 **UNSUPPORTED**: “الناس الغبية مبتفهمش الألعاب” Invents audience psychology, broadens sample, demeaning; ALT=0, SCOPE=0.
Any neutral, relevant question that distinguishes explanations can pass even if words differ.

### L09 / Coworking (guided brand/Concept preview)
Given E1/E2: some monthly subscribers visit only a few days; fictional Product Truth: per-day access pass exists (only for this practice brief).
- S1 **SUPPORTED**: “في العينات دي فيه ناس بتستخدم الاشتراك أيام قليلة؛ احتمال الاشتراك المرن يناسبهم. فكرة KV: التقويم بيظهر الأيام اللي بتدفعها بالفعل بفضل الـDay Pass.” Evidence bounded, mechanism visible, true task product fact.
- S2 **SUPPORTED**: “بعض المشتركين بيزوروا المكان بشكل متقطع؛ مش متأكدين السبب. Concept: مكتب بيتكوّن فقط يوم استخدامه، والـDay Pass هو اللي يسمح بده.” Alternative tangible visual premise; question if claim implies unsupported additional features before approving.
- P1 **PARTIAL**: “ممكن المرونة تكون مهمة. نعمل بوست شكله Premium.” Hypothesis caveat but no mechanism/product contribution.
- P2 **PARTIAL**: “نجرب KV لشخص مبسوط مع شعار يومك في إيدك.” Sensible mood but generic brand integration.
- U1 **UNSUPPORTED**: “الـDay Pass مجاني ومتاح في أي مدينة.” Fabricated offer.
- U2 **UNSUPPORTED**: “كل أصحاب الاشتراكات كسالى ولازم نكسفهم.” Unsupported motive, universal claim, unfit concept.
No R-PREV positive score certifies actual Concept or Brand Role mastery.

### Boss B02 / B03 — Craft fair
Given E1 some visitors photographed objects; E2 some recorded item numbers; E3 some moved on and later returned. A **fictional** organizer confirms an actual booth map and item-reference tool. Neither comparison nor memorializing is established as true.
- S1 **SUPPORTED**: Possible Insight “يمكن بيقارنوا قطع مختلفة” + non-leading “إيه اللي كنت بتدور عليه لما صورت القطعة؟” + Concept “Compare Craft Trail” records item code and verified map. Subject to mechanism feasibility; supports B02 and B03.
- S2 **SUPPORTED**: Potential Insight “ممكن بيحاولوا يفتكروا القطعة ويرجعولها” + inspect consented revisit behavior or interview + “Bookmark the Craft” item-code/map return action. Independent defensible route.
- P1 **PARTIAL**: “الزوار محتارين، نعمل كارت جميل.” Plausible hypothesis asserted too firmly; no coherent brand-action or test.
- P2 **PARTIAL**: “نشرح إن الناس بتحب الصور؛ عشان كده نعمل Booth Map.” Real tool but no traceable route from specific evidence to motive or idea.
- U1 **UNSUPPORTED**: “كل الزوار بيصوروا عشان الأسعار غالية، فنضمن لهم خصم 70%.” Unsupported psychology and fabricated discount.
- U2 **UNSUPPORTED**: “نعمل Poster بالأسود والدهبي ونعتبره Concept.” Cosmetic direction only, no evidence/method/product role.
B02 MUST accept both hypotheses when caveated with discriminating evidence. B03 MUST accept two truly independent justified concepts after human/rubric review, not a single magic correct phrase. Directly rating creative originality through keyword spotting is forbidden.

## Failure log — authored-item QA findings
| ID | Source | Failure | Severity | Reproduction / rewrite required | Status |
|---|---|---|---|---|---|
| QA-001 | Legacy level 1 check() | Valid “بتاخد كتب وترجعها…” misses 2nd keyword group | BLOCKER | Replace open-text keyword pass with rubric / structured evidence tasks | CONFIRMED SOURCE-LEVEL |
| QA-002 | Legacy level 1 check() | Unsupported “كل اللي بيبدأوا كتب… أغبياء” passes substring checks | BLOCKER | Add semantic review; no trusted mastery from lexical hit | CONFIRMED LOCAL REPLICATION |
| QA-003 | Legacy normal interact() | All 9 world-1 tasks route to old free-text version | BLOCKER | Engine normal flow must use approved slot map; test direct and walking paths | CONFIRMED SOURCE-LEVEL |
| QA-004 | Worlds 5–10 | Six worlds share nine-slot kind sequence | IMPORTANT | Require cognitive-operation novelty beyond kind variation | CONFIRMED STRUCTURAL |
| QA-005 | Boss / write mode | Manual completion may be represented as mastery | BLOCKER | Separate narrative completion from verified evidence status | CONFIRMED SOURCE-LEVEL |
| QA-006 | Creative-aligned L09 / Boss preview | Invented product truth might be mistaken for real brand capability | IMPORTANT | Clearly flag Day Pass, booth map/item reference as fictional exercise facts; require separate product proof in real work | DESIGN-RISK OPEN |
| QA-007 | Legacy content all 90 encounters | Full pairwise semantic equivalence not individually double-reviewed | IMPORTANT | Independent audit with full text + second reviewer before migration | NOT RUN |
| QA-008 | Next ChallengeSpec interface | Versioned rubric ID serialization and event handling absent | BLOCKER | HQ approves schema + QA adds contract tests | BLOCKED ON HQ |

## Acceptance / tests
Verified by code reading/source-level test: 100-node census, format counts, first-world routing and lexical failure cases. Proposed learning examples above are **manual desk adjudications**, not executed tests. Automated content validation, two-reviewer agreement, build, browser/mobile gameplay, Boss integration and AI semantic evaluation: NOT RUN. If an independently reviewed item fails fairness, log criterion, sample responses, disputed wording and actionable rewrite; no “pass” solely from a confident model verdict.

# Error Taxonomy, Hint Sequences and Independent Semantic QA
Version: LEARN-QA@1.0-draft | Issue #3 | No claim of in-engine execution.

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

## Desk-based sample answer trials (not AI grading)
E07 fictional evidence (same 20 recorded visits over two days): E1 six after 18:00; E2 two before 10:00. Staff member mentioned one request for later hours.
- S1 SUPPORTED: “من الـ20 زيارة اللي اتسجلت في اليومين، 6 كانت بعد 6 مساءً و2 قبل 10 الصبح، ومفيش معلومات عن السبب.” TRACE=2, SCOPE=2.
- S2 SUPPORTED: “في العينة المحدودة، عدد الزيارات المسجلة بعد 6 أكبر من اللي قبل 10؛ السبب مش ظاهر من أوقات الدخول.” TRACE=2, SCOPE=2.
- P1 PARTIAL: “الناس بتيجي متأخر أكتر.” Omits sample/context; scope=1. Corrective: “مين؟ كام؟ وإمتى؟”
- P2 PARTIAL: “أكيد الشغل ممكن يأثر، والزيارات المسائية كانت 6.” Accurately cites one count but turns possible motive too close to fact; scope=1 / classify caution.
- U1 UNSUPPORTED: “جميع السكان بيكرهوا الصبح وعشان كده لازم نفتح طول الليل.” scope=0, false population/causal leap.
- U2 UNSUPPORTED: “سجلنا 60 زيارة ليلية، والناس طلبت ده.” trace=0, fabricated count.
For two defensible supported formulations, do NOT insist on one reference sentence.

E09 marketing transfer (140 QR scans, 18 completed registrations, one quote “جربت أشوف المواعيد”):
- S1: “فيه 140 scan و18 registration مسجلين، لكن البيانات وحدها مش بتثبت إن نفس الأشخاص عملوا الخطوتين.” SUPPORTED.
- S2: “ناس تفاعلت مع QR، وفيه تسجيلات مؤكدة، إنما سبب عدم التسجيل مش متقاس. نراجع الربط بين الأحداث.” SUPPORTED.
- P1: “الـQR كويس، بس الجمهور خايف من الزحمة.” PARTIAL: first fact imprecise, motive unsupported; ask for proof.
- P2: “لازم نستهدف شباب أكتر؛ عندنا 18 تسجيل.” PARTIAL: count true, targeting recommendation ungrounded.
- U1: “122 شخص رفضوا التسجيل بسبب الزحمة.” UNSUPPORTED: subtracting unmatched counts and inventing motive.
- U2: “كل الـ140 سجلوا فعليًا.” UNSUPPORTED: contradicts records.
A source bundle alone should not make the preferred marketing plan unique; credit warranted conservative decisions.

Boss B02 example:
- Supported: “الـ12 QR scans والـ4 registrations اتقاسوا بشكل منفصل؛ مش عارفين مين منهم كمل أو ليه.” 
- Partial: “الناس بتجرب QR ومش كلها بتسجل.” Can be acceptable if event linkage is clarified; currently requires qualification.
- Unsupported: “26 ناس رافضة المتحف لأن الـQR مش شغال.” Unsupported arithmetic/linkage/cause.
If this phase admits two defensible answers under available data, write explicit multi-key logic or accept human-reviewed response instead of forcing one keyword.

## Failure log — authored-item QA findings
| ID | Source | Failure | Severity | Reproduction / rewrite required | Status |
|---|---|---|---|---|---|
| QA-001 | Legacy level 1 check() | Valid “بتاخد كتب وترجعها…” misses 2nd keyword group | BLOCKER | Replace open-text keyword pass with rubric / structured evidence tasks | CONFIRMED SOURCE-LEVEL |
| QA-002 | Legacy level 1 check() | Unsupported “كل اللي بيبدأوا كتب… أغبياء” passes substring checks | BLOCKER | Add semantic review; no trusted mastery from lexical hit | CONFIRMED LOCAL REPLICATION |
| QA-003 | Legacy normal interact() | All 9 world-1 tasks route to old free-text version | BLOCKER | Engine normal flow must use approved slot map; test direct and walking paths | CONFIRMED SOURCE-LEVEL |
| QA-004 | Worlds 5–10 | Six worlds share nine-slot kind sequence | IMPORTANT | Require cognitive-operation novelty beyond kind variation | CONFIRMED STRUCTURAL |
| QA-005 | Boss / write mode | Manual completion may be represented as mastery | BLOCKER | Separate narrative completion from verified evidence status | CONFIRMED SOURCE-LEVEL |
| QA-006 | First-world curriculum proposal | Evidence dates and denominator could be read ambiguously | IMPORTANT | QA approve one shared 20-visit sample and exact E-IDs before Writer authors task | DESIGN-RISK OPEN |
| QA-007 | Legacy content all 90 encounters | Full pairwise semantic equivalence not individually double-reviewed | IMPORTANT | Independent audit with full text + second reviewer before migration | NOT RUN |
| QA-008 | Next ChallengeSpec interface | Versioned rubric ID serialization and event handling absent | BLOCKER | HQ approves schema + QA adds contract tests | BLOCKED ON HQ |

## Acceptance / tests
Verified by code reading/source-level test: 100-node census, format counts, first-world routing and lexical failure cases. Proposed learning examples above are **manual desk adjudications**, not executed tests. Automated content validation, two-reviewer agreement, build, browser/mobile gameplay, Boss integration and AI semantic evaluation: NOT RUN. If an independently reviewed item fails fairness, log criterion, sample responses, disputed wording and actionable rewrite; no “pass” solely from a confident model verdict.

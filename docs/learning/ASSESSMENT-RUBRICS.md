# Assessment Rubrics (v1.0-draft)
Issue #3 | Learning owner: rubric definition | HQ owns schema/progression integration.
Core rule: a rubric is a **human review standard**, not a semantic AI evaluator. Correct keyword combinations do not prove creative reasoning. All fictional learning data must be clearly presented as simulated.

## Versioned rubric IDs (R-OBS v1.0)
| ID | Criterion | 2 — supported | 1 — partly supported | 0 — unsupported |
|---|---|---|---|---|
| R-OBS-TRACE | Evidence trace | Correct claim tied to exact E-ID(s) and observed behavior | Relevant source but omits material context | Fabricates evidence or cites unrelated source |
| R-OBS-SCOPE | Bounds & uncertainty | Scope/denominator/sample/timing correctly delimited; unknown marked | Main claim plausible but overbroad/unclear denominator | Confident population, causal or universal claim with no proof |
| R-OBS-CLASS | Data vs inference | Reliably labels fact, possible inference, unsupported leap | Confuses one ambiguous item but explains uncertainty | Treats speculation as source-proven fact |
| R-OBS-REPAIR | Claim reconstruction | Replaces false premise with an accurate bounded statement, shows delta | Removes the worst claim but leaves a causal leap or weak scope | Cosmetic rewording that preserves original unproven claim |
| R-OBS-ALT | Alternative explanation / test | ≥2 plausible rival explanations *as hypotheses* and one discriminating evidence request | Only one alternative or a weak test | Claims a motive as established fact or asks a leading question |
| R-OBS-TRANSFER | New-context application | Uses same method in unfamiliar sector/format without copying example; explains next decision | Transfers the label but misses a new source constraint | Repeats an old “correct” sentence unrelated to new brief |
| R-OBS-CLEAR | Verifiable articulation | Precise Egyptian Arabic or English reasoning, sufficient to check | Understandable but ambiguous actor/action | Incoherent or non-actionable statement |
Score applicable rubric IDs only, with declared weights totaling 100 per task. Scoring formula: sum(weight × level/2), where level is 0/1/2. Structured multiple-choice scoring uses explicit option-to-criterion mappings authored in ChallengeSpec; free-text numerical scores require a named reviewer. Do not display “85% creative genius” or equate number with objective creative ability.

## Mandatory safeguards
A fabricated measurement, a false quote, an invented product capability, or an unsupported causal conclusion is a **critical failure** on the affected trace/scope item regardless of attractive language or final weighted score. A structured item must have one defensible key *given its evidence* OR accept multiple warranted choices; if two well-grounded readings are possible, rewrite prompt or key. No arbitrary penalty for spelling, dialect, accents, verbosity (unless user cannot identify the fact) or declining optional ChatGPT. No claim that one cultural/psychological interpretation is universal.

## World-1 learning slot rubric allocation (weights sum to 100)
| Slot | Criteria (weight) | Review mode | Pass meaning |
|---|---|---|---|
| E01 | CLASS 60, TRACE 40 | structured | Identifies fact vs invented motive |
| E02 | TRACE 55, SCOPE 45 | structured | Reads proportion and sample |
| E03 | TRACE 45, CLASS 35, SCOPE 20 | structured | Triangulates sources |
| E04 | SCOPE 50, CLASS 30, TRACE 20 | structured | Detects missing information |
| E05 | REPAIR 45, TRACE 35, SCOPE 20 | structured repair | Removes a false claim |
| E06 | TRACE 50, SCOPE 30, CLASS 20 | structured pair/sort | Preserves counterexample |
| E07 | TRACE 40, SCOPE 30, CLEAR 30 | rubric (free response) | Produces bounded, evidence-led Observation |
| E08 | ALT 45, SCOPE 30, TRACE 25 | structured plan choice + rubric reflection | Suggests discriminating evidence |
| E09 | TRANSFER 35, TRACE 25, SCOPE 20, ALT 20 | mixed structured + review | Applies method to new brief |
| B01 | CLASS 40, TRACE 40, SCOPE 20 | structured | Boss phase 1 discriminates claims |
| B02 | REPAIR 50, SCOPE 30, TRACE 20 | structured repair + review | Boss phase 2 repairs argument |
| B03 | TRANSFER 40, ALT 25, TRACE 20, SCOPE 15 | rubric + optional discussion | Boss phase 3 defends transfer |
Substitute long names via R-OBS- prefix. “Structured” means only the authored finite answers can be checked deterministically; open reasoning for the same step is formative and must not be deemed automatically verified. Stage success can drive Boss mechanics only through HQ-approved versioned ChallengeSpec.

## Three contrastive answer adjudications (fictional E07 exemplar)
Evidence: E1 records 6 of the same 20 parcel pickup visits after 18:00 across two observed days. E2 records 2 of those 20 visits before 10:00. E3 says staff reported one visitor asked for longer hours. These numbers are **simulated**, not market research.

**Supported — independently defensible (2/2 trace and scope):** “في الـ20 زيارة اللي اتسجلت على اليومين دول، 6 كانت بعد الساعة 6، و2 قبل الساعة 10. بياناتنا ما بتقولش ليه الناس اختارت المواعيد.” Quotes the right sample and refuses a motive.

**Supported alternate wording (2/2):** “السجلين بيبيّنوا زيارات في آخر اليوم أكثر من بداية اليوم في العينة المحدودة دي، بس مفيش بيانات كفاية نعمم على كل العملاء.” Less numerical detail, still source-bounded; should pass if exact counts were not explicitly required.

**Partially supported (1/2 scope):** “الناس غالبًا بتيجي بالليل أكتر.” Direction of sample is plausible, but sample/timing/scope omitted; ask for concrete numerator and what cannot be concluded.

**Unsupported (0/2 scope; critical):** “كل العملاء بيكرهوا الصبح وعشان كده لازم المحل يفتح طول الليل.” False universal motive and unproven business prescription, regardless of use of correct words.

## Boss: same rubric, not self-declared mastery
Phase 1 checks CLASS/TRACE/SCOPE with new data. Phase 2 evaluates REPAIR/SCOPE/TRACE from selected claim modifications and optional human-written explanation. Phase 3 applies TRANSFER/ALT/TRACE/SCOPE; result may be SELF_REVIEWED_UNVERIFIED unless actually reviewed. Boss HP state can animate deterministic criterion completion, but should never pretend optional free-text judgment was automatic.

## Structured versus reviewer responsibility
- Deterministic engine: compare explicitly keyed choices, exact evidence IDs, order constraints, validated counts. Report *which reasoning criterion* failed, not “wrong” generically.
- Rubric reviewer: interpret paraphrase, multiple defensible formulations, explanatory strength and meaningful tradeoffs; log reviewer/date/version/reason.
- ChatGPT manual copy/paste: optional coach; no secure callback or automatic grade. External scores cannot silently update verified skill status.
- Self-reflection: valid learning activity; untrusted mastery signal.
Before publication, test each item with 2 distinct supported, 2 plausible partial and 2 unsupported responses, including Egyptian dialect, English terms and a counterexample; independent second reviewer resolves ambiguous keys.

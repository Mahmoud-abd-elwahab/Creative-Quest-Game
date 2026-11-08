# Difficulty & Progression Rules (v1.0-draft)
Issue #3 | Scope: pedagogy, not implemented game-state behavior | HQ ChallengeSpec approval PENDING.

## Five difficulty bands: measurable cognitive changes
| Band | Operation | Evidence load | New decision demand | Example slot | What success proves |
|---|---|---|---|---|---|
| D1 Recognition | Identify direct observation vs interpretation | 2–3 short source statements; one obvious distractor | Select grounded statement, cite one source | E01–E02 | Can locate what is said/shown |
| D2 Diagnosis | Identify overclaim, contradiction, missing evidence | 3–4 mixed-source records; ≥1 tempting plausible inference | Explain specifically what a claim cannot establish | E03–E04 | Can detect evidence error |
| D3 Reconstruction | Repair and reconcile | 4–5 records with a counterexample or false generalisation | Rewrite a flawed claim while preserving supported facts | E05–E06 | Can change the reasoning, not wording alone |
| D4 Constrained Creation | Produce a bounded observation and research decision | 5–6 records, mixed sample/context, explicit 2–3 constraints | Draft a warranted statement; compare plausible reasons without asserting one | E07–E08 | Can create without evidence leap |
| D5 Transfer/Critique | Use method in new brief/medium and critique | New sector plus brief, 2 evidence formats, client pressure, missing product proof | Separate what is known/unknown and advise action | E09 + Boss phase 3 | Can act when context and surface cues change |
Increasing difficulty must add **cognitive load**, not visual noise, wordiness, time pressure or arbitrary fake trick answers. Exact evidence counts are design targets; QA may tune for accessibility. D5 must be solvable without advance knowledge of real brands.

## Per-encounter delta (no blind repetition)
- E01 identify ONE direct statement; E02 interpret scope of TWO numerical observations.
- E03 triangulate evidence across different source formats; E04 detect missing denominator/selection and refuse a tempting causal leap.
- E05 repair a false client conclusion; E06 integrate a counterexample and limit the audience segment.
- E07 create a source-referenced observation with constraints; E08 propose rival explanations and a discriminating question.
- E09 apply the entire observation discipline to an unfamiliar advertising brief; separate safe client-facing claim and proof required.
Boss phase 1 retrieves classification from unfamiliar material; phase 2 repairs the fake research finding against new evidence; phase 3 defends a new brief boundary and identifies a test. Boss is NOT three cosmetic forms of the same MC question.

## Decision rules: performance signals and trust
Define status for each skill and level attempt:
- NOT_ASSESSED: no answer.
- STRUCTURED_VERIFIED: answer correct under approved deterministic rules; valid only for precisely tested skill, NOT creativity generally.
- HUMAN_REVIEWED: named human reviewed a free answer against rubric, with criterion notes.
- SELF_REVIEWED_UNVERIFIED: user checked own answer; counts for exploration/provisional completion only.
- EXTERNAL_DISCUSSION_UNVERIFIED: optional ChatGPT conversation, result not trusted without authenticated bridge or human verification.
- NEEDS_SUPPORT: repeated evidence-backed misconception on structured tasks, or human rubric shows a critical error.

Store scenario ID, rubric version, cognitive operation signature, skill ID, mode, number of retries, hint count, selected evidence IDs, which criterion failed, and timestamp only if HQ schema/privacy approval. Do NOT store private-library text or grade free prose from keyword hits.

## Player progression (proposed; await HQ event contract)
1. Opening path E01→E09 is scaffolded, with optional practice (never punish a player who needs a retry).
2. After 2 incorrect **structured** attempts on the same criterion, offer one micro-remediation explaining the failure, then a different case with the same cognitive verb but different evidence type. Do not repeat identical answer options.
3. If 2 of the most recent 3 reliable structured items for skill OBS fail the same criterion, **recommend** revisit before raising cognitive band; replay is optional while exploration remains available. If self-review is the only signal, do not infer reliable mastery or automatically raise the band.
4. After a supported success, offer a later no-hint retrieval check in 2–4 encounters and after at least one later world transition. Schedule is a pragmatic design heuristic; tune by QA and learning outcomes.
5. When a player fails due to language complexity but cites correct evidence, rephrase the prompt; do not lower conceptual score. Egyptian Arabic variants and equivalent English technical terms must be accepted in human review.
6. Boss entry requires viewing/attempting 9 encounters; awarding VERIFIED_OBS_MASTERY additionally requires sufficient independent evidence (e.g., successful structured retrieval plus human-reviewed transfer). Self-report may open the narrative gate but cannot grant verified mastery. HQ must decide access/reward UX and migration rules.
7. A player reaching band D4/D5 with persistent unverified responses receives a visible “practice completed; skill not independently assessed” distinction, not a dishonest badge.

## Hint ladder (no answer leakage)
H0: full unaided try → H1 task reframe (“إنت بتثبت إيه بالظبط؟”) → H2 draw attention to evidence ID / context (“الكلام ده جاي من أنهي سجل؟”) → H3 contrast the nearest wrong claim with a safe structure → H4 worked **parallel scenario**, then retry with changed evidence. H4 is coaching, not automated pass. Later retrieval tasks should start without hints, and high hint use should be recorded as assisted performance.

## Wrong-answer behavior
Structured questions: criterion-specific reason + what evidence was ignored; let player try again. Free response: provide rubric with examples of supported, partially supported and unsupported reasoning, save as provisional until real review. Optional ChatGPT discussion is helpful feedback, not a game credential. Repeated wrong answers should unlock a different teaching modality (source-to-claim sketch, two-column comparison or mini-diagram) rather than more of the same text.

## Metrics to validate in playtests (not asserted outcomes)
First-attempt structured success; wrong-option rationale coverage; number of repeated misconception codes; optional revisit uptake; D5 transfer sample independently judged by 2 reviewers; disagreement resolution notes; time-on-task as usability, not intrinsic learning; abandon points. Compare task signatures and performance before raising content difficulty. If independent scoring agreement is low, rewrite the item or rubric rather than claiming players failed.

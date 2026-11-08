# G1 Challenge Overlay — Issue #35 handoff

**Status:** Implemented UI-owned TypeScript component + mock test harness; not yet mounted in the Phaser G1 entry or verified on a real Android device. PR to `cq/integration/vertical-slice`, never `main`.
**Baseline integration SHA:** `e5cf07b5d521d55afdd6b2a6b279a2e3e74d209a` (2026-11-08 14:13 Cairo task intake).
**HQ request:** PR #12 comments by Technical Producer, latest 2026-11-08T12:01:27Z; Issue #35. **Contract:** `src/contracts/v1.ts` CONTRACT_VERSION=1 at integration baseline.
**Creative/learning:** World 01 E01 = library Evidence Lens, inspect **two** witnessed behaviors, `R-OBS-CLASS` 60 and `R-OBS-TRACE` 40 in `LEARNING-SLOTS.v1.json`. Real authored content remains Content-team-owned; `mock/first-challenge.ts` is explicitly fictional fixture.

## Deliverables (all in `src/ui/`)

- `challenge-overlay.ts`: reusable native `<dialog>` module typed against `UIBridgeV1`. It consumes a caller-supplied `ChallengeSpecV1` (only OBS-W1-E01 multi-select in scope), renders evidence and options without untrusted innerHTML, and emits only contract `GameCommand`s.
- `challenge-overlay.css`: scoped RTL responsive styles, native form controls, focus contrast, 48px buttons, scrollable dialogs/sticky action area, 360px/landscape/safe-area/reduced-motion fallback.
- `mock/first-challenge.ts`, `mock/mock-bridge.ts`, `mock/index.html`, `mock/main.ts`: standalone mock Engine/assessment/receipt/availability fixture, not a production dependency.
- `mock/smoke.mjs`: Playwright Chromium checks: pause ack before opening, focus entry, keyboard Space on focused checkbox, exact-two choices, PARTIAL feedback and retry, hint, authoritative reward receipt, Escape/close/resume/focus return, save failure, no clipping at mobile360/desktop/landscape.
- `tsconfig.json`: scoped strict TS check (without root changes).
- `ISSUE-35-HANDOFF.md`: this file.

## Contract compatibility matrix

| Command/event | How this component uses it | Actual status |
| --- | --- | --- |
| `engine.pause.request` → `engine.paused(requestId)` | Open only **after** matching authoritative ack; focus heading after `showModal()`. | Consumed and simulated in Mock |
| `challenge.submit` → `assessment.recorded(requestId,result)` | Exact `challengeId` + request correlation, wait state, statuses TRY_AGAIN/PARTIAL/PASSED/NEEDS_REVIEW. | Consumed and simulated in Mock |
| `challenge.hint` | Dispatch once per hint; display authored `hintTiers` without claiming consumption receipt. | Sent, no hint ack exists |
| `reward.committed(requestId,receipt,xpTotal)` | Match request + challenge; **only** this event displays numeric XP. Duplicate receipt ignored. | Consumed and simulated in Mock |
| `save.failed` | Visible in-dialog alert (or outside if dialog not open), supersedes any XP-saved claim. | Consumed and simulated in Mock |
| `dialog.close.request` → `dialog.closed(requestId)` | Block native Escape close; remove dialog only after matching close ack. | Consumed and simulated in Mock |
| `engine.resume.request` → `engine.resumed(requestId)` | Keep focus restoration pending until ack, then return to original trigger. | Consumed and simulated in Mock |
| `GameSnapshotV1` | Only read via `bridge.snapshot()`; never mutate/copy into player/save state. | Supported |
| `dialog.opened`, `world.updated`, `boss.updated` | Not required for the first isolated E01 overlay. | Future integration |

**Trust:** `STRUCTURED_VERIFIED` applies to the **finite authored options** only. `SELF_REVIEWED_UNVERIFIED`, `EXTERNAL_DISCUSSION_UNVERIFIED`, `NOT_ASSESSED` and `HUMAN_REVIEWED` all have explicit wording. Narrative completion and mastery are not inferred from a button click. `save.failed` supersedes optimistic success copy. The UI owns no XP counter, rewards, game progression, Phaser scene or save storage.

## Exact host integration boundary

```ts
import { FirstChallengeOverlay } from '../../src/ui/challenge-overlay';
import type { UIBridgeV1, ChallengeSpecV1 } from '../../src/contracts/v1';

// HQ/Engine owns both the concrete UIBridge and the schema-validated ChallengeSpec.
// Construct once after Engine has mounted an accessible DOM root and actual trigger.
const overlay = new FirstChallengeOverlay({ mount: document.getElementById('ui-layer')!, bridge });
// AFTER a real world interaction has mapped a node to the authored E01 spec:
overlay.open(authoredE01 as ChallengeSpecV1, interactButton);
// UI sends pause; Engine replies engine.paused; only then DOM dialog opens.
// On closing, UI requests dialog.close and engine.resume; focus returns after resumed.
```

Example only — **NOT** a claim this is wired into `dev/g1/main.ts`. UI component imports its own CSS; Vite includes it in the consuming bundle. Only HQ can connect the actual G1 root entry after accepting PR.

## Known UIBridge v1 gaps for HQ decision

1. **Missing challenge payload delivery/open request event**: `GameEvent.dialog.opened` carries only `challengeId`, not validated `ChallengeSpecV1`; no `challenge.open.request` exists. The host MUST supply the approved spec and trigger to `open(spec, trigger)`. Request HQ a typed `ChallengeAvailable`/lookup flow or pass from Engine owner in integration adapter.
2. **No hint acknowledgment/policy**: `challenge.hint` emits command but no response payload; UI can present an authored hint, not assert its cost/consumption/usage count. Propose `challenge.hint.ready` with requestId, text/tier/usage, or an approved local-hint policy.
3. **No connection/capability/locked event**: UI exposes `setAvailability('ready'|'offline'|'locked')` for a *host-authoritative* signal only. It does not claim offline caching or infer availability from `navigator.onLine`.
4. **No evaluation pending/error response**: submission timeout produces a non-authoritative warning; a matching `assessment.recorded` is still needed. Propose `command.rejected` / `evaluation.failed` with requestId, retry semantics and command idempotency.
5. **Ambiguous reward vs persistence ordering**: `reward.committed` is expected only after durable save. If `save.failed` can arrive later for same request, UI hides the reward banner and warns. Engine must define exact transaction/receipt ordering.
6. **Close/resume ack sequencing**: UI waits `dialog.closed` before sending resume, restores focus only on matching `engine.resumed`. Engine must ensure `dialog.closed` event is always emitted for `dialog.close.request`, including rejected/canceled actions.
7. **Partial-answer recovery**: `AssessmentStatus.PARTIAL` conveys feedback, but there is no authored per-option correction/highlight payload; UI shows result text/error codes and retains selections for retry.
8. **Schema selection count**: no `minSelections/maxSelections` fields. For first structured case, UI derives the constant answer cardinality from uniformly sized `validAnswerSets` (does not reveal correct IDs). If cardinality differs/missing, it only requires at least one; HQ must approve typed selection constraints.

These are **interface requests, NOT changes to `src/contracts/`**.

## Test commands (from repository root)

```bash
npm ci
npx tsc --noEmit -p src/ui/tsconfig.json
# Run the mock server manually if inspecting interactively:
npx vite src/ui/mock --host 127.0.0.1 --port 4176 --base /
# Or Chromium smoke, after Playwright browser install:
npx playwright install chromium
node src/ui/mock/smoke.mjs
```

Expected browser screenshots from smoke under `src/ui/mock/evidence/g1-ui-{mobile360,desktop1280,landscape740}.png`. Do **not** mark screenshot/test PASS until executed and files inspected. The harness is **not** linked from published root HTML and its Mock UIBridge does not store data.

## Accessibility acceptance / QA

- Native modal `showModal()` only after `engine.paused`; first focus on heading, focus contained by browser; `cancel` intercepted until `dialog.closed`; restore opener only after `engine.resumed`.
- No global key handling; Space/Arrow in focused form controls are preserved. Legacy v0.4 P1 #14 is **not** silently fixed by this UI module.
- RTL Egyptian copy with English agency words isolated in `bdi` where fixed; authored copy inserted via `textContent` and can be mixed-direction.
- Buttons >= 48 CSS px, visible keyboard outline; no color-only feedback; response text/error codes and save failure announced; 360px mobile/landscape/short viewport scroll; safe areas; reduced-motion.
- No grading simulation in actual overlay; all Mock evaluation/outcomes explicitly demo-only.
- No root index.html / dev/g1/main.ts / engine / contracts / QA paths written. Full game, accessibility screen-reader pass, 200% zoom, touch on physical Android and deployment are separate QA gates.

## Status

- **Implementation:** TypeScript UI and mock harness committed on `cq/ui/g1-bridge`.
- **Source compatibility:** Type references match `src/contracts/v1.ts` baseline; actual isolated `tsc` and Playwright results must be reported from a successful run.
- **NOT DONE:** Integration wiring to real Engine (Engine #33 is independently owned), genuine screenshots / Android, full Boss/9 encounters and production release.

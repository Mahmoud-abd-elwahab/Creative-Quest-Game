# QA test matrix — v0.4 and migration forward

**Legend:** SRC = inspected code only; AUTO-NR = automated test authored, NOT RUN; MAN-NR = manual test not run; BLOCKED = environment/interfaces absent; FUTURE = migration feature absent. Never count AUTO-NR or BLOCKED as PASS.

| ID | Area / test | Target | Method | Current evidence/status |
| --- | --- | --- | --- | --- |
| S01 | HTML RTL / core UI IDs / canvas | Desktop + Android | Node source test | SRC: structural presence |
| S02 | Inline JS parses | Node V8 | Node vm.Script | SRC: parsed in V8 inspection; Node command not run |
| S03 | v0.4 storage key and fields | Both | Node source + browser | SRC; AUTO-NR for reload |
| S04 | PWA relative links and SW cache assets | Pages subpath | Node source | SRC only |
| S05 | Workflow builds Pages artifact at repo root | GH Actions | Source check | SRC only; deployed UI BLOCKED |
| B01 | Cold start, intro, canvas, uncaught JS errors | Chromium desktop | Playwright | AUTO-NR |
| B02 | Keyboard movement and interact range | Chromium desktop | Playwright | AUTO-NR |
| B03 | Actual level-1 encounter, wrong/right feedback, unlock | Chromium desktop | Playwright | AUTO-NR (right path authored; full wrong-path manual) |
| B04 | Save persists after reload and old started flag | Chromium desktop | Playwright | AUTO-NR |
| B05 | First Boss phase0 wrong and retry | Chromium desktop | Playwright | AUTO-NR |
| B06 | First Boss phase1 reload and phase2 progression | Chromium desktop | Playwright | AUTO-NR |
| B07 | First Boss finish/manual confirmation and state | Chromium desktop | Playwright | AUTO-NR; self-report NOT semantic grading |
| B08 | Space key in Arabic textarea | Chromium desktop | Playwright | AUTO-NR; P1 suspected from code |
| B09 | Modal focus entry and return | Chromium desktop | Playwright + manual SR | AUTO-NR; P1 suspected from code |
| B10 | Real touch action and Arabic dialog at 360px | Chromium mobile emulation | Playwright | AUTO-NR |
| B11 | Joystick pointer down/drag/release | Chromium desktop | Playwright | AUTO-NR |
| B12 | Repo Pages subpath resolves HTML, icon, manifest and SW | localhost mapped subpath | Playwright | AUTO-NR; NOT live Pages |
| B13 | SW cached offline reload | Chromium localhost | Playwright | AUTO-NR; NOT live Pages |
| M01 | Android portrait joystick ergonomics and action buttons | Midrange Android physical | Manual | MAN-NR |
| M02 | Android landscape/rotation/resizing and safe-area | Android physical | Manual | MAN-NR |
| M03 | RTL / English mix wrapping, 200%-zoom text, 360px clipping | Android + desktop | Manual | MAN-NR |
| M04 | WCAG contrast, focus visibility, focus trap, ESC, reduced motion | Keyboard + screen reader | Manual/axe | MAN-NR |
| M05 | 10 sequential levels, 3-phase Boss, hint/fail/retry fairness | Desktop + Android | Human playtest | MAN-NR |
| M06 | 100 levels: unique IDs, semantic duplication, progression and learning | Content inventory / rubric | Static + human | BLOCKED: signed schema/rubric pending |
| M07 | Sprite sheet dimensions, alpha, anchors, frame continuity | Atlas manifests + Android | Automated image parser + manual | BLOCKED: art manifests pending |
| M08 | World map collision, portals, accessible interact radius | Map fixtures and runtime | Automated geometry + playtest | BLOCKED: typed map contracts pending |
| M09 | Legacy-save migration valid, malformed, missing, duplicate, partially completed | HQ SaveState fixtures | Automated + browser | BLOCKED: migration adapter/fixtures pending |
| M10 | First Boss dedicated mechanics: inspect/challenge/construct, hints/pause/fail/retry | Signed BossSpec | State-matrix test | BLOCKED: new Boss hooks pending |
| M11 | Current TypeScript strict typecheck/build | New modular code | tsc/build | N/A in v0.4 (no package.json); FUTURE |
| M12 | JSON schema validation, unique IDs, dangling links | New content JSON | AJV/schema | N/A in v0.4; FUTURE |
| M13 | Visual asset manifest + transparency + missing files | New asset folders | Automated + manual | FUTURE |
| M14 | No runtime console/network errors | Live github.io release | Browser DevTools | BLOCKED: no reachable controlled live browser |
| M15 | Live Pages URL renders actual hero/first journey/reload | Same exact deployed SHA | Browser screenshot+video | BLOCKED |
| M16 | Cross-project PWA cache isolation | Pages same origin with portfolio | Browser/cache inspection | MAN-NR; P1 source risk |
| M17 | Clear cache/offline update from old to new release | Browser/PWA installed | Offline regression | MAN-NR |

## Executable baseline tests

Run 'node --test tests/legacy/v04-source.test.mjs' for **source contracts**.

For true Chromium tests, first install Playwright without changing package files: 'npm install --no-save --package-lock=false playwright', then 'npx playwright install chromium', then 'node --test tests/legacy/v04-browser.test.mjs'. The browser suite starts a localhost server mapped to /Creative-Quest-Game/ and writes a screenshot plus JSON browser error log per test under qa/evidence/runtime/. Missing Playwright generates SKIP, which **cannot** approve a release. The tests deliberately include two expected-red regressions (Space and dialog focus), so do not quietly quarantine them.

Run manually on a real 360px-class Android device and desktop; capture device model, OS, browser version, orientation, input type, screenshot/video, steps, observed and expected behavior and commit SHA. Pages must be checked **separately** on its actual live URL.

## Change-control principles

- QA only writes under tests/ and qa/.
- Do not change .github/workflows/, package.json, src/, public/ or governance docs in this PR.
- New tests consume HQ-approved contracts once merged; no test harness may directly mutate runtime state and then claim it followed a real player interaction.
- Diagnostic shortcuts are permitted only for seeded Boss phase inspection; level-1 test uses the visible real action button.

## Continuation addendum — executed source-level checks (not browser)

| New ID | Area | Executed proof | Remaining |
| --- | --- | --- | --- |
| S06 | 100 IDs, 10 worlds, title/evidence/prompt exact duplicates | V8 executed 3 original data-only inline scripts: 90 non-Boss + 10 Boss, exact 1–100 coverage, zero exact duplicate normalized title/evidence/prompt | Structural Node suite created but not run; semantic duplication remains human review |
| S07 | Option indices and authored Boss rubrics | V8 checked 63 structured non-Boss cases and 9 data Bosses with zero structural invalids | Real level progression and correct learning outcomes not proven |
| S08 | Space on TEXTAREA in global keydown handler | Isolated execution of exact callback: preventDefault=true (P1 reproduced at source-handler level) | Real desktop/mobile browser test blocked |
| S09 | Cache isolation across same GitHub Pages origin | Isolated execution of exact SW activate handler: deleted portfolio-cache-v1 + other-app-v2 (P1 reproduced at callback level) | Real browser SW activation blocked; do not test against personal user caches |
| S10 | Fail-closed QA gate | qa/run-v04-gate.sh added; expected-red test suite added; browser prerequisite test now explicitly fails if Playwright missing | Full Node command not run; HQ CI wiring pending |

The source-level isolated callbacks demonstrate the logic itself, but DO NOT substitute for full DOM, runtime, storage, screenshots, actual Pages or physical device checks. Evidence JSON: qa/evidence/v04-isolated-v8-2026-11-08.json. Browser attempt: Chromium 144 launched with explicit executable then localhost navigation blocked by administrator policy.

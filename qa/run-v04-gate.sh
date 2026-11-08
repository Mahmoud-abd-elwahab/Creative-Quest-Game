#!/usr/bin/env bash
# QA v0.4 release gate. HQ should run this as a separate CI check before release.
# A missing dependency or expected-red defect prevents a green result.
set -uo pipefail
cd "$(dirname "$0")/.."
mkdir -p qa/evidence/runtime
LOG="\${QA_GATE_LOG:-qa/evidence/runtime/v04-qa-gate.log}"
: > "$LOG"
printf 'Legacy QA gate UTC: %s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" | tee -a "$LOG"
printf 'Git HEAD: %s\n' "$(git rev-parse HEAD 2>/dev/null || echo no-git-checkout)" | tee -a "$LOG"
node --version 2>&1 | tee -a "$LOG"
FAILED=0
run_case() {
  printf '\n===== %s =====\n' "$1" | tee -a "$LOG"
  shift
  "$@" 2>&1 | tee -a "$LOG"
  rc=\${PIPESTATUS[0]}
  printf 'EXIT_CODE=%s\n' "$rc" | tee -a "$LOG"
  if [ "$rc" -ne 0 ]; then FAILED=1; fi
}
run_case 'SOURCE + CONTENT + EXPECTED-RED SAFETY' node --test \
  tests/legacy/v04-source.test.mjs \
  tests/legacy/v04-content.test.mjs \
  tests/legacy/v04-safety-regressions.test.mjs
run_case 'CHROMIUM BROWSER SMOKE (NO SKIP-AS-PASS)' node --test \
  tests/legacy/v04-browser.test.mjs
printf '\n===== QA GATE RESULT: %s =====\n' \
  "$([ "$FAILED" -eq 0 ] && echo PASS || echo FAIL)" | tee -a "$LOG"
exit "$FAILED"

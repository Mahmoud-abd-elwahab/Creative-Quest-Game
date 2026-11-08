#!/usr/bin/env bash
# Independent G1 acceptance; HQ owns CI wiring. Run with bash on PR checkout.
set -uo pipefail
cd "$(dirname "$0")/.."
mkdir -p qa/evidence/g1/runtime
LOG=qa/evidence/g1/runtime/g1-qa-commands.log
: > "$LOG"
printf 'QA G1 UTC %s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" | tee -a "$LOG"
printf 'Target git SHA: %s\n' "$(git rev-parse HEAD 2>/dev/null || echo UNAVAILABLE)" | tee -a "$LOG"
printf 'Node: %s\n' "$(node -v)" | tee -a "$LOG"
FAILED=0
run_test() {
  label="$1"; shift
  printf '\n### %s\n' "$label" | tee -a "$LOG"
  "$@" 2>&1 | tee -a "$LOG"
  rc=${PIPESTATUS[0]}
  printf 'EXIT %s: %s\n' "$label" "$rc" | tee -a "$LOG"
  if [ "$rc" -ne 0 ]; then FAILED=1; fi
}
run_test install npm ci --no-audit --fund=false
run_test typecheck npm run typecheck:g1
run_test build npm run build:g1
run_test chromium-install npx playwright install chromium
run_test official-boot npm run smoke:g1
run_test official-e01 npm run smoke:play:g1
run_test independent-contract node --test tests/g1/e01-contract-qa.test.mjs
run_test independent-browser node --test tests/g1/e01-browser-qa.test.mjs
if [ "$FAILED" -ne 0 ]; then
  echo 'QA G1 FAIL: CHANGES REQUIRED. No automatic release permission.' | tee -a "$LOG"
  exit 1
fi
echo 'Automated checks PASS only. Real Android and production release still require separate signoff.' | tee -a "$LOG"

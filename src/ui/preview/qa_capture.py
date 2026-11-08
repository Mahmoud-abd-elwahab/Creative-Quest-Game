#!/usr/bin/env python3
"""Standalone UI PREVIEW smoke (not the integrated game).

Requirements: pip install playwright; python -m playwright install chromium
Usage: python src/ui/preview/qa_capture.py [--output /tmp/cq-ui-captures]

Owns no gameplay state, does not access GitHub, and never writes to main.
This script tests only the on-disk standalone HTML/CSS/JS preview.
"""
from __future__ import annotations

import argparse
import json
import shutil
from pathlib import Path

from playwright.sync_api import sync_playwright


MATRIX = [
    ("android-360", 360, 800),
    ("android-390", 390, 844),
    ("landscape-740", 740, 360),
    ("desktop-1280", 1280, 800),
]
SCREENS = ("hud", "challenge", "weak", "success", "boss", "loading", "offline", "locked")


def check(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def run(output: Path) -> dict:
    root = Path(__file__).resolve().parent
    url = (root / "first-world.html").as_uri()
    check((root / "first-world.js").is_file() and (root / "first-world.css").is_file(),
          "Preview HTML/CSS/JS must be present next to this script")
    output.mkdir(parents=True, exist_ok=True)
    evidence = {"scope": "standalone preview (NOT integrated gameplay)",
                "screenshots": [], "checks": [], "failures": []}

    with sync_playwright() as api:
        executable = shutil.which("chromium") or shutil.which("chromium-browser")
        launch = {"headless": True, "args": ["--no-sandbox"]}
        if executable:
            launch["executable_path"] = executable
        browser = api.chromium.launch(**launch)
        try:
            for device, width, height in MATRIX:
                page = browser.new_page(viewport={"width": width, "height": height},
                                        device_scale_factor=1, reduced_motion="reduce")
                page.on("pageerror", lambda error: evidence["failures"].append(str(error)))
                for screen in SCREENS:
                    page.goto(url + "?screen=" + screen)
                    page.wait_for_load_state("load")
                    check(page.title().startswith("Creative Quest"), f"Title missing: {device}/{screen}")
                    check(page.evaluate("document.documentElement.scrollWidth <= innerWidth + 1"),
                          f"Horizontal overflow: {device}/{screen}")
                    if screen != "hud":
                        check(page.locator("#uxDialog").evaluate("(node) => node.open"),
                              f"Dialog missing: {device}/{screen}")
                        rect = page.locator("#uxDialog").bounding_box()
                        check(rect and rect["x"] >= -1 and rect["x"] + rect["width"] <= width + 1,
                              f"Dialog clipped: {device}/{screen}")
                        check(page.locator("#dialogTitle").evaluate("(node) => document.activeElement === node"),
                              f"Dialog heading not focused: {device}/{screen}")
                    target = output / f"{device}-{screen}.png"
                    page.screenshot(path=str(target), animations="disabled")
                    evidence["screenshots"].append(str(target))
                page.close()

            page = browser.new_page(viewport={"width": 360, "height": 800}, reduced_motion="reduce")
            page.goto(url + "?screen=hud")
            trigger = page.locator("#actionTrigger")
            trigger.focus()
            page.keyboard.press("Enter")
            check(page.locator("#uxDialog").evaluate("(node) => node.open"), "Action must open modal")
            check(page.locator("#dialogTitle").evaluate("(node) => document.activeElement === node"),
                  "Focus must enter native dialog")
            submit = page.locator('[data-preview-challenge]')
            check(submit.is_disabled(), "Submit initially disabled until 2 evidences")
            checks = page.locator(".evidence-choice")
            checks.nth(0).check()
            check(submit.is_disabled(), "One chosen evidence must not enable submit")
            checks.nth(1).check()
            check(submit.is_enabled(), "Two chosen evidences should enable sample feedback")
            check(checks.nth(2).is_disabled(), "Third check must be blocked at max 2 choices")
            submit.click()
            check("وصفت السلوك" in page.locator("#dialogContent").inner_text(),
                  "Correct fixture should show sample success feedback")
            page.keyboard.press("Escape")
            check(not page.locator("#uxDialog").evaluate("(node) => node.open"),
                  "Escape must close dialog")
            check(trigger.evaluate("(node) => document.activeElement === node"),
                  "Close must restore triggering action focus")
            evidence["checks"].append("Keyboard evidence interaction, Enter/Escape and focus return: PASS")

            page.goto(url + "?screen=boss")
            check(page.locator(".phase.locked").get_attribute("aria-disabled") == "true",
                  "Boss stage 3 must remain visibly locked")
            page.locator("#bossHypothesis").select_option("tentative")
            page.locator("#bossEvidence").select_option("follow-up")
            page.locator('[data-preview-boss]').click()
            check("مثال Feedback" in page.locator("#bossPreviewFeedback").inner_text(),
                  "Boss fixture must show illustrative feedback")
            check(page.locator(".phase.locked").count() == 1,
                  "Boss stage 3 must remain locked in preview")
            evidence["checks"].append("Boss Mirror native select + locked stage: PASS")
            page.close()
        finally:
            browser.close()
    evidence["checks"].append(f"Viewport matrix: {len(MATRIX)} sizes × {len(SCREENS)} screens = {len(evidence['screenshots'])} screenshots")
    check(not evidence["failures"], "Browser runtime errors: " + str(evidence["failures"]))
    return evidence


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", type=Path, default=Path("/tmp/cq-ui-captures"))
    args = parser.parse_args()
    try:
        results = run(args.output)
        print(json.dumps({"result": "PASS", **results}, ensure_ascii=False, indent=2))
    except Exception as exc:
        print(json.dumps({"result": "FAIL", "error": str(exc)}, ensure_ascii=False))
        raise

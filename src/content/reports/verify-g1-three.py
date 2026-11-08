#!/usr/bin/env python3
"""Issue #34: G1 authored W01 content checker. Does not judge open prose or runtime play."""
from __future__ import annotations

import copy
import importlib.util
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
LEVEL_DIR = ROOT / "src/content/levels"
LEARNING = ROOT / "docs/learning/LEARNING-SLOTS.v1.json"
INVENTORY = ROOT / "docs/learning/LEGACY-100-INVENTORY.md"
VERIFY_PATH = ROOT / "src/contracts/verify-v1.py"
EXPECTED = {
    "OBS-W1-E01": ("obs-w1-e01-inspect-library.json", "inspect", "multi-select", 1, 1),
    "OBS-W1-E02": ("obs-w1-e02-connect-nursery.json", "connect", "single-select", 1, 2),
    "OBS-W1-E03": ("obs-w1-e03-arrange-cinema.json", "arrange", "order", 2, 3),
}
# These are *test examples*, not an in-game semantic grader. The labels
# PARTIAL/UNSUPPORTED require reviewer judgement; the finite-key check only
# asserts that neither is spuriously marked as STRUCTURED_VERIFIED.
TRIALS = {
    "OBS-W1-E01": {
        "supported": [
            ["W1E01_ACT_A", "W1E01_ACT_B"],
            ["W1E01_ACT_B", "W1E01_ACT_C"],
        ],
        "partial": [
            ["W1E01_ACT_A"],
            ["W1E01_ACT_A", "W1E01_ACT_D"],
        ],
        "unsupported": [
            ["W1E01_ACT_D", "W1E01_ACT_E"],
            ["W1E01_ACT_E", "W1E01_ACT_F"],
        ],
    },
    "OBS-W1-E02": {
        "supported": [["W1E02_LINK_LOG"], ["W1E02_LINK_CALL"]],
        "partial": [["W1E02_LINK_RECEIPT"], ["W1E02_LINK_CARD"]],
        "unsupported": [["W1E02_LINK_OTHER"], ["W1E02_LINK_MOTIVE"]],
    },
    "OBS-W1-E03": {
        "supported": [
            ["W1E03_STEP_A0", "W1E03_STEP_A1", "W1E03_STEP_B0", "W1E03_STEP_B1", "W1E03_SCOPE"],
            ["W1E03_STEP_B0", "W1E03_STEP_B1", "W1E03_STEP_A0", "W1E03_STEP_A1", "W1E03_SCOPE"],
        ],
        "partial": [
            ["W1E03_STEP_A0", "W1E03_STEP_A1", "W1E03_SCOPE"],
            ["W1E03_STEP_B0", "W1E03_STEP_B1", "W1E03_STEP_A0", "W1E03_STEP_A1"],
        ],
        "unsupported": [
            ["W1E03_STEP_A1", "W1E03_STEP_A0", "W1E03_STEP_B1", "W1E03_STEP_B0", "W1E03_DISTRACTOR_CLAIM"],
            ["W1E03_STEP_A0", "W1E03_STEP_B1", "W1E03_STEP_B0", "W1E03_STEP_A1", "W1E03_DISTRACTOR_CLAIM"],
        ],
    },
}


def check():
    spec = importlib.util.spec_from_file_location("contract_verify_v1", VERIFY_PATH)
    assert spec is not None and spec.loader is not None
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)  # Runs HQ's own contract smoke fixtures as well.

    manifest = json.loads(LEARNING.read_text(encoding="utf-8"))
    assert manifest["version"] == "OBS-W1-SLOTS@1.1-draft", "Manifest changed: re-review required"
    slots = {s["slotId"]: s for s in manifest["slots"]}
    files = sorted(LEVEL_DIR.glob("*.json"))
    assert sorted(p.name for p in files) == sorted(x[0] for x in EXPECTED.values()), (
        "This first G1 batch should contain exactly three Challenges"
    )

    legacy = INVENTORY.read_text(encoding="utf-8")
    legacy_ids = [int(i) for i in re.findall(r"^\|\s*(\d+)\s*\|", legacy, re.MULTILINE)]
    assert len(legacy_ids) == 100 and set(legacy_ids) == set(range(1, 101)), (
        "Legacy inventory isn't the expected 100 IDs"
    )

    challenges = []
    for slot_id, (filename, interaction, mode, band, legacy_id) in EXPECTED.items():
        c = json.loads((LEVEL_DIR / filename).read_text(encoding="utf-8"))
        assert mod.verify(c)
        slot = slots[slot_id]
        assert c["slotId"] == slot_id
        assert c["legacyLevelId"] == legacy_id
        assert c["interaction"] == interaction and c["responseMode"] == mode
        assert c["difficultyBand"] == band == slot["difficultyBand"]
        assert c["primarySkill"] == slot["primarySkill"] == "OBS"
        assert c["cognitiveOperation"] == slot["cognitiveOperation"]
        assert c["rubricVersion"] == "OBS@1.1"
        assert {x["id"]: x["weight"] for x in c["rubric"]} == slot["weights"]
        assert c["secondarySkills"] == [], "No later-world mastery in E01-03"
        assert len(c["hintTiers"]) >= 3
        assert len(c["validAnswerSets"]) >= 2, "Must document multiple fair structured routes"
        assert all(x["source"] == "fictional" for x in c["evidence"])
        assert all(x["type"] in ("observation", "record", "hypothesis", "unknown") for x in c["evidence"])
        assert all("publicSource" not in x for x in c["evidence"])
        assert "PARTIAL" in c["feedbackByErrorCode"] and "SUCCESS" in c["feedbackByErrorCode"]
        assert all(
            not opt.get("errorCode") or opt["errorCode"] in c["feedbackByErrorCode"]
            for opt in c.get("options", [])
        ), "Some distractor codes have no explanatory feedback"
        assert c["novelty"].get("reviewOf") == f"legacy-L0{legacy_id}"
        if mode == "single-select":
            assert all(len(s) == 1 for s in c["validAnswerSets"])
        if mode == "multi-select":
            assert all(len(s) == 2 for s in c["validAnswerSets"])
        if mode == "order":
            assert all(len(s) == 5 for s in c["validAnswerSets"])
            assert all(s[-1] == "W1E03_SCOPE" for s in c["validAnswerSets"])
            assert all(s[0] + s[1] in ("W1E03_STEP_A0W1E03_STEP_A1", "W1E03_STEP_B0W1E03_STEP_B1") for s in c["validAnswerSets"])
        ids = set(x["id"] for x in c["evidence"] + c.get("options", []))
        assert all(set(s) <= ids for s in c["validAnswerSets"])
        valid = {tuple(s) if mode == "order" else tuple(sorted(s)) for s in c["validAnswerSets"]}
        trials = TRIALS[slot_id]
        assert all(len(trials[k]) >= 2 for k in ("supported", "partial", "unsupported"))
        for category, examples in trials.items():
            for answer in examples:
                key = tuple(answer) if mode == "order" else tuple(sorted(answer))
                assert (key in valid) == (category == "supported"), (
                    f"{slot_id} wrongly verifies example in {category}"
                )
        negative = copy.deepcopy(c)
        negative["rubric"][0]["weight"] += 1
        try:
            mod.verify(negative)
        except Exception:
            pass
        else:
            raise AssertionError("Expected rubric sum failure")
        negative = copy.deepcopy(c)
        negative["validAnswerSets"] = [["NONEXISTENT_OPTION_ID"]]
        try:
            mod.verify(negative)
        except Exception:
            pass
        else:
            raise AssertionError("Expected unknown option failure")
        challenges.append(c)
        print(f"PASS {slot_id}: schema, slot/rubric, options, response-mode, 2 supported + 2 partial + 2 unsupported finite-key examples")

    for key in ("id", "slotId", "scenarioId", "cognitiveOperation"):
        values = [c[key] for c in challenges]
        assert len(values) == len(set(values)), f"Cross-challenge duplicate: {key}"
    for key in ("fingerprint", "cognitiveSignature"):
        values = [c["novelty"][key] for c in challenges]
        assert len(values) == len(set(values)), f"Cross-challenge duplicate: novelty.{key}"
    all_eids = [e["id"] for c in challenges for e in c["evidence"]]
    all_oids = [o["id"] for c in challenges for o in c["options"]]
    assert len(all_eids) == len(set(all_eids)) and len(all_oids) == len(set(all_oids))
    public_content = json.dumps(challenges, ensure_ascii=False)
    assert not re.search(r"\b(?:EGC|EGF)-\d|Mahmoud-creative-library|adsoftheworld\.com", public_content, re.IGNORECASE), (
        "Private source provenance must not leak into public content"
    )
    assert not any("reward" in c for c in challenges), "Only Engine owns reward receipts"
    print("PASS: 3 unique challenges, source/answer IDs, cognitive signatures, 100 legacy numeric IDs inventory")
    print("NOT TESTED: independent human semantic dedup, actual UI event/node mapping, browser/mobile runtime, true learner cognition")


if __name__ == "__main__":
    check()

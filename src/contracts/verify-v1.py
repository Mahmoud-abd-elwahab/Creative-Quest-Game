#!/usr/bin/env python3
"""G0 contract smoke validator; not a semantic learning grader."""
import copy
import json
from pathlib import Path

from jsonschema import Draft202012Validator, FormatChecker

HERE = Path(__file__).resolve().parent
SCHEMA = json.loads((HERE / 'challenge-spec.v1.schema.json').read_text(encoding='utf-8'))
Draft202012Validator.check_schema(SCHEMA)
VALIDATOR = Draft202012Validator(SCHEMA, format_checker=FormatChecker())


def semantics(challenge):
    rubric = challenge['rubric']
    assert sum(r['weight'] for r in rubric) == 100, 'rubric weights must sum to 100'
    for entries, label in ((challenge['evidence'], 'evidence'), (challenge.get('options', []), 'option'), (rubric, 'rubric')):
        ids = [entry['id'] for entry in entries]
        assert len(ids) == len(set(ids)), f'duplicate {label} IDs'
    ids = {entry['id'] for entry in challenge['evidence'] + challenge.get('options', [])}
    for answer in challenge.get('validAnswerSets', []):
        assert set(answer) <= ids, 'answer references an unknown evidence/option ID'
    if challenge['responseMode'] == 'open-rubric':
        assert not challenge.get('validAnswerSets'), 'open prose must not have a fake deterministic key'
    return True


def verify(challenge):
    VALIDATOR.validate(challenge)
    semantics(challenge)
    return True


example = {
    'schemaVersion': 1, 'id': 'cq_obs_w01_e01', 'slotId': 'OBS-W1-E01',
    'scenarioId': 'fictional-library-visitor', 'worldId': 'observation',
    'legacyLevelId': 1, 'primarySkill': 'OBS', 'secondarySkills': [],
    'difficultyBand': 1, 'cognitiveOperation': 'inspect-library-loan-evidence',
    'interaction': 'inspect', 'responseMode': 'multi-select',
    'industry': 'Education', 'audience': 'visitors',
    'situation': 'Some books were returned partly read',
    'objective': 'Separate observed facts from motives',
    'productTruths': [], 'prompt': 'Choose the recorded facts from the clues',
    'evidence': [{'id': 'E01', 'text': 'Books returned unfinished', 'type': 'record', 'source': 'fictional'}],
    'options': [{'id': 'a', 'text': 'A verified return record'}, {'id': 'b', 'text': 'An unsupported motive'}],
    'validAnswerSets': [['a']], 'rubricVersion': 'OBS@1.1',
    'rubric': [{'id': 'R-OBS-CLASS', 'weight': 60}, {'id': 'R-OBS-TRACE', 'weight': 40}],
    'feedbackByErrorCode': {'UNSUPPORTED': 'Need source evidence first.'},
    'hintTiers': ['Inspect the loan records'],
    'novelty': {'fingerprint': 'obs-library-inspection', 'cognitiveSignature': 'inspect and identify recorded behavior'},
}
assert verify(example)
checks = 1
for field, bad in [('schemaVersion', 2), ('difficultyBand', 6), ('interaction', 'guess')]:
    broken = {**example, field: bad}
    try:
        verify(broken)
    except Exception:
        checks += 1
    else:
        raise AssertionError(f'Expected rejection for {field}')

broken = copy.deepcopy(example)
broken['evidence'][0]['source'] = 'externally-verified'
try:
    verify(broken)
except Exception:
    checks += 1
else:
    raise AssertionError('An external claim must have a public source')

broken = copy.deepcopy(example)
broken['rubric'][0]['weight'] = 70
try:
    verify(broken)
except AssertionError:
    checks += 1
else:
    raise AssertionError('Rubric sum !=100 must fail')

broken = copy.deepcopy(example)
broken['validAnswerSets'] = [['missing-id']]
try:
    verify(broken)
except AssertionError:
    checks += 1
else:
    raise AssertionError('Unknown answer ID must fail')

# Production authored JSON does not exist at G0. When it appears, check it fail-closed.
folder = HERE.parents[1] / 'content' / 'levels'
count = 0
if folder.exists():
    for f in sorted(folder.rglob('*.json')):
        payload = json.loads(f.read_text(encoding='utf-8'))
        challenges = payload if isinstance(payload, list) else [payload]
        for challenge in challenges:
            verify(challenge)
            count += 1
print(f'PASS: schema Draft2020-12 + {checks} valid/invalid contract fixtures; authored challenges validated: {count}')
if count == 0:
    print('NOT RUN: no authored content JSON exists in this checkout (no production content claim).')
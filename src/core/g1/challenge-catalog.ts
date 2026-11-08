import type {
  AssessmentResultV1, ChallengeAnswer, ChallengeSpecV1, GameEvent,
} from '../../contracts/v1.js';

/** The Content owner/HQ injects actual public ChallengeSpecV1 data; this file owns NO learning copy. */
export type ChallengeLookup = (id: string) => ChallengeSpecV1 | undefined;

export function validateChallengeSpec(spec: ChallengeSpecV1): void {
  if (spec.schemaVersion !== 1 || !spec.id || !spec.worldId ||
    !['single-select', 'multi-select', 'order'].includes(spec.responseMode)) {
    throw new Error('Unsupported or unversioned structured ChallengeSpec');
  }
  if (!Array.isArray(spec.options) || !spec.options.length ||
    !Array.isArray(spec.validAnswerSets) || !spec.validAnswerSets.length ||
    !spec.validAnswerSets.every(Array.isArray) ||
    !Array.isArray(spec.rubric) || !Array.isArray(spec.hintTiers) ||
    !spec.feedbackByErrorCode || typeof spec.feedbackByErrorCode !== 'object') {
    throw new Error('Structured ChallengeSpec requires options and valid answer sets');
  }
  const ids = new Set(spec.options.map(option => option.id));
  if (ids.size !== spec.options.length || ![...ids].every(id => !!id)) {
    throw new Error('Duplicate/empty authored option IDs');
  }
  if (!spec.validAnswerSets.every(set => set.length > 0 &&
    new Set(set).size === set.length && set.every(id => ids.has(id)))) {
    throw new Error('Invalid authored answer-set reference');
  }
  if (spec.responseMode === 'single-select' && spec.validAnswerSets.some(set => set.length !== 1)) {
    throw new Error('single-select answer sets must have exactly one ID');
  }
  if (!spec.rubric.length || new Set(spec.rubric.map(rule => rule.id)).size !== spec.rubric.length ||
    spec.rubric.reduce((total, rule) => total + rule.weight, 0) !== 100) {
    throw new Error('Invalid authored rubric weights/criterion IDs');
  }
}
/** Immutable verified catalog with no runtime fetch, private-library access or fallback to fixture. */
function deeplyFreeze<T>(value: T): T {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    for (const child of Object.values(value)) deeplyFreeze(child);
    Object.freeze(value);
  }
  return value;
}
export function createChallengeCatalog(specs: readonly ChallengeSpecV1[]): ChallengeLookup {
  const map = new Map<string, ChallengeSpecV1>();
  for (const candidate of specs) {
    validateChallengeSpec(candidate);
    if (map.has(candidate.id)) throw new Error('Duplicate authored challenge ID: ' + candidate.id);
    // Freeze stable identifiers, not caller-mutated nested arrays: snapshot the JSON data once.
    const spec = deeplyFreeze(JSON.parse(JSON.stringify(candidate)) as ChallengeSpecV1);
    map.set(spec.id, spec);
  }
  return id => map.get(id);
}
function identicalSet(input: readonly string[], expected: readonly string[]): boolean {
  return input.length === expected.length && input.every(id => expected.includes(id));
}
function prefix(input: readonly string[], expected: readonly string[]): boolean {
  return input.length <= expected.length && input.every((id, position) => expected[position] === id);
}
function subset(input: readonly string[], expected: readonly string[]): boolean {
  return input.every(id => expected.includes(id));
}
/** Rules are finite and deterministic; never infer motive/quality or grade open prose. */
export function evaluateAuthoredChallenge(
  spec: ChallengeSpecV1, requestId: string, answer: ChallengeAnswer, hintCount: number,
): AssessmentResultV1 {
  const common = {
    schemaVersion: 1 as const, challengeId: spec.id, attemptId: requestId,
    hintCount, masteryAwarded: false, narrativeCleared: false,
  };
  const response = spec.responseMode;
  const supported = response === 'order' ? answer.mode === 'order' : answer.mode === 'options';
  if (!supported) {
    return { ...common, status: 'NEEDS_REVIEW', trust: 'NOT_ASSESSED',
      criteria: [], errorCodes: ['UNSUPPORTED_MODE'],
      feedback: 'نوع الإجابة مش مناسب للتحدي. الإجابات المفتوحة محتاجة مراجعة واضحة، مش تقييم AI تلقائي.' };
  }
  const supplied = answer.mode === 'order' ? answer.orderedIds
    : answer.mode === 'options' ? answer.selectedIds : [];
  const options = new Map(spec.options?.map(opt => [opt.id, opt]) ?? []);
  if (!supplied.length || new Set(supplied).size !== supplied.length ||
      supplied.some(id => !options.has(id)) ||
      (response === 'single-select' && supplied.length !== 1)) {
    return { ...common, status: 'TRY_AGAIN', trust: 'STRUCTURED_VERIFIED',
      criteria: [], errorCodes: ['INVALID_CHOICE'],
      feedback: 'راجع عدد الاختيارات ورقم كل اختيار؛ مش مسموح بقيم مجهولة أو مكررة.' };
  }
  const sets = spec.validAnswerSets ?? [];
  const isOrder = response === 'order';
  const passed = sets.some(set => isOrder
    ? prefix(supplied, set) && set.length === supplied.length : identicalSet(supplied, set));
  const hasBadOption = supplied.map(id => options.get(id))
    .find(option => option?.errorCode);
  if (hasBadOption?.errorCode) {
    const code = hasBadOption.errorCode;
    return { ...common, status: 'TRY_AGAIN', trust: 'STRUCTURED_VERIFIED',
      criteria: spec.rubric.map(rule => ({ criterionId: rule.id, level: 0 as const,
        feedback: spec.feedbackByErrorCode[code] ?? 'اختيار غير مدعوم بالأدلة.' })),
      errorCodes: [code],
      feedback: spec.feedbackByErrorCode[code] ?? 'الدليل ده مش كفاية؛ راجع السجلات.' };
  }
  if (passed) {
    return { ...common, status: 'PASSED', trust: 'STRUCTURED_VERIFIED',
      narrativeCleared: true, masteryAwarded: false,
      criteria: spec.rubric.map(rule => ({ criterionId: rule.id, level: 2 as const,
        feedback: spec.feedbackByErrorCode.SUCCESS ?? 'Finite authored criteria satisfied.' })),
      errorCodes: [], feedback: spec.feedbackByErrorCode.SUCCESS ?? 'اتحل التحدي بنجاح.' };
  }
  const partial = sets.some(set => supplied.length < set.length &&
    (isOrder ? prefix(supplied, set) : subset(supplied, set)));
  if (partial) return { ...common, status: 'PARTIAL', trust: 'STRUCTURED_VERIFIED',
    criteria: spec.rubric.map(rule => ({ criterionId: rule.id, level: 1 as const,
      feedback: spec.feedbackByErrorCode.PARTIAL ?? 'Evidence incomplete.' })),
    errorCodes: ['PARTIAL'], feedback: spec.feedbackByErrorCode.PARTIAL ?? 'اختيار سليم لكن لسه ناقص.' };
  return { ...common, status: 'TRY_AGAIN', trust: 'STRUCTURED_VERIFIED',
    criteria: spec.rubric.map(rule => ({ criterionId: rule.id, level: 0 as const,
      feedback: spec.feedbackByErrorCode['OBS-E07'] ?? 'Check evidence relationships and sequence.' })),
    errorCodes: ['INVALID_COMBINATION'],
    feedback: spec.feedbackByErrorCode['OBS-E07'] ?? 'الترتيب أو التركيبة مش مدعومين بالمعلومات المعروضة.' };
}

/** Future HQ host wiring: GameEvent.dialog.opened -> catalog lookup -> overlay.openFromEngine(spec, trigger).
 *  No DOM or UI imports here. Only HQ/Content own the JSON import and node mapping.
 */
export type BridgeEvent = GameEvent;

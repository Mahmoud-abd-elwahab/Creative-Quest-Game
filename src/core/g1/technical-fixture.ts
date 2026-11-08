import type {
  AssessmentResultV1, ChallengeAnswer, WorldSpecV1,
} from '../../contracts/v1.js';

/** Diagnostic-only synthetic input. DO NOT count as authored W01 Level E01. */
export const DIAGNOSTIC_CHALLENGE_ID = 'g1-tech-fixture-clue-01';
export const DIAGNOSTIC_NODE_ID = 'g1-tech-clue-01';
export const DIAGNOSTIC_WORLD: WorldSpecV1 = {
  schemaVersion: 1, id: 'observation',
  widthPx: 1200, heightPx: 900, spawn: { x: 600, y: 748 },
  layers: { background: '', ground: '', props: '', foreground: '' }, // procedural placeholders
  collisions: [
    { id: 'stone-wall-west', kind: 'rect', rect: { x: 190, y: 390, width: 240, height: 140 } },
    { id: 'stone-wall-east', kind: 'polygon', vertices: [
      { x: 795, y: 390 }, { x: 1030, y: 400 }, { x: 1020, y: 535 }, { x: 790, y: 520 },
    ] },
  ],
  nodes: [{ id: DIAGNOSTIC_NODE_ID, kind: 'clue', position: { x: 600, y: 260 },
    radius: 105, challengeId: DIAGNOSTIC_CHALLENGE_ID }],
};
/** Only accepts two observable fictional evidence fragments, rejecting unsupported motives. */
export function evaluateTechnicalFixture(
  challengeId: string, requestId: string, answer: ChallengeAnswer, hintCount: number,
): AssessmentResultV1 {
  const common = { schemaVersion: 1 as const, challengeId, attemptId: requestId, hintCount,
    masteryAwarded: false, criteria: [] as AssessmentResultV1['criteria'] };
  if (challengeId !== DIAGNOSTIC_CHALLENGE_ID) {
    return { ...common, trust: 'NOT_ASSESSED', status: 'NEEDS_REVIEW', narrativeCleared: false,
      feedback: 'ChallengeSpec not loaded. This is only an Engine diagnostic route.', errorCodes: ['CONTENT_NOT_READY'] };
  }
  if (answer.mode !== 'options') {
    return { ...common, trust: 'NOT_ASSESSED', status: 'NEEDS_REVIEW', narrativeCleared: false,
      feedback: 'Free text requires a transparent rubric/human review; no automatic grading.', errorCodes: ['UNSUPPORTED_MODE'] };
  }
  const picks = new Set(answer.selectedIds);
  if (!picks.size || [...picks].some(id => !['visited', 'returned', 'assumed-motive'].includes(id))) {
    return { ...common, trust: 'STRUCTURED_VERIFIED', status: 'TRY_AGAIN', narrativeCleared: false,
      feedback: 'اختار دليل ظاهر من المشهد، مش إجابة فاضية أو اختيار غير معروف.', errorCodes: ['INVALID_CHOICE'] };
  }
  if (picks.has('assumed-motive')) {
    return { ...common, trust: 'STRUCTURED_VERIFIED', status: 'TRY_AGAIN', narrativeCleared: false,
      feedback: '«عشان خايفين» تفسير لدافع مش موجود في الأدلة. جرّب تاني.', errorCodes: ['UNSUPPORTED_ASSUMPTION'],
      criteria: [{ criterionId: 'R-OBS-CLASS', level: 0, feedback: 'Distinguish fact from hypothesis.' }] };
  }
  if (!picks.has('visited') || !picks.has('returned')) {
    return { ...common, trust: 'STRUCTURED_VERIFIED', status: 'PARTIAL', narrativeCleared: false,
      feedback: 'ملاحظة صح، لكن ناقص دليل تاني في الحالة. دور على التصرف اللي حصل بعد الزيارة.',
      errorCodes: ['MISSING_EVIDENCE'],
      criteria: [{ criterionId: 'R-OBS-TRACE', level: 1, feedback: 'One factual source identified.' }] };
  }
  return { ...common, trust: 'STRUCTURED_VERIFIED', status: 'PASSED', narrativeCleared: true,
    feedback: 'صح: في زيارات واتسجل رجوع. مفيش دليل يسمح نفترض السبب. +20 XP تجريبي.',
    errorCodes: [], criteria: [
      { criterionId: 'R-OBS-CLASS', level: 2, feedback: 'No unsupported assumptions.' },
      { criterionId: 'R-OBS-TRACE', level: 2, feedback: 'Two factual traces.' },
    ] };
}
export const DIAGNOSTIC_HINTS = [
  'شوف الأفعال اللي اتذكرت صراحة؛ ما تفترضش سبب نفسي.',
  'المعلومتين الظاهرتين: الشخص زار المكان، وبعد كده رجع مرة تانية.',
];

import type { ChallengeSpecV1 } from '../../contracts/v1';

/** Fictional library inspect case for *mock UI harness* only. Content team owns real W01 JSON. */
export const firstChallengeFixture: ChallengeSpecV1 = {
  schemaVersion: 1,
  id: 'cq-mock-obs-w1-e01',
  slotId: 'OBS-W1-E01',
  scenarioId: 'cq-mock-library',
  worldId: 'observation',
  legacyLevelId: 1,
  primarySkill: 'OBS',
  secondarySkills: [],
  difficultyBand: 1,
  cognitiveOperation: 'inspect-library-loan-evidence',
  interaction: 'inspect',
  responseMode: 'multi-select',
  industry: 'مكتبة عامة — حالة تدريب افتراضية',
  audience: 'زوار المكتبة',
  situation: 'في سجل استعارات المكتبة فيه ناس بدأت كتب ورجّعتها من غير ما تكمّلها.',
  objective: 'فرّق بين السلوك المرصود وبين تفسير غير مثبت ليه بيحصل.',
  productTruths: [],
  prompt: 'اختار دليلين من اللي حصل فعلًا. بلاش تفترض سبب نفسي أو نية.',
  evidence: [
    { id: 'source-return', text: 'إيصال مكتبة: استعارة كتابين وإرجاعهم قبل إكمال القراءة.',
      type: 'record', source: 'fictional' },
    { id: 'source-reads', text: 'سجل قراءة: بدأ بعض الزوار أول فصل في أكثر من كتاب ولم يكملوه.',
      type: 'record', source: 'fictional' }
  ],
  options: [
    { id: 'loan-return', text: 'بعض الزوار رجّعوا كتب قبل ما يخلصوها.' },
    { id: 'reading-start', text: 'بعض الزوار بدأوا كذا كتاب وما كمّلوش القراءة.' },
    { id: 'all-bored', text: 'كل اللي بيرجّع الكتب بدري زهقان من القراية.',
      errorCode: 'OVER_INTERPRETATION' }
  ],
  validAnswerSets: [['loan-return', 'reading-start']],
  rubricVersion: 'OBS@1.1-draft',
  rubric: [
    { id: 'R-OBS-CLASS', weight: 60 },
    { id: 'R-OBS-TRACE', weight: 40 }
  ],
  feedbackByErrorCode: {
    OVER_INTERPRETATION: 'الجملة بتفترض إن الناس زهقانة. مفيش دليل على الدافع.',
    NO_EVIDENCE: 'اختار سلوك تقدر ترجّعه لسجل أو شهادة.'
  },
  hintTiers: [
    'راقب الفرق بين «رجّع الكتاب» و«رجّعه عشان زهقان». التاني محتاج دليل إضافي.',
    'دور على الأفعال اللي اتسجّلت في المكتبة: بدأ أو رجّع، مش النوايا.'
  ],
  novelty: {
    fingerprint: 'mock-library-inspect-two-records',
    cognitiveSignature: 'inspect-observed-behavior-vs-unsupported-motive'
  }
};

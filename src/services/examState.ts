import Question from '@/types/Question';

export type SavedExamState = {
  version: 2;
  subjectId: number;
  mode: string;
  questionIds: number[];
  answers: [number, string][];
  time: number;
  currentQuestionIndex: number;
  savedAt: number;
  n_of_questions?: number;
  penalizing_factor?: number;
  filter?: string;
};

type CreateSavedExamStateInput = {
  subjectId: number;
  mode: string;
  questions: Question[];
  answers: Map<number, string>;
  time: number;
  currentQuestionIndex: number;
  nOfQuestions?: string | null;
  penalizingFactor?: string | null;
  filter?: string | null;
};

export function createSavedExamState(input: CreateSavedExamStateInput): SavedExamState {
  const nOfQuestions = parseOptionalNumber(input.nOfQuestions);
  const penalizingFactor = parseOptionalNumber(input.penalizingFactor);

  return {
    version: 2,
    subjectId: input.subjectId,
    mode: input.mode,
    questionIds: input.questions.map((question) => question.id),
    answers: Array.from(input.answers.entries()),
    time: input.time,
    currentQuestionIndex: input.currentQuestionIndex,
    savedAt: Date.now(),
    ...(nOfQuestions === undefined ? {} : { n_of_questions: nOfQuestions }),
    ...(penalizingFactor === undefined ? {} : { penalizing_factor: penalizingFactor }),
    ...(input.filter ? { filter: input.filter } : {})
  };
}

export function parseSavedExamState(
  value: unknown,
  expectedSubjectId: number,
  expectedMode: string
): SavedExamState | null {
  if (!isRecord(value) || value.version !== 2) return null;
  if (value.subjectId !== expectedSubjectId || value.mode !== expectedMode) return null;
  if (!Array.isArray(value.questionIds) || value.questionIds.length === 0) return null;

  const questionIds = value.questionIds.filter(isPositiveInteger);
  if (
    questionIds.length !== value.questionIds.length ||
    new Set(questionIds).size !== questionIds.length
  ) {
    return null;
  }

  if (!Array.isArray(value.answers) || value.answers.length > questionIds.length) return null;
  const questionIdSet = new Set(questionIds);
  const seenAnswers = new Set<number>();
  const answers: [number, string][] = [];
  for (const answer of value.answers) {
    if (!Array.isArray(answer) || answer.length !== 2) return null;
    const [questionId, selectedOption] = answer;
    if (
      !isPositiveInteger(questionId) ||
      !questionIdSet.has(questionId) ||
      seenAnswers.has(questionId) ||
      typeof selectedOption !== 'string' ||
      !/^[A-Za-z0-9]$/.test(selectedOption)
    ) {
      return null;
    }
    seenAnswers.add(questionId);
    answers.push([questionId, selectedOption.toUpperCase()]);
  }

  if (!isIntegerBetween(value.time, 0, 8 * 60 * 60)) return null;
  if (!isIntegerBetween(value.currentQuestionIndex, 0, questionIds.length - 1)) return null;
  if (typeof value.savedAt !== 'number' || !Number.isFinite(value.savedAt)) return null;

  const nOfQuestions = value.n_of_questions;
  if (nOfQuestions !== undefined && !isIntegerBetween(nOfQuestions, 5, 50)) return null;
  const penalizingFactor = value.penalizing_factor;
  if (
    penalizingFactor !== undefined &&
    (typeof penalizingFactor !== 'number' || penalizingFactor < 0 || penalizingFactor > 1)
  ) {
    return null;
  }
  if (expectedMode === 'custom' && (nOfQuestions === undefined || penalizingFactor === undefined)) {
    return null;
  }
  if (
    value.filter !== undefined &&
    (typeof value.filter !== 'string' || value.filter.length > 100)
  ) {
    return null;
  }

  return {
    version: 2,
    subjectId: expectedSubjectId,
    mode: expectedMode,
    questionIds,
    answers,
    time: value.time,
    currentQuestionIndex: value.currentQuestionIndex,
    savedAt: value.savedAt,
    ...(nOfQuestions === undefined ? {} : { n_of_questions: nOfQuestions }),
    ...(penalizingFactor === undefined ? {} : { penalizing_factor: penalizingFactor }),
    ...(value.filter === undefined ? {} : { filter: value.filter })
  };
}

export function getResumeSearchParams(state: SavedExamState): URLSearchParams {
  const params = new URLSearchParams({ resume: 'true' });
  if (state.n_of_questions !== undefined) {
    params.set('n_of_questions', state.n_of_questions.toString());
  }
  if (state.penalizing_factor !== undefined) {
    params.set('penalizing_factor', state.penalizing_factor.toString());
  }
  if (state.filter) params.set('filter', state.filter);
  return params;
}

export function getLocalExamStateKey(subjectId: number, mode: string): string {
  return `exam-state-${subjectId}-${mode}`;
}

function parseOptionalNumber(value: string | null | undefined): number | undefined {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isPositiveInteger(value: unknown): value is number {
  return isIntegerBetween(value, 1, Number.MAX_SAFE_INTEGER);
}

function isIntegerBetween(value: unknown, minimum: number, maximum: number): value is number {
  return Number.isInteger(value) && Number(value) >= minimum && Number(value) <= maximum;
}

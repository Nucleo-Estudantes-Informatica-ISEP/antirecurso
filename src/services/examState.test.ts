import { describe, expect, it } from 'vitest';

import { getResumeSearchParams, parseSavedExamState } from './examState';

const validState = {
  version: 2,
  subjectId: 7,
  mode: 'custom',
  questionIds: [11, 12],
  answers: [[11, 'a']],
  time: 42,
  currentQuestionIndex: 1,
  savedAt: 1_000,
  n_of_questions: 5,
  penalizing_factor: 0.25,
  filter: 'all'
};

describe('saved exam state', () => {
  it('accepts a bounded v2 state and restores custom configuration', () => {
    const state = parseSavedExamState(validState, 7, 'custom');

    expect(state?.answers).toEqual([[11, 'A']]);
    expect(getResumeSearchParams(state!).toString()).toBe(
      'resume=true&n_of_questions=5&penalizing_factor=0.25&filter=all'
    );
  });

  it('rejects stale shapes, identity mismatches, and answers outside the question set', () => {
    expect(parseSavedExamState({ ...validState, version: 1 }, 7, 'custom')).toBeNull();
    expect(parseSavedExamState(validState, 8, 'custom')).toBeNull();
    expect(parseSavedExamState({ ...validState, answers: [[99, 'A']] }, 7, 'custom')).toBeNull();
  });
});

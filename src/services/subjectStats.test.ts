import { afterEach, describe, expect, it, vi } from 'vitest';

import type { SubjectStats } from '@/types/SubjectStats';
import { fetchSubjectStats, getSubjectStatsViewModel } from './subjectStats';

function stats(overrides: Partial<SubjectStats> = {}): SubjectStats {
  return {
    n_of_answers: 100,
    n_of_answered: 7,
    total_of_questions: 10,
    n_of_wrong_answers: 2,
    n_of_correct: 5,
    n_of_exams_taken: 4,
    n_of_exams_passed: 2,
    user_scores: [],
    exam_weight: 0.5,
    min_grade: 9.5,
    average_grade: 75,
    percentage_of_exams_passed: 50,
    percentage_of_correct_answers: 71.43,
    percentage_of_questions_seen: 70,
    mode_scores: {},
    suggested_mode: 'default',
    times: [],
    mean_time: 125,
    place_in_scoreboard: null,
    ...overrides
  };
}

describe('subject stats view model', () => {
  it('uses distinct questions for coverage and prevents negative unseen counts', () => {
    const view = getSubjectStatsViewModel(stats());

    expect(view.questionsSeen).toBe(7);
    expect(view.questionsSeenPercentage).toBe(70);
    expect(view.questionBreakdown).toEqual([5, 2, 3]);
  });

  it('handles empty and missing-time datasets without NaN', () => {
    const view = getSubjectStatsViewModel(
      stats({ total_of_questions: 0, n_of_answered: 0, mean_time: null, average_grade: 0 })
    );

    expect(view.questionsSeenPercentage).toBe(0);
    expect(view.meanTimeLabel).toBe('sem dados suficientes');
  });
});

describe('authenticated subject stats request', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('uses the protected BFF without forwarding the browser session marker', async () => {
    const fetchMock = vi.fn<typeof fetch>(async () => Response.json(stats()));
    vi.stubGlobal('fetch', fetchMock);

    await fetchSubjectStats(17);

    expect(fetchMock).toHaveBeenCalledWith('/api/protected/subjects/17/stats', {
      headers: expect.any(Headers),
      credentials: 'same-origin'
    });
    const headers = fetchMock.mock.calls[0][1]?.headers as Headers;
    expect(headers.has('authorization')).toBe(false);
  });
});

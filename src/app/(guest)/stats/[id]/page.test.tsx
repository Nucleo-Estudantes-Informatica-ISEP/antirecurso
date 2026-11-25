// @vitest-environment happy-dom
import { act, cleanup, render, screen } from '@testing-library/react';
import { Suspense } from 'react';
import { afterEach, expect, it, vi } from 'vitest';
import { LanguageProvider } from '@/i18n/client';
import SubjectStatsPage from './page';

const navigation = vi.hoisted(() => ({ path: '/en/stats/17' }));
vi.mock('next/navigation', () => ({ usePathname: () => navigation.path }));
vi.mock('@/hooks/useSession', () => ({ default: () => ({ token: 'session' }) }));
vi.mock('swr', () => ({
  default: () => ({
    data: {
      n_of_answers: 10,
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
      place_in_scoreboard: null
    }
  })
}));
vi.mock('@/utils/getSubjectNameById', () => ({ default: async () => 'Maths' }));
vi.mock('@/components/charts/PieChart', () => ({
  default: ({ labels }: { labels: string[] }) => <div data-testid="pie-legend">{labels.join('|')}</div>
}));
vi.mock('@/components/charts/LineChart', () => ({ default: () => null }));
vi.mock('@/components/profile/GradeCalculatorContainer', () => ({ default: () => null }));
vi.mock('@/components/profile/ScoreIndicator', () => ({ default: () => null }));

afterEach(() => cleanup());

it('renders the subject statistics pie legends in English', async () => {
  await act(async () => {
    render(
      <LanguageProvider lang="en">
        <Suspense>
          <SubjectStatsPage params={Promise.resolve({ id: '17' })} />
        </Suspense>
      </LanguageProvider>
    );
  });

  const legends = screen.getAllByTestId('pie-legend').map((node) => node.textContent);
  expect(legends[0]).toBe('Passed|Failed');
  expect(legends[1]).toBe('Correct|Incorrect|Unanswered');
});

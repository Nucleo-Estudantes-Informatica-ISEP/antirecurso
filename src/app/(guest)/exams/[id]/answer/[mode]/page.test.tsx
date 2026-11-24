// @vitest-environment happy-dom
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Suspense } from 'react';
import { afterEach, expect, it, vi } from 'vitest';
import { LanguageProvider } from '@/i18n/client';
import ExamContextProvider from '@/contexts/ExamContext';
import generateExam from '@/services/generateExam';
import type Question from '@/types/Question';
import Exam from './page';

const navigation = vi.hoisted(() => ({
  pathname: '/pt/exams/17/answer/custom',
  router: { push: vi.fn(), replace: vi.fn() }
}));
vi.mock('next/navigation', () => ({
  usePathname: () => navigation.pathname,
  useRouter: () => navigation.router,
  useSearchParams: () => new URLSearchParams('n_of_questions=2&penalizing_factor=0.25&filter=new')
}));
vi.mock('@/hooks/useSession', () => ({
  default: () => ({ user: null, token: null, isLoading: false })
}));
vi.mock('next-themes', () => ({ useTheme: () => ({ theme: 'light' }) }));
vi.mock('@/services/generateExam', () => ({ default: vi.fn() }));
vi.mock('@/utils/getSubjectNameById', () => ({ default: async () => 'Maths' }));
vi.mock('@/utils/examShuffle', () => ({
  getShuffleSeed: () => 'seed',
  setShuffleSeed: vi.fn(),
  shuffleWithSeed: (q: unknown) => q,
  reorderByIds: (q: unknown) => q
}));
vi.mock('next/image', () => ({ default: () => null }));
vi.mock('@/components/exams/ExamNumeration', () => ({
  default: ({ onClick, children }: { onClick: () => void; children: React.ReactNode }) => (
    <button onClick={onClick}>{children}</button>
  )
}));
vi.mock('sweetalert', () => ({ default: vi.fn() }));
vi.mock('@/components/exams/QuestionPrompt', () => ({
  default: ({
    currentQuestion,
    currentQuestionIndex,
    selectAnswer,
    answers
  }: {
    currentQuestion: Question;
    currentQuestionIndex: number;
    selectAnswer: (index: number, answer: string) => void;
    answers: Map<number, string>;
  }) => (
    <div>
      <p>{currentQuestion.question}</p>
      <button
        aria-pressed={answers.get(currentQuestion.id) === 'A'}
        onClick={() => selectAnswer(currentQuestionIndex, 'A')}
      >
        Select A
      </button>
    </div>
  )
}));
const questions: Question[] = [1, 2].map((id) => ({
  id,
  question: `Original question ${id}`,
  exam: 'test',
  question_type: 'test',
  image: '',
  options: [{ id, name: 'Answer A', order: 'A' }],
  comments: []
}));
afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.clearAllMocks();
});

it('keeps exact questions, answers, position, custom settings and timer when the language changes', async () => {
  vi.mocked(generateExam).mockResolvedValue(questions);
  const params = Promise.resolve({ id: '17', mode: 'custom' });
  const page = () => (
    <LanguageProvider lang="pt">
      <ExamContextProvider>
        <Suspense>
          <Exam params={params} />
        </Suspense>
      </ExamContextProvider>
    </LanguageProvider>
  );
  let view!: ReturnType<typeof render>;
  await act(async () => {
    view = render(page());
  });
  await screen.findByText('Original question 1');
  fireEvent.click(screen.getByRole('button', { name: 'Select A' }));
  fireEvent.click(screen.getByRole('button', { name: 'Próxima pergunta' }));
  await screen.findByText('Original question 2');
  await waitFor(() => expect(screen.getByText('00:01')).toBeTruthy(), { timeout: 2500 });
  navigation.pathname = '/en/exams/17/answer/custom';
  await act(async () => {
    view.rerender(page());
  });
  expect(screen.getByText('Original question 2')).toBeTruthy();
  expect(screen.getByText('00:01')).toBeTruthy();
  expect(generateExam).toHaveBeenCalledTimes(1);
  expect(generateExam).toHaveBeenCalledWith(17, 'custom', null, 2, 'new', 'pt');
  fireEvent.click(screen.getByRole('button', { name: 'Previous question' }));
  await screen.findByText('Original question 1');
  expect(screen.getByRole('button', { name: 'Select A' })).toHaveAttribute('aria-pressed', 'true');
  const stored = Object.values(localStorage)
    .map((value) => {
      try {
        return JSON.parse(String(value));
      } catch {
        return null;
      }
    })
    .find((value) => value?.subjectId === 17 || value?.subject_id === 17);
  expect(stored?.penalizing_factor).toBe(0.25);
});

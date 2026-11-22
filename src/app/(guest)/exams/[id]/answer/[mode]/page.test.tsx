// @vitest-environment happy-dom
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Suspense } from 'react';
import { afterEach, expect, it, vi } from 'vitest';
import { LanguageProvider } from '@/i18n/client';
import ExamContextProvider from '@/contexts/ExamContext';
import generateExam from '@/services/generateExam';
import { ApiResponseError } from '@/services/apiClient';
import swal from 'sweetalert';
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
  vi.unstubAllGlobals();
  navigation.pathname = '/pt/exams/17/answer/custom';
});

it.each([401, 503])('offers recovery when exam submission returns %s', async (status) => {
  vi.mocked(generateExam).mockResolvedValue(questions);
  vi.mocked(swal).mockResolvedValue(true);
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status })));
  await act(async () => {
    render(
      <LanguageProvider lang="pt">
        <ExamContextProvider>
          <Suspense>
            <Exam params={Promise.resolve({ id: '17', mode: 'custom' })} />
          </Suspense>
        </ExamContextProvider>
      </LanguageProvider>
    );
  });
  await screen.findByText('Original question 1');
  fireEvent.click(screen.getByRole('button', { name: 'Select A' }));
  fireEvent.click(screen.getByRole('button', { name: 'Próxima pergunta' }));
  fireEvent.click(await screen.findByRole('button', { name: 'Select A' }));
  fireEvent.click(screen.getByRole('button', { name: 'Terminar exame' }));
  if (status === 401) {
    const link = await screen.findByRole('link', { name: 'Iniciar sessão' });
    expect(
      new URL(link.getAttribute('href')!, 'https://example.test').searchParams.get('callbackUrl')
    ).toBe(
      '/pt/exams/17/answer/custom?n_of_questions=2&penalizing_factor=0.25&filter=new'
    );
  } else {
    expect(await screen.findByText(/não foi possível confirmar se o exame/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Tentar novamente' })).toBeNull();
    expect(screen.getByRole('button', { name: 'Terminar exame' })).toBeDisabled();
    expect(fetch).toHaveBeenCalledTimes(1);
  }
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

it('restores saved answers after a temporary failure while resuming', async () => {
  localStorage.setItem(
    'exam-state-17-custom',
    JSON.stringify({
      version: 2,
      subjectId: 17,
      mode: 'custom',
      questionIds: [1, 2],
      answers: [[1, 'A']],
      time: 45,
      currentQuestionIndex: 1,
      savedAt: Date.now(),
      n_of_questions: 5,
      penalizing_factor: 0.25,
      filter: 'new'
    })
  );
  vi.mocked(swal).mockResolvedValueOnce(true);
  vi.mocked(generateExam)
    .mockRejectedValueOnce(new ApiResponseError(503, 'Unavailable'))
    .mockResolvedValueOnce(questions);
  await act(async () => {
    render(
      <LanguageProvider lang="pt">
        <ExamContextProvider>
          <Suspense>
            <Exam params={Promise.resolve({ id: '17', mode: 'custom' })} />
          </Suspense>
        </ExamContextProvider>
      </LanguageProvider>
    );
  });
  const retry = await screen.findByRole('button', { name: 'Tentar novamente' });
  expect(swal).toHaveBeenCalledOnce();
  expect(generateExam).toHaveBeenNthCalledWith(1, 17, 'custom', null, 5, 'new', 'pt');
  fireEvent.click(retry);
  await screen.findByText('Original question 2');
  fireEvent.click(screen.getByRole('button', { name: 'Pergunta anterior' }));
  expect(screen.getByRole('button', { name: 'Select A' })).toHaveAttribute('aria-pressed', 'true');
});

it.each([403, 404])('returns to the exam list when loading returns %s', async (status) => {
  vi.mocked(generateExam).mockRejectedValue(new ApiResponseError(status, 'Exam unavailable'));
  await act(async () => {
    render(
      <LanguageProvider lang="pt">
        <ExamContextProvider>
          <Suspense>
            <Exam params={Promise.resolve({ id: '17', mode: 'custom' })} />
          </Suspense>
        </ExamContextProvider>
      </LanguageProvider>
    );
  });
  await waitFor(() => expect(navigation.router.push).toHaveBeenCalledWith('/pt/exams', undefined));
  expect(swal).toHaveBeenCalledOnce();
  expect(screen.queryByRole('button', { name: 'Tentar novamente' })).toBeNull();
});

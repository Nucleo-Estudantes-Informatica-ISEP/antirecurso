// @vitest-environment happy-dom
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';

import { ExamContext } from '@/contexts/ExamContext';
import Points from './page';
import { LanguageProvider } from '@/i18n/client';
const navigation = vi.hoisted(() => ({ path: '/pt/exams/1/points' }));

const fireConfetti = vi.hoisted(() => vi.fn());

vi.mock('react-canvas-confetti', () => ({
  default: ({ onInit }: { onInit: (args: { confetti: typeof fireConfetti }) => void }) => {
    onInit({ confetti: fireConfetti });
    return <canvas />;
  }
}));
vi.mock('@/hooks/useSession', () => ({ default: () => ({ user: null, token: null }) }));
vi.mock('next/navigation', () => ({
  usePathname: () => navigation.path,
  useParams: () => ({ id: '1' }),
  useRouter: () => ({ push: vi.fn() })
}));
vi.mock('next-themes', () => ({ useTheme: () => ({ theme: 'light' }) }));
vi.mock('@/components/profile/ScoreIndicator', () => ({ default: () => null }));

afterEach(() => {
  cleanup();
  fireConfetti.mockClear();
});

it('fires celebration confetti for a passing exam', () => {
  render(
    <ExamContext.Provider
      value={{
        examResult: { id: 1, score: 80, passed: true, subject: 'Math' },
        setExamResult: vi.fn(),
        examTime: 60,
        setExamTime: vi.fn()
      }}
    >
      <Points />
    </ExamContext.Provider>
  );

  expect(fireConfetti).toHaveBeenCalledWith({ particleCount: 150, origin: { y: 0.9 } });
});

it('keeps an in-memory guest result and its timer when changing language', () => {
  const value = {
    examResult: { id: 1, score: 80, passed: true, subject: 'Math' },
    setExamResult: vi.fn(),
    examTime: 61,
    setExamTime: vi.fn()
  };
  const page = () => (
    <LanguageProvider lang="pt">
      <ExamContext.Provider value={value}>
        <Points />
      </ExamContext.Provider>
    </LanguageProvider>
  );
  const view = render(page());
  expect(screen.getByText('Math')).toBeTruthy();
  navigation.path = '/en/exams/1/points';
  view.rerender(page());
  expect(screen.getByText('Congratulations!')).toBeTruthy();
  expect(screen.getByText('Math')).toBeTruthy();
  expect(screen.getByText('1m 1s')).toBeTruthy();
  expect(value.setExamResult).not.toHaveBeenCalled();
  navigation.path = '/pt/exams/1/points';
});

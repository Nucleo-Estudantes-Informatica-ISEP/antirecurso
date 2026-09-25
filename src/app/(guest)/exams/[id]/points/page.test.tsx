// @vitest-environment happy-dom
import { cleanup, render } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';

import { ExamContext } from '@/contexts/ExamContext';
import Points from './page';

const fireConfetti = vi.hoisted(() => vi.fn());

vi.mock('react-canvas-confetti', () => ({
  default: ({ onInit }: { onInit: (args: { confetti: typeof fireConfetti }) => void }) => {
    onInit({ confetti: fireConfetti });
    return <canvas />;
  }
}));
vi.mock('@/hooks/useSession', () => ({ default: () => ({ user: null, token: null }) }));
vi.mock('next/navigation', () => ({
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

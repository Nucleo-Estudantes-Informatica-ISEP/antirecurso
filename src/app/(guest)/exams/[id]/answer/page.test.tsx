// @vitest-environment happy-dom
import { act, cleanup, render, screen } from '@testing-library/react';
import { Suspense } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import useSession from '@/hooks/useSession';
import Exams from './page';

vi.mock('@/hooks/useSession', () => ({ default: vi.fn() }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }));
vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  )
}));

afterEach(cleanup);

async function renderPicker(token: string | null) {
  vi.mocked(useSession).mockReturnValue({
    token,
    user: null,
    isLoading: false,
    clear: vi.fn(),
    revalidate: vi.fn()
  });

  await act(async () => {
    render(
      <Suspense>
        <Exams params={Promise.resolve({ id: '17' })} />
      </Suspense>
    );
  });
}

describe('exam mode access', () => {
  it('lets guests select random and realistic exams while locking account modes', async () => {
    await renderPicker(null);

    expect(screen.getByRole('link', { name: /Modo Aleatório/ })).toHaveAttribute(
      'href',
      '/exams/17/answer/default'
    );
    expect(screen.getByRole('link', { name: /Modo Realista/ })).toHaveAttribute(
      'href',
      '/exams/17/answer/realistic'
    );
    expect(screen.getAllByRole('link')).toHaveLength(2);
    expect(screen.getAllByText('Conta necessária')).toHaveLength(4);
    expect(screen.getByRole('button', { name: /Modo Personalizado/ })).toBeDisabled();
  });

  it('keeps all available modes accessible after login and duel unavailable', async () => {
    await renderPicker('server-session');

    for (const mode of ['default', 'realistic', 'new', 'wrong', 'hard']) {
      expect(document.querySelector(`a[href="/exams/17/answer/${mode}"]`)).toBeInTheDocument();
    }
    expect(screen.queryByText('Conta necessária')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Modo Personalizado/ })).toBeEnabled();
    expect(screen.queryByRole('link', { name: /Modo Duelo/ })).not.toBeInTheDocument();
    expect(screen.getByText('Em breve')).toBeInTheDocument();
  });
});

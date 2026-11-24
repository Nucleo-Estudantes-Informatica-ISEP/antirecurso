// @vitest-environment happy-dom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { LanguageProvider } from '@/i18n/client';
import LanguageSelect from './LanguageSelect';
const navigation = vi.hoisted(() => ({ path: '/pt/exams', replace: vi.fn(), refresh: vi.fn() }));
vi.mock('next/navigation', () => ({
  usePathname: () => navigation.path,
  useRouter: () => ({ replace: navigation.replace, refresh: navigation.refresh })
}));
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  document.cookie = 'locale=; Max-Age=0; Path=/';
  window.history.replaceState({}, '', '/');
});
it('stores a manual choice and preserves the page, query and fragment', () => {
  window.history.replaceState({}, '', '/pt/exams?subject=17#list');
  render(
    <LanguageProvider lang="pt">
      <LanguageSelect />
    </LanguageProvider>
  );
  fireEvent.change(screen.getByRole('combobox'), { target: { value: 'en' } });
  expect(document.cookie).toContain('locale=en');
  expect(navigation.replace).toHaveBeenCalledWith('/en/exams?subject=17#list', { scroll: false });
});
it('shows an English URL ahead of the initial language and saved preference', () => {
  navigation.path = '/en/exams';
  document.cookie = 'locale=pt';
  render(
    <LanguageProvider lang="pt">
      <LanguageSelect />
    </LanguageProvider>
  );
  expect(screen.getByRole('combobox').getAttribute('id')).toBeTruthy();
  expect((screen.getByRole('combobox') as HTMLSelectElement).value).toBe('en');
  expect(screen.getByLabelText('Language')).toBeTruthy();
  expect(document.documentElement.lang).toBe('en');
  navigation.path = '/pt/exams';
});
it('switches the language on an exam or result without changing its route parameters', () => {
  for (const path of ['/pt/exams/17/answer/custom', '/pt/exams/17/points']) {
    navigation.path = path;
    const view = render(
      <LanguageProvider lang="pt">
        <LanguageSelect />
      </LanguageProvider>
    );
    expect((screen.getByRole('combobox') as HTMLSelectElement).disabled).toBe(false);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'en' } });
    expect(navigation.replace).toHaveBeenLastCalledWith(path.replace('/pt/', '/en/'), {
      scroll: false
    });
    view.unmount();
  }
  navigation.path = '/pt/exams';
});

it('refreshes server content after the selected language URL is active', () => {
  navigation.path = '/pt/about';
  const view = render(
    <LanguageProvider lang="pt">
      <LanguageSelect />
    </LanguageProvider>
  );
  fireEvent.change(screen.getByRole('combobox'), { target: { value: 'en' } });
  expect(navigation.refresh).not.toHaveBeenCalled();
  navigation.path = '/en/about';
  view.rerender(
    <LanguageProvider lang="pt">
      <LanguageSelect />
    </LanguageProvider>
  );
  expect(screen.getByLabelText('Language')).toBeTruthy();
  expect(navigation.refresh).toHaveBeenCalledTimes(1);
  view.rerender(
    <LanguageProvider lang="en">
      <LanguageSelect />
    </LanguageProvider>
  );
  expect(navigation.refresh).toHaveBeenCalledTimes(1);
  navigation.path = '/pt/exams';
});

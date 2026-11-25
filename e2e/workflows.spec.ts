import { randomUUID } from 'node:crypto';
import { expect, test, type Page } from '@playwright/test';
import { encode } from 'next-auth/jwt';

const subject = 'Web Engineering';
const picker = '/en/exams/17/answer';
const question = 'What does HTML describe?';

async function signIn(page: Page, role: 'student' | 'admin') {
  const secret = process.env.E2E_SESSION_SECRET;
  if (!secret) throw new Error('Playwright did not initialize the session secret');
  const value = await encode({
    secret,
    maxAge: 600,
    token: {
      sub: role,
      name: role === 'student' ? 'Practice Student' : 'Practice Admin',
      accessToken: role + ':' + randomUUID(),
      accessTokenExpiresAt: Date.now() + 600_000,
      authNeiRoles: role === 'admin' ? ['admin'] : []
    }
  });
  await page.context().addCookies([
    {
      name: '__Secure-next-auth.session-token',
      value,
      // Chromium requires a secure URL to seed this cookie and sends it on loopback HTTP.
      url: 'https://localhost:43188',
      secure: true,
      httpOnly: true
    }
  ]);
}

test.beforeEach(async ({ page }) => {
  await page.route('https://gravatar.com/**', (route) => route.abort());
  await page.addInitScript(() => localStorage.setItem('@AntiRecurso:consent', 'yes'));
});

test('guest browses subjects, completes a random exam and sees the result', async ({ page }) => {
  await page.goto('/en');
  const main = page.getByRole('main');
  await expect(main.getByRole('heading', { level: 1 })).toBeVisible();
  await page.getByRole('navigation').getByRole('link', { name: 'Exams', exact: true }).click();
  await expect(page).toHaveURL(/\/en\/exams$/);
  await main.getByRole('link', { name: new RegExp(subject) }).click();

  const generation = page.waitForResponse(
    (response) =>
      response.url().includes('/api/public/exams/generate/17?mode=default') &&
      response.request().method() === 'GET'
  );
  await main.getByRole('link', { name: /Random mode/ }).click();
  expect((await generation).ok()).toBe(true);
  await expect(main.getByText(question)).toBeVisible();
  await main.getByRole('button', { name: /Hypertext/ }).click();
  await main.getByRole('button', { name: 'Finish exam' }).click();
  const submission = page.waitForResponse((response) =>
    response.url().includes('/api/public/exams/verify')
  );
  await page.getByRole('button', { name: 'Yes', exact: true }).click();
  expect((await submission).ok()).toBe(true);

  await expect(page).toHaveURL('/en/exams/17/points');
  await expect(main.getByText('You passed the exam!')).toBeVisible();
  await main.getByRole('button', { name: 'Review answers' }).click();
  await expect(
    page.getByText('Detailed review of saved exams requires authentication.')
  ).toBeVisible();
});

for (const [mode, label] of [
  ['default', 'Random mode'],
  ['realistic', 'Realistic mode'],
  ['new', 'New questions mode'],
  ['wrong', 'Wrong answers mode'],
  ['hard', 'Difficult questions mode'],
  ['custom', 'Custom mode']
]) {
  test(`signed-in student generates a ${mode} exam`, async ({ page }) => {
    await signIn(page, 'student');
    await page.goto(picker);
    const main = page.getByRole('main');
    await expect(main.getByText('Account required')).toHaveCount(0);
    const generation = page.waitForResponse((response) => {
      const url = new URL(response.url());
      return (
        url.pathname === '/api/protected/exams/generate/17' &&
        url.searchParams.get('mode') === mode &&
        response.request().method() === 'POST'
      );
    });
    if (mode === 'custom') {
      await main.getByRole('button', { name: new RegExp(label) }).click();
      const dialog = page.getByRole('dialog');
      await dialog.getByRole('button', { name: '10%', exact: true }).click();
      await dialog.getByRole('button', { name: 'All', exact: true }).click();
      await dialog.getByRole('button', { name: 'Create exam' }).click();
      await expect(page).toHaveURL(/n_of_questions=10&penalizing_factor=0.1&filter=all$/);
    } else {
      await main.getByRole('link', { name: new RegExp(label) }).click();
    }
    const response = await generation;
    expect(response.ok()).toBe(true);
    await expect(main.getByText(question)).toBeVisible();
  });
}

test('student resumes server-saved progress and opens an exam from profile history', async ({
  page
}) => {
  await signIn(page, 'student');
  await page.goto(picker);
  await page.getByRole('button', { name: 'Profile', exact: true }).click();
  await expect(page.getByText('Practice Student', { exact: true })).toBeVisible();
  await page.keyboard.press('Escape');
  const main = page.getByRole('main');
  await main.getByRole('link', { name: /Random mode/ }).click();

  const saved = page.waitForResponse(
    (response) =>
      response.url().endsWith('/api/protected/exams/state') &&
      response.request().method() === 'POST' &&
      response.request().postDataJSON().state.answers.length === 1
  );
  await main.getByRole('button', { name: /Hypertext/ }).click();
  expect((await saved).ok()).toBe(true);

  await page.evaluate(() => localStorage.clear());
  await page.goto('/en/profile');
  await expect(main.getByRole('heading', { name: /Welcome, Practice Student/ })).toBeVisible();
  await expect(main.getByRole('heading', { name: 'Unfinished exams' })).toBeVisible();
  await main.getByRole('button', { name: subject, exact: true }).click();
  await expect(page).toHaveURL(/\/answer\/default\?resume=true$/);
  await expect(main.getByText('1 / 1 answered')).toBeVisible();

  await page.goto('/en/profile');
  await expect(main.getByRole('heading', { name: 'Your exams' })).toBeVisible();
  await main
    .getByRole('link', { name: subject, exact: true })
    .and(main.locator('a[href*="/exams/42/review"]'))
    .click();
  await expect(page).toHaveURL(/\/exams\/42\/review\/?$/);
  await expect(main.getByText(question)).toBeVisible();
});

test('student records a note visit and opens the returned document', async ({ page, context }) => {
  await signIn(page, 'student');
  await page.goto('/en/notes/17');
  await expect(page.getByRole('heading', { name: 'HTML study notes' })).toBeVisible();
  const visit = page.waitForResponse(
    (response) =>
      response.url().endsWith('/api/protected/notes/8/view') &&
      response.request().method() === 'POST'
  );
  const document = context.waitForEvent('page');
  await page.getByRole('button', { name: 'View study notes' }).click();
  expect((await visit).ok()).toBe(true);
  await expect((await document).locator('body')).toHaveText('HTML study notes content');
});

test('admin can list users', async ({ page }) => {
  await signIn(page, 'admin');
  await page.goto('/en/admin/users');
  await expect(page.getByRole('heading', { name: 'Users', exact: true })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'student@example.test' })).toBeVisible();
});

test('regular student cannot list users', async ({ page }) => {
  await signIn(page, 'student');
  const session = page.waitForResponse('**/api/auth/session');
  await page.goto('/en/admin/users');
  expect((await session).ok()).toBe(true);
  await expect(page.getByRole('main').getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Users', exact: true })).toHaveCount(0);
  const operation = await page.request.get('/api/protected/users');
  expect(operation.status()).toBe(403);
});

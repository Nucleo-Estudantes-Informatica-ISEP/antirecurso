import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const { generateKeyPairSync, randomBytes, sign } = require('node:crypto');
const { spawn } = require('node:child_process');
const assert = require('node:assert/strict');
const { createServer } = require('node:http');

let app;
let api;
const student = {
  id: 9,
  name: 'Fixture Student',
  email: 'fixture@example.test',
  avatar: '',
  requires_account_resolution: false
};
const subject = { id: 12, name: 'Fixture Subject' };
let examStatus = 401;
let noteStatus = 401;
const { privateKey, publicKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
const jwk = { ...publicKey.export({ format: 'jwk' }), kid: 'fixture', alg: 'RS256', use: 'sig' };
const claims = {
  sub: 'fixture-student',
  email: student.email,
  email_verified: true,
  name: student.name
};
function idToken() {
  const now = Math.floor(Date.now() / 1000);
  const toBase64 = (data) => Buffer.from(JSON.stringify(data)).toString('base64url');
  const data =
    toBase64({ alg: 'RS256', kid: 'fixture' }) +
    '.' +
    toBase64({ ...claims, iss: api, aud: 'fixture-client', iat: now, exp: now + 900 });
  return data + '.' + sign('sha256', Buffer.from(data), privateKey).toString('base64url');
}
let authorization;
const accessToken = randomBytes(24).toString('hex');
const examQueries = [];
const noteRequests = [];
const server = createServer((req, res) => {
  const url = new URL(req.url, api);
  res.setHeader('access-control-allow-origin', '*');
  res.setHeader('content-type', 'application/json');
  let body = subject;
  if (url.pathname === '/.well-known/openid-configuration')
    body = {
      issuer: api,
      authorization_endpoint: api + '/authorize',
      token_endpoint: api + '/oauth/v2/token',
      userinfo_endpoint: api + '/oidc/v1/userinfo',
      jwks_uri: api + '/keys',
      response_types_supported: ['code'],
      subject_types_supported: ['public'],
      id_token_signing_alg_values_supported: ['RS256'],
      code_challenge_methods_supported: ['S256']
    };
  if (url.pathname === '/oidc/v1/end_session') {
    const target = url.searchParams.get('post_logout_redirect_uri');
    if (url.searchParams.get('client_id') !== 'fixture-client' || target !== app + '/') {
      res.writeHead(400);
      return res.end('Unexpected logout return URL');
    }
    res.writeHead(303, { location: target });
    return res.end();
  }
  if (url.pathname === '/keys') body = { keys: [jwk] };
  if (url.pathname === '/oidc/v1/userinfo') body = claims;
  if (url.pathname === '/authorize') {
    authorization = url.searchParams;
    res.setHeader('content-type', 'text/html');
    return res.end(
      '<form action="/fixture-signed-in" method="post"><button>Sign in as Fixture Student</button></form>'
    );
  }
  if (url.pathname === '/fixture-signed-in') {
    const redirect = new URL(authorization.get('redirect_uri'));
    if (redirect.origin !== app) {
      res.statusCode = 400;
      return res.end('Unexpected callback origin');
    }
    redirect.searchParams.set('state', authorization.get('state'));
    redirect.searchParams.set('code', 'fixture-code');
    res.writeHead(303, { location: redirect.href });
    return res.end();
  }
  if (url.pathname === '/oauth/v2/token')
    body = {
      token_type: 'Bearer',
      access_token: accessToken,
      id_token: idToken(),
      expires_in: 900
    };
  if (url.pathname === '/user') body = student;
  if (url.pathname === '/user/scores') body = [];
  if (url.pathname === '/exams/pending') body = { data: [] };
  if (url.pathname === '/subjects') body = [subject];
  if (url.pathname === '/exams/state') body = { state: null };
  if (url.pathname === '/exams/generate/12') {
    if (req.method !== 'POST' || req.headers.authorization !== `Bearer ${accessToken}`) {
      res.statusCode = 401;
      return res.end(JSON.stringify({ message: 'Invalid fixture request' }));
    }
    examQueries.push(url.search);
    res.statusCode = examStatus;
    body =
      examStatus === 200
        ? [
            {
              id: 3,
              question: 'Fixture exam question',
              exam: 'Fixture exam',
              question_type: 'multiple',
              image: '',
              options: [{ id: 1, name: 'Option one', order: 'a' }],
              comments: []
            }
          ]
        : { message: 'Fixture failure' };
  }
  if (url.pathname === '/subjects/12/notes')
    body = {
      data: [
        {
          id: 34,
          title: 'Fixture study notes',
          description: 'Study notes',
          user: student,
          subject,
          likes: 0,
          is_liked: false,
          views: 0,
          created_at: '2026-11-21T00:00:00Z',
          n_pages: 1
        }
      ]
    };
  if (url.pathname === '/notes/34/view') {
    if (req.method !== 'POST' || req.headers.authorization !== `Bearer ${accessToken}`) {
      res.statusCode = 401;
      return res.end(JSON.stringify({ message: 'Invalid fixture request' }));
    }
    noteRequests.push(url.pathname);
    res.statusCode = noteStatus;
    body = noteStatus === 200 ? { url: `${api}/document` } : { message: 'Fixture failure' };
  }
  res.end(JSON.stringify(body));
});

(async () => {
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  api = `http://127.0.0.1:${server.address().port}`;
  const probe = createServer();
  await new Promise((resolve) => probe.listen(0, '127.0.0.1', resolve));
  const port = probe.address().port;
  await new Promise((resolve) => probe.close(resolve));
  app = `http://localhost:${port}`;
  let browser;
  let web;
  try {
    const secret = randomBytes(32).toString('hex');
    web = spawn(
      process.execPath,
      [require.resolve('next/dist/bin/next'), 'dev', '--port', String(port)],
      {
        env: {
          ...process.env,
          NEXTAUTH_URL: app,
          AUTH_ISSUER_URL: api,
          API_BASE_URL: api,
          NEXT_PUBLIC_BASE_URL: api,
          AUTH_CLIENT_ID: 'fixture-client',
          AUTH_CLIENT_SECRET: secret,
          AUTH_SECRET: secret,
          AUTH_POST_LOGOUT_REDIRECT_URI: app
        },
        stdio: 'ignore'
      }
    );
    for (let attempts = 0; ; attempts++) {
      if (web.exitCode !== null) throw new Error('Test web server exited during startup');
      try {
        await fetch(app + '/api/auth/session');
        break;
      } catch {
        if (attempts === 120) throw new Error('Test web server did not start');
        await new Promise((resolve) => setTimeout(resolve, 250));
      }
    }
    browser = await chromium.launch(
      process.env.CHROME ? { executablePath: process.env.CHROME } : {}
    );
    const page = await browser.newPage({ reducedMotion: 'reduce' });
    await page.goto(app + '/en');
    await page.getByRole('navigation').getByRole('link', { name: 'Create account' }).click();
    await page.waitForURL(api + '/authorize?*');
    assert.equal(new URL(page.url()).searchParams.get('prompt'), 'create');

    await page.goto(app + '/en/login?callbackUrl=' + encodeURIComponent('/en/exams'));
    await page.getByRole('button', { name: 'Sign in as Fixture Student' }).click();
    await page.waitForURL(app + '/en/exams');
    await page.getByRole('link', { name: /Fixture Subject/i }).click();
    await page.getByRole('button', { name: /Custom mode/i }).click();
    const dialog = page.getByRole('dialog');
    await dialog.getByRole('button', { name: '0%', exact: true }).click();
    await dialog.getByRole('button', { name: 'All', exact: true }).click();
    await dialog.getByRole('button', { name: 'Create exam', exact: true }).click();
    await page.waitForURL('**/en/exams/12/answer/custom?*');
    const exam = new URL(page.url()).pathname + new URL(page.url()).search;
    assert.equal((await page.request.get(app + '/api/auth/session')).status(), 200);
    const alert = page
      .getByRole('alert')
      .filter({ has: page.getByRole('link', { name: 'Sign in', exact: true }) });
    const href = await alert.getByRole('link', { name: 'Sign in' }).getAttribute('href');
    assert.equal(new URL(href, app).searchParams.get('callbackUrl'), exam);
    examStatus = 503;
    await alert.getByRole('link', { name: 'Sign in' }).click();
    await page.getByRole('button', { name: 'Sign in as Fixture Student' }).click();
    await page.waitForURL(app + exam);
    await page.reload();
    await page.getByRole('button', { name: 'Retry', exact: true }).waitFor();
    examStatus = 200;
    await page.getByRole('button', { name: 'Retry', exact: true }).click();
    await page.getByText('Fixture exam question', { exact: true }).waitFor();
    assert.equal(new Set(examQueries).size, 1);

    const notes = '/en/notes/12';
    await page.goto(app + '/en/notes');
    await page.getByRole('link', { name: /Fixture Subject/i }).click();
    await page.getByRole('heading', { name: 'Fixture study notes' }).waitFor();
    const noteButton = page.getByRole('button', { name: 'View study notes' });
    await noteButton.click();
    const noteHref = await alert.getByRole('link', { name: 'Sign in' }).getAttribute('href');
    assert.equal(new URL(noteHref, app).searchParams.get('callbackUrl'), notes + '#note-34');
    noteStatus = 503;
    await alert.getByRole('link', { name: 'Sign in' }).click();
    await page.getByRole('button', { name: 'Sign in as Fixture Student' }).click();
    await page.waitForURL(app + notes + '#note-34');
    await noteButton.click();
    await page.getByRole('button', { name: 'Retry', exact: true }).waitFor();
    noteStatus = 200;
    const [opened] = await Promise.all([
      page.context().waitForEvent('page'),
      page.getByRole('button', { name: 'Retry', exact: true }).click()
    ]);
    await opened.waitForURL(api + '/document');
    assert.deepEqual(noteRequests, Array(3).fill('/notes/34/view'));
    await page.goto(app + '/en/profile');
    const [accountTab] = await Promise.all([
      page.waitForEvent('popup'),
      page.getByRole('link', { name: 'Manage account on AuthNEI' }).click()
    ]);
    await accountTab.waitForURL(api + '/ui/console/users/me');
    await accountTab.close();
    assert.equal(page.url(), app + '/en/profile');

    await page.goto(app + '/pt');
    const profile = page.getByRole('button', { name: 'Perfil', exact: true });
    await profile.click();
    await page.getByRole('menuitem', { name: 'Terminar sessão' }).click();
    const signOutDialog = page.getByRole('dialog', { name: 'Terminar sessão' });
    await signOutDialog.getByRole('button', { name: 'Cancelar' }).waitFor();
    await page.keyboard.press('Escape');
    await signOutDialog.waitFor({ state: 'hidden' });
    await page.waitForFunction(
      () => document.activeElement?.getAttribute('aria-label') === 'Perfil'
    );

    await page.setViewportSize({ width: 360, height: 640 });
    await page.evaluate(() => document.documentElement.classList.add('dark'));
    await page.getByRole('button', { name: 'Abrir menu' }).click();
    await page.getByRole('button', { name: 'Terminar sessão', exact: true }).click();
    const confirmation = signOutDialog.getByRole('button', { name: /Terminar também no AuthNEI/ });
    if (process.env.SIGN_OUT_SCREENSHOT) {
      await signOutDialog.screenshot({
        path: process.env.SIGN_OUT_SCREENSHOT,
        animations: 'disabled'
      });
    }
    await page.waitForFunction(
      () => {
        const dialog = document.querySelector('[role="dialog"]');
        if (!dialog) return false;
        const bounds = dialog.getBoundingClientRect();
        return bounds.left >= 0 && bounds.right <= window.innerWidth;
      },
      null,
      { timeout: 5000 }
    );
    const logout = page.waitForResponse((response) =>
      response.url().startsWith(api + '/oidc/v1/end_session?')
    );
    await confirmation.click();
    assert.equal((await logout).status(), 303);
    await signOutDialog.waitFor({ state: 'hidden' });
    assert.equal((await page.request.get(app + '/api/auth/session')).status(), 401);
    process.stdout.write('Desktop dismissal, mobile sign-out, and the AuthNEI return passed.\n');

    process.stdout.write(
      'Hosted registration, sign-in, account tab, and protected exam/note recovery passed.\n'
    );
    process.stdout.write(
      'Signed-in browser fixture opened the same exam and note after 401 and 503 recovery checks.\n'
    );
  } finally {
    await browser?.close();
    if (web && web.exitCode === null) {
      web.kill('SIGTERM');
      await new Promise((resolve) => web.once('exit', resolve));
    }
    server.close();
  }
})().catch((error) => {
  process.stderr.write(String(error) + '\n');
  process.exitCode = 1;
});

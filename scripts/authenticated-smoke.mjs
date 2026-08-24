const required = [
  'AUTH_SMOKE_BASE_URL',
  'AUTH_SMOKE_COOKIE',
  'AUTH_SMOKE_SUBJECT_ID',
  'AUTH_SMOKE_NOTE_ID'
];
const missing = required.filter((name) => !process.env[name]);

if (missing.length) {
  throw new Error(`Missing authenticated smoke configuration: ${missing.join(', ')}`);
}

const baseUrl = process.env.AUTH_SMOKE_BASE_URL.replace(/\/+$/, '');
const cookie = process.env.AUTH_SMOKE_COOKIE;
const subjectId = encodeURIComponent(process.env.AUTH_SMOKE_SUBJECT_ID);
const noteId = encodeURIComponent(process.env.AUTH_SMOKE_NOTE_ID);

async function request(path, init = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      accept: 'application/json',
      cookie,
      ...init.headers
    },
    redirect: 'manual'
  });
  const body = await response.text();
  let parsed = body;
  try {
    parsed = body ? JSON.parse(body) : null;
  } catch {}

  if (!response.ok) {
    throw new Error(
      `${init.method ?? 'GET'} ${path} returned HTTP ${response.status}: ${body.slice(0, 500)}`
    );
  }

  return parsed;
}

const session = await request('/api/auth/session');
if (!session?.user?.id) throw new Error('Authenticated session did not return a backend user.');

for (const mode of ['default', 'realistic', 'new', 'wrong', 'hard', 'custom']) {
  const params = new URLSearchParams({ mode });
  if (mode === 'custom') params.set('n_of_questions', '10');
  const exam = await request(`/api/protected/exams/generate/${subjectId}?${params.toString()}`);
  if (!Array.isArray(exam)) throw new Error(`${mode} exam response is not an array.`);
  console.info(`PASS authenticated ${mode} exam (${exam.length} questions)`);
}

await request('/api/protected/exams');
console.info('PASS authenticated exam history');

const noteVisit = await request(`/api/protected/notes/${noteId}/view`, { method: 'POST' });
if (typeof noteVisit?.url !== 'string' || !noteVisit.url) {
  throw new Error('Authenticated note visit did not return a URL.');
}
console.info('PASS authenticated note visit');

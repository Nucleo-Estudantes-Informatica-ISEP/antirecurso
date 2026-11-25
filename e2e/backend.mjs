import { createServer } from 'node:http';

const subject = { id: 17, name: 'Web Engineering', slug: 'WEB', year: 2, scores: [] };
const user = {
  id: 1,
  name: 'Practice Student',
  email: 'student@example.test',
  avatar: '',
  is_admin: 0
};
const admin = {
  id: 2,
  name: 'Practice Admin',
  email: 'admin@example.test',
  avatar: '',
  is_admin: 1
};
const options = [
  { id: 1, name: 'Hypertext', order: 'A' },
  { id: 2, name: 'Spreadsheet', order: 'B' }
];
const question = {
  id: 21,
  question: 'What does HTML describe?',
  exam: 'Practice',
  question_type: 'multiple_choice',
  image: '',
  options,
  comments: []
};
const date = '2026-01-01T12:00:00Z';
const result = { id: 42, score: 100, passed: true, subject: subject.name };
const history = { ...result, user_name: user.name, created_at: date, mode: 'default', time: 12 };
const pagination = {
  total: 1,
  currentPage: 1,
  lastPage: 1,
  perPage: 10,
  nextPageUrl: null,
  previousPageUrl: null
};
const modes = ['default', 'realistic', 'new', 'wrong', 'hard', 'custom'];
const saved = new Map();

async function readJson(request) {
  let body = '';
  for await (const chunk of request) body += chunk;
  return JSON.parse(body);
}

createServer(async (request, response) => {
  const { pathname, searchParams } = new URL(request.url, 'http://localhost');
  const route = `${request.method} ${pathname}`;
  const token = request.headers.authorization;
  const actor = token?.startsWith('Bearer student:')
    ? user
    : token?.startsWith('Bearer admin:')
      ? admin
      : null;
  const json = (status, data) => {
    response.writeHead(status, { 'content-type': 'application/json' });
    response.end(JSON.stringify(data));
  };
  const key = (mode) => `${token}:${mode}`;
  const mode = searchParams.get('mode');
  try {
    switch (route) {
      case 'GET /health':
        return json(200, {});
      case 'GET /subjects':
        return json(200, [subject]);
      case 'GET /subjects/17':
        return json(200, subject);
      case 'GET /exams/generate/17':
        if (!token && mode === 'default') return json(200, [question]);
        break;
      case 'POST /exams/generate/17':
        if (
          actor &&
          modes.includes(mode) &&
          (mode !== 'custom' ||
            (searchParams.get('n_of_questions') === '10' && searchParams.get('filter') === 'all'))
        ) {
          return json(200, [question]);
        }
        break;
      case 'POST /exams/verify': {
        const { subject_id, answers } = await readJson(request);
        if (
          !token &&
          mode === 'default' &&
          subject_id === 17 &&
          answers.length === 1 &&
          answers[0].question_id === 21 &&
          answers[0].selected_option === 'A'
        ) {
          return json(200, result);
        }
        break;
      }
      case 'GET /user':
        if (actor) return json(200, actor);
        break;
      case 'GET /user/scores':
        if (actor)
          return json(200, [
            {
              user_id: actor.id,
              score: 100,
              user_name: actor.name,
              avatar: '',
              subject_id: 17,
              subject: subject.name,
              exams: 1,
              show_scoreboard: true
            }
          ]);
        break;
      case 'GET /exams':
        if (actor) return json(200, { data: [history], meta: pagination });
        break;
      case 'GET /exams/42':
        if (actor === user)
          return json(200, {
            ...result,
            taken_at: date,
            questions: [
              {
                question: { ...question, correct_option: 'A' },
                options,
                selected_option_id: 1,
                is_wrong: false,
                correct_option: 'A',
                comments: []
              }
            ]
          });
        break;
      case 'GET /exams/state':
        if (actor && searchParams.get('subject_id') === '17' && modes.includes(mode)) {
          const state = saved.get(key(mode));
          return state ? json(200, { state }) : json(404, { message: 'No saved exam' });
        }
        break;
      case 'POST /exams/state': {
        const data = await readJson(request);
        if (actor && data.subject_id === 17 && modes.includes(data.mode)) {
          saved.set(key(data.mode), data.state);
          return json(200, {});
        }
        break;
      }
      case 'GET /exams/pending':
        if (actor)
          return json(200, {
            data: modes.flatMap((mode) => {
              const state = saved.get(key(mode));
              return state
                ? [
                    {
                      id: 1,
                      subject: subject.name,
                      subject_id: 17,
                      mode,
                      state,
                      created_at: date,
                      updated_at: date
                    }
                  ]
                : [];
            })
          });
        break;
      case 'GET /subjects/17/notes':
        if (actor)
          return json(200, {
            data: [
              {
                id: 8,
                title: 'HTML study notes',
                subject,
                user,
                views: 10,
                likes: 0,
                is_liked: false,
                created_at: date,
                upload_id: null,
                url: null
              }
            ],
            meta: pagination
          });
        break;
      case 'POST /notes/8/view':
        if (actor === user) return json(200, { url: 'http://127.0.0.1:43189/study-note' });
        break;
      case 'GET /study-note':
        response.writeHead(200, { 'content-type': 'text/plain' });
        return response.end('HTML study notes content');
      case 'GET /admin':
        return json(actor === admin ? 200 : 403, {});
      case 'GET /users':
        return actor === admin ? json(200, { data: [user, admin] }) : json(403, {});
    }
    return json(422, { message: `Unexpected fixture request: ${route}` });
  } catch {
    return json(400, { message: 'Invalid fixture request body' });
  }
}).listen(43189, '127.0.0.1');

# Deployment

The production container is defined by `Dockerfile` and `compose.yml`.

## Routing model

Production uses one public AntiRecurso origin with distinct paths:

```text
/api/*            -> Next.js API routes
/api/protected/*  -> Next.js authenticated BFF
/api/backend/*    -> Adonis API
```

The browser never receives the real ZITADEL access token. Protected browser requests go through `/api/protected`, where Next.js reads the server-side session and forwards the request to Adonis with the real access token.

## Coolify

Deploy the repository as a Docker Compose resource using `compose.yml`.

The Compose service is named `web`, so the Coolify URL magic variable is `SERVICE_URL_WEB`. A `_3000` suffix is not required for this deployment.

### Automatic/defaulted values

The compose file derives these values automatically:

- `NEXTAUTH_URL` -> `SERVICE_URL_WEB` (local fallback: `http://localhost:3000`)
- `AUTH_POST_LOGOUT_REDIRECT_URI` -> `SERVICE_URL_WEB` (local fallback: `http://localhost:3000`)
- `NEXT_PUBLIC_BASE_URL` -> `<SERVICE_URL_WEB>/api/backend`
- `API_BASE_URL` -> `<SERVICE_URL_WEB>/api/backend`
- authenticated browser requests always use the same-origin `/api/protected` BFF
- `AUTH_SECRET` -> persistent Coolify-generated `SERVICE_REALBASE64_64_AUTH`
- `AUTH_ISSUER_URL` -> `https://auth.nei-isep.org`
- `AUTH_DEBUG` -> `false`
- `NODE_ENV` -> `production`
- `PORT` -> `3000`
- `HOSTNAME` -> `0.0.0.0`

`COOLIFY_URL` and the old standalone `antirecurso-api` public origin are not used.

### Values that must come from AuthNEI

Configure the deployment-specific identifiers/credentials that cannot be inferred by Coolify:

```dotenv
AUTH_CLIENT_ID=...
AUTH_CLIENT_SECRET=...
AUTH_PROJECT_ID=...
AUTH_GLOBAL_PROJECT_ID=...
```

`AUTH_PROJECT_ID` is the AntiRecurso project ID. `AUTH_GLOBAL_PROJECT_ID` is the `NEI Global` project ID containing the shared `admin` role.

The effective callback URL is:

```text
<SERVICE_URL_WEB>/api/auth/callback/zitadel
```

The matching callback and post-logout URLs must be registered on the `antirecurso-web` ZITADEL application.

## Local development

`.env.example` uses the local services directly:

```text
Next.js:               http://localhost:3000
Adonis API:            http://localhost:3333
Next protected BFF:    http://localhost:3000/api/protected
```

Copy it and replace the AuthNEI IDs/credentials:

```bash
cp .env.example .env
```

## Authenticated smoke test

After deploying the API first and then the web app, copy the complete cookie header from an
authenticated browser session and run the protected-flow smoke against a subject that supports
realistic mode and an existing note:

```bash
AUTH_SMOKE_BASE_URL=https://antirecurso.nei-isep.org \
AUTH_SMOKE_COOKIE='next-auth.session-token=...' \
AUTH_SMOKE_SUBJECT_ID=... \
AUTH_SMOKE_NOTE_ID=... \
pnpm smoke:auth
```

The smoke validates the backend user session, default, realistic, new, wrong, hard, and custom
exam generation, exam history, and note visit tracking through `/api/protected`. The note visit
increments its view count, so use a designated smoke-test note.

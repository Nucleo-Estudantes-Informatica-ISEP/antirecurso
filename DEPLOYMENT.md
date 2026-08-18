# Deployment

The production container is defined by `Dockerfile` and `compose.yml`.

## Coolify

Deploy the repository as a Docker Compose resource using `compose.yml`.

The `web` service listens on port `3000`. The compose file declares `SERVICE_URL_WEB_3000`, so Coolify owns the public frontend URL and routes it to the correct internal port. `COOLIFY_URL` is not used.

### Automatic/defaulted values

The compose file derives these values automatically:

- `NEXTAUTH_URL` -> `SERVICE_URL_WEB_3000` (local fallback: `http://localhost:3000`)
- `AUTH_POST_LOGOUT_REDIRECT_URI` -> `SERVICE_URL_WEB_3000` (local fallback: `http://localhost:3000`)
- `NEXT_PUBLIC_PROTECTED_API_BASE_URL` -> `<SERVICE_URL_WEB_3000>/api/backend` (local fallback: `http://localhost:3000/api/backend`)
- `AUTH_SECRET` -> a persistent Coolify-generated `SERVICE_REALBASE64_64_AUTH` value (local development fallback only when no value is supplied)
- `AUTH_ISSUER_URL` -> `https://auth.nei-isep.org`
- `AUTH_DEBUG` -> `false`
- `NODE_ENV` -> `production`
- `PORT` -> `3000`
- `HOSTNAME` -> `0.0.0.0`
- `NEXT_PUBLIC_BASE_URL` -> `https://antirecurso-api.nei-isep.org`

`NEXT_PUBLIC_BASE_URL` is the external Adonis API. It must not point back to the Next.js `/api/backend` proxy. The proxy URL has its own `NEXT_PUBLIC_PROTECTED_API_BASE_URL` value.

### Values that must come from AuthNEI

Configure only the deployment-specific AuthNEI identifiers/credentials that cannot be inferred by Coolify:

```dotenv
AUTH_CLIENT_ID=...
AUTH_CLIENT_SECRET=...
AUTH_PROJECT_ID=...
AUTH_GLOBAL_PROJECT_ID=...
```

`AUTH_PROJECT_ID` is the AntiRecurso project ID. `AUTH_GLOBAL_PROJECT_ID` is the `NEI Global` project ID containing the shared `admin` role. Both are emitted by the AuthNEI bootstrap report.

Unless explicitly overridden, the compose file builds the remaining auth values from those IDs:

```text
AUTH_SCOPES=openid email profile offline_access urn:zitadel:iam:org:projects:roles urn:zitadel:iam:org:project:id:<AUTH_PROJECT_ID>:aud urn:zitadel:iam:org:project:id:<AUTH_GLOBAL_PROJECT_ID>:aud
AUTH_ROLE_CLAIM=urn:zitadel:iam:org:project:<AUTH_GLOBAL_PROJECT_ID>:roles
```

This gives the access token the AntiRecurso API audience while also requesting the project-specific role claim for `NEI Global`.

You may override `AUTH_SCOPES`, `AUTH_ROLE_CLAIM`, `NEXT_PUBLIC_BASE_URL`, or the derived frontend URLs in Coolify when a non-standard deployment requires it.

Do not add `APP_BASE_URL` or `AUTH_REDIRECT_URI`; this frontend does not consume them. The effective callback URL is:

```text
<SERVICE_URL_WEB_3000>/api/auth/callback/zitadel
```

The matching callback and post-logout URLs still need to be registered on the `antirecurso-web` ZITADEL application.

## Local Docker Compose

For local development, `.env.example` contains localhost-oriented values. Copy it and replace the AuthNEI IDs/credentials:

```bash
cp .env.example .env
```

The default local API addresses are:

```text
frontend: http://localhost:3000
Adonis API: http://localhost:3333
protected frontend proxy: http://localhost:3000/api/backend
```

The production compose only exposes port `3000` to the Docker network. For direct local browser access, add a local override:

```yaml
services:
  web:
    ports:
      - "3000:3000"
```

Then run:

```bash
docker compose up --build
```

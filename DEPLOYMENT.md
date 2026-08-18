# Deployment

The production container is defined by `Dockerfile` and `compose.yml`.

## Coolify

Deploy the repository as a Docker Compose resource using `compose.yml`.

The compose service listens on port `3000` inside the Docker network. Coolify should attach the public domain to the `web` service on port `3000`; the application does not publish a host port directly.

Coolify predefines `COOLIFY_URL` as the application URL. The compose file derives the frontend URLs from it:

- `NEXTAUTH_URL` uses `COOLIFY_URL`
- `AUTH_POST_LOGOUT_REDIRECT_URI` defaults to `COOLIFY_URL`, but can be overridden explicitly
- `NEXT_PUBLIC_BASE_URL` uses `<COOLIFY_URL>/api/backend`, the frontend's authenticated backend proxy

This means changing the application's public URL in Coolify updates the normal login/logout URLs and the browser-facing backend proxy URL without duplicating the frontend domain in application environment variables.

Configure these variables in Coolify:

```dotenv
AUTH_SECRET=...
AUTH_ISSUER_URL=https://auth.nei-isep.org
AUTH_CLIENT_ID=...
AUTH_CLIENT_SECRET=...
AUTH_SCOPES="openid email profile offline_access urn:zitadel:iam:org:project:id:<ANTIRECURSO_PROJECT_ID>:aud"
AUTH_ROLE_CLAIM=urn:zitadel:iam:org:project:roles
AUTH_DEBUG=false
```

Optionally override the logout destination only if it should differ from the application URL:

```dotenv
AUTH_POST_LOGOUT_REDIRECT_URI=https://example.com
```

The compose file marks `AUTH_SECRET`, `AUTH_ISSUER_URL`, `AUTH_CLIENT_ID`, `AUTH_CLIENT_SECRET`, and `AUTH_SCOPES` as required. `AUTH_ROLE_CLAIM` and `AUTH_DEBUG` retain safe defaults.

`NEXT_PUBLIC_BASE_URL` is passed both to the Docker build and to the runtime container because Next.js embeds `NEXT_PUBLIC_*` values into browser bundles at build time. In Coolify it is derived automatically as `<COOLIFY_URL>/api/backend`.

Do not add `APP_BASE_URL` or `AUTH_REDIRECT_URI`; the frontend does not consume them. The effective callback URL is always:

```text
<COOLIFY_URL>/api/auth/callback/zitadel
```

When the public domain changes, Coolify updates `COOLIFY_URL`, but ZITADEL still needs the new callback URL and post-logout URL registered on the AntiRecurso OIDC application.

## Local Docker Compose

Outside Coolify, define `COOLIFY_URL` yourself because the production compose file deliberately derives its public URLs from the same canonical value:

```dotenv
COOLIFY_URL=http://localhost:3000
AUTH_SECRET=...
AUTH_ISSUER_URL=https://auth.example.com
AUTH_CLIENT_ID=...
AUTH_CLIENT_SECRET=...
AUTH_SCOPES="openid email profile offline_access urn:zitadel:iam:org:project:id:<PROJECT_ID>:aud"
```

With that configuration, `NEXT_PUBLIC_BASE_URL` becomes `http://localhost:3000/api/backend`.

The production compose file only exposes port `3000` to the Docker network. For direct local browser access, add a local override such as:

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

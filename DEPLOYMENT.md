# Deployment

The production container is defined by `Dockerfile` and `compose.yml`.

## Coolify

Deploy the repository as a Docker Compose resource using `compose.yml`.

The compose service listens on port `3000` inside the Docker network. Coolify should attach the public domain to the `web` service on port `3000`; the application does not publish a host port directly.

Coolify provides `COOLIFY_URL` for the configured public application URL. The compose file uses it directly for both:

- `NEXTAUTH_URL`
- `AUTH_POST_LOGOUT_REDIRECT_URI`

This means changing the application's canonical domain in Coolify updates those runtime values without editing the repository or duplicating the frontend URL in environment variables.

Configure these variables in Coolify:

```dotenv
AUTH_SECRET=...
AUTH_ISSUER_URL=https://auth.nei-isep.org
AUTH_CLIENT_ID=...
AUTH_CLIENT_SECRET=...
AUTH_SCOPES="openid email profile offline_access urn:zitadel:iam:org:project:id:<ANTIRECURSO_PROJECT_ID>:aud"
AUTH_ROLE_CLAIM=urn:zitadel:iam:org:project:roles
AUTH_DEBUG=false
NEXT_PUBLIC_BASE_URL=https://antirecurso-api.nei-isep.org
```

`NEXT_PUBLIC_BASE_URL` is passed both to the Docker build and to the runtime container because Next.js embeds `NEXT_PUBLIC_*` values into browser bundles at build time.

Do not add `APP_BASE_URL` or `AUTH_REDIRECT_URI`; the frontend does not consume them. The effective callback URL is always:

```text
<COOLIFY_URL>/api/auth/callback/zitadel
```

When the public domain changes, Coolify updates `COOLIFY_URL`, but ZITADEL still needs the new callback URL and post-logout URL registered on the AntiRecurso OIDC application.

## Local Docker Compose

Outside Coolify, define `COOLIFY_URL` yourself because the compose file deliberately uses the same canonical-URL variable in every environment:

```dotenv
COOLIFY_URL=http://localhost:3000
NEXT_PUBLIC_BASE_URL=http://host.docker.internal:4000
AUTH_SECRET=...
AUTH_ISSUER_URL=https://auth.example.com
AUTH_CLIENT_ID=...
AUTH_CLIENT_SECRET=...
AUTH_SCOPES="openid email profile offline_access urn:zitadel:iam:org:project:id:<PROJECT_ID>:aud"
```

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

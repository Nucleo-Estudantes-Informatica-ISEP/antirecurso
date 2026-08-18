# AntiRecurso

AntiRecurso is the web frontend for NEI ISEP's exam-preparation platform. It gives students a browser-based interface to practice subject-specific exams, review results, track rankings, browse study notes, and access profile and admin features through a hosted authentication flow.

## Key Features

- Subject-based exam practice with multiple answering modes
- Scoreboards and personal score tracking
- Protected notes area for authenticated users
- Hosted authentication flow backed by NextAuth and Zitadel/AuthNEI
- Admin dashboard for activity, comments, reports, notes, and users
- Cookie consent, changelog popup, theming, and responsive UI

## Tech Stack

- **Runtime**: Node.js 20.9+ and pnpm 9
- **Framework**: Next.js 16 App Router
- **UI**: React 19, Tailwind CSS, Framer Motion
- **Auth**: NextAuth 4 with the Zitadel provider
- **Validation**: Zod
- **Charts**: Chart.js and react-chartjs-2
- **Data Fetching**: native `fetch` plus SWR where needed
- **Language**: TypeScript

## Architecture Overview

This repository is a frontend application, not the full AntiRecurso platform.

- The UI is rendered by Next.js in [`src/app`](src/app/).
- Authentication is handled through NextAuth in [`src/lib/auth.ts`](src/lib/auth.ts) with a hosted Zitadel/AuthNEI login flow.
- Business data such as users, subjects, exams, scores, notes, and admin stats comes from an external backend API defined by `NEXT_PUBLIC_BASE_URL`.
- Authenticated requests can be proxied through `src/app/api/backend/[...path]/route.ts`, which forwards the logged-in user's access token to the upstream backend.
- Admin routes are guarded by [`src/proxy.ts`](src/proxy.ts), which checks the session token and validates backend admin access before allowing the request through.

### Main Route Groups

- `/` - landing page
- `/exams` - subject picker for exam sessions
- `/exams/[id]/answer` - exam answering flow
- `/exams/[id]/review` - answer review flow
- `/scoreboard` - subject picker for rankings
- `/notes` - subject picker for study notes
- `/profile` - authenticated user profile and previous results
- `/admin` - protected admin dashboard
- `/login`, `/register`, `/reset-password` - hosted auth entry points

### Authentication Notes

This codebase no longer supports password-based local auth forms.

- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/reset-password`
- `POST /api/auth/reset-password/send`

These endpoints intentionally return `410 Gone` and direct users to the hosted AuthNEI flow instead.

## Repository Structure

```text
.
├── assets/                 Legacy README screenshots and static media
├── public/                 Favicons, logos, images, manifest, robots.txt
├── scripts/                Utility scripts
├── src/
│   ├── app/                App Router pages, layouts, route handlers
│   ├── components/         UI components by domain
│   ├── config/             App constants and feature flags
│   ├── contexts/           React context providers
│   ├── hooks/              Custom React hooks
│   ├── lib/                Auth and server-side session helpers
│   ├── schemas/            Zod schemas
│   ├── services/           Backend-facing service functions
│   ├── styles/             Global and shared styles
│   ├── types/              TypeScript domain types
│   └── utils/              Shared helpers
├── .env.example            Sample environment configuration
├── next.config.js          Next.js configuration
├── package.json            Scripts and dependencies
└── tailwind.config.js      Tailwind setup
```

## Prerequisites

Install the following before running the project locally:

- Node.js `>=20.9.0`
- pnpm `>=9`
- Access to a running AntiRecurso backend API
- Access to a Zitadel/AuthNEI client configuration for local login testing

If you use `nvm`, the repository includes [`.nvmrc`](.nvmrc).

## Getting Started

### 1. Clone the repository

```bash
git clone <your-fork-or-origin-url>
cd antirecurso
```

### 2. Select the Node version

```bash
nvm use
```

If you do not use `nvm`, install a compatible Node.js version manually.

### 3. Install dependencies

The project enforces pnpm via `only-allow`.

```bash
pnpm install
```

### 4. Create your local environment file

Copy the example file:

```bash
cp .env.example .env.local
```

Next.js also works with `.env`, but `.env.local` is the preferred local-development file.

### 5. Configure environment variables

At minimum, define the variables below before starting the app.

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_BASE_URL` | Yes | Base URL of the current AdonisJS AntiRecurso backend API. It is documented in `.env.example`. |
| `NEXTAUTH_URL` | Production | Canonical public URL of the deployed AntiRecurso frontend used by NextAuth. |
| `AUTH_SECRET` | Yes | NextAuth secret used to sign and decrypt session tokens. |
| `AUTH_ISSUER_URL` | Yes | Zitadel/AuthNEI issuer URL. |
| `AUTH_CLIENT_ID` | Yes | OAuth client ID for the hosted login flow. |
| `AUTH_CLIENT_SECRET` | Usually | OAuth client secret for the Zitadel provider. |
| `AUTH_SCOPES` | No | Defaults to `openid email profile offline_access`. Keep `offline_access` enabled when refresh tokens are required. |
| `AUTH_ROLE_CLAIM` | No | Override for the AntiRecurso Project's ZITADEL role claim. |
| `AUTH_POST_LOGOUT_REDIRECT_URI` | Recommended | Redirect target after logout. Defaults to `/` if omitted. |
| `AUTH_DEBUG` | No | Set to `true` to enable verbose auth logging. |

The sample file also contains:

- `APP_BASE_URL`
- `AUTH_REDIRECT_URI`

Those values may still be useful for external auth-provider setup, but they are not referenced directly by this frontend codebase. The effective NextAuth callback URL is derived from `NEXTAUTH_URL`, so the corresponding `/api/auth/callback/zitadel` URL must also be registered on the ZITADEL application.

Do not include leading or trailing whitespace in credentials or URLs. In particular, whitespace in `AUTH_CLIENT_SECRET` changes the secret value and will make OAuth token exchanges fail.

Example local configuration:

```dotenv
NEXT_PUBLIC_BASE_URL=http://localhost:4000
NEXTAUTH_URL=http://localhost:3000
AUTH_SECRET=replace-with-a-long-random-secret
AUTH_ISSUER_URL=https://auth.example.com
AUTH_CLIENT_ID=replace-with-your-client-id
AUTH_CLIENT_SECRET=replace-with-your-client-secret
AUTH_SCOPES=openid email profile offline_access
AUTH_POST_LOGOUT_REDIRECT_URI=http://localhost:3000
AUTH_DEBUG=false
```

### 6. Start the development server

```bash
pnpm dev
```

The app runs on [http://localhost:3000](http://localhost:3000) by default.

## Available Scripts

Defined in [`package.json`](package.json):

- `pnpm dev` - start the Next.js development server
- `pnpm build` - create a production build
- `pnpm start` - start the production server
- `pnpm lint` - run ESLint
- `pnpm typecheck` - run TypeScript without emitting files
- `pnpm test` - run the Vitest regression suite

## Development Notes

### Backend Dependency

Most meaningful pages depend on a live backend:

- subject lists are fetched from the API
- profile data is fetched from `/user`
- scoreboard data comes from backend score endpoints
- admin pages call protected admin endpoints

Without a reachable backend and valid auth configuration, the app will render incompletely or redirect away from protected routes.

### Session Model

The app uses a JWT session strategy:

- NextAuth stores the upstream access token and ID token in its JWT
- server helpers in [`src/lib/server-auth.ts`](src/lib/server-auth.ts) read those tokens from cookies
- authenticated server components fetch user data from the backend before rendering
- the `/api/backend/*` proxy forwards the bearer token to the upstream API
- expired access tokens are refreshed through a single in-flight request so concurrent server calls do not race
- rotated session cookies are persisted, and an invalid refresh clears the session instead of looping

### Theming and Global UX

The root layout in [`src/app/layout.tsx`](src/app/layout.tsx) wires up:

- global styles
- the top navigation bar
- auth context
- theme provider
- changelog popup
- cookie consent banner

## Deployment Guidance

No deployment manifests such as `Dockerfile`, `vercel.json`, `render.yaml`, or `fly.toml` are currently committed in this repository. That means deployment is flexible, but you need to provide the surrounding infrastructure yourself.

For production you need:

- a Node-compatible host capable of running `next build` and `next start`
- all auth-related environment variables
- a reachable backend API URL for `NEXT_PUBLIC_BASE_URL`
- a correctly configured callback and logout setup in Zitadel/AuthNEI

A typical production build flow is:

```bash
pnpm install --frozen-lockfile
pnpm build
pnpm start
```

If you deploy behind a reverse proxy or managed platform, ensure:

- HTTPS is enabled
- `NEXTAUTH_URL` matches the canonical public frontend URL
- your auth issuer accepts the production callback URL
- `AUTH_POST_LOGOUT_REDIRECT_URI` matches the deployed frontend URL

GitHub CI does not itself deploy. It requires a frozen install, lint, typecheck, tests, production build, production dependency audit, and Gitleaks. After a reviewed merge, verify the deployed commit in the hosting control plane and smoke the root plus login/refresh/logout and the affected exam flow. When a web change depends on the Adonis API, deploy the API and its migrations first.

For regressions, prefer TDD: add a focused failing test, implement the smallest correction, then refactor with the suite green. See [`AGENTS.md`](AGENTS.md) for the required workflow.

## Troubleshooting

### Login succeeds but the app acts logged out

Check:

- `NEXTAUTH_URL`
- `AUTH_SECRET`
- `AUTH_ISSUER_URL`
- `AUTH_CLIENT_ID`
- `AUTH_CLIENT_SECRET`
- that none of those values contain accidental whitespace
- whether the issued access token is expired

The auth helper marks expired tokens with `AccessTokenExpired`, and protected routes will reject them.

### Pages fail with missing data

Check:

- `NEXT_PUBLIC_BASE_URL`
- backend availability
- whether the backend accepts the forwarded bearer token

### Admin routes redirect to the homepage

That usually means one of the following:

- there is no valid session token
- the upstream access token expired
- the backend `/admin` check returned a non-200 status

## Contributing

Contributions are welcome. Start with [`CONTRIBUTING.md`](CONTRIBUTING.md) for contribution workflow and expectations.

## Security

If you discover a vulnerability, read [`SECURITY.md`](SECURITY.md) before disclosing it.

## License

This project is licensed under the GNU General Public License v3.0. See [`LICENSE`](LICENSE).

## Contact

- Email: `support.antirecurso@nei-isep.org`
- Public site: [https://antirecurso.nei-isep.org](https://antirecurso.nei-isep.org)

## AuthNEI project authorization

AntiRecurso has its own ZITADEL Project. Normal authenticated use is not gated by a `student` role;
users authenticate through AuthNEI and the application only consumes roles that are meaningful to
AntiRecurso itself. At present, `admin` is the application authorization role used for privileged
operations.

Role data is normalized only from the AntiRecurso Project role claim into `session.user.roles`.
Claims belonging to other ZITADEL Projects are deliberately ignored so a role from another NEI
application cannot grant AntiRecurso privileges. The browser may use role data for presentation,
but the Adonis API remains the final authorization enforcement point.

Normal login permits SSO without forcing an account picker. The user menu exposes separate actions
for app-only logout, account switching (`prompt=select_account`), and central AuthNEI logout.

`AUTH_ROLE_CLAIM` may override the default `urn:zitadel:iam:org:project:roles` claim name. Configure
the AntiRecurso OIDC applications to include their own Project Role Assertions and the API audience
expected by the backend.

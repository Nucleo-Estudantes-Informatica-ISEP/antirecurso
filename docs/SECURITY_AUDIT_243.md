# Antirecurso web security audit

The audit covered web `dev` at `7c6fcf3b14d5a88287b4bc500091b3f5961ce4c0` and Adonis API `dev` at `c18d03d28f009423528fb95b12d954955e1021ab`. The scope follows [#243](https://github.com/Nucleo-Estudantes-Informatica-ISEP/antirecurso/issues/243) and uses [OWASP ASVS](https://asvs.owasp.org/) as a reference for the controls reviewed. These revisions are integration branch tips. Production versions and effective infrastructure settings require a separate check.

The API route matrix and evidence are in the [companion Adonis audit report](https://github.com/Nucleo-Estudantes-Informatica-ISEP/antirecurso-api-adonis/blob/6f4fe5c050f5dbe6217cb2fa1d46ec72b3f5f542/docs/SECURITY_AUDIT_243.md). Its UserInfo fix is in [Adonis PR #185](https://github.com/Nucleo-Estudantes-Informatica-ISEP/antirecurso-api-adonis/pull/185), with dependency remediation tracked in [#182](https://github.com/Nucleo-Estudantes-Informatica-ISEP/antirecurso-api-adonis/issues/182) and [#183](https://github.com/Nucleo-Estudantes-Informatica-ISEP/antirecurso-api-adonis/issues/183).

## Route inventory

`src/proxy.ts` resolves the language and guards all `/admin` paths with a web session, the AuthNEI admin role and a successful Adonis `GET /admin` check. API paths have their own handlers. Page routes below also have `/pt` and `/en` entry points. Root, auth, exam and admin layouts wrap the listed pages without defining additional URLs. The production build route inventory was compared with the route files.

| Page routes | Intended access and enforcement |
| --- | --- |
| `/`, `/about`, `/changelog`, `/cookie-policy`, `/privacy-policy`, `/robots.txt`, `/sitemap.xml`, framework 404 and static assets | Public. Public metadata and published pages. |
| `/login`, `/register`, `/reset-password`, `/reset-password/new`, `/reset-password/verify` | Public entry to hosted AuthNEI flows. Password verification and recovery belong to AuthNEI. |
| `/account/resolve`, `/conta/resolver` | Public shells. The session view and account-resolution mutation require authenticated API access. |
| `/profile` | Session and current-user profile checked server-side. Adonis scopes scores and pending exams to the authenticated user. |
| `/admin`, `/admin/users`, `/admin/comments`, `/admin/events`, `/admin/notes`, `/admin/question-reports` | Admin page guard. Adonis enforces access to each underlying admin resource or mutation. Shared comments and notes reads have their own API rules. |
| `/exams`, `/exams/:id/answer` | Public exam selection. Subject IDs identify published course content. |
| `/exams/:id/answer/:mode` | Public shell for guest modes. Adonis gates account-only modes and persisted attempts. |
| `/exams/:id/points`, `/exams/:id/review` | Public shells. Stored results require an authenticated owner or permitted admin. Guest result pages render the latest result from browser exam state. |
| `/notes` | Public subject catalogue. |
| `/notes/:id` | Web page requires an authenticated session before fetching subject notes. The underlying Adonis catalogue is public and adds like state for authenticated viewers. File access, visit grants and likes have separate authenticated endpoints. |
| `/scoreboard`, `/scoreboard/:id` | Public scoreboard. Adonis applies the visibility setting for listed users. |
| `/stats/:id` | Public shell. Personal statistics require an authenticated API call scoped to the current user. |

| Route handlers | Intended access and enforcement |
| --- | --- |
| `GET, POST /api/auth/[...nextauth]` | NextAuth provider discovery, CSRF, sign-in, OAuth callback, sign-out, and framework auth actions. State and PKCE protect the ZITADEL callback. Sign-in compares the verified UserInfo email and subject with the OIDC identity. |
| `GET /api/auth/session` | Requires an access token from the web session and successful Adonis `GET /user`. Browser receives profile data and an opaque session marker. |
| `PATCH /api/auth/logout` | Returns an application redirect or configured AuthNEI end-session URL. Adds an ID-token hint only when a session has one. NextAuth sign-out separately clears the cookie. |
| `GET /api/auth/profile` | Public redirect to the configured identity portal, which enforces its own profile access. |
| `POST /api/auth/login`, `/api/auth/register`, `/api/auth/reset-password`, `/api/auth/reset-password/send` | Retired compatibility handlers. Return `410`; accept no local account or password actions. |
| `GET, POST, PATCH, PUT, DELETE /api/protected/:path*` | Requires a session-derived access token. Adonis rechecks token validity, roles and resource ownership. |
| `GET, POST, PATCH, PUT, DELETE /api/public/:path*` | Forwarded without browser cookies or bearer tokens. Adonis rejects calls to protected resources. |
| `/api/backend/*` | Coolify ingress path to Adonis in the deployment configuration. There is no Next route handler for this path at the audited revision. |

## Control review

- **Session and redirects.** The installed NextAuth ZITADEL provider uses PKCE and state. Default cookies are host-only, `HttpOnly`, `SameSite=Lax` and `Secure` on HTTPS. State and PKCE expire after 15 minutes. JWT sessions default to 30 days. Refresh uses the configured issuer, rechecks roles and deduplicates concurrent refreshes within one process. Cookie writes preserve chunk cleanup and the active cookie flags. NextAuth restricts callbacks to relative paths or the application origin. Provider logout and secure-only cookie handling have private follow-up records.
- **Browser request origin.** NextAuth uses its CSRF token on auth actions. Adonis uses bearer authorization at the API boundary. The web BFF uses cookies and requires a separate browser-origin policy. The audit tracked this and request-body resource limits privately.
- **Proxy and upstream trust.** The two Next catch-alls now use one forwarder. Route segments are validated against the API's path format, queries are copied as parameters, only the configured HTTP(S) upstream is contacted, and redirects fail closed. Only the protected handler can supply a bearer token. Responses keep selected content and application headers, use private no-store caching, and return generic transport failures. JSON and raw PDF upload bodies use the same byte-preserving path. Direct server-component API calls were reviewed separately and have a private follow-up for consistent origin and path enforcement.
- **Tokens, secrets and browser output.** Access, refresh and ID tokens stay in the encrypted session, apart from the configured OIDC logout hint. Public build configuration carries the public API URL. The client session marker cannot authorize direct API traffic. Production Compose now requires an explicit or Coolify-generated secret. Auth debugging is off by default. The client build was searched for server-only auth, database and storage variable names. Gitleaks checked the integration branch delta.
- **Identifiers, content and storage.** Exam IDs are ordinary resource selectors. The UI uses the protected detailed-review API and validates numeric review IDs. Notes use authenticated, expiring file grants; the API owns upload authorization and private object access. React renders application text as text. Reviewed note navigation, question/option content, avatar URLs and the configured image optimizer hosts. Privacy and content assumptions for imported note data remain part of the deployment check.
- **Scheduled jobs and webhooks.** The web application has no scheduled HTTP callback or inbound webhook route. CI and release workflows use GitHub-scoped permissions. The API audit covers the runtime exam cleanup and the dependency audit workflow.

## Verification and remaining limits

- Frozen pnpm 12.6.0 install, lint, typecheck, production build and production dependency audit passed on macOS with Node 26.13.1. Lint had two existing navigation warnings. The full Vitest run passed 100 tests, followed by a passing run of all four deployment configuration tests after the Compose change. Proxy tests cover anonymous forwarding, token replacement, path containment, binary payloads, private caching and generic upstream failures. The production audit reported zero web advisories.
- Compose validation rejected an unset session secret and accepted either configured source using synthetic values. The web audit does not infer the actual deployed value or whether it needs rotation.
- The Docker builder target passed with the Coolify `NODE_ENV=development` build argument. The route matrices were checked against the Next route files, production build inventory, and all 54 explicit Adonis routes.
- No production probing was performed. Staging validation should check effective HTTPS cookie flags, hosted login/refresh/logout, provider session invalidation, ingress path and origin routing, and authenticated note/exam/admin behavior with test accounts. The API audit records the PostgreSQL, storage and database-grant boundary. Private findings are available to authorized repository maintainers through the GitHub advisory areas for [web](https://github.com/Nucleo-Estudantes-Informatica-ISEP/antirecurso/security/advisories) and [Adonis API](https://github.com/Nucleo-Estudantes-Informatica-ISEP/antirecurso-api-adonis/security/advisories).

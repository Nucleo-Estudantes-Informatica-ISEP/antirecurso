# AGENTS.md

Contributor and automation instructions for the Antirecurso web application. `README.md` covers setup and `CONTRIBUTING.md` covers community participation; this file defines the engineering workflow.

## Workflow

- Branch from `main` using a conventional prefix (`fix/`, `feat/`, `docs/`, `test/`, `build/`, `chore/`) and open a PR back to `main`.
- Use Conventional Commits and split unrelated concerns. Put `Closes #N` in the PR body only when the merged PR fully resolves the issue.
- Prefer TDD for bug fixes, session behavior, exam state, calculations, authorization, and pure logic: write a focused failing test, implement the smallest correction, then refactor with the suite green. If a live identity/API dependency prevents the red test, document the constraint and add the nearest deterministic regression plus a staging smoke step.
- Do not duplicate an existing PR. Preserve useful authored commits in the replacement and close the superseded PR once reviewers have one complete path.

## Required verification

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm audit --prod
```

Every behavior change needs a regression test. Test visible behavior and contracts, not component implementation details.

GitHub CI requires the frozen install, lint, typecheck, Vitest suite, production build, production dependency audit, and Gitleaks. `main` requires both named checks, resolved conversations, and one CODEOWNER approval. Never weaken a gate to obtain green status.

## Deployment and API coupling

This repository is the web frontend; `antirecurso-api-adonis` is the current backend. For changes that modify both contracts, deploy the reviewed API and its migrations first, smoke it, then deploy the web PR. The web must never fall back from an owner-protected endpoint to a public detailed-review route.

GitHub CI does not claim or trigger production deployment. Verify the deployed SHA, frontend root, session refresh/login/logout, and the affected exam/profile/admin flow in staging/production. Keep ZITADEL/AuthNEI credentials in the deployment secret manager.

Dependabot routine groups are patch/minor only. Major Next.js, React, Tailwind, Zod, TypeScript, ESLint, or auth upgrades require an explicit migration PR and full compatibility tests.

## Documentation

Keep `README.md`, `CONTRIBUTING.md`, `.env.example`, and this file synchronized with scripts, environment names, auth/session behavior, CI checks, backend dependencies, and deployment order. Remove obsolete local-auth, Laravel, starter-template, or retired deployment instructions rather than leaving them as alternatives.

# Contributing to AntiRecurso

Follow the [NEI-ISEP contribution guide](https://github.com/Nucleo-Estudantes-Informatica-ISEP/.github/blob/master/CONTRIBUTING.md)
and [Code of Conduct](https://github.com/Nucleo-Estudantes-Informatica-ISEP/.github/blob/master/CODE_OF_CONDUCT.md).
The project-specific workflow is defined in [AGENTS.md](AGENTS.md); local setup and
deployment guidance are in [README.md](README.md).

- Branch from an updated `dev` using `fix/`, `feat/`, `docs/`, `test/`, `build/`, or `chore/`.
- Use Conventional Commits and open pull requests against `dev`. Reviewed releases
  reach `main` through a separate release pull request.
- Add regression tests for behavior changes. Run the checks required by
  [AGENTS.md](AGENTS.md) and describe their results and any unverified scope in the PR.
  Documentation-only changes require content, link and filename checks plus
  `git diff --check`; local application checks are unnecessary.
- Link the existing issue through the PR's Development relationship, use applicable
  repository labels, and assign the PR to its author.
- Keep credentials and private data out of commits. Report vulnerabilities through
  [SECURITY.md](SECURITY.md).

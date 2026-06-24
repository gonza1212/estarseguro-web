# CONTRIBUTING.md

## Philosophy

The agent never commits or pushes without explicit developer confirmation. No git step is automatic: every commit, every merge, every push is triggered by the developer, not the agent.

## Branch structure

- `main` — stable branch, always deployable
- `dev` — in-progress work integration
- `feature/xxx` — domain features
- `spike/xxx` — infrastructure spikes
- `fix/xxx` — bug fixes

Never commit directly to `main`.

## Feature/spike branch workflow

Five phases:

1. **Implementation** — the agent implements the unit according to the corresponding task file
2. **Smoke tests and fixes** — the developer runs the manual smoke test from the task file and reports failures; the agent fixes them. The agent does not commit during this phase, regardless of how many fixes are needed
3. **Commit and merge** — the agent waits for explicit developer confirmation before moving from Phase 2 to this one. Only then does it commit with the corresponding message and merge to `dev`
4. **Documentation** — `CONTEXT.md` is updated with what was done, decisions made during implementation, and the next unit
5. **Merge to main and sync** — when the developer decides, `dev` is merged to `main` and synced

## Fix branch workflow

Same five-phase scheme, adapted to fixes: fix implementation → fix smoke test → commit and merge (with confirmation) → documentation in `CONTEXT.md` → merge to main.

## Commit convention

Types: `feat`, `fix`, `spike`, `chore`, `test`, `refactor`, `ux`, `perf`. Messages always in English, imperative mood, concise.

Example: `spike: configure Astro, Tailwind v4, and light/dark theme system`

## 3-attempt rule

If the agent does not solve a problem in 3 concrete prompts, it stops and waits for manual developer intervention. It does not keep trying variations of the same solution indefinitely.

## Task file naming convention

Format `[type]-[number]-[name].md`, two digits, kebab-case.

Examples: `spike-01-setup-proyecto.md`, `feature-02-hero-carousel.md`, `fix-01-form-validation.md`

## Quality gate

**Build:**
```
pnpm build
```

**Linting:**
```
pnpm lint
```

**Automated tests:** not applicable in this project. No test runner or automated test suite.

**Smoke tests:** manual, documented in each task file as a list of concrete, verifiable steps. No automated smoke tests or UI/integration testing framework.

**Versioning:** not applicable. The project does not use semantic versioning or expose a runtime version number.

## Files always given to the agent

- `ARCHITECTURE.md`
- `CONTEXT.md`
- Task file of the active unit

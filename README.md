# Estar Seguro

Corporate landing page for Estar Seguro, insurance producers and advisors. Single-page static SPA built with Astro and Tailwind v4.

## Stack

- **Astro** — static site generation
- **Tailwind v4** — utility-first CSS (native integration, no config file)
- **Alpine.js** — used exclusively for the hero carousel
- **TypeScript** — strict mode
- **pnpm >= 11** — package manager (never npm)

## Setup

```bash
pnpm install
cp .env.example .env   # fill in real values
pnpm dev
```

## Environment variables

| Variable | Description |
|----------|-------------|
| `PUBLIC_WHATSAPP_NUMBER` | WhatsApp phone number for CTA links (e.g. `5491112345678`) |
| `PUBLIC_INSTAGRAM_URL` | Instagram profile URL |

## Quality gate

```bash
pnpm build        # static build
pnpm lint         # ESLint
pnpm astro check  # type checking
```

All three must pass before committing.

## Deploy

Push to `main` triggers a GitHub Actions workflow that builds the project and uploads `dist/` to Hostinger via FTP.

## Project structure

```
src/
├── assets/        # images, fonts
├── components/    # .astro components
├── data/          # static datasets (insurances, companies)
├── layouts/       # MainLayout
├── pages/         # index.astro (single page)
├── scripts/       # vanilla JS (validation, messaging)
├── styles/        # global.css (CSS tokens, Tailwind)
└── utils/         # theme.ts
```

## Documentation

- `ARCHITECTURE.md` — system model, constraints, frozen decisions
- `CONTEXT.md` — living project state, decisions, timeline
- `CONTRIBUTING.md` — branch workflow, commit convention, quality gate
- `tasks/` — feature and spike task files

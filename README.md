# Estar Seguro

Corporate landing page (static SPA with scroll and anchors) for Estar Seguro, insurance producers and advisors in Argentina. Single-page site focused on driving WhatsApp conversations as the primary contact channel.

## Stack

- **[Astro](https://astro.build)** — static site generator
- **[Tailwind CSS v4](https://tailwindcss.com)** — utility-first styling, native Vite integration
- **[Alpine.js](https://alpinejs.dev)** — used exclusively for the hero carousel
- **TypeScript** — strict mode
- **pnpm >= 11** — package manager (npm is not used in this project)

## Sections

The home page (`src/pages/index.astro`) is composed of these sections, in order:

1. **Hero** — image carousel (Alpine.js, 5 slides, 5s autoplay) + quote form (vanilla JS validation)
2. **Insurances** — 5 insurance product cards (ART, Sepelio, Autos, Empresas, Otros)
3. **Why Choose Us** — institutional copy + WhatsApp call to action
4. **Companies** — logos of the 5 insurers we work with, staggered entry animation
5. **Footer** — 4-column corporate footer with bottom bar (social icons + dynamic-year copyright)

A persistent **floating WhatsApp CTA** is rendered from `MainLayout.astro`. It is hidden when the hero section is in the viewport and reappears when the user scrolls past it.

## Local development

```bash
pnpm install
cp .env.example .env   # then fill in real values
pnpm dev
```

The dev server runs at `http://localhost:4321`.

## Environment variables

All variables are read at build time via `import.meta.env`. The `.env` file is gitignored — only `.env.example` is committed.

| Variable | Description | Example |
|----------|-------------|---------|
| `PUBLIC_WHATSAPP_NUMBER` | WhatsApp phone number, digits only (no `+`) | `5491112345678` |
| `PUBLIC_INSTAGRAM_URL` | Instagram profile URL | `https://instagram.com/estarseguro` |
| `PUBLIC_FACEBOOK_URL` | Facebook page URL | `https://facebook.com/estarseguro` |

The placeholder values in `.env.example` are safe to commit but will produce a non-functional site. Use real values for local dev and for production builds.

## Quality gate

```bash
pnpm build        # static build → dist/
pnpm lint         # ESLint
pnpm astro check  # type checking
```

All three must pass before any commit. The full contribution workflow (branches, commits, merges) is documented in [`CONTRIBUTING.md`](./CONTRIBUTING.md).

## Deploy

Every push to `main` triggers a GitHub Actions workflow (`.github/workflows/deploy.yml`) that installs dependencies, builds the static site, and uploads `dist/` to the Hostinger server via FTP.

The integration branch is `dev` — features are merged there with `--no-ff`, and `dev` is merged into `main` when a release is ready.

## Project structure

```
src/
├── assets/        # images (webp, favicon)
├── components/    # .astro components
├── data/          # static datasets (insurances, companies)
├── layouts/       # MainLayout
├── pages/         # index.astro (single page)
├── scripts/       # vanilla JS (form validation, WhatsApp message)
├── styles/        # global.css (CSS tokens, Tailwind)
├── types/         # ambient TypeScript declarations
└── utils/         # theme helpers
```

## Documentation

- [`ARCHITECTURE.md`](./ARCHITECTURE.md) — system model, frozen decisions, pending items
- [`CONTEXT.md`](./CONTEXT.md) — living project state, unit timeline, decisions per unit
- [`CONTRIBUTING.md`](./CONTRIBUTING.md) — branch workflow, commit convention, quality gate
- [`tasks/`](./tasks/) — per-unit task files (features, spikes, fixes)

# CONTRIBUTING.md

## Filosofía

El agente nunca hace commit ni push sin confirmación explícita del desarrollador. Ningún paso de git es automático: cada commit, cada merge, cada push lo dispara el desarrollador, no el agente.

## Estructura de ramas

- `main` — rama estable, siempre deployable
- `dev` — integración de trabajo en curso
- `feature/xxx` — features de dominio
- `spike/xxx` — spikes de infraestructura
- `fix/xxx` — correcciones de bugs

Nunca se commitea directo a `main`.

## Workflow de feature/spike branch

Cinco fases:

1. **Implementación** — el agente implementa la unidad según el task file correspondiente
2. **Smoke tests y correcciones** — el desarrollador ejecuta el smoke test manual del task file y reporta lo que falla; el agente corrige. El agente no hace commit durante esta fase, sin importar cuántas correcciones se necesiten
3. **Commit y merge** — el agente espera confirmación explícita del desarrollador antes de pasar de la Fase 2 a esta. Solo entonces hace commit con el mensaje correspondiente y mergea a `dev`
4. **Documentación** — se actualiza `CONTEXT.md` con qué se hizo, decisiones tomadas durante la implementación, y la próxima unidad
5. **Merge a main y sincronización** — cuando el desarrollador lo decide, se mergea `dev` a `main` y se sincroniza

## Workflow de fix branch

Mismo esquema de cinco fases, adaptado a fixes: implementación del fix → smoke test de la corrección → commit y merge (con confirmación) → documentación en `CONTEXT.md` → merge a main.

## Convención de commits

Tipos: `feat`, `fix`, `spike`, `chore`, `test`. Mensajes siempre en español.

Ejemplo: `spike: configurar Astro, Tailwind v4 y sistema de tema claro/oscuro`

## Regla de los 3 intentos

Si el agente no resuelve un problema en 3 prompts concretos, se detiene y espera intervención manual del desarrollador. No sigue intentando variaciones de la misma solución indefinidamente.

## Convención de nomenclatura de task files

Formato `[tipo]-[número]-[nombre].md`, dos dígitos, kebab-case.

Ejemplos: `spike-01-setup-proyecto.md`, `feature-02-hero-carousel.md`, `fix-01-validacion-formulario.md`

## Quality gate

**Build:**
```
pnpm build
```

**Linting:**
```
pnpm lint
```

**Tests automatizados:** no aplica en este proyecto. Sin test runner ni suite de tests automatizados.

**Smoke tests:** manuales, documentados en cada task file como lista de pasos concretos y verificables. No hay smoke tests automatizados ni framework de testing de UI/integración.

**Versionado:** no aplica. El proyecto no usa versionado semántico ni expone número de versión en runtime.

## Archivos que siempre van al agente

- `ARCHITECTURE.md`
- `CONTEXT.md`
- Task file de la unidad activa

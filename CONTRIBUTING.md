# Contributing

Este repositorio es una pieza de portfolio personal — no es código abierto, no es un proyecto colaborativo, ni siquiera en equipo. Aún así, el developer mantiene un workflow disciplinado para tener trazabilidad de los cambios y poder razonar sobre ellos en sesiones futuras. Esta nota documenta ese workflow para referencia interna del developer y del coding agent.

## Ramas y workflow

- `main` — branch de producción (cada push dispara el deploy a Hostinger via GitHub Actions)
- `dev` — branch de integración
- `feature/xx-name` — features nuevas
- `spike/xx-name` — spikes de infraestructura
- `fix/xx-name` — bug fixes

**Excepción documentada:** commits directos a `main` están autorizados únicamente para cambios puramente documentales (por ejemplo `README.md` o metadata de GitHub vía `gh repo edit`). Para código, el flujo es: `feature/xx` → `dev` (--no-ff) → release `dev` → `main`.

## Workflow de feature/spike/fix

Cinco fases:

1. **Implementación** — el agente implementa la unidad según el task file correspondiente
2. **Smoke tests y fixes** — el developer corre el smoke test manual y reporta fallos; el agente arregla. El agente NO commitea en esta fase, sin importar cuántos fixes haya
3. **Commit y merge a dev** — el agente espera confirmación explícita del developer. Solo entonces commitea con el mensaje correspondiente y mergea a `dev` (--no-ff)
4. **Documentación** — `CONTEXT.md` se actualiza con lo hecho, decisiones tomadas, y la siguiente unidad
5. **Release a main** — cuando el developer decide, `dev` se mergea a `main` y se pushea (dispara el deploy a Hostinger)

## Convención de commits

- Tipos: `feat`, `fix`, `spike`, `chore`, `test`, `refactor`, `ux`, `perf`
- Mensajes en inglés, modo imperativo, concisos
- Ejemplo: `feat: agregar sección Compañías con animación de entrada`

## Regla de 3 intentos

Si el agente no resuelve un problema en 3 prompts concretos, para y espera intervención manual del developer. No sigue intentando variaciones de la misma solución indefinidamente.

## Task files

Formato `[type]-[number]-[name].md`, dos dígitos, kebab-case. Ejemplos: `spike-01-setup-proyecto.md`, `feature-02-hero-carousel.md`, `fix-01-form-validation.md`.

## Quality gate

```
pnpm build        # build estático → dist/
pnpm lint         # ESLint
pnpm astro check  # type checking
```

Los tres deben pasar antes de cualquier commit. Tests automatizados no aplican en este proyecto (verificación via smoke tests manuales documentados en cada task file).

## Archivos siempre provistos al agente

- `ARCHITECTURE.md` — modelo del sistema, decisiones frozen, items pendientes
- `CONTEXT.md` — estado vivo del proyecto, timeline, decisiones por unidad
- Task file de la unidad activa (en `tasks/`)

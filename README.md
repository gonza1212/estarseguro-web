# Estar Seguro

Sitio web corporativo de Estar Seguro, productores asesores de seguros. Landing page de una página con scroll y anchors, construida con Astro + Tailwind. Pieza de portfolio personal — este repositorio no es código abierto ni acepta contribuciones.

## Stack

- [Astro](https://astro.build) — generador de sitios estáticos
- [Tailwind CSS v4](https://tailwindcss.com) — utility-first, integración nativa vía Vite
- [Alpine.js](https://alpinejs.dev) — exclusivamente para el carousel del hero
- TypeScript — modo estricto

## Secciones de la página

1. **Hero** — carousel de imágenes (Alpine.js, 5 slides, autoplay 5s) + formulario de cotización
2. **Seguros** — 5 tarjetas de productos (ART, Sepelio, Autos, Empresas, Otros)
3. **Por qué elegirnos** — copy institucional + llamada a la acción de WhatsApp
4. **Compañías** — logos de las 5 aseguradoras con animación de entrada
5. **Footer** — corporativo de 4 columnas con barra inferior

Un **CTA flotante de WhatsApp** persistente se renderiza desde el layout principal. Se oculta cuando el hero está en viewport y reaparece al scrollear más allá.

## Producción

El sitio se deploya automáticamente a Hostinger via GitHub Actions en cada push a `main`.

---

[estarseguro.com.ar](https://estarseguro.com.ar)

---

Diseñado y desarrollado por [Rotative](https://rotative.com.ar).

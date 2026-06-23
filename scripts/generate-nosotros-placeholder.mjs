// Genera el placeholder webp para la columna derecha de la seccion "nosotros".
// Uso: node scripts/generate-nosotros-placeholder.mjs
// Es una imagen 1200x800 de un color solido con el texto "Placeholder nosotros".
// El usuario debe reemplazarla por la imagen real antes de produccion
// (mismo nombre de archivo).

import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(__dirname, '..', 'src', 'assets');

const width = 1200;
const height = 800;
const bg = { r: 30, g: 41, b: 59 };
const fg = { r: 255, g: 255, b: 255 };

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <rect width="100%" height="100%" fill="rgb(${bg.r},${bg.g},${bg.b})"/>
  <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle"
    font-family="Arial, sans-serif" font-size="96" font-weight="700"
    fill="rgb(${fg.r},${fg.g},${fg.b})">Placeholder nosotros</text>
</svg>`;

await mkdir(outDir, { recursive: true });

const out = resolve(outDir, 'nosotros.webp');
await sharp(Buffer.from(svg)).webp({ quality: 80 }).toFile(out);
console.log(`generado: ${out}`);

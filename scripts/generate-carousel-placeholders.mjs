// Genera 5 placeholders webp para el carousel del hero.
// Uso: node scripts/generate-carousel-placeholders.mjs
// Los placeholders son imagenes 1920x1080 de un color solido con un texto
// centrado indicando el numero de slot. El usuario debe reemplazarlos por
// las imagenes reales antes de produccion (mismo nombre de archivo).

import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(__dirname, '..', 'src', 'assets');

const palette = [
  { bg: { r: 13, g: 71, b: 161 }, fg: { r: 255, g: 255, b: 255 } },
  { bg: { r: 27, g: 94, b: 32 }, fg: { r: 255, g: 255, b: 255 } },
  { bg: { r: 183, g: 28, b: 28 }, fg: { r: 255, g: 255, b: 255 } },
  { bg: { r: 74, g: 20, b: 140 }, fg: { r: 255, g: 255, b: 255 } },
  { bg: { r: 0, g: 121, b: 107 }, fg: { r: 255, g: 255, b: 255 } },
];

const width = 1920;
const height = 1080;

function makeSvg(bg, fg, label) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <rect width="100%" height="100%" fill="rgb(${bg.r},${bg.g},${bg.b})"/>
    <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle"
      font-family="Arial, sans-serif" font-size="160" font-weight="700"
      fill="rgb(${fg.r},${fg.g},${fg.b})">${label}</text>
  </svg>`;
}

await mkdir(outDir, { recursive: true });

for (let i = 0; i < 5; i++) {
  const { bg, fg } = palette[i];
  const label = `Placeholder ${i + 1}`;
  const svg = makeSvg(bg, fg, label);
  const out = resolve(outDir, `carrousel-${i + 1}.webp`);
  await sharp(Buffer.from(svg)).webp({ quality: 80 }).toFile(out);
  console.log(`generado: ${out}`);
}

// Pads the 5 insurance diamond icons (art, sepelio, autos, empresas, otros)
// to a square canvas with transparent padding so the rhombus does not touch
// the lateral edges of the image.
// Uso: node scripts/square-diamond-icons.mjs
//
// Inputs : src/assets/{art,sepelio,autos,empresas,otros}.webp
// Outputs: same paths, overwritten
//
// Algorithm:
//   1. Read each webp's metadata (w, h)
//   2. Target size = max(w, h) + PADDING (px on all sides; default 40)
//   3. Extend the image with a transparent background until the canvas
//      becomes target x target, keeping the original content centered
//   4. Re-encode as webp at quality 90
//
// Idempotency: NOT idempotent. Running this script twice will add another
// PADDING px on each side (because the second read sees the already-padded
// square). If re-running, restore the original webp first (e.g. from git).

import sharp from 'sharp';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { writeFileSync, readFileSync, unlinkSync, existsSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const assetsDir = resolve(__dirname, '..', 'src', 'assets');

const PADDING = 40;
const QUALITY = 90;

const icons = ['art', 'sepelio', 'autos', 'empresas', 'otros'];

// On Windows, sharp holds the input file open via libvips even after
// .toFile() resolves, so overwriting the original in the same script
// run fails with EBUSY / UNKNOWN. The script therefore writes to a
// sibling `-padded.webp` in a first pass, then swaps them in a second
// pass (--swap) once the first run's file handles have been released.

const SWAP = process.argv.includes('--swap');

if (SWAP) {
  console.log('Swapping originals with padded versions...');
  for (const name of icons) {
    const paddedPath = join(assetsDir, `${name}-padded.webp`);
    const originalPath = join(assetsDir, `${name}.webp`);
    if (existsSync(paddedPath)) {
      const data = readFileSync(paddedPath);
      writeFileSync(originalPath, data);
      unlinkSync(paddedPath);
      console.log(`  ${name}.webp <- ${name}-padded.webp (cleaned up)`);
    } else {
      console.log(`  ${name}-padded.webp not found, skipping`);
    }
  }
  console.log('\nDone.');
  process.exit(0);
}

for (const name of icons) {
  const paddedPath = join(assetsDir, `${name}-padded.webp`);
  const originalPath = join(assetsDir, `${name}.webp`);

  const meta = await sharp(originalPath).metadata();
  if (!meta.width || !meta.height) {
    throw new Error(`Cannot read dimensions of ${originalPath}`);
  }

  const target = Math.max(meta.width, meta.height) + PADDING;
  const top = Math.ceil((target - meta.height) / 2);
  const bottom = Math.floor((target - meta.height) / 2);
  const left = Math.ceil((target - meta.width) / 2);
  const right = Math.floor((target - meta.width) / 2);

  await sharp(originalPath)
    .extend({
      top,
      bottom,
      left,
      right,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .webp({ quality: QUALITY })
    .toFile(paddedPath);

  const out = await sharp(paddedPath).metadata();
  console.log(
    `${name}: ${meta.width}x${meta.height} -> ${out.width}x${out.height} (padding ${top}/${right}/${bottom}/${left}, hasAlpha=${out.hasAlpha})`
  );
}

console.log('\nPadded files written. To swap them into the originals, run:');
console.log('  node scripts/square-diamond-icons.mjs --swap');

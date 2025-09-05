#!/usr/bin/env node
import sharp from 'sharp';
import { mkdirSync, existsSync } from 'fs';
import { dirname, resolve } from 'path';

const src = resolve('src/assets/images/logo.png');
const outDir = resolve('src/assets/images/optimized');
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

const sizes = [256, 512];

async function run() {
  for (const size of sizes) {
    const base = sharp(src).resize(size, size, { fit: 'inside' });
    await Promise.all([
      base.clone().png({ quality: 82, compressionLevel: 9 }).toFile(`${outDir}/logo-${size}.png`),
      base.clone().webp({ quality: 80 }).toFile(`${outDir}/logo-${size}.webp`),
      base.clone().avif({ quality: 55 }).toFile(`${outDir}/logo-${size}.avif`),
    ]);
  }
  console.log('Optimized logo generated into', outDir);
}

run().catch((err) => {
  console.error('Optimize logo failed:', err);
  process.exit(1);
});


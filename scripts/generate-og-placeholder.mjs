import { writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = resolve(__dirname, '..', 'public');

const BG = '#0b0e11';
const ACCENT = '#54FFD5';
const MUTED = '#A6B0C3';
const BORDER = '#1f2630';

const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${BG}"/>
      <stop offset="100%" stop-color="#0F1318"/>
    </linearGradient>
    <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${ACCENT}" stop-opacity="0"/>
      <stop offset="50%" stop-color="${ACCENT}" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="${ACCENT}" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bgGrad)"/>
  <rect x="40" y="40" width="1120" height="550" rx="16" fill="none" stroke="${BORDER}" stroke-width="1"/>
  <line x1="80" y1="200" x2="1120" y2="200" stroke="url(#lineGrad)" stroke-width="1"/>
  <text x="80" y="160" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="22" font-weight="600" fill="${ACCENT}" letter-spacing="6">FIELD NOTES / 0x</text>
  <text x="80" y="360" font-family="ui-sans-serif, system-ui, -apple-system, sans-serif" font-size="104" font-weight="800" fill="#FFFFFF" letter-spacing="-2">0xShinyui</text>
  <text x="80" y="440" font-family="ui-sans-serif, system-ui, -apple-system, sans-serif" font-size="34" font-weight="500" fill="${MUTED}">Engineering · Product · Operations</text>
  <text x="80" y="556" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="20" fill="${MUTED}" opacity="0.7">www.0xshinyui.xyz</text>
  <circle cx="1080" cy="556" r="8" fill="${ACCENT}"/>
</svg>`;

const logoSvg = (size) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${BG}"/>
      <stop offset="100%" stop-color="#0F1318"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.18}" fill="url(#bg)"/>
  <rect x="${size * 0.05}" y="${size * 0.05}" width="${size * 0.9}" height="${size * 0.9}" rx="${size * 0.14}" fill="none" stroke="${BORDER}" stroke-width="${size * 0.008}"/>
  <text x="50%" y="${size * 0.66}" font-family="ui-sans-serif, system-ui, -apple-system, sans-serif" font-size="${size * 0.5}" font-weight="800" fill="${ACCENT}" text-anchor="middle" letter-spacing="-2">0x</text>
</svg>`;

async function renderPng(svg, outPath) {
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(outPath);
  console.log(`✓ wrote ${outPath}`);
}

async function main() {
  await mkdir(PUBLIC_DIR, { recursive: true });

  await renderPng(ogSvg, resolve(PUBLIC_DIR, 'og-default.png'));
  await renderPng(logoSvg(512), resolve(PUBLIC_DIR, 'logo.png'));
  await renderPng(logoSvg(192), resolve(PUBLIC_DIR, 'logo-192.png'));
  await renderPng(logoSvg(180), resolve(PUBLIC_DIR, 'apple-touch-icon.png'));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

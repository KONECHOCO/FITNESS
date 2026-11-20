// Grafiche Google Play da quelle già pronte per l'App Store:
//  - screenshot telefono 1080×1920 (gli screenshot iPhone 1320×2868 superano il rapporto 2:1 di Play,
//    quindi vengono ridimensionati e centrati su sfondo scuro);
//  - screenshot tablet: quelli iPad 2064×2752 così come sono;
//  - icona 512×512 e feature graphic 1024×500.
// Uso: node scripts/render-play-graphics.mjs   → store/play/
import sharp from 'sharp';
import { mkdir, readdir, rm } from 'node:fs/promises';

const SRC = 'fastlane/screenshots';
const OUT = 'store/play';
const BG = { r: 11, g: 14, b: 20, alpha: 1 };

await mkdir(OUT, { recursive: true });
for (const loc of await readdir(SRC)) {
  const files = (await readdir(`${SRC}/${loc}`)).sort();
  await mkdir(`${OUT}/${loc}/phone`, { recursive: true });
  await rm(`${OUT}/${loc}/tablet`, { recursive: true, force: true });
  await mkdir(`${OUT}/${loc}/tablet`, { recursive: true });
  for (const f of files.filter(f => f.endsWith('_1320x2868.png'))) {
    const img = await sharp(`${SRC}/${loc}/${f}`).resize({ height: 1920 }).toBuffer();
    const { width } = await sharp(img).metadata();
    await sharp({ create: { width: 1080, height: 1920, channels: 4, background: BG } })
      .composite([{ input: img, left: Math.round((1080 - width) / 2), top: 0 }])
      .flatten({ background: BG }).png().toFile(`${OUT}/${loc}/phone/${f.replace('_1320x2868', '_1080x1920')}`);
  }
  // Play vuole anche per i tablet il rapporto 9:16: iPad 2064×2752 centrato su 1620×2880
  for (const f of files.filter(f => f.endsWith('_ipad_2064x2752.png'))) {
    const img = await sharp(`${SRC}/${loc}/${f}`).resize({ width: 1620 }).toBuffer();
    const { height } = await sharp(img).metadata();
    await sharp({ create: { width: 1620, height: 2880, channels: 4, background: BG } })
      .composite([{ input: img, left: 0, top: Math.round((2880 - height) / 2) }])
      .flatten({ background: BG }).png().toFile(`${OUT}/${loc}/tablet/${f.replace('_ipad_2064x2752', '_tablet_1620x2880')}`);
  }
  console.log(loc);
}

await sharp('assets/icon-only.png').resize(512, 512).flatten({ background: BG }).png().toFile(`${OUT}/icon_512.png`);

const mask = Buffer.from('<svg width="260" height="260"><rect width="260" height="260" rx="58" fill="#fff"/></svg>');
const icon = await sharp('assets/icon-only.png').resize(260, 260).composite([{ input: mask, blend: 'dest-in' }]).png().toBuffer();
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="500">
  <defs><radialGradient id="g" cx="0.8" cy="0.2" r="0.9"><stop offset="0" stop-color="#26330f"/><stop offset="1" stop-color="#0b0e14"/></radialGradient></defs>
  <rect width="1024" height="500" fill="url(#g)"/>
  <text x="400" y="225" font-family="Segoe UI, Arial" font-weight="800" font-size="92" fill="#ffffff">Aura<tspan fill="#c6f24e">Lift</tspan></text>
  <text x="404" y="290" font-family="Segoe UI, Arial" font-weight="600" font-size="34" fill="#c9cdd6">Gym &amp; home workout planner</text>
  <text x="404" y="340" font-family="Segoe UI, Arial" font-weight="600" font-size="28" fill="#c6f24e">Sets · Recovery · Progress · Nutrition</text>
</svg>`;
await sharp(Buffer.from(svg)).composite([{ input: icon, left: 96, top: 120 }]).flatten({ background: BG })
  .png().toFile(`${OUT}/feature_1024x500.png`);
console.log('icona e feature graphic pronte');

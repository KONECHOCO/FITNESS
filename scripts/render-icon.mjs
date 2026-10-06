// Rende assets/icon.svg in PNG 1024×1024 (icona) e 2732×2732 (splash) per @capacitor/assets.
import sharp from 'sharp';

const icon = await sharp('assets/icon.svg').resize(1024, 1024).flatten({ background: '#0b0e14' }).png().toBuffer();
await sharp(icon).toFile('assets/icon-only.png');

// Splash: sfondo dell'app con il logo al centro
const logo = await sharp('assets/icon.svg').resize(640, 640).png().toBuffer();
const rounded = await sharp(logo)
  .composite([{ input: Buffer.from('<svg width="640" height="640"><rect width="640" height="640" rx="144" fill="#fff"/></svg>'), blend: 'dest-in' }])
  .png().toBuffer();
for (const name of ['splash.png', 'splash-dark.png']) {
  await sharp({ create: { width: 2732, height: 2732, channels: 3, background: '#0b0e14' } })
    .composite([{ input: rounded, gravity: 'center' }]).png().toFile(`assets/${name}`);
}
console.log('icon + splash rendered');

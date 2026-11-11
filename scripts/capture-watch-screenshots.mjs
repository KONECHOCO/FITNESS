// Screenshot App Store per Apple Watch (410×502, Ultra) delle due schermate dell'app watchOS
// (serie in corso e recupero), con gli stessi testi e colori di ios/App/AuraLiftWatch/ContentView.swift.
// Uso: node scripts/capture-watch-screenshots.mjs
import { chromium } from 'playwright';
import { mkdir, readFile } from 'node:fs/promises';
import { EXERCISE_BY_ID } from '../src/data/exercises.js';

const STORE_LOCALES = { it: ['it'], en: ['en-US', 'en-GB'], es: ['es-ES', 'es-MX'], fr: ['fr-FR'], de: ['de-DE'], pt: ['pt-BR', 'pt-PT'] };
const T = {
  set: { it: 'Serie', en: 'Set', es: 'Serie', fr: 'Série', de: 'Satz', pt: 'Série' },
  done: { it: 'Serie fatta', en: 'Set done', es: 'Serie hecha', fr: 'Série faite', de: 'Satz fertig', pt: 'Série feita' },
  rest: { it: 'Recupero', en: 'Rest', es: 'Descanso', fr: 'Repos', de: 'Pause', pt: 'Descanso' },
  skip: { it: 'Salta', en: 'Skip', es: 'Saltar', fr: 'Passer', de: 'Überspringen', pt: 'Pular' },
  workout: { it: 'Push – Petto, spalle, tricipiti', en: 'Push – Chest, shoulders, triceps', es: 'Empuje – Pecho, hombros, tríceps',
    fr: 'Push – Pecs, épaules, triceps', de: 'Push – Brust, Schultern, Trizeps', pt: 'Push – Peito, ombros, tríceps' }
};
const font = (await readFile('node_modules/@fontsource/inter/files/inter-latin-600-normal.woff2')).toString('base64');
const fontB = (await readFile('node_modules/@fontsource/inter/files/inter-latin-700-normal.woff2')).toString('base64');
const css = `@font-face{font-family:I;font-weight:600;src:url(data:font/woff2;base64,${font})}@font-face{font-family:I;font-weight:700;src:url(data:font/woff2;base64,${fontB})}
html,body{margin:0;width:410px;height:502px;background:#000;color:#fff;font-family:I,-apple-system,sans-serif;overflow:hidden}
.time{position:absolute;top:22px;right:34px;font:600 28px I}.wrap{position:absolute;inset:78px 26px 26px}
.c2{color:#8e8e93;font:600 22px I;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.h{font:700 31px/1.15 I;margin:8px 0}
.ac{color:#c6f24e;font:600 25px I}.big{font:700 62px I;letter-spacing:-1px;margin:6px 0 18px}
.btn{background:#c6f24e;color:#000;border-radius:34px;height:72px;display:grid;place-items:center;font:700 28px I}
.center{text-align:center}.timer{font:700 112px I;color:#c6f24e;letter-spacing:-2px;margin:2px 0}
.row{display:flex;gap:12px;margin-top:22px}.row div{flex:1;height:68px;border-radius:34px;display:grid;place-items:center;font:700 27px I;background:#222}.row .on{background:#c6f24e;color:#000}`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 410, height: 502 } });
for (const [lang, locs] of Object.entries(STORE_LOCALES)) {
  const ex = EXERCISE_BY_ID.bench_press.name[lang];
  const screens = {
    '01_watch_set': `<div class="time">10:09</div><div class="wrap"><div class="c2">${T.workout[lang]}</div><div class="h">${ex}</div>
      <div class="ac">${T.set[lang]} 2 / 4</div><div class="big">80 kg × 8</div><div class="btn">✓ ${T.done[lang]}</div></div>`,
    '02_watch_rest': `<div class="time">10:11</div><div class="wrap center"><div class="c2">${T.rest[lang]}</div><div class="timer">1:24</div>
      <div class="c2">${ex} · ${T.set[lang]} 3/4</div><div class="row"><div>+15</div><div class="on">${T.skip[lang]}</div></div></div>`
  };
  for (const [name, html] of Object.entries(screens)) {
    await page.setContent(`<html><head><style>${css}</style></head><body>${html}</body></html>`);
    await page.waitForTimeout(150);
    for (const loc of locs) {
      await mkdir(`fastlane/screenshots/${loc}`, { recursive: true });
      await page.screenshot({ path: `fastlane/screenshots/${loc}/${name}_410x502.png` });
    }
  }
  console.log(lang);
}
await browser.close();

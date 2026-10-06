// Screenshot App Store per iPhone 6,9" (1320×2868), in tutte le lingue, dall'app reale con dati demo.
// Prerequisito: `npm run dev -- --port 5188` avviato.
// Uso: node scripts/capture-store-screenshots.mjs [it en es fr de pt]
import { chromium } from 'playwright';
import { mkdir, readFile } from 'node:fs/promises';

const BASE = process.env.APP_URL || 'http://localhost:5188/';
const LANGS = process.argv.slice(2).length ? process.argv.slice(2) : ['it', 'en', 'es', 'fr', 'de', 'pt'];
// Cartelle con i codici di App Store Connect / fastlane
const STORE_LOCALES = { it: ['it'], en: ['en-US', 'en-GB'], es: ['es-ES', 'es-MX'], fr: ['fr-FR'], de: ['de-DE'], pt: ['pt-BR', 'pt-PT'] };

const CAPTIONS = {
  home: {
    it: ['Allenati in modo intelligente', 'Il consiglio del giorno in base al recupero'],
    en: ['Train smarter', 'Today\'s workout, based on your recovery'],
    es: ['Entrena con cabeza', 'El entreno del día según tu recuperación'],
    fr: ['Entraînez-vous malin', 'La séance du jour selon votre récupération'],
    de: ['Trainiere smarter', 'Dein Workout passend zur Regeneration'],
    pt: ['Treine com inteligência', 'O treino do dia conforme sua recuperação']
  },
  workout: {
    it: ['Registra ogni serie', 'Carichi precedenti, timer e sovraccarico progressivo'],
    en: ['Log every set', 'Previous loads, rest timer and progressive overload'],
    es: ['Registra cada serie', 'Cargas anteriores, descanso y sobrecarga progresiva'],
    fr: ['Notez chaque série', 'Charges précédentes, repos et surcharge progressive'],
    de: ['Erfasse jeden Satz', 'Letzte Werte, Pausentimer und Steigerung'],
    pt: ['Registre cada série', 'Cargas anteriores, descanso e sobrecarga progressiva']
  },
  recovery: {
    it: ['Recupero muscolare reale', 'Calcolato dalle serie che registri'],
    en: ['Real muscle recovery', 'Calculated from the sets you log'],
    es: ['Recuperación muscular real', 'Calculada con las series que registras'],
    fr: ['Récupération musculaire réelle', 'Calculée à partir de vos séries'],
    de: ['Echte Muskelregeneration', 'Berechnet aus deinen Sätzen'],
    pt: ['Recuperação muscular real', 'Calculada com as séries que você registra']
  },
  progress: {
    it: ['Guarda i tuoi progressi', 'Volume, serie per muscolo e traguardi'],
    en: ['See your progress', 'Volume, sets per muscle and achievements'],
    es: ['Mira tu progreso', 'Volumen, series por músculo y logros'],
    fr: ['Suivez vos progrès', 'Volume, séries par muscle et succès'],
    de: ['Sieh deinen Fortschritt', 'Volumen, Sätze pro Muskel und Erfolge'],
    pt: ['Veja seu progresso', 'Volume, séries por músculo e conquistas']
  },
  strength: {
    it: ['Diventa più forte', 'Massimale stimato e record per ogni esercizio'],
    en: ['Get stronger', 'Estimated 1RM and records for every lift'],
    es: ['Gana fuerza', '1RM estimado y récords de cada ejercicio'],
    fr: ['Gagnez en force', '1RM estimé et records pour chaque exercice'],
    de: ['Werde stärker', 'Geschätztes 1RM und Rekorde pro Übung'],
    pt: ['Fique mais forte', '1RM estimado e recordes de cada exercício']
  },
  programs: {
    it: ['Palestra o casa', 'Schede pronte e generatore di allenamenti'],
    en: ['Gym or home', 'Ready-made plans and a workout generator'],
    es: ['Gimnasio o casa', 'Rutinas listas y generador de entrenos'],
    fr: ['Salle ou maison', 'Programmes prêts et générateur de séances'],
    de: ['Studio oder Zuhause', 'Fertige Pläne und Workout-Generator'],
    pt: ['Academia ou casa', 'Fichas prontas e gerador de treinos']
  },
  nutrition: {
    it: ['Calorie e macro', 'Obiettivi calcolati su di te'],
    en: ['Calories and macros', 'Targets calculated for you'],
    es: ['Calorías y macros', 'Objetivos calculados para ti'],
    fr: ['Calories et macros', 'Des objectifs calculés pour vous'],
    de: ['Kalorien und Makros', 'Ziele, berechnet für dich'],
    pt: ['Calorias e macros', 'Metas calculadas para você']
  },
  coach: {
    it: ['Il tuo Smart Coach', 'Analizza i tuoi dati e risponde alle tue domande'],
    en: ['Your Smart Coach', 'Analyses your data and answers your questions'],
    es: ['Tu Smart Coach', 'Analiza tus datos y responde tus preguntas'],
    fr: ['Votre Smart Coach', 'Analyse vos données et répond à vos questions'],
    de: ['Dein Smart Coach', 'Analysiert deine Daten und beantwortet Fragen'],
    pt: ['Seu Smart Coach', 'Analisa seus dados e responde suas perguntas']
  }
};

const ORDER = ['home', 'workout', 'recovery', 'progress', 'strength', 'programs', 'nutrition', 'coach'];

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 430, height: 932 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
const page = await ctx.newPage();
const composer = await browser.newPage({ viewport: { width: 1320, height: 2868 }, deviceScaleFactor: 1 });
const font = await readFile('node_modules/@fontsource/outfit/files/outfit-latin-700-normal.woff2');
const fontInter = await readFile('node_modules/@fontsource/inter/files/inter-latin-500-normal.woff2');
const fontCss = `@font-face{font-family:O;src:url(data:font/woff2;base64,${font.toString('base64')})}@font-face{font-family:I;src:url(data:font/woff2;base64,${fontInter.toString('base64')})}`;

const act = (sel) => page.evaluate(s => document.querySelector(s)?.click(), sel);
const wait = ms => page.waitForTimeout(ms);

async function scene(name) {
  await page.goto(`${BASE}?demo=${currentLang}&premium`);
  await page.waitForSelector('.topbar');
  await page.addStyleTag({ content: '*{animation:none!important;transition:none!important} .pro-pill{display:none}' });
  await wait(300);
  switch (name) {
    case 'home': break;
    case 'recovery':
      await page.evaluate(() => { const el = document.querySelector('.recovery').closest('.card'); window.scrollTo(0, el.offsetTop - 80); });
      break;
    case 'workout':
      await act('[data-tab="train"]'); await wait(100);
      await act('[data-act="open-program"][data-id="push"]'); await wait(100);
      await act('[data-act="start-program"]'); await wait(200);
      await page.evaluate(() => { document.querySelectorAll('[data-act="set-toggle"]')[0].click(); });
      await wait(80);
      await page.evaluate(() => { document.querySelectorAll('[data-act="set-toggle"]')[1].click(); });
      await wait(2300);
      break;
    case 'progress':
      await act('[data-tab="progress"]');
      break;
    case 'strength':
      await act('[data-tab="progress"]'); await wait(100);
      await act('[data-act="progress-tab"][data-v="exercises"]');
      break;
    case 'programs':
      await act('[data-tab="train"]');
      break;
    case 'nutrition':
      await act('[data-tab="nutrition"]'); await wait(100);
      await page.evaluate(() => window.scrollTo(0, 0));
      break;
    case 'coach':
      await act('[data-act="open-coach"]'); await wait(150);
      await act('[data-act="coach-chip"][data-v="today"]'); await wait(150);
      await act('[data-act="coach-chip"][data-v="protein"]'); await wait(150);
      await page.evaluate(() => { const b = document.querySelector('.sheet-b'); b.scrollTop = b.scrollHeight; });
      break;
  }
  await wait(500);
  return page.screenshot({ type: 'png' });
}

async function compose(raw, [title, sub], file) {
  const b64 = raw.toString('base64');
  await composer.setContent(`<html><head><style>${fontCss}
    html,body{margin:0;width:1320px;height:2868px;overflow:hidden;background:radial-gradient(120% 70% at 50% 0%,#24301a 0%,#0b0e14 55%,#07090d 100%);}
    .cap{position:absolute;top:150px;left:90px;right:90px;text-align:center;color:#fff}
    h1{font:700 104px/1.08 O;margin:0;letter-spacing:-1px}
    p{font:500 50px/1.3 I;color:#c6f24e;margin:34px 0 0}
    .phone{position:absolute;left:50%;top:560px;transform:translateX(-50%);width:1000px;height:2219px;border-radius:118px;background:#000;padding:26px;box-shadow:0 60px 140px rgba(0,0,0,.6),0 0 0 6px #2a3142}
    .phone img{width:100%;height:100%;object-fit:contain;border-radius:94px;display:block}
  </style></head><body><div class="cap"><h1>${title}</h1><p>${sub}</p></div>
  <div class="phone"><img src="data:image/png;base64,${b64}"></div></body></html>`);
  await composer.waitForTimeout(150);
  await composer.screenshot({ path: file, type: 'png' });
}

let currentLang = 'it';
for (const lang of LANGS) {
  currentLang = lang;
  for (const loc of STORE_LOCALES[lang]) await mkdir(`fastlane/screenshots/${loc}`, { recursive: true });
  for (const [i, name] of ORDER.entries()) {
    const raw = await scene(name);
    for (const loc of STORE_LOCALES[lang]) {
      await compose(raw, CAPTIONS[name][lang], `fastlane/screenshots/${loc}/${String(i + 1).padStart(2, '0')}_${name}_1320x2868.png`);
    }
    console.log(lang, name);
  }
}
await browser.close();

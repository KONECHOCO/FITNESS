import it from './it.js';
import en from './en.js';
import es from './es.js';
import fr from './fr.js';
import de from './de.js';
import pt from './pt.js';

export const DICTS = { it, en, es, fr, de, pt };
export const LANG_NAMES = { it: 'Italiano', en: 'English', es: 'Español', fr: 'Français', de: 'Deutsch', pt: 'Português' };
const LOCALES = { it: 'it-IT', en: 'en-GB', es: 'es-ES', fr: 'fr-FR', de: 'de-DE', pt: 'pt-BR' };

let lang = 'en';

export function detectLang() {
  const prefs = (typeof navigator !== 'undefined' && (navigator.languages || [navigator.language])) || [];
  for (const p of prefs) {
    const code = String(p || '').slice(0, 2).toLowerCase();
    if (DICTS[code]) return code;
  }
  return 'en';
}

export function setLang(l) {
  lang = DICTS[l] ? l : 'en';
  if (typeof document !== 'undefined') document.documentElement.lang = lang;
}
export const getLang = () => lang;
export const locale = () => (lang === 'en' && typeof navigator !== 'undefined' && navigator.language?.startsWith('en-US') ? 'en-US' : LOCALES[lang]);

export function t(key, params) {
  let s = DICTS[lang][key] ?? DICTS.en[key] ?? key;
  if (params) s = s.replace(/\{(\w+)\}/g, (m, k) => (params[k] ?? ''));
  return s;
}

/** Testo localizzato da un oggetto {it, en, …} (esercizi, schede, alimenti). */
export const tr = obj => (obj ? obj[lang] || obj.en || '' : '');

export const fmtNum = (n, digits = 0) =>
  new Intl.NumberFormat(locale(), { maximumFractionDigits: digits, minimumFractionDigits: 0 }).format(n);

export const fmtList = items => {
  try {
    return new Intl.ListFormat(locale(), { style: 'long', type: 'conjunction' }).format(items);
  } catch {
    return items.join(', ');
  }
};

export const fmtDate = (ts, opts = { day: 'numeric', month: 'short' }) => new Intl.DateTimeFormat(locale(), opts).format(ts);

export function fmtDuration(ms) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return h ? `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}` : `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

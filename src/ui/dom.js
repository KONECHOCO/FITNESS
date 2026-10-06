import { S } from '../store.js';
import { t, fmtNum } from '../i18n/index.js';
import { KG_PER_LB } from '../logic/calc.js';

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ESC[c]);

export const ic = (name, cls = '') => `<i class="fa-solid fa-${name} ${cls}" aria-hidden="true"></i>`;

export const unit = () => S.data.profile.unit || 'kg';

/** kg → valore nell'unità scelta (numero). */
export function toUnit(kg) {
  return unit() === 'lb' ? kg / KG_PER_LB : kg;
}
/** valore nell'unità scelta → kg. */
export function fromUnit(v) {
  return unit() === 'lb' ? v * KG_PER_LB : v;
}
/** Peso formattato con unità. */
export function fmtW(kg, withUnit = true) {
  const v = toUnit(kg || 0);
  const rounded = unit() === 'lb' ? Math.round(v * 2) / 2 : Math.round(v * 10) / 10;
  return `${fmtNum(rounded, 1)}${withUnit ? ` ${unit()}` : ''}`;
}
/** Valore per un campo di input (senza unità, punto decimale). */
export function inputW(kg) {
  if (!kg) return '';
  const v = toUnit(kg);
  return String(unit() === 'lb' ? Math.round(v * 2) / 2 : Math.round(v * 10) / 10);
}
/** Volume (kg·rip) formattato: tonnellate sopra 10.000. */
export function fmtVolume(kg) {
  const v = toUnit(kg);
  if (v >= 10000) return `${fmtNum(v / 1000, 1)} t${unit() === 'lb' ? ' (lb)' : ''}`;
  return `${fmtNum(Math.round(v))} ${unit()}`;
}

export const muscleName = m => t(`m_${m}`);

let toastTimer = null;
export function toast(msg) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
}

export function emptyState(icon, title, text, actionHtml = '') {
  return `<div class="empty">${ic(icon)}<h3>${esc(title)}</h3><p>${esc(text)}</p>${actionHtml}</div>`;
}

export function premiumLock(text) {
  return `<button class="lock-card" data-act="paywall">${ic('crown')}<div><strong>${esc(t('locked_premium'))}</strong><span>${esc(text)}</span></div>${ic('chevron-right')}</button>`;
}

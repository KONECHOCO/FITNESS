import { S, ui, commit, uid } from '../store.js';
import { t, fmtDate, fmtNum } from '../i18n/index.js';
import { esc, ic } from '../ui/dom.js';
import { nutritionTargets, dayTotals, dayKey, DAY_MS } from '../logic/calc.js';
import { openSheet } from '../ui/sheets.js';
import { haptic } from '../services/device.js';

export const MEALS = ['breakfast', 'lunch', 'dinner', 'snack'];

export function getDay(key = ui.nutriDate) {
  const days = S.data.nutrition.days;
  if (!days[key]) days[key] = { entries: [], waterMl: 0 };
  return days[key];
}
const peekDay = key => S.data.nutrition.days[key] || { entries: [], waterMl: 0 };

function dateLabel(key) {
  const today = dayKey();
  if (key === today) return t('today');
  if (key === dayKey(Date.now() - DAY_MS)) return t('yesterday');
  return fmtDate(new Date(`${key}T12:00`).getTime(), { weekday: 'short', day: 'numeric', month: 'short' });
}

function ring(value, goal) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const pct = goal ? Math.min(1, value / goal) : 0;
  return `<svg class="ring" viewBox="0 0 120 120"><circle cx="60" cy="60" r="${r}" class="ring-bg"/>
    <circle cx="60" cy="60" r="${r}" class="ring-fg ${goal && value > goal ? 'over' : ''}" stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${(c * (1 - pct)).toFixed(1)}"/></svg>`;
}

function macroBar(label, value, goal, cls) {
  return `<div class="macro"><div class="row between"><span>${esc(label)}</span><span><b>${value}</b>${goal ? ` / ${goal} ${esc(t('g'))}` : ` ${esc(t('g'))}`}</span></div>
    <div class="meter ${cls}"><div style="width:${goal ? Math.min(100, value / goal * 100) : 0}%"></div></div></div>`;
}

export function render() {
  const key = ui.nutriDate || dayKey();
  const day = peekDay(key);
  const tg = nutritionTargets(S.data.profile);
  const tot = dayTotals(day.entries);
  const remaining = tg ? tg.kcal - tot.kcal : null;
  const waterGoal = tg?.waterMl || 2500;
  const glasses = Math.ceil(waterGoal / 250);
  const filled = Math.floor(day.waterMl / 250);

  const meals = MEALS.map(m => {
    const items = day.entries.filter(e => e.meal === m);
    const kcal = items.reduce((s, e) => s + e.kcal, 0);
    return `<section class="card meal">
      <div class="card-h"><h3>${esc(t(`meal_${m}`))}</h3><span class="muted small">${kcal} ${esc(t('kcal'))}</span></div>
      ${items.length ? `<ul class="food-list">${items.map(e => `<li>
        <div><strong>${esc(e.name)}</strong><span class="muted small">${e.grams ? `${e.grams} g · ` : ''}P ${fmtNum(e.p, 1)} · C ${fmtNum(e.c, 1)} · G ${fmtNum(e.f, 1)}</span></div>
        <span class="kcal">${e.kcal}</span><button class="icon-btn subtle" data-act="nu-remove" data-id="${e.id}" aria-label="${esc(t('delete'))}">${ic('xmark')}</button></li>`).join('')}</ul>`
        : `<p class="muted small">${esc(t('nu_empty_meal'))}</p>`}
      <button class="btn btn-text" data-act="nu-add" data-meal="${m}">${ic('plus')} ${esc(t('nu_add_food'))}</button></section>`;
  }).join('');

  return `<div class="page-h"><h1>${esc(t('nu_title'))}</h1></div>
    <div class="date-nav"><button class="icon-btn" data-act="nu-day" data-d="-1" aria-label="${esc(t('back'))}">${ic('chevron-left')}</button>
      <strong>${esc(dateLabel(key))}</strong>
      <button class="icon-btn" data-act="nu-day" data-d="1" ${key >= dayKey() ? 'disabled' : ''} aria-label="${esc(t('next'))}">${ic('chevron-right')}</button></div>
    <div class="cols"><div class="col"><section class="card nu-summary">
      <div class="ring-box">${ring(tot.kcal, tg?.kcal)}<div class="ring-c"><strong>${tot.kcal}</strong><span>${tg ? `/ ${tg.kcal} ${esc(t('kcal'))}` : esc(t('kcal'))}</span></div></div>
      <div class="macros">
        ${tg ? `<p class="${remaining < 0 ? 'warn' : 'muted'} small">${esc(remaining < 0 ? t('nu_over') : t('nu_remaining'))}: <b>${Math.abs(remaining)} ${esc(t('kcal'))}</b></p>` : `<p class="muted small">${esc(t('nu_no_profile'))}</p>`}
        ${macroBar(t('nu_protein'), tot.p, tg?.protein, 'm-p')}${macroBar(t('nu_carbs'), tot.c, tg?.carbs, 'm-c')}${macroBar(t('nu_fat'), tot.f, tg?.fat, 'm-f')}
      </div></section>
    <section class="card water">
      <div class="card-h"><h3>${ic('glass-water')} ${esc(t('nu_water'))}</h3><span class="muted small">${fmtNum(day.waterMl / 1000, 2)} / ${fmtNum(waterGoal / 1000, 2)} L</span></div>
      <div class="glasses">${Array.from({ length: glasses }, (_, i) => `<span class="${i < filled ? 'on' : ''}">${ic('glass-water')}</span>`).join('')}</div>
      <div class="row gap"><button class="btn btn-ghost btn-sm" data-act="water" data-d="-250">−250 ml</button><button class="btn btn-accent btn-sm" data-act="water" data-d="250">+250 ml</button></div>
    </section>
    </div><div class="col">${meals}</div></div>
    <p class="muted small center">${esc(t('nu_source'))}</p>`;
}

export function addEntry(entry) {
  getDay().entries.push({ id: uid(), ...entry });
  commit();
}

export const actions = {
  'nu-day'(el) {
    const cur = new Date(`${ui.nutriDate}T12:00`).getTime();
    const next = dayKey(cur + Number(el.dataset.d) * DAY_MS);
    if (next > dayKey()) return;
    ui.nutriDate = next;
    commit();
  },
  'nu-add'(el) {
    openSheet({ type: 'food', meal: el.dataset.meal });
  },
  'nu-remove'(el) {
    const day = getDay();
    day.entries = day.entries.filter(e => e.id !== el.dataset.id);
    commit();
  },
  water(el) {
    const day = getDay();
    day.waterMl = Math.max(0, day.waterMl + Number(el.dataset.d));
    haptic('light');
    commit();
  }
};

export const inputs = {};

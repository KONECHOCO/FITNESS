import { S, ui, commit } from '../store.js';
import { saveState } from '../services/storage.js';
import { t, fmtNum } from '../i18n/index.js';
import { esc, ic, fromUnit, inputW, toast } from '../ui/dom.js';
import { nutritionTargets, dayKey } from '../logic/calc.js';
import { openSheet, sourcesButton } from '../ui/sheets.js';

const GOALS = [['muscle', 'dumbbell'], ['strength', 'weight-hanging'], ['fat_loss', 'fire'], ['fitness', 'heart-pulse']];

function options(field, list, cur) {
  return `<div class="opts">${list.map(([v, icon, label, sub]) => `<button class="opt ${String(cur) === String(v) ? 'on' : ''}" data-act="ob-set" data-f="${field}" data-v="${v}">
    ${icon ? `<span class="opt-ic">${ic(icon)}</span>` : ''}<span><strong>${esc(label)}</strong>${sub ? `<small>${esc(sub)}</small>` : ''}</span></button>`).join('')}</div>`;
}

export function bodyValid(p) {
  return p.age >= 14 && p.age <= 99 && p.heightCm >= 120 && p.heightCm <= 230 && p.weightKg >= 30 && p.weightKg <= 300;
}

function step(i) {
  const p = S.data.profile;
  switch (i) {
    case 0: return `<div class="ob-hero">${ic('bolt')}</div><h1>${esc(t('ob_welcome_title'))}</h1><p class="muted">${esc(t('ob_welcome_text'))}</p>`;
    case 1: return `<h2>${esc(t('ob_goal'))}</h2>${options('goal', GOALS.map(([g, icon]) => [g, icon, t(`goal_${g}`)]), p.goal)}`;
    case 2: return `<h2>${esc(t('ob_level'))}</h2>${options('level', [1, 2, 3].map(l => [l, null, t(`lvl_${l}`), t(`ob_level_${l}`)]), p.level)}`;
    case 3: return `<h2>${esc(t('ob_days'))}</h2><div class="days-pick">${[2, 3, 4, 5, 6].map(d => `<button class="${p.daysPerWeek === d ? 'on' : ''}" data-act="ob-set" data-f="daysPerWeek" data-v="${d}">${d}</button>`).join('')}</div>`;
    case 4: return `<h2>${esc(t('ob_place'))}</h2>${options('location', [['gym', 'dumbbell', t('place_gym')], ['home', 'house', t('place_home')]], p.location)}
      ${p.location === 'home' ? `<h3 class="mt">${esc(t('ob_equipment'))}</h3><div class="pills">${['dumbbell', 'barbell'].map(e => `<button class="pill ${p.equipment.includes(e) ? 'on' : ''}" data-act="ob-equip" data-v="${e}">${esc(t(`eq_${e}`))}</button>`).join('')}<span class="pill on static">${esc(t('eq_bodyweight'))}</span></div>` : ''}`;
    case 5: return `<h2>${esc(t('ob_body'))}</h2>${bodyForm(p)}`;
    case 6: {
      const tg = nutritionTargets(p);
      return `<h2>${esc(t('ob_summary'))}</h2><p class="muted">${esc(t('ob_summary_text'))}</p>
        <div class="summary-grid">
          <div><span>${esc(t('kcal'))}</span><b>${fmtNum(tg.kcal)}</b></div><div><span>${esc(t('nu_protein'))}</span><b>${tg.protein} g</b></div>
          <div><span>${esc(t('nu_carbs'))}</span><b>${tg.carbs} g</b></div><div><span>${esc(t('nu_fat'))}</span><b>${tg.fat} g</b></div>
          <div><span>${esc(t('nu_water'))}</span><b>${fmtNum(tg.waterMl / 1000, 2)} L</b></div><div><span>${esc(t('st_goal_week'))}</span><b>${p.daysPerWeek}</b></div>
        </div>
        <p class="muted small">${esc(t('src_estimate'))} ${esc(t('coach_disclaimer'))}</p>${sourcesButton('targets')}`;
    }
    default: return '';
  }
}

/** Form dati corporei, riusato nelle impostazioni del profilo. */
export function bodyForm(p) {
  return `<div class="seg small">${['m', 'f'].map(s => `<button class="${p.sex === s ? 'on' : ''}" data-act="ob-set" data-f="sex" data-v="${s}">${esc(t(`sex_${s}`))}</button>`).join('')}</div>
    <div class="row gap">
      <label class="field grow"><span>${esc(t('ob_age'))}</span><input inputmode="numeric" data-in="ob-num" data-f="age" value="${p.age ?? ''}"></label>
      <label class="field grow"><span>${esc(t('ob_height'))}</span><input inputmode="numeric" data-in="ob-num" data-f="heightCm" value="${p.heightCm ?? ''}"></label>
    </div>
    <div class="row gap end">
      <label class="field grow"><span>${esc(t('ob_weight'))}</span><input inputmode="decimal" data-in="ob-weight" value="${inputW(p.weightKg)}"></label>
      <div class="seg small unit-seg">${['kg', 'lb'].map(u => `<button class="${p.unit === u ? 'on' : ''}" data-act="ob-set" data-f="unit" data-v="${u}">${u}</button>`).join('')}</div>
    </div>
    <label class="field"><span>${esc(t('ob_name'))}</span><input data-in="ob-name" value="${esc(p.name)}" placeholder="${esc(t('ob_name_ph'))}" maxlength="30"></label>`;
}

const LAST = 6;

export function render() {
  const i = ui.onboardingStep;
  return `<div class="onboarding">
    <div class="ob-progress"><div style="width:${(i / LAST) * 100}%"></div></div>
    <div class="ob-body">${step(i)}</div>
    <div class="ob-foot">
      ${i > 0 ? `<button class="btn btn-ghost" data-act="ob-back">${esc(t('back'))}</button>` : '<span></span>'}
      <button class="btn btn-accent" data-act="ob-next">${esc(i === 0 ? t('start') : i === LAST ? t('ob_start') : t('next'))} ${ic('arrow-right')}</button>
    </div></div>`;
}

export const actions = {
  'ob-set'(el) {
    const { f, v } = el.dataset;
    S.data.profile[f] = ['level', 'daysPerWeek'].includes(f) ? Number(v) : v;
    commit();
  },
  'ob-equip'(el) {
    const eq = S.data.profile.equipment;
    const v = el.dataset.v;
    S.data.profile.equipment = eq.includes(v) ? eq.filter(e => e !== v) : [...eq, v];
    commit();
  },
  'ob-back'() {
    ui.onboardingStep = Math.max(0, ui.onboardingStep - 1);
    commit();
  },
  'ob-next'() {
    const p = S.data.profile;
    if (ui.onboardingStep === 5 && !bodyValid(p)) {
      toast(t('ob_body_invalid'));
      return;
    }
    if (ui.onboardingStep < LAST) {
      ui.onboardingStep += 1;
      commit();
      return;
    }
    p.onboarded = true;
    if (p.weightKg) S.data.bodyWeight = [{ date: dayKey(), kg: p.weightKg }];
    ui.tab = 'home';
    commit();
    // Offerta di prova gratuita una sola volta, sempre chiudibile
    if (!S.data.paywallSeen) {
      S.data.paywallSeen = true;
      openSheet({ type: 'paywall' });
    }
  }
};

export const inputs = {
  'ob-num'(el) {
    const v = parseInt(el.value, 10);
    S.data.profile[el.dataset.f] = Number.isFinite(v) ? v : null;
    saveState(S.data);
  },
  'ob-weight'(el) {
    const v = parseFloat(el.value.replace(',', '.'));
    S.data.profile.weightKg = Number.isFinite(v) ? Math.round(fromUnit(v) * 10) / 10 : null;
    saveState(S.data);
  },
  'ob-name'(el) {
    S.data.profile.name = el.value.slice(0, 30);
    saveState(S.data);
  }
};

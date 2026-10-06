// Finestre a comparsa (bottom sheet): dettagli, editor, Coach, impostazioni, abbonamento.
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { S, ui, commit, uid, FREE, defaultState } from '../store.js';
import { clearState } from '../services/storage.js';
import { t, tr, fmtNum, fmtList, fmtDate, fmtDuration, setLang, getLang, LANG_NAMES } from '../i18n/index.js';
import { esc, ic, fmtW, fmtVolume, muscleName, toast, premiumLock, emptyState } from './dom.js';
import { exerciseSvg } from './bodymap.js';
import { EXERCISES, EXERCISE_BY_ID, MUSCLES } from '../data/exercises.js';
import { PROGRAM_BY_ID } from '../data/programs.js';
import { FOODS, FOOD_BY_ID } from '../data/foods.js';
import { exerciseHistory, foodPortion, workoutVolume, dayKey } from '../logic/calc.js';
import { generateWorkout } from '../logic/generator.js';
import { buildInsights, matchTopic, answerParams } from '../logic/coach.js';
import {
  getMonetization, buyPremium, restorePremium, manageSubscription, showPrivacyOptions, adAfterWorkout, PRODUCTS
} from '../services/monetization.js';
import { sound, scheduleReminders, ensureNotificationPermission } from '../services/device.js';
// Import circolari: le funzioni delle pagine vengono usate solo in risposta ai tocchi, mai al caricamento
import { startWorkout, addExerciseToSession } from '../pages/workout.js';
import { addEntry } from '../pages/nutrition.js';
import { bodyForm, bodyValid } from '../pages/onboarding.js';

const PRIVACY_URL = 'https://konechoco.github.io/auralift/privacy-policy.html';
const TERMS_URL = 'https://www.apple.com/legal/internet-services/itunes/dev/stdeula/';
const SUPPORT_URL = 'https://konechoco.github.io/auralift/support.html';

// ---------------------------------------------------------------- infrastruttura
export function openSheet(sheet, replaceTop = false) {
  if (replaceTop) ui.sheets.pop();
  ui.sheets.push(sheet);
  renderSheets();
}

export function closeTopSheet() {
  const s = ui.sheets.pop();
  if (s?.onClose) s.onClose();
  renderSheets();
  if (s?.type === 'summary') adAfterWorkout();
}

let confirmResolve = null;
export function confirmDialog(text) {
  return new Promise(resolve => {
    confirmResolve = resolve;
    openSheet({ type: 'confirm', text });
  });
}

const isPremium = () => getMonetization().isPremium;

function shell(s, title, body, { full = false, foot = '' } = {}) {
  return `<div class="sheet ${full ? 'full' : ''}" role="dialog" aria-modal="true" aria-label="${esc(title)}">
    <div class="sheet-h"><h2>${esc(title)}</h2><button class="icon-btn" data-act="sheet-close" aria-label="${esc(t('close'))}">${ic('xmark')}</button></div>
    <div class="sheet-b">${body}</div>${foot ? `<div class="sheet-f">${foot}</div>` : ''}</div>`;
}

export function renderSheets() {
  const root = document.getElementById('sheets');
  if (!root) return;
  if (!ui.sheets.length) {
    root.innerHTML = '';
    document.body.classList.remove('sheet-open');
    return;
  }
  document.body.classList.add('sheet-open');
  const top = ui.sheets[ui.sheets.length - 1];
  const fn = RENDER[top.type];
  root.innerHTML = `<div class="backdrop" data-act="sheet-close"></div>${fn ? fn(top) : ''}`;
}

// ---------------------------------------------------------------- testi Coach
const names = ms => fmtList(ms.map(muscleName));
const exName = id => tr(EXERCISE_BY_ID[id]?.name);
const sign = n => (n > 0 ? `+${n}` : String(n));

export function insightText(ins) {
  const p = { ...(ins.params || {}) };
  if (p.muscles) p.muscles = names(p.muscles);
  if (p.exId) p.name = exName(p.exId);
  if (ins.id === 'progress') {
    p.from = p.reps ? String(p.from) : fmtW(p.from);
    p.to = p.reps ? String(p.to) : fmtW(p.to);
  }
  if (ins.id === 'volume_trend') {
    p.volume = fmtVolume(p.volume);
    p.pct = sign(p.pct);
  }
  return t(`in_${ins.id}`, p);
}

function answerText(topic, p) {
  if (!topic) return t('coach_unknown');
  const fmt = { ...p, kcal: p.kcal && fmtNum(p.kcal), deficit: p.deficit && fmtNum(p.deficit), surplus: p.surplus && fmtNum(p.surplus) };
  switch (topic) {
    case 'summary':
      if (!p.total) return t('coach_a_summary_empty');
      return t('coach_a_summary', { ...fmt, volume: fmtVolume(p.volume), trend: p.trend === null ? '' : t('coach_a_summary_trend', { pct: sign(p.trend) }) });
    case 'today':
      return t('coach_a_today', {
        template: t(`tpl_${p.template}`),
        fresh: p.fresh.length ? t('coach_a_today_fresh', { list: names(p.fresh) }) : '',
        tired: p.tired.length ? t('coach_a_today_tired', { list: names(p.tired) }) : ''
      });
    case 'bench': case 'squat': case 'deadlift':
      return t(`coach_a_${topic}`, { best: p.e1rm ? t('coach_a_best', { v: fmtW(p.e1rm) }) : '' });
    default:
      return t(`coach_a_${topic}`, fmt);
  }
}

// ---------------------------------------------------------------- render per tipo
const RENDER = {
  confirm(s) {
    return `<div class="dialog"><p>${esc(s.text)}</p><div class="row gap end">
      <button class="btn btn-ghost" data-act="confirm-no">${esc(t('cancel'))}</button>
      <button class="btn btn-danger" data-act="confirm-yes">${esc(t('continue'))}</button></div></div>`;
  },

  program(s) {
    const p = s.custom ? S.data.routines.find(r => r.id === s.id) : PROGRAM_BY_ID[s.id];
    if (!p) return '';
    const name = s.custom ? p.name : tr(p.name);
    const list = p.items.map(it => {
      const ex = EXERCISE_BY_ID[it.exId];
      return `<button class="ex-row" data-act="open-exercise" data-id="${ex.id}">${exerciseSvg(ex, true)}
        <div class="ex-row-t"><strong>${esc(tr(ex.name))}</strong><span class="muted small">${esc(t('sets_x_reps', { sets: it.sets, reps: `${it.reps}${ex.timed ? ' s' : ''}` }))} · ${esc(t('rest_s', { n: it.rest }))}</span></div></button>`;
    }).join('');
    const foot = `<button class="btn btn-accent btn-block" data-act="start-program" data-id="${p.id}" data-custom="${s.custom ? 1 : ''}">${ic('play')} ${esc(t('train_start'))}</button>
      ${s.custom
        ? `<div class="row gap"><button class="btn btn-ghost grow" data-act="edit-routine" data-id="${p.id}">${ic('pen')} ${esc(t('edit'))}</button><button class="btn btn-text danger" data-act="delete-routine" data-id="${p.id}">${ic('trash')}</button></div>`
        : `<button class="btn btn-ghost btn-block" data-act="duplicate-program" data-id="${p.id}">${ic('copy')} ${esc(t('train_duplicate'))}</button>`}`;
    return shell(s, name, `${s.custom ? '' : `<p class="muted">${esc(tr(p.desc))}</p>`}<div class="list">${list}</div>`, { foot });
  },

  exercise(s) {
    const ex = EXERCISE_BY_ID[s.id];
    const h = exerciseHistory(S.data.workouts, ex.id);
    const best = h.length ? Math.max(...h.map(x => x.value)) : null;
    const reps = h[0]?.reps;
    const body = `<div class="ex-hero">${exerciseSvg(ex)}</div>
      <div class="chips"><span class="chip">${esc(t(`eq_${ex.equipment}`))}</span><span class="chip">${esc(t(`lvl_${ex.level}`))}</span><span class="chip">${esc(t(`kind_${ex.kind}`))}</span>${ex.timed ? `<span class="chip">${esc(t('ex_timed'))}</span>` : ''}</div>
      <h4>${esc(t('ex_instructions'))}</h4><p>${esc(tr(ex.steps))}</p>
      <h4>${esc(t('ex_muscles'))}</h4><p><b>${esc(t('ex_primary'))}:</b> ${esc(muscleName(ex.muscle))}${ex.secondary.length ? ` · <b>${esc(t('ex_secondary'))}:</b> ${esc(names(ex.secondary))}` : ''}</p>
      <h4>${esc(t('ex_history'))}</h4>
      ${best !== null ? `<div class="big-num"><span class="muted small">${esc(t(reps ? 'ex_best_reps' : 'ex_best'))}</span><strong>${reps ? best : esc(fmtW(best))}</strong></div>` : `<p class="muted">${esc(t('ex_no_history'))}</p>`}`;
    const foot = S.data.session ? `<button class="btn btn-accent btn-block" data-act="pick-exercise" data-id="${ex.id}" data-target="session">${ic('plus')} ${esc(t('ex_add_to_workout'))}</button>` : '';
    return shell(s, tr(ex.name), body, { foot });
  },

  routine(s) {
    const d = s.draft;
    const items = d.items.map((it, i) => {
      const ex = EXERCISE_BY_ID[it.exId];
      return `<div class="re-item"><div class="row between"><strong>${esc(tr(ex.name))}</strong>
        <div class="row"><button class="icon-btn subtle" data-act="re-move" data-i="${i}" data-d="-1" ${i === 0 ? 'disabled' : ''}>${ic('arrow-up')}</button>
        <button class="icon-btn subtle" data-act="re-move" data-i="${i}" data-d="1" ${i === d.items.length - 1 ? 'disabled' : ''}>${ic('arrow-down')}</button>
        <button class="icon-btn subtle" data-act="re-remove" data-i="${i}">${ic('xmark')}</button></div></div>
        <div class="row gap">
          <label class="field mini"><span>${esc(t('sets'))}</span><input inputmode="numeric" data-in="re-field" data-i="${i}" data-f="sets" value="${it.sets}"></label>
          <label class="field mini"><span>${esc(ex.timed ? t('sec') : t('reps'))}</span><input inputmode="numeric" data-in="re-field" data-i="${i}" data-f="reps" value="${it.reps}"></label>
          <label class="field mini"><span>${esc(t('wk_rest'))} (s)</span><input inputmode="numeric" data-in="re-field" data-i="${i}" data-f="rest" value="${it.rest}"></label>
        </div></div>`;
    }).join('');
    const body = `<label class="field"><span>${esc(t('train_routine_name'))}</span><input data-in="re-name" value="${esc(d.name)}" placeholder="${esc(t('train_routine_name_ph'))}" maxlength="40"></label>
      ${items || `<p class="muted">${esc(t('train_no_routines'))}</p>`}
      <button class="btn btn-ghost btn-block" data-act="re-add">${ic('plus')} ${esc(t('train_add_exercise'))}</button>`;
    return shell(s, t(d.id ? 'edit' : 'train_new_routine'), body, { foot: `<button class="btn btn-accent btn-block" data-act="re-save" ${d.items.length ? '' : 'disabled'}>${esc(t('save'))}</button>` });
  },

  picker(s) {
    const body = `<div class="search">${ic('magnifying-glass')}<input type="search" data-in="picker-search" value="${esc(s.q || '')}" placeholder="${esc(t('train_search_ph'))}"></div>
      <div class="pills">${['all', ...MUSCLES].map(m => `<button class="pill ${(s.muscle || 'all') === m ? 'on' : ''}" data-act="picker-muscle" data-v="${m}">${esc(m === 'all' ? t('all') : muscleName(m))}</button>`).join('')}</div>
      <div class="list" id="picker-list">${pickerList(s)}</div>`;
    return shell(s, t('train_add_exercise'), body, { full: true });
  },

  generated(s) {
    const { result } = s;
    const list = result.items.map(it => {
      const ex = EXERCISE_BY_ID[it.exId];
      return `<button class="ex-row" data-act="open-exercise" data-id="${ex.id}">${exerciseSvg(ex, true)}<div class="ex-row-t"><strong>${esc(tr(ex.name))}</strong>
        <span class="muted small">${esc(t('sets_x_reps', { sets: it.sets, reps: `${it.reps}${ex.timed ? ' s' : ''}` }))} · ${esc(t('rest_s', { n: it.rest }))}</span></div></button>`;
    }).join('');
    const body = `<p class="muted">${esc(t('train_generated_text'))}</p>
      <div class="chips"><span class="chip">${esc(t(`tpl_${result.template}`))}</span><span class="chip">${s.minutes} ${esc(t('min'))}</span><span class="chip">${esc(t(`goal_${S.data.profile.goal}`))}</span></div>
      <div class="list">${list}</div>`;
    const foot = `<button class="btn btn-accent btn-block" data-act="start-generated">${ic('play')} ${esc(t('train_start'))}</button>
      <button class="btn btn-ghost btn-block" data-act="regenerate">${ic('rotate')} ${esc(t('train_regenerate'))}</button>`;
    return shell(s, t('train_generated'), body, { foot });
  },

  summary(s) {
    const w = S.data.workouts.find(x => x.id === s.id);
    if (!w) return '';
    const sets = w.exercises.reduce((n, e) => n + e.sets.length, 0);
    const prs = (w.prs || []).map(p => {
      const ex = EXERCISE_BY_ID[p.exId];
      const v = p.type === 'reps' ? `${p.value}${ex.timed ? ' s' : ''}` : fmtW(p.value);
      const prev = p.type === 'reps' ? `${p.prev}${ex.timed ? ' s' : ''}` : fmtW(p.prev);
      return `<li>${ic('trophy', 'gold')} ${esc(t(`wk_pr_${p.type}`, { name: tr(ex.name), v, p: prev }))}</li>`;
    }).join('');
    const body = `<div class="done-hero">${ic('circle-check')}<h3>${esc(w.name)}</h3></div>
      <div class="summary-grid">
        <div><span>${esc(t('wk_duration'))}</span><b>${fmtDuration(w.end - w.start)}</b></div>
        <div><span>${esc(t('wk_volume'))}</span><b>${esc(fmtVolume(workoutVolume(w)))}</b></div>
        <div><span>${esc(t('wk_sets_done'))}</span><b>${sets}</b></div>
        <div><span>${esc(t('wk_kcal_est'))}</span><b>${w.kcal || '—'}</b></div>
      </div>
      ${prs ? `<h4>${esc(t('wk_prs'))}</h4><ul class="pr-list">${prs}</ul>` : ''}`;
    return shell(s, t('wk_summary'), body, { foot: `<button class="btn btn-accent btn-block" data-act="sheet-close">${esc(t('done'))}</button>` });
  },

  workoutDetail(s) {
    const w = S.data.workouts.find(x => x.id === s.id);
    if (!w) return '';
    const body = `<p class="muted">${esc(fmtDate(w.start, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }))} · ${fmtDuration(w.end - w.start)} · ${esc(fmtVolume(workoutVolume(w)))}</p>
      ${w.exercises.map(e => {
        const ex = EXERCISE_BY_ID[e.exId];
        return `<div class="detail-ex"><strong>${esc(tr(ex?.name))}</strong><div class="chips">${e.sets.map(x => `<span class="chip">${ex?.timed ? `${x.r} s` : x.w ? `${esc(fmtW(x.w, false))} × ${x.r}` : `× ${x.r}`}</span>`).join('')}</div></div>`;
      }).join('')}`;
    return shell(s, w.name, body, { foot: `<button class="btn btn-text danger btn-block" data-act="history-delete" data-id="${w.id}">${ic('trash')} ${esc(t('delete'))}</button>` });
  },

  food(s) {
    const sel = s.foodId ? FOOD_BY_ID[s.foodId] : null;
    let body;
    if (s.custom) {
      body = `<label class="field"><span>${esc(t('nu_custom_name'))}</span><input id="cf-name" maxlength="40"></label>
        <div class="row gap"><label class="field grow"><span>${esc(t('kcal'))}</span><input id="cf-kcal" inputmode="numeric"></label>
        <label class="field grow"><span>${esc(t('nu_protein'))} (g)</span><input id="cf-p" inputmode="decimal"></label></div>
        <div class="row gap"><label class="field grow"><span>${esc(t('nu_carbs'))} (g)</span><input id="cf-c" inputmode="decimal"></label>
        <label class="field grow"><span>${esc(t('nu_fat'))} (g)</span><input id="cf-f" inputmode="decimal"></label></div>`;
      return shell(s, t('nu_custom'), body, { foot: `<button class="btn btn-accent btn-block" data-act="food-custom-save">${esc(t('save'))}</button>` });
    }
    if (sel) {
      const grams = s.grams ?? sel.serving;
      const v = foodPortion(sel, grams);
      body = `<h3>${esc(tr(sel.name))}</h3><p class="muted small">${sel.kcal} ${esc(t('kcal'))} ${esc(t('nu_per100'))} · P ${sel.p} · C ${sel.c} · G ${sel.f}</p>
        <label class="field"><span>${esc(t('nu_grams'))}</span><input inputmode="numeric" data-in="food-grams" value="${grams}"></label>
        <div class="summary-grid" id="food-preview">${foodPreview(v)}</div>`;
      return shell(s, t('nu_add_food'), body, { foot: `<button class="btn btn-accent btn-block" data-act="food-save">${esc(t('add'))}</button><button class="btn btn-ghost btn-block" data-act="food-back">${esc(t('back'))}</button>` });
    }
    body = `<div class="search">${ic('magnifying-glass')}<input type="search" data-in="food-search" value="${esc(s.q || '')}" placeholder="${esc(t('nu_search_ph'))}"></div>
      <div class="list" id="food-list">${foodList(s.q)}</div>`;
    return shell(s, `${t('nu_add_food')} · ${t(`meal_${s.meal}`)}`, body, { full: true, foot: `<button class="btn btn-ghost btn-block" data-act="food-custom">${ic('pen')} ${esc(t('nu_custom'))}</button>` });
  },

  coach(s) {
    const { profile, workouts, nutrition, coach } = S.data;
    const insights = buildInsights({ profile, workouts, nutritionDays: nutrition.days });
    const visible = isPremium() ? insights : insights.slice(0, FREE.insights);
    const hidden = insights.length - visible.length;
    const TONE = { good: 'circle-check', warn: 'triangle-exclamation', info: 'circle-info' };
    const msgs = coach.messages.map(m => m.from === 'me'
      ? `<div class="msg me">${esc(m.text)}</div>`
      : `<div class="msg bot">${esc(answerText(m.topic, m.params))}</div>`).join('');
    const chips = ['today', 'summary', 'protein', 'rest', 'plateau', 'fat'].map(c => `<button class="chip-btn" data-act="coach-chip" data-v="${c}">${esc(t(`coach_chip_${c}`))}</button>`).join('');
    const body = `<p class="muted small">${esc(t('coach_sub'))}</p>
      <h4>${esc(t('coach_insights'))}</h4>
      <div class="insights">${visible.map(i => `<div class="insight ${i.tone}">${ic(TONE[i.tone])}<p>${esc(insightText(i))}</p></div>`).join('')}</div>
      ${hidden > 0 ? premiumLock(t('coach_more_premium', { n: hidden })) : ''}
      <h4>${esc(t('coach_ask'))}</h4>
      <div class="chat" id="chat">${msgs}</div>
      <div class="chips scroll-x">${chips}</div>
      <p class="muted tiny">${esc(t('coach_disclaimer'))}</p>`;
    const foot = `<div class="chat-in"><input id="coach-input" data-enter="coach-send" placeholder="${esc(t('coach_ph'))}" maxlength="200"><button class="btn btn-accent" data-act="coach-send" aria-label="${esc(t('coach_ask'))}">${ic('paper-plane')}</button></div>`;
    return shell(s, t('coach_title'), body, { full: true, foot });
  },

  settings(s) {
    const { profile: p, settings: st } = S.data;
    const m = getMonetization();
    const days = t('st_weekdays').split(',');
    const info = m.premiumInfo;
    const premium = m.isPremium
      ? `<div class="setting-card premium-on">${ic('crown')}<div><strong>${esc(t(info?.trial ? 'st_premium_trial' : 'st_premium_active'))}</strong>
          ${info?.expires ? `<span class="muted small">${esc(t(info.willCancel ? 'st_premium_ends' : 'st_premium_renews', { date: fmtDate(info.expires, { day: 'numeric', month: 'long', year: 'numeric' }) }))}</span>` : ''}</div></div>
        ${m.native ? `<button class="set-row-btn" data-act="manage-sub">${esc(t('st_manage'))}${ic('chevron-right')}</button>` : ''}`
      : `<button class="card upsell" data-act="paywall">${ic('crown')}<div><strong>${esc(t('pw_title'))}</strong><span>${esc(t('pw_subtitle'))}</span></div>${ic('chevron-right')}</button>`;
    const body = `${premium}
      <button class="set-row-btn" data-act="restore">${esc(t('st_restore'))}${ic('rotate')}</button>
      <h4>${esc(t('st_profile'))}</h4>
      <button class="set-row-btn" data-act="open-profile"><span>${esc(p.name || t('st_profile'))} · ${esc(t(`goal_${p.goal}`))} · ${esc(fmtW(p.weightKg || 0))}</span>${ic('pen')}</button>
      <h4>${esc(t('st_training'))}</h4>
      <label class="set-row"><span>${esc(t('st_goal_week'))}</span><select data-chg="set-days">${[2, 3, 4, 5, 6].map(d => `<option ${p.daysPerWeek === d ? 'selected' : ''}>${d}</option>`).join('')}</select></label>
      <label class="set-row"><span>${esc(t('st_rest_default'))}</span><select data-chg="set-rest">${[60, 90, 120, 150, 180].map(v => `<option value="${v}" ${st.restDefault === v ? 'selected' : ''}>${v} s</option>`).join('')}</select></label>
      <label class="set-row"><span>${esc(t('ob_units'))}</span><select data-chg="set-unit">${['kg', 'lb'].map(u => `<option ${p.unit === u ? 'selected' : ''}>${u}</option>`).join('')}</select></label>
      <label class="set-row"><span>${esc(t('st_reminders'))}</span><input type="checkbox" class="switch" data-chg="set-reminders" ${st.reminders.enabled ? 'checked' : ''}></label>
      ${st.reminders.enabled ? `<div class="days-pick small">${days.map((d, i) => `<button class="${st.reminders.days.includes(i + 1) ? 'on' : ''}" data-act="reminder-day" data-v="${i + 1}">${esc(d)}</button>`).join('')}</div>
        <label class="set-row"><span>${esc(t('st_reminder_time'))}</span><input type="time" data-chg="set-reminder-time" value="${st.reminders.time}"></label>` : ''}
      <h4>${esc(t('st_app'))}</h4>
      <label class="set-row"><span>${esc(t('st_language'))}</span><select data-chg="set-lang">${Object.entries(LANG_NAMES).map(([k, v]) => `<option value="${k}" ${getLang() === k ? 'selected' : ''}>${v}</option>`).join('')}</select></label>
      <label class="set-row"><span>${esc(t('st_sound'))}</span><input type="checkbox" class="switch" data-chg="set-sound" ${st.sound ? 'checked' : ''}></label>
      ${m.native && !m.isPremium ? `<button class="set-row-btn" data-act="ads-privacy">${esc(t('st_ads_privacy'))}${ic('shield-halved')}</button>` : ''}
      <button class="set-row-btn" data-act="export">${esc(t('st_export'))}${isPremium() ? ic('file-export') : ic('crown')}</button>
      <a class="set-row-btn" href="${PRIVACY_URL}" target="_blank" rel="noopener">${esc(t('st_privacy'))}${ic('arrow-up-right-from-square')}</a>
      <a class="set-row-btn" href="${TERMS_URL}" target="_blank" rel="noopener">${esc(t('st_terms'))}${ic('arrow-up-right-from-square')}</a>
      <a class="set-row-btn" href="${SUPPORT_URL}" target="_blank" rel="noopener">${esc(t('st_support'))}${ic('arrow-up-right-from-square')}</a>
      <button class="set-row-btn danger" data-act="reset">${esc(t('st_reset'))}${ic('trash')}</button>
      <p class="muted tiny center">${esc(t('st_version'))} ${__APP_VERSION__}</p>`;
    return shell(s, t('st_title'), body, { full: true });
  },

  profile(s) {
    const p = S.data.profile;
    const goals = ['muscle', 'strength', 'fat_loss', 'fitness'];
    const body = `${bodyForm(p)}
      <label class="field"><span>${esc(t('ob_goal'))}</span><select data-chg="pf-goal">${goals.map(g => `<option value="${g}" ${p.goal === g ? 'selected' : ''}>${esc(t(`goal_${g}`))}</option>`).join('')}</select></label>
      <label class="field"><span>${esc(t('ob_level'))}</span><select data-chg="pf-level">${[1, 2, 3].map(l => `<option value="${l}" ${p.level === l ? 'selected' : ''}>${esc(t(`lvl_${l}`))}</option>`).join('')}</select></label>
      <label class="field"><span>${esc(t('ob_place'))}</span><select data-chg="pf-location">${['gym', 'home'].map(l => `<option value="${l}" ${p.location === l ? 'selected' : ''}>${esc(t(`place_${l}`))}</option>`).join('')}</select></label>`;
    return shell(s, t('st_profile'), body, { foot: `<button class="btn btn-accent btn-block" data-act="profile-save">${esc(t('save'))}</button>` });
  },

  paywall(s) {
    const m = getMonetization();
    const yearly = m.products[PRODUCTS.yearly];
    const monthly = m.products[PRODUCTS.monthly];
    const plan = s.plan || 'yearly';
    const save = yearly && monthly && monthly.price > 0 ? Math.round((1 - yearly.price / (monthly.price * 12)) * 100) : null;
    const perMonth = yearly ? new Intl.NumberFormat(undefined, { style: 'currency', currency: yearly.currencyCode || 'EUR' }).format(yearly.price / 12) : null;
    const selected = plan === 'yearly' ? yearly : monthly;
    const priceLabel = selected ? `${selected.priceString}/${plan === 'yearly' ? t('pw_yearly').toLowerCase() : t('pw_monthly').toLowerCase()}` : '';
    const planBtn = (id, label, prod, extra) => `<button class="plan ${plan === id ? 'on' : ''}" data-act="pw-plan" data-v="${id}">
      <div><strong>${esc(label)}</strong>${extra ? `<span class="muted small">${esc(extra)}</span>` : ''}</div>
      <div class="plan-p">${prod ? esc(prod.priceString) : '—'}</div>${id === 'yearly' && save > 0 ? `<span class="plan-badge">${esc(t('pw_save', { n: save }))}</span>` : ''}</button>`;
    const body = `<div class="pw-hero">${ic('crown')}<h2>${esc(t('pw_title'))}</h2><p>${esc(t('pw_subtitle'))}</p></div>
      <ul class="pw-list">${['pw_f1', 'pw_f2', 'pw_f3', 'pw_f4', 'pw_f5', 'pw_f6'].map(k => `<li>${ic('check')} ${esc(t(k))}</li>`).join('')}</ul>
      ${m.native ? `${planBtn('yearly', t('pw_yearly'), yearly, perMonth ? t('pw_per_month', { p: perMonth }) : t('pw_trial_badge'))}${planBtn('monthly', t('pw_monthly'), monthly, t('pw_trial_badge'))}
        ${!yearly && !monthly ? `<p class="muted small center">${esc(t('pw_loading'))}</p>` : ''}` : `<p class="muted center">${esc(t('pw_unavailable'))}</p>`}`;
    const foot = `${m.native ? `<button class="btn btn-accent btn-block btn-lg" data-act="pw-buy" ${selected ? '' : 'disabled'}>${esc(t('pw_cta_trial'))}</button>` : ''}
      <button class="btn btn-text btn-block" data-act="sheet-close">${esc(t('pw_free'))}</button>
      ${m.native ? `<p class="legal">${esc(t('pw_legal', { price: priceLabel || '—' }))}</p>
        <p class="legal"><button class="link" data-act="restore">${esc(t('st_restore'))}</button> · <a href="${TERMS_URL}" target="_blank" rel="noopener">${esc(t('st_terms'))}</a> · <a href="${PRIVACY_URL}" target="_blank" rel="noopener">${esc(t('st_privacy'))}</a></p>` : ''}`;
    return shell(s, '', body, { full: true, foot });
  }
};

function pickerList(s) {
  const q = (s.q || '').trim().toLowerCase();
  const list = EXERCISES.filter(ex => (!s.muscle || s.muscle === 'all' || ex.muscle === s.muscle) &&
    (!q || Object.values(ex.name).some(n => n.toLowerCase().includes(q))));
  return list.map(ex => `<button class="ex-row" data-act="pick-exercise" data-id="${ex.id}" data-target="${s.target}">${exerciseSvg(ex, true)}
    <div class="ex-row-t"><strong>${esc(tr(ex.name))}</strong><span class="muted small">${esc(muscleName(ex.muscle))} · ${esc(t(`eq_${ex.equipment}`))}</span></div>${ic('plus', 'accent')}</button>`).join('')
    || `<p class="muted center">${esc(t('none_yet'))}</p>`;
}

function foodList(q = '') {
  const s = q.trim().toLowerCase();
  const list = FOODS.filter(f => !s || Object.values(f.name).some(n => n.toLowerCase().includes(s)));
  return list.map(f => `<button class="food-row" data-act="food-pick" data-id="${f.id}"><div><strong>${esc(tr(f.name))}</strong>
    <span class="muted small">${f.kcal} ${esc(t('kcal'))} ${esc(t('nu_per100'))} · P ${f.p} · C ${f.c} · G ${f.f}</span></div>${ic('plus', 'accent')}</button>`).join('')
    || emptyState('magnifying-glass', t('none_yet'), t('nu_custom'));
}

function foodPreview(v) {
  return `<div><span>${esc(t('kcal'))}</span><b>${v.kcal}</b></div><div><span>${esc(t('nu_protein'))}</span><b>${fmtNum(v.p, 1)} g</b></div>
    <div><span>${esc(t('nu_carbs'))}</span><b>${fmtNum(v.c, 1)} g</b></div><div><span>${esc(t('nu_fat'))}</span><b>${fmtNum(v.f, 1)} g</b></div>`;
}

const top = () => ui.sheets[ui.sheets.length - 1];
const num = id => {
  const v = parseFloat((document.getElementById(id)?.value || '').replace(',', '.'));
  return Number.isFinite(v) && v >= 0 ? v : 0;
};

function sendCoach(text) {
  const clean = text.trim().slice(0, 200);
  if (!clean) return;
  const topic = matchTopic(clean);
  const params = topic ? answerParams(topic, S.data) : {};
  const msgs = S.data.coach.messages;
  msgs.push({ from: 'me', text: clean, ts: Date.now() }, { from: 'bot', topic, params, ts: Date.now() });
  S.data.coach.messages = msgs.slice(-40);
  commit();
  const chat = document.getElementById('chat');
  if (chat) chat.lastElementChild?.scrollIntoView({ block: 'end' });
}

async function exportData() {
  if (!isPremium()) {
    openSheet({ type: 'paywall' });
    return;
  }
  const json = JSON.stringify(S.data, null, 2);
  const rows = [['date', 'workout', 'exercise', 'set', 'weight_kg', 'reps']];
  for (const w of S.data.workouts) {
    for (const e of w.exercises) e.sets.forEach((s, i) => rows.push([new Date(w.start).toISOString(), w.name, tr(EXERCISE_BY_ID[e.exId]?.name), i + 1, s.w, s.r]));
  }
  const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
  const stamp = dayKey();
  if (Capacitor.isNativePlatform()) {
    const a = await Filesystem.writeFile({ path: `auralift-${stamp}.json`, data: json, directory: Directory.Cache, encoding: Encoding.UTF8 });
    const b = await Filesystem.writeFile({ path: `auralift-workouts-${stamp}.csv`, data: csv, directory: Directory.Cache, encoding: Encoding.UTF8 });
    await Share.share({ files: [a.uri, b.uri] }).catch(() => {});
    return;
  }
  for (const [name, content, type] of [[`auralift-${stamp}.json`, json, 'application/json'], [`auralift-workouts-${stamp}.csv`, csv, 'text/csv']]) {
    const url = URL.createObjectURL(new Blob([content], { type }));
    const link = Object.assign(document.createElement('a'), { href: url, download: name });
    link.click();
    URL.revokeObjectURL(url);
  }
}

function applyReminders() {
  scheduleReminders(S.data.settings.reminders, t('st_reminder_title'), t('st_reminder_body'));
}

// ---------------------------------------------------------------- azioni
export const actions = {
  'sheet-close': closeTopSheet,
  'confirm-yes'() {
    ui.sheets.pop();
    renderSheets();
    confirmResolve?.(true);
  },
  'confirm-no'() {
    ui.sheets.pop();
    renderSheets();
    confirmResolve?.(false);
  },
  'open-coach'() {
    openSheet({ type: 'coach' });
  },
  'open-settings'() {
    openSheet({ type: 'settings' });
  },
  'open-profile'() {
    openSheet({ type: 'profile' });
  },
  paywall() {
    openSheet({ type: 'paywall' });
  },

  'start-program'(el) {
    const custom = Boolean(el.dataset.custom);
    const p = custom ? S.data.routines.find(r => r.id === el.dataset.id) : PROGRAM_BY_ID[el.dataset.id];
    ui.sheets = [];
    startWorkout(custom ? p.name : tr(p.name), p.items, { highIntensity: p.goal === 'fat_loss' });
  },
  'edit-routine'(el) {
    const r = S.data.routines.find(x => x.id === el.dataset.id);
    openSheet({ type: 'routine', draft: JSON.parse(JSON.stringify(r)) }, true);
  },
  async 'delete-routine'(el) {
    if (!(await confirmDialog(t('confirm_delete')))) return;
    S.data.routines = S.data.routines.filter(r => r.id !== el.dataset.id);
    ui.sheets = [];
    commit();
  },
  're-add'() {
    openSheet({ type: 'picker', target: 'routine' });
  },
  're-move'(el) {
    const items = top().draft.items;
    const i = +el.dataset.i;
    const j = i + Number(el.dataset.d);
    [items[i], items[j]] = [items[j], items[i]];
    renderSheets();
  },
  're-remove'(el) {
    top().draft.items.splice(+el.dataset.i, 1);
    renderSheets();
  },
  're-save'() {
    const d = top().draft;
    d.name = d.name.trim() || t('train_new_routine');
    if (d.id) {
      S.data.routines = S.data.routines.map(r => (r.id === d.id ? d : r));
    } else {
      d.id = uid();
      S.data.routines.push(d);
    }
    ui.sheets = [];
    ui.tab = 'train';
    ui.trainTab = 'mine';
    commit();
  },
  'picker-muscle'(el) {
    top().muscle = el.dataset.v;
    renderSheets();
  },
  'pick-exercise'(el) {
    const exId = el.dataset.id;
    if (el.dataset.target === 'routine') {
      ui.sheets.pop();
      const ex = EXERCISE_BY_ID[exId];
      top().draft.items.push({ exId, sets: ex.sets, reps: ex.r, rest: ex.rest });
      renderSheets();
      return;
    }
    ui.sheets = [];
    addExerciseToSession(exId);
  },
  'start-generated'() {
    const s = top();
    ui.sheets = [];
    startWorkout(t(`tpl_${s.result.template}`), s.result.items, { highIntensity: S.data.profile.goal === 'fat_loss' });
  },
  regenerate() {
    const s = top();
    s.result = generateWorkout(S.data.profile, S.data.workouts, { minutes: s.minutes });
    renderSheets();
  },
  async 'history-delete'(el) {
    if (!(await confirmDialog(t('wk_delete_confirm')))) return;
    S.data.workouts = S.data.workouts.filter(w => w.id !== el.dataset.id);
    ui.sheets = [];
    commit();
  },

  'food-pick'(el) {
    top().foodId = el.dataset.id;
    top().grams = null;
    renderSheets();
  },
  'food-back'() {
    top().foodId = null;
    renderSheets();
  },
  'food-custom'() {
    top().custom = true;
    renderSheets();
  },
  'food-save'() {
    const s = top();
    const food = FOOD_BY_ID[s.foodId];
    const grams = s.grams ?? food.serving;
    if (!(grams > 0)) return;
    ui.sheets.pop();
    addEntry({ foodId: food.id, name: tr(food.name), grams, meal: s.meal, ...foodPortion(food, grams) });
  },
  'food-custom-save'() {
    const s = top();
    const name = document.getElementById('cf-name').value.trim();
    const kcal = Math.round(num('cf-kcal'));
    if (!name || !kcal) {
      toast(t('nu_custom_invalid'));
      return;
    }
    ui.sheets.pop();
    addEntry({ foodId: null, name, grams: null, meal: s.meal, kcal, p: num('cf-p'), c: num('cf-c'), f: num('cf-f') });
  },

  'coach-send'() {
    const input = document.getElementById('coach-input');
    sendCoach(input?.value || '');
  },
  'coach-chip'(el) {
    sendCoach(t(`coach_chip_${el.dataset.v}`));
  },

  'profile-save'() {
    if (!bodyValid(S.data.profile)) {
      toast(t('ob_body_invalid'));
      return;
    }
    ui.sheets.pop();
    commit();
  },
  'reminder-day'(el) {
    const d = Number(el.dataset.v);
    const r = S.data.settings.reminders;
    r.days = r.days.includes(d) ? r.days.filter(x => x !== d) : [...r.days, d].sort();
    applyReminders();
    commit();
  },
  'manage-sub'() {
    manageSubscription();
  },
  async restore() {
    const ok = await restorePremium();
    toast(t(ok ? 'st_restored' : 'st_nothing_restored'));
    if (ok && top()?.type === 'paywall') closeTopSheet();
  },
  'ads-privacy'() {
    showPrivacyOptions();
  },
  export: exportData,
  async reset() {
    if (!(await confirmDialog(t('st_reset_confirm')))) return;
    await clearState();
    S.data = defaultState();
    ui.sheets = [];
    ui.onboardingStep = 0;
    commit();
  },
  'pw-plan'(el) {
    top().plan = el.dataset.v;
    renderSheets();
  },
  async 'pw-buy'(el) {
    const plan = top().plan || 'yearly';
    el.disabled = true;
    try {
      const ok = await buyPremium(PRODUCTS[plan]);
      if (ok) {
        toast(t('pw_welcome'));
        closeTopSheet();
      }
    } catch (err) {
      // L'annullamento da parte dell'utente non è un errore da mostrare
      if (!/cancel/i.test(String(err?.message || err))) toast(t('pw_error'));
    } finally {
      el.disabled = false;
    }
  }
};

export const inputs = {
  're-name'(el) {
    top().draft.name = el.value;
  },
  're-field'(el) {
    const v = parseInt(el.value, 10);
    if (Number.isFinite(v) && v > 0) top().draft.items[+el.dataset.i][el.dataset.f] = Math.min(v, el.dataset.f === 'rest' ? 600 : 100);
  },
  'picker-search'(el) {
    top().q = el.value;
    document.getElementById('picker-list').innerHTML = pickerList(top());
  },
  'food-search'(el) {
    top().q = el.value;
    document.getElementById('food-list').innerHTML = foodList(el.value);
  },
  'food-grams'(el) {
    const s = top();
    const g = parseInt(el.value, 10);
    s.grams = Number.isFinite(g) && g > 0 ? Math.min(g, 2000) : 0;
    document.getElementById('food-preview').innerHTML = foodPreview(foodPortion(FOOD_BY_ID[s.foodId], s.grams));
  },
  'set-days'(el) {
    S.data.profile.daysPerWeek = Number(el.value);
    commit();
  },
  'set-rest'(el) {
    S.data.settings.restDefault = Number(el.value);
    commit();
  },
  'set-unit'(el) {
    S.data.profile.unit = el.value;
    commit();
  },
  'set-lang'(el) {
    S.data.settings.lang = el.value;
    setLang(el.value);
    applyReminders();
    commit();
  },
  'set-sound'(el) {
    S.data.settings.sound = el.checked;
    sound.enabled = el.checked;
    commit();
  },
  async 'set-reminders'(el) {
    S.data.settings.reminders.enabled = el.checked;
    if (el.checked) await ensureNotificationPermission();
    applyReminders();
    commit();
  },
  'set-reminder-time'(el) {
    S.data.settings.reminders.time = el.value || '18:00';
    applyReminders();
    commit();
  },
  'pf-goal'(el) {
    S.data.profile.goal = el.value;
  },
  'pf-level'(el) {
    S.data.profile.level = Number(el.value);
  },
  'pf-location'(el) {
    S.data.profile.location = el.value;
  }
};

import { S, ui, commit, FREE } from '../store.js';
import { t, tr, fmtDate, fmtDuration, fmtNum } from '../i18n/index.js';
import { esc, ic, fmtW, fmtVolume, toUnit, fromUnit, inputW, muscleName, emptyState, premiumLock, unit, toast } from '../ui/dom.js';
import { barChart, lineChart, hBars } from '../ui/charts.js';
import { EXERCISE_BY_ID, MUSCLES } from '../data/exercises.js';
import { volumeByWeek, setsPerMuscle, exerciseHistory, oneRepMax, workoutVolume, DAY_MS, dayKey } from '../logic/calc.js';
import { computeBadges } from '../logic/badges.js';
import { getMonetization } from '../services/monetization.js';
import { openSheet } from '../ui/sheets.js';

const isPremium = () => getMonetization().isPremium;
const calc = { w: 80, r: 6 };

function overview() {
  const { workouts, profile, nutrition } = S.data;
  const weeks = volumeByWeek(workouts, 8).map(w => ({ label: fmtDate(w.week, { day: 'numeric', month: 'numeric' }), value: Math.round(toUnit(w.volume)) }));
  const sets = setsPerMuscle(workouts, Date.now() - 7 * DAY_MS);
  const badges = computeBadges({ profile, workouts, nutritionDays: nutrition.days });
  return `<section class="card"><div class="card-h"><h3>${esc(t('pr_weekly_volume'))}</h3><span class="muted small">${esc(unit())}</span></div>
      ${workouts.length ? barChart(weeks, { fmt: v => (v >= 1000 ? `${fmtNum(v / 1000, 1)}k` : String(v)) }) : `<p class="muted">${esc(t('pr_no_workouts'))}</p>`}</section>
    <section class="card"><div class="card-h"><h3>${esc(t('pr_weekly_sets'))}</h3></div>
      ${isPremium() ? `${hBars(MUSCLES.map(m => ({ label: muscleName(m), value: sets[m], text: fmtNum(sets[m], 1) })))}<p class="muted small">${esc(t('pr_sets_hint'))}</p>` : premiumLock(t('pr_sets_hint'))}</section>
    <section class="card"><div class="card-h"><h3>${esc(t('pr_badges'))}</h3><span class="muted small">${badges.filter(b => b.unlocked).length}/${badges.length}</span></div>
      <div class="badges">${badges.map(b => `<div class="badge ${b.unlocked ? 'on' : ''}"><span class="b-ic">${b.icon}</span><span class="b-t">${esc(t(`b_${b.id}`))}</span>
        ${b.unlocked ? '' : `<div class="meter sm"><div style="width:${Math.round(b.progress * 100)}%"></div></div>`}</div>`).join('')}</div></section>`;
}

function history() {
  const all = [...S.data.workouts].reverse();
  if (!all.length) return `<section class="card">${emptyState('clock-rotate-left', t('pr_history'), t('pr_no_workouts'))}</section>`;
  const cutoff = Date.now() - FREE.historyDays * DAY_MS;
  const list = isPremium() ? all : all.filter(w => w.start >= cutoff);
  let month = '';
  const rows = list.map(w => {
    const m = fmtDate(w.start, { month: 'long', year: 'numeric' });
    const head = m !== month ? `<h4 class="month">${esc(m)}</h4>` : '';
    month = m;
    return `${head}<button class="card hist" data-act="history-open" data-id="${w.id}">
      <div class="hist-d"><b>${fmtDate(w.start, { day: 'numeric' })}</b><span>${esc(fmtDate(w.start, { weekday: 'short' }))}</span></div>
      <div class="hist-t"><strong>${esc(w.name)}</strong><span class="muted small">${ic('stopwatch')} ${fmtDuration(w.end - w.start)} · ${ic('weight-hanging')} ${esc(fmtVolume(workoutVolume(w)))} · ${w.exercises.length} ${esc(t('train_exercises'))}</span></div>
      ${w.prs?.length ? `<span class="gold">${ic('trophy')} ${w.prs.length}</span>` : ''}</button>`;
  }).join('');
  return rows + (!isPremium() && list.length < all.length ? premiumLock(t('pr_history_limit')) : '');
}

function exercises() {
  const done = [...new Set(S.data.workouts.flatMap(w => w.exercises.map(e => e.exId)))];
  if (!done.length) return `<section class="card">${emptyState('chart-line', t('pr_exercises'), t('pr_no_workouts'))}</section>`;
  const sel = done.includes(ui.progressEx) ? ui.progressEx : done[0];
  const ex = EXERCISE_BY_ID[sel];
  const h = exerciseHistory(S.data.workouts, sel);
  const reps = h[0]?.reps;
  const best = Math.max(...h.map(p => p.value));
  const chart = h.length >= 2
    ? lineChart(h.map(p => ({ x: p.date, y: reps ? p.value : toUnit(p.value) })), { fmt: v => (reps ? String(v) : fmtNum(v, 1)), fmtX: x => fmtDate(x) })
    : `<p class="muted small">${esc(t('none_yet'))}</p>`;
  return `<section class="card">
    <label class="field"><span>${esc(t('pr_choose_ex'))}</span>
      <select data-chg="progress-ex">${done.map(id => `<option value="${id}" ${id === sel ? 'selected' : ''}>${esc(tr(EXERCISE_BY_ID[id].name))}</option>`).join('')}</select></label>
    <div class="big-num"><span class="muted small">${esc(t(reps ? 'ex_best_reps' : 'ex_best'))}</span><strong>${reps ? best : esc(fmtW(best))}</strong></div>
    ${isPremium() ? `<h4 class="muted small">${esc(t(reps ? 'pr_reps_chart' : 'pr_e1rm_chart'))}</h4>${chart}` : premiumLock(t('pw_f4'))}
    <button class="btn btn-text" data-act="open-exercise" data-id="${ex.id}">${ic('circle-info')} ${esc(tr(ex.name))}</button></section>`;
}

function body() {
  const list = S.data.bodyWeight;
  const chart = list.length >= 2 ? lineChart(list.map(b => ({ x: new Date(`${b.date}T12:00`).getTime(), y: toUnit(b.kg) })), { fmt: v => fmtNum(v, 1), fmtX: x => fmtDate(x) }) : '';
  return `<section class="card">
    <div class="row gap end">
      <label class="field grow"><span>${esc(t('ob_weight'))} (${esc(unit())})</span><input id="bw-input" inputmode="decimal" value="${inputW(S.data.profile.weightKg)}" data-enter="bw-add"></label>
      <button class="btn btn-accent" data-act="bw-add">${esc(t('pr_body_add'))}</button>
    </div>
    ${list.length ? (isPremium() ? `<h4 class="muted small">${esc(t('pr_body_chart'))}</h4>${chart}` : premiumLock(t('pw_f4'))) : `<p class="muted">${esc(t('pr_body_empty'))}</p>`}
    <ul class="simple-list">${[...list].reverse().slice(0, 10).map(b => `<li><span>${esc(fmtDate(new Date(`${b.date}T12:00`).getTime(), { day: 'numeric', month: 'short', year: 'numeric' }))}</span><b>${esc(fmtW(b.kg))}</b></li>`).join('')}</ul>
  </section>`;
}

function calcResult() {
  const r = oneRepMax(calc.w, calc.r);
  if (!r) return '';
  return `<div class="big-num"><span class="muted small">${esc(t('calc_result'))}</span><strong>${esc(fmtW(r.avg))}</strong>
      <span class="muted small">${esc(t('calc_formula', { e: fmtW(r.epley, false), b: r.brzycki ? fmtW(r.brzycki, false) : '—', l: fmtW(r.lander, false) }))}</span></div>
    ${calc.r > 12 ? `<p class="warn small">${ic('triangle-exclamation')} ${esc(t('calc_warn'))}</p>` : ''}
    <div class="pct-grid">${[95, 90, 85, 80, 75, 70, 65, 60].map(p => `<div><span>${esc(t('calc_pct', { p }))}</span><b>${esc(fmtW(r.avg * p / 100))}</b></div>`).join('')}</div>`;
}

function calculator() {
  return `<section class="card"><h3>${esc(t('calc_title'))}</h3><p class="muted small">${esc(t('calc_text'))}</p>
    <div class="row gap">
      <label class="field grow"><span>${esc(t('calc_weight'))} (${esc(unit())})</span><input inputmode="decimal" data-in="calc-w" value="${inputW(calc.w)}"></label>
      <label class="field grow"><span>${esc(t('calc_reps'))}</span><input inputmode="numeric" data-in="calc-r" value="${calc.r}"></label>
    </div><div id="calc-out">${calcResult()}</div></section>`;
}

export function render() {
  const tabs = [['overview', 'pr_overview'], ['history', 'pr_history'], ['exercises', 'pr_exercises'], ['body', 'pr_body'], ['calc', 'pr_calc']];
  const view = { overview, history, exercises, body, calc: calculator }[ui.progressTab] || overview;
  return `<div class="page-h"><h1>${esc(t('nav_progress'))}</h1></div>
    <div class="seg scroll">${tabs.map(([id, k]) => `<button class="${ui.progressTab === id ? 'on' : ''}" data-act="progress-tab" data-v="${id}">${esc(t(k))}</button>`).join('')}</div>
    ${view()}`;
}

export const actions = {
  'progress-tab'(el) {
    ui.progressTab = el.dataset.v;
    commit();
  },
  'history-open'(el) {
    openSheet({ type: 'workoutDetail', id: el.dataset.id });
  },
  'bw-add'() {
    const v = parseFloat(document.getElementById('bw-input')?.value.replace(',', '.'));
    const kg = fromUnit(v);
    if (!(kg >= 25 && kg <= 350)) {
      toast(t('ob_body_invalid'));
      return;
    }
    const date = dayKey();
    S.data.bodyWeight = S.data.bodyWeight.filter(b => b.date !== date).concat({ date, kg: Math.round(kg * 10) / 10 }).sort((a, b) => a.date.localeCompare(b.date));
    S.data.profile.weightKg = Math.round(kg * 10) / 10;
    commit();
  }
};

export const inputs = {
  'progress-ex'(el) {
    ui.progressEx = el.value;
    commit();
  },
  'calc-w'(el) {
    calc.w = fromUnit(parseFloat(el.value.replace(',', '.')) || 0);
    document.getElementById('calc-out').innerHTML = calcResult();
  },
  'calc-r'(el) {
    calc.r = Math.min(30, parseInt(el.value, 10) || 0);
    document.getElementById('calc-out').innerHTML = calcResult();
  }
};

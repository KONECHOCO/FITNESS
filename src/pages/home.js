import { S } from '../store.js';
import { t, tr, fmtList, fmtDate, fmtDuration } from '../i18n/index.js';
import { esc, ic, fmtVolume, muscleName, emptyState } from '../ui/dom.js';
import { recoverySvg, recoveryColor } from '../ui/bodymap.js';
import { MUSCLES, EXERCISE_BY_ID } from '../data/exercises.js';
import { recoveryMap, averageRecovery, weeklyStats, weekStreak, workoutVolume } from '../logic/calc.js';
import { pickTemplate, TEMPLATES } from '../logic/generator.js';
import { buildInsights } from '../logic/coach.js';
import { insightText, sourcesButton } from '../ui/sheets.js';
import { getMonetization } from '../services/monetization.js';

function greeting() {
  const h = new Date().getHours();
  const g = h < 12 ? t('greet_morning') : h < 18 ? t('greet_afternoon') : t('greet_evening');
  const name = S.data.profile.name?.trim();
  return name ? `${g}, ${esc(name)}` : g;
}

export function render() {
  const { workouts, profile } = S.data;
  const rec = recoveryMap(workouts);
  const avg = averageRecovery(rec);
  const week = weeklyStats(workouts);
  const streak = weekStreak(workouts, profile.daysPerWeek);
  const tpl = pickTemplate(profile, rec);
  const ready = [...new Set(TEMPLATES[tpl.key])].filter(m => rec[m] >= 60).map(muscleName);
  const goal = profile.daysPerWeek;
  const trend = week.prevVolume ? Math.round((week.volume - week.prevVolume) / week.prevVolume * 100) : null;
  const last = workouts[workouts.length - 1];
  // In Home il consiglio più utile: prima avvisi e progressi, poi il conteggio settimanale
  const PRIORITY = ['first_workout', 'fatigued', 'stall', 'progress', 'protein_low', 'neglected', 'low_volume', 'goal_done', 'goal_progress'];
  const insight = buildInsights({ profile, workouts, nutritionDays: S.data.nutrition.days })
    .sort((a, b) => (PRIORITY.indexOf(a.id) + 99) % 99 - (PRIORITY.indexOf(b.id) + 99) % 99)[0];

  const suggested = `<section class="card hero-card">
    <div class="hero-bg"></div>
    <div class="hero-inner">
      <span class="eyebrow">${ic('bolt')} ${esc(t('home_suggested'))}</span>
      <h2>${esc(t(`tpl_${tpl.key}`))}</h2>
      <p>${esc(t('home_suggested_text', { muscles: fmtList(ready.length ? ready.slice(0, 4) : [t(`tpl_${tpl.key}`)]) }))}</p>
      <div class="row gap">
        <button class="btn btn-accent" data-act="generate" data-min="45">${ic('wand-magic-sparkles')} ${esc(t('home_generate'))}</button>
        <button class="btn btn-ghost" data-act="nav" data-tab="train">${esc(t('train_programs'))}</button>
      </div>
    </div></section>`;

  const stats = `<section class="stats-grid">
    <div class="stat"><span class="stat-l">${esc(t('home_workouts'))}</span><span class="stat-v">${week.count}<small>/${goal}</small></span>
      <div class="meter"><div style="width:${Math.min(100, week.count / goal * 100)}%"></div></div><span class="stat-s">${esc(t('home_week'))}</span></div>
    <div class="stat"><span class="stat-l">${esc(t('home_volume'))}</span><span class="stat-v">${esc(fmtVolume(week.volume))}</span>
      <span class="stat-s ${trend > 0 ? 'up' : trend < 0 ? 'down' : ''}">${trend === null ? esc(t('home_no_prev')) : `${ic(trend >= 0 ? 'arrow-trend-up' : 'arrow-trend-down')} ${esc(t('home_vs_last', { pct: (trend > 0 ? '+' : '') + trend }))}`}</span></div>
    <div class="stat"><span class="stat-l">${esc(t('home_recovery'))}</span><span class="stat-v" style="color:${recoveryColor(avg)}">${avg}%</span>
      <span class="stat-s">${esc(avg >= 90 ? t('rec_fresh') : avg >= 50 ? t('rec_mid') : t('rec_low'))}</span></div>
    <div class="stat"><span class="stat-l">${esc(t('home_streak'))}</span><span class="stat-v">${streak} ${ic('fire', 'flame')}</span>
      <span class="stat-s">${esc(t('st_goal_week'))}: ${goal}</span></div>
  </section>`;

  const recovery = `<section class="card">
    <div class="card-h"><div><h3>${esc(t('home_recovery_title'))}</h3><p class="muted">${esc(t('home_recovery_sub'))}</p></div>${sourcesButton('recovery')}</div>
    <div class="recovery">
      ${recoverySvg(rec)}
      <ul class="rec-list">${MUSCLES.map(m => `<li><span class="dot" style="background:${recoveryColor(rec[m])}"></span>${esc(muscleName(m))}<b>${rec[m]}%</b></li>`).join('')}</ul>
    </div>
    <div class="legend"><span><i style="background:${recoveryColor(100)}"></i>${esc(t('rec_fresh'))}</span><span><i style="background:${recoveryColor(65)}"></i>${esc(t('rec_mid'))}</span><span><i style="background:${recoveryColor(20)}"></i>${esc(t('rec_low'))}</span></div>
  </section>`;

  const coach = insight ? `<section class="card coach-card" data-act="open-coach">
    <div class="coach-ic">${ic('wand-magic-sparkles')}</div>
    <div><span class="eyebrow">${esc(t('home_coach'))}</span><p>${esc(insightText(insight))}</p></div>${ic('chevron-right', 'muted')}</section>` : '';

  const lastCard = last ? `<section class="card" data-act="history-open" data-id="${last.id}">
    <div class="card-h"><h3>${esc(t('home_last_workout'))}</h3><span class="muted">${esc(fmtDate(last.start, { weekday: 'short', day: 'numeric', month: 'short' }))}</span></div>
    <div class="last-w"><strong>${esc(last.name)}</strong>
      <span>${ic('stopwatch')} ${fmtDuration(last.end - last.start)}</span><span>${ic('weight-hanging')} ${esc(fmtVolume(workoutVolume(last)))}</span>
      ${last.prs?.length ? `<span class="gold">${ic('trophy')} ${last.prs.length}</span>` : ''}</div>
    <p class="muted small">${esc(fmtList(last.exercises.slice(0, 4).map(e => tr(EXERCISE_BY_ID[e.exId]?.name)).filter(Boolean)))}</p></section>` : '';

  const upsell = !getMonetization().isPremium && workouts.length >= 1 ? `<button class="card upsell" data-act="paywall">
    ${ic('crown')}<div><strong>${esc(t('pw_title'))}</strong><span>${esc(t('pw_subtitle'))} · ${esc(t('pw_f1'))}</span></div>${ic('chevron-right')}</button>` : '';

  const empty = !workouts.length ? `<section class="card">${emptyState('person-running', t('home_empty_title'), t('home_empty_text'),
    `<button class="btn btn-accent" data-act="nav" data-tab="train">${esc(t('train_programs'))}</button>`)}</section>` : '';

  return `<div class="greet"><h1>${greeting()}</h1><p class="muted">${esc(fmtDate(Date.now(), { weekday: 'long', day: 'numeric', month: 'long' }))}</p></div>
    <div class="cols"><div class="col">${suggested}${empty}${stats}${coach}${upsell}</div><div class="col">${recovery}${lastCard}</div></div>`;
}

export const actions = {};
export const inputs = {};

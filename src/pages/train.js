import { S, ui, commit, FREE } from '../store.js';
import { t, tr } from '../i18n/index.js';
import { esc, ic, muscleName, emptyState, toast } from '../ui/dom.js';
import { exerciseSvg } from '../ui/bodymap.js';
import { EXERCISES, EXERCISE_BY_ID, MUSCLES, EQUIPMENT } from '../data/exercises.js';
import { PROGRAMS, PROGRAM_BY_ID } from '../data/programs.js';
import { generateWorkout } from '../logic/generator.js';
import { dayKey } from '../logic/calc.js';
import { getMonetization } from '../services/monetization.js';
import { openSheet } from '../ui/sheets.js';

export const estimateMinutes = items => Math.max(10, Math.round(items.reduce((m, it) => m + it.sets * ((it.rest || 75) + 40), 0) / 60 / 5) * 5);

function programCard(p, custom = false) {
  const name = custom ? p.name : tr(p.name);
  const muscles = [...new Set(p.items.map(it => EXERCISE_BY_ID[it.exId]?.muscle).filter(Boolean))].slice(0, 4);
  return `<article class="card prog" data-act="${custom ? 'open-routine' : 'open-program'}" data-id="${p.id}">
    <div class="prog-top">
      <span class="tag">${custom ? ic('user') : ic(p.place === 'home' ? 'house' : 'dumbbell')} ${esc(custom ? t('train_mine') : `${t(`place_${p.place}`)} · ${t(`lvl_${p.level}`)}`)}</span>
      <span class="muted small">${esc(t('train_minutes', { n: estimateMinutes(p.items) }))}</span>
    </div>
    <h3>${esc(name)}</h3>
    ${custom ? '' : `<p class="muted small">${esc(tr(p.desc))}</p>`}
    <div class="chips">${muscles.map(m => `<span class="chip">${esc(muscleName(m))}</span>`).join('')}<span class="chip ghost">${esc(t('train_exercises_n', { n: p.items.length }))}</span></div>
  </article>`;
}

function exerciseRow(ex) {
  return `<button class="ex-row" data-act="open-exercise" data-id="${ex.id}">
    ${exerciseSvg(ex, true)}
    <div class="ex-row-t"><strong>${esc(tr(ex.name))}</strong><span class="muted small">${esc(muscleName(ex.muscle))} · ${esc(t(`eq_${ex.equipment}`))} · ${esc(t(`lvl_${ex.level}`))}</span></div>
    ${ic('chevron-right', 'muted')}</button>`;
}

export function filteredExercises() {
  const q = ui.exSearch.trim().toLowerCase();
  return EXERCISES.filter(ex =>
    (ui.muscleFilter === 'all' || ex.muscle === ui.muscleFilter) &&
    (ui.equipFilter === 'all' || ex.equipment === ui.equipFilter) &&
    (!q || tr(ex.name).toLowerCase().includes(q) || Object.values(ex.name).some(n => n.toLowerCase().includes(q)) || muscleName(ex.muscle).toLowerCase().includes(q)));
}

export function exerciseListHtml() {
  const list = filteredExercises();
  return list.length ? list.map(exerciseRow).join('') : `<p class="muted center">${esc(t('none_yet'))}</p>`;
}

export function render() {
  const tabs = [['programs', 'train_programs'], ['exercises', 'train_exercises'], ['mine', 'train_mine']];
  let body = '';
  if (ui.trainTab === 'programs') {
    const place = ui.placeFilter || S.data.profile.location;
    const list = PROGRAMS.filter(p => p.place === place);
    body = `<div class="seg small">${['gym', 'home'].map(p => `<button class="${place === p ? 'on' : ''}" data-act="place-filter" data-v="${p}">${ic(p === 'gym' ? 'dumbbell' : 'house')} ${esc(t(`place_${p}`))}</button>`).join('')}</div>
      <section class="card gen-card">
        <div><h3>${ic('wand-magic-sparkles')} ${esc(t('home_generate'))}</h3><p class="muted small">${esc(t('train_generated_text'))}</p></div>
        <div class="row gap">${[30, 45, 60].map(m => `<button class="btn btn-sm btn-ghost" data-act="generate" data-min="${m}">${m} ${esc(t('min'))}</button>`).join('')}</div>
      </section>
      <div class="grid">${list.map(p => programCard(p)).join('')}</div>`;
  } else if (ui.trainTab === 'exercises') {
    body = `<div class="search">${ic('magnifying-glass')}<input type="search" data-in="ex-search" value="${esc(ui.exSearch)}" placeholder="${esc(t('train_search_ph'))}"></div>
      <div class="pills">${['all', ...MUSCLES].map(m => `<button class="pill ${ui.muscleFilter === m ? 'on' : ''}" data-act="muscle-filter" data-v="${m}">${esc(m === 'all' ? t('all') : muscleName(m))}</button>`).join('')}</div>
      <div class="pills">${['all', ...EQUIPMENT].map(e => `<button class="pill sm ${ui.equipFilter === e ? 'on' : ''}" data-act="equip-filter" data-v="${e}">${esc(e === 'all' ? t('all') : t(`eq_${e}`))}</button>`).join('')}</div>
      <div class="card list" id="ex-list">${exerciseListHtml()}</div>`;
  } else {
    const mine = S.data.routines;
    body = `<button class="btn btn-accent btn-block" data-act="new-routine">${ic('plus')} ${esc(t('train_new_routine'))}</button>
      ${!getMonetization().isPremium ? `<p class="muted small center">${esc(t('train_limit', { n: FREE.routines }))}</p>` : ''}
      ${mine.length ? `<div class="grid">${mine.map(r => programCard(r, true)).join('')}</div>` : `<section class="card">${emptyState('folder-open', t('train_mine'), t('train_no_routines'))}</section>`}`;
  }
  return `<div class="page-h"><h1>${esc(t('nav_train'))}</h1></div>
    <div class="seg">${tabs.map(([id, k]) => `<button class="${ui.trainTab === id ? 'on' : ''}" data-act="train-tab" data-v="${id}">${esc(t(k))}</button>`).join('')}</div>
    ${body}`;
}

// ---------------------------------------------------------------- azioni
export function canCreateRoutine() {
  return getMonetization().isPremium || S.data.routines.length < FREE.routines;
}

export const actions = {
  'train-tab'(el) {
    ui.trainTab = el.dataset.v;
    commit();
  },
  'place-filter'(el) {
    ui.placeFilter = el.dataset.v;
    commit();
  },
  'muscle-filter'(el) {
    ui.muscleFilter = el.dataset.v;
    commit();
  },
  'equip-filter'(el) {
    ui.equipFilter = el.dataset.v;
    commit();
  },
  'open-program'(el) {
    openSheet({ type: 'program', id: el.dataset.id });
  },
  'open-routine'(el) {
    openSheet({ type: 'program', id: el.dataset.id, custom: true });
  },
  'open-exercise'(el) {
    openSheet({ type: 'exercise', id: el.dataset.id });
  },
  'new-routine'() {
    if (!canCreateRoutine()) {
      toast(t('train_limit', { n: FREE.routines }));
      openSheet({ type: 'paywall' });
      return;
    }
    openSheet({ type: 'routine', draft: { id: null, name: '', items: [] } });
  },
  'duplicate-program'(el) {
    if (!canCreateRoutine()) {
      openSheet({ type: 'paywall' });
      return;
    }
    const p = PROGRAM_BY_ID[el.dataset.id];
    openSheet({ type: 'routine', draft: { id: null, name: tr(p.name), items: p.items.map(it => ({ ...it })) } }, true);
  },
  generate(el) {
    const minutes = Number(el.dataset.min) || 45;
    const today = dayKey();
    const g = S.data.generations;
    const count = g.day === today ? g.count : 0;
    if (!getMonetization().isPremium && count >= FREE.generationsPerDay) {
      toast(t('train_gen_limit'));
      openSheet({ type: 'paywall' });
      return;
    }
    const result = generateWorkout(S.data.profile, S.data.workouts, { minutes });
    S.data.generations = { day: today, count: count + 1 };
    commit();
    openSheet({ type: 'generated', minutes, result });
  }
};

export const inputs = {
  'ex-search'(el) {
    ui.exSearch = el.value;
    const list = document.getElementById('ex-list');
    if (list) list.innerHTML = exerciseListHtml();
  }
};

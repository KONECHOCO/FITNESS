import { S, ui, commit, uid } from '../store.js';
import { saveState } from '../services/storage.js';
import { t, tr, fmtDuration } from '../i18n/index.js';
import { esc, ic, fmtW, inputW, fromUnit, toast, unit } from '../ui/dom.js';
import { exerciseSvg } from '../ui/bodymap.js';
import { EXERCISE_BY_ID } from '../data/exercises.js';
import { lastPerformance, suggestNext, detectPRs, workoutVolume, estimateKcal } from '../logic/calc.js';
import { sounds, haptic, scheduleRestEnd, cancelRestEnd, ensureNotificationPermission } from '../services/device.js';
import { openSheet, confirmDialog } from '../ui/sheets.js';

const elapsed = s => (s.pausedAt || Date.now()) - s.start - s.pausedMs;

/**
 * Avvia un allenamento. items: [{exId, sets, reps, rest}].
 * I carichi proposti vengono dall'ultima esecuzione (sovraccarico progressivo) o dai valori di partenza.
 */
export function startWorkout(name, items, { highIntensity = false } = {}) {
  if (S.data.session) {
    ui.tab = 'workout';
    commit();
    return;
  }
  const { workouts, settings } = S.data;
  S.data.session = {
    id: uid(), name, start: Date.now(), pausedAt: null, pausedMs: 0, highIntensity, rest: null,
    exercises: items.map(it => newExercise(it.exId, it, workouts, settings))
  };
  ui.tab = 'workout';
  commit();
  window.scrollTo(0, 0);
  ensureNotificationPermission();
}

function newExercise(exId, it = {}, workouts = S.data.workouts, settings = S.data.settings) {
  const ex = EXERCISE_BY_ID[exId];
  const reps = it.reps || ex.r;
  const sug = suggestNext(workouts, exId, reps);
  const w = sug ? sug.w : ex.w;
  const r = sug && (ex.timed || ex.bw) ? sug.r : reps;
  const n = it.sets || ex.sets;
  return {
    exId, rest: it.rest || ex.rest || settings.restDefault, target: reps,
    sets: Array.from({ length: n }, () => ({ w, r, done: false }))
  };
}

export function addExerciseToSession(exId) {
  if (!S.data.session) return;
  S.data.session.exercises.push(newExercise(exId));
  commit();
}

// ---------------------------------------------------------------- timer di recupero
function startRest(seconds) {
  const s = S.data.session;
  s.rest = { endAt: Date.now() + seconds * 1000, total: seconds };
  s.restDone = false;
  scheduleRestEnd(s.rest.endAt, t('wk_rest_notif_title'), t('wk_rest_notif_body'));
}

/** Aggiorna cronometro e recupero senza ridisegnare la pagina (chiamata ogni secondo). */
export function tick() {
  const s = S.data.session;
  if (!s) return;
  const clock = document.getElementById('wk-clock');
  if (clock) clock.textContent = fmtDuration(elapsed(s));
  const bar = document.getElementById('rest-bar');
  if (!s.rest) {
    if (bar) bar.classList.remove('show');
    return;
  }
  const left = s.rest.paused ? s.rest.left : Math.max(0, Math.round((s.rest.endAt - Date.now()) / 1000));
  if (bar) {
    bar.classList.add('show');
    bar.querySelector('.rest-time').textContent = fmtDuration(left * 1000);
    bar.querySelector('.rest-fill').style.width = `${(left / s.rest.total) * 100}%`;
  }
  if (!s.rest.paused && left > 0 && left <= 3) sounds.tick();
  if (!s.rest.paused && left === 0 && !s.restDone) {
    s.restDone = true;
    sounds.done();
    haptic('success');
    cancelRestEnd();
    toast(t('wk_rest_done'));
    s.rest = null;
    saveState(S.data);
    if (bar) bar.classList.remove('show');
  }
}

// ---------------------------------------------------------------- rendering
function previousLabel(prev, i, ex) {
  const p = prev?.sets[i];
  if (!p) return '—';
  if (ex.timed) return `${p.r} s`;
  if (ex.bw && !p.w) return `× ${p.r}`;
  return `${fmtW(p.w, false)} × ${p.r}`;
}

function exerciseCard(e, idx) {
  const ex = EXERCISE_BY_ID[e.exId];
  const prev = lastPerformance(S.data.workouts, e.exId);
  const sug = suggestNext(S.data.workouts, e.exId, e.target);
  const hint = sug && !ex.timed && !(ex.bw && !sug.w)
    ? `<p class="hint ${sug.increase ? 'up' : ''}">${ic(sug.increase ? 'arrow-up' : 'bullseye')} ${esc(t(sug.increase ? 'wk_suggest_up' : 'wk_suggest_same', { w: fmtW(sug.w), r: sug.r }))}</p>` : '';
  const doneCount = e.sets.filter(s => s.done).length;
  return `<article class="card wk-ex">
    <div class="wk-ex-h">
      <button class="wk-ex-title" data-act="open-exercise" data-id="${ex.id}">${exerciseSvg(ex, true)}<div><h3>${esc(tr(ex.name))}</h3>
        <span class="muted small">${doneCount}/${e.sets.length} ${esc(t('sets'))} · ${esc(t('rest_s', { n: e.rest }))}</span></div></button>
      <button class="icon-btn subtle" data-act="ex-remove" data-e="${idx}" aria-label="${esc(t('wk_remove_ex'))}">${ic('xmark')}</button>
    </div>
    ${hint}
    <div class="sets">
      <div class="set-row set-head"><span>#</span><span>${esc(t('wk_prev'))}</span><span>${ex.timed ? '' : esc(ex.bw ? `+${unit()}` : unit())}</span><span>${esc(ex.timed ? t('sec') : t('reps'))}</span><span></span></div>
      ${e.sets.map((s, i) => `<div class="set-row ${s.done ? 'done' : ''}">
        <span class="set-n">${i + 1}</span>
        <span class="set-prev">${esc(previousLabel(prev, i, ex))}</span>
        ${ex.timed ? '<span></span>' : `<input class="set-in" inputmode="decimal" data-in="set-w" data-e="${idx}" data-s="${i}" value="${inputW(s.w)}" placeholder="0" aria-label="${esc(unit())}">`}
        <input class="set-in" inputmode="numeric" data-in="set-r" data-e="${idx}" data-s="${i}" value="${s.r || ''}" placeholder="0" aria-label="${esc(t('reps'))}">
        <button class="check" data-act="set-toggle" data-e="${idx}" data-s="${i}" aria-label="${esc(t('done'))}">${ic('check')}</button>
      </div>`).join('')}
    </div>
    <div class="row between">
      <button class="btn btn-text" data-act="set-add" data-e="${idx}">${ic('plus')} ${esc(t('wk_add_set'))}</button>
      ${e.sets.length > 1 ? `<button class="btn btn-text muted" data-act="set-remove" data-e="${idx}">${ic('minus')}</button>` : ''}
    </div></article>`;
}

export function render() {
  const s = S.data.session;
  if (!s) {
    return `<div class="page-h"><h1>${esc(t('nav_workout'))}</h1></div>
      <section class="card center-card">
        <div class="big-ic">${ic('stopwatch')}</div>
        <h2>${esc(t('wk_none_title'))}</h2><p class="muted">${esc(t('wk_none_text'))}</p>
        <div class="stack">
          <button class="btn btn-accent btn-block" data-act="generate" data-min="45">${ic('wand-magic-sparkles')} ${esc(t('wk_generate'))}</button>
          <button class="btn btn-ghost btn-block" data-act="wk-programs">${ic('list')} ${esc(t('wk_from_program'))}</button>
          <button class="btn btn-ghost btn-block" data-act="wk-empty">${ic('plus')} ${esc(t('wk_empty'))}</button>
        </div></section>`;
  }
  const paused = Boolean(s.pausedAt);
  return `<div class="wk-top">
      <input class="wk-name" data-in="wk-name" value="${esc(s.name)}" placeholder="${esc(t('wk_name_ph'))}" aria-label="${esc(t('wk_name_ph'))}">
      <div class="row gap">
        <button class="clock ${paused ? 'paused' : ''}" data-act="wk-pause">${ic(paused ? 'play' : 'pause')} <span id="wk-clock">${fmtDuration(elapsed(s))}</span></button>
        <button class="btn btn-accent btn-sm" data-act="wk-finish">${ic('flag-checkered')} ${esc(t('wk_finish'))}</button>
      </div></div>
    ${s.exercises.map(exerciseCard).join('')}
    <button class="btn btn-ghost btn-block" data-act="wk-add-ex">${ic('plus')} ${esc(t('train_add_exercise'))}</button>
    <button class="btn btn-text danger btn-block" data-act="wk-discard">${esc(t('wk_discard'))}</button>
    <div class="rest-bar ${s.rest ? 'show' : ''}" id="rest-bar">
      <div class="rest-fill"></div>
      <span class="rest-label">${ic('hourglass-half')} ${esc(t('wk_rest'))}</span><span class="rest-time">--:--</span>
      <div class="row gap"><button class="btn btn-sm btn-dark" data-act="rest-adj" data-d="-15">−15</button>
      <button class="btn btn-sm btn-dark" data-act="rest-adj" data-d="15">+15</button>
      <button class="btn btn-sm btn-accent" data-act="rest-skip">${esc(t('wk_skip'))}</button></div>
    </div>`;
}

// ---------------------------------------------------------------- azioni
function finishWorkout() {
  const s = S.data.session;
  const exercises = s.exercises
    .map(e => ({ exId: e.exId, sets: e.sets.filter(x => x.done && x.r > 0).map(x => ({ w: Number(x.w) || 0, r: Number(x.r) || 0 })) }))
    .filter(e => e.sets.length);
  if (!exercises.length) {
    toast(t('wk_no_sets'));
    return;
  }
  const end = (s.pausedAt || Date.now()) - s.pausedMs;
  const workout = { id: s.id, name: s.name || t('wk_empty'), start: s.start, end: Math.max(end, s.start + 60000), exercises };
  workout.prs = detectPRs(workout, S.data.workouts);
  workout.kcal = estimateKcal(workout, S.data.profile.weightKg, s.highIntensity);
  workout.volume = workoutVolume(workout);
  S.data.workouts.push(workout);
  S.data.session = null;
  cancelRestEnd();
  sounds.done();
  haptic('success');
  commit();
  openSheet({ type: 'summary', id: workout.id });
}

export const actions = {
  'wk-empty'() {
    startWorkout(t('wk_empty'), []);
  },
  'wk-programs'() {
    ui.tab = 'train';
    ui.trainTab = 'programs';
    commit();
  },
  'wk-add-ex'() {
    openSheet({ type: 'picker', target: 'session' });
  },
  'wk-pause'() {
    const s = S.data.session;
    if (s.pausedAt) {
      s.pausedMs += Date.now() - s.pausedAt;
      s.pausedAt = null;
    } else {
      s.pausedAt = Date.now();
    }
    commit();
  },
  'wk-finish': finishWorkout,
  async 'wk-discard'() {
    if (!(await confirmDialog(t('wk_discard_confirm')))) return;
    S.data.session = null;
    cancelRestEnd();
    commit();
  },
  'set-toggle'(el) {
    const s = S.data.session;
    const e = s.exercises[+el.dataset.e];
    const set = e.sets[+el.dataset.s];
    set.done = !set.done;
    if (set.done) {
      if (!set.r) set.r = e.target;
      sounds.set();
      haptic('light');
      startRest(e.rest);
    }
    commit();
  },
  'set-add'(el) {
    const e = S.data.session.exercises[+el.dataset.e];
    const last = e.sets[e.sets.length - 1] || { w: 0, r: e.target };
    e.sets.push({ w: last.w, r: last.r, done: false });
    commit();
  },
  'set-remove'(el) {
    const e = S.data.session.exercises[+el.dataset.e];
    if (e.sets.length > 1) e.sets.pop();
    commit();
  },
  'ex-remove'(el) {
    S.data.session.exercises.splice(+el.dataset.e, 1);
    commit();
  },
  'rest-adj'(el) {
    const r = S.data.session?.rest;
    if (!r) return;
    const d = Number(el.dataset.d) * 1000;
    r.endAt = Math.max(Date.now() + 1000, r.endAt + d);
    r.total = Math.max(r.total, Math.round((r.endAt - Date.now()) / 1000));
    scheduleRestEnd(r.endAt, t('wk_rest_notif_title'), t('wk_rest_notif_body'));
    saveState(S.data);
    tick();
  },
  'rest-skip'() {
    S.data.session.rest = null;
    cancelRestEnd();
    saveState(S.data);
    tick();
  }
};

export const inputs = {
  'set-w'(el) {
    const set = S.data.session.exercises[+el.dataset.e].sets[+el.dataset.s];
    const v = parseFloat(el.value.replace(',', '.'));
    set.w = Number.isFinite(v) && v >= 0 ? fromUnit(v) : 0;
    saveState(S.data);
  },
  'set-r'(el) {
    const set = S.data.session.exercises[+el.dataset.e].sets[+el.dataset.s];
    const v = parseInt(el.value, 10);
    set.r = Number.isFinite(v) && v >= 0 ? v : 0;
    saveState(S.data);
  },
  'wk-name'(el) {
    S.data.session.name = el.value.slice(0, 60);
    saveState(S.data);
  }
};

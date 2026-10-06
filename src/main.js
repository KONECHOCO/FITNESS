import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/outfit/600.css';
import '@fontsource/outfit/700.css';
import '@fortawesome/fontawesome-free/css/fontawesome.min.css';
import '@fortawesome/fontawesome-free/css/solid.min.css';
import './styles/main.css';

import { Capacitor } from '@capacitor/core';
import { App as CapApp } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { S, ui, onRender, hydrate } from './store.js';
import { loadState, flush } from './services/storage.js';
import { initMonetization, onMonetization, adOnNavigate, getMonetization } from './services/monetization.js';
import { sound } from './services/device.js';
import { t, setLang, detectLang } from './i18n/index.js';
import { esc, ic } from './ui/dom.js';
import { dayKey } from './logic/calc.js';

import * as home from './pages/home.js';
import * as train from './pages/train.js';
import * as workout from './pages/workout.js';
import * as progress from './pages/progress.js';
import * as nutrition from './pages/nutrition.js';
import * as onboarding from './pages/onboarding.js';
import * as sheets from './ui/sheets.js';

const PAGES = { home, train, workout, progress, nutrition };
const NAV = [
  ['home', 'house', 'nav_home'],
  ['train', 'dumbbell', 'nav_train'],
  ['workout', 'stopwatch', 'nav_workout'],
  ['progress', 'chart-line', 'nav_progress'],
  ['nutrition', 'utensils', 'nav_nutrition']
];

const ACTIONS = {
  ...home.actions, ...train.actions, ...workout.actions, ...progress.actions, ...nutrition.actions,
  ...onboarding.actions, ...sheets.actions,
  nav(el) {
    const tab = el.dataset.tab;
    if (tab === ui.tab) return;
    ui.tab = tab;
    render();
    window.scrollTo(0, 0);
    // Nessun annuncio a schermo intero mentre c'è un allenamento in corso
    if (!S.data.session) adOnNavigate();
  }
};
const INPUTS = {
  ...home.inputs, ...train.inputs, ...workout.inputs, ...progress.inputs, ...nutrition.inputs,
  ...onboarding.inputs, ...sheets.inputs
};

// ---------------------------------------------------------------- rendering
function header() {
  const p = S.data.profile;
  const initials = (p.name || '').trim().slice(0, 1).toUpperCase() || ic('user');
  const premium = getMonetization().isPremium;
  return `<header class="topbar">
    <div class="brand"><span class="brand-mark">${ic('bolt')}</span><span class="brand-name">Aura<b>Lift</b></span>${premium ? '<span class="pro-pill">PREMIUM</span>' : ''}</div>
    <div class="topbar-actions">
      <button class="icon-btn" data-act="open-coach" aria-label="${esc(t('coach_title'))}">${ic('wand-magic-sparkles')}</button>
      <button class="avatar-btn" data-act="open-settings" aria-label="${esc(t('st_title'))}">${initials}</button>
    </div></header>`;
}

function nav() {
  const active = Boolean(S.data.session);
  return `<nav class="tabbar">${NAV.map(([id, icon, label]) => `
    <button class="tab ${ui.tab === id ? 'on' : ''} ${id === 'workout' ? 'tab-center' : ''}" data-act="nav" data-tab="${id}">
      <span class="tab-ic">${ic(icon)}${id === 'workout' && active ? '<span class="live-dot"></span>' : ''}</span><span>${esc(t(label))}</span>
    </button>`).join('')}</nav>`;
}

export function render() {
  const root = document.getElementById('app');
  if (!S.data.profile.onboarded) {
    root.innerHTML = onboarding.render();
  } else {
    const page = PAGES[ui.tab] || home;
    root.innerHTML = `${header()}<main class="page" id="page">${page.render()}</main>${nav()}`;
  }
  sheets.renderSheets();
  workout.tick();
}
onRender(render);

// ---------------------------------------------------------------- eventi (delegati)
document.addEventListener('click', ev => {
  const el = ev.target.closest('[data-act]');
  if (!el || el.disabled) return;
  const fn = ACTIONS[el.dataset.act];
  if (fn) {
    ev.preventDefault();
    fn(el, ev);
  }
});
const onInput = ev => {
  const el = ev.target.closest('[data-in]');
  if (!el) return;
  const fn = INPUTS[el.dataset.in];
  if (fn) fn(el, ev);
};
document.addEventListener('input', onInput);
document.addEventListener('change', ev => {
  const el = ev.target.closest('[data-chg]');
  if (!el) return;
  const fn = INPUTS[el.dataset.chg];
  if (fn) fn(el, ev);
});
document.addEventListener('keydown', ev => {
  if (ev.key === 'Enter' && ev.target.matches('[data-enter]')) {
    const fn = ACTIONS[ev.target.dataset.enter];
    if (fn) {
      ev.preventDefault();
      fn(ev.target, ev);
    }
  }
});

// ---------------------------------------------------------------- avvio
async function boot() {
  S.data = hydrate(await loadState());
  // Solo in sviluppo: ?demo=it|en|… carica dati dimostrativi (per test e screenshot dello store)
  if (import.meta.env.DEV && location.search.includes('demo')) {
    const lang = new URLSearchParams(location.search).get('demo') || 'it';
    const { buildDemo } = await import('./dev/demo.js');
    S.data = hydrate(buildDemo(lang));
  }
  setLang(S.data.settings.lang || detectLang());
  sound.enabled = S.data.settings.sound;
  ui.nutriDate = dayKey();

  if (Capacitor.isNativePlatform()) {
    StatusBar.setStyle({ style: Style.Dark }).catch(() => {});
    CapApp.addListener('appStateChange', ({ isActive }) => {
      if (!isActive) flush();
      else render();
    });
    CapApp.addListener('backButton', () => sheets.closeTopSheet());
  }
  window.addEventListener('pagehide', flush);

  render();
  setInterval(workout.tick, 1000);
  // Ridisegna solo quando cambia lo stato Premium o arrivano i prezzi (non a ogni cambio del banner,
  // per non far perdere il focus ai campi di input)
  let lastKey = '';
  onMonetization(m => {
    const key = `${m.isPremium}|${Object.keys(m.products).length}`;
    if (key !== lastKey) {
      lastKey = key;
      render();
    }
  });
  initMonetization();
}

boot();

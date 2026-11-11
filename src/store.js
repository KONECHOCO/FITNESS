// Stato dell'app (persistito) + stato dell'interfaccia (non persistito).
import { saveState } from './services/storage.js';

export const FREE = { routines: 3, generationsPerDay: 1, historyDays: 30, insights: 2 };

export function defaultState() {
  return {
    v: 2,
    profile: {
      name: '', sex: 'm', age: null, heightCm: null, weightKg: null,
      goal: 'muscle', level: 1, daysPerWeek: 3, location: 'gym', equipment: [], unit: 'kg',
      onboarded: false, createdAt: Date.now()
    },
    settings: { lang: null, sound: true, restDefault: 90, accent: 'lime', health: false, reminders: { enabled: false, days: [1, 3, 5], time: '18:00' } },
    routines: [],
    workouts: [],
    session: null,
    nutrition: { days: {} },
    bodyWeight: [],
    coach: { messages: [] },
    generations: { day: '', count: 0 },
    paywallSeen: false
  };
}

export const S = { data: defaultState() };

// Temi colore (funzione Pro): [accento, testo sull'accento, r,g,b]
export const ACCENTS = {
  lime: ['#c6f24e', '#10140a', '198, 242, 78'],
  cyan: ['#5ad1fa', '#04141b', '90, 209, 250'],
  orange: ['#ff9f43', '#1d1003', '255, 159, 67'],
  pink: ['#ff6fae', '#1d0612', '255, 111, 174'],
  violet: ['#a78bfa', '#120a26', '167, 139, 250']
};

export const ui = {
  tab: 'home',
  trainTab: 'programs',
  progressTab: 'overview',
  placeFilter: null,
  muscleFilter: 'all',
  equipFilter: 'all',
  exSearch: '',
  nutriDate: null,
  progressEx: null,
  sheets: [],
  onboardingStep: 0
};

let renderFn = () => {};
export function onRender(fn) {
  renderFn = fn;
}

/** Salva e ridisegna. */
export function commit() {
  saveState(S.data);
  renderFn();
}

export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

/** Unisce i dati salvati con i valori predefiniti (utile quando aggiungiamo nuovi campi). */
export function hydrate(saved) {
  const base = defaultState();
  if (!saved || saved.v !== 2) return base;
  return {
    ...base, ...saved,
    profile: { ...base.profile, ...saved.profile },
    settings: { ...base.settings, ...saved.settings, reminders: { ...base.settings.reminders, ...saved.settings?.reminders } },
    nutrition: { days: saved.nutrition?.days || {} },
    coach: { messages: saved.coach?.messages || [] },
    generations: saved.generations || base.generations
  };
}

// SOLO SVILUPPO (?demo): crea 6 settimane di utilizzo verosimile per provare l'app e per gli
// screenshot dell'App Store. Usa lo stesso modello dati e gli stessi calcoli dell'app reale.
// Non viene incluso nella build di produzione (import condizionato da import.meta.env.DEV).
import { defaultState } from '../store.js';
import { PROGRAM_BY_ID } from '../data/programs.js';
import { FOOD_BY_ID } from '../data/foods.js';
import { EXERCISE_BY_ID } from '../data/exercises.js';
import { detectPRs, estimateKcal, foodPortion, dayKey, weekStart, DAY_MS } from '../logic/calc.js';

const START_LOAD = {
  bench_press: 72.5, incline_db_press: 24, db_shoulder_press: 18, lateral_raise: 9, triceps_pushdown: 27.5, overhead_triceps_ext: 16,
  barbell_row: 60, lat_pulldown: 55, seated_cable_row: 55, face_pull: 20, barbell_curl: 27.5, hammer_curl: 12,
  back_squat: 90, romanian_deadlift: 80, leg_press: 160, leg_curl: 40, standing_calf_raise: 70, hanging_leg_raise: 0,
  overhead_press: 45, db_curl: 12
};

export function buildDemo(lang = 'it') {
  const s = defaultState();
  const NAMES = { it: 'Marco', en: 'Alex', es: 'Carlos', fr: 'Lucas', de: 'Lukas', pt: 'João' };
  Object.assign(s.profile, {
    name: NAMES[lang] || 'Alex', sex: 'm', age: 32, heightCm: 178, weightKg: 80.4, goal: 'muscle', level: 2, daysPerWeek: 4,
    location: 'gym', unit: 'kg', onboarded: true, createdAt: Date.now() - 45 * DAY_MS
  });
  s.settings.lang = lang;
  s.paywallSeen = true;

  // Lun push, Mar pull, Gio legs, Sab upper — per 6 settimane fino a oggi
  const plan = [[0, 'push', 18], [1, 'pull', 18], [3, 'legs', 17], [5, 'upper', 10]];
  const thisWeek = weekStart();
  const now = Date.now();
  const workouts = [];
  for (let w = 5; w >= 0; w--) {
    const week = thisWeek - w * 7 * DAY_MS;
    for (const [dow, programId, hour] of plan) {
      const start = week + dow * DAY_MS + hour * 3600000 + 12 * 60000;
      if (start > now - 3 * 3600000) continue;
      const prog = PROGRAM_BY_ID[programId];
      const progress = 5 - w; // settimane di progressione
      const exercises = prog.items.map(it => {
        const ex = EXERCISE_BY_ID[it.exId];
        const base = START_LOAD[it.exId] ?? ex.w;
        const step = ex.kind === 'compound' && ex.equipment === 'barbell' ? 2.5 : 1;
        const load = base + Math.floor(progress / 2) * step;
        return {
          exId: it.exId,
          sets: Array.from({ length: it.sets }, (_, i) => ({
            w: ex.bw ? 0 : load,
            r: Math.max(it.reps - (i === it.sets - 1 && progress % 2 === 0 ? 1 : 0), 1)
          }))
        };
      });
      const end = start + (55 + ((w * 7 + dow) % 4) * 5) * 60000;
      const workout = { id: `demo-${w}-${dow}`, name: prog.name[lang] || prog.name.en, start, end, exercises };
      workout.prs = detectPRs(workout, workouts);
      workout.kcal = estimateKcal(workout, 80);
      workouts.push(workout);
    }
  }
  s.workouts = workouts;

  // Diario alimentare degli ultimi 7 giorni (oggi parziale)
  const menu = {
    breakfast: [['oats', 70], ['milk', 250], ['banana', 120], ['whey', 30]],
    lunch: [['pasta_dry', 100], ['chicken_breast', 170], ['olive_oil', 10], ['salad', 120]],
    snack: [['greek_yogurt', 170], ['almonds', 25], ['blueberries', 100]],
    dinner: [['salmon', 180], ['potato', 300], ['broccoli', 200], ['olive_oil', 10]]
  };
  for (let d = 6; d >= 0; d--) {
    const key = dayKey(now - d * DAY_MS);
    const entries = [];
    for (const [meal, foods] of Object.entries(menu)) {
      if (d === 0 && meal === 'dinner') continue;
      foods.forEach(([id, grams], i) => {
        const food = FOOD_BY_ID[id];
        const g = Math.round(grams * (1 + ((d + i) % 3 - 1) * 0.08));
        entries.push({ id: `${key}-${meal}-${i}`, foodId: id, name: food.name[lang], grams: g, meal, ...foodPortion(food, g) });
      });
    }
    s.nutrition.days[key] = { entries, waterMl: d === 0 ? 1750 : 2750 };
  }

  // Peso corporeo settimanale
  s.bodyWeight = [79.1, 79.4, 79.6, 79.9, 80.1, 80.4].map((kg, i) => ({ date: dayKey(now - (5 - i) * 7 * DAY_MS), kg }));
  return s;
}

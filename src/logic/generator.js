// Generatore di allenamento a regole: sceglie i muscoli più recuperati e gli esercizi adatti
// ad attrezzatura, livello e obiettivo. Deterministico se gli si passa `rng`.
import { EXERCISES } from '../data/exercises.js';
import { recoveryMap } from './calc.js';

export const TEMPLATES = {
  full: ['quads', 'chest', 'back', 'shoulders', 'hamstrings', 'glutes', 'core'],
  push: ['chest', 'shoulders', 'triceps', 'chest', 'shoulders', 'triceps'],
  pull: ['back', 'biceps', 'back', 'shoulders', 'biceps', 'back'],
  legs: ['quads', 'hamstrings', 'glutes', 'quads', 'calves', 'core'],
  upper: ['chest', 'back', 'shoulders', 'biceps', 'triceps', 'chest', 'back']
};

const GYM_BODYWEIGHT = new Set(['pull_up', 'chin_up', 'dips', 'hanging_leg_raise', 'back_extension', 'plank', 'side_plank']);

const SCHEMES = {
  strength: { compound: [5, 5, 180], isolation: [3, 8, 90] },
  muscle: { compound: [4, 8, 120], isolation: [3, 12, 60] },
  fat_loss: { compound: [3, 12, 45], isolation: [3, 15, 30] },
  fitness: { compound: [3, 10, 75], isolation: [3, 12, 60] }
};

export function availableExercises(profile) {
  const eq = profile.location === 'home'
    ? new Set(['bodyweight', ...(profile.equipment || []).filter(e => e === 'dumbbell' || e === 'barbell')])
    : null;
  const maxLevel = Math.min(3, (profile.level || 1) + 1);
  return EXERCISES.filter(e => (!eq || eq.has(e.equipment)) && e.level <= maxLevel);
}

export function pickTemplate(profile, recovery) {
  const mean = ms => ms.reduce((s, m) => s + recovery[m], 0) / ms.length;
  const candidates = (profile.level || 1) === 1 || (profile.daysPerWeek || 3) <= 3
    ? ['full', 'upper', 'legs']
    : ['push', 'pull', 'legs', 'upper', 'full'];
  let best = candidates[0];
  let bestScore = -1;
  for (const key of candidates) {
    const score = mean([...new Set(TEMPLATES[key])]);
    if (score > bestScore + 0.5) {
      best = key;
      bestScore = score;
    }
  }
  return { key: best, score: Math.round(bestScore) };
}

export function generateWorkout(profile, workouts, { minutes = 45, now = Date.now(), rng = Math.random } = {}) {
  const recovery = recoveryMap(workouts, now);
  const { key } = pickTemplate(profile, recovery);
  const pool = availableExercises(profile);
  const count = minutes <= 30 ? 4 : minutes <= 45 ? 5 : minutes <= 60 ? 6 : 7;
  const scheme = SCHEMES[profile.goal] || SCHEMES.muscle;
  const used = new Set();
  const items = [];

  const order = TEMPLATES[key].filter(m => recovery[m] >= 40);
  const muscles = order.length ? order : TEMPLATES[key];

  for (let i = 0; items.length < count && i < muscles.length * 3; i++) {
    const m = muscles[i % muscles.length];
    const already = items.filter(it => it.muscle === m).length;
    // Prima un multiarticolare per muscolo, poi i complementari
    const wantKind = already === 0 ? 'compound' : 'isolation';
    let cands = pool.filter(e => e.muscle === m && !used.has(e.id) && e.kind === wantKind);
    if (!cands.length) cands = pool.filter(e => e.muscle === m && !used.has(e.id));
    // In palestra i classici a corpo libero (trazioni, dip, sollevamenti alla sbarra) restano validi,
    // gli altri esercizi "da casa" solo se non c'è alternativa con attrezzi
    if (profile.location !== 'home') {
      const gymOk = cands.filter(e => e.equipment !== 'bodyweight' || GYM_BODYWEIGHT.has(e.id));
      if (gymOk.length) cands = gymOk;
    }
    if (!cands.length) continue;
    const ex = cands[Math.floor(rng() * cands.length)];
    used.add(ex.id);
    const [sets, reps, rest] = scheme[ex.kind];
    items.push({ exId: ex.id, muscle: m, sets, reps: ex.timed ? ex.r : reps, rest: ex.timed ? 45 : rest });
  }
  // Multiarticolari prima dei complementari
  items.sort((a, b) => (pool.find(e => e.id === a.exId).kind === 'compound' ? 0 : 1) - (pool.find(e => e.id === b.exId).kind === 'compound' ? 0 : 1));
  return { template: key, items: items.map(({ muscle, ...rest }) => rest) };
}

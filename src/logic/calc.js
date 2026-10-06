// Calcoli puri (nessun accesso al DOM): testati in tests/calc.test.js.
import { EXERCISE_BY_ID, MUSCLES, RECOVERY_HOURS } from '../data/exercises.js';

export const DAY_MS = 24 * 60 * 60 * 1000;
export const KG_PER_LB = 0.45359237;

// ---------------------------------------------------------------- date
export function dayKey(ts = Date.now()) {
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Lunedì 00:00 della settimana che contiene ts (ora locale). */
export function weekStart(ts = Date.now()) {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  const dow = (d.getDay() + 6) % 7; // 0 = lunedì
  d.setDate(d.getDate() - dow);
  return d.getTime();
}

// ---------------------------------------------------------------- 1RM
/** Massimale stimato con tre formule. Oltre 12 ripetizioni le stime perdono affidabilità. */
export function oneRepMax(weight, reps) {
  if (!(weight > 0) || !(reps > 0)) return null;
  if (reps === 1) return { epley: weight, brzycki: weight, lander: weight, avg: weight };
  const epley = weight * (1 + reps / 30);
  const brzycki = reps < 37 ? weight * 36 / (37 - reps) : null;
  const lander = (100 * weight) / (101.3 - 2.67123 * reps);
  const vals = [epley, brzycki, lander].filter(v => v && v > 0);
  const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
  return { epley, brzycki, lander, avg };
}

export function e1rm(weight, reps) {
  const r = oneRepMax(weight, reps);
  return r ? r.avg : 0;
}

// ---------------------------------------------------------------- allenamenti
export function setVolume(exId, set) {
  const ex = EXERCISE_BY_ID[exId];
  if (!ex || ex.timed) return 0;
  return (set.w || 0) * (set.r || 0);
}

export function workoutVolume(workout) {
  let vol = 0;
  for (const e of workout.exercises) for (const s of e.sets) vol += setVolume(e.exId, s);
  return Math.round(vol);
}

export function workoutSetCount(workout) {
  return workout.exercises.reduce((n, e) => n + e.sets.length, 0);
}

/** Migliori prestazioni per esercizio su un elenco di allenamenti (escluso eventualmente uno). */
export function bestsByExercise(workouts, excludeId = null) {
  const best = {};
  for (const w of workouts) {
    if (w.id === excludeId) continue;
    for (const e of w.exercises) {
      const ex = EXERCISE_BY_ID[e.exId];
      if (!ex) continue;
      const b = best[e.exId] || (best[e.exId] = { e1rm: 0, weight: 0, reps: 0 });
      for (const s of e.sets) {
        if (ex.timed || ex.bw && !s.w) {
          b.reps = Math.max(b.reps, s.r || 0);
        } else {
          b.e1rm = Math.max(b.e1rm, e1rm(s.w, s.r));
          b.weight = Math.max(b.weight, s.w || 0);
        }
      }
    }
  }
  return best;
}

/**
 * Record personali ottenuti in `workout` rispetto agli allenamenti precedenti.
 * Il primo allenamento con un esercizio non conta come record (non c'è nulla da battere).
 */
export function detectPRs(workout, previousWorkouts) {
  const before = bestsByExercise(previousWorkouts.filter(w => w.start < workout.start));
  const prs = [];
  for (const e of workout.exercises) {
    const ex = EXERCISE_BY_ID[e.exId];
    const prev = before[e.exId];
    if (!ex || !prev || !e.sets.length) continue;
    if (ex.timed || (ex.bw && e.sets.every(s => !s.w))) {
      const top = Math.max(...e.sets.map(s => s.r || 0));
      if (top > prev.reps && prev.reps > 0) prs.push({ exId: e.exId, type: 'reps', value: top, prev: prev.reps });
      continue;
    }
    const topE = Math.max(...e.sets.map(s => e1rm(s.w, s.r)));
    const topW = Math.max(...e.sets.map(s => s.w || 0));
    if (topW > prev.weight && prev.weight > 0) prs.push({ exId: e.exId, type: 'weight', value: topW, prev: prev.weight });
    else if (topE > prev.e1rm * 1.005 && prev.e1rm > 0) prs.push({ exId: e.exId, type: 'e1rm', value: topE, prev: prev.e1rm });
  }
  return prs;
}

/** Serie dell'ultima volta per un esercizio (per la colonna "Precedente"). */
export function lastPerformance(workouts, exId) {
  for (let i = workouts.length - 1; i >= 0; i--) {
    const e = workouts[i].exercises.find(x => x.exId === exId);
    if (e && e.sets.length) return { date: workouts[i].start, sets: e.sets };
  }
  return null;
}

/**
 * Suggerimento di sovraccarico progressivo: se nell'ultima seduta tutte le serie hanno raggiunto
 * le ripetizioni obiettivo, aumenta il carico (2,5 kg multiarticolari, 1 kg complementari),
 * altrimenti mantieni il carico.
 */
export function suggestNext(workouts, exId, targetReps) {
  const ex = EXERCISE_BY_ID[exId];
  const last = lastPerformance(workouts, exId);
  if (!ex || !last) return null;
  const allHit = last.sets.every(s => (s.r || 0) >= targetReps);
  const topW = Math.max(...last.sets.map(s => s.w || 0));
  if (ex.timed || (ex.bw && !topW)) {
    const topR = Math.max(...last.sets.map(s => s.r || 0));
    return { w: 0, r: allHit ? topR + (ex.timed ? 5 : 1) : topR, increase: allHit };
  }
  const step = ex.kind === 'compound' && ex.equipment === 'barbell' ? 2.5 : ex.equipment === 'machine' || ex.equipment === 'cable' ? 2.5 : 1;
  return { w: allHit ? topW + step : topW, r: targetReps, increase: allHit };
}

// ---------------------------------------------------------------- recupero muscolare
/**
 * Fatica residua per muscolo (0–100) calcolata dalle serie degli ultimi 4 giorni.
 * Ogni serie vale 1 per il muscolo principale e 0,5 per i secondari; il contributo cala
 * linearmente fino a zero in 48–72 h a seconda del muscolo. ~8 serie dure recenti = 100%.
 */
export function muscleFatigue(workouts, now = Date.now()) {
  const fatigue = Object.fromEntries(MUSCLES.map(m => [m, 0]));
  const cutoff = now - 4 * DAY_MS;
  for (const w of workouts) {
    const t = w.end || w.start;
    if (t < cutoff || t > now) continue;
    const hours = (now - t) / 3600000;
    for (const e of w.exercises) {
      const ex = EXERCISE_BY_ID[e.exId];
      if (!ex) continue;
      const n = e.sets.length;
      const add = (m, k) => {
        const decay = Math.max(0, 1 - hours / RECOVERY_HOURS[m]);
        fatigue[m] += n * k * decay * 12.5;
      };
      add(ex.muscle, 1);
      ex.secondary.forEach(m => add(m, 0.5));
    }
  }
  for (const m of MUSCLES) fatigue[m] = Math.min(100, Math.round(fatigue[m]));
  return fatigue;
}

export function recoveryMap(workouts, now = Date.now()) {
  const f = muscleFatigue(workouts, now);
  return Object.fromEntries(MUSCLES.map(m => [m, 100 - f[m]]));
}

export function averageRecovery(rec) {
  const vals = Object.values(rec);
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
}

/** Serie per muscolo in un intervallo (principale = 1, secondario = 0,5). */
export function setsPerMuscle(workouts, from, to = Date.now()) {
  const out = Object.fromEntries(MUSCLES.map(m => [m, 0]));
  for (const w of workouts) {
    if (w.start < from || w.start >= to) continue;
    for (const e of w.exercises) {
      const ex = EXERCISE_BY_ID[e.exId];
      if (!ex) continue;
      out[ex.muscle] += e.sets.length;
      ex.secondary.forEach(m => { out[m] += e.sets.length * 0.5; });
    }
  }
  for (const m of MUSCLES) out[m] = Math.round(out[m] * 10) / 10;
  return out;
}

export function lastTrainedByMuscle(workouts) {
  const out = {};
  for (const w of workouts) {
    for (const e of w.exercises) {
      const ex = EXERCISE_BY_ID[e.exId];
      if (!ex) continue;
      out[ex.muscle] = Math.max(out[ex.muscle] || 0, w.start);
    }
  }
  return out;
}

// ---------------------------------------------------------------- statistiche settimanali
export function weeklyStats(workouts, now = Date.now()) {
  const thisWeek = weekStart(now);
  const lastWeek = thisWeek - 7 * DAY_MS;
  const inRange = (a, b) => workouts.filter(w => w.start >= a && w.start < b);
  const cur = inRange(thisWeek, thisWeek + 7 * DAY_MS);
  // Confronto alla pari: la settimana scorsa fino allo stesso giorno e ora di oggi
  const prev = inRange(lastWeek, now - 7 * DAY_MS);
  const vol = list => list.reduce((s, w) => s + workoutVolume(w), 0);
  return {
    count: cur.length,
    volume: vol(cur),
    prevVolume: vol(prev),
    minutes: Math.round(cur.reduce((s, w) => s + ((w.end || w.start) - w.start), 0) / 60000)
  };
}

/** Volume per settimana, dalla più vecchia alla corrente. */
export function volumeByWeek(workouts, weeks = 8, now = Date.now()) {
  const cur = weekStart(now);
  const out = [];
  for (let i = weeks - 1; i >= 0; i--) {
    const a = cur - i * 7 * DAY_MS;
    const list = workouts.filter(w => w.start >= a && w.start < a + 7 * DAY_MS);
    out.push({ week: a, volume: list.reduce((s, w) => s + workoutVolume(w), 0), count: list.length });
  }
  return out;
}

/** Settimane consecutive (inclusa la corrente se già completata) con almeno `goal` allenamenti. */
export function weekStreak(workouts, goal, now = Date.now()) {
  if (!goal) return 0;
  const counts = {};
  for (const w of workouts) {
    const k = weekStart(w.start);
    counts[k] = (counts[k] || 0) + 1;
  }
  let week = weekStart(now);
  let streak = (counts[week] || 0) >= goal ? 1 : 0;
  week -= 7 * DAY_MS;
  while ((counts[week] || 0) >= goal) {
    streak++;
    week -= 7 * DAY_MS;
  }
  return streak;
}

/** Andamento del massimale stimato di un esercizio (miglior serie per seduta). */
export function exerciseHistory(workouts, exId) {
  const ex = EXERCISE_BY_ID[exId];
  const out = [];
  for (const w of workouts) {
    const e = w.exercises.find(x => x.exId === exId);
    if (!e || !e.sets.length) continue;
    const useReps = ex?.timed || (ex?.bw && e.sets.every(s => !s.w));
    const value = useReps ? Math.max(...e.sets.map(s => s.r || 0)) : Math.max(...e.sets.map(s => e1rm(s.w, s.r)));
    out.push({ date: w.start, value: Math.round(value * 10) / 10, reps: useReps });
  }
  return out;
}

// ---------------------------------------------------------------- nutrizione
// Fattori prudenti: le sedute di pesi consumano meno del cardio a parità di durata
const ACTIVITY = { 1: 1.375, 2: 1.375, 3: 1.375, 4: 1.465, 5: 1.55, 6: 1.55, 7: 1.55 };

/**
 * Obiettivi giornalieri: metabolismo basale Mifflin-St Jeor × attività,
 * -20% per dimagrire, +10% per la massa; proteine 2,0 g/kg (1,8 per fitness), grassi 25% kcal.
 */
export function nutritionTargets(profile) {
  const { sex, age, heightCm, weightKg, goal, daysPerWeek } = profile;
  if (!(age > 0 && heightCm > 0 && weightKg > 0)) return null;
  const bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + (sex === 'f' ? -161 : 5);
  const tdee = bmr * (ACTIVITY[daysPerWeek] || 1.375);
  const factor = goal === 'fat_loss' ? 0.8 : goal === 'muscle' ? 1.1 : 1;
  const kcal = Math.round(tdee * factor / 10) * 10;
  const protein = Math.round(weightKg * (goal === 'fitness' ? 1.8 : 2.0));
  const fat = Math.round(kcal * 0.25 / 9);
  const carbs = Math.max(0, Math.round((kcal - protein * 4 - fat * 9) / 4));
  const waterMl = Math.round(weightKg * 35 / 250) * 250;
  return { bmr: Math.round(bmr), tdee: Math.round(tdee), kcal, protein, carbs, fat, waterMl };
}

export function dayTotals(entries) {
  const t = { kcal: 0, p: 0, c: 0, f: 0 };
  for (const e of entries) {
    t.kcal += e.kcal || 0;
    t.p += e.p || 0;
    t.c += e.c || 0;
    t.f += e.f || 0;
  }
  return { kcal: Math.round(t.kcal), p: Math.round(t.p), c: Math.round(t.c), f: Math.round(t.f) };
}

export function foodPortion(food, grams) {
  const k = grams / 100;
  const r = v => Math.round(v * k * 10) / 10;
  return { kcal: Math.round(food.kcal * k), p: r(food.p), c: r(food.c), f: r(food.f) };
}

/** Calorie bruciate stimate: MET × peso × ore (MET 5 pesi, 8 circuito ad alta intensità). */
export function estimateKcal(workout, weightKg, highIntensity = false) {
  const hours = Math.max(0, ((workout.end || workout.start) - workout.start) / 3600000);
  return Math.round((highIntensity ? 8 : 5) * (weightKg || 70) * hours);
}

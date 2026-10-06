// Traguardi calcolati dai dati reali: nessun badge è sbloccato in partenza.
import { DAY_MS, weekStart, workoutVolume, exerciseHistory } from './calc.js';

export function bestWeekStreak(workouts, goal) {
  if (!goal || !workouts.length) return 0;
  const counts = {};
  for (const w of workouts) {
    const k = weekStart(w.start);
    counts[k] = (counts[k] || 0) + 1;
  }
  const weeks = Object.keys(counts).map(Number).sort((a, b) => a - b);
  let best = 0;
  let run = 0;
  let prev = null;
  for (const wk of weeks) {
    // Le settimane con l'ora legale possono durare ±1 h: tolleranza di 2 h
    const consecutive = prev !== null && Math.abs(wk - prev - 7 * DAY_MS) < 2 * 3600000;
    run = counts[wk] >= goal ? (consecutive ? run + 1 : 1) : 0;
    best = Math.max(best, run);
    prev = wk;
  }
  return best;
}

export function computeBadges({ profile, workouts, nutritionDays }) {
  const total = workouts.length;
  const volume = workouts.reduce((s, w) => s + workoutVolume(w), 0);
  const prs = workouts.reduce((s, w) => s + (w.prs?.length || 0), 0);
  const streak = bestWeekStreak(workouts, profile.daysPerWeek || 3);
  const foodDays = Object.values(nutritionDays || {}).filter(d => d.entries?.length).length;
  const benchBest = Math.max(0, ...exerciseHistory(workouts, 'bench_press').map(p => p.value));
  const squatBest = Math.max(0, ...exerciseHistory(workouts, 'back_squat').map(p => p.value));
  const bw = profile.weightKg || 0;

  const list = [
    ['first_workout', '⚡', total, 1],
    ['workouts_10', '🔟', total, 10],
    ['workouts_50', '🏅', total, 50],
    ['workouts_100', '💯', total, 100],
    ['first_pr', '📈', prs, 1],
    ['prs_25', '🚀', prs, 25],
    ['volume_10t', '🏋️', volume, 10000],
    ['volume_100t', '🏆', volume, 100000],
    ['streak_4', '🔥', streak, 4],
    ['streak_12', '🌋', streak, 12],
    ['food_7', '🥗', foodDays, 7],
    ['bench_bw', '💪', bw ? benchBest : 0, bw || Infinity],
    ['squat_15bw', '🦵', bw ? squatBest : 0, bw ? bw * 1.5 : Infinity]
  ];
  return list.map(([id, icon, value, target]) => ({
    id, icon,
    unlocked: value >= target,
    progress: Number.isFinite(target) ? Math.min(1, value / target) : 0
  }));
}

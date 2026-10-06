import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  oneRepMax, detectPRs, recoveryMap, nutritionTargets, weekStreak, weekStart, suggestNext,
  setsPerMuscle, foodPortion, DAY_MS, workoutVolume
} from '../src/logic/calc.js';
import { generateWorkout } from '../src/logic/generator.js';
import { matchTopic, buildInsights } from '../src/logic/coach.js';
import { computeBadges, bestWeekStreak } from '../src/logic/badges.js';
import { EXERCISES, EXERCISE_BY_ID, LANGS } from '../src/data/exercises.js';
import { PROGRAMS } from '../src/data/programs.js';
import { FOODS } from '../src/data/foods.js';

const NOW = new Date('2026-10-07T18:00:00').getTime(); // mercoledì
const wk = (daysAgo, exercises, minutes = 60) => {
  const start = NOW - daysAgo * DAY_MS;
  return { id: `w${daysAgo}`, start, end: start + minutes * 60000, exercises };
};

test('1RM: tre formule coerenti, 1 rip = peso', () => {
  assert.equal(oneRepMax(100, 1).avg, 100);
  const r = oneRepMax(100, 5);
  assert.ok(Math.abs(r.epley - 116.67) < 0.1);
  assert.ok(Math.abs(r.brzycki - 112.5) < 0.1);
  assert.ok(r.avg > 110 && r.avg < 118);
  assert.equal(oneRepMax(0, 5), null);
});

test('record: il primo allenamento non è un record, il secondo più pesante sì', () => {
  const a = wk(7, [{ exId: 'bench_press', sets: [{ w: 80, r: 5 }] }]);
  const b = wk(1, [{ exId: 'bench_press', sets: [{ w: 85, r: 5 }] }]);
  assert.deepEqual(detectPRs(a, []), []);
  const prs = detectPRs(b, [a]);
  assert.equal(prs.length, 1);
  assert.equal(prs[0].type, 'weight');
  assert.equal(prs[0].value, 85);
});

test('recupero: muscolo appena allenato affaticato, riposato dopo 4 giorni', () => {
  const w = wk(0.1, [{ exId: 'bench_press', sets: [{ w: 80, r: 8 }, { w: 80, r: 8 }, { w: 80, r: 8 }, { w: 80, r: 8 }] }]);
  const rec = recoveryMap([w], NOW);
  assert.ok(rec.chest < 60, `chest ${rec.chest}`);
  assert.ok(rec.triceps < 100 && rec.triceps > rec.chest);
  assert.equal(rec.quads, 100);
  assert.equal(recoveryMap([wk(4, w.exercises)], NOW).chest, 100);
});

test('volume: i tempi del plank non diventano chili', () => {
  const w = wk(1, [{ exId: 'plank', sets: [{ w: 0, r: 60 }] }, { exId: 'back_squat', sets: [{ w: 100, r: 5 }] }]);
  assert.equal(workoutVolume(w), 500);
});

test('serie per muscolo: secondari a metà', () => {
  const w = wk(1, [{ exId: 'bench_press', sets: [{ w: 60, r: 8 }, { w: 60, r: 8 }] }]);
  const s = setsPerMuscle([w], NOW - 7 * DAY_MS, NOW);
  assert.equal(s.chest, 2);
  assert.equal(s.triceps, 1);
});

test('obiettivi nutrizionali Mifflin-St Jeor', () => {
  const t = nutritionTargets({ sex: 'm', age: 30, heightCm: 180, weightKg: 80, goal: 'fitness', daysPerWeek: 3 });
  assert.equal(t.bmr, 1780);
  assert.ok(Math.abs(t.kcal - 2450) <= 10, `kcal ${t.kcal}`); // 1780 × 1,375
  assert.equal(t.protein, 144);
  const cut = nutritionTargets({ sex: 'm', age: 30, heightCm: 180, weightKg: 80, goal: 'fat_loss', daysPerWeek: 3 });
  assert.ok(cut.kcal < t.kcal);
  assert.equal(nutritionTargets({ sex: 'f' }), null);
});

test('porzione alimento', () => {
  const chicken = FOODS.find(f => f.id === 'chicken_breast');
  assert.deepEqual(foodPortion(chicken, 200), { kcal: 330, p: 62, c: 0, f: 7.2 });
});

test('streak settimanale', () => {
  const ws = [wk(0, []), wk(1, []), wk(8, []), wk(9, []), wk(15, []), wk(16, [])];
  assert.equal(weekStart(NOW), new Date('2026-10-05T00:00:00').getTime());
  assert.equal(weekStreak(ws, 2, NOW), 3);
  assert.equal(weekStreak(ws, 3, NOW), 0);
  assert.equal(bestWeekStreak(ws, 2), 3);
});

test('sovraccarico progressivo', () => {
  const ws = [wk(3, [{ exId: 'bench_press', sets: [{ w: 80, r: 8 }, { w: 80, r: 8 }] }])];
  assert.deepEqual(suggestNext(ws, 'bench_press', 8), { w: 82.5, r: 8, increase: true });
  assert.deepEqual(suggestNext(ws, 'bench_press', 10), { w: 80, r: 10, increase: false });
  assert.equal(suggestNext(ws, 'back_squat', 5), null);
});

test('generatore: a casa senza attrezzi solo corpo libero, evita i muscoli stanchi', () => {
  const profile = { goal: 'muscle', level: 1, location: 'home', equipment: [], daysPerWeek: 3 };
  const tiredLegs = wk(0.2, [{ exId: 'bodyweight_squat', sets: Array(10).fill({ w: 0, r: 20 }) }]);
  const g = generateWorkout(profile, [tiredLegs], { minutes: 45, now: NOW, rng: () => 0 });
  assert.equal(g.items.length, 5);
  for (const it of g.items) assert.equal(EXERCISE_BY_ID[it.exId].equipment, 'bodyweight');
  assert.notEqual(g.template, 'legs');
  assert.ok(!g.items.some(it => EXERCISE_BY_ID[it.exId].muscle === 'quads'));
});

test('coach: riconosce gli argomenti e non indovina', () => {
  assert.equal(matchTopic('Quanto riposo tra le serie?'), 'rest');
  assert.equal(matchTopic('How much protein should I eat?'), 'protein');
  assert.equal(matchTopic('Wie oft pro Woche trainieren?'), 'frequency');
  assert.equal(matchTopic('Me duele el hombro, lesión?'), 'pain');
  assert.equal(matchTopic('Je veux maigrir'), 'fatloss');
  assert.equal(matchTopic('massimale di stacco'), 'deadlift');
  assert.equal(matchTopic('dormire bene aiuta?'), 'sleep');
  assert.equal(matchTopic('qual è la capitale della Francia'), null);
});

test('coach: senza allenamenti suggerisce il primo, niente dati inventati', () => {
  const ins = buildInsights({ profile: { daysPerWeek: 3 }, workouts: [], nutritionDays: {} }, NOW);
  assert.deepEqual(ins.map(i => i.id), ['first_workout']);
});

test('badge: nessuno sbloccato senza dati', () => {
  const b = computeBadges({ profile: { weightKg: 80, daysPerWeek: 3 }, workouts: [], nutritionDays: {} });
  assert.ok(b.every(x => !x.unlocked));
});

test('dati: traduzioni complete e riferimenti validi', () => {
  for (const e of EXERCISES) for (const l of LANGS) {
    assert.ok(e.name[l], `nome ${e.id}.${l}`);
    assert.ok(e.steps[l], `istruzioni ${e.id}.${l}`);
  }
  for (const p of PROGRAMS) {
    for (const l of LANGS) assert.ok(p.name[l] && p.desc[l], `scheda ${p.id}.${l}`);
    for (const it of p.items) assert.ok(EXERCISE_BY_ID[it.exId], `esercizio ${it.exId} in ${p.id}`);
  }
  for (const f of FOODS) for (const l of LANGS) assert.ok(f.name[l], `alimento ${f.id}.${l}`);
  assert.equal(new Set(EXERCISES.map(e => e.id)).size, EXERCISES.length);
});

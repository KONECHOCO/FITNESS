// Smart Coach: analisi dei dati reali dell'utente + risposte da una base di conoscenza curata.
// Non è un modello di linguaggio: niente risposte inventate. Se la domanda non è riconosciuta lo dice.
import { EXERCISE_BY_ID, MUSCLES } from '../data/exercises.js';
import {
  DAY_MS, weeklyStats, setsPerMuscle, lastTrainedByMuscle, exerciseHistory,
  recoveryMap, nutritionTargets, dayTotals, dayKey
} from './calc.js';
import { pickTemplate } from './generator.js';

// ---------------------------------------------------------------- insight dai dati
export function buildInsights({ profile, workouts, nutritionDays }, now = Date.now()) {
  const out = [];
  if (!workouts.length) {
    out.push({ id: 'first_workout', tone: 'info' });
    return out;
  }
  const goal = profile.daysPerWeek || 3;
  const week = weeklyStats(workouts, now);
  out.push({ id: week.count >= goal ? 'goal_done' : 'goal_progress', tone: week.count >= goal ? 'good' : 'info', params: { n: week.count, goal } });

  const rec = recoveryMap(workouts, now);
  const tired = MUSCLES.filter(m => rec[m] < 50);
  if (tired.length) out.push({ id: 'fatigued', tone: 'warn', params: { muscles: tired } });

  // Progressi e stalli sugli esercizi con almeno 3 sedute
  const exIds = [...new Set(workouts.flatMap(w => w.exercises.map(e => e.exId)))];
  let bestGain = null;
  const stalls = [];
  for (const id of exIds) {
    const h = exerciseHistory(workouts, id);
    if (h.length < 3) continue;
    const recent = h.filter(p => p.date >= now - 35 * DAY_MS);
    if (recent.length >= 2) {
      const gain = (recent[recent.length - 1].value - recent[0].value) / recent[0].value;
      if (gain > 0.02 && (!bestGain || gain > bestGain.gain)) bestGain = { exId: id, gain, from: recent[0].value, to: recent[recent.length - 1].value, reps: recent[0].reps };
    }
    const last3 = h.slice(-3);
    const peakBefore = Math.max(...h.slice(0, -2).map(p => p.value));
    if (!last3[0].reps && Math.max(last3[1].value, last3[2].value) <= peakBefore * 1.01) stalls.push(id);
  }
  if (bestGain) out.push({ id: 'progress', tone: 'good', params: { exId: bestGain.exId, pct: Math.round(bestGain.gain * 100), from: bestGain.from, to: bestGain.to, reps: bestGain.reps } });
  if (stalls.length) out.push({ id: 'stall', tone: 'warn', params: { exId: stalls[0] } });

  // Volume settimanale per muscolo (linee guida: ~10–20 serie per muscolo a settimana per l'ipertrofia)
  const firstWorkout = Math.min(...workouts.map(w => w.start));
  if (now - firstWorkout >= 7 * DAY_MS && (profile.goal === 'muscle' || profile.goal === 'strength')) {
    const sets = setsPerMuscle(workouts, now - 7 * DAY_MS, now);
    const low = ['chest', 'back', 'shoulders', 'quads', 'hamstrings', 'glutes'].filter(m => sets[m] < 6);
    if (low.length) out.push({ id: 'low_volume', tone: 'info', params: { muscles: low } });
  }

  if (now - firstWorkout >= 14 * DAY_MS) {
    const last = lastTrainedByMuscle(workouts);
    const forgotten = ['chest', 'back', 'shoulders', 'quads', 'hamstrings'].filter(m => !last[m] || now - last[m] > 8 * DAY_MS);
    if (forgotten.length) out.push({ id: 'neglected', tone: 'info', params: { muscles: forgotten } });
  }

  // Proteine: media degli ultimi 7 giorni in cui è stato registrato almeno un alimento
  const targets = nutritionTargets(profile);
  if (targets) {
    const logged = [];
    for (let i = 0; i < 7; i++) {
      const d = nutritionDays[dayKey(now - i * DAY_MS)];
      if (d && d.entries.length) logged.push(dayTotals(d.entries).p);
    }
    if (logged.length >= 3) {
      const avg = Math.round(logged.reduce((a, b) => a + b, 0) / logged.length);
      out.push({ id: avg >= targets.protein * 0.85 ? 'protein_ok' : 'protein_low', tone: avg >= targets.protein * 0.85 ? 'good' : 'warn', params: { avg, target: targets.protein } });
    }
  }

  if (week.prevVolume > 0 && week.volume > 0) {
    const pct = Math.round((week.volume - week.prevVolume) / week.prevVolume * 100);
    out.push({ id: 'volume_trend', tone: pct >= 0 ? 'good' : 'info', params: { pct, volume: week.volume } });
  }
  return out;
}

// ---------------------------------------------------------------- domande e risposte
// Parole chiave normalizzate (minuscole, senza accenti). "*" finale = prefisso di parola.
const TOPICS = {
  summary: ['come sto andando', 'progressi', 'riepilogo', 'how am i doing', 'my progress', 'summary', 'como voy', 'mi progreso', 'resumen', 'comment je progresse', 'mes progres', 'bilan', 'fortschritt*', 'wie stehe', 'zusammenfassung', 'como estou', 'meu progresso', 'resumo', 'statistich*', 'stats'],
  today: ['oggi', 'today', 'hoy', 'aujourd*', 'heute', 'hoje', 'cosa allen*', 'what should i train', 'que entreno', 'que entrenar', 'quoi travailler', 'was trainieren', 'o que treinar'],
  rest: ['riposo', 'recupero tra', 'pausa', 'pause', 'rest', 'descanso', 'repos', 'intervalo', 'between sets', 'tra le serie', 'entre series', 'entre les series', 'zwischen den satzen', 'entre series'],
  reps: ['ripetizion*', 'rep', 'reps', 'ipertrofia', 'hypertroph*', 'repeticion*', 'repetition*', 'wiederholung*', 'muskelaufbau', 'hipertrofia', 'muscle growth', 'crescita muscolare', 'range'],
  strength: ['forza', 'strength', 'stronger', 'fuerza', 'force', 'kraft', 'forca', 'massimale', '1rm', 'max'],
  overload: ['sovraccarico', 'overload', 'aumentare il peso', 'aumentare peso', 'increase weight', 'add weight', 'sobrecarga', 'surcharge', 'progressiv*', 'progression', 'quando aumentare', 'when to increase'],
  plateau: ['stallo', 'plateau', 'estancad*', 'stagn*', 'bloccato', 'stuck', 'estagn*', 'non miglioro', 'not improving', 'no mejoro'],
  deload: ['scarico', 'deload', 'descarga', 'decharge', 'entlastung*'],
  frequency: ['frequenza', 'quante volte', 'how often', 'how many times', 'frecuencia', 'cuantas veces', 'frequence', 'combien de fois', 'wie oft', 'haufigkeit', 'frequencia', 'quantas vezes', 'giorni a settimana', 'days a week', 'dias a la semana', 'jours par semaine', 'tage pro woche', 'dias por semana'],
  protein: ['protein*', 'whey'],
  meal: ['prima dell allenamento', 'dopo l allenamento', 'pre workout', 'post workout', 'preworkout', 'postworkout', 'pre-workout', 'post-workout', 'antes de entrenar', 'despues de entrenar', 'avant l entrainement', 'apres l entrainement', 'vor dem training', 'nach dem training', 'antes do treino', 'depois do treino', 'mangiare', 'eat', 'comer', 'manger', 'essen', 'pasto', 'meal', 'comida', 'repas', 'mahlzeit*', 'refeica*'],
  fatloss: ['dimagr*', 'perdere peso', 'grasso', 'lose weight', 'fat loss', 'lose fat', 'burn fat', 'adelgaz*', 'perder peso', 'grasa', 'maigrir', 'perdre du poids', 'graisse', 'abnehmen', 'fett*', 'emagrec*', 'gordura', 'definizione', 'cutting', 'deficit', 'deficit calorico'],
  bulk: ['massa', 'bulk*', 'volumen', 'prise de masse', 'masseaufbau', 'ganhar massa', 'surplus', 'aumentare di peso', 'gain weight', 'ganar peso', 'prendre du poids', 'zunehmen', 'ganhar peso', 'superavit'],
  warmup: ['riscaldamento', 'riscaldarsi', 'warm up', 'warmup', 'warm-up', 'calentamiento', 'calentar', 'echauffement', 'aufwarm*', 'aquecimento', 'aquecer'],
  doms: ['indolenziment*', 'doms', 'sore', 'soreness', 'agujetas', 'courbatures', 'muskelkater', 'dor muscular', 'dolori muscolari', 'dolore muscolare'],
  sleep: ['sonno', 'dormire', 'sleep', 'sueno', 'dormir', 'sommeil', 'schlaf*', 'sono'],
  cardio: ['cardio', 'corsa', 'correre', 'running', 'run', 'correr', 'courir', 'course', 'laufen', 'joggen', 'corrida', 'aerobic*', 'aerobico'],
  creatine: ['creatin*', 'kreatin*'],
  home: ['casa', 'home', 'sin material', 'maison', 'zuhause', 'sem equipamento', 'corpo libero', 'bodyweight', 'senza attrezzi', 'no equipment', 'sans materiel', 'ohne gerate'],
  beginner: ['principiante', 'beginner', 'iniziare', 'inizio', 'start', 'empezar', 'debutant', 'commencer', 'anfanger', 'iniciante', 'comecar', 'novice'],
  bench: ['panca', 'bench', 'banca', 'couche', 'bankdruck*', 'supino'],
  squat: ['squat', 'sentadilla', 'kniebeuge', 'agachamento'],
  deadlift: ['stacco', 'deadlift', 'peso muerto', 'souleve', 'kreuzheben', 'levantamento terra'],
  pain: ['dolore', 'male a', 'mi fa male', 'infortun*', 'pain', 'hurt*', 'injur*', 'lesion*', 'douleur', 'blessure', 'schmerz*', 'verletz*', 'dor', 'lesao', 'tendin*']
};

export function normalize(text) {
  return text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9\s-]/g, ' ').replace(/\s+/g, ' ').trim();
}

export function matchTopic(text) {
  const norm = normalize(text);
  const tokens = norm.split(' ');
  let best = null;
  let bestScore = 0;
  for (const [topic, keys] of Object.entries(TOPICS)) {
    let score = 0;
    for (const k of keys) {
      if (k.includes(' ')) {
        if (` ${norm} `.includes(` ${k} `)) score += 2;
      } else if (k.endsWith('*')) {
        const stem = k.slice(0, -1);
        if (tokens.some(t => t.startsWith(stem))) score += 1;
      } else if (tokens.includes(k)) {
        score += 1;
      }
    }
    // Le domande su dolore/infortuni hanno sempre la precedenza
    if (topic === 'pain' && score > 0) score += 10;
    // Un esercizio specifico è più informativo di un tema generico ("massimale di stacco" → stacco)
    if ((topic === 'bench' || topic === 'squat' || topic === 'deadlift') && score > 0) score += 0.5;
    if (score > bestScore) {
      best = topic;
      bestScore = score;
    }
  }
  return best;
}

/** Parametri personalizzati da inserire nelle risposte. */
export function answerParams(topic, { profile, workouts }, now = Date.now()) {
  const kg = profile.weightKg || 70;
  const targets = nutritionTargets(profile);
  const p = {
    protMin: Math.round(kg * 1.6),
    protMax: Math.round(kg * 2.2),
    kcal: targets?.kcal,
    tdee: targets?.tdee,
    deficit: targets ? Math.round(targets.tdee * 0.8 / 10) * 10 : null,
    surplus: targets ? Math.round(targets.tdee * 1.1 / 10) * 10 : null,
    creatine: 3
  };
  if (topic === 'summary') {
    const w = weeklyStats(workouts, now);
    p.count = w.count;
    p.goal = profile.daysPerWeek || 3;
    p.volume = w.volume;
    p.total = workouts.length;
    p.trend = w.prevVolume ? Math.round((w.volume - w.prevVolume) / w.prevVolume * 100) : null;
  }
  if (topic === 'today') {
    const rec = recoveryMap(workouts, now);
    p.template = pickTemplate(profile, rec).key;
    p.fresh = MUSCLES.filter(m => rec[m] >= 90);
    p.tired = MUSCLES.filter(m => rec[m] < 50);
  }
  if (topic === 'bench' || topic === 'squat' || topic === 'deadlift') {
    const id = { bench: 'bench_press', squat: 'back_squat', deadlift: 'deadlift' }[topic];
    const h = exerciseHistory(workouts, id);
    p.e1rm = h.length ? Math.max(...h.map(x => x.value)) : null;
    p.name = EXERCISE_BY_ID[id];
  }
  return p;
}

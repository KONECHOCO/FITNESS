// Schede predefinite. Testi nell'ordine: it, en, es, fr, de, pt.
import { LANGS } from './exercises.js';

const L = arr => Object.fromEntries(LANGS.map((l, i) => [l, arr[i]]));

// item: [exerciseId, sets, reps, restSec]
function program(id, place, level, goal, name, desc, items) {
  return {
    id, place, level, goal, preset: true,
    name: L(name), desc: L(desc),
    items: items.map(([exId, sets, reps, rest]) => ({ exId, sets, reps, rest }))
  };
}

export const PROGRAMS = [
  program('full_body_gym', 'gym', 1, 'muscle',
    ['Full body principiante', 'Beginner full body', 'Cuerpo completo principiante', 'Full body débutant', 'Ganzkörper Einsteiger', 'Corpo inteiro iniciante'],
    ['Tutto il corpo in una seduta, 2–3 volte a settimana.', 'The whole body in one session, 2–3 times a week.', 'Todo el cuerpo en una sesión, 2–3 veces por semana.', 'Tout le corps en une séance, 2 à 3 fois par semaine.', 'Der ganze Körper in einer Einheit, 2–3 Mal pro Woche.', 'O corpo todo em uma sessão, 2–3 vezes por semana.'],
    [['goblet_squat', 3, 10, 90], ['db_bench_press', 3, 10, 90], ['lat_pulldown', 3, 10, 90], ['db_shoulder_press', 3, 10, 75], ['leg_curl', 3, 12, 60], ['plank', 3, 40, 45]]),
  program('push', 'gym', 2, 'muscle',
    ['Push – Petto, spalle, tricipiti', 'Push – Chest, shoulders, triceps', 'Empuje – Pecho, hombros, tríceps', 'Push – Pecs, épaules, triceps', 'Push – Brust, Schultern, Trizeps', 'Push – Peito, ombros, tríceps'],
    ['Primo giorno della divisione Push/Pull/Legs.', 'Day one of a Push/Pull/Legs split.', 'Primer día de la rutina Empuje/Tirón/Piernas.', 'Premier jour du split Push/Pull/Legs.', 'Tag 1 des Push/Pull/Legs-Splits.', 'Primeiro dia da divisão Push/Pull/Legs.'],
    [['bench_press', 4, 8, 150], ['incline_db_press', 3, 10, 105], ['db_shoulder_press', 3, 10, 90], ['lateral_raise', 3, 15, 60], ['triceps_pushdown', 3, 12, 60], ['overhead_triceps_ext', 3, 12, 60]]),
  program('pull', 'gym', 2, 'muscle',
    ['Pull – Dorso e bicipiti', 'Pull – Back and biceps', 'Tirón – Espalda y bíceps', 'Pull – Dos et biceps', 'Pull – Rücken und Bizeps', 'Pull – Costas e bíceps'],
    ['Secondo giorno della divisione Push/Pull/Legs.', 'Day two of a Push/Pull/Legs split.', 'Segundo día de la rutina Empuje/Tirón/Piernas.', 'Deuxième jour du split Push/Pull/Legs.', 'Tag 2 des Push/Pull/Legs-Splits.', 'Segundo dia da divisão Push/Pull/Legs.'],
    [['barbell_row', 4, 8, 120], ['lat_pulldown', 3, 10, 90], ['seated_cable_row', 3, 12, 90], ['face_pull', 3, 15, 60], ['barbell_curl', 3, 10, 60], ['hammer_curl', 3, 12, 60]]),
  program('legs', 'gym', 2, 'muscle',
    ['Legs – Gambe complete', 'Legs – Full leg day', 'Piernas completas', 'Legs – Jambes complètes', 'Legs – Beine komplett', 'Legs – Pernas completas'],
    ['Terzo giorno della divisione Push/Pull/Legs.', 'Day three of a Push/Pull/Legs split.', 'Tercer día de la rutina Empuje/Tirón/Piernas.', 'Troisième jour du split Push/Pull/Legs.', 'Tag 3 des Push/Pull/Legs-Splits.', 'Terceiro dia da divisão Push/Pull/Legs.'],
    [['back_squat', 4, 6, 180], ['romanian_deadlift', 3, 10, 120], ['leg_press', 3, 12, 120], ['leg_curl', 3, 12, 60], ['standing_calf_raise', 4, 12, 60], ['hanging_leg_raise', 3, 10, 60]]),
  program('upper', 'gym', 2, 'muscle',
    ['Upper – Parte superiore', 'Upper body', 'Tren superior', 'Haut du corps', 'Oberkörper', 'Membros superiores'],
    ['Da alternare con "Lower", 4 sedute a settimana.', 'Alternate with "Lower", 4 sessions a week.', 'Altérnala con "Tren inferior", 4 sesiones por semana.', 'À alterner avec « Bas du corps », 4 séances par semaine.', 'Im Wechsel mit „Unterkörper“, 4 Einheiten pro Woche.', 'Alterne com "Membros inferiores", 4 sessões por semana.'],
    [['bench_press', 4, 8, 150], ['barbell_row', 4, 8, 120], ['overhead_press', 3, 8, 120], ['lat_pulldown', 3, 10, 90], ['db_curl', 3, 12, 60], ['triceps_pushdown', 3, 12, 60]]),
  program('lower', 'gym', 2, 'muscle',
    ['Lower – Parte inferiore', 'Lower body', 'Tren inferior', 'Bas du corps', 'Unterkörper', 'Membros inferiores'],
    ['Da alternare con "Upper", 4 sedute a settimana.', 'Alternate with "Upper", 4 sessions a week.', 'Altérnala con "Tren superior", 4 sesiones por semana.', 'À alterner avec « Haut du corps », 4 séances par semaine.', 'Im Wechsel mit „Oberkörper“, 4 Einheiten pro Woche.', 'Alterne com "Membros superiores", 4 sessões por semana.'],
    [['back_squat', 4, 6, 180], ['romanian_deadlift', 3, 8, 120], ['bulgarian_split_squat', 3, 10, 90], ['leg_extension', 3, 12, 60], ['standing_calf_raise', 3, 15, 60], ['plank', 3, 45, 45]]),
  program('strength_5x5', 'gym', 2, 'strength',
    ['Forza 5×5', 'Strength 5×5', 'Fuerza 5×5', 'Force 5×5', 'Kraft 5×5', 'Força 5×5'],
    ['Pochi esercizi fondamentali, carichi pesanti, recuperi lunghi.', 'A few big lifts, heavy loads, long rests.', 'Pocos ejercicios básicos, cargas pesadas y descansos largos.', 'Quelques mouvements de base, charges lourdes, longs repos.', 'Wenige Grundübungen, schwere Lasten, lange Pausen.', 'Poucos exercícios básicos, cargas pesadas e descansos longos.'],
    [['back_squat', 5, 5, 180], ['bench_press', 5, 5, 180], ['barbell_row', 5, 5, 150], ['overhead_press', 3, 5, 150], ['deadlift', 1, 5, 180]]),
  program('glutes_legs', 'gym', 1, 'muscle',
    ['Glutei e gambe', 'Glutes and legs', 'Glúteos y piernas', 'Fessiers et jambes', 'Po und Beine', 'Glúteos e pernas'],
    ['Focus su glutei e femorali.', 'Focus on glutes and hamstrings.', 'Enfoque en glúteos e isquiotibiales.', 'Accent sur les fessiers et les ischios.', 'Fokus auf Gesäß und Beinbeuger.', 'Foco em glúteos e posteriores de coxa.'],
    [['hip_thrust', 4, 10, 105], ['romanian_deadlift', 3, 10, 120], ['bulgarian_split_squat', 3, 10, 90], ['leg_curl', 3, 12, 60], ['glute_bridge', 3, 15, 45]]),
  program('home_full_body', 'home', 1, 'fitness',
    ['Casa – Corpo libero', 'Home – Bodyweight', 'Casa – Peso corporal', 'Maison – Poids du corps', 'Zuhause – Eigengewicht', 'Casa – Peso corporal'],
    ['Nessun attrezzo: serve solo un tavolo robusto o una sbarra.', 'No equipment: you only need a sturdy table or a bar.', 'Sin material: solo una mesa firme o una barra.', 'Sans matériel : une table solide ou une barre suffit.', 'Keine Geräte: nur ein stabiler Tisch oder eine Stange.', 'Sem equipamentos: só uma mesa firme ou uma barra.'],
    [['bodyweight_squat', 3, 20, 60], ['push_up', 3, 12, 60], ['inverted_row', 3, 10, 60], ['walking_lunge', 3, 12, 60], ['pike_push_up', 3, 8, 60], ['glute_bridge', 3, 15, 45], ['plank', 3, 40, 45]]),
  program('home_dumbbell', 'home', 1, 'muscle',
    ['Casa – Manubri', 'Home – Dumbbells', 'Casa – Mancuernas', 'Maison – Haltères', 'Zuhause – Kurzhanteln', 'Casa – Halteres'],
    ['Allenamento completo con un paio di manubri e una panca o sedia.', 'A full workout with a pair of dumbbells and a bench or chair.', 'Entreno completo con un par de mancuernas y un banco o silla.', 'Séance complète avec deux haltères et un banc ou une chaise.', 'Komplettes Training mit zwei Kurzhanteln und einer Bank oder einem Stuhl.', 'Treino completo com um par de halteres e um banco ou cadeira.'],
    [['goblet_squat', 3, 12, 75], ['db_bench_press', 3, 10, 75], ['db_row', 3, 10, 75], ['db_shoulder_press', 3, 10, 75], ['bulgarian_split_squat', 3, 10, 75], ['db_curl', 2, 12, 45], ['overhead_triceps_ext', 2, 12, 45]]),
  program('home_hiit', 'home', 2, 'fat_loss',
    ['Casa – Brucia grassi', 'Home – Fat burner', 'Casa – Quema grasa', 'Maison – Brûle-graisse', 'Zuhause – Fettverbrenner', 'Casa – Queima de gordura'],
    ['Circuito a corpo libero ad alta intensità con recuperi brevi.', 'High-intensity bodyweight circuit with short rests.', 'Circuito de alta intensidad sin material y descansos cortos.', 'Circuit au poids du corps à haute intensité, repos courts.', 'Hochintensiver Zirkel mit Eigengewicht und kurzen Pausen.', 'Circuito de alta intensidade sem equipamentos e descansos curtos.'],
    [['burpee', 4, 10, 40], ['jump_squat', 4, 12, 40], ['mountain_climber', 4, 30, 30], ['push_up', 3, 12, 40], ['walking_lunge', 3, 12, 40], ['plank', 3, 40, 30]]),
  program('core', 'home', 1, 'fitness',
    ['Addome e core', 'Abs and core', 'Abdomen y core', 'Abdos et gainage', 'Bauch und Rumpf', 'Abdômen e core'],
    ['15 minuti per un core forte e stabile.', '15 minutes for a strong, stable core.', '15 minutos para un core fuerte y estable.', '15 minutes pour une sangle abdominale solide.', '15 Minuten für einen starken, stabilen Rumpf.', '15 minutos para um core forte e estável.'],
    [['crunch', 3, 20, 30], ['russian_twist', 3, 20, 30], ['dead_bug', 3, 12, 30], ['side_plank', 2, 30, 30], ['plank', 3, 45, 30]])
];

export const PROGRAM_BY_ID = Object.fromEntries(PROGRAMS.map(p => [p.id, p]));

// Fonti scientifiche delle raccomandazioni mostrate nell'app (linea guida App Store 1.4.1).
// "about" spiega a cosa serve la fonte, nelle lingue: it, en, es, fr, de, pt.
import { LANGS } from './exercises.js';

const L = arr => Object.fromEntries(LANGS.map((l, i) => [l, arr[i]]));

function src(id, cite, url, about) {
  return { id, cite, url, about: L(about) };
}

export const SOURCES = [
  src('mifflin', 'Mifflin MD, St Jeor ST, et al. A new predictive equation for resting energy expenditure in healthy individuals. Am J Clin Nutr. 1990;51(2):241-247.',
    'https://pubmed.ncbi.nlm.nih.gov/2305711/',
    ['Metabolismo basale e calorie giornaliere', 'Resting metabolic rate and daily calories', 'Metabolismo basal y calorías diarias', 'Métabolisme de base et calories quotidiennes', 'Grundumsatz und Tageskalorien', 'Metabolismo basal e calorias diárias']),
  src('fao', 'FAO/WHO/UNU. Human energy requirements. Report of a Joint FAO/WHO/UNU Expert Consultation. Rome; 2004.',
    'https://www.fao.org/4/y5686e/y5686e00.htm',
    ['Fattori di attività fisica (fabbisogno energetico)', 'Physical activity factors (energy requirements)', 'Factores de actividad física (necesidades energéticas)', 'Facteurs d\'activité physique (besoins énergétiques)', 'Aktivitätsfaktoren (Energiebedarf)', 'Fatores de atividade física (necessidades energéticas)']),
  src('efsa_water', 'EFSA Panel on Dietetic Products, Nutrition and Allergies. Scientific Opinion on Dietary Reference Values for water. EFSA Journal. 2010;8(3):1459.',
    'https://www.efsa.europa.eu/en/efsajournal/pub/1459',
    ['Obiettivo di acqua giornaliero (2,5 L uomini, 2,0 L donne)', 'Daily water target (2.5 L men, 2.0 L women)', 'Objetivo diario de agua (2,5 L hombres, 2,0 L mujeres)', 'Objectif d\'eau quotidien (2,5 L hommes, 2,0 L femmes)', 'Tägliches Wasserziel (2,5 L Männer, 2,0 L Frauen)', 'Meta diária de água (2,5 L homens, 2,0 L mulheres)']),
  src('issn_protein', 'Jäger R, Kerksick CM, Campbell BI, et al. International Society of Sports Nutrition Position Stand: protein and exercise. J Int Soc Sports Nutr. 2017;14:20.',
    'https://jissn.biomedcentral.com/articles/10.1186/s12970-017-0177-8',
    ['Fabbisogno di proteine (1,4–2,0 g/kg e oltre) e distribuzione nei pasti', 'Protein needs (1.4–2.0 g/kg and above) and meal distribution', 'Necesidades de proteína (1,4–2,0 g/kg o más) y reparto en comidas', 'Besoins en protéines (1,4–2,0 g/kg et plus) et répartition dans les repas', 'Proteinbedarf (1,4–2,0 g/kg und mehr) und Verteilung auf Mahlzeiten', 'Necessidade de proteína (1,4–2,0 g/kg ou mais) e distribuição nas refeições']),
  src('morton', 'Morton RW, Murphy KT, McKellar SR, et al. A systematic review, meta-analysis and meta-regression of the effect of protein supplementation on resistance training-induced gains in muscle mass and strength. Br J Sports Med. 2018;52(6):376-384.',
    'https://pubmed.ncbi.nlm.nih.gov/28698222/',
    ['Proteine fino a ~1,6–2,2 g/kg per la massa muscolare', 'Protein up to ~1.6–2.2 g/kg for muscle gain', 'Proteína hasta ~1,6–2,2 g/kg para ganar músculo', 'Protéines jusqu\'à ~1,6–2,2 g/kg pour la prise de muscle', 'Protein bis ~1,6–2,2 g/kg für Muskelaufbau', 'Proteína até ~1,6–2,2 g/kg para ganho muscular']),
  src('helms', 'Helms ER, Aragon AA, Fitschen PJ. Evidence-based recommendations for natural bodybuilding contest preparation: nutrition and supplementation. J Int Soc Sports Nutr. 2014;11:20.',
    'https://jissn.biomedcentral.com/articles/10.1186/1550-2783-11-20',
    ['Deficit calorico, perdita di peso 0,5–1% a settimana, ripartizione dei grassi', 'Calorie deficit, 0.5–1% weight loss per week, fat intake', 'Déficit calórico, pérdida de 0,5–1% del peso por semana, grasas', 'Déficit calorique, perte de 0,5–1 % du poids par semaine, lipides', 'Kaloriendefizit, 0,5–1 % Gewichtsverlust pro Woche, Fettzufuhr', 'Déficit calórico, perda de 0,5–1% do peso por semana, gorduras']),
  src('issn_timing', 'Kerksick CM, Arent S, Schoenfeld BJ, et al. International Society of Sports Nutrition position stand: nutrient timing. J Int Soc Sports Nutr. 2017;14:33.',
    'https://jissn.biomedcentral.com/articles/10.1186/s12970-017-0189-4',
    ['Pasti prima e dopo l\'allenamento', 'Pre- and post-workout meals', 'Comidas antes y después de entrenar', 'Repas avant et après l\'entraînement', 'Mahlzeiten vor und nach dem Training', 'Refeições antes e depois do treino']),
  src('issn_creatine', 'Kreider RB, Kalman DS, Antonio J, et al. International Society of Sports Nutrition position stand: safety and efficacy of creatine supplementation in exercise, sport, and medicine. J Int Soc Sports Nutr. 2017;14:18.',
    'https://jissn.biomedcentral.com/articles/10.1186/s12970-017-0173-z',
    ['Creatina monoidrato (3–5 g al giorno)', 'Creatine monohydrate (3–5 g per day)', 'Creatina monohidrato (3–5 g al día)', 'Créatine monohydrate (3–5 g par jour)', 'Kreatin-Monohydrat (3–5 g pro Tag)', 'Creatina monoidratada (3–5 g por dia)']),
  src('acsm', 'American College of Sports Medicine. Position stand: Progression models in resistance training for healthy adults. Med Sci Sports Exerc. 2009;41(3):687-708.',
    'https://pubmed.ncbi.nlm.nih.gov/19204579/',
    ['Ripetizioni, carichi, recuperi, sovraccarico progressivo, 48–72 h tra sedute dello stesso muscolo', 'Reps, loads, rest, progressive overload, 48–72 h between sessions for a muscle', 'Repeticiones, cargas, descansos, sobrecarga progresiva, 48–72 h entre sesiones del mismo músculo', 'Répétitions, charges, repos, surcharge progressive, 48–72 h entre séances d\'un même muscle', 'Wiederholungen, Lasten, Pausen, progressive Überlastung, 48–72 h zwischen Einheiten eines Muskels', 'Repetições, cargas, descansos, sobrecarga progressiva, 48–72 h entre sessões do mesmo músculo']),
  src('schoenfeld_volume', 'Schoenfeld BJ, Ogborn D, Krieger JW. Dose-response relationship between weekly resistance training volume and increases in muscle mass: a systematic review and meta-analysis. J Sports Sci. 2017;35(11):1073-1082.',
    'https://pubmed.ncbi.nlm.nih.gov/27433992/',
    ['Serie settimanali per muscolo (volume di allenamento)', 'Weekly sets per muscle (training volume)', 'Series semanales por músculo (volumen)', 'Séries hebdomadaires par muscle (volume)', 'Wöchentliche Sätze pro Muskel (Volumen)', 'Séries semanais por músculo (volume)']),
  src('schoenfeld_freq', 'Schoenfeld BJ, Ogborn D, Krieger JW. Effects of resistance training frequency on measures of muscle hypertrophy: a systematic review and meta-analysis. Sports Med. 2016;46(11):1689-1697.',
    'https://pubmed.ncbi.nlm.nih.gov/27102172/',
    ['Frequenza di allenamento (2 volte a settimana per muscolo)', 'Training frequency (twice a week per muscle)', 'Frecuencia de entrenamiento (2 veces por semana por músculo)', 'Fréquence d\'entraînement (2 fois par semaine par muscle)', 'Trainingshäufigkeit (2-mal pro Woche pro Muskel)', 'Frequência de treino (2 vezes por semana por músculo)']),
  src('schoenfeld_rest', 'Schoenfeld BJ, Pope ZK, Benik FM, et al. Longer interset rest periods enhance muscle strength and hypertrophy in resistance-trained men. J Strength Cond Res. 2016;30(7):1805-1812.',
    'https://pubmed.ncbi.nlm.nih.gov/26605807/',
    ['Recupero tra le serie', 'Rest between sets', 'Descanso entre series', 'Repos entre les séries', 'Pausen zwischen den Sätzen', 'Descanso entre séries']),
  src('lesuer', 'LeSuer DA, McCormick JH, Mayhew JL, et al. The accuracy of prediction equations for estimating 1-RM performance in the bench press, squat, and deadlift. J Strength Cond Res. 1997;11(4):211-213.',
    'https://doi.org/10.1519/00124278-199711000-00001',
    ['Formule del massimale stimato (Epley, Brzycki, Lander)', 'Estimated 1RM formulas (Epley, Brzycki, Lander)', 'Fórmulas de 1RM estimado (Epley, Brzycki, Lander)', 'Formules de 1RM estimé (Epley, Brzycki, Lander)', '1RM-Schätzformeln (Epley, Brzycki, Lander)', 'Fórmulas de 1RM estimado (Epley, Brzycki, Lander)']),
  src('cheung', 'Cheung K, Hume P, Maxwell L. Delayed onset muscle soreness: treatment strategies and performance factors. Sports Med. 2003;33(2):145-164.',
    'https://pubmed.ncbi.nlm.nih.gov/12617692/',
    ['Dolori muscolari a insorgenza ritardata (DOMS)', 'Delayed-onset muscle soreness (DOMS)', 'Agujetas (DOMS)', 'Courbatures (DOMS)', 'Muskelkater (DOMS)', 'Dor muscular tardia (DOMS)']),
  src('sleep', 'Watson NF, Badr MS, Belenky G, et al. Recommended amount of sleep for a healthy adult: a joint consensus statement of the American Academy of Sleep Medicine and Sleep Research Society. Sleep. 2015;38(6):843-844.',
    'https://pubmed.ncbi.nlm.nih.gov/25979105/',
    ['Ore di sonno consigliate (7 o più)', 'Recommended sleep (7 hours or more)', 'Horas de sueño recomendadas (7 o más)', 'Durée de sommeil recommandée (7 h ou plus)', 'Empfohlene Schlafdauer (7 Stunden oder mehr)', 'Horas de sono recomendadas (7 ou mais)']),
  src('who_activity', 'World Health Organization. WHO guidelines on physical activity and sedentary behaviour. Geneva; 2020.',
    'https://www.who.int/publications/i/item/9789240015128',
    ['Attività aerobica (150–300 minuti a settimana) e rinforzo muscolare', 'Aerobic activity (150–300 minutes a week) and muscle strengthening', 'Actividad aeróbica (150–300 minutos semanales) y fortalecimiento', 'Activité aérobie (150–300 minutes par semaine) et renforcement', 'Ausdauer (150–300 Minuten pro Woche) und Muskelkräftigung', 'Atividade aeróbica (150–300 minutos por semana) e fortalecimento']),
  src('usda', 'U.S. Department of Agriculture, Agricultural Research Service. FoodData Central.',
    'https://fdc.nal.usda.gov/',
    ['Valori nutrizionali degli alimenti', 'Food nutrition values', 'Valores nutricionales de los alimentos', 'Valeurs nutritionnelles des aliments', 'Nährwerte der Lebensmittel', 'Valores nutricionais dos alimentos']),
  src('crea', 'CREA – Centro di ricerca Alimenti e Nutrizione. Tabelle di composizione degli alimenti.',
    'https://www.alimentinutrizione.it/tabelle-nutrizionali/ricerca-per-alimento',
    ['Valori nutrizionali degli alimenti (Italia)', 'Food nutrition values (Italy)', 'Valores nutricionales (Italia)', 'Valeurs nutritionnelles (Italie)', 'Nährwerte (Italien)', 'Valores nutricionais (Itália)'])
];

export const SOURCE_BY_ID = Object.fromEntries(SOURCES.map(s => [s.id, s]));

// Fonti per ogni argomento del Coach e per le sezioni dell'app
export const TOPIC_SOURCES = {
  summary: ['schoenfeld_volume'], today: ['acsm'], rest: ['schoenfeld_rest', 'acsm'], reps: ['acsm', 'schoenfeld_volume'],
  strength: ['acsm', 'lesuer'], overload: ['acsm'], plateau: ['acsm', 'helms'], deload: ['acsm'], frequency: ['schoenfeld_freq'],
  protein: ['issn_protein', 'morton'], meal: ['issn_timing'], fatloss: ['helms', 'mifflin', 'issn_protein'], bulk: ['helms', 'issn_protein'],
  warmup: ['acsm'], doms: ['cheung'], sleep: ['sleep'], cardio: ['who_activity'], creatine: ['issn_creatine'], home: ['acsm'],
  beginner: ['acsm', 'who_activity'], bench: ['acsm', 'schoenfeld_freq'], squat: ['acsm'], deadlift: ['acsm'], pain: [],
  targets: ['mifflin', 'fao', 'issn_protein', 'morton', 'helms', 'efsa_water'],
  recovery: ['acsm'], calc: ['lesuer'], volume: ['schoenfeld_volume'], foods: ['usda', 'crea']
};

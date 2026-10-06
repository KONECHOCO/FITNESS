/* ==========================================================================
   AURA FIT PRO — COMPREHENSIVE MULTI-LANGUAGE (i18n) ENGINE & STATE
   ========================================================================== */

(function () {
  'use strict';

  // --- I18N TRANSLATION DICTIONARY ---
  const TRANSLATIONS = {
    it: {
      brand_subtitle: 'Ipertrofia Smart & Analytics',
      days_short: 'g',
      hero_tag: 'PRONTO ALL\'ALLENAMENTO',
      hero_title: 'Ciao, Atleta! 👋',
      hero_desc: 'Il tuo livello di recupero muscolare medio è del 88%. Oggi è il giorno perfetto per l\'allenamento Petto & Tricipiti.',
      start_today_workout: 'Inizia Allenamento Oggi',
      ai_workout_generator: 'AI Workout Generator',
      metric_calories: 'Calorie Bruciate',
      metric_cal_target: '80% dell\'obiettivo (800 kcal)',
      metric_volume: 'Volume Totale Settimana',
      metric_vol_growth: '+12% vs scorsa settimana',
      metric_prs: 'Nuovi PR Raggiunti',
      records_unit: 'record',
      metric_pr_highlight: 'Panca Piana 100kg!',
      metric_recovery: 'Stato Recupero',
      recovery_optimal: 'Ottimo',
      metric_recovery_ready: 'Pronti per carico allenante',
      heatmap_title: 'Heatmap 3D Recupero Muscolare',
      heatmap_subtitle: 'Visualizzazione dinamica dello sforzo accumulato nelle ultime 72 ore',
      heatmap_btn: 'Vedi Dettagli 3D',
      legend_title: 'Legenda Sforzo & Recupero',
      legend_fresh_title: 'Muscolo Riposato (90-100%)',
      legend_fresh_desc: 'Pronto per massimo carico sovra-massimale.',
      legend_rec_title: 'In Recupero (50-89%)',
      legend_rec_desc: 'Recupero sintesi proteica in corso.',
      legend_fatigue_title: 'Affaticato / Strenuo (<50%)',
      legend_fatigue_desc: 'Consigliato riposo o stire isometrico leggero.',
      qs_most_trained: 'Muscolo Più Allenato:',
      qs_chest_abs: 'Addominali & Panca',
      qs_fresh_muscle: 'Muscolo Fresco:',
      qs_legs: 'Gambe & Quadricipiti',
      routines_section_title: 'Schede di Allenamento Consigliate',
      see_all: 'Vedi Tutte',
      catalog_title: 'Catalogo Esercizi & Schede',
      catalog_subtitle: 'Oltre 50 esercizi con guida biomeccanica, istruzioni e calcolatore 1RM',
      create_routine_btn: 'Crea Nuova Scheda',
      search_ph: 'Cerca esercizio (es. Panca, Squat)...',
      filter_all: 'Tutti i Muscoli',

      // Muscles
      muscle_chest: 'Petto',
      muscle_back: 'Dorso',
      muscle_legs: 'Gambe',
      muscle_shoulders: 'Spalle',
      muscle_arms: 'Braccia',
      muscle_core: 'Addome',

      // Equipment
      equip_barbell: 'Bilanciere',
      equip_dumbbell: 'Manubri',
      equip_bodyweight: 'Corpo Libero (Casa)',
      equip_machine: 'Macchinario / Cavi',
      equip_all: 'Tutti gli Attrezzi',

      // Difficulty
      diff_beginner: 'Principiante',
      diff_intermediate: 'Intermedio',
      diff_advanced: 'Avanzato',
      diff_all: 'Tutte le Difficoltà',

      subtab_catalog: 'Catalogo Esercizi',
      subtab_my_routines: 'Le Mie Schede',
      subtab_1rm: 'Calcolatore Massimale (1RM)',
      calc_header: 'Calcola il Tuo 1RM (Massimale Teorico)',
      calc_desc: 'Inserisci il peso sollevato e le ripetizioni eseguite a cedimento per stimare il massimale teorico su formule Epley, Brzycki e Lander.',
      calc_weight_label: 'Peso Sollevato (kg)',
      calc_reps_label: 'Ripetizioni Eseguite (Reps)',
      calc_btn: 'Calcola Ora',
      calc_result_label: 'Stima 1RM Massimale:',
      pct_95: '95% (Forza Max)',
      pct_85: '85% (Ipertrofia Pesante)',
      pct_75: '75% (Ipertrofia Moderata)',
      pct_65: '65% (Resistenza Muscolare)',
      no_session_title: 'Nessun Allenamento in Corso',
      no_session_desc: 'Seleziona una scheda o un allenamento rapido per avviare il tracciamento interattivo delle serie e dei tempi di recupero.',
      start_chest_sample: 'Avvia Allenamento "Petto & Tricipiti Heavy"',
      status_in_progress: 'IN CORSO',
      finish_workout_btn: 'Termina Workout',
      rest_timer_title: 'Timer Recupero Serie',
      timer_ready: 'Pronto',
      pause_btn: 'Pausa',
      form_cue_bench: 'Assicurati di mantenere le scapole addotte e i gomiti a 45° durante la panca piana per massima attivazione pettorale.',
      nutri_title: 'Nutrizione & Macro Dieta',
      nutri_subtitle: 'Pianifica le calorie e i macronutrienti giornalieri con database alimenti integrato',
      add_food_btn: 'Aggiungi Alimento',
      macro_protein: 'Proteine',
      macro_carbs: 'Carboidrati',
      macro_fats: 'Grassi Salutari',
      meals_today_title: 'Diario Alimenti Oggi',
      water_label: 'Idratazione',
      ai_title: 'FIT-AI Pro Coach & Biomeccanica',
      ai_subtitle: 'Assistente virtuale per consigli di sovraccarico progressivo, tecnica e piani nutrizionali',
      ai_active_status: 'Attivo & Analizzando i tuoi dati fisici',
      chip_bench: '🚀 Aumentare Massimale Panca',
      chip_rest: '⏱️ Tempo Riposo Ipertrofia',
      chip_nutrition: '🥗 Pre & Post Workout Nutrizione',
      chat_ph: 'Fai una domanda sul tuo allenamento...',
      achievements_title: 'Traguardi & Badge Sbloccati',
      nav_home: 'Home',
      nav_exercises: 'Esercizi',
      nav_workout: 'Workout',
      nav_diet: 'Dieta',
      modal_food_title: 'Aggiungi Alimento alla Dieta',
      modal_food_name: 'Nome Alimento / Piatto',
      modal_food_kcal: 'Calorie (kcal)',
      modal_food_p: 'Proteine (g)',
      modal_food_c: 'Carboidrati (g)',
      modal_food_f: 'Grassi (g)',
      modal_food_presets: 'Cibi Rapidi Frequenti:',
      btn_cancel: 'Annulla',
      btn_save_food: 'Salva Alimento',
      start_now: 'Inizia Ora',
      exercises_count: 'Esercizi',

      // FIT-AI Responses
      ai_greeting: 'Ciao! Sono il tuo <strong>FIT-AI Coach Pro</strong>. Ho analizzato i tuoi recenti allenamenti: la tua Panca Piana ha registrato un incremento di volume del +8%. Vuoi dei consigli per superare il plateau di Squat o una dieta per la fase di massa pulita?',
      ai_default_resp: 'Per massimizzare l\'ipertrofia muscolare, mantieni una frequenza di 2x/settimana per gruppo muscolare, lavorando nel range di 6-12 ripetizioni vicino al cedimento (RPE 8-9).',
      ai_resp_bench: 'Per superare il plateau sulla **Panca Piana**: 1) Inserisci varianti ad alta tensione come la *Panca con Pausa 2 secondi al petto*, 2) Aumenta la frequenza a 2x/settimana dividendo in un giorno Pesante (5x3 @85%) ed un giorno Tecnica (4x6 @70%).',
      ai_resp_rest: 'Per gli esercizi multiarticolari pesanti (Squat, Panca, Stacco) il tempo di riposo ideale è di **2 - 3 minuti** per il pieno ripristino di ATP/CP. Per gli isolamenti (Bicipiti, Alzate Laterali) **60-90 secondi** sono perfetti.',
      ai_resp_nutrition: 'Per la **Nutrizione Pre & Post Workout**: Assumi **30-40g di carboidrati complessi** 90 min prima dell\'allenamento. Post-workout, consuma **25-30g di proteine Whey rapide** con carboidrati semplici per attivare la sintesi proteica.',

      // Routines Translations
      r_chest_triceps_title: 'Petto & Tricipiti Heavy',
      r_chest_triceps_desc: 'Focus su sovraccarico progressivo pettorale e tricipiti',
      r_legs_core_title: 'Gambe & Addome Power',
      r_legs_core_desc: 'Sviluppo quadricipiti, femorali e stabilizzazione core',
      r_back_biceps_title: 'Dorso & Bicipiti V-Taper',
      r_back_biceps_desc: 'Larghezza dorsale e isolamento bicipite',
      cat_hypertrophy: 'Ipertrofia',
      cat_strength: 'Forza',

      // Exercises
      ex_bench_press_title: 'Panca Piana con Bilanciere',
      ex_bench_press_steps: 'Sdraiati sulla panca, afferra il bilanciere con presa leggermente più ampia delle spalle. Abbassa al petto a 45° ed espelli l\'aria spingendo.',
      ex_incline_dumbbell_title: 'Distensioni Manubri Panca Inclinata 30°',
      ex_incline_dumbbell_steps: 'Imposta la panca a 30°. Spingi i manubri focalizzando il lavoro sulla porzione alta del petto.',
      ex_squat_title: 'Squat con Bilanciere',
      ex_squat_steps: 'Posiziona il bilanciere sul trapezio. Scendi lentamente flettendo le ginocchia sotto il parallelo.',
      ex_deadlift_title: 'Stacco da Terra Convenzionale',
      ex_deadlift_steps: 'Piedi larghezza bacino. Schiena in neutro, attiva la catena posteriore ed estendi le anche.',
      ex_lat_pulldown_title: 'Lat Machine Avanti Presa Larga',
      ex_lat_pulldown_steps: 'Tira la sbarra al petto adducendo le scapole. Petto in fuori senza oscillare col busto.',
      ex_overhead_press_title: 'Military Press In Piedi',
      ex_overhead_press_steps: 'Spingi il bilanciere sopra la testa partendo dalle clavicole. Contrai addome e glutei.',
      ex_bicep_curl_title: 'Curl Bicipiti con Manubri',
      ex_bicep_curl_steps: 'In piedi, fletti i gomiti supinando il polso nella parte alta del movimento.',
      ex_tricep_dips_title: 'Dip alle Parallele',
      ex_tricep_dips_steps: 'Scendi flettendo i gomiti fino a 90°. Spingi forte estendendo i tricipiti.',
      ex_pushups_title: 'Flessioni / Push-Ups (Casa)',
      ex_pushups_steps: 'Mani a terra larghezza spalle. Core contratto, piega i gomiti sfiorando il pavimento.',
      ex_plank_title: 'Plank Addominale Isometrico',
      ex_plank_steps: 'Appoggio sugli avambracci. Mantieni il corpo in linea retta senza far cedere il bacino.',

      // Badges
      badge_first_sweat: 'Primo Allenamento',
      badge_bench_100: 'Panca 100kg',
      badge_streak_7: '7 Giorni Streak',
      badge_macro_master: 'Macro Master',
      badge_century_squat: 'Century Squat',
      badge_iron_beast: 'Iron Beast 50k'
    },

    en: {
      brand_subtitle: 'Smart Hypertrophy & Analytics',
      days_short: 'd',
      hero_tag: 'READY TO WORKOUT',
      hero_title: 'Hello, Athlete! 👋',
      hero_desc: 'Your average muscle recovery level is 88%. Today is the perfect day for Chest & Triceps workout.',
      start_today_workout: 'Start Today\'s Workout',
      ai_workout_generator: 'AI Workout Generator',
      metric_calories: 'Calories Burned',
      metric_cal_target: '80% of target (800 kcal)',
      metric_volume: 'Total Weekly Volume',
      metric_vol_growth: '+12% vs last week',
      metric_prs: 'New PRs Reached',
      records_unit: 'records',
      metric_pr_highlight: 'Bench Press 100kg!',
      metric_recovery: 'Recovery Status',
      recovery_optimal: 'Optimal',
      metric_recovery_ready: 'Ready for progressive load',
      heatmap_title: '3D Muscle Recovery Heatmap',
      heatmap_subtitle: 'Dynamic effort visualization accumulated over the last 72 hours',
      heatmap_btn: 'View 3D Details',
      legend_title: 'Effort & Recovery Legend',
      legend_fresh_title: 'Rested Muscle (90-100%)',
      legend_fresh_desc: 'Ready for maximum heavy load.',
      legend_rec_title: 'Recovering (50-89%)',
      legend_rec_desc: 'Muscle protein synthesis in progress.',
      legend_fatigue_title: 'Fatigued / Strenuous (<50%)',
      legend_fatigue_desc: 'Rest or light active recovery recommended.',
      qs_most_trained: 'Most Trained Muscle:',
      qs_chest_abs: 'Abs & Chest',
      qs_fresh_muscle: 'Fresh Muscle:',
      qs_legs: 'Legs & Quads',
      routines_section_title: 'Recommended Workout Routines',
      see_all: 'See All',
      catalog_title: 'Exercise Catalog & Routines',
      catalog_subtitle: 'Over 50 exercises with biomechanical guide, tips and 1RM calculator',
      create_routine_btn: 'Create New Routine',
      search_ph: 'Search exercise (e.g. Bench, Squat)...',
      filter_all: 'All Muscles',

      // Muscles
      muscle_chest: 'Chest',
      muscle_back: 'Back',
      muscle_legs: 'Legs',
      muscle_shoulders: 'Shoulders',
      muscle_arms: 'Arms',
      muscle_core: 'Core',

      // Equipment
      equip_barbell: 'Barbell',
      equip_dumbbell: 'Dumbbells',
      equip_bodyweight: 'Bodyweight (Home)',
      equip_machine: 'Machine / Cables',
      equip_all: 'All Equipment',

      // Difficulty
      diff_beginner: 'Beginner',
      diff_intermediate: 'Intermediate',
      diff_advanced: 'Advanced',
      diff_all: 'All Difficulties',

      subtab_catalog: 'Exercise Catalog',
      subtab_my_routines: 'My Routines',
      subtab_1rm: '1RM Calculator',
      calc_header: 'Calculate Your 1RM (One Rep Max)',
      calc_desc: 'Enter weight lifted and reps completed to failure to estimate max strength on Epley & Brzycki formulas.',
      calc_weight_label: 'Weight Lifted (kg)',
      calc_reps_label: 'Reps Performed',
      calc_btn: 'Calculate Now',
      calc_result_label: 'Estimated 1RM Max:',
      pct_95: '95% (Max Strength)',
      pct_85: '85% (Heavy Hypertrophy)',
      pct_75: '75% (Moderate Hypertrophy)',
      pct_65: '65% (Muscle Endurance)',
      no_session_title: 'No Workout Active',
      no_session_desc: 'Select a routine or quick workout to start live tracking of sets, reps and rest timers.',
      start_chest_sample: 'Start "Chest & Triceps Heavy"',
      status_in_progress: 'IN PROGRESS',
      finish_workout_btn: 'Finish Workout',
      rest_timer_title: 'Set Rest Timer',
      timer_ready: 'Ready',
      pause_btn: 'Pause',
      form_cue_bench: 'Keep your shoulder blades retracted and elbows at 45° during bench press for maximum chest activation.',
      nutri_title: 'Nutrition & Macro Diet',
      nutri_subtitle: 'Plan daily calories and macronutrients with built-in food database',
      add_food_btn: 'Add Food',
      macro_protein: 'Protein',
      macro_carbs: 'Carbohydrates',
      macro_fats: 'Healthy Fats',
      meals_today_title: 'Today\'s Meal Log',
      water_label: 'Hydration',
      ai_title: 'FIT-AI Pro Coach & Biomechanics',
      ai_subtitle: 'Virtual assistant for progressive overload, technique tips and meal plans',
      ai_active_status: 'Active & Analyzing physical metrics',
      chip_bench: '🚀 Increase Bench Press Max',
      chip_rest: '⏱️ Best Rest Time for Muscle',
      chip_nutrition: '🥗 Pre & Post Workout Meals',
      chat_ph: 'Ask any question about workout or diet...',
      achievements_title: 'Achievements & Badges',
      nav_home: 'Home',
      nav_exercises: 'Exercises',
      nav_workout: 'Workout',
      nav_diet: 'Diet',
      modal_food_title: 'Add Food to Diet',
      modal_food_name: 'Food / Meal Name',
      modal_food_kcal: 'Calories (kcal)',
      modal_food_p: 'Protein (g)',
      modal_food_c: 'Carbs (g)',
      modal_food_f: 'Fats (g)',
      modal_food_presets: 'Quick Frequent Foods:',
      btn_cancel: 'Cancel',
      btn_save_food: 'Save Food',
      start_now: 'Start Now',
      exercises_count: 'Exercises',

      // FIT-AI Responses
      ai_greeting: 'Hello! I am your <strong>FIT-AI Coach Pro</strong>. I analyzed your recent workouts: your Bench Press volume increased by +8%. Would you like tips to break your Squat plateau or a lean bulk diet plan?',
      ai_default_resp: 'To maximize muscle hypertrophy, maintain a training frequency of 2x/week per muscle group, working in the 6-12 rep range close to failure (RPE 8-9).',
      ai_resp_bench: 'To break your **Bench Press** plateau: 1) Include pause bench variations (2-sec pause at chest), 2) Train chest 2x/week split into Heavy Day (5x3 @85%) and Technique Day (4x6 @70%).',
      ai_resp_rest: 'For heavy compound lifts (Squat, Bench, Deadlift), optimal rest is **2 - 3 minutes** for full ATP recovery. For isolation exercises (Biceps, Lateral Raises), **60-90 seconds** is ideal.',
      ai_resp_nutrition: 'For **Pre & Post Workout Nutrition**: Consume **30-40g complex carbs** 90 min before workout. Post-workout, take **25-30g Whey protein** with fast carbs to boost muscle protein synthesis.',

      // Routines
      r_chest_triceps_title: 'Chest & Triceps Heavy',
      r_chest_triceps_desc: 'Focus on progressive chest & triceps overload',
      r_legs_core_title: 'Legs & Core Power',
      r_legs_core_desc: 'Quad, hamstring development and core stability',
      r_back_biceps_title: 'Back & Biceps V-Taper',
      r_back_biceps_desc: 'Lats width and bicep isolation',
      cat_hypertrophy: 'Hypertrophy',
      cat_strength: 'Strength',

      // Exercises
      ex_bench_press_title: 'Barbell Bench Press',
      ex_bench_press_steps: 'Lie on bench, grip barbell slightly wider than shoulders. Lower to chest keeping elbows at 45° and press up.',
      ex_incline_dumbbell_title: '30° Incline Dumbbell Press',
      ex_incline_dumbbell_steps: 'Set bench to 30°. Press dumbbells focusing effort on upper chest portion.',
      ex_squat_title: 'Barbell Squat',
      ex_squat_steps: 'Position barbell on traps. Lower down flexing knees below parallel while keeping chest upright.',
      ex_deadlift_title: 'Conventional Deadlift',
      ex_deadlift_steps: 'Feet hip-width apart. Neutral spine, engage posterior chain and extend hips.',
      ex_lat_pulldown_title: 'Wide Grip Lat Pulldown',
      ex_lat_pulldown_steps: 'Pull bar to upper chest retracting scapulae. Keep chest out without swinging torso.',
      ex_overhead_press_title: 'Standing Military Press',
      ex_overhead_press_steps: 'Press barbell overhead starting from collarbones. Engage core and glutes.',
      ex_bicep_curl_title: 'Dumbbell Bicep Curl',
      ex_bicep_curl_steps: 'Standing, flex elbows supinating wrists at the top of contraction.',
      ex_tricep_dips_title: 'Parallel Bar Dips',
      ex_tricep_dips_steps: 'Lower down bending elbows to 90°. Press firmly extending triceps.',
      ex_pushups_title: 'Push-Ups (Home)',
      ex_pushups_steps: 'Hands on floor shoulder-width. Tight core, lower chest to touch floor.',
      ex_plank_title: 'Isometric Core Plank',
      ex_plank_steps: 'Forearm support. Maintain straight body line without sagging hips.',

      // Badges
      badge_first_sweat: 'First Sweat',
      badge_bench_100: 'Bench 100kg',
      badge_streak_7: '7 Day Streak',
      badge_macro_master: 'Macro Master',
      badge_century_squat: 'Century Squat',
      badge_iron_beast: 'Iron Beast 50k'
    },

    es: {
      brand_subtitle: 'Hipertrofia Inteligente & Analíticas',
      days_short: 'd',
      hero_tag: 'LISTO PARA ENTRENAR',
      hero_title: '¡Hola, Atleta! 👋',
      hero_desc: 'Tu nivel medio de recuperación muscular es del 88%. Hoy es el día perfecto para Pecho y Tríceps.',
      start_today_workout: 'Iniciar Entrenamiento Hoy',
      ai_workout_generator: 'Generador de Rutinas IA',
      metric_calories: 'Calorías Quemadas',
      metric_cal_target: '80% del objetivo (800 kcal)',
      metric_volume: 'Volumen Semanal Total',
      metric_vol_growth: '+12% vs semana anterior',
      metric_prs: 'Nuevos Récords (PR)',
      records_unit: 'récords',
      metric_pr_highlight: '¡Press de Banca 100kg!',
      metric_recovery: 'Estado de Recuperación',
      recovery_optimal: 'Óptimo',
      metric_recovery_ready: 'Listo para carga progresiva',
      heatmap_title: 'Mapa 3D Recuperación Muscular',
      heatmap_subtitle: 'Visualización dinámica del esfuerzo acumulado en las últimas 72 horas',
      heatmap_btn: 'Ver Detalles 3D',
      legend_title: 'Leyenda de Esfuerzo & Recuperación',
      legend_fresh_title: 'Músculo Descansado (90-100%)',
      legend_fresh_desc: 'Listo para carga pesada máxima.',
      legend_rec_title: 'En Recuperación (50-89%)',
      legend_rec_desc: 'Síntesis de proteína muscular en curso.',
      legend_fatigue_title: 'Fatigado (<50%)',
      legend_fatigue_desc: 'Se recomienda descanso o recuperación activa.',
      qs_most_trained: 'Músculo Más Entrenado:',
      qs_chest_abs: 'Abdomen y Pecho',
      qs_fresh_muscle: 'Músculo Fresco:',
      qs_legs: 'Piernas y Cuádriceps',
      routines_section_title: 'Rutinas Recomendadas',
      see_all: 'Ver Todas',
      catalog_title: 'Catálogo de Ejercicios y Rutinas',
      catalog_subtitle: 'Más de 50 ejercicios con guía biomecánica y calculadora 1RM',
      create_routine_btn: 'Crear Nueva Rutina',
      search_ph: 'Buscar ejercicio...',
      filter_all: 'Todos los Músculos',

      // Muscles
      muscle_chest: 'Pecho',
      muscle_back: 'Espalda',
      muscle_legs: 'Piernas',
      muscle_shoulders: 'Hombros',
      muscle_arms: 'Brazos',
      muscle_core: 'Abdomen',

      // Equipment
      equip_barbell: 'Barra',
      equip_dumbbell: 'Mancuernas',
      equip_bodyweight: 'Peso Corporal (Casa)',
      equip_machine: 'Máquina / Poleas',
      equip_all: 'Todo el Equipamiento',

      // Difficulty
      diff_beginner: 'Principiante',
      diff_intermediate: 'Intermedio',
      diff_advanced: 'Avanzado',
      diff_all: 'Todas las Dificultades',

      subtab_catalog: 'Catálogo de Ejercicios',
      subtab_my_routines: 'Mis Rutinas',
      subtab_1rm: 'Calculadora 1RM',
      calc_header: 'Calcula tu 1RM (Máximo Teórico)',
      calc_desc: 'Introduce peso levantado y repeticiones al fallo para estimar tu fuerza máxima.',
      calc_weight_label: 'Peso Levantado (kg)',
      calc_reps_label: 'Repeticiones Realizadas',
      calc_btn: 'Calcular Ahora',
      calc_result_label: 'Estimación 1RM Máximo:',
      pct_95: '95% (Fuerza Máxima)',
      pct_85: '85% (Hipertrofia Pesada)',
      pct_75: '75% (Hipertrofia Moderada)',
      pct_65: '65% (Resistencia Muscular)',
      no_session_title: 'Sin Entrenamiento Activo',
      no_session_desc: 'Selecciona una rutina para iniciar el seguimiento interactivo de series y descansos.',
      start_chest_sample: 'Iniciar "Pecho & Tríceps Heavy"',
      status_in_progress: 'EN CURSO',
      finish_workout_btn: 'Finalizar Entreno',
      rest_timer_title: 'Temporizador de Descanso',
      timer_ready: 'Listo',
      pause_btn: 'Pausa',
      form_cue_bench: 'Mantén las escápulas retraídas y los codos a 45° en press de banca para máxima activación del pecho.',
      nutri_title: 'Nutrición & Dieta Macro',
      nutri_subtitle: 'Planifica calorías diarias y macronutrientes con base de alimentos',
      add_food_btn: 'Añadir Alimento',
      macro_protein: 'Proteínas',
      macro_carbs: 'Carbohidratos',
      macro_fats: 'Grasas Saludables',
      meals_today_title: 'Diario de Comidas Hoy',
      water_label: 'Hidratación',
      ai_title: 'Entrenador FIT-AI Pro',
      ai_subtitle: 'Asistente virtual para sobrecarga progresiva y nutrición',
      ai_active_status: 'Activo & Analizando datos físicos',
      chip_bench: '🚀 Aumentar Máximo en Banca',
      chip_rest: '⏱️ Tiempo Descanso Hipertrofia',
      chip_nutrition: '🥗 Comidas Pre & Post Entreno',
      chat_ph: 'Pregunta sobre entreno o dieta...',
      achievements_title: 'Logros y Medallas',
      nav_home: 'Inicio',
      nav_exercises: 'Ejercicios',
      nav_workout: 'Entreno',
      nav_diet: 'Dieta',
      modal_food_title: 'Añadir Alimento',
      modal_food_name: 'Nombre del Alimento',
      modal_food_kcal: 'Calorías (kcal)',
      modal_food_p: 'Proteínas (g)',
      modal_food_c: 'Carbohidratos (g)',
      modal_food_f: 'Grasas (g)',
      modal_food_presets: 'Comidas Frecuentes:',
      btn_cancel: 'Cancelar',
      btn_save_food: 'Guardar Alimento',
      start_now: 'Iniciar Ahora',
      exercises_count: 'Ejercicios',

      // FIT-AI Responses
      ai_greeting: '¡Hola! Soy tu <strong>FIT-AI Coach Pro</strong>. Analicé tus entrenamientos recientes: tu volumen en Press de Banca aumentó un +8%. ¿Quieres consejos para superar tu marca en Sentadilla o una dieta de volumen limpio?',
      ai_default_resp: 'Para maximizar la hipertrofia muscular, mantén una frecuencia de 2x/semana por grupo muscular, trabajando en el rango de 6-12 repeticiones cerca del fallo (RPE 8-9).',
      ai_resp_bench: 'Para superar el estancamiento en **Press de Banca**: 1) Añade variantes con pausa de 2 seg en el pecho, 2) Entrena pecho 2x/semana dividiendo en un día Pesado (5x3 @85%) y un día Técnico (4x6 @70%).',
      ai_resp_rest: 'Para ejercicios multiarticulares pesados (Sentadilla, Banca, Peso Muerto), el descanso ideal es de **2 a 3 minutos**. Para aislamiento (Bíps, Elevaciones), **60 a 90 segundos** es perfecto.',
      ai_resp_nutrition: 'Para **Nutrición Pre & Post Entreno**: Consume **30-40g de carbohidratos complejos** 90 min antes del entreno. Post-entreno, toma **25-30g de proteína Whey** con carbohidratos simples.',

      // Routines
      r_chest_triceps_title: 'Pecho & Tríceps Heavy',
      r_chest_triceps_desc: 'Enfoque en sobrecarga progresiva de pecho y tríceps',
      r_legs_core_title: 'Piernas & Abdomen Power',
      r_legs_core_desc: 'Desarrollo de cuádriceps, isquios y estabilidad core',
      r_back_biceps_title: 'Espalda & Bíceps V-Taper',
      r_back_biceps_desc: 'Amplitud de espalda e aislamiento de bíceps',
      cat_hypertrophy: 'Hipertrofia',
      cat_strength: 'Fuerza',

      // Exercises
      ex_bench_press_title: 'Press de Banca con Barra',
      ex_bench_press_steps: 'Tumbado en el banco, agarra la barra ligeramente más ancho que los hombros. Baja al pecho a 45° y empuja hacia arriba.',
      ex_incline_dumbbell_title: 'Press Inclinado 30° Mancuernas',
      ex_incline_dumbbell_steps: 'Ajusta el banco a 30°. Empuja las mancuernas enfocando la parte superior del pecho.',
      ex_squat_title: 'Sentadilla con Barra',
      ex_squat_steps: 'Coloca la barra en el trapecio. Flexiona las rodillas bajo el paralelo manteniendo la espalda recta.',
      ex_deadlift_title: 'Peso Muerto Convencional',
      ex_deadlift_steps: 'Pies a la anchura de caderas. Espalda neutra, activa cadena posterior y extiende caderas.',
      ex_lat_pulldown_title: 'Jalón al Pecho Agarre Ancho',
      ex_lat_pulldown_steps: 'Tira de la barra al pecho retrayendo escápulas. Mantén el pecho fuera sin balancearte.',
      ex_overhead_press_title: 'Press Militar de Pie',
      ex_overhead_press_steps: 'Empuja la barra sobre la cabeza partiendo de clavículas. Aprieta abdomen y glúteos.',
      ex_bicep_curl_title: 'Curl de Bíceps con Mancuernas',
      ex_bicep_curl_steps: 'De pie, flexiona codos supinando la muñeca en la parte alta.',
      ex_tricep_dips_title: 'Fondos en Paralelas',
      ex_tricep_dips_steps: 'Baja doblando codos a 90°. Empuja con fuerza extendiendo tríceps.',
      ex_pushups_title: 'Flexiones (Casa)',
      ex_pushups_steps: 'Manos en suelo a anchura de hombros. Abdomen tenso, baja rozando el suelo.',
      ex_plank_title: 'Plancha Abdominal Isométrica',
      ex_plank_steps: 'Apoyo en antebrazos. Mantén el cuerpo en línea recta sin hundir la cadera.',

      // Badges
      badge_first_sweat: 'Primer Entreno',
      badge_bench_100: 'Banca 100kg',
      badge_streak_7: 'Racha 7 Días',
      badge_macro_master: 'Maestro Macro',
      badge_century_squat: 'Sentadilla 100k',
      badge_iron_beast: 'Bestia 50k'
    },

    fr: {
      brand_subtitle: 'Hypertrophie Smart & Analytique',
      days_short: 'j',
      hero_tag: 'PRÊT À L\'ENTRAÎNEMENT',
      hero_title: 'Bonjour, Athlète! 👋',
      hero_desc: 'Votre niveau moyen de récupération musculaire est de 88%. Aujourd\'hui est parfait pour Pectoraux & Triceps.',
      start_today_workout: 'Commencer l\'Entraînement',
      ai_workout_generator: 'Générateur d\'Entraînement IA',
      metric_calories: 'Calories Brûlées',
      metric_cal_target: '80% de l\'objectif (800 kcal)',
      metric_volume: 'Volume Hebdomadaire Total',
      metric_vol_growth: '+12% vs semaine dernière',
      metric_prs: 'Nouveaux Records (PR)',
      records_unit: 'records',
      metric_pr_highlight: 'Développé Couché 100kg!',
      metric_recovery: 'État de Récupération',
      recovery_optimal: 'Optimal',
      metric_recovery_ready: 'Prêt pour la charge progressive',
      heatmap_title: 'Carte 3D Récupération Musculaire',
      heatmap_subtitle: 'Visualisation dynamique de l\'effort accumulé sur 72h',
      heatmap_btn: 'Voir Détails 3D',
      legend_title: 'Légende Effort & Récupération',
      legend_fresh_title: 'Muscle Reposé (90-100%)',
      legend_fresh_desc: 'Prêt pour une charge maximale.',
      legend_rec_title: 'En Récupération (50-89%)',
      legend_rec_desc: 'Synthèse des protéines musculaires en cours.',
      legend_fatigue_title: 'Fatigué (<50%)',
      legend_fatigue_desc: 'Repos ou récupération active conseillé.',
      qs_most_trained: 'Muscle le Plus Entraîné:',
      qs_chest_abs: 'Abdominaux & Pectoraux',
      qs_fresh_muscle: 'Muscle Frais:',
      qs_legs: 'Jambes & Quadriceps',
      routines_section_title: 'Programmes Recommandés',
      see_all: 'Voir Tout',
      catalog_title: 'Catalogue d\'Exercices & Programmes',
      catalog_subtitle: 'Plus de 50 exercices avec guide biomécanique et calculateur 1RM',
      create_routine_btn: 'Créer un Programme',
      search_ph: 'Rechercher un exercice...',
      filter_all: 'Tous les Muscles',

      // Muscles
      muscle_chest: 'Pectoraux',
      muscle_back: 'Dos',
      muscle_legs: 'Jambes',
      muscle_shoulders: 'Épaules',
      muscle_arms: 'Bras',
      muscle_core: 'Abdominaux',

      // Equipment
      equip_barbell: 'Barre',
      equip_dumbbell: 'Haltères',
      equip_bodyweight: 'Poids du Corps (Maison)',
      equip_machine: 'Machine / Câbles',
      equip_all: 'Équipement',

      // Difficulty
      diff_beginner: 'Débutant',
      diff_intermediate: 'Intermédiaire',
      diff_advanced: 'Avancé',
      diff_all: 'Toutes Difficultés',

      subtab_catalog: 'Catalogue d\'Exercices',
      subtab_my_routines: 'Mes Programmes',
      subtab_1rm: 'Calculateur 1RM',
      calc_header: 'Calculez votre 1RM (Max Théorique)',
      calc_desc: 'Entrez le poids et les répétitions pour estimer votre force maximale.',
      calc_weight_label: 'Poids Soulevé (kg)',
      calc_reps_label: 'Répétitions Effectuées',
      calc_btn: 'Calculer Maintenant',
      calc_result_label: 'Estimation 1RM Max:',
      pct_95: '95% (Force Maximale)',
      pct_85: '85% (Hypertrophie Lourde)',
      pct_75: '75% (Hypertrophie Modérée)',
      pct_65: '65% (Endurance Musculaire)',
      no_session_title: 'Aucun Entraînement en Cours',
      no_session_desc: 'Sélectionnez un programme pour lancer le suivi live des séries et repos.',
      start_chest_sample: 'Lancer "Pectoraux & Triceps Heavy"',
      status_in_progress: 'EN COURS',
      finish_workout_btn: 'Terminer Séances',
      rest_timer_title: 'Chronomètre de Repos',
      timer_ready: 'Prêt',
      pause_btn: 'Pause',
      form_cue_bench: 'Gardez les omoplates resserrées et coudes à 45° au développé couché.',
      nutri_title: 'Nutrition & Régime Macro',
      nutri_subtitle: 'Planifiez vos calories et macronutriments quotidiens',
      add_food_btn: 'Ajouter un Aliment',
      macro_protein: 'Protéines',
      macro_carbs: 'Glucides',
      macro_fats: 'Lipides Sains',
      meals_today_title: 'Journal des Repas',
      water_label: 'Hydratation',
      ai_title: 'Coach Virtuel FIT-AI Pro',
      ai_subtitle: 'Assistant virtuel pour surcharge progressive et nutrition',
      ai_active_status: 'Actif & Analyse des métriques physiques',
      chip_bench: '🚀 Augmenter Max Développé Couché',
      chip_rest: '⏱️ Temps de Repos Idéal',
      chip_nutrition: '🥗 Repas Pre & Post Entraînement',
      chat_ph: 'Posez une question...',
      achievements_title: 'Succès & Badges',
      nav_home: 'Accueil',
      nav_exercises: 'Exercices',
      nav_workout: 'Séance',
      nav_diet: 'Diète',
      modal_food_title: 'Ajouter un Aliment',
      modal_food_name: 'Nom de l\'Aliment',
      modal_food_kcal: 'Calories (kcal)',
      modal_food_p: 'Protéines (g)',
      modal_food_c: 'Glucides (g)',
      modal_food_f: 'Lipides (g)',
      modal_food_presets: 'Aliments Rapides:',
      btn_cancel: 'Annuler',
      btn_save_food: 'Enregistrer',
      start_now: 'Démarrer',
      exercises_count: 'Exercices',

      // FIT-AI Responses
      ai_greeting: 'Bonjour! Je suis votre <strong>FIT-AI Coach Pro</strong>. J\'ai analysé vos entraînements récents: le volume de votre Développé Couché a augmenté de +8%. Souhaitez-vous des conseils pour franchir un palier au Squat ou un plan de prise de masse sèche?',
      ai_default_resp: 'Pour maximiser l\'hypertrophie musculaire, maintenez une fréquence d\'entraînement de 2x/semaine par groupe musculaire, entre 6 et 12 répétitions proches de l\'échec (RPE 8-9).',
      ai_resp_bench: 'Pour franchir un palier au **Développé Couché**: 1) Intégrez des variantes avec pause de 2 sec sur la poitrine, 2) Entraînez les pecs 2x/semaine (1 jour Lourd 5x3 @85% et 1 jour Technique 4x6 @70%).',
      ai_resp_rest: 'Pour les mouvements polyarticulaires lourds (Squat, Couché, Soulevé de terre), le repos idéal est de **2 à 3 minutes**. Pour l\'isolation (Biceps, Élévations), **60 à 90 secondes** suffisent.',
      ai_resp_nutrition: 'Pour la **Nutrition Pré & Post Entraînement**: Prenez **30-40g de glucides complexes** 90 min avant la séance. Après la séance, consommez **25-30g de protéine Whey** pour relancer la synthèse protéique.',

      // Routines
      r_chest_triceps_title: 'Pectoraux & Triceps Heavy',
      r_chest_triceps_desc: 'Focus sur la surcharge progressive pecs et triceps',
      r_legs_core_title: 'Jambes & Abdominaux Power',
      r_legs_core_desc: 'Développement quadriceps, ischio-jambiers et gainage',
      r_back_biceps_title: 'Dos & Biceps V-Taper',
      r_back_biceps_desc: 'Largeur du dos et isolation biceps',
      cat_hypertrophy: 'Hypertrophie',
      cat_strength: 'Force',

      // Exercises
      ex_bench_press_title: 'Développé Couché Barre',
      ex_bench_press_steps: 'Allongé sur le banc, saisissez la barre. Descendez au niveau de la poitrine et poussez vers le haut.',
      ex_incline_dumbbell_title: 'Développé Incliné Haltères 30°',
      ex_incline_dumbbell_steps: 'Réglez le banc à 30°. Poussez les haltères en ciblant le haut des pectoraux.',
      ex_squat_title: 'Squat avec Barre',
      ex_squat_steps: 'Placez la barre sur les trapèzes. Descendez en fléchissant les genoux sous le parallèle.',
      ex_deadlift_title: 'Soulevé de Terre Conventionnel',
      ex_deadlift_steps: 'Pieds largeur bassin. Dos neutre, engagez la chaîne postérieure et étendez les hanches.',
      ex_lat_pulldown_title: 'Tirage Poitrine Prise Large',
      ex_lat_pulldown_steps: 'Tirez la barre vers le haut de la poitrine en resserrant les omoplates.',
      ex_overhead_press_title: 'Développé Militaire Debout',
      ex_overhead_press_steps: 'Poussez la barre au-dessus de la tête. Contractez les abdominaux et fessiers.',
      ex_bicep_curl_title: 'Curl Biceps avec Haltères',
      ex_bicep_curl_steps: 'Debout, fléchissez les coudes en tournant les poignets en haut du mouvement.',
      ex_tricep_dips_title: 'Dips aux Barres Parallèles',
      ex_tricep_dips_steps: 'Descendez jusqu\'à 90° aux coudes. Poussez fort en étendant les triceps.',
      ex_pushups_title: 'Pompes (Maison)',
      ex_pushups_steps: 'Mains au sol largeur épaules. Gainage serré, descendez la poitrine au sol.',
      ex_plank_title: 'Gainage Abdominal Plank',
      ex_plank_steps: 'En appui sur les avant-bras. Maintenez le corps droit sans creuser le dos.',

      // Badges
      badge_first_sweat: 'Premier Entraînement',
      badge_bench_100: 'Couché 100kg',
      badge_streak_7: '7 Jours Réunis',
      badge_macro_master: 'Maître Macro',
      badge_century_squat: 'Squat 100k',
      badge_iron_beast: 'Bête de Fer 50k'
    },

    de: {
      brand_subtitle: 'Smart Hypertrophie & Analytik',
      days_short: 't',
      hero_tag: 'BEREIT FÜRS WORKOUT',
      hero_title: 'Hallo, Athlet! 👋',
      hero_desc: 'Dein durchschnittliches Muskelregenerations-Level liegt bei 88%. Heute ist perfekt für Brust & Trizeps.',
      start_today_workout: 'Workout Heute Starten',
      ai_workout_generator: 'KI Workout Generator',
      metric_calories: 'Verbrannte Kalorien',
      metric_cal_target: '80% des Ziels (800 kcal)',
      metric_volume: 'Gesamtes Wochenvolumen',
      metric_vol_growth: '+12% vs. letzte Woche',
      metric_prs: 'Neue PRs Erreicht',
      records_unit: 'Rekorde',
      metric_pr_highlight: 'Bankdrücken 100kg!',
      metric_recovery: 'Regenerationsstatus',
      recovery_optimal: 'Optimal',
      metric_recovery_ready: 'Bereit für progressive Last',
      heatmap_title: '3D Muskel-Heatmap',
      heatmap_subtitle: 'Dynamische Anzeige der Muskelbelastung der letzten 72h',
      heatmap_btn: '3D Details Ansehen',
      legend_title: 'Belastung & Regeneration Legende',
      legend_fresh_title: 'Ausgeruhter Muskel (90-100%)',
      legend_fresh_desc: 'Bereit für maximale schwere Last.',
      legend_rec_title: 'In Regeneration (50-89%)',
      legend_rec_desc: 'Muskeleiweißsynthese läuft.',
      legend_fatigue_title: 'Ermüdet (<50%)',
      legend_fatigue_desc: 'Pause oder leichte Erholung empfohlen.',
      qs_most_trained: 'Meist Trainierter Muskel:',
      qs_chest_abs: 'Bauch & Brust',
      qs_fresh_muscle: 'Frischer Muskel:',
      qs_legs: 'Beine & Quads',
      routines_section_title: 'Empfohlene Trainingspläne',
      see_all: 'Alle Ansehen',
      catalog_title: 'Übungskatalog & Pläne',
      catalog_subtitle: 'Über 50 Übungen mit Anleitung und 1RM Rechner',
      create_routine_btn: 'Neuen Plan Erstellen',
      search_ph: 'Übung suchen...',
      filter_all: 'Alle Muskeln',

      // Muscles
      muscle_chest: 'Brust',
      muscle_back: 'Rücken',
      muscle_legs: 'Beine',
      muscle_shoulders: 'Schultern',
      muscle_arms: 'Arme',
      muscle_core: 'Bauch',

      // Equipment
      equip_barbell: 'Langhantel',
      equip_dumbbell: 'Kurzhanteln',
      equip_bodyweight: 'Eigengewicht (Zuhause)',
      equip_machine: 'Maschine / Kabel',
      equip_all: 'Alle Geräte',

      // Difficulty
      diff_beginner: 'Anfänger',
      diff_intermediate: 'Fortgeschritten',
      diff_advanced: 'Profi',
      diff_all: 'Alle Schwerpunkte',

      subtab_catalog: 'Übungskatalog',
      subtab_my_routines: 'Meine Pläne',
      subtab_1rm: '1RM Rechner',
      calc_header: 'Berechne Dein 1RM (Maximalgewicht)',
      calc_desc: 'Gib Gewicht und Wdh. ein, um dein Maximalgewicht zu berechnen.',
      calc_weight_label: 'Bewegtes Gewicht (kg)',
      calc_reps_label: 'Wiederholungen',
      calc_btn: 'Jetzt Berechnen',
      calc_result_label: 'Geschätztes 1RM Max:',
      pct_95: '95% (Maximalkraft)',
      pct_85: '85% (Schwere Hypertrophie)',
      pct_75: '75% (Moderate Hypertrophie)',
      pct_65: '65% (Muskelausdauer)',
      no_session_title: 'Kein Aktives Workout',
      no_session_desc: 'Wähle einen Plan für Live-Tracking von Sätzen und Pausen.',
      start_chest_sample: 'Start "Brust & Trizeps Heavy"',
      status_in_progress: 'LÄUFT',
      finish_workout_btn: 'Workout Beenden',
      rest_timer_title: 'Satz-Pausentimer',
      timer_ready: 'Bereit',
      pause_btn: 'Pause',
      form_cue_bench: 'Halte die Schulterblätter zusammengezogen beim Bankdrücken.',
      nutri_title: 'Ernährung & Makro Diät',
      nutri_subtitle: 'Plane deine täglichen Kalorien und Makros',
      add_food_btn: 'Nahrung Hinzufügen',
      macro_protein: 'Proteine',
      macro_carbs: 'Kohlenhydrate',
      macro_fats: 'Gesunde Fette',
      meals_today_title: 'Heutiges Tagebuch',
      water_label: 'Hydratation',
      ai_title: 'FIT-AI Pro Coach',
      ai_subtitle: 'Virtueller Assistent für Progression und Ernährung',
      ai_active_status: 'Aktiv & Analysiert Messwerte',
      chip_bench: '🚀 Bankdrücken Max Steigern',
      chip_rest: '⏱️ Beste Pausenzeit für Muskeln',
      chip_nutrition: '🥗 Pre & Post Workout Mahlzeiten',
      chat_ph: 'Frage stellen...',
      achievements_title: 'Erfolge & Abzeichen',
      nav_home: 'Home',
      nav_exercises: 'Übungen',
      nav_workout: 'Workout',
      nav_diet: 'Diät',
      modal_food_title: 'Nahrung Hinzufügen',
      modal_food_name: 'Name der Nahrung',
      modal_food_kcal: 'Kalorien (kcal)',
      modal_food_p: 'Eiweiß (g)',
      modal_food_c: 'Kohlenhydrate (g)',
      modal_food_f: 'Fett (g)',
      modal_food_presets: 'Schnelle Auswahl:',
      btn_cancel: 'Abbrechen',
      btn_save_food: 'Speichern',
      start_now: 'Jetzt Starten',
      exercises_count: 'Übungen',

      // FIT-AI Responses
      ai_greeting: 'Hallo! Ich bin dein <strong>FIT-AI Coach Pro</strong>. Ich habe deine Workouts analysiert: Dein Bankdrücken-Volumen stieg um +8%. Möchtest du Tipps für die Kniebeuge oder einen Ernährungsplan?',
      ai_default_resp: 'Um die Muskelhypertrophie zu maximieren, halte eine Trainingsfrequenz von 2x/Woche pro Muskelgruppe ein im Bereich von 6-12 Wiederholungen nahe dem Muskelversagen (RPE 8-9).',
      ai_resp_bench: 'Um das Plateau beim **Bankdrücken** zu brechen: 1) Nutze Varianten mit 2-Sek. Pause auf der Brust, 2) Trainiere Brust 2x/Woche aufgeteilt in einen schweren Tag (5x3 @85%) und einen Technik-Tag (4x6 @70%).',
      ai_resp_rest: 'Für schwere Grundübungen (Kniebeuge, Bankdrücken, Kreuzheben) ist eine Pause von **2 - 3 Minuten** optimal. Für Isolationsübungen reichen **60-90 Sekunden**.',
      ai_resp_nutrition: 'Für **Pre & Post Workout Ernährung**: Nimm **30-40g komplexe Kohlenhydrate** 90 Min. vor dem Training. Nach dem Training konsumiere **25-30g Whey Protein**.',

      // Routines
      r_chest_triceps_title: 'Brust & Trizeps Heavy',
      r_chest_triceps_desc: 'Fokus auf progressive Überlastung für Brust und Trizeps',
      r_legs_core_title: 'Beine & Rumpf Power',
      r_legs_core_desc: 'Entwicklung von Quads, Hamstrings und Rumpfstabilität',
      r_back_biceps_title: 'Rücken & Bizeps V-Taper',
      r_back_biceps_desc: 'Rückenbreite und Bizeps-Isolierung',
      cat_hypertrophy: 'Hypertrophie',
      cat_strength: 'Kraft',

      // Exercises
      ex_bench_press_title: 'Langhantel-Bankdrücken',
      ex_bench_press_steps: 'Auf die Bank legen, Langhantel greifen, zur Brust absenken und nach oben drücken.',
      ex_incline_dumbbell_title: 'Schrägbank-Kurzhanteldrücken 30°',
      ex_incline_dumbbell_steps: 'Bank auf 30° stellen. Kurzhanteln drücken mit Fokus auf obere Brust.',
      ex_squat_title: 'Langhantel-Kniebeuge',
      ex_squat_steps: 'Langhantel auf den Nacken legen. Langsam beugen unter die Parallele.',
      ex_deadlift_title: 'Konventionelles Kreuzheben',
      ex_deadlift_steps: 'Füße hüftbreit. Gerader Rücken, hintere Kette aktivieren und Hüfte strecken.',
      ex_lat_pulldown_title: 'Breiter Latzug zum Brustbein',
      ex_lat_pulldown_steps: 'Stange zur Brust ziehen und Schulterblätter zusammenziehen.',
      ex_overhead_press_title: 'Military Press im Stehen',
      ex_overhead_press_steps: 'Langhantel von den Schlüsselbeinen über den Kopf drücken.',
      ex_bicep_curl_title: 'Kurzhantel-Bizepscurl',
      ex_bicep_curl_steps: 'Im Stehen Ellbogen beugen und Unterarme eindrehen.',
      ex_tricep_dips_title: 'Barrendips',
      ex_tricep_dips_steps: 'Beugen bis 90° im Ellbogen und kraftvoll strecken.',
      ex_pushups_title: 'Liegestütze (Zuhause)',
      ex_pushups_steps: 'Hände schulterbreit. Rumpf anspannen, Brust senken.',
      ex_plank_title: 'Isometrischer Unterarmstütz',
      ex_plank_steps: 'Unterarmstütz. Körper in einer geraden Linie halten.',

      // Badges
      badge_first_sweat: 'Erstes Workout',
      badge_bench_100: 'Bank 100kg',
      badge_streak_7: '7 Tage Serie',
      badge_macro_master: 'Makro Meister',
      badge_century_squat: 'Kniebeuge 100k',
      badge_iron_beast: 'Eisen Biest 50k'
    },

    pt: {
      brand_subtitle: 'Hipertrofia Inteligente & Analítica',
      days_short: 'd',
      hero_tag: 'PRONTO PARA TREINAR',
      hero_title: 'Olá, Atleta! 👋',
      hero_desc: 'O seu nível médio de recuperação muscular é de 88%. Hoje é perfeito para Peito e Tríceps.',
      start_today_workout: 'Iniciar Treino Hoje',
      ai_workout_generator: 'Gerador de Treino IA',
      metric_calories: 'Calorias Queimadas',
      metric_cal_target: '80% da meta (800 kcal)',
      metric_volume: 'Volume Semanal Total',
      metric_vol_growth: '+12% vs semana passada',
      metric_prs: 'Novos Recordes (PR)',
      records_unit: 'recordes',
      metric_pr_highlight: 'Supino Reto 100kg!',
      metric_recovery: 'Estado de Recuperação',
      recovery_optimal: 'Ótimo',
      metric_recovery_ready: 'Pronto para carga progressiva',
      heatmap_title: 'Mapa 3D Recuperação Muscular',
      heatmap_subtitle: 'Visualização dinâmica do esforço acumulado nas últimas 72 horas',
      heatmap_btn: 'Ver Detalhes 3D',
      legend_title: 'Legenda Esforço & Recuperação',
      legend_fresh_title: 'Músculo Descansado (90-100%)',
      legend_fresh_desc: 'Pronto para carga máxima pesada.',
      legend_rec_title: 'Em Recuperação (50-89%)',
      legend_rec_desc: 'Síntese de proteína muscular em andamento.',
      legend_fatigue_title: 'Fadigado (<50%)',
      legend_fatigue_desc: 'Recomenda-se descanso ou recuperação ativa.',
      qs_most_trained: 'Músculo Mais Treinado:',
      qs_chest_abs: 'Abdômen e Peito',
      qs_fresh_muscle: 'Músculo Descansado:',
      qs_legs: 'Pernas e Quadríceps',
      routines_section_title: 'Treinos Recomendados',
      see_all: 'Ver Todos',
      catalog_title: 'Catálogo de Exercícios e Fichas',
      catalog_subtitle: 'Mais de 50 exercícios com guia biomecânico e calculadora 1RM',
      create_routine_btn: 'Criar Nova Ficha',
      search_ph: 'Buscar exercício...',
      filter_all: 'Todos os Músculos',

      // Muscles
      muscle_chest: 'Peito',
      muscle_back: 'Costas',
      muscle_legs: 'Pernas',
      muscle_shoulders: 'Ombros',
      muscle_arms: 'Braços',
      muscle_core: 'Abdômen',

      // Equipment
      equip_barbell: 'Barra',
      equip_dumbbell: 'Halteres',
      equip_bodyweight: 'Peso Corporal (Casa)',
      equip_machine: 'Máquina / Cabos',
      equip_all: 'Equipamento',

      // Difficulty
      diff_beginner: 'Iniciante',
      diff_intermediate: 'Intermediário',
      diff_advanced: 'Avançado',
      diff_all: 'Dificuldade',

      subtab_catalog: 'Catálogo de Exercícios',
      subtab_my_routines: 'Minhas Fichas',
      subtab_1rm: 'Calculadora 1RM',
      calc_header: 'Calcule seu 1RM (Máximo Teórico)',
      calc_desc: 'Insira o peso e as repetições até a falha para estimar sua força máxima.',
      calc_weight_label: 'Peso Levantado (kg)',
      calc_reps_label: 'Repetições Feitas',
      calc_btn: 'Calcular Agora',
      calc_result_label: 'Estimativa 1RM Máximo:',
      pct_95: '95% (Força Máxima)',
      pct_85: '85% (Hipertrofia Pesada)',
      pct_75: '75% (Hipertrofia Moderada)',
      pct_65: '65% (Resistência Muscular)',
      no_session_title: 'Sem Treino Ativo',
      no_session_desc: 'Selecione um treino para iniciar o rastreamento ao vivo.',
      start_chest_sample: 'Iniciar "Peito & Tríceps Heavy"',
      status_in_progress: 'EM ANDAMENTO',
      finish_workout_btn: 'Finalizar Treino',
      rest_timer_title: 'Temporizador de Descanso',
      timer_ready: 'Pronto',
      pause_btn: 'Pausa',
      form_cue_bench: 'Mantenha as escápulas retraídas no supino para maior ativação do peito.',
      nutri_title: 'Nutrição & Dieta Macro',
      nutri_subtitle: 'Planeje calorias e macronutrientes diários',
      add_food_btn: 'Adicionar Alimento',
      macro_protein: 'Proteínas',
      macro_carbs: 'Carboidratos',
      macro_fats: 'Gorduras Saudáveis',
      meals_today_title: 'Diário de Refeições',
      water_label: 'Hidratação',
      ai_title: 'Treinador FIT-AI Pro',
      ai_subtitle: 'Assistente virtual para sobrecarga progressiva e nutrição',
      ai_active_status: 'Ativo & Analisando dados físicos',
      chip_bench: '🚀 Aumentar Máximo no Supino',
      chip_rest: '⏱️ Tempo de Descanso Ideal',
      chip_nutrition: '🥗 Refeições Pré & Pós Treino',
      chat_ph: 'Faça uma pergunta...',
      achievements_title: 'Conquistas & Medalhas',
      nav_home: 'Início',
      nav_exercises: 'Exercícios',
      nav_workout: 'Treino',
      nav_diet: 'Dieta',
      modal_food_title: 'Adicionar Alimento',
      modal_food_name: 'Nome do Alimento',
      modal_food_kcal: 'Calorias (kcal)',
      modal_food_p: 'Proteínas (g)',
      modal_food_c: 'Carboidratos (g)',
      modal_food_f: 'Gorduras (g)',
      modal_food_presets: 'Refeições Rápidas:',
      btn_cancel: 'Cancelar',
      btn_save_food: 'Salvar Alimento',
      start_now: 'Iniciar Agora',
      exercises_count: 'Exercícios',

      // FIT-AI Responses
      ai_greeting: 'Olá! Sou o seu <strong>FIT-AI Coach Pro</strong>. Analisei os seus treinos recentes: o seu volume no Supino aumentou +8%. Quer dicas para superar o plateau no Agachamento ou um plano de nutrição?',
      ai_default_resp: 'Para maximizar a hipertrofia muscular, mantenha uma frequência de 2x/semana por grupo muscular, trabalhando na faixa de 6-12 repetições perto da falha (RPE 8-9).',
      ai_resp_bench: 'Para superar o estagnação no **Supino Reto**: 1) Inclua variações com pausa de 2 seg no peito, 2) Treine peito 2x/semana dividido em Dia Pesado (5x3 @85%) e Dia Técnico (4x6 @70%).',
      ai_resp_rest: 'Para exercícios compostos pesados (Agachamento, Supino, Terra), o descanso ideal é de **2 a 3 minutos**. Para isolamento (Bíceps, Elevações), **60 a 90 segundos** é perfeito.',
      ai_resp_nutrition: 'Para **Nutrição Pré & Pós Treino**: Consuma **30-40g de carboidratos complexos** 90 min antes do treino. Pós-treino, tome **25-30g de proteína Whey**.',

      // Routines
      r_chest_triceps_title: 'Peito & Tríceps Heavy',
      r_chest_triceps_desc: 'Foco em sobrecarga progressiva para peito e tríceps',
      r_legs_core_title: 'Pernas & Abdômen Power',
      r_legs_core_desc: 'Desenvolvimento de quadríceps, posteriores e estabilidade',
      r_back_biceps_title: 'Costas & Bíceps V-Taper',
      r_back_biceps_desc: 'Largura de costas e isolamento de bíceps',
      cat_hypertrophy: 'Hipertrofia',
      cat_strength: 'Força',

      // Exercises
      ex_bench_press_title: 'Supino Reto com Barra',
      ex_bench_press_steps: 'Deite no banco, segure a barra. Baixe até o peito e empurre para cima.',
      ex_incline_dumbbell_title: 'Supino Inclinado 30° com Halteres',
      ex_incline_dumbbell_steps: 'Ajuste o banco a 30°. Empurre os halteres focando na porção superior.',
      ex_squat_title: 'Agachamento com Barra',
      ex_squat_steps: 'Posicione a barra no trapézio. Desça flexionando joelhos abaixo do paralelo.',
      ex_deadlift_title: 'Levantamento Terra Convencional',
      ex_deadlift_steps: 'Pés na largura do quadril. Costas neutras, ative a cadeia posterior.',
      ex_lat_pulldown_title: 'Puxada Frontal Pegada Aberta',
      ex_lat_pulldown_steps: 'Puxe a barra até a parte superior do peito contraindo as escápulas.',
      ex_overhead_press_title: 'Desenvolvimento Militar em Pé',
      ex_overhead_press_steps: 'Empurre a barra acima da cabeça partindo das clavículas.',
      ex_bicep_curl_title: 'Rosca Bíceps com Halteres',
      ex_bicep_curl_steps: 'Em pé, flexione os cotovelos supinando o pulso no topo.',
      ex_tricep_dips_title: 'Paralelas para Tríceps',
      ex_tricep_dips_steps: 'Desça até 90° nos cotovelos e empurre com força.',
      ex_pushups_title: 'Flexões de Braço (Casa)',
      ex_pushups_steps: 'Mãos no chão na largura dos ombros. Abdômen firme, desça o peito ao chão.',
      ex_plank_title: 'Prancha Abdominal Isométrica',
      ex_plank_steps: 'Apoio nos antebraços. Mantenha o corpo reto sem deixar o quadril cair.',

      // Badges
      badge_first_sweat: 'Primeiro Treino',
      badge_bench_100: 'Supino 100kg',
      badge_streak_7: 'Sequência de 7 Dias',
      badge_macro_master: 'Mestre Macro',
      badge_century_squat: 'Agachamento 100k',
      badge_iron_beast: 'Besta de Ferro 50k'
    }
  };

  // --- AUDIO SYNTHESIZER ---
  class SoundEngine {
    constructor() {
      this.enabled = true;
      this.audioCtx = null;
    }

    initCtx() {
      if (!this.audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.audioCtx = new AudioContext();
        }
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
    }

    beep(freq = 880, duration = 0.1, type = 'sine') {
      if (!this.enabled) return;
      try {
        this.initCtx();
        if (!this.audioCtx) return;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
        gain.gain.setValueAtTime(0.15, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start();
        osc.stop(this.audioCtx.currentTime + duration);
      } catch (e) {
        console.warn('Audio play error', e);
      }
    }

    playCountdownBeep() {
      this.beep(880, 0.08, 'sine');
    }

    playRestCompleteFanfare() {
      this.beep(1046.5, 0.15, 'triangle');
      setTimeout(() => this.beep(1318.5, 0.15, 'triangle'), 150);
      setTimeout(() => this.beep(1567.98, 0.3, 'triangle'), 300);
    }
  }

  const sounds = new SoundEngine();

  // --- EXERCISE DATABASE ---
  const EXERCISES = [
    {
      id: 'ex_bench_press',
      title_key: 'ex_bench_press_title',
      steps_key: 'ex_bench_press_steps',
      muscle: 'Chest',
      equipment: 'Barbell',
      difficulty: 'intermediate',
      image: 'assets/images/workout.jpg',
      defaultWeight: 80,
      defaultReps: 8
    },
    {
      id: 'ex_incline_dumbbell',
      title_key: 'ex_incline_dumbbell_title',
      steps_key: 'ex_incline_dumbbell_steps',
      muscle: 'Chest',
      equipment: 'Dumbbell',
      difficulty: 'intermediate',
      image: 'assets/images/workout.jpg',
      defaultWeight: 28,
      defaultReps: 10
    },
    {
      id: 'ex_squat',
      title_key: 'ex_squat_title',
      steps_key: 'ex_squat_steps',
      muscle: 'Legs',
      equipment: 'Barbell',
      difficulty: 'advanced',
      image: 'assets/images/hero.jpg',
      defaultWeight: 100,
      defaultReps: 6
    },
    {
      id: 'ex_deadlift',
      title_key: 'ex_deadlift_title',
      steps_key: 'ex_deadlift_steps',
      muscle: 'Back',
      equipment: 'Barbell',
      difficulty: 'advanced',
      image: 'assets/images/hero.jpg',
      defaultWeight: 120,
      defaultReps: 5
    },
    {
      id: 'ex_lat_pulldown',
      title_key: 'ex_lat_pulldown_title',
      steps_key: 'ex_lat_pulldown_steps',
      muscle: 'Back',
      equipment: 'Machine',
      difficulty: 'beginner',
      image: 'assets/images/workout.jpg',
      defaultWeight: 60,
      defaultReps: 12
    },
    {
      id: 'ex_overhead_press',
      title_key: 'ex_overhead_press_title',
      steps_key: 'ex_overhead_press_steps',
      muscle: 'Shoulders',
      equipment: 'Barbell',
      difficulty: 'intermediate',
      image: 'assets/images/workout.jpg',
      defaultWeight: 50,
      defaultReps: 8
    },
    {
      id: 'ex_bicep_curl',
      title_key: 'ex_bicep_curl_title',
      steps_key: 'ex_bicep_curl_steps',
      muscle: 'Arms',
      equipment: 'Dumbbell',
      difficulty: 'beginner',
      image: 'assets/images/workout.jpg',
      defaultWeight: 14,
      defaultReps: 12
    },
    {
      id: 'ex_tricep_dips',
      title_key: 'ex_tricep_dips_title',
      steps_key: 'ex_tricep_dips_steps',
      muscle: 'Arms',
      equipment: 'Bodyweight',
      difficulty: 'intermediate',
      image: 'assets/images/workout.jpg',
      defaultWeight: 0,
      defaultReps: 12
    },
    {
      id: 'ex_pushups',
      title_key: 'ex_pushups_title',
      steps_key: 'ex_pushups_steps',
      muscle: 'Chest',
      equipment: 'Bodyweight',
      difficulty: 'beginner',
      image: 'assets/images/workout.jpg',
      defaultWeight: 0,
      defaultReps: 20
    },
    {
      id: 'ex_plank',
      title_key: 'ex_plank_title',
      steps_key: 'ex_plank_steps',
      muscle: 'Core',
      equipment: 'Bodyweight',
      difficulty: 'beginner',
      image: 'assets/images/hero.jpg',
      defaultWeight: 0,
      defaultReps: 60
    }
  ];

  // --- ROUTINES DATABASE ---
  const INITIAL_ROUTINES = [
    {
      id: 'routine_chest_triceps',
      title_key: 'r_chest_triceps_title',
      desc_key: 'r_chest_triceps_desc',
      category_key: 'cat_hypertrophy',
      exercises: ['ex_bench_press', 'ex_incline_dumbbell', 'ex_tricep_dips', 'ex_pushups']
    },
    {
      id: 'routine_legs_core',
      title_key: 'r_legs_core_title',
      desc_key: 'r_legs_core_desc',
      category_key: 'cat_strength',
      exercises: ['ex_squat', 'ex_plank']
    },
    {
      id: 'routine_back_biceps',
      title_key: 'r_back_biceps_title',
      desc_key: 'r_back_biceps_desc',
      category_key: 'cat_hypertrophy',
      exercises: ['ex_deadlift', 'ex_lat_pulldown', 'ex_bicep_curl']
    }
  ];

  // --- STATE CONTAINER ---
  let appState = {
    lang: 'it',
    streak: 7,
    kcalBurned: 640,
    totalVolume: 14850,
    prCount: 3,
    soundEnabled: true,
    activeTab: 'tab-dashboard',

    muscleFatigue: {
      Chest: 75,
      Back: 30,
      Legs: 15,
      Shoulders: 45,
      Arms: 60,
      Core: 80
    },

    activeSession: null,

    nutrition: {
      goalKcal: 2500,
      goalProtein: 180,
      goalCarbs: 280,
      goalFats: 70,
      waterLiters: 2.5,
      meals: [
        { name: 'Oatmeal Proteico & Banana', kcal: 420, p: 30, c: 55, f: 8 },
        { name: 'Petto di Pollo, Riso & Broccoli', kcal: 650, p: 52, c: 68, f: 7 },
        { name: 'Shake Whey & Noci', kcal: 320, p: 32, c: 10, f: 14 },
        { name: 'Salmone alla Griglia & Quinoa', kcal: 550, p: 48, c: 45, f: 22 }
      ]
    },

    routines: [...INITIAL_ROUTINES],

    chatMessages: []
  };

  function t(key) {
    const dict = TRANSLATIONS[appState.lang] || TRANSLATIONS['it'];
    return dict[key] || TRANSLATIONS['it'][key] || key;
  }

  function setLanguage(lang) {
    if (!TRANSLATIONS[lang]) lang = 'it';
    appState.lang = lang;

    // Update HTML lang attribute
    document.documentElement.lang = lang;

    // Update Language select box
    const langSelect = document.getElementById('langSelect');
    if (langSelect) langSelect.value = lang;

    // Translate all elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const translation = t(key);
      if (translation) el.innerHTML = translation;
    });

    // Translate placeholders
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      const key = el.getAttribute('data-i18n-ph');
      const translation = t(key);
      if (translation) el.placeholder = translation;
    });

    // Re-render dynamic components
    renderMuscleHeatmap();
    renderDashboardRoutines();
    renderExerciseCatalog();
    renderNutrition();
    renderBadges();
    renderChat();
    if (appState.activeSession) renderActiveSessionView();

    saveState();
  }

  function loadState() {
    try {
      const saved = localStorage.getItem('aurafit_pro_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        appState = { ...appState, ...parsed };
      }
      appState.routines = INITIAL_ROUTINES;
    } catch (e) {
      console.warn('Could not load local storage state', e);
    }
  }

  function saveState() {
    try {
      localStorage.setItem('aurafit_pro_state', JSON.stringify(appState));
    } catch (e) {
      console.warn('Could not save state', e);
    }
  }

  // --- UI RENDER FUNCTIONS ---

  function initNavigation() {
    const navButtons = document.querySelectorAll('.nav-item');
    navButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');
        switchTab(targetTab);
      });
    });

    document.getElementById('quickStartWorkoutBtn')?.addEventListener('click', () => {
      startSession('routine_chest_triceps');
      switchTab('tab-session');
    });

    document.getElementById('generateAiWorkoutBtn')?.addEventListener('click', () => {
      switchTab('tab-aicoach');
      sendChatMessage(t('chip_bench'));
    });

    document.getElementById('viewFullHeatmapBtn')?.addEventListener('click', () => {
      switchTab('tab-dashboard');
      document.getElementById('dashBodyMap')?.scrollIntoView({ behavior: 'smooth' });
    });

    document.getElementById('navToWorkoutsBtn')?.addEventListener('click', () => {
      switchTab('tab-workouts');
    });

    document.getElementById('startSampleSessionBtn')?.addEventListener('click', () => {
      startSession('routine_chest_triceps');
    });

    document.getElementById('soundToggleBtn')?.addEventListener('click', () => {
      appState.soundEnabled = !appState.soundEnabled;
      sounds.enabled = appState.soundEnabled;
      const icon = document.getElementById('soundIcon');
      if (icon) {
        icon.className = appState.soundEnabled ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark text-danger';
      }
    });

    // Language Dropdown Events
    const langSelect = document.getElementById('langSelect');
    if (langSelect) {
      langSelect.addEventListener('change', (e) => setLanguage(e.target.value));
      langSelect.addEventListener('input', (e) => setLanguage(e.target.value));
    }
  }

  function switchTab(tabId) {
    appState.activeTab = tabId;
    document.querySelectorAll('.tab-page').forEach(page => page.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));

    const targetPage = document.getElementById(tabId);
    if (targetPage) targetPage.classList.add('active');

    const activeNav = document.querySelector(`.nav-item[data-tab="${tabId}"]`);
    if (activeNav) activeNav.classList.add('active');

    window.scrollTo({ top: 0, behavior: 'smooth' });
    saveState();
  }

  // Render SVG Heatmap
  function renderMuscleHeatmap() {
    const container = document.getElementById('dashBodyMap');
    if (!container) return;

    const getMuscleColor = (group) => {
      const fatigue = appState.muscleFatigue[group] || 0;
      if (fatigue > 70) return '#FF3B30';
      if (fatigue > 40) return '#FFD700';
      return '#CCFF00';
    };

    container.innerHTML = `
      <svg class="muscle-svg" viewBox="0 0 400 320" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(40, 20)">
          <text x="75" y="15" fill="#94A3B8" font-size="12" text-anchor="middle" font-weight="700">FRONT</text>
          <circle cx="75" cy="40" r="16" fill="#1E293B" stroke="#334155" stroke-width="2"/>
          <path class="muscle-group" d="M 50 65 Q 75 60 100 65 L 96 95 Q 75 102 54 95 Z" fill="${getMuscleColor('Chest')}" opacity="0.9"/>
          <path class="muscle-group" d="M 38 65 Q 48 62 52 75 L 42 90 Z" fill="${getMuscleColor('Shoulders')}" opacity="0.9"/>
          <path class="muscle-group" d="M 112 65 Q 102 62 98 75 L 108 90 Z" fill="${getMuscleColor('Shoulders')}" opacity="0.9"/>
          <path class="muscle-group" d="M 56 98 L 94 98 L 90 145 L 60 145 Z" fill="${getMuscleColor('Core')}" opacity="0.9"/>
          <path class="muscle-group" d="M 36 92 L 48 92 L 44 125 L 34 120 Z" fill="${getMuscleColor('Arms')}" opacity="0.9"/>
          <path class="muscle-group" d="M 114 92 L 102 92 L 106 125 L 116 120 Z" fill="${getMuscleColor('Arms')}" opacity="0.9"/>
          <path class="muscle-group" d="M 55 150 L 73 150 L 70 230 L 58 230 Z" fill="${getMuscleColor('Legs')}" opacity="0.9"/>
          <path class="muscle-group" d="M 77 150 L 95 150 L 92 230 L 80 230 Z" fill="${getMuscleColor('Legs')}" opacity="0.9"/>
        </g>

        <g transform="translate(220, 20)">
          <text x="75" y="15" fill="#94A3B8" font-size="12" text-anchor="middle" font-weight="700">BACK</text>
          <circle cx="75" cy="40" r="16" fill="#1E293B" stroke="#334155" stroke-width="2"/>
          <path class="muscle-group" d="M 45 65 L 105 65 L 95 125 L 55 125 Z" fill="${getMuscleColor('Back')}" opacity="0.9"/>
          <path class="muscle-group" d="M 34 90 L 44 90 L 40 122 L 32 118 Z" fill="${getMuscleColor('Arms')}" opacity="0.9"/>
          <path class="muscle-group" d="M 116 90 L 106 90 L 110 122 L 118 118 Z" fill="${getMuscleColor('Arms')}" opacity="0.9"/>
          <path class="muscle-group" d="M 52 130 L 98 130 L 94 175 L 56 175 Z" fill="${getMuscleColor('Legs')}" opacity="0.8"/>
          <path class="muscle-group" d="M 55 178 L 73 178 L 70 235 L 58 235 Z" fill="${getMuscleColor('Legs')}" opacity="0.9"/>
          <path class="muscle-group" d="M 77 178 L 95 178 L 92 235 L 80 235 Z" fill="${getMuscleColor('Legs')}" opacity="0.9"/>
        </g>
      </svg>
    `;
  }

  // Render Routines
  function renderDashboardRoutines() {
    const container = document.getElementById('dashboardRoutineGrid');
    const allRoutinesGrid = document.getElementById('allRoutinesGrid');
    if (!container && !allRoutinesGrid) return;

    const ROUTINE_KEY_MAP = {
      'routine_chest_triceps': { title: 'r_chest_triceps_title', desc: 'r_chest_triceps_desc', cat: 'cat_hypertrophy' },
      'routine_legs_core': { title: 'r_legs_core_title', desc: 'r_legs_core_desc', cat: 'cat_strength' },
      'routine_back_biceps': { title: 'r_back_biceps_title', desc: 'r_back_biceps_desc', cat: 'cat_hypertrophy' }
    };

    const htmlContent = appState.routines.map(r => {
      const keys = ROUTINE_KEY_MAP[r.id] || { title: r.title_key, desc: r.desc_key, cat: r.category_key };
      const title = keys.title ? t(keys.title) : (r.title || r.id);
      const desc = keys.desc ? t(keys.desc) : r.desc;
      const categoryKey = keys.cat || (r.category === 'Forza' ? 'cat_strength' : 'cat_hypertrophy');
      const category = t(categoryKey) || r.category;

      return `
        <div class="routine-card">
          <div>
            <div class="routine-card-header">
              <span class="routine-badge">${category}</span>
              <i class="fa-solid fa-bolt text-lime"></i>
            </div>
            <h3 class="routine-title">${title}</h3>
            <p class="routine-desc">${desc}</p>
            <div class="routine-stats">
              <span><i class="fa-solid fa-list-ol"></i> ${r.exercises.length} ${t('exercises_count')}</span>
              <span><i class="fa-solid fa-clock"></i> ~45 min</span>
            </div>
          </div>
          <button class="btn btn-lime btn-block start-routine-btn" data-id="${r.id}">
            <i class="fa-solid fa-play"></i> ${t('start_now')}
          </button>
        </div>
      `;
    }).join('');

    if (container) container.innerHTML = htmlContent;
    if (allRoutinesGrid) allRoutinesGrid.innerHTML = htmlContent;

    document.querySelectorAll('.start-routine-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        startSession(id);
        switchTab('tab-session');
      });
    });
  }

  // Render Exercises
  function renderExerciseCatalog() {
    const grid = document.getElementById('exerciseCardsGrid');
    const countLabel = document.getElementById('exerciseCountLabel');
    if (!grid) return;

    const searchTerm = document.getElementById('exerciseSearchInput')?.value.toLowerCase() || '';
    const activeMusclePill = document.querySelector('#muscleFilterPills .pill-btn.active')?.getAttribute('data-filter') || 'all';
    const equipmentFilter = document.getElementById('equipmentSelectFilter')?.value || 'all';
    const difficultyFilter = document.getElementById('difficultySelectFilter')?.value || 'all';

    const DIFF_MAP = {
      'principiante': 'diff_beginner',
      'intermedio': 'diff_intermediate',
      'avanzato': 'diff_advanced',
      'beginner': 'diff_beginner',
      'intermediate': 'diff_intermediate',
      'advanced': 'diff_advanced'
    };

    const MUSCLE_MAP = {
      'chest': 'muscle_chest',
      'back': 'muscle_back',
      'legs': 'muscle_legs',
      'shoulders': 'muscle_shoulders',
      'arms': 'muscle_arms',
      'core': 'muscle_core'
    };

    const EQUIP_MAP = {
      'barbell': 'equip_barbell',
      'dumbbell': 'equip_dumbbell',
      'bodyweight': 'equip_bodyweight',
      'machine': 'equip_machine'
    };

    const filtered = EXERCISES.filter(ex => {
      const titleTranslated = t(ex.title_key).toLowerCase();
      const matchSearch = titleTranslated.includes(searchTerm) || ex.muscle.toLowerCase().includes(searchTerm);
      const matchMuscle = activeMusclePill === 'all' || ex.muscle === activeMusclePill;
      const matchEquipment = equipmentFilter === 'all' || ex.equipment === equipmentFilter;
      const matchDiff = difficultyFilter === 'all' || ex.difficulty === difficultyFilter;
      return matchSearch && matchMuscle && matchEquipment && matchDiff;
    });

    if (countLabel) countLabel.innerText = filtered.length;

    grid.innerHTML = filtered.map(ex => {
      const title = t(ex.title_key);
      const steps = t(ex.steps_key);
      const muscleKey = MUSCLE_MAP[ex.muscle.toLowerCase()] || `muscle_${ex.muscle.toLowerCase()}`;
      const equipKey = EQUIP_MAP[ex.equipment.toLowerCase()] || `equip_${ex.equipment.toLowerCase()}`;
      const diffKey = DIFF_MAP[ex.difficulty.toLowerCase()] || `diff_${ex.difficulty.toLowerCase()}`;

      const muscleLabel = t(muscleKey) || ex.muscle;
      const equipLabel = t(equipKey) || ex.equipment;
      const diffLabel = t(diffKey) || ex.difficulty;

      return `
        <div class="exercise-card">
          <div class="ex-media-box" style="background-image: url('${ex.image}');">
            <div class="ex-media-overlay"></div>
            <div class="ex-badges-row">
              <span class="badge-tag">${muscleLabel}</span>
              <span class="badge-tag">${equipLabel}</span>
            </div>
          </div>
          <div class="ex-body">
            <div>
              <h3 class="ex-title">${title}</h3>
              <p class="ex-meta"><i class="fa-solid fa-signal text-lime"></i> ${diffLabel}</p>
              <p class="ex-steps">${steps}</p>
            </div>
            <div class="ex-footer">
              <span class="text-muted" style="font-size: 0.78rem;">${ex.defaultWeight}kg x ${ex.defaultReps}</span>
              <button class="btn btn-sm btn-outline-lime quick-add-ex-btn" data-id="${ex.id}">
                <i class="fa-solid fa-plus"></i>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  function initExerciseCatalogEvents() {
    document.getElementById('exerciseSearchInput')?.addEventListener('input', renderExerciseCatalog);
    document.getElementById('equipmentSelectFilter')?.addEventListener('change', renderExerciseCatalog);
    document.getElementById('difficultySelectFilter')?.addEventListener('change', renderExerciseCatalog);

    const pills = document.querySelectorAll('#muscleFilterPills .pill-btn');
    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        renderExerciseCatalog();
      });
    });

    const subtabs = document.querySelectorAll('.subtab-btn');
    subtabs.forEach(st => {
      st.addEventListener('click', () => {
        subtabs.forEach(s => s.classList.remove('active'));
        st.classList.add('active');
        const targetId = st.getAttribute('data-subtab');
        document.querySelectorAll('.subtab-content').forEach(sc => sc.classList.remove('active'));
        document.getElementById(targetId)?.classList.add('active');
      });
    });

    document.getElementById('runCalcBtn')?.addEventListener('click', () => {
      const w = parseFloat(document.getElementById('calcWeight').value) || 0;
      const r = parseInt(document.getElementById('calcReps').value) || 1;
      if (w <= 0) return;

      const oneRM = Math.round(w * (1 + r / 30) * 10) / 10;
      document.getElementById('calc1RMVal').innerText = `${oneRM} kg`;
      document.getElementById('pct95').innerText = `${Math.round(oneRM * 0.95 * 10) / 10} kg`;
      document.getElementById('pct85').innerText = `${Math.round(oneRM * 0.85 * 10) / 10} kg`;
      document.getElementById('pct75').innerText = `${Math.round(oneRM * 0.75 * 10) / 10} kg`;
      document.getElementById('pct65').innerText = `${Math.round(oneRM * 0.65 * 10) / 10} kg`;
    });
  }

  function startSession(routineId) {
    const routine = appState.routines.find(r => r.id === routineId) || appState.routines[0];

    appState.activeSession = {
      routineTitleKey: routine.title_key || 'r_chest_triceps_title',
      durationSec: 0,
      intervalId: null,
      restSec: 60,
      restMaxSec: 60,
      restIntervalId: null,
      exercises: routine.exercises.map(exId => {
        const ex = EXERCISES.find(e => e.id === exId) || EXERCISES[0];
        return {
          id: ex.id,
          title_key: ex.title_key,
          sets: [
            { weight: ex.defaultWeight, reps: ex.defaultReps, completed: false },
            { weight: ex.defaultWeight, reps: ex.defaultReps, completed: false },
            { weight: ex.defaultWeight, reps: ex.defaultReps, completed: false }
          ]
        };
      })
    };

    appState.activeSession.intervalId = setInterval(() => {
      if (appState.activeSession) {
        appState.activeSession.durationSec++;
        updateSessionClock();
      }
    }, 1000);

    renderActiveSessionView();
  }

  function updateSessionClock() {
    const clock = document.getElementById('sessionDurationClock');
    if (!clock || !appState.activeSession) return;
    const s = appState.activeSession.durationSec;
    const mins = String(Math.floor(s / 60)).padStart(2, '0');
    const secs = String(s % 60).padStart(2, '0');
    clock.innerText = `${mins}:${secs}`;
  }

  function renderActiveSessionView() {
    const noSessionView = document.getElementById('noActiveSessionView');
    const activeSessionView = document.getElementById('activeSessionView');

    if (!appState.activeSession) {
      noSessionView?.classList.remove('hidden');
      activeSessionView?.classList.add('hidden');
      return;
    }

    noSessionView?.classList.add('hidden');
    activeSessionView?.classList.remove('hidden');

    document.getElementById('activeRoutineTitle').innerText = t(appState.activeSession.routineTitleKey);

    const container = document.getElementById('sessionExercisesContainer');
    if (!container) return;

    container.innerHTML = appState.activeSession.exercises.map((ex, exIdx) => `
      <div class="session-ex-card">
        <div class="session-ex-header">
          <h3>${t(ex.title_key)}</h3>
          <button class="btn btn-sm btn-dark add-set-btn" data-exidx="${exIdx}">
            <i class="fa-solid fa-plus"></i> Set
          </button>
        </div>

        <table class="set-table">
          <thead>
            <tr>
              <th>SET</th>
              <th>KG</th>
              <th>REPS</th>
              <th>DONE</th>
            </tr>
          </thead>
          <tbody>
            ${ex.sets.map((set, setIdx) => `
              <tr>
                <td><strong>#${setIdx + 1}</strong></td>
                <td><input type="number" class="set-input set-weight-input" data-exidx="${exIdx}" data-setidx="${setIdx}" value="${set.weight}"></td>
                <td><input type="number" class="set-input set-reps-input" data-exidx="${exIdx}" data-setidx="${setIdx}" value="${set.reps}"></td>
                <td>
                  <button class="set-check-btn ${set.completed ? 'completed' : ''}" data-exidx="${exIdx}" data-setidx="${setIdx}">
                    <i class="fa-solid fa-check"></i>
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `).join('');

    container.querySelectorAll('.set-check-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const exIdx = parseInt(e.currentTarget.getAttribute('data-exidx'));
        const setIdx = parseInt(e.currentTarget.getAttribute('data-setidx'));
        const setObj = appState.activeSession.exercises[exIdx].sets[setIdx];

        setObj.completed = !setObj.completed;
        if (setObj.completed) {
          sounds.beep(900, 0.1, 'sine');
          triggerRestTimer();
        }
        renderActiveSessionView();
      });
    });

    container.querySelectorAll('.add-set-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const exIdx = parseInt(e.currentTarget.getAttribute('data-exidx'));
        const lastSet = appState.activeSession.exercises[exIdx].sets.slice(-1)[0] || { weight: 50, reps: 10 };
        appState.activeSession.exercises[exIdx].sets.push({ weight: lastSet.weight, reps: lastSet.reps, completed: false });
        renderActiveSessionView();
      });
    });
  }

  function triggerRestTimer(sec = 60) {
    if (!appState.activeSession) return;
    clearInterval(appState.activeSession.restIntervalId);
    appState.activeSession.restSec = sec;
    appState.activeSession.restMaxSec = sec;

    updateRestTimerUI();
    appState.activeSession.restIntervalId = setInterval(() => {
      if (!appState.activeSession) return;
      if (appState.activeSession.restSec > 0) {
        appState.activeSession.restSec--;
        if (appState.activeSession.restSec <= 3 && appState.activeSession.restSec > 0) {
          sounds.playCountdownBeep();
        }
        updateRestTimerUI();
      } else {
        clearInterval(appState.activeSession.restIntervalId);
        sounds.playRestCompleteFanfare();
        document.getElementById('rtTargetLabel').innerText = 'REST COMPLETE!';
      }
    }, 1000);
  }

  function updateRestTimerUI() {
    if (!appState.activeSession) return;
    const rem = appState.activeSession.restSec;
    const max = appState.activeSession.restMaxSec || 60;
    const mins = String(Math.floor(rem / 60)).padStart(2, '0');
    const secs = String(rem % 60).padStart(2, '0');

    const display = document.getElementById('rtTimeRemaining');
    if (display) display.innerText = `${mins}:${secs}`;

    const circle = document.getElementById('rtProgressCircle');
    if (circle) {
      const circumference = 283;
      const offset = circumference - (rem / max) * circumference;
      circle.style.strokeDashoffset = offset;
    }
  }

  function initSessionEvents() {
    document.getElementById('finishWorkoutBtn')?.addEventListener('click', () => {
      if (!appState.activeSession) return;
      clearInterval(appState.activeSession.intervalId);
      clearInterval(appState.activeSession.restIntervalId);

      let sessionVol = 0;
      appState.activeSession.exercises.forEach(ex => {
        ex.sets.forEach(s => {
          if (s.completed) sessionVol += (s.weight * s.reps);
        });
      });

      appState.totalVolume += sessionVol;
      appState.kcalBurned += 320;
      appState.activeSession = null;

      sounds.playRestCompleteFanfare();
      alert(`🎉 Workout Complete! Volume: ${sessionVol} kg!`);

      saveState();
      renderActiveSessionView();
      renderMuscleHeatmap();
    });

    document.getElementById('rtMinus15')?.addEventListener('click', () => {
      if (appState.activeSession && appState.activeSession.restSec > 15) {
        appState.activeSession.restSec -= 15;
        updateRestTimerUI();
      }
    });

    document.getElementById('rtPlus15')?.addEventListener('click', () => {
      if (appState.activeSession) {
        appState.activeSession.restSec += 15;
        appState.activeSession.restMaxSec += 15;
        updateRestTimerUI();
      }
    });

    document.querySelectorAll('.preset-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const sec = parseInt(btn.getAttribute('data-sec'));
        triggerRestTimer(sec);
      });
    });
  }

  function renderNutrition() {
    const mealList = document.getElementById('todayMealsContainer');
    if (!mealList) return;

    let totKcal = 0, totP = 0, totC = 0, totF = 0;
    appState.nutrition.meals.forEach(m => {
      totKcal += m.kcal;
      totP += m.p;
      totC += m.c;
      totF += m.f;
    });

    document.getElementById('nutriKcalLogged').innerText = totKcal.toLocaleString();
    document.getElementById('proteinVal').innerText = Math.round(totP);
    document.getElementById('carbsVal').innerText = Math.round(totC);
    document.getElementById('fatsVal').innerText = Math.round(totF);

    document.getElementById('proteinFill').style.width = `${Math.min(100, (totP / appState.nutrition.goalProtein) * 100)}%`;
    document.getElementById('carbsFill').style.width = `${Math.min(100, (totC / appState.nutrition.goalCarbs) * 100)}%`;
    document.getElementById('fatsFill').style.width = `${Math.min(100, (totF / appState.nutrition.goalFats) * 100)}%`;

    const circle = document.getElementById('calorieCircleFill');
    if (circle) {
      const circumference = 327;
      const pct = Math.min(1, totKcal / appState.nutrition.goalKcal);
      circle.style.strokeDashoffset = circumference - (pct * circumference);
    }

    mealList.innerHTML = appState.nutrition.meals.map((m, idx) => `
      <div class="meal-item-card">
        <div class="meal-info">
          <h4>${m.name}</h4>
          <span>P: ${m.p}g | C: ${m.c}g | F: ${m.f}g</span>
        </div>
        <div style="display: flex; align-items: center; gap: 12px;">
          <span class="meal-kcal">${m.kcal} kcal</span>
          <button class="btn btn-sm btn-dark remove-meal-btn" data-idx="${idx}">&times;</button>
        </div>
      </div>
    `).join('');

    mealList.querySelectorAll('.remove-meal-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.getAttribute('data-idx'));
        appState.nutrition.meals.splice(idx, 1);
        saveState();
        renderNutrition();
      });
    });
  }

  function initNutritionEvents() {
    document.getElementById('addWaterBtn')?.addEventListener('click', () => {
      appState.nutrition.waterLiters = Math.round((appState.nutrition.waterLiters + 0.25) * 100) / 100;
      document.getElementById('waterLiters').innerText = appState.nutrition.waterLiters;
      sounds.beep(1200, 0.05, 'sine');
      saveState();
    });

    const foodModal = document.getElementById('addFoodModal');
    document.getElementById('openLogFoodModalBtn')?.addEventListener('click', () => foodModal?.classList.remove('hidden'));
    document.getElementById('closeFoodModalBtn')?.addEventListener('click', () => foodModal?.classList.add('hidden'));
    document.getElementById('cancelFoodModalBtn')?.addEventListener('click', () => foodModal?.classList.add('hidden'));

    document.getElementById('confirmAddFoodBtn')?.addEventListener('click', () => {
      const name = document.getElementById('foodNameInput').value || 'Custom Item';
      const kcal = parseInt(document.getElementById('foodKcalInput').value) || 200;
      const p = parseFloat(document.getElementById('foodProteinInput').value) || 15;
      const c = parseFloat(document.getElementById('foodCarbsInput').value) || 20;
      const f = parseFloat(document.getElementById('foodFatsInput').value) || 5;

      appState.nutrition.meals.push({ name, kcal, p, c, f });
      saveState();
      renderNutrition();
      foodModal?.classList.add('hidden');
    });

    document.querySelectorAll('.chip-food-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.getElementById('foodNameInput').value = btn.getAttribute('data-name');
        document.getElementById('foodKcalInput').value = parseInt(btn.getAttribute('data-kcal'));
        document.getElementById('foodProteinInput').value = parseFloat(btn.getAttribute('data-p'));
        document.getElementById('foodCarbsInput').value = parseFloat(btn.getAttribute('data-c'));
        document.getElementById('foodFatsInput').value = parseFloat(btn.getAttribute('data-f'));
      });
    });
  }

  function sendChatMessage(text) {
    if (!text.trim()) return;

    appState.chatMessages.push({ sender: 'user', text, time: 'Now' });
    renderChat();

    setTimeout(() => {
      const lower = text.toLowerCase();
      let responseKey = 'ai_default_resp';

      if (lower.includes('panca') || lower.includes('bench') || lower.includes('press') || lower.includes('couché') || lower.includes('banca') || lower.includes('drücken') || lower.includes('supino') || lower.includes('massimale') || lower.includes('max')) {
        responseKey = 'ai_resp_bench';
      } else if (lower.includes('riposo') || lower.includes('rest') || lower.includes('repos') || lower.includes('descanso') || lower.includes('pause')) {
        responseKey = 'ai_resp_rest';
      } else if (lower.includes('mangiare') || lower.includes('dieta') || lower.includes('diet') || lower.includes('meal') || lower.includes('repas') || lower.includes('comida') || lower.includes('nutrizione') || lower.includes('nutrition') || lower.includes('ernährung') || lower.includes('essen')) {
        responseKey = 'ai_resp_nutrition';
      }

      appState.chatMessages.push({ sender: 'bot', key: responseKey, text: t(responseKey), time: 'Now' });
      saveState();
      renderChat();
    }, 600);
  }

  function renderChat() {
    const box = document.getElementById('chatMessagesBox');
    if (!box) return;

    if (!appState.chatMessages || appState.chatMessages.length === 0) {
      appState.chatMessages = [
        { sender: 'bot', key: 'ai_greeting', text: t('ai_greeting'), time: 'Now' }
      ];
    } else {
      // Ensure initial greeting is keyed
      if (appState.chatMessages[0] && appState.chatMessages[0].sender === 'bot') {
        appState.chatMessages[0].key = appState.chatMessages[0].key || 'ai_greeting';
      }
    }

    box.innerHTML = appState.chatMessages.map(m => {
      let content = m.text;
      // Dynamically resolve translation key if key is present or if text is a raw translation key
      if (m.key) {
        content = t(m.key);
      } else if (m.text && (TRANSLATIONS[appState.lang]?.[m.text] || TRANSLATIONS['it']?.[m.text])) {
        content = t(m.text);
      }
      return `
        <div class="chat-bubble ${m.sender === 'user' ? 'user-bubble' : 'bot-bubble'}">
          <p>${content ? content.replace(/\n/g, '<br>') : ''}</p>
          <span class="chat-time">${m.time}</span>
        </div>
      `;
    }).join('');

    box.scrollTop = box.scrollHeight;
  }

  function initChatEvents() {
    document.getElementById('sendChatBtn')?.addEventListener('click', () => {
      const input = document.getElementById('chatUserInput');
      if (input) {
        sendChatMessage(input.value);
        input.value = '';
      }
    });

    document.getElementById('chatUserInput')?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendChatMessage(e.target.value);
        e.target.value = '';
      }
    });

    document.querySelectorAll('.chip-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const promptKey = btn.getAttribute('data-i18n');
        const promptText = btn.innerText || btn.getAttribute('data-prompt');
        sendChatMessage(promptText);
      });
    });
  }

  function renderBadges() {
    const container = document.getElementById('badgesContainer');
    if (!container) return;

    const BADGES = [
      { key: 'badge_first_sweat', icon: '⚡', unlocked: true },
      { key: 'badge_bench_100', icon: '🏋️‍♂️', unlocked: true },
      { key: 'badge_streak_7', icon: '🔥', unlocked: true },
      { key: 'badge_macro_master', icon: '🥗', unlocked: true },
      { key: 'badge_century_squat', icon: '🦵', unlocked: false },
      { key: 'badge_iron_beast', icon: '🏆', unlocked: false }
    ];

    container.innerHTML = BADGES.map(b => `
      <div class="badge-item ${b.unlocked ? '' : 'locked'}">
        <span class="badge-icon">${b.icon}</span>
        <span class="badge-title">${t(b.key)}</span>
      </div>
    `).join('');
  }

  // INITIALIZATION
  document.addEventListener('DOMContentLoaded', () => {
    loadState();

    if (!appState.lang) {
      const browserLang = (navigator.language || 'it').substring(0, 2).toLowerCase();
      appState.lang = TRANSLATIONS[browserLang] ? browserLang : 'it';
    }

    initNavigation();
    initExerciseCatalogEvents();
    initSessionEvents();
    initNutritionEvents();
    initChatEvents();

    setLanguage(appState.lang);
  });

})();

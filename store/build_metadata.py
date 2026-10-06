"""Genera fastlane/metadata/<locale>/*.txt e verifica i limiti di App Store Connect.

Uso:  python store/build_metadata.py
I testi descrivono solo funzioni presenti nell'app (linea guida Apple 2.3.1).
"""
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "fastlane", "metadata")

LIMITS = {"name": 30, "subtitle": 30, "keywords": 100, "promotional_text": 170, "description": 4000}

PRIVACY_URL = "https://konechoco.github.io/auralift/privacy-policy.html"
TERMS_URL = "https://www.apple.com/legal/internet-services/itunes/dev/stdeula/"
SUPPORT_URL = "https://konechoco.github.io/auralift/support.html"

LOCALES = {
    # ---------------------------------------------------------------- ITALIANO
    "it": {
        "name": "AuraLift: Allenamento Palestra",
        "subtitle": "Schede, Casa, Coach e Dieta",
        "keywords": "fitness,workout,esercizi,muscoli,massa,pesi,bodybuilding,tracker,calorie,macro,proteine,timer,1rm",
        "promotional_text": "Schede per palestra e casa, registro serie, recupero muscolare calcolato dai tuoi allenamenti, grafici, macro e Smart Coach. Premium: 7 giorni gratis.",
        "description": """AuraLift è il tuo personal trainer tascabile per allenarti in palestra o a casa: registri ogni serie e vedi i tuoi progressi reali, calcolati solo dai tuoi dati.

SCHEDE PER PALESTRA E CASA
• 12 schede pronte: full body, push/pull/legs, upper/lower, forza 5×5, glutei, corpo libero, manubri, brucia grassi e addome
• Generatore di allenamenti: sceglie gli esercizi in base a obiettivo, attrezzatura e muscoli già recuperati
• Crea e modifica le tue schede personali
• Oltre 60 esercizi con istruzioni e mappa dei muscoli coinvolti

REGISTRO ALLENAMENTO
• Peso, ripetizioni e serie completate in pochi tocchi
• Colonna "Precedente" con i carichi dell'ultima volta
• Suggerimento di sovraccarico progressivo: ti dice quando aumentare il peso
• Timer di recupero automatico con suono, vibrazione e notifica
• Record personali rilevati automaticamente

PROGRESSI E RECUPERO
• Mappa del recupero muscolare calcolata dalle serie degli ultimi 4 giorni
• Volume settimanale, serie per muscolo, massimale stimato per esercizio, peso corporeo
• Calcolatore 1RM con le formule Epley, Brzycki e Lander
• Storico completo, settimane consecutive e traguardi

NUTRIZIONE
• Obiettivi di calorie e macro calcolati con la formula Mifflin-St Jeor
• Diario per colazione, pranzo, cena e spuntini con database di alimenti comuni e alimenti personalizzati
• Contatore dell'acqua

SMART COACH
• Analizza i tuoi allenamenti: recupero, stalli, progressi, volume per muscolo, proteine
• Risponde alle domande su allenamento e alimentazione con linee guida basate su studi scientifici, personalizzate con i tuoi dati
• Informazioni generali che non sostituiscono il parere di un medico

ALTRO
• Promemoria di allenamento, kg o lb, 6 lingue
• I tuoi dati restano sul dispositivo: nessun account richiesto

VERSIONE GRATUITA E PREMIUM
AuraLift è gratuita, con pubblicità non personalizzata e alcuni limiti (3 schede personali, 1 allenamento generato al giorno, storico degli ultimi 30 giorni).
AuraLift Premium elimina la pubblicità e sblocca schede e generatore illimitati, storico completo, grafici avanzati, tutte le analisi dello Smart Coach ed esportazione dei dati.
Premium mensile o annuale, con 7 giorni di prova gratuita. Il pagamento viene addebitato sull'Apple ID al termine della prova. L'abbonamento si rinnova automaticamente se non viene disattivato almeno 24 ore prima della fine del periodo in corso. Puoi gestirlo o annullarlo nelle impostazioni dell'account App Store.

Termini d'uso: {terms}
Privacy: {privacy}

Consulta il tuo medico prima di iniziare un nuovo programma di allenamento o alimentazione.""",
    },
    # ---------------------------------------------------------------- ENGLISH US
    "en-US": {
        "name": "AuraLift: Gym Workout Planner",
        "subtitle": "Home Training, Coach & Diet",
        "keywords": "fitness,tracker,log,lifting,weight,exercise,muscle,bodybuilding,strength,calorie,macro,routine,1rm",
        "promotional_text": "Gym and home plans, set and rep logging, muscle recovery calculated from your workouts, progress charts, macros and Smart Coach. Premium: 7-day free trial.",
        "description": """AuraLift is your pocket personal trainer for the gym or at home: log every set and see real progress, calculated only from your own data.

GYM AND HOME PLANS
• 12 ready-made plans: full body, push/pull/legs, upper/lower, 5×5 strength, glutes, bodyweight, dumbbells, fat burner and abs
• Workout generator: picks exercises based on your goal, equipment and which muscles have recovered
• Build and edit your own routines
• 60+ exercises with instructions and a map of the muscles worked

WORKOUT LOGGER
• Weight, reps and completed sets in a few taps
• "Previous" column showing last session's numbers
• Progressive overload suggestions that tell you when to add weight
• Automatic rest timer with sound, vibration and notification
• Personal records detected automatically

PROGRESS AND RECOVERY
• Muscle recovery map calculated from the sets of the last 4 days
• Weekly volume, sets per muscle, estimated 1RM per exercise, body weight
• 1RM calculator with the Epley, Brzycki and Lander formulas
• Full history, week streaks and achievements

NUTRITION
• Calorie and macro targets calculated with the Mifflin-St Jeor formula
• Food diary for breakfast, lunch, dinner and snacks with a database of common foods plus custom foods
• Water tracker

SMART COACH
• Analyses your workouts: recovery, plateaus, progress, volume per muscle, protein
• Answers training and nutrition questions with evidence-based guidelines personalised with your data
• General information, not a substitute for medical advice

MORE
• Workout reminders, kg or lb, 6 languages
• Your data stays on your device: no account required

FREE AND PREMIUM
AuraLift is free, with non-personalised ads and some limits (3 custom routines, 1 generated workout per day, last 30 days of history).
AuraLift Premium removes ads and unlocks unlimited routines and generator, full history, advanced charts, the complete Smart Coach analysis and data export.
Premium is available monthly or yearly with a 7-day free trial. Payment is charged to your Apple ID when the trial ends. Subscriptions renew automatically unless turned off at least 24 hours before the end of the current period. Manage or cancel in your App Store account settings.

Terms of Use: {terms}
Privacy Policy: {privacy}

Consult your doctor before starting a new exercise or nutrition program.""",
    },
    # ---------------------------------------------------------------- ENGLISH UK
    "en-GB": {
        "name": "AuraLift: Gym & Home Workouts",
        "subtitle": "Weight Training Log & Coach",
        "keywords": "fitness,planner,tracker,lifting,exercise,muscle,bodybuilding,strength,calorie,macro,routine,timer",
        "promotional_text": "Gym and home plans, set and rep logging, muscle recovery calculated from your workouts, progress charts, macros and Smart Coach. Premium: 7-day free trial.",
        "description": None,  # uguale a en-US
    },
    # ---------------------------------------------------------------- ESPAÑOL ES
    "es-ES": {
        "name": "AuraLift: Rutinas de Gimnasio",
        "subtitle": "Entrena en Casa con tu Coach",
        "keywords": "fitness,ejercicios,pesas,musculación,músculo,tracker,calorías,macros,proteína,abdominales,fuerza,1rm",
        "promotional_text": "Rutinas de gimnasio y casa, registro de series, recuperación muscular calculada con tus entrenos, gráficas, macros y Smart Coach. Premium: 7 días gratis.",
        "description": """AuraLift es tu entrenador personal de bolsillo para el gimnasio o en casa: registra cada serie y ve tu progreso real, calculado solo con tus datos.

RUTINAS DE GIMNASIO Y CASA
• 12 rutinas listas: cuerpo completo, empuje/tirón/piernas, torso/pierna, fuerza 5×5, glúteos, peso corporal, mancuernas, quema grasa y abdomen
• Generador de entrenos: elige los ejercicios según tu objetivo, tu material y los músculos ya recuperados
• Crea y edita tus propias rutinas
• Más de 60 ejercicios con instrucciones y mapa de los músculos trabajados

REGISTRO DE ENTRENAMIENTO
• Peso, repeticiones y series completadas en pocos toques
• Columna "Anterior" con las cargas de la última vez
• Sugerencias de sobrecarga progresiva: te dice cuándo subir el peso
• Temporizador de descanso automático con sonido, vibración y notificación
• Récords personales detectados automáticamente

PROGRESO Y RECUPERACIÓN
• Mapa de recuperación muscular calculado con las series de los últimos 4 días
• Volumen semanal, series por músculo, 1RM estimado por ejercicio, peso corporal
• Calculadora de 1RM con las fórmulas de Epley, Brzycki y Lander
• Historial completo, semanas seguidas y logros

NUTRICIÓN
• Objetivos de calorías y macros calculados con la fórmula Mifflin-St Jeor
• Diario de desayuno, comida, cena y tentempiés con base de alimentos comunes y alimentos personalizados
• Contador de agua

SMART COACH
• Analiza tus entrenos: recuperación, estancamientos, progresos, volumen por músculo, proteínas
• Responde a preguntas de entreno y alimentación con pautas basadas en estudios científicos y personalizadas con tus datos
• Información general que no sustituye el consejo médico

ADEMÁS
• Recordatorios de entreno, kg o lb, 6 idiomas
• Tus datos se quedan en tu dispositivo: sin necesidad de cuenta

VERSIÓN GRATUITA Y PREMIUM
AuraLift es gratuita, con anuncios no personalizados y algunos límites (3 rutinas propias, 1 entreno generado al día, historial de los últimos 30 días).
AuraLift Premium elimina los anuncios y desbloquea rutinas y generador ilimitados, historial completo, gráficas avanzadas, todo el análisis del Smart Coach y la exportación de datos.
Premium mensual o anual, con 7 días de prueba gratuita. El pago se carga en tu Apple ID al terminar la prueba. La suscripción se renueva automáticamente salvo que la desactives al menos 24 horas antes del final del periodo actual. Gestiona o cancela en los ajustes de tu cuenta del App Store.

Términos de uso: {terms}
Privacidad: {privacy}

Consulta a tu médico antes de empezar un nuevo programa de ejercicio o alimentación.""",
    },
    # ---------------------------------------------------------------- ESPAÑOL MX
    "es-MX": {
        "name": "AuraLift: Ejercicios en el Gym",
        "subtitle": "Rutinas, Pesas y Entrenador",
        "keywords": "fitness,gimnasio,entrenamiento,casa,músculo,tracker,calorías,dieta,proteína,abdominales,fuerza,1rm",
        "promotional_text": "Rutinas de gimnasio y casa, registro de series, recuperación muscular calculada con tus entrenos, gráficas, macros y Smart Coach. Premium: 7 días gratis.",
        "description": None,  # uguale a es-ES
    },
    # ---------------------------------------------------------------- FRANÇAIS
    "fr-FR": {
        "name": "AuraLift: Musculation & Sport",
        "subtitle": "Salle, Maison & Coach",
        "keywords": "fitness,entraînement,exercices,programme,muscle,gym,suivi,calories,macros,protéines,abdos,régime,1rm",
        "promotional_text": "Programmes salle et maison, suivi des séries, récupération musculaire calculée sur vos séances, graphiques, macros et Smart Coach. Premium : 7 jours offerts.",
        "description": """AuraLift est votre coach personnel de poche, à la salle ou à la maison : enregistrez chaque série et suivez vos vrais progrès, calculés uniquement à partir de vos données.

PROGRAMMES SALLE ET MAISON
• 12 programmes prêts : full body, push/pull/legs, haut/bas du corps, force 5×5, fessiers, poids du corps, haltères, brûle-graisse et abdos
• Générateur de séances : choisit les exercices selon votre objectif, votre matériel et les muscles déjà récupérés
• Créez et modifiez vos propres programmes
• Plus de 60 exercices avec instructions et carte des muscles sollicités

SUIVI DE SÉANCE
• Poids, répétitions et séries terminées en quelques touches
• Colonne « Précédent » avec les charges de la dernière fois
• Conseils de surcharge progressive : l'app vous dit quand augmenter la charge
• Minuteur de repos automatique avec son, vibration et notification
• Records personnels détectés automatiquement

PROGRÈS ET RÉCUPÉRATION
• Carte de récupération musculaire calculée sur les séries des 4 derniers jours
• Volume hebdomadaire, séries par muscle, 1RM estimé par exercice, poids corporel
• Calculateur de 1RM avec les formules d'Epley, Brzycki et Lander
• Historique complet, semaines d'affilée et succès

NUTRITION
• Objectifs de calories et de macros calculés avec la formule de Mifflin-St Jeor
• Journal du petit-déjeuner, déjeuner, dîner et collations avec base d'aliments courants et aliments personnalisés
• Suivi de l'hydratation

SMART COACH
• Analyse vos séances : récupération, stagnations, progrès, volume par muscle, protéines
• Répond à vos questions sur l'entraînement et la nutrition avec des recommandations fondées sur la science et personnalisées avec vos données
• Informations générales qui ne remplacent pas un avis médical

ET AUSSI
• Rappels d'entraînement, kg ou lb, 6 langues
• Vos données restent sur votre appareil : aucun compte nécessaire

VERSION GRATUITE ET PREMIUM
AuraLift est gratuite, avec des publicités non personnalisées et quelques limites (3 programmes personnels, 1 séance générée par jour, historique des 30 derniers jours).
AuraLift Premium supprime la publicité et débloque programmes et générateur illimités, historique complet, graphiques avancés, toute l'analyse du Smart Coach et l'export des données.
Premium mensuel ou annuel, avec 7 jours d'essai gratuit. Le paiement est débité sur votre identifiant Apple à la fin de l'essai. L'abonnement se renouvelle automatiquement sauf s'il est désactivé au moins 24 heures avant la fin de la période en cours. Gérez-le ou résiliez-le dans les réglages de votre compte App Store.

Conditions d'utilisation : {terms}
Confidentialité : {privacy}

Consultez votre médecin avant de commencer un nouveau programme d'entraînement ou d'alimentation.""",
    },
    # ---------------------------------------------------------------- DEUTSCH
    "de-DE": {
        "name": "AuraLift: Gym Trainingsplan",
        "subtitle": "Training Zuhause & Coach",
        "keywords": "fitness,krafttraining,übungen,muskelaufbau,fitnessstudio,tracker,kalorien,makros,protein,bauch,diät",
        "promotional_text": "Pläne für Studio und Zuhause, Satz-Tracking, Muskelregeneration aus deinen Workouts, Diagramme, Makros und Smart Coach. Premium: 7 Tage gratis testen.",
        "description": """AuraLift ist dein Personal Trainer für die Hosentasche – im Fitnessstudio oder zu Hause: Erfasse jeden Satz und sieh deine echten Fortschritte, berechnet nur aus deinen Daten.

PLÄNE FÜR STUDIO UND ZUHAUSE
• 12 fertige Pläne: Ganzkörper, Push/Pull/Beine, Ober-/Unterkörper, Kraft 5×5, Po, Eigengewicht, Kurzhanteln, Fettverbrenner und Bauch
• Workout-Generator: wählt Übungen nach Ziel, Ausrüstung und bereits erholten Muskeln
• Eigene Pläne erstellen und bearbeiten
• Über 60 Übungen mit Anleitung und Muskelkarte

TRAININGSPROTOKOLL
• Gewicht, Wiederholungen und abgeschlossene Sätze mit wenigen Fingertipps
• Spalte „Vorher“ mit den Werten der letzten Einheit
• Vorschläge zur progressiven Überlastung: Die App sagt dir, wann du steigern kannst
• Automatischer Pausentimer mit Ton, Vibration und Mitteilung
• Persönliche Rekorde werden automatisch erkannt

FORTSCHRITT UND REGENERATION
• Muskelregenerationskarte aus den Sätzen der letzten 4 Tage
• Wochenvolumen, Sätze pro Muskel, geschätztes 1RM pro Übung, Körpergewicht
• 1RM-Rechner mit den Formeln nach Epley, Brzycki und Lander
• Vollständiger Verlauf, Wochenserien und Erfolge

ERNÄHRUNG
• Kalorien- und Makroziele nach der Mifflin-St-Jeor-Formel
• Tagebuch für Frühstück, Mittag- und Abendessen und Snacks mit Datenbank gängiger Lebensmittel und eigenen Lebensmitteln
• Wasserzähler

SMART COACH
• Analysiert deine Workouts: Regeneration, Stagnation, Fortschritte, Volumen pro Muskel, Protein
• Beantwortet Fragen zu Training und Ernährung mit wissenschaftlich fundierten Empfehlungen, angepasst an deine Daten
• Allgemeine Informationen, kein Ersatz für ärztlichen Rat

AUSSERDEM
• Trainingserinnerungen, kg oder lb, 6 Sprachen
• Deine Daten bleiben auf deinem Gerät: kein Konto nötig

GRATISVERSION UND PREMIUM
AuraLift ist kostenlos, mit nicht personalisierter Werbung und einigen Grenzen (3 eigene Pläne, 1 erstelltes Workout pro Tag, Verlauf der letzten 30 Tage).
AuraLift Premium entfernt die Werbung und schaltet unbegrenzte Pläne und Generator, den vollständigen Verlauf, erweiterte Diagramme, alle Analysen des Smart Coach und den Datenexport frei.
Premium monatlich oder jährlich, mit 7 Tagen kostenlosem Test. Die Zahlung wird nach Ende des Tests über deine Apple-ID abgerechnet. Das Abo verlängert sich automatisch, sofern es nicht mindestens 24 Stunden vor Ende des laufenden Zeitraums gekündigt wird. Verwalten oder kündigen kannst du es in den Einstellungen deines App Store-Accounts.

Nutzungsbedingungen: {terms}
Datenschutz: {privacy}

Sprich mit deinem Arzt, bevor du ein neues Trainings- oder Ernährungsprogramm beginnst.""",
    },
    # ---------------------------------------------------------------- PORTUGUÊS BR
    "pt-BR": {
        "name": "AuraLift: Treino de Academia",
        "subtitle": "Em Casa, Dieta e Personal",
        "keywords": "fitness,musculação,exercícios,ficha,músculo,hipertrofia,calorias,macros,proteína,abdominal,força,1rm",
        "promotional_text": "Fichas de academia e casa, registro de séries, recuperação muscular calculada pelos seus treinos, gráficos, macros e Smart Coach. Premium: 7 dias grátis.",
        "description": """AuraLift é o seu personal trainer de bolso para a academia ou em casa: registre cada série e veja seu progresso real, calculado só com os seus dados.

FICHAS DE ACADEMIA E CASA
• 12 fichas prontas: corpo inteiro, push/pull/legs, superiores/inferiores, força 5×5, glúteos, peso corporal, halteres, queima de gordura e abdômen
• Gerador de treinos: escolhe os exercícios de acordo com objetivo, equipamentos e músculos já recuperados
• Crie e edite suas próprias fichas
• Mais de 60 exercícios com instruções e mapa dos músculos trabalhados

REGISTRO DE TREINO
• Carga, repetições e séries concluídas em poucos toques
• Coluna "Anterior" com as cargas da última vez
• Sugestões de sobrecarga progressiva: o app avisa quando aumentar a carga
• Timer de descanso automático com som, vibração e notificação
• Recordes pessoais detectados automaticamente

PROGRESSO E RECUPERAÇÃO
• Mapa de recuperação muscular calculado com as séries dos últimos 4 dias
• Volume semanal, séries por músculo, 1RM estimado por exercício, peso corporal
• Calculadora de 1RM com as fórmulas de Epley, Brzycki e Lander
• Histórico completo, semanas seguidas e conquistas

NUTRIÇÃO
• Metas de calorias e macros calculadas com a fórmula de Mifflin-St Jeor
• Diário de café da manhã, almoço, jantar e lanches com base de alimentos comuns e alimentos personalizados
• Contador de água

SMART COACH
• Analisa seus treinos: recuperação, estagnação, progresso, volume por músculo, proteínas
• Responde perguntas sobre treino e alimentação com orientações baseadas em estudos científicos e personalizadas com seus dados
• Informações gerais que não substituem a orientação médica

E MAIS
• Lembretes de treino, kg ou lb, 6 idiomas
• Seus dados ficam no seu aparelho: sem necessidade de conta

VERSÃO GRATUITA E PREMIUM
O AuraLift é gratuito, com anúncios não personalizados e alguns limites (3 fichas próprias, 1 treino gerado por dia, histórico dos últimos 30 dias).
O AuraLift Premium remove os anúncios e libera fichas e gerador ilimitados, histórico completo, gráficos avançados, todas as análises do Smart Coach e exportação de dados.
Premium mensal ou anual, com 7 dias de teste grátis. O pagamento é cobrado no seu ID Apple ao fim do teste. A assinatura é renovada automaticamente, a menos que seja desativada pelo menos 24 horas antes do fim do período atual. Gerencie ou cancele nos ajustes da sua conta da App Store.

Termos de uso: {terms}
Privacidade: {privacy}

Consulte seu médico antes de iniciar um novo programa de treino ou alimentação.""",
    },
    # ---------------------------------------------------------------- PORTUGUÊS PT
    "pt-PT": {
        "name": "AuraLift: Treino de Ginásio",
        "subtitle": "Em Casa, Dieta e Coach",
        "keywords": "fitness,musculação,exercícios,plano,músculo,hipertrofia,calorias,macros,proteína,abdominais,força",
        "promotional_text": "Planos de ginásio e casa, registo de séries, recuperação muscular calculada pelos seus treinos, gráficos, macros e Smart Coach. Premium: 7 dias grátis.",
        "description": None,  # uguale a pt-BR
    },
}

FALLBACK = {"en-GB": "en-US", "es-MX": "es-ES", "pt-PT": "pt-BR"}


def main():
    errors = []
    for loc, data in LOCALES.items():
        if data["description"] is None:
            data["description"] = LOCALES[FALLBACK[loc]]["description"]
        data = dict(data)
        data["description"] = data["description"].format(terms=TERMS_URL, privacy=PRIVACY_URL)

        # Le parole del nome/sottotitolo non vanno ripetute nelle keyword (Apple le indicizza già).
        title_words = {w.strip(":,&").lower() for w in (data["name"] + " " + data["subtitle"]).split()}
        dup = [k for k in data["keywords"].split(",") if k.lower() in title_words]
        if dup:
            errors.append(f"{loc}: keyword già presenti nel titolo/sottotitolo: {dup}")

        d = os.path.join(OUT, loc)
        os.makedirs(d, exist_ok=True)
        for field, limit in LIMITS.items():
            value = data[field]
            if len(value) > limit:
                errors.append(f"{loc}.{field}: {len(value)}/{limit} caratteri")
            with open(os.path.join(d, f"{field}.txt"), "w", encoding="utf-8") as f:
                f.write(value + "\n")
        for field, value in (("privacy_url", PRIVACY_URL), ("support_url", SUPPORT_URL)):
            with open(os.path.join(d, f"{field}.txt"), "w", encoding="utf-8") as f:
                f.write(value + "\n")
        print(f"{loc:6} name {len(data['name']):2}/30  sub {len(data['subtitle']):2}/30  "
              f"kw {len(data['keywords']):3}/100  promo {len(data['promotional_text']):3}/170  "
              f"desc {len(data['description']):4}/4000")

    if errors:
        print("\nERRORI:\n  " + "\n  ".join(errors))
        sys.exit(1)
    print("\nOK: tutti i campi rispettano i limiti di App Store Connect.")


if __name__ == "__main__":
    main()

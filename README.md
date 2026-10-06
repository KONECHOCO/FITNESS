# AuraLift — allenamento in palestra e a casa

App iOS (Capacitor 8 + Vite, JavaScript senza framework) per registrare allenamenti, seguire i progressi, calcolare il recupero muscolare e tenere il diario alimentare. Tutti i dati restano sul dispositivo.

## Funzioni
- Onboarding con calcolo di calorie e macro (Mifflin-St Jeor)
- 63 esercizi tradotti in 6 lingue, 12 schede pronte, schede personali, generatore di allenamenti basato su recupero e attrezzatura
- Sessione live: colonna "Precedente", suggerimento di sovraccarico progressivo, timer di recupero con notifica, record personali
- Progressi: volume settimanale, serie per muscolo, massimale stimato (Epley/Brzycki/Lander), peso corporeo, storico, traguardi
- Nutrizione: diario per pasti, database di alimenti, alimenti personalizzati, acqua
- Smart Coach: analisi dei dati reali + base di conoscenza curata (non è un'AI generativa e lo dice)
- Lingue: it, en, es, fr, de, pt · unità kg/lb
- Monetizzazione: gratis con pubblicità AdMob non personalizzata; Premium (mensile/annuale, 7 giorni di prova) senza pubblicità e senza limiti

## Sviluppo
```bash
npm install
npm run dev          # http://localhost:5173  (?demo=it carica dati dimostrativi, ?premium simula Premium, ?storeshot mostra il paywall)
npm test             # test della logica e delle traduzioni
npm run build
npx cap sync ios     # richiede Node 22
```

## Struttura
```
src/data/      esercizi, schede, alimenti
src/logic/     calcoli puri (recupero, record, statistiche, nutrizione, generatore, coach, traguardi) — testati in tests/
src/pages/     schermate (home, allenati, workout, progressi, dieta, onboarding)
src/ui/        finestre, grafici SVG, mappa muscolare
src/services/  salvataggio, abbonamenti e pubblicità, notifiche/suoni
src/i18n/      testi nelle 6 lingue
store/         metadati App Store e guida alla pubblicazione (store/README.md)
fastlane/      metadati e screenshot generati
```

Pubblicazione: vedi [store/README.md](store/README.md). Build iOS: [codemagic.yaml](codemagic.yaml).

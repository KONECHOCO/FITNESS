# AuraLift — pubblicazione su App Store

Tutto ciò che serve per la submission è in questo repository:

| Cosa | Dove |
|---|---|
| Nome, sottotitolo, keyword, testo promozionale, descrizione (9 localizzazioni) | `fastlane/metadata/<lingua>/` — rigenera con `npm run metadata` |
| Screenshot iPhone 6,9" 1320×2868, 8 per lingua | `fastlane/screenshots/<lingua>/` — rigenera con `npm run screenshots` (con `npm run dev -- --port 5188` avviato) |
| Icona 1024×1024 | `assets/icon-only.png` (già inserita nel progetto Xcode) |
| Build iOS | `codemagic.yaml` → TestFlight |
| Privacy / Supporto | `KONECHOCO.github.io/auralift/` (da pubblicare) |

## 1. Prerequisiti (una volta sola)

1. **Developer Portal → Identifiers**: registra il Bundle ID `com.ikonet.auralift` (nessuna capability extra: In-App Purchase è inclusa di default).
2. **AdMob**: crea l'app "AuraLift iOS" (non ancora pubblicata), un'unità **Banner** e una **Interstitial**. Copia i tre ID.
3. **Codemagic**:
   - aggiungi il repository `KONECHOCO/FITNESS`;
   - crea il profilo di provisioning App Store per `com.ikonet.auralift` con nome `auralift_appstore` (Team settings › Code signing identities › Fetch profiles);
   - crea il gruppo di variabili `auralift_admob` con `ADMOB_APP_ID_IOS`, `VITE_ADMOB_IOS_BANNER`, `VITE_ADMOB_IOS_INTERSTITIAL`.
   Senza questi ID la build si ferma di proposito (niente annunci di test in produzione).
4. **GitHub Pages**: pubblica `KONECHOCO.github.io/auralift/` → `https://konechoco.github.io/auralift/privacy-policy.html` e `support.html`.
5. Dopo la pubblicazione su App Store, aggiungi l'URL dell'app nelle impostazioni dell'app AdMob (verifica `app-ads.txt`, già presente nel sito con il tuo publisher ID).

## 2. App Store Connect → Nuova app

- Piattaforma iOS · Nome **AuraLift: Allenamento Palestra** · Lingua principale **Italiano** · Bundle ID `com.ikonet.auralift` · SKU `auralift-ios`
- Categoria primaria **Salute e fitness**, secondaria **Stile di vita**
- Prezzo: **Gratis** (ricavi da pubblicità + abbonamento)
- Classificazione età: nessun contenuto sensibile → **4+** (la pubblicità AdMob va filtrata per "G" nelle impostazioni AdMob › Blocking controls › Max ad content rating)
- Aggiungi le localizzazioni: Inglese (USA), Inglese (UK), Spagnolo (Spagna), Spagnolo (Messico), Francese, Tedesco, Portoghese (Brasile), Portoghese (Portogallo) e incolla i testi da `fastlane/metadata/`.
- Copyright: `2026 Ikonet Solutions` (o il nome legale del tuo account)
- URL privacy e supporto: vedi sopra. Termini d'uso: EULA standard Apple (già linkato nella descrizione).

## 3. Abbonamenti (Monetizzazione › Abbonamenti)

Gruppo **AuraLift Premium** (nome visualizzato localizzato: "AuraLift Premium" in tutte le lingue).

| Product ID | Durata | Prezzo base (Italia) | Offerta introduttiva |
|---|---|---|---|
| `auralift.premium.yearly` | 1 anno | 39,99 € | Prova gratuita 7 giorni, tutti i territori, nuovi abbonati |
| `auralift.premium.monthly` | 1 mese | 6,99 € | Prova gratuita 7 giorni, tutti i territori, nuovi abbonati |

- Livello: annuale e mensile allo stesso livello (stesso accesso), così l'utente può passare dall'uno all'altro.
- Localizzazione di ogni prodotto (nome / descrizione), per tutte le 6 lingue:
  - it: "Premium annuale" / "Nessuna pubblicità e tutte le funzioni" — "Premium mensile" / idem
  - en: "Premium Yearly" / "No ads and every feature" — "Premium Monthly"
  - es: "Premium anual" / "Sin anuncios y todas las funciones" — "Premium mensual"
  - fr: "Premium annuel" / "Sans publicité, toutes les fonctions" — "Premium mensuel"
  - de: "Premium jährlich" / "Keine Werbung, alle Funktionen" — "Premium monatlich"
  - pt: "Premium anual" / "Sem anúncios e todos os recursos" — "Premium mensal"
- Screenshot per la revisione dell'acquisto: usa `fastlane/screenshots/it/` (oppure uno screenshot del paywall da TestFlight).
- Gli abbonamenti vanno **inviati insieme alla prima versione dell'app** (nella pagina della versione, sezione "Acquisti in-app e abbonamenti").

## 4. Privacy dell'app (etichette)

- **Dati raccolti dall'app**: nessuno (profilo, allenamenti e diario restano sul dispositivo).
- **Dati raccolti da Google AdMob** (versione gratuita) — dichiara:
  - *Identificativi › ID dispositivo*: pubblicità di terze parti · non collegato all'identità · **non** usato per il tracciamento
  - *Dati di utilizzo › Interazione con il prodotto / Dati pubblicitari*: pubblicità di terze parti · non collegato · non tracciamento
  - *Diagnostica › Dati sui crash / prestazioni*: pubblicità di terze parti · non collegato · non tracciamento
  - *Posizione › Posizione approssimativa* (derivata dall'IP): pubblicità di terze parti · non collegato · non tracciamento
- L'app **non** richiede App Tracking Transparency: gli annunci sono non personalizzati (`npa`).

## 5. Note per la revisione (App Review Information)

Nessun login richiesto (non serve account demo). Incolla:

> AuraLift works fully offline and stores all data on the device; no account is required.
> On first launch, complete the short onboarding (goal, level, body data). The free version shows non-personalized AdMob ads (no ATT prompt is requested because ads are non-personalized; EEA users see Google's UMP consent form).
> AuraLift Premium is an auto-renewable subscription (monthly or yearly, 7-day free trial) offered at the end of onboarding and from Settings › AuraLift Premium. It removes ads and unlocks unlimited routines and generator, full history, advanced charts, full Smart Coach analysis and data export. "Restore purchases" is in the paywall and in Settings.
> The "Smart Coach" is not a generative AI: it analyses the user's logged workouts on-device and answers from a curated knowledge base; it does not send data to any server.

## 6. Build e invio

1. Commit e push su `main` → Codemagic compila, esegue i test e carica la build su **TestFlight**.
2. Prova su iPhone da TestFlight: onboarding, un allenamento completo, timer con app in background (notifica), acquisto in **Sandbox** di entrambi i piani, "Ripristina acquisti", annunci (devono essere quelli reali, non "Test Ad").
3. In App Store Connect: seleziona la build, aggiungi i due abbonamenti alla versione, carica gli screenshot da `fastlane/screenshots/<lingua>/` (sezione iPhone 6,9"), poi **Invia per la revisione**.

## 7. Visibilità nelle ricerche (ASO)

- Il nome contiene la parola più cercata in ogni paese ("Allenamento Palestra", "Gym Workout Planner", "Rutinas de Gimnasio", "Musculation", "Trainingsplan", "Treino de Academia").
- en-GB, es-MX e pt-PT hanno parole chiave **diverse** da en-US, es-ES e pt-BR: in molti paesi Apple indicizza due localizzazioni (es. Italia = it + en-GB; USA = en-US + es-MX), quindi più ricerche coperte.
- Le keyword non ripetono parole del nome/sottotitolo (verificato da `store/build_metadata.py`).
- Dopo il lancio: aggiungere la richiesta di recensione (`SKStoreReviewController`) dopo il 3° allenamento completato, aggiornare il testo promozionale (modificabile senza nuova build) e valutare le Custom Product Page per "allenamento a casa".

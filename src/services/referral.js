// Programma ambasciatori Ikonet: configurazione per AuraLift (logica comune in referral-core.js).
// La chiave identifica l'app verso partner.ikonetsolutions.com, non è un segreto.
import { configureReferral } from './referral-core.js';

configureReferral({
  api: 'https://partner.ikonetsolutions.com',
  key: 'RVmVw8gBiik97Kn3IfDIN46i1-r76DTz',
  appId: 'auralift',
  appVersion: __APP_VERSION__,
});

export * from './referral-core.js';

/** Ultimo errore mostrato sotto il campo codice (si azzera quando l'utente riprova). */
export const referralUi = { error: '', busy: false };

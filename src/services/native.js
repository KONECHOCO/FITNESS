// Ponte verso il plugin nativo iOS "AuraNative" (ios/App/App/AuraNativePlugin.swift):
// Apple Salute (allenamenti, calorie, peso) e Apple Watch (stato dell'allenamento e azioni dal polso).
import { Capacitor, registerPlugin } from '@capacitor/core';

const ios = Capacitor.getPlatform() === 'ios';
const AuraNative = registerPlugin('AuraNative');

export const healthSupported = ios;

export async function healthAuthorize() {
  if (!ios) return false;
  try {
    const { granted } = await AuraNative.healthAuthorize();
    return Boolean(granted);
  } catch {
    return false;
  }
}

export function healthSaveWorkout(workout, highIntensity = false) {
  if (!ios) return;
  AuraNative.saveWorkout({ start: workout.start, end: workout.end, kcal: workout.kcal || 0, highIntensity })
    .catch(err => console.info('Salvataggio in Salute non riuscito', err));
}

export function healthSaveBodyMass(kg, date = Date.now()) {
  if (!ios) return;
  AuraNative.saveBodyMass({ kg, date }).catch(() => {});
}

let lastWatchJson = '';

/** Invia al Watch lo stato dell'allenamento (solo se cambiato). Valori solo stringhe/numeri/booleani. */
export function syncWatch(state) {
  if (!ios) return;
  const json = JSON.stringify(state);
  if (json === lastWatchJson) return;
  lastWatchJson = json;
  AuraNative.updateWatch(state).catch(() => {});
}

/** Azioni dal Watch: 'setDone', 'restSkip', 'rest+15'. */
export function onWatchAction(handler) {
  if (!ios) return;
  AuraNative.addListener('watchAction', ({ action }) => handler(action)).catch(() => {});
}

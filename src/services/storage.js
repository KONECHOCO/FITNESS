// Persistenza: Preferences nell'app nativa (non viene svuotata da iOS come lo storage della WebView),
// localStorage nel browser. Il salvataggio è raggruppato per non scrivere a ogni tocco.
import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';

const KEY = 'auralift.state.v2';
const native = Capacitor.isNativePlatform();
let timer = null;
let pending = null;

export async function loadState() {
  try {
    const raw = native ? (await Preferences.get({ key: KEY })).value : localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.warn('Lettura dati non riuscita', err);
    return null;
  }
}

async function write(json) {
  try {
    if (native) await Preferences.set({ key: KEY, value: json });
    else localStorage.setItem(KEY, json);
  } catch (err) {
    console.warn('Salvataggio non riuscito', err);
  }
}

export function saveState(state) {
  pending = state;
  clearTimeout(timer);
  timer = setTimeout(flush, 300);
}

export function flush() {
  clearTimeout(timer);
  if (!pending) return Promise.resolve();
  const json = JSON.stringify(pending);
  pending = null;
  return write(json);
}

export async function clearState() {
  pending = null;
  clearTimeout(timer);
  try {
    if (native) await Preferences.remove({ key: KEY });
    else localStorage.removeItem(KEY);
  } catch {
    // niente da cancellare
  }
}

// Suoni, vibrazione e notifiche locali (timer di recupero e promemoria allenamento).
import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { LocalNotifications } from '@capacitor/local-notifications';

const native = Capacitor.isNativePlatform();

// ---------------------------------------------------------------- suoni (Web Audio, nessun file)
let ctx = null;
export const sound = { enabled: true };

function beep(freq, duration, type = 'sine', delay = 0) {
  if (!sound.enabled) return;
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = ctx || new AC();
    if (ctx.state === 'suspended') ctx.resume();
    const t0 = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    gain.gain.setValueAtTime(0.15, t0);
    gain.gain.exponentialRampToValueAtTime(0.001, t0 + duration);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + duration);
  } catch {
    // audio non disponibile
  }
}

export const sounds = {
  tick: () => beep(880, 0.08),
  set: () => beep(900, 0.1),
  done: () => { beep(1046.5, 0.15, 'triangle'); beep(1318.5, 0.15, 'triangle', 0.15); beep(1568, 0.3, 'triangle', 0.3); }
};

// ---------------------------------------------------------------- vibrazione
export function haptic(kind = 'light') {
  if (!native) return;
  if (kind === 'success') Haptics.notification({ type: NotificationType.Success }).catch(() => {});
  else Haptics.impact({ style: kind === 'heavy' ? ImpactStyle.Heavy : ImpactStyle.Light }).catch(() => {});
}

// ---------------------------------------------------------------- notifiche
const REST_ID = 1001;
const REMINDER_BASE = 2000;

export async function ensureNotificationPermission() {
  if (!native) return false;
  try {
    let { display } = await LocalNotifications.checkPermissions();
    if (display === 'prompt' || display === 'prompt-with-rationale') ({ display } = await LocalNotifications.requestPermissions());
    return display === 'granted';
  } catch {
    return false;
  }
}

/** Notifica di fine recupero, utile quando l'app è in background. */
export async function scheduleRestEnd(endAt, title, body) {
  if (!native) return;
  try {
    await LocalNotifications.cancel({ notifications: [{ id: REST_ID }] });
    if (endAt <= Date.now() + 1000) return;
    await LocalNotifications.schedule({ notifications: [{ id: REST_ID, title, body, schedule: { at: new Date(endAt), allowWhileIdle: true } }] });
  } catch {
    // permesso negato
  }
}

export async function cancelRestEnd() {
  if (!native) return;
  try {
    await LocalNotifications.cancel({ notifications: [{ id: REST_ID }] });
  } catch {
    // niente da cancellare
  }
}

/** Promemoria settimanali. days: 1 = lunedì … 7 = domenica; time "HH:MM". */
export async function scheduleReminders({ enabled, days, time }, title, body) {
  if (!native) return;
  try {
    await LocalNotifications.cancel({ notifications: [1, 2, 3, 4, 5, 6, 7].map(d => ({ id: REMINDER_BASE + d })) });
    if (!enabled || !days.length) return;
    const [hour, minute] = time.split(':').map(Number);
    await LocalNotifications.schedule({
      notifications: days.map(d => ({
        id: REMINDER_BASE + d,
        title, body,
        // Capacitor usa 1 = domenica … 7 = sabato
        schedule: { on: { weekday: (d % 7) + 1, hour, minute }, repeats: true, allowWhileIdle: true }
      }))
    });
  } catch {
    // permesso negato
  }
}

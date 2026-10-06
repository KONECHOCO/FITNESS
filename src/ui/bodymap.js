// Figura anatomica stilizzata (fronte e retro) con i 10 gruppi muscolari colorabili.
import { t } from '../i18n/index.js';

const mirror = d => d.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (m, x, y) => `${100 - Number(x)} ${y}`);

const SIL_FRONT = [
  'M30 31 Q50 26 70 31 L71 50 Q66 75 64 98 L65 110 L35 110 L36 98 Q34 75 29 50 Z',
  'M29 32 Q20 34 20 48 L19 72 L17 106 L23 108 L27 74 L31 50 Z',
  'M35 108 L50 110 L49 155 L48 196 L40 198 L38 155 Q34 130 35 108 Z'
];
const withMirror = paths => paths.flatMap(p => [p, mirror(p)]);

const FRONT = {
  shoulders: withMirror(['M30 32 Q22 34 22 46 L29 48 Q31 40 35 34 Z']),
  chest: withMirror(['M36 35 Q43 33 49 35 L49 52 Q41 56 34 50 Q33 42 36 35 Z']),
  biceps: withMirror(['M23 49 L30 50 Q31 60 28 70 L22 69 Q20 58 23 49 Z']),
  core: ['M40 56 Q50 59 60 56 L59 96 Q50 100 41 96 Z'],
  quads: withMirror(['M37 113 L49 114 L48 150 Q42 156 38 150 Q35 131 37 113 Z']),
  calves: withMirror(['M39 162 L47 162 L46 190 L41 190 Z'])
};
const BACK = {
  back: ['M40 28 L60 28 L66 35 L50 45 L34 35 Z', ...withMirror(['M34 37 L49.5 47 L49.5 84 Q43 82 38 72 Q33 53 34 37 Z'])],
  shoulders: withMirror(['M30 32 Q22 34 22 46 L29 48 Q31 40 34 35 Z']),
  triceps: withMirror(['M22 49 L29 50 Q31 60 28 70 L22 69 Q20 58 22 49 Z']),
  glutes: withMirror(['M37 100 Q44 98 49.5 102 L49.5 118 Q42 122 36 116 Z']),
  hamstrings: withMirror(['M37 121 L49 122 L48 152 Q42 156 38 152 Q35 136 37 121 Z']),
  calves: withMirror(['M38 158 Q44 154 48 158 L47 180 Q42 184 39 180 Z'])
};

/** Colore da percentuale di recupero: rosso (0) → ambra → verde (100). */
export function recoveryColor(rec) {
  const hue = Math.round(Math.max(0, Math.min(100, rec)) * 1.25);
  return `hsl(${hue} 72% 50%)`;
}

function figure(groups, fillFor, label, offsetX) {
  const sil = withMirror(SIL_FRONT).map(d => `<path d="${d}" class="bm-sil"/>`).join('');
  const head = '<ellipse cx="50" cy="15" rx="8.5" ry="10.5" class="bm-sil"/><rect x="45.5" y="23" width="9" height="8" rx="2" class="bm-sil"/>';
  const hands = '<circle cx="20" cy="111" r="3.5" class="bm-sil"/><circle cx="80" cy="111" r="3.5" class="bm-sil"/>';
  const muscles = Object.entries(groups).map(([m, paths]) => {
    const fill = fillFor(m);
    return paths.map(d => `<path d="${d}" fill="${fill.color}" opacity="${fill.opacity}" class="bm-muscle"><title>${t(`m_${m}`)}</title></path>`).join('');
  }).join('');
  return `<g transform="translate(${offsetX} 0)">${head}${sil}${hands}${muscles}<text x="50" y="208" class="bm-label">${label}</text></g>`;
}

/** Mappa del recupero: rec = { muscolo: 0–100 }. */
export function recoverySvg(rec) {
  const fill = m => ({ color: recoveryColor(rec[m] ?? 100), opacity: 0.92 });
  return `<svg class="bodymap" viewBox="0 0 210 212" role="img" aria-label="${t('home_recovery_title')}">
    ${figure(FRONT, fill, t('front'), 0)}${figure(BACK, fill, t('rear'), 110)}</svg>`;
}

/** Mappa dei muscoli coinvolti in un esercizio. */
export function exerciseSvg(ex, small = false) {
  const fill = m => m === ex.muscle
    ? { color: 'var(--accent)', opacity: 1 }
    : ex.secondary.includes(m) ? { color: 'var(--accent)', opacity: 0.4 } : { color: 'var(--muscle-idle)', opacity: 1 };
  return `<svg class="bodymap ${small ? 'bodymap-sm' : ''}" viewBox="0 0 210 212" aria-hidden="true">
    ${figure(FRONT, fill, small ? '' : t('front'), 0)}${figure(BACK, fill, small ? '' : t('rear'), 110)}</svg>`;
}

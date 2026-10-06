// Grafici SVG leggeri (nessuna libreria): barre e linee, con colori da variabili CSS.
import { esc } from './dom.js';

const W = 320;

export function barChart(data, { height = 140, fmt = v => v, highlightLast = true } = {}) {
  if (!data.length) return '';
  const max = Math.max(1, ...data.map(d => d.value));
  const pad = { t: 18, b: 22 };
  const gap = 6;
  const bw = (W - gap * (data.length - 1)) / data.length;
  const h = height - pad.t - pad.b;
  const bars = data.map((d, i) => {
    const bh = Math.max(d.value > 0 ? 3 : 0, (d.value / max) * h);
    const x = i * (bw + gap);
    const y = pad.t + h - bh;
    const last = highlightLast && i === data.length - 1;
    return `<g>
      <rect x="${x}" y="${pad.t}" width="${bw}" height="${h}" rx="5" class="ch-track"/>
      <rect x="${x}" y="${y}" width="${bw}" height="${bh}" rx="5" class="${last ? 'ch-bar-hi' : 'ch-bar'}"/>
      ${d.value > 0 ? `<text x="${x + bw / 2}" y="${y - 5}" class="ch-val">${esc(fmt(d.value))}</text>` : ''}
      <text x="${x + bw / 2}" y="${height - 6}" class="ch-lbl">${esc(d.label)}</text></g>`;
  }).join('');
  return `<svg class="chart" viewBox="0 0 ${W} ${height}" preserveAspectRatio="none" role="img">${bars}</svg>`;
}

export function lineChart(points, { height = 150, fmt = v => v, fmtX = v => v } = {}) {
  if (points.length < 2) return '';
  const pad = { l: 8, r: 8, t: 20, b: 22 };
  const xs = points.map(p => p.x);
  const ys = points.map(p => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  let minY = Math.min(...ys);
  let maxY = Math.max(...ys);
  if (maxY === minY) {
    maxY += 1;
    minY -= 1;
  }
  const span = maxY - minY;
  minY -= span * 0.15;
  maxY += span * 0.15;
  const sx = x => pad.l + ((x - minX) / Math.max(1, maxX - minX)) * (W - pad.l - pad.r);
  const sy = y => pad.t + (1 - (y - minY) / (maxY - minY)) * (height - pad.t - pad.b);
  const d = points.map((p, i) => `${i ? 'L' : 'M'}${sx(p.x).toFixed(1)} ${sy(p.y).toFixed(1)}`).join(' ');
  const area = `${d} L${sx(maxX).toFixed(1)} ${height - pad.b} L${sx(minX).toFixed(1)} ${height - pad.b} Z`;
  const first = points[0];
  const last = points[points.length - 1];
  const dots = points.map(p => `<circle cx="${sx(p.x).toFixed(1)}" cy="${sy(p.y).toFixed(1)}" r="3" class="ch-dot"/>`).join('');
  return `<svg class="chart" viewBox="0 0 ${W} ${height}" preserveAspectRatio="none" role="img">
    <path d="${area}" class="ch-area"/><path d="${d}" class="ch-line"/>${dots}
    <text x="${sx(last.x).toFixed(1)}" y="${(sy(last.y) - 8).toFixed(1)}" class="ch-val" text-anchor="end">${esc(fmt(last.y))}</text>
    <text x="${pad.l}" y="${height - 6}" class="ch-lbl" text-anchor="start">${esc(fmtX(first.x))}</text>
    <text x="${W - pad.r}" y="${height - 6}" class="ch-lbl" text-anchor="end">${esc(fmtX(last.x))}</text></svg>`;
}

/** Barre orizzontali per le serie per muscolo con fascia consigliata 10–20. */
export function hBars(rows, { max = 20, band = [10, 20] } = {}) {
  return `<div class="hbars">${rows.map(r => {
    const pct = Math.min(100, (r.value / max) * 100);
    const cls = r.value >= band[0] ? 'ok' : r.value >= band[0] / 2 ? 'mid' : 'low';
    return `<div class="hbar"><span class="hbar-l">${esc(r.label)}</span><div class="hbar-t"><div class="hbar-band" style="left:${band[0] / max * 100}%;width:${(band[1] - band[0]) / max * 100}%"></div><div class="hbar-f ${cls}" style="width:${pct}%"></div></div><span class="hbar-v">${esc(r.text ?? String(r.value))}</span></div>`;
  }).join('')}</div>`;
}

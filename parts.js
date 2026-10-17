/* Outils de dessin partagés : engrenages, ressorts, vis, etc. (SVG ombré, aucune dépendance) */
window.D = (() => {
  const f = n => +n.toFixed(2);
  function gearD(r, n, h = 6) { // contour d'une roue dentée : n dents, hauteur h
    let d = '', a = Math.PI * 2 / n;
    for (let i = 0; i < n; i++) {
      const t = i * a, p = [[r - h * .2, t - a * .5], [r - h * .2, t - a * .28], [r + h * .8, t - a * .16], [r + h * .8, t + a * .16], [r - h * .2, t + a * .28]];
      p.forEach(([R, T], k) => { d += (i === 0 && k === 0 ? 'M' : 'L') + f(R * Math.cos(T)) + ' ' + f(R * Math.sin(T)); });
    }
    return d + 'Z';
  }
  const gear = (r, n, o = {}) => `<g class="${o.cls || ''}"${o.st ? ` style="${o.st}"` : ''}><path d="${gearD(r, n, o.h || Math.max(4, r * .16))}" fill="url(#${o.fill || 'gBrass'})" stroke="${o.stroke || '#7a5a1c'}" stroke-width="1.2"/>`
    + `<circle r="${f(r * .72)}" fill="none" stroke="rgba(0,0,0,.18)" stroke-width="1"/>`
    + (o.spokes ? [0, 60, 120].map(t => `<rect x="${f(-r * .62)}" y="-2.5" width="${f(r * 1.24)}" height="5" fill="rgba(0,0,0,.15)" transform="rotate(${t})"/>`).join('') : '')
    + `<circle r="${f(Math.max(3, r * .18))}" fill="url(#gSteel)" stroke="#555"/><circle r="1.6" fill="#333"/></g>`;
  const spring = (x, y, w, h, n = 7, c = '#8a9198') => { let d = `M${x} ${y}`; for (let i = 0; i < n; i++) { d += ` L${f(x + w * (i + .5) / n)} ${i % 2 ? y : y - h}`; } d += ` L${x + w} ${y - h / 2}`; return `<path d="${d}" fill="none" stroke="${c}" stroke-width="2.2" stroke-linejoin="round"/>`; };
  const screw = (x, y, r = 4) => `<g><circle cx="${x}" cy="${y}" r="${r}" fill="url(#gSteel)" stroke="#555" stroke-width=".8"/><path d="M${x - r * .6} ${y} h${r * 1.2} M${x} ${y - r * .6} v${r * 1.2}" stroke="#444" stroke-width="1"/></g>`;
  const label = (x, y, t, a = 'middle') => `<text x="${x}" y="${y}" class="lbl" text-anchor="${a}">${t}</text>`;
  const bolt = (x, y) => `<circle cx="${x}" cy="${y}" r="2.4" fill="url(#gSteel)" stroke="#666" stroke-width=".6"/>`;
  return { gearD, gear, spring, screw, label, bolt, f };
})();

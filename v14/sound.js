/* Sons partagés (Web Audio, aucun fichier) + aide « toucher puis placer / glisser ». */
window.TS = (() => {
  let ac = null, held = null; window.__ts = 0;
  const muted = () => { const m = document.getElementById('mute'); return m && m.getAttribute('aria-pressed') === 'true'; };
  const ctx = () => { const A = window.AudioContext || window.webkitAudioContext; if (!A) return null; ac = ac || new A(); if (ac.state === 'suspended') ac.resume(); return ac; };
  function tone(f, dur, vol = .12, type = 'sine', delay = 0) {
    if (muted() || !ctx()) return; const t = ac.currentTime + .02 + delay, o = ac.createOscillator(), g = ac.createGain();
    o.type = type; o.frequency.value = f; g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + .01); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    o.connect(g).connect(ac.destination); o.start(t); o.stop(t + dur + .05); window.__ts++;
  }
  const api = {
    tone,
    click: () => { tone(900, .08, .08, 'square'); tone(1400, .12, .04); },
    wrong: () => { tone(220, .25, .12, 'triangle'); tone(180, .3, .1, 'triangle', .12); },
    win: () => [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, i) => { tone(f, 1.1, .15, 'sine', i * .12); tone(f * 2.76, .35, .035, 'sine', i * .12); }),
    blip: (i = 0) => tone(600 + i * 60, .1, .06),
    holdStart: () => { if (muted() || !ctx()) return; const o = ac.createOscillator(), g = ac.createGain(); o.frequency.value = 650; g.gain.value = .0001; g.gain.exponentialRampToValueAtTime(.12, ac.currentTime + .01); o.connect(g).connect(ac.destination); o.start(); held = { o, g }; window.__ts++; },
    holdStop: () => { if (!held) return; const { o, g } = held; g.gain.exponentialRampToValueAtTime(.0001, ac.currentTime + .03); o.stop(ac.currentTime + .05); held = null; },
    confetti: el => { if (matchMedia('(prefers-reduced-motion: reduce)').matches) return; const r = el.getBoundingClientRect(), c = ['#c4521c', '#1d1b18', '#e0a458', '#2e6b4a'];
      for (let i = 0; i < 34; i++) { const s = document.createElement('span'); s.className = 'confetti'; s.style.left = (r.left + r.width * Math.random()) + 'px'; s.style.top = (r.top + 10) + 'px'; s.style.background = c[i % 4]; s.style.animationDelay = Math.random() * .3 + 's'; document.body.appendChild(s); setTimeout(() => s.remove(), 2000); } },
    /* rend un bouton « pièce » déplaçable : glisser (souris/doigt) ou toucher pour sélectionner */
    pickable(btn, { onDrop, onSelect }) {
      let d = null;
      btn.addEventListener('pointerdown', e => { if (btn.classList.contains('used') || e.button > 0) return; const r = btn.getBoundingClientRect(); d = { x0: e.clientX, y0: e.clientY, dx: e.clientX - r.left, dy: e.clientY - r.top, moved: false, g: null }; btn.setPointerCapture(e.pointerId); });
      btn.addEventListener('pointermove', e => { if (!d) return; if (!d.moved && Math.hypot(e.clientX - d.x0, e.clientY - d.y0) < 6) return;
        if (!d.moved) { d.moved = true; d.g = btn.cloneNode(true); d.g.classList.add('dragging'); d.g.style.width = btn.offsetWidth + 'px'; document.body.appendChild(d.g); btn.classList.add('lifted'); }
        d.g.style.left = (e.clientX - d.dx) + 'px'; d.g.style.top = (e.clientY - d.dy) + 'px'; });
      const end = e => { if (!d) return; const was = d; d = null; if (!was.moved) { onSelect(); return; } was.g.remove(); btn.classList.remove('lifted'); onDrop(e.clientX, e.clientY); };
      btn.addEventListener('pointerup', end); btn.addEventListener('pointercancel', () => { if (d && d.g) d.g.remove(); btn.classList.remove('lifted'); d = null; });
    },
    anim(dur, step) { return new Promise(res => { if (matchMedia('(prefers-reduced-motion: reduce)').matches) { step(1); return res(); } const t0 = performance.now(); const f = n => { const k = Math.min(1, (n - t0) / dur); step(k); k < 1 ? requestAnimationFrame(f) : res(); }; requestAnimationFrame(f); }); }
  };
  return api;
})();

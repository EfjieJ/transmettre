/* Transmettre — Jeu 1 (construire une brouette) et Jeu 2 (levier). Vanilla JS, aucune dépendance. */
(() => {
  const $ = id => document.getElementById(id);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const NS = 'http://www.w3.org/2000/svg';

  /* ---------- Son (Web Audio), respecte le bouton Muet ---------- */
  let actx = null; window.__buildSounds = 0;
  const muted = () => $('mute') && $('mute').getAttribute('aria-pressed') === 'true';
  function ctx() { const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null; actx = actx || new AC(); if (actx.state === 'suspended') actx.resume(); return actx; }
  function tone(t, f, dur, vol, type = 'sine') {
    const o = actx.createOscillator(), g = actx.createGain();
    o.type = type; o.frequency.value = f;
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.008); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(actx.destination); o.start(t); o.stop(t + dur + 0.05);
  }
  function knock(t) { // petit « toc » de bois : bruit filtré très court
    const len = 0.08, buf = actx.createBuffer(1, actx.sampleRate * len, actx.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 4);
    const s = actx.createBufferSource(), f = actx.createBiquadFilter(), g = actx.createGain();
    f.type = 'bandpass'; f.frequency.value = 700; f.Q.value = 3; g.gain.value = 0.9;
    s.buffer = buf; s.connect(f).connect(g).connect(actx.destination); s.start(t);
    tone(t, 180, 0.12, 0.25, 'triangle');
  }
  function sound(kind) {
    if (muted() || !ctx()) return; const t = actx.currentTime + 0.02; window.__buildSounds++;
    if (kind === 'snap') { knock(t); tone(t + 0.04, 1320, 0.25, 0.05); }
    else if (kind === 'wrong') { tone(t, 220, 0.25, 0.12, 'triangle'); tone(t + 0.12, 180, 0.3, 0.1, 'triangle'); }
    else if (kind === 'stone') knock(t);
    else if (kind === 'win') [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, i) => { tone(t + i * 0.13, f, 1.2, 0.16); tone(t + i * 0.13, f * 2.76, 0.4, 0.04); });
  }
  function confetti(el) {
    if (reduce) return; const r = el.getBoundingClientRect(), cols = ['#c4521c', '#1d1b18', '#e0a458', '#2e6b4a'];
    for (let i = 0; i < 36; i++) { const c = document.createElement('span'); c.className = 'confetti';
      c.style.left = (r.left + r.width * Math.random()) + 'px'; c.style.top = (r.top + 10) + 'px'; c.style.background = cols[i % 4];
      c.style.animationDelay = Math.random() * .3 + 's'; document.body.appendChild(c); setTimeout(() => c.remove(), 2000); }
  }

  /* =================== JEU 1 : LA BROUETTE =================== */
  const INFO = {
    roue: '🛞 La roue : elle porte le poids et roule au lieu de frotter.',
    essieu: '⚙️ L\'essieu : la tige sur laquelle la roue tourne. Sans lui, la roue ne tient pas.',
    brancards: '🪵 Les brancards : deux longs bras. Ils font levier sur la roue : vous soulevez peu, la roue porte beaucoup.',
    pieds: '🦵 Les pieds : la brouette reste debout quand on la pose, même pleine.',
    caisse: '🧺 La caisse : elle garde la charge au-dessus de la roue.'
  };
  const HINT = {
    roue: 'La roue va tout devant, sur le sol.', essieu: 'L\'essieu passe au centre de la roue.',
    brancards: 'Les brancards vont de vos mains jusqu\'à la roue.', pieds: 'Les pieds touchent le sol, sous la caisse.', caisse: 'La caisse va en haut, au-dessus des brancards.'
  };
  const build = $('build'), bp = $('bp'), barrow = $('barrow'), pusher = $('pusher'), stonesG = $('stones'), fallen = $('fallen');
  const bExplain = $('b-explain'), bMsg = $('b-msg'), compare = $('b-compare');
  const placed = new Set(); let loaded = false, busy = false, selected = null;
  const BASE = 'translate(-20 73.4) scale(.72)';
  const say = (t, c = '') => { bMsg.textContent = t; bMsg.className = 'msg ' + c; };
  const tell = t => { bExplain.textContent = t; bExplain.classList.remove('pop'); void bExplain.offsetWidth; bExplain.classList.add('pop'); };
  const ghosts = () => [...bp.querySelectorAll('.ghost')];

  function refresh() {
    bp.querySelectorAll('.real').forEach(g => g.classList.toggle('on', placed.has(g.dataset.real)));
    ghosts().forEach(g => g.classList.toggle('filled', placed.has(g.dataset.zone)));
    document.querySelectorAll('.part').forEach(p => p.classList.toggle('used', placed.has(p.dataset.part)));
    build.dataset.parts = placed.size;
  }
  function tryPlace(part, zone) {
    if (placed.has(part)) return;
    if (zone === part) {
      placed.add(part); refresh(); sound('snap'); tell(INFO[part]);
      const real = bp.querySelector(`.real[data-real="${part}"]`); real.classList.remove('snap'); void real.getBBox(); real.classList.add('snap');
      say(placed.size === 5 ? 'Brouette assemblée! Chargez les pierres, puis poussez.' : `${placed.size} pièce${placed.size > 1 ? 's' : ''} sur 5.`, placed.size === 5 ? 'ok' : '');
    } else {
      sound('wrong'); say(`Pas là. ${HINT[part]}`, 'no');
      const btn = document.querySelector(`.part[data-part="${part}"]`); btn.classList.remove('shake'); void btn.offsetWidth; btn.classList.add('shake');
    }
  }
  function zoneAt(x, y, part) { // zones sous le doigt (avec une marge) : si la bonne y est, on l'accepte
    const hits = []; ghosts().forEach(g => { if (g.classList.contains('filled')) return; const r = g.getBoundingClientRect(), m = 18;
      if (x >= r.left - m && x <= r.right + m && y >= r.top - m && y <= r.bottom + m) hits.push([g.dataset.zone, Math.hypot(x - (r.left + r.width / 2), y - (r.top + r.height / 2))]); });
    if (!hits.length) return null; if (part && hits.some(h => h[0] === part)) return part;
    return hits.sort((a, b) => a[1] - b[1])[0][0];
  }
  // Glisser-déposer + toucher
  let drag = null;
  document.querySelectorAll('.part').forEach(p => {
    p.addEventListener('pointerdown', e => {
      if (busy || placed.has(p.dataset.part) || e.button > 0) return;
      const r = p.getBoundingClientRect();
      drag = { p, x0: e.clientX, y0: e.clientY, dx: e.clientX - r.left, dy: e.clientY - r.top, moved: false, ghost: null };
      p.setPointerCapture(e.pointerId);
    });
    p.addEventListener('pointermove', e => {
      const d = drag; if (!d || d.p !== p) return;
      if (!d.moved && Math.hypot(e.clientX - d.x0, e.clientY - d.y0) < 6) return;
      if (!d.moved) { d.moved = true; d.ghost = p.cloneNode(true); d.ghost.classList.add('dragging'); d.ghost.style.width = p.offsetWidth + 'px'; document.body.appendChild(d.ghost); p.classList.add('lifted'); }
      d.ghost.style.left = (e.clientX - d.dx) + 'px'; d.ghost.style.top = (e.clientY - d.dy) + 'px';
      const z = zoneAt(e.clientX, e.clientY, p.dataset.part); ghosts().forEach(g => g.classList.toggle('over', g.dataset.zone === z));
    });
    const end = e => {
      const d = drag; if (!d || d.p !== p) return; drag = null;
      ghosts().forEach(g => g.classList.remove('over'));
      if (!d.moved) { // simple toucher : on sélectionne la pièce
        document.querySelectorAll('.part').forEach(x => x.classList.remove('sel'));
        selected = selected === p.dataset.part ? null : p.dataset.part;
        if (selected) { p.classList.add('sel'); say('Maintenant, touchez sa place sur le plan.'); }
        return;
      }
      d.ghost.remove(); p.classList.remove('lifted');
      const z = zoneAt(e.clientX, e.clientY, p.dataset.part); if (z) tryPlace(p.dataset.part, z);
    };
    p.addEventListener('pointerup', end); p.addEventListener('pointercancel', end);
    p.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); p.dispatchEvent(new PointerEvent('pointerdown', { pointerId: 1 })); p.dispatchEvent(new PointerEvent('pointerup', { pointerId: 1 })); } });
  });
  bp.addEventListener('click', e => {
    if (!selected || busy) return; const z = zoneAt(e.clientX, e.clientY, selected); if (!z) return;
    const part = selected; selected = null; document.querySelectorAll('.part').forEach(x => x.classList.remove('sel')); tryPlace(part, z);
  });
  // Pierres
  const STONE_POS = [[265, 112], [305, 106], [345, 110], [385, 106], [420, 112], [325, 92]];
  function stone(cx, cy, r = 17) { const e = document.createElementNS(NS, 'ellipse'); e.setAttribute('cx', cx); e.setAttribute('cy', cy); e.setAttribute('rx', r); e.setAttribute('ry', r * .78); e.setAttribute('fill', 'url(#stone)'); e.setAttribute('class', 'st'); return e; }
  function setBarrow(tx, ang = 0) { barrow.setAttribute('transform', `translate(${tx} 0) rotate(${ang} ${-20 + 470 * .72} ${73.4 + 226 * .72}) ${BASE}`); pusher.setAttribute('transform', `translate(${24 + tx} 262)`); }
  const wheelRot = $('wheelRot');
  function load() {
    if (busy) return; fallen.innerHTML = ''; stonesG.innerHTML = '';
    if (!placed.has('caisse')) {
      STONE_POS.forEach(([x], i) => { const s = stone(80 + i * 34, 252, 12); s.style.animationDelay = i * .08 + 's'; s.classList.add('drop'); fallen.appendChild(s); });
      sound('wrong'); say('Sans caisse, les pierres tombent par terre. Il manque quelque chose pour les garder.', 'no'); loaded = false; return;
    }
    if (!placed.has('pieds') || !(placed.has('roue') && placed.has('essieu'))) {
      animate(800, k => setBarrow(0, Math.sin(k * Math.PI) * 7)).then(() => setBarrow(0));
      sound('wrong'); say(!placed.has('pieds') ? 'Elle bascule! Sans pieds, rien ne la tient debout pendant qu\'on la remplit.' : 'Elle penche vers l\'avant : il manque ce qui porte l\'avant, sur le sol.', 'no'); loaded = false; return;
    }
    STONE_POS.forEach(([x, y], i) => { const s = stone(x, y); s.classList.add('drop'); s.style.animationDelay = i * .12 + 's'; stonesG.appendChild(s); setTimeout(() => sound('stone'), i * 120); });
    loaded = true; say('Six pierres dans la caisse. À vous de pousser!');
  }
  function animate(dur, step) { return new Promise(res => { if (reduce) { step(1); return res(); } const t0 = performance.now(); const f = now => { const k = Math.min(1, (now - t0) / dur); step(k); k < 1 ? requestAnimationFrame(f) : res(); }; requestAnimationFrame(f); }); }
  const ease = k => k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
  async function push() {
    if (busy) return;
    if (!placed.has('brancards')) { sound('wrong'); say('Rien à tenir! Il faut des bras pour soulever et pousser.', 'no'); return; }
    if (!(placed.has('roue') && placed.has('essieu'))) {
      busy = true; sound('wrong'); say(placed.has('roue') ? 'La roue n\'est pas fixée : sans essieu, elle ne peut pas tourner.' : 'Sans roue, ça frotte au sol. Elle avance à peine…', 'no');
      await animate(700, k => setBarrow(Math.sin(k * Math.PI * 6) * 3)); setBarrow(0); busy = false; return;
    }
    if (!loaded) { say('Chargez d\'abord les pierres.', 'no'); return; }
    busy = true; say('On soulève les brancards… et on pousse!');
    await animate(400, k => setBarrow(0, -4 * k));                       // les pieds quittent le sol
    const D = 205, R = 33 * .72;
    await animate(2600, k => { const x = D * ease(k); setBarrow(x, -4); wheelRot.setAttribute('transform', `rotate(${x / R * 180 / Math.PI} 470 226)`); });
    await animate(300, k => setBarrow(D, -4 * (1 - k)));
    sound('win'); confetti(bp); compare.hidden = false; build.dataset.state = 'win';
    say('Arrivée au mur! Six pierres en un seul voyage. Vous venez de construire une des plus vieilles machines du monde.', 'ok');
    tell('Comme en Chine il y a environ 1800 ans : une roue, un levier, une caisse. Montrez-le à quelqu\'un!');
    busy = false;
  }
  function resetBuild() {
    if (busy) return; placed.clear(); loaded = false; selected = null; stonesG.innerHTML = ''; fallen.innerHTML = ''; compare.hidden = true; build.dataset.state = '';
    setBarrow(0); wheelRot.removeAttribute('transform'); refresh(); say('Cinq pièces à placer.'); tell('Pièce par pièce : chacune a un rôle.');
  }
  $('b-load').addEventListener('click', load); $('b-push').addEventListener('click', push); $('b-reset').addEventListener('click', resetBuild);
  resetBuild();

  /* =================== JEU 2 : LE LEVIER =================== */
  const LOAD = 60, FORCE = 20, BAR = 2, PX = 235, X0 = 80, BAR_Y = 151, GROUND = 200;
  const range = $('lv-range'), ful = $('lv-fulcrum'), lvBar = $('lv-bar'), lvMsg = $('lv-msg'), lvSvg = $('lv');
  const fmt = n => n.toFixed(2).replace('.', ',');
  let d = 1, lvBusy = false, lifted = false;
  function effort() { return LOAD * d / (BAR - d); }
  function drawLever() {
    const x = X0 + d * PX; ful.setAttribute('transform', `translate(${x} 0)`);
    $('lv-d1').textContent = fmt(d) + ' m'; $('lv-d2').textContent = fmt(BAR - d) + ' m';
    const e = effort(); $('lv-calc').innerHTML = `${LOAD} kg × ${fmt(d)} m ÷ ${fmt(BAR - d)} m = <b>${e < 100 ? e.toFixed(1).replace('.', ',') : Math.round(e)} kg</b> à appuyer`;
    const m = $('lv-meter'); m.style.width = Math.min(100, e) + '%'; m.className = e <= FORCE ? 'ok' : 'no';
    ful.setAttribute('aria-valuenow', Math.round(d * 100)); ful.setAttribute('aria-valuetext', fmt(d) + ' m');
    if (!lvBusy) { lvBar.removeAttribute('transform'); lifted = false; }
  }
  function setD(v) { d = Math.min(1.9, Math.max(0.1, Math.round(v * 20) / 20)); range.value = Math.round(d * 100); drawLever(); }
  range.addEventListener('input', () => setD(range.value / 100));
  // glisser l'appui directement sur le dessin
  let fDrag = false;
  const toSvgX = e => { const pt = lvSvg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY; return pt.matrixTransform(lvSvg.getScreenCTM().inverse()).x; };
  ful.addEventListener('pointerdown', e => { if (lvBusy) return; fDrag = true; ful.setPointerCapture(e.pointerId); });
  ful.addEventListener('pointermove', e => { if (fDrag) setD((toSvgX(e) - X0) / PX); });
  ful.addEventListener('pointerup', () => fDrag = false); ful.addEventListener('pointercancel', () => fDrag = false);
  ful.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') setD(d - .05); if (e.key === 'ArrowRight') setD(d + .05); });
  $('lv-go').addEventListener('click', async () => {
    if (lvBusy) return; lvBusy = true; const e = effort(), cx = X0 + d * PX;
    if (e <= FORCE + 1e-9) {
      const ang = Math.asin((GROUND - BAR_Y - 4) / ((BAR - d) * PX)) * 180 / Math.PI;   // jusqu'à ce que la main touche le sol
      await animate(900, k => lvBar.setAttribute('transform', `rotate(${ang * ease(k)} ${cx} ${BAR_Y})`));
      const handCm = (GROUND - BAR_Y - 4) / PX * 100, stoneCm = handCm * d / (BAR - d);
      lvMsg.className = 'msg ok';
      lvMsg.textContent = `Ça monte! Vous appuyez avec ${e.toFixed(1).replace('.', ',')} kg. Mais votre main descend de ${Math.round(handCm)} cm pour que la pierre monte de ${Math.round(stoneCm)} cm : la force se paie en distance.`;
      sound('win'); if (!lifted) confetti(lvSvg); lifted = true; lvSvg.dataset.state = 'win';
    } else {
      await animate(600, k => lvBar.setAttribute('transform', `rotate(${Math.sin(k * Math.PI * 8) * .6} ${cx} ${BAR_Y})`));
      lvBar.removeAttribute('transform'); sound('wrong'); lvSvg.dataset.state = 'fail';
      lvMsg.className = 'msg no'; lvMsg.textContent = `Trop lourd : il faudrait ${Math.round(e)} kg, vous en avez ${FORCE}. Indice : rapprochez l'appui de la pierre.`;
    }
    lvBusy = false;
  });
  setD(1);
})();

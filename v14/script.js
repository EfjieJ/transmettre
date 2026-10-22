(() => {
  const PIECES = [
    { id: 'main',   ico: '✋', name: 'Main',   does: 'La main appuie sur le levier',
      info: '✋ La main : le moteur de départ. Toute la chaîne commence par un geste.' },
    { id: 'levier', ico: '⚖️', name: 'Levier', does: 'Le levier pousse la pierre',
      info: '⚖️ Le levier : une barre sur un appui. Un petit effort d\'un côté devient une grosse poussée de l\'autre.' },
    { id: 'pierre', ico: '🪨', name: 'Pierre', does: 'La pierre roule et frappe la roue',
      info: '🪨 La pierre : elle transporte la poussée. Une fois lancée, elle roule toute seule.' },
    { id: 'roue',   ico: '☸️', name: 'Roue',   does: 'La roue tourne et enroule la corde',
      info: '☸️ La roue : elle change une poussée en tour. Elle roule au lieu de frotter.' },
    { id: 'poulie', ico: '🪢', name: 'Poulie', does: 'La poulie hisse le drapeau',
      info: '🪢 La poulie : une roue avec une corde. Elle change le sens de la force : on tire en bas, ça monte en haut.' }
  ];
  const HINTS = [
    'Tout commence par un geste. Qui appuie en premier?',
    'La main a besoin de quelque chose pour multiplier sa force.',
    'Le levier doit pousser quelque chose qui peut rouler.',
    'Ce qui roule doit faire tourner quelque chose.',
    'Qu\'est-ce qui change un tour en une montée?'
  ];
  const $ = id => document.getElementById(id);
  const tray = $('tray'), slotsEl = $('slots'), msg = $('msg'), goal = $('goal'), explain = $('explain'), game = $('game');
  const go = $('go'), reset = $('reset'), muteBtn = $('mute');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let busy = false;

  /* ---------- Son : carillon synthétisé (Web Audio, aucun fichier) ---------- */
  let muted = false, actx = null;
  try { muted = localStorage.getItem('transmettre-muet') === '1'; } catch (e) {}
  function updateMute() {
    muteBtn.setAttribute('aria-pressed', muted);
    muteBtn.textContent = muted ? '🔕 Muet' : '🔔 Son';
    muteBtn.title = muted ? 'Remettre le son' : 'Couper le son';
  }
  muteBtn.addEventListener('click', () => {
    muted = !muted; updateMute();
    try { localStorage.setItem('transmettre-muet', muted ? '1' : '0'); } catch (e) {}
  });
  updateMute();
  function bell(t, freq, dur, vol) {
    // une cloche = une note + une harmonique « métallique » qui s'éteint vite
    [[1, vol], [2.76, vol * 0.35], [5.4, vol * 0.12]].forEach(([mult, v]) => {
      const o = actx.createOscillator(), g = actx.createGain();
      o.type = 'sine'; o.frequency.value = freq * mult;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(v, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur / mult);
      o.connect(g).connect(actx.destination); o.start(t); o.stop(t + dur + 0.05);
    });
  }
  window.__chimes = 0;
  function chime(kind = 'win') {
    if (muted) return false;
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return false;
    actx = actx || new AC(); if (actx.state === 'suspended') actx.resume();
    const t = actx.currentTime + 0.03;
    if (kind === 'win') {
      const notes = [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5]; // do mi sol do' sol do'
      const at = [0, .16, .32, .5, .78, .92];
      notes.forEach((f, i) => bell(t + at[i], f, i === notes.length - 1 ? 1.8 : .9, .22));
    } else if (kind === 'place') bell(t, 880, .35, .07);
    else if (kind === 'fail') { bell(t, 392, .5, .12); bell(t + .18, 330, .7, .12); }
    window.__chimes++; return true;
  }

  /* ---------- Jeu ---------- */
  const say = (t, cls = '') => { msg.textContent = t; msg.className = 'msg ' + cls; };
  const tell = t => { explain.textContent = t; explain.classList.remove('pop'); void explain.offsetWidth; explain.classList.add('pop'); };
  const slots = () => [...slotsEl.children];
  const byId = id => PIECES.find(p => p.id === id);

  function makePiece(p) {
    const el = document.createElement('div');
    el.className = 'piece'; el.dataset.id = p.id; el.tabIndex = 0;
    el.setAttribute('role', 'button'); el.setAttribute('aria-label', p.name);
    el.innerHTML = `<span class="ico" aria-hidden="true">${p.ico}</span>${p.name}`;
    el.addEventListener('pointerdown', startDrag);
    el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tapPiece(el); } });
    return el;
  }
  function build() {
    tray.innerHTML = ''; slotsEl.innerHTML = ''; goal.classList.remove('up'); game.dataset.state = '';
    PIECES.forEach((_, i) => {
      const s = document.createElement('div');
      s.className = 'slot'; s.dataset.i = i; s.innerHTML = `<span class="n">${i + 1}</span>`;
      slotsEl.appendChild(s);
    });
    [3, 0, 4, 2, 1].forEach(i => tray.appendChild(makePiece(PIECES[i])));
    explain.textContent = 'Chaque pièce posée vous dira ce qu\'elle fait.';
    say('Qui appuie en premier?');
  }
  function place(piece, slot) {
    const existing = slot.querySelector('.piece');
    if (existing && existing !== piece) tray.appendChild(existing);
    slot.appendChild(piece);
    slots().forEach(s => s.classList.remove('bad', 'done'));
    goal.classList.remove('up');
    tell(byId(piece.dataset.id).info);
    chime('place');
    say(tray.children.length ? '' : 'Chaîne complète. Appuyez pour voir si elle tient.');
  }
  function tapPiece(piece) {
    if (busy) return;
    if (piece.parentElement.classList.contains('slot')) { tray.appendChild(piece); say(''); return; }
    const free = slots().find(s => !s.querySelector('.piece'));
    if (free) place(piece, free);
  }
  let drag = null;
  function startDrag(e) {
    if (busy || e.button > 0) return;
    const el = e.currentTarget, r = el.getBoundingClientRect();
    drag = { el, x0: e.clientX, y0: e.clientY, dx: e.clientX - r.left, dy: e.clientY - r.top, moved: false, w: r.width, h: r.height };
    el.setPointerCapture(e.pointerId);
    el.addEventListener('pointermove', moveDrag);
    el.addEventListener('pointerup', endDrag, { once: true });
    el.addEventListener('pointercancel', endDrag, { once: true });
  }
  const inside = (el, x, y) => { const r = el.getBoundingClientRect(); return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom; };
  const slotAt = (x, y) => slots().find(s => inside(s, x, y));
  function moveDrag(e) {
    const d = drag; if (!d) return;
    if (!d.moved && Math.hypot(e.clientX - d.x0, e.clientY - d.y0) < 6) return;
    if (!d.moved) { d.moved = true; d.el.classList.add('dragging'); d.el.style.width = d.w + 'px'; d.el.style.height = d.h + 'px'; }
    d.el.style.left = (e.clientX - d.dx) + 'px'; d.el.style.top = (e.clientY - d.dy) + 'px';
    slots().forEach(s => s.classList.toggle('over', s === slotAt(e.clientX, e.clientY)));
  }
  function endDrag(e) {
    const d = drag; drag = null; if (!d) return;
    d.el.removeEventListener('pointermove', moveDrag);
    slots().forEach(s => s.classList.remove('over'));
    if (!d.moved) { tapPiece(d.el); return; }
    d.el.classList.remove('dragging'); d.el.style.cssText = '';
    const s = slotAt(e.clientX, e.clientY);
    if (s) place(d.el, s);
    else if (inside(tray, e.clientX, e.clientY)) tray.appendChild(d.el);
  }
  const wait = ms => new Promise(r => setTimeout(r, reduce ? Math.min(ms, 120) : ms));
  function confetti() {
    if (reduce) return;
    const r = goal.getBoundingClientRect(), cols = ['#c4521c', '#1d1b18', '#e0a458', '#2e6b4a'];
    for (let i = 0; i < 40; i++) {
      const c = document.createElement('span'); c.className = 'confetti';
      c.style.left = (r.left + r.width / 2 + (Math.random() - .5) * 300) + 'px';
      c.style.top = (r.top - 20 + Math.random() * 40) + 'px';
      c.style.background = cols[i % 4]; c.style.animationDelay = (Math.random() * .3) + 's';
      document.body.appendChild(c); setTimeout(() => c.remove(), 2000);
    }
  }
  async function trigger() {
    if (busy) return;
    const ss = slots();
    if (ss.some(s => !s.querySelector('.piece'))) { say('Il manque des pièces : remplissez les cinq cases.', 'no'); return; }
    busy = true; go.disabled = true; goal.classList.remove('up');
    for (let i = 0; i < ss.length; i++) {
      const p = ss[i].querySelector('.piece');
      ss[i].classList.add('push');
      if (p.dataset.id !== PIECES[i].id) {
        await wait(300);
        ss[i].classList.remove('push'); ss[i].classList.add('bad');
        say(`Oups, la poussée s'arrête à la case ${i + 1}. Indice : ${HINTS[i]}`, 'no');
        chime('fail'); game.dataset.state = 'fail';
        busy = false; go.disabled = false; return;
      }
      tell(PIECES[i].does + '…');
      await wait(550);
      ss[i].classList.remove('push'); ss[i].classList.add('done');
    }
    goal.classList.add('up'); chime('win'); confetti();
    say('Ding! Le drapeau monte. Cinq choses ont appuyé l\'une sur l\'autre : c\'est toute la mécanique.', 'ok');
    tell('Vous venez de refaire le geste des premiers inventeurs. Maintenant, suivez le fil…');
    game.dataset.state = 'win';
    busy = false; go.disabled = false;
  }
  go.addEventListener('click', trigger);
  reset.addEventListener('click', () => { if (!busy) build(); });
  build();

  /* ---------- Cellulaire démonté ---------- */
  const td = $('teardown'), help = $('td-help');
  const steps = ['Touchez « Écran et vitre » pour commencer.', 'Dessous : la batterie. Touchez-la.', 'Encore dessous : la carte mère. Touchez-la.', 'Sur la carte mère, deux puces. Touchez le CPU et le GPU.'];
  td.querySelectorAll('.layer').forEach(l => l.addEventListener('click', () => {
    const n = +l.dataset.n;
    if (+td.dataset.open < n) td.dataset.open = n;
    l.classList.add('peeled'); help.textContent = steps[Math.min(n, 3)];
  }));
  td.querySelectorAll('.chip').forEach(c => c.addEventListener('click', () => {
    c.classList.add('show');
    if (td.querySelectorAll('.chip.show').length === 2) help.textContent = 'Fermé : de la magie. Ouvert : une chaîne de plus. Vous pouvez maintenant l\'expliquer à quelqu\'un.';
  }));
  $('td-reset').addEventListener('click', () => {
    td.dataset.open = 0; td.querySelectorAll('.peeled,.show').forEach(x => x.classList.remove('peeled', 'show')); help.textContent = steps[0];
  });
})();
// Compteur de semaines pour la lettre (avant le cellulaire)
(() => {
  const d = document.querySelector('.cal .days'); if (!d) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let w = 1; d.textContent = 'semaine 1';
  if (!reduce) setInterval(() => { w = w % 6 + 1; d.textContent = 'semaine ' + w; }, 1000);
  else d.textContent = 'des semaines';
})();
;(function(){var el=document.getElementById('ab-count');if(!el||!('IntersectionObserver' in window))return;var cards=[].slice.call(document.querySelectorAll('#abondance .lvl')),seen=new Set();var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){seen.add(e.target);io.unobserve(e.target);el.textContent='Abondance : '+seen.size+' / '+cards.length+' inventions vues'+(seen.size===cards.length?' 🎉':'');}})},{threshold:.4});cards.forEach(function(c){io.observe(c)});})();

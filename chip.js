/* Chapitre 3 : levier → relais → transistor, circuit imprimé, portes logiques, photolithographie, zoom */
(() => {
  const $ = id => document.getElementById(id), TS = window.TS, NS = 'http://www.w3.org/2000/svg';
  const el = (tag, attrs, parent) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; };

  /* ---- petit qui commande un grand ---- */
  let swBusy = false;
  $('sw-press').addEventListener('click', async () => { if (swBusy) return; swBusy = true; const t = document.querySelector('.trio-sw'); t.classList.add('on'); TS.click(); await TS.anim(1600, () => {}); t.classList.remove('on'); swBusy = false; });

  /* =============== CIRCUIT IMPRIMÉ =============== */
  const FP = [[150, 95], [450, 95], [450, 245], [150, 245]];
  const NAMES = { pile: 'la pile', res: 'la résistance', led: 'la LED', sw: 'l\'interrupteur' };
  const pcb = $('pcb'), gFp = $('fps'), gPads = $('pads'), gTr = $('traces'), msg = $('pcb-msg'), game = $('pcbg');
  let comp = [null, null, null, null], flip = [false, false, false, false], traces = [], firstPad = null, swOn = false, selected = null;
  const padXY = id => { const [f, s] = [+id[0], id[1]]; return [FP[f][0] + (s === 'a' ? -60 : 60), FP[f][1]]; };
  const say = (t, c = '') => { msg.textContent = t; msg.className = 'msg ' + c; };
  function drawComp(i) {
    const [x, y] = FP[i], g = el('g', { class: 'fp', 'data-fp': i }, gFp), c = comp[i];
    el('rect', { x: x - 52, y: y - 26, width: 104, height: 52, rx: 6, class: c ? 'silk-box on' : 'silk-box' }, g);
    if (!c) { const t = el('text', { x, y: y + 5, class: 'silk' }, g); t.textContent = 'emplacement ' + (i + 1); return; }
    if (c === 'pile') { el('rect', { x: x - 40, y: y - 16, width: 80, height: 32, rx: 4, fill: '#2b2926' }, g); el('rect', { x: x - 40, y: y - 16, width: 24, height: 32, fill: '#c4a03a' }, g); const t = el('text', { x: x - 28, y: y + 6, class: 'pol' }, g); t.textContent = '+'; const t2 = el('text', { x: x + 28, y: y + 6, class: 'pol' }, g); t2.textContent = '−'; }
    if (c === 'res') { el('rect', { x: x - 30, y: y - 12, width: 60, height: 24, rx: 11, fill: '#d8c39a' }, g); ['#7a4f26', '#222', '#c4521c', '#c9a227'].forEach((col, k) => el('rect', { x: x - 18 + k * 10, y: y - 12, width: 4, height: 24, fill: col }, g)); }
    if (c === 'led') { const a = flip[i] ? 1 : -1; el('circle', { cx: x, cy: y, r: 30, fill: 'url(#ledglow)', class: 'glow' }, g); el('circle', { cx: x, cy: y, r: 16, fill: '#e05545', class: 'led-body' }, g); const t = el('text', { x: x + a * 30, y: y + 6, class: 'pol' }, g); t.textContent = '+'; el('path', { d: `M${x + a * 6} ${y - 7} l${-a * 12} 7 l${a * 12} 7z`, fill: '#fff', opacity: .8 }, g); }
    if (c === 'sw') { el('rect', { x: x - 34, y: y - 12, width: 68, height: 24, rx: 4, fill: '#3a3f44' }, g); el('rect', { x: swOn ? x + 2 : x - 22, y: y - 9, width: 20, height: 18, rx: 3, fill: '#e3e7ea', class: 'knob' }, g); }
  }
  function draw() {
    gFp.innerHTML = ''; gPads.innerHTML = ''; gTr.innerHTML = '';
    traces.forEach(([a, b]) => { const [x1, y1] = padXY(a), [x2, y2] = padXY(b); el('line', { x1, y1, x2, y2, class: 'trace' }, gTr); });
    FP.forEach((_, i) => drawComp(i));
    FP.forEach((_, i) => ['a', 'b'].forEach(s => { const id = i + s, [x, y] = padXY(id); const p = el('circle', { cx: x, cy: y, r: 12, class: 'pad' + (firstPad === id ? ' sel' : ''), 'data-pad': id, tabindex: 0, role: 'button', 'aria-label': `pastille ${s === 'a' ? 'gauche' : 'droite'} de l'emplacement ${i + 1}` }, gPads); el('circle', { cx: x, cy: y, r: 4, fill: '#1d1b18', 'pointer-events': 'none' }, gPads); }));
    document.querySelectorAll('#pcb-parts .part').forEach(b => b.classList.toggle('used', comp.includes(b.dataset.c)));
    game.dataset.placed = comp.filter(Boolean).length;
  }
  const fpAt = (cx, cy) => { const pt = pcb.createSVGPoint(); pt.x = cx; pt.y = cy; const p = pt.matrixTransform(pcb.getScreenCTM().inverse()); return FP.findIndex(([x, y]) => Math.abs(p.x - x) < 75 && Math.abs(p.y - y) < 45); };
  function place(c, i) {
    if (i < 0) return; if (comp[i]) { say('Cet emplacement est déjà pris.', 'no'); TS.wrong(); return; }
    comp[i] = c; TS.click(); draw();
    const left = 4 - comp.filter(Boolean).length;
    say(left ? `${NAMES[c][0].toUpperCase() + NAMES[c].slice(1)} est soudée. Encore ${left}.` : 'Les 4 pièces sont posées. Tracez les pistes : touchez une pastille, puis une autre.');
    evaluate(false);
  }
  document.querySelectorAll('#pcb-parts .part').forEach(b => TS.pickable(b, {
    onDrop: (x, y) => place(b.dataset.c, fpAt(x, y)),
    onSelect: () => { document.querySelectorAll('#pcb-parts .part').forEach(x => x.classList.remove('sel')); selected = selected === b.dataset.c ? null : b.dataset.c; if (selected) { b.classList.add('sel'); say('Touchez un emplacement vide sur la plaque.'); } }
  }));
  const cross = (p1, p2, p3, p4) => { const d = (a, b, c) => (c[0] - a[0]) * (b[1] - a[1]) - (c[1] - a[1]) * (b[0] - a[0]); const d1 = d(p3, p4, p1), d2 = d(p3, p4, p2), d3 = d(p1, p2, p3), d4 = d(p1, p2, p4); return ((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) && ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0)); };
  function addTrace(a, b) {
    if (a === b) return;
    if (traces.some(([x, y]) => (x === a && y === b) || (x === b && y === a))) return;
    const A = padXY(a), B = padXY(b);
    if (traces.some(([x, y]) => ![x, y].includes(a) && ![x, y].includes(b) && cross(A, B, padXY(x), padXY(y)))) { TS.wrong(); say('Impossible : cette piste croiserait une autre piste. Sur une seule face, deux pistes qui se croisent se touchent.', 'no'); return; }
    traces.push([a, b]); TS.tone(1200, .06, .05, 'square'); draw(); evaluate(false);
  }
  pcb.addEventListener('click', e => {
    const pad = e.target.closest('[data-pad]');
    if (selected) { const i = fpAt(e.clientX, e.clientY); if (i >= 0) { const c = selected; selected = null; document.querySelectorAll('#pcb-parts .part').forEach(x => x.classList.remove('sel')); place(c, i); } return; }
    if (pad) { if (comp.filter(Boolean).length < 4) { say('Posez d\'abord les 4 pièces.', 'no'); return; }
      const id = pad.dataset.pad; if (!firstPad) { firstPad = id; draw(); say('Bien. Maintenant, touchez la pastille où la piste doit aller.'); } else { const a = firstPad; firstPad = null; addTrace(a, id); draw(); } return; }
    const fpG = e.target.closest('[data-fp]'); if (fpG) { const i = +fpG.dataset.fp; if (comp[i] === 'led') { flip[i] = !flip[i]; TS.click(); draw(); say('LED retournée.'); evaluate(false); } }
  });
  pcb.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.dataset.pad) { e.preventDefault(); e.target.dispatchEvent(new MouseEvent('click', { bubbles: true })); } });

  function evaluate(loud) {
    game.classList.remove('lit'); const ready = comp.every(Boolean); if (!ready) return null;
    const parent = {}; const f = x => parent[x] === undefined || parent[x] === x ? (parent[x] = x) : (parent[x] = f(parent[x]));
    const U = (a, b) => { parent[f(a)] = f(b); };
    const pads = []; FP.forEach((_, i) => pads.push(i + 'a', i + 'b')); pads.forEach(p => f(p)); traces.forEach(([a, b]) => U(a, b));
    const net = p => f(p), members = n => pads.filter(p => net(p) === n);
    const pi = comp.indexOf('pile'), plus = pi + 'a', minus = pi + 'b';
    let res;
    if (net(plus) === net(minus)) res = ['court', 'Court-circuit! Le + et le − de la pile sont reliés directement : le courant ne passe par rien, la pile chauffe. Effacez les pistes.'];
    else {
      let p = plus, seen = [], ledOk = true, open = false, branch = false;
      for (let step = 0; step < 6; step++) {
        const m = members(net(p)).filter(x => x !== p);
        if (m.length === 0) { open = true; break; } if (m.length > 1) { branch = true; break; }
        const q = m[0], ci = +q[0]; if (ci === pi) { if (q === minus) break; }
        seen.push(ci); if (comp[ci] === 'led') { const anode = flip[ci] ? ci + 'b' : ci + 'a'; if (q !== anode) ledOk = false; }
        p = ci + (q[1] === 'a' ? 'b' : 'a');
      }
      if (open) res = ['open', 'Le chemin est coupé : une pastille n\'est reliée à rien. Le courant a besoin d\'une boucle fermée, de la pile jusqu\'à la pile.'];
      else if (branch) res = ['branch', 'Une pastille est reliée à plusieurs pistes : le courant se partagerait. Pour ce circuit, faites une seule boucle, pièce après pièce.'];
      else if (new Set(seen).size < 3) res = ['skip', 'La boucle est fermée, mais elle saute une pièce. Faites passer le courant par la résistance, la LED et l\'interrupteur.'];
      else if (!ledOk) res = ['led', 'La LED est à l\'envers. C\'est une diode : un sens unique pour le courant. Touchez-la pour la retourner.'];
      else if (!swOn) res = ['ready', 'Le circuit est prêt. Fermez l\'interrupteur!'];
      else res = ['ok', 'Ça s\'allume! Le courant sort du +, traverse la résistance, la LED, l\'interrupteur, et revient au −. Vous avez fait un circuit imprimé.'];
    }
    if (res[0] === 'ok') { game.classList.add('lit'); if (game.dataset.state !== 'win') { TS.win(); TS.confetti(pcb); } game.dataset.state = 'win'; say(res[1], 'ok'); }
    else if (loud || res[0] === 'court' || (res[0] === 'ready')) { say(res[1], res[0] === 'ready' ? '' : 'no'); if (loud) TS.wrong(); }
    return res[0];
  }
  $('pcb-sw').addEventListener('click', () => { if (!comp.includes('sw')) { say('Posez d\'abord l\'interrupteur.', 'no'); return; } swOn = !swOn; $('pcb-sw').textContent = swOn ? '⏻ Ouvrir l\'interrupteur' : '⏻ Fermer l\'interrupteur'; TS.click(); draw(); const r = evaluate(swOn); if (!swOn) say('Interrupteur ouvert : le chemin est coupé, la LED s\'éteint.'); });
  $('pcb-undo').addEventListener('click', () => { traces = []; firstPad = null; game.dataset.state = ''; draw(); evaluate(false); say('Pistes effacées.'); });
  $('pcb-reset').addEventListener('click', () => { comp = [null, null, null, null]; flip = [false, false, false, false]; traces = []; firstPad = null; swOn = false; selected = null; game.dataset.state = ''; $('pcb-sw').textContent = '⏻ Fermer l\'interrupteur'; draw(); evaluate(false); say('Posez d\'abord les pièces.'); });
  draw();

  /* =============== PORTES LOGIQUES =============== */
  const G = { ET: (a, b) => a & b, OU: (a, b) => a | b, XOR: (a, b) => a ^ b }, LBL = { ET: 'ET', OU: 'OU', XOR: 'OU-exclusif' };
  const slots = { carry: null, sum: null }; let A = 0, B = 0, gSel = null;
  function gDraw() {
    document.querySelectorAll('.gslot').forEach(s => { const g = slots[s.dataset.slot]; s.querySelector('.g-in').textContent = g ? LBL[g] : '?'; s.classList.toggle('filled', !!g); });
    $('gA').innerHTML = `A = <b>${A}</b>`; $('gB').innerHTML = `B = <b>${B}</b>`; $('gA').setAttribute('aria-pressed', !!A); $('gB').setAttribute('aria-pressed', !!B);
    const c = slots.carry ? G[slots.carry](A, B) : null, s = slots.sum ? G[slots.sum](A, B) : null;
    $('o-carry').className = 'led-out' + (c ? ' on' : ''); $('o-sum').className = 'led-out' + (s ? ' on' : '');
    $('g-res').innerHTML = c === null || s === null ? `${A} + ${B} = <b>?</b>` : `${A} + ${B} = <b>${c}${s}</b> en binaire = <b>${c * 2 + s}</b>`;
  }
  $('gA').addEventListener('click', () => { A ^= 1; TS.click(); gDraw(); }); $('gB').addEventListener('click', () => { B ^= 1; TS.click(); gDraw(); });
  const putGate = (g, slot) => { if (!slot) return; slots[slot] = g; TS.click(); gDraw(); $('g-msg').textContent = ''; };
  const slotAt = (x, y) => { const s = [...document.querySelectorAll('.gslot')].find(s => { const r = s.getBoundingClientRect(); return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom; }); return s ? s.dataset.slot : null; };
  document.querySelectorAll('.gate').forEach(b => TS.pickable(b, {
    onDrop: (x, y) => putGate(b.dataset.g, slotAt(x, y)),
    onSelect: () => { document.querySelectorAll('.gate').forEach(x => x.classList.remove('sel')); gSel = gSel === b.dataset.g ? null : b.dataset.g; if (gSel) { b.classList.add('sel'); $('g-msg').className = 'msg'; $('g-msg').textContent = 'Touchez maintenant la case Retenue ou Somme.'; } }
  }));
  document.querySelectorAll('.gslot').forEach(s => s.addEventListener('click', () => { if (gSel) { putGate(gSel, s.dataset.slot); gSel = null; document.querySelectorAll('.gate').forEach(x => x.classList.remove('sel')); } }));
  $('g-test').addEventListener('click', async () => {
    const t = $('truth'); t.querySelectorAll('tr.row').forEach(r => r.remove());
    if (!slots.carry || !slots.sum) { $('g-msg').className = 'msg no'; $('g-msg').textContent = 'Placez une porte dans chaque case.'; TS.wrong(); return; }
    let ok = true;
    for (const [a, b] of [[0, 0], [0, 1], [1, 0], [1, 1]]) {
      A = a; B = b; gDraw(); const c = G[slots.carry](a, b), s = G[slots.sum](a, b), good = c * 2 + s === a + b; if (!good) ok = false;
      t.insertAdjacentHTML('beforeend', `<tr class="row ${good ? 'good' : 'bad'}"><td>${a}</td><td>${b}</td><td>${c}</td><td>${s}</td><td>${c}${s} = ${c * 2 + s} ${good ? '✔' : '✘ (devrait être ' + (a + b) + ')'}</td></tr>`);
      TS.blip(a * 2 + b); await TS.anim(350, () => {});
    }
    const m = $('g-msg');
    if (ok) { m.className = 'msg ok'; m.textContent = 'Bravo! 1 + 1 = 10 en binaire, c\'est-à-dire 2. Retenue = ET, Somme = OU-exclusif. Vous venez de construire un « demi-additionneur », le cœur du calcul dans une puce.'; TS.win(); TS.confetti($('gates')); $('gates').dataset.state = 'win'; }
    else { m.className = 'msg no'; TS.wrong(); $('gates').dataset.state = 'fail';
      m.textContent = slots.sum === 'OU' ? 'Presque : avec OU, 1 + 1 donne 11 (3). La somme doit s\'éteindre quand les deux sont à 1 : il faut « l\'un ou l\'autre, mais pas les deux ».' : slots.carry !== 'ET' ? 'La retenue ne doit s\'allumer que si A et B valent 1 tous les deux.' : 'Regardez les lignes en rouge : quelle porte donne le bon chiffre?'; }
  });
  gDraw();

  /* =============== PHOTOLITHOGRAPHIE =============== */
  const dies = $('dies'); let lithoBusy = false;
  $('litho-go').addEventListener('click', async () => {
    if (lithoBusy) return; lithoBusy = true; dies.innerHTML = ''; const s = $('litho-svg'); s.classList.add('flash'); TS.tone(300, .6, .06, 'sawtooth');
    const cells = []; for (let y = -32; y <= 24; y += 9) for (let x = -32; x <= 24; x += 9) if (Math.hypot(x + 4, y + 4) < 36) cells.push([x, y]);
    for (let k = 0; k < cells.length; k++) { const [x, y] = cells[k]; el('rect', { x: 160 + x, y: 160 + y, width: 8, height: 8, class: 'die' }, dies); if (k % 6 === 0) { TS.blip(k % 5); await TS.anim(40, () => {}); } }
    s.classList.remove('flash'); lithoBusy = false; s.dataset.state = 'done';
  });

  /* =============== ZOOM =============== */
  const zs = $('zoom-svg'), zc = $('zoom-cap');
  const CAPS = [
    '<b>Votre demi-additionneur</b> : 2 portes (ET et OU-exclusif), une vingtaine de transistors au plus.',
    '<b>Un additionneur 8 bits</b> : 8 blocs comme le vôtre, un peu plus complets, en chaîne. La retenue passe de l\'un à l\'autre. Il additionne des nombres jusqu\'à 255.',
    '<b>Un cœur de processeur</b> : des millions de portes. Additionner, comparer, mémoriser, décider quoi faire ensuite.',
    '<b>Une puce de cellulaire</b> : plusieurs cœurs (CPU), une partie pour les images (GPU), de la mémoire. Des dizaines de milliards de transistors, sur à peu près la taille d\'un ongle. Chacun est des milliers de fois plus fin qu\'un cheveu.',
    '<b>Sur la carte mère</b>, des pistes de cuivre relient la puce à la batterie, à l\'écran, à l\'antenne. Exactement comme votre circuit imprimé, en plus petit et sur plusieurs couches.'
  ];
  function zoom(n) {
    zs.innerHTML = ''; const g = el('g', { class: 'zoom-in' }, zs);
    el('rect', { width: 400, height: 240, fill: n < 3 ? '#14361f' : n === 3 ? '#2a2d31' : '#1f6b3f' }, g);
    if (n === 0) { [['ET', 120], ['OU-exclusif', 280]].forEach(([t, x]) => { el('rect', { x: x - 60, y: 80, width: 120, height: 70, rx: 10, fill: '#e3e7ea' }, g); const tx = el('text', { x, y: 122, class: 'zt' }, g); tx.textContent = t; }); ['A', 'B'].forEach((t, i) => { el('path', { d: `M30 ${100 + i * 30} H60 M30 ${100 + i * 30} H40 V${100 + i * 30} M200 ${100 + i * 30} H220`, stroke: '#b87333', 'stroke-width': 4 }, g); const tx = el('text', { x: 20, y: 105 + i * 30, class: 'zt light' }, g); tx.textContent = t; }); }
    if (n === 1) for (let i = 0; i < 8; i++) { el('rect', { x: 14 + i * 47, y: 90, width: 40, height: 60, rx: 5, fill: '#e3e7ea' }, g); const tx = el('text', { x: 34 + i * 47, y: 126, class: 'zt sm' }, g); tx.textContent = '+'; if (i < 7) el('path', { d: `M${54 + i * 47} 120 h7`, stroke: '#ffd36b', 'stroke-width': 3 }, g); }
    if (n === 2) for (let y = 0; y < 10; y++) for (let x = 0; x < 16; x++) el('rect', { x: 20 + x * 23, y: 12 + y * 22, width: 19, height: 18, rx: 2, fill: ['#e3e7ea', '#cfd6db', '#b8c2c9', '#ffd36b'][(x * 7 + y * 3) % 4], opacity: .9 }, g);
    if (n === 3) { el('rect', { x: 90, y: 20, width: 220, height: 200, rx: 6, fill: '#7d868e' }, g); [[100, 30, 95, 80, '#c9d3da', 'CPU'], [205, 30, 95, 80, '#9fb2c0', 'CPU'], [100, 120, 120, 90, '#e0a458', 'GPU'], [228, 120, 72, 90, '#b8c2c9', 'mémoire']].forEach(([x, y, w, h, c, t]) => { el('rect', { x, y, width: w, height: h, fill: c }, g); const tx = el('text', { x: x + w / 2, y: y + h / 2 + 5, class: 'zt sm' }, g); tx.textContent = t; }); }
    if (n === 4) { for (let i = 0; i < 14; i++) el('path', { d: `M200 120 L${20 + (i * 97) % 360} ${i % 2 ? 20 : 220}`, stroke: '#c9a227', 'stroke-width': 2.5, opacity: .8 }, g); el('rect', { x: 170, y: 95, width: 60, height: 50, rx: 4, fill: '#2a2d31' }, g); [['batterie', 40, 40], ['écran', 330, 40], ['antenne', 40, 205], ['caméra', 330, 205]].forEach(([t, x, y]) => { el('rect', { x: x - 34, y: y - 16, width: 68, height: 30, rx: 4, fill: '#e3e7ea' }, g); const tx = el('text', { x, y: y + 4, class: 'zt sm' }, g); tx.textContent = t; }); const tx = el('text', { x: 200, y: 125, class: 'zt sm light' }, g); tx.textContent = 'puce'; }
    zc.innerHTML = CAPS[n]; TS.blip(n);
  }
  $('zoom-r').addEventListener('input', e => zoom(+e.target.value)); zoom(0);
})();

/* Chapitre 3 : du doigt au transistor, circuit imprimé (niveaux), portes logiques (niveaux), photolithographie, zoom */
(() => {
  const $ = id => document.getElementById(id), TS = window.TS, NS = 'http://www.w3.org/2000/svg';
  const el = (tag, attrs, parent) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; };
  const wait = ms => new Promise(r => setTimeout(r, ms));

  /* ================= JEU 6 : DU DOIGT AU TRANSISTOR ================= */
  const swSvg = $('sw-svg'), swCtrl = $('sw-ctrl'), swTask = $('sw-task'), swMsg = $('sw-msg'), swg = $('swg');
  const ssay = (t, c = '') => { swMsg.innerHTML = t; swMsg.className = 'msg ' + c; };
  const PILE = (x, y, s = 1, lbl = '') => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-16" y="-30" width="32" height="60" rx="5" fill="#2b2926"/><rect x="-16" y="-30" width="32" height="16" fill="#c4a03a"/><rect x="-6" y="-36" width="12" height="6" fill="url(#metal)"/><text y="14" class="svg-l light">${lbl}</text></g>`;
  const LAMP = (x, y, id, r = 16) => `<g class="lampg" id="${id}"><circle cx="${x}" cy="${y}" r="${r * 2.2}" class="lamp-glow"/><circle cx="${x}" cy="${y}" r="${r}" class="lamp-b"/><path d="M${x - 6} ${y + 4} l3 -8 3 8 3 -8" stroke="#8a6d2f" stroke-width="1.5" fill="none"/></g>`;
  const TR = (x, y, id, lbl) => `<g id="${id}" class="trg"><rect x="${x - 34}" y="${y - 16}" width="68" height="32" rx="4" fill="#8e9aa3"/><rect x="${x - 34}" y="${y - 22}" width="20" height="8" fill="#b87333"/><rect x="${x + 14}" y="${y - 22}" width="20" height="8" fill="#b87333"/><rect x="${x - 10}" y="${y - 34}" width="20" height="14" fill="#c4521c"/><rect x="${x - 14}" y="${y - 16}" width="28" height="5" class="chan"/><text x="${x}" y="${y + 9}" class="svg-l">${lbl}</text></g>`;
  const SWLV = [
    { t: 'Interrupteur', task: '<b>Niveau 1 · L\'interrupteur.</b> Un <b>interrupteur</b> ouvre ou ferme le chemin du courant. Allumez la lampe, puis éteignez-la.' },
    { t: 'Relais', task: '<b>Niveau 2 · Le relais.</b> Allumez la <b>grosse</b> lampe… en appuyant seulement sur le <b>petit</b> bouton. Le <b>relais</b> : un aimant qui actionne un interrupteur.' },
    { t: 'Transistor', task: '<b>Niveau 3 · Le transistor.</b> Plus de pièce qui bouge. Montez doucement la tension sur la <b>grille</b> (la porte d\'entrée du transistor) et trouvez à partir de quand la lampe s\'allume.' },
    { t: 'En chaîne', task: '<b>Niveau 4 · Un transistor en commande un autre.</b> La sortie de l\'un va sur la grille du suivant. Allumez la lampe au bout de la chaîne, puis répondez.' },
    { t: 'ET / OU', task: '<b>Niveau 5 · Deux transistors, une question.</b> Choisissez comment les relier pour que la lampe réponde à la question demandée. Puis testez les 4 cas.' }
  ];
  let swState = {};
  const SWL = TS.levels($('sw-lv'), SWLV.map(l => l.t), i => swLevel(i));
  function swWin(i, text) { TS.win(); TS.confetti(swSvg); SWL.done(i); swg.dataset.state = 'win' + i; ssay(text, 'ok'); if (i < 4) setTimeout(() => { if (SWL.cur === i) SWL.go(i + 1); }, 2600); }
  function quiz(q, answers, good, why, onOk) {
    swCtrl.insertAdjacentHTML('beforeend', `<div class="quiz"><p>${q}</p>${answers.map((a, k) => `<button class="btn ghost qa" data-k="${k}">${a}</button>`).join('')}</div>`);
    swCtrl.querySelectorAll('.qa').forEach(b => b.addEventListener('click', () => { if (+b.dataset.k === good) { TS.good(); TS.flash(b, 'good'); TS.bubble(b, why, 'good'); onOk(); swCtrl.querySelectorAll('.qa').forEach(x => x.disabled = true); } else { TS.bad(); TS.flash(b, 'bad'); TS.bubble(b, 'Pas tout à fait. Regardez le dessin : ' + why.split(':')[0].toLowerCase() + '…', 'bad'); } }));
  }
  function swLevel(i) {
    swState = { i }; swTask.innerHTML = SWLV[i].task; ssay(''); swCtrl.innerHTML = ''; swg.dataset.state = '';
    if (i === 0) {
      swSvg.innerHTML = `<rect width="600" height="260" fill="#f3ede3"/><path d="M60 100 V40 H270 M330 40 H540 V110 M540 150 V220 H60 V160" class="wire" id="w1"/>${PILE(60, 130, 1, '')}<g id="s1"><circle cx="270" cy="40" r="6" fill="#3a3f44"/><circle cx="330" cy="40" r="6" fill="#3a3f44"/><line x1="270" y1="40" x2="326" y2="10" class="lever" id="s1l"/></g><rect x="250" y="0" width="100" height="70" fill="transparent" class="hit" id="s1h"/>${LAMP(540, 130, 'l1')}<text x="300" y="100" class="svg-l">touchez l'interrupteur</text><circle r="5" class="elec" id="e1"/>`;
      swState.on = false; swState.wasOn = false;
      const tog = () => { swState.on = !swState.on; $('s1l').setAttribute('x2', swState.on ? 330 : 326); $('s1l').setAttribute('y2', swState.on ? 40 : 10); $('l1').classList.toggle('on', swState.on); $('w1').classList.toggle('live', swState.on); $('e1').classList.toggle('run', swState.on); TS.click();
        if (swState.on) { TS.good(); TS.bubble($('s1h'), '<b>Fermé</b> : le chemin est complet, le courant fait le tour. Lampe allumée = <b>1</b>.', 'good'); swState.wasOn = true; }
        else { TS.bubble($('s1h'), '<b>Ouvert</b> : un trou dans le chemin, le courant s\'arrête. Lampe éteinte = <b>0</b>.'); if (swState.wasOn) { window.Path.learn('inter'); swWin(0, 'Vous avez écrit 1, puis 0, avec votre doigt. Un interrupteur, c\'est un <b>bit</b> qu\'on touche.'); } } };
      $('s1h').addEventListener('click', tog); swCtrl.innerHTML = '<button class="btn" id="s1b">Basculer l\'interrupteur</button>'; $('s1b').addEventListener('click', tog);
    }
    if (i === 1) {
      swSvg.innerHTML = `<rect width="600" height="260" fill="#f3ede3"/><text x="130" y="22" class="svg-l">petit circuit (1,5 V)</text><text x="460" y="22" class="svg-l">grand circuit (120 V, prise de maison)</text>
        <path d="M50 150 V60 H110 M150 60 H230 V150 M230 210 V240 H50 V180" class="wire" id="w2a"/>${PILE(50, 165, .7, '')}<g><circle cx="110" cy="60" r="5" fill="#3a3f44"/><circle cx="150" cy="60" r="5" fill="#3a3f44"/><line x1="110" y1="60" x2="148" y2="40" class="lever" id="b2"/></g>
        <g id="coil"><rect x="205" y="150" width="50" height="60" rx="6" fill="url(#metal)"/><path d="M207 158 h46 M207 166 h46 M207 174 h46 M207 182 h46 M207 190 h46 M207 198 h46" stroke="#b87333" stroke-width="3"/><path d="M190 140 q40 -40 80 0 M180 150 q50 -60 100 0" class="field"/></g>
        <path d="M300 120 V60 H560 V120 M560 170 V240 H400 V140" class="wire big" id="w2b"/>${PILE(560, 145, 1, '')}<circle cx="300" cy="120" r="5" fill="#3a3f44"/><line x1="300" y1="120" x2="400" y2="108" class="lever" id="arm"/><circle cx="400" cy="140" r="5" fill="#3a3f44"/>${LAMP(470, 60, 'l2', 18)}
        <text x="350" y="160" class="svg-l">lame de fer</text><text x="230" y="232" class="svg-l">bobine</text>`;
      swCtrl.innerHTML = '<button class="btn" id="b2b">✋ Petit bouton : appuyer</button>';
      let on = false, quizzed = false;
      $('b2b').addEventListener('click', () => { on = !on; $('b2b').textContent = on ? '✋ Petit bouton : relâcher' : '✋ Petit bouton : appuyer'; $('b2').setAttribute('x2', on ? 150 : 148); $('b2').setAttribute('y2', on ? 60 : 40); $('w2a').classList.toggle('live', on); $('coil').classList.toggle('mag', on);
        setTimeout(() => { $('arm').setAttribute('y2', on ? 140 : 108); $('w2b').classList.toggle('live', on); $('l2').classList.toggle('on', on); TS.click(); if (on) TS.tone(120, .15, .1, 'square'); }, on ? 250 : 0);
        if (on) TS.bubble($('coil'), 'Le petit courant traverse la <b>bobine</b> (un fil enroulé) : elle devient un <b>aimant</b> et tire la lame de fer, qui ferme le grand circuit.', 'good');
        if (on && !quizzed) { quizzed = true; setTimeout(() => quiz('Question : le petit circuit et le grand circuit sont-ils reliés par un fil?', ['Oui, par un fil', 'Non, seulement par l\'aimant'], 1, 'Seulement par l\'aimant : le petit commande le grand sans le toucher. Certains des premiers ordinateurs, comme le Z3 (1941) et le Harvard Mark I (1944), utilisaient des milliers de relais.', () => swWin(1, 'Un petit courant en commande un grand. Certains des premiers ordinateurs en avaient des milliers… et ils cliquetaient!')), 600); } });
    }
    if (i === 2) {
      swSvg.innerHTML = `<rect width="600" height="260" fill="#e9eef1"/><path d="M80 110 V50 H520 V110 M520 150 V220 H330 M270 220 H80 V170" class="wire" id="w3"/>${PILE(80, 140, 1, '')}${LAMP(520, 130, 'l3', 18)}${TR(300, 236, 't3', 'transistor')}<path d="M300 202 V160 H170" class="wire thin" id="g3w"/><text x="170" y="150" class="svg-l">grille</text><text x="300" y="30" class="svg-l">le grand courant passe… si la grille le permet</text>`;
      swCtrl.innerHTML = '<label class="vlab">Tension sur la grille : <b id="v3">0,0 V</b><input type="range" id="r3" min="0" max="10" value="0" step="1"></label>';
      let found = false, wasOff = true;
      $('r3').addEventListener('input', e => { const v = +e.target.value / 10; $('v3').textContent = v.toFixed(1).replace('.', ',') + ' V';
        const k = v < .6 ? 0 : Math.min(1, (v - .5) / .3); $('l3').style.setProperty('--b', k); $('l3').classList.toggle('on', k > 0); $('t3').classList.toggle('open', k > 0); $('w3').classList.toggle('live', k > 0); $('g3w').classList.toggle('live', v > 0);
        if (k > 0 && wasOff) { wasOff = false; TS.good(); TS.bubble($('t3'), `À ${v.toFixed(1).replace('.', ',')} V, le passage sous la grille s'ouvre : le grand courant traverse. En dessous, rien ne passe. Ce point s'appelle le <b>seuil</b>.`, 'good');
          if (!found && v <= .7) { found = true; window.Path.learn('trans'); swWin(2, 'Trouvé : environ 0,6 V suffit (ça dépend du transistor). Une toute petite tension commande un grand courant, sans aucune pièce qui bouge, des milliards de fois par seconde.'); } }
        if (k === 0) { if (!wasOff) TS.bubble($('t3'), 'Sous le seuil : la grille ne pousse pas assez, le passage reste fermé.'); wasOff = true; } TS.blip(+e.target.value % 6); });
    }
    if (i === 3) {
      swSvg.innerHTML = `<rect width="600" height="260" fill="#e9eef1"/>${TR(150, 150, 'c1', 'T1')}${TR(300, 150, 'c2', 'T2')}${TR(450, 150, 'c3', 'T3')}<path d="M60 116 H150" class="wire thin" id="cw0"/><path d="M184 134 V100 H300 V116" class="wire thin" id="cw1"/><path d="M334 134 V100 H450 V116" class="wire thin" id="cw2"/><path d="M484 134 V80 H540" class="wire thin" id="cw3"/>${LAMP(555, 80, 'l4', 14)}<text x="60" y="106" class="svg-l">A</text><text x="300" y="215" class="svg-l">la sortie de chacun pousse la grille du suivant</text>`;
      swCtrl.innerHTML = '<button class="btn" id="a4">A = 0 (touchez pour mettre 1)</button>';
      let A = 0, quizzed = false;
      $('a4').addEventListener('click', async () => { A ^= 1; $('a4').textContent = `A = ${A} (touchez pour mettre ${1 - A})`; TS.click();
        for (let k = 0; k < 4; k++) { $('cw' + k).classList.toggle('live', !!A); if (k < 3) $('c' + (k + 1)).classList.toggle('open', !!A); TS.blip(k); await wait(260); }
        $('l4').classList.toggle('on', !!A);
        if (A) TS.bubble($('c2'), 'Le signal voyage de transistor en transistor. Dans une puce, c\'est comme ça qu\'un 1 traverse des milliers d\'étages.', 'good');
        if (A && !quizzed) { quizzed = true; quiz('Question : si A repasse à 0, que fait la lampe?', ['Elle reste allumée', 'Elle s\'éteint'], 1, 'Elle s\'éteint : chaque transistor suit l\'ordre du précédent. Rien n\'est retenu, tout est commandé.', () => swWin(3, 'Un transistor peut en commander un autre. C\'est la base de tout : des chaînes de petits interrupteurs.')); } });
    }
    if (i === 4) {
      swState = { i, mode: null, A: 0, B: 0, target: 'ET', passed: [] };
      swCtrl.innerHTML = `<div class="seg"><button class="btn ghost" data-m="serie">À la suite (l'un après l'autre)</button><button class="btn ghost" data-m="para">Côte à côte (deux chemins)</button></div><div class="seg"><button class="bit dark" id="sA">A = 0</button><button class="bit dark" id="sB">B = 0</button></div><button class="btn" id="s5t">✔ Tester les 4 cas</button><table class="truth light" id="s5tab"></table>`;
      const draw = () => { const { mode, A, B } = swState, on = mode === 'serie' ? A && B : mode === 'para' ? A || B : 0;
        swSvg.innerHTML = `<rect width="600" height="260" fill="#e9eef1"/><text x="300" y="26" class="svg-l big">Question : la lampe doit s'allumer si <tspan fill="#c4521c">A ${swState.target === 'ET' ? 'ET' : 'OU'} B</tspan></text>${PILE(50, 150, 1, '')}${LAMP(550, 150, 'l5', 16)}` +
          (mode === 'serie' ? `<path d="M50 120 V80 H190 M260 80 H340 M410 80 H550 V134 M550 166 V230 H50 V180" class="wire ${on ? 'live' : ''}"/>${TR(225, 96, 'tA', 'A')}${TR(375, 96, 'tB', 'B')}` :
           mode === 'para' ? `<path d="M50 120 V60 H230 M300 60 H480 V150 M50 120 V60 M140 60 V160 H230 M300 160 H480 M480 150 H534 M550 166 V230 H50 V180" class="wire ${on ? 'live' : ''}"/>${TR(265, 76, 'tA', 'A')}${TR(265, 176, 'tB', 'B')}` : `<text x="300" y="150" class="svg-l">Choisissez un montage ci-dessous</text>`);
        if (mode) { $('tA').classList.toggle('open', !!A); $('tB').classList.toggle('open', !!B); $('l5').classList.toggle('on', !!on); }
        $('sA').textContent = 'A = ' + A; $('sB').textContent = 'B = ' + B; $('sA').setAttribute('aria-pressed', !!A); $('sB').setAttribute('aria-pressed', !!B); return on; };
      swCtrl.querySelectorAll('[data-m]').forEach(b => b.addEventListener('click', () => { swState.mode = b.dataset.m; swCtrl.querySelectorAll('[data-m]').forEach(x => x.classList.toggle('on', x === b)); TS.click(); draw();
        TS.bubble(b, b.dataset.m === 'serie' ? 'À la suite : le courant doit traverser A <b>puis</b> B. Un seul transistor passant ne suffit pas.' : 'Côte à côte : deux chemins. Le courant passe par A <b>ou</b> par B.'); }));
      $('sA').addEventListener('click', () => { swState.A ^= 1; TS.click(); draw(); }); $('sB').addEventListener('click', () => { swState.B ^= 1; TS.click(); draw(); });
      $('s5t').addEventListener('click', async () => {
        if (!swState.mode) { TS.bad(); TS.bubble($('s5t'), 'Choisissez d\'abord un montage.', 'bad'); return; }
        const tab = $('s5tab'); tab.innerHTML = '<tr><th>A</th><th>B</th><th>Lampe</th><th>Attendu</th></tr>'; let ok = true;
        for (const [a, b] of [[0, 0], [0, 1], [1, 0], [1, 1]]) { swState.A = a; swState.B = b; const on = draw() ? 1 : 0, want = swState.target === 'ET' ? a & b : a | b; if (on !== want) ok = false;
          tab.insertAdjacentHTML('beforeend', `<tr class="${on === want ? 'good' : 'bad'}"><td>${a}</td><td>${b}</td><td>${on ? '💡' : '·'}</td><td>${want ? '💡' : '·'} ${on === want ? '✔' : '✘'}</td></tr>`); TS.blip(a * 2 + b); await wait(380); }
        if (!ok) { TS.bad(); TS.flash(swSvg, 'bad'); ssay(swState.target === 'ET' ? 'Raté : avec ce montage, un seul transistor passant suffit. Pour « ET », le courant doit traverser les deux.' : 'Raté : avec ce montage, il faut les deux. Pour « OU », il faut deux chemins.', 'no'); return; }
        TS.good(); TS.flash(swSvg, 'good');
        if (swState.target === 'ET') { ssay('Bravo : « à la suite » = porte <b>ET</b>. Maintenant, faites la porte <b>OU</b>.', 'ok'); TS.bubble(swSvg, 'Vous venez de fabriquer une <b>porte logique ET</b> avec deux transistors.', 'good'); swState.target = 'OU'; swState.mode = null; swCtrl.querySelectorAll('[data-m]').forEach(x => x.classList.remove('on')); swState.A = swState.B = 0; draw(); }
        else { window.Path.learn('porte'); swWin(4, 'Deux montages, deux questions : à la suite = <b>ET</b>, côte à côte = <b>OU</b>. Une puce est faite de milliards de portes comme celles-ci.'); }
      });
      draw();
    }
  }
  swLevel(0);

  /* ================= JEU 7 : CIRCUIT IMPRIMÉ (niveaux) ================= */
  const NAMES = { pile: 'la pile', res: 'la résistance', led: 'la LED', sw: 'l\'interrupteur' };
  const PCBLV = [
    { t: 'Première boucle', task: '<b>Niveau 1 · Une boucle.</b> Pile, résistance, LED. Reliez-les en une seule boucle : du + de la pile jusqu\'au −.', fps: [[300, 80], [150, 240], [450, 240]], parts: ['pile', 'res', 'led'], goal: r => r.lit.length === 1 },
    { t: 'Interrupteur', task: '<b>Niveau 2 · Ajoutez un interrupteur.</b> Même boucle, avec un interrupteur pour allumer et éteindre. Puis fermez-le.', fps: [[150, 95], [450, 95], [450, 245], [150, 245]], parts: ['pile', 'res', 'led', 'sw'], sw: true, goal: r => r.lit.length === 1 },
    { t: 'Deux LED', task: '<b>Niveau 3 · Deux LED côte à côte.</b> Allumez les deux LED avec une seule pile. Indice : une pastille peut recevoir plusieurs pistes (deux chemins = « en parallèle »).', fps: [[300, 60], [130, 170], [450, 170], [450, 285]], parts: ['pile', 'res', 'led', 'led'], goal: r => r.lit.length === 2 },
    { t: 'Réparer', task: '<b>Niveau 4 · Réparez la carte.</b> Cette carte revient de chez un client : elle ne s\'allume plus. Il y a deux défauts. Trouvez-les et réparez.', fps: [[150, 95], [450, 95], [450, 245], [150, 245]], parts: [], sw: true, pre: { comp: ['pile', 'res', 'led', 'sw'], flip: [false, false, true, false], traces: [['0a', '3a'], ['3b', '2a'], ['2b', '1b']], swOn: true }, goal: r => r.lit.length === 1 }
  ];
  const pcb = $('pcb'), gFp = $('fps'), gPads = $('pads'), gTr = $('traces'), pmsg = $('pcb-msg'), game = $('pcbg');
  let L, FP, comp, flip, traces, firstPad, swOn, selected, tray;
  const padXY = id => { const f = +id[0], s = id[1]; return [FP[f][0] + (s === 'a' ? -60 : 60), FP[f][1]]; };
  const psay = (t, c = '') => { pmsg.innerHTML = t; pmsg.className = 'msg ' + c; };
  const PL = TS.levels($('pcb-lv'), PCBLV.map(l => l.t), i => pcbLevel(i));
  function pcbLevel(i) {
    L = PCBLV[i]; FP = L.fps; const pre = L.pre || {};
    comp = pre.comp ? pre.comp.slice() : FP.map(() => null); flip = pre.flip ? pre.flip.slice() : FP.map(() => false); traces = pre.traces ? pre.traces.map(x => x.slice()) : []; swOn = !!pre.swOn; firstPad = null; selected = null; game.dataset.state = ''; game.dataset.lvl = i;
    tray = L.parts.map((c, k) => ({ c, k, used: false }));
    $('pcb-parts').innerHTML = tray.map(p => `<button class="part" data-k="${p.k}">${ICON[p.c]}${NAMES[p.c].replace(/^(la |l')/, '').replace(/^./, m => m.toUpperCase())}</button>`).join('');
    $('pcb-parts').querySelectorAll('.part').forEach(b => TS.pickable(b, {
      onDrop: (x, y) => place(+b.dataset.k, fpAt(x, y)),
      onSelect: () => { $('pcb-parts').querySelectorAll('.part').forEach(x => x.classList.remove('sel')); selected = selected === +b.dataset.k ? null : +b.dataset.k; if (selected !== null) { b.classList.add('sel'); psay('Touchez un emplacement vide sur la plaque.'); } } }));
    $('pcb-parts').hidden = !tray.length; $('pcb-sw').hidden = !L.sw; $('pcb-sw').textContent = swOn ? '⏻ Ouvrir l\'interrupteur' : '⏻ Fermer l\'interrupteur';
    $('pcb-task').innerHTML = L.task; draw(); psay(tray.length ? 'Posez d\'abord les pièces.' : 'Regardez bien la carte : une piste manque, et une pièce est posée à l\'envers.');
    if (L.pre) evaluate(true);
  }
  const ICON = { pile: '<svg viewBox="0 0 60 40"><rect x="6" y="10" width="44" height="20" rx="3" fill="#2b2926"/><rect x="6" y="10" width="14" height="20" fill="#c4a03a"/><text x="30" y="25" fill="#fff" font-size="10" text-anchor="middle">+ −</text></svg>', res: '<svg viewBox="0 0 60 40"><path d="M2 20 h12 M46 20 h12" stroke="#9aa3aa" stroke-width="3"/><rect x="14" y="12" width="32" height="16" rx="7" fill="#d8c39a"/><path d="M21 12 v16" stroke="#7a4f26" stroke-width="3"/><path d="M33 12 v16" stroke="#c4521c" stroke-width="3"/></svg>', led: '<svg viewBox="0 0 60 40"><path d="M22 34 v-14 a8 8 0 0 1 16 0 v14z" fill="#e05545"/><path d="M26 34 v4 M34 34 v6" stroke="#9aa3aa" stroke-width="2"/></svg>', sw: '<svg viewBox="0 0 60 40"><rect x="10" y="16" width="40" height="14" rx="3" fill="#3a3f44"/><rect x="18" y="8" width="12" height="10" rx="2" fill="#e3e7ea"/></svg>' };
  const PLACED = { pile: 'La <b>pile</b> pousse le courant : il sort par le + et doit revenir par le −.', res: 'La <b>résistance</b> freine le courant. Sans elle, la LED recevrait trop et grillerait.', led: 'La <b>LED</b> s\'allume quand le courant la traverse dans le bon sens : du + vers le −.', sw: 'L\'<b>interrupteur</b> coupe ou ferme le chemin. Ouvert = 0, fermé = 1.' };
  function drawComp(i, litSet) {
    const [x, y] = FP[i], g = el('g', { class: 'fp', 'data-fp': i }, gFp), c = comp[i];
    el('rect', { x: x - 52, y: y - 26, width: 104, height: 52, rx: 6, class: c ? 'silk-box on' : 'silk-box' }, g);
    if (!c) { const t = el('text', { x, y: y + 5, class: 'silk' }, g); t.textContent = 'emplacement ' + (i + 1); return; }
    if (c === 'pile') { el('rect', { x: x - 40, y: y - 16, width: 80, height: 32, rx: 4, fill: '#2b2926' }, g); el('rect', { x: x - 40, y: y - 16, width: 24, height: 32, fill: '#c4a03a' }, g); el('text', { x: x - 28, y: y + 6, class: 'pol' }, g).textContent = '+'; el('text', { x: x + 28, y: y + 6, class: 'pol' }, g).textContent = '−'; }
    if (c === 'res') { el('rect', { x: x - 30, y: y - 12, width: 60, height: 24, rx: 11, fill: '#d8c39a' }, g); ['#7a4f26', '#222', '#c4521c', '#c9a227'].forEach((col, k) => el('rect', { x: x - 18 + k * 10, y: y - 12, width: 4, height: 24, fill: col }, g)); }
    if (c === 'led') { const a = flip[i] ? 1 : -1, lit = litSet.has(i); el('circle', { cx: x, cy: y, r: 32, fill: 'url(#ledglow)', class: 'glow' + (lit ? ' on' : '') }, g); el('circle', { cx: x, cy: y, r: 16, fill: lit ? '#ff6b5a' : '#c9473a' }, g); el('text', { x: x + a * 30, y: y + 6, class: 'pol' }, g).textContent = '+'; el('path', { d: `M${x + a * 6} ${y - 7} l${-a * 12} 7 l${a * 12} 7z`, fill: '#fff', opacity: .8 }, g); }
    if (c === 'sw') { el('rect', { x: x - 34, y: y - 12, width: 68, height: 24, rx: 4, fill: '#3a3f44' }, g); el('rect', { x: swOn ? x + 2 : x - 22, y: y - 9, width: 20, height: 18, rx: 3, fill: '#e3e7ea' }, g); }
  }
  let lastLit = new Set();
  function draw() {
    gFp.innerHTML = ''; gPads.innerHTML = ''; gTr.innerHTML = '';
    traces.forEach(([a, b]) => { const [x1, y1] = padXY(a), [x2, y2] = padXY(b); el('line', { x1, y1, x2, y2, class: 'trace' + (lastLit.size ? ' live' : '') }, gTr); });
    if (L.pre && !traces.some(t => t.includes('1a'))) { const [x1, y1] = padXY('1a'), [x2, y2] = padXY('0b'); el('line', { x1, y1, x2: (x1 + x2) / 2 + 20, y2, class: 'trace broken' }, gTr); el('line', { x1: (x1 + x2) / 2 - 20, y1, x2, y2, class: 'trace broken' }, gTr); el('path', { d: `M${(x1 + x2) / 2 - 8} ${y1 - 12} l8 10 l-6 4 l8 10`, class: 'crack' }, gTr); }
    FP.forEach((_, i) => drawComp(i, lastLit));
    FP.forEach((_, i) => ['a', 'b'].forEach(s => { const id = i + s, [x, y] = padXY(id); el('circle', { cx: x, cy: y, r: 12, class: 'pad' + (firstPad === id ? ' sel' : ''), 'data-pad': id, tabindex: 0, role: 'button', 'aria-label': `pastille ${s === 'a' ? 'gauche' : 'droite'} de l'emplacement ${i + 1}` }, gPads); el('circle', { cx: x, cy: y, r: 4, fill: '#1d1b18', 'pointer-events': 'none' }, gPads); }));
    $('pcb-parts').querySelectorAll('.part').forEach(b => b.classList.toggle('used', tray[+b.dataset.k].used));
    game.dataset.placed = comp.filter(Boolean).length; game.classList.toggle('lit', lastLit.size > 0);
  }
  const fpAt = (cx, cy) => { const pt = pcb.createSVGPoint(); pt.x = cx; pt.y = cy; const p = pt.matrixTransform(pcb.getScreenCTM().inverse()); return FP.findIndex(([x, y]) => Math.abs(p.x - x) < 75 && Math.abs(p.y - y) < 45); };
  function place(k, i) {
    if (i < 0) return; const fpG = gFp.querySelector(`[data-fp="${i}"]`);
    if (comp[i]) { psay('Cet emplacement est déjà pris.', 'no'); TS.bad(); TS.flash(fpG, 'bad'); return; }
    const c = tray[k].c; comp[i] = c; tray[k].used = true; TS.click(); TS.good(); draw(); TS.bubble(gFp.querySelector(`[data-fp="${i}"]`), PLACED[c], 'good');
    const left = comp.filter(x => !x).length; psay(left ? `${NAMES[c].replace(/^./, m => m.toUpperCase())} est posée. Encore ${left}.` : 'Toutes les pièces sont posées. Tracez les pistes : touchez une pastille, puis une autre.');
  }
  const cross = (p1, p2, p3, p4) => { const d = (a, b, c) => (c[0] - a[0]) * (b[1] - a[1]) - (c[1] - a[1]) * (b[0] - a[0]); const d1 = d(p3, p4, p1), d2 = d(p3, p4, p2), d3 = d(p1, p2, p3), d4 = d(p1, p2, p4); return ((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) && ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0)); };
  function addTrace(a, b) {
    if (a === b) return; if (traces.some(([x, y]) => (x === a && y === b) || (x === b && y === a))) return;
    const A = padXY(a), B = padXY(b);
    if (traces.some(([x, y]) => ![x, y].includes(a) && ![x, y].includes(b) && cross(A, B, padXY(x), padXY(y)))) { TS.bad(); TS.flash(pcb, 'bad'); psay('Impossible : cette piste croiserait une autre piste. Sur une seule face, deux pistes qui se croisent se touchent.', 'no'); return; }
    traces.push([a, b]); TS.tone(1200, .06, .05, 'square'); evaluate(false);
  }
  pcb.addEventListener('click', e => {
    const pad = e.target.closest('[data-pad]');
    if (selected !== null) { const i = fpAt(e.clientX, e.clientY); if (i >= 0) { const k = selected; selected = null; $('pcb-parts').querySelectorAll('.part').forEach(x => x.classList.remove('sel')); place(k, i); } return; }
    if (pad) { if (comp.some(c => !c)) { TS.bad(); psay('Posez d\'abord toutes les pièces.', 'no'); return; }
      const id = pad.dataset.pad; if (!firstPad) { firstPad = id; draw(); TS.blip(2); TS.bubble(pad, 'Pastille choisie. Touchez maintenant la pastille où la piste doit aller. La piste de cuivre remplace un fil.'); } else { const a = firstPad; firstPad = null; addTrace(a, id); draw(); } return; }
    const fpG = e.target.closest('[data-fp]'); if (fpG) { const i = +fpG.dataset.fp; if (comp[i] === 'led') { flip[i] = !flip[i]; TS.click(); evaluate(false); draw(); TS.bubble(gFp.querySelector(`[data-fp="${i}"]`), 'LED retournée. Le petit triangle montre le sens du courant : du + vers le −.'); } }
  });
  pcb.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.dataset && e.target.dataset.pad) { e.preventDefault(); e.target.dispatchEvent(new MouseEvent('click', { bubbles: true })); } });
  /* analyse électrique simplifiée : chemins du + au − à travers les pièces */
  function analyze() {
    const parent = {}; const f = x => (parent[x] === undefined || parent[x] === x) ? (parent[x] = x) : (parent[x] = f(parent[x]));
    FP.forEach((_, i) => { f(i + 'a'); f(i + 'b'); }); traces.forEach(([a, b]) => { parent[f(a)] = f(b); });
    const pi = comp.indexOf('pile'); if (pi < 0) return { lit: [], issue: 'none' };
    const plus = f(pi + 'a'), minus = f(pi + 'b'); if (plus === minus) return { lit: [], issue: 'court' };
    const edges = []; comp.forEach((c, i) => { if (!c || i === pi) return; edges.push({ i, c, a: f(i + 'a'), b: f(i + 'b') }); });
    const lit = new Set(), burnt = new Set(), backwards = new Set(); let short = false, openSw = false, any = false;
    const dfs = (net, used, path) => {
      if (net === minus) { any = true; const leds = path.filter(e => e.c === 'led'), hasR = path.some(e => e.c === 'res'), hasOpen = path.some(e => e.c === 'sw' && !swOn);
        if (hasOpen) { openSw = true; return; } if (!leds.length && !hasR) { short = true; return; } leds.forEach(e => (hasR ? lit : burnt).add(e.i)); return; }
      edges.forEach(e => { if (used.has(e.i)) return; let next = null, fwd = true;
        if (e.a === net) next = e.b; else if (e.b === net) { next = e.a; fwd = false; } if (next === null) return;
        if (e.c === 'led') { const anodeA = !flip[e.i]; if ((fwd && !anodeA) || (!fwd && anodeA)) { backwards.add(e.i); return; } }
        used.add(e.i); path.push(e); dfs(next, used, path); path.pop(); used.delete(e.i); }); };
    dfs(plus, new Set(), []);
    const loose = FP.some((_, i) => comp[i] && [i + 'a', i + 'b'].every(p => !traces.some(t => t.includes(p))));
    return { lit: [...lit], burnt: [...burnt], backwards: [...backwards], short, openSw, any, loose };
  }
  function evaluate(loud) {
    if (comp.some(c => !c)) { lastLit = new Set(); return; }
    const r = analyze(); const prev = lastLit.size; lastLit = new Set(r.lit); draw();
    if (r.issue === 'court' || r.short) { psay('Court-circuit! Le + et le − de la pile sont reliés presque directement : le courant ne traverse rien, la pile chauffe. Effacez les pistes.', 'no'); TS.bad(); TS.flash(pcb, 'bad'); return; }
    if (L.goal(r)) { if (game.dataset.state !== 'win') { game.dataset.state = 'win'; TS.win(); TS.confetti(pcb); PL.done(PL.cur);
        const t = ['Première boucle! Le courant sort du +, traverse la résistance et la LED, revient au −. Pas de boucle, pas de courant.', 'Avec l\'interrupteur, vous décidez : 1 ou 0. C\'est exactement ce qu\'un transistor fera sur une puce.', 'Deux chemins côte à côte : chaque LED reçoit sa part. Sur une carte mère, des milliers de pièces sont nourries ainsi en parallèle.', 'Carte réparée! Réparer, c\'est lire la chaîne : où le courant s\'arrête-t-il? C\'est ce que font les techniciens.'][PL.cur];
        psay(t, 'ok'); if (PL.cur === 1) window.Path.learn('inter', 'Sur un circuit imprimé, l\'interrupteur ouvre ou ferme la boucle : 0 ou 1. La puce fait pareil, avec des transistors à la place du doigt.'); if (PL.cur < 3) setTimeout(() => { if (PL.cur === +game.dataset.lvl && game.dataset.state === 'win') PL.go(PL.cur + 1); }, 3000); }
      return; }
    game.dataset.state = '';
    let m = null;
    if (r.burnt && r.burnt.length) m = 'Une LED est reliée sans résistance : elle grillerait! Faites passer son chemin par la résistance.';
    else if (r.backwards && r.backwards.length && !r.lit.length) m = 'Une LED est à l\'envers. C\'est une <b>diode</b> : un sens unique pour le courant. Touchez-la pour la retourner.';
    else if (r.openSw) m = 'Le chemin est prêt : fermez l\'interrupteur!';
    else if (r.lit.length && L.goal.length && PL.cur === 2) m = 'Une LED s\'allume. Il en faut deux : donnez un deuxième chemin à l\'autre LED.';
    else if (traces.length) m = 'Le chemin est coupé quelque part : une pastille n\'est reliée à rien. Le courant a besoin d\'une boucle fermée, du + jusqu\'au −.';
    if (m) { psay(m, r.openSw ? '' : 'no'); if (loud) { TS.bad(); TS.flash(pcb, 'bad'); } }
  }
  $('pcb-sw').addEventListener('click', () => { if (!comp.includes('sw')) { psay('Posez d\'abord l\'interrupteur.', 'no'); TS.bad(); return; } swOn = !swOn; $('pcb-sw').textContent = swOn ? '⏻ Ouvrir l\'interrupteur' : '⏻ Fermer l\'interrupteur'; TS.click(); evaluate(swOn); if (!swOn) { psay('Interrupteur ouvert : le chemin est coupé, la lumière s\'éteint. 0.'); } });
  $('pcb-undo').addEventListener('click', () => { traces = L.pre ? L.pre.traces.map(x => x.slice()) : []; firstPad = null; game.dataset.state = ''; lastLit = new Set(); draw(); psay('Pistes remises à zéro.'); });
  $('pcb-reset').addEventListener('click', () => pcbLevel(PL.cur));
  pcbLevel(0);

  /* ================= JEU 8 : PORTES LOGIQUES (niveaux) ================= */
  const GF = { ET: (a, b) => a & b, OU: (a, b) => a | b, XOR: (a, b) => a ^ b, NON: a => 1 - a }, GL = { ET: 'ET', OU: 'OU', XOR: 'OU-exclusif', NON: 'NON' };
  const GEXPL = { ET: 'Porte <b>ET</b> : deux transistors à la suite. Sortie 1 seulement si A <b>et</b> B valent 1.', OU: 'Porte <b>OU</b> : deux transistors côte à côte. Sortie 1 si A <b>ou</b> B (ou les deux).', NON: 'Porte <b>NON</b> : elle inverse. 1 devient 0, 0 devient 1.', XOR: 'Porte <b>OU-exclusif</b> : 1 si un seul des deux vaut 1. Vous l\'avez construite au niveau 4.' };
  const GLV = [
    { t: 'ET', ins: ['A', 'B'], fixed: 'ET', task: '<b>Niveau 1 · La porte ET.</b> Allumez la sortie. Indice : c\'est le montage « à la suite ».', explore: 'ET' },
    { t: 'OU', ins: ['A', 'B'], fixed: 'OU', task: '<b>Niveau 2 · La porte OU.</b> Trouvez les <b>3</b> façons d\'allumer la sortie.', explore: 'OU' },
    { t: 'NON', ins: ['A'], fixed: 'NON', task: '<b>Niveau 3 · La porte NON.</b> Sa sortie est allumée quand A est éteint. Éteignez-la.', explore: 'NON' },
    { t: 'OU-exclusif', ins: ['A', 'B'], tray: ['ET', 'OU', 'NON'], slots: [['s1', 'porte 1 (reçoit A et B)', 2], ['s2', 'porte 2 (reçoit A et B)', 2], ['s3', 'porte 3 (reçoit la porte 2)', 1]], task: '<b>Niveau 4 · Construisez un OU-exclusif.</b> But : 1 si A ou B, <b>mais pas les deux</b>. La dernière porte (ET, fixe) reçoit la porte 1 et la porte 3. Remplissez les cases, puis testez.',
      calc: (v, s) => GF.ET(GF[s.s1](v.A, v.B), GF.NON(GF[s.s2](v.A, v.B))), target: v => v.A ^ v.B, outs: ['Sortie'] },
    { t: '1 + 1', ins: ['A', 'B'], tray: ['ET', 'OU', 'XOR'], slots: [['carry', 'Retenue (chiffre des « deux »)', 2], ['sum', 'Somme (chiffre des « un »)', 2]], task: '<b>Niveau 5 · Additionnez deux bits.</b> En binaire, on ne compte qu\'avec 0 et 1. Donc 1 + 1 s\'écrit <b>10</b> (un « deux », zéro « un »). Choisissez la porte de chaque chiffre.',
      calc: (v, s) => [GF[s.carry](v.A, v.B), GF[s.sum](v.A, v.B)], target: v => [Math.floor((v.A + v.B) / 2), (v.A + v.B) % 2], outs: ['Retenue', 'Somme'], add: true },
    { t: '1 + 1 + 1', ins: ['A', 'B', 'R'], tray: ['ET', 'OU', 'XOR'], slots: [['cout', 'Retenue finale (reçoit les 2 retenues)', 2]], task: '<b>Niveau 6 · L\'additionneur complet.</b> Pour additionner de grands nombres, chaque colonne reçoit aussi la <b>retenue</b> (R) de la colonne d\'à côté. Deux demi-additionneurs (niveau 5) sont déjà branchés. Il ne reste qu\'une porte : celle qui combine leurs deux retenues.',
      calc: (v, s) => { const s1 = v.A ^ v.B, c1 = v.A & v.B, S = s1 ^ v.R, c2 = s1 & v.R; return [GF[s.cout](c1, c2), S]; }, target: v => { const t = v.A + v.B + v.R; return [Math.floor(t / 2), t % 2]; }, outs: ['Retenue', 'Somme'], add: true }
  ];
  let G, vals, slots, gSel, seen;
  const GLVL = TS.levels($('g-lv'), GLV.map(l => l.t), i => gLevel(i));
  const gmsg = $('g-msg'), gsay = (t, c = '') => { gmsg.innerHTML = t; gmsg.className = 'msg ' + c; };
  function gLevel(i) {
    G = GLV[i]; vals = Object.fromEntries(G.ins.map(k => [k, 0])); slots = {}; gSel = null; seen = new Set(); $('gates').dataset.state = ''; $('g-task').innerHTML = G.task; gsay(''); $('truth').innerHTML = '';
    $('g-inputs').innerHTML = G.ins.map(k => `<button class="bit" data-in="${k}" aria-pressed="false">${k} = <b>0</b></button>`).join('');
    $('g-inputs').querySelectorAll('[data-in]').forEach(b => b.addEventListener('click', () => { vals[b.dataset.in] ^= 1; TS.click(); gDraw(true, b); }));
    $('gtray').innerHTML = (G.tray || []).map(g => `<button class="gate" data-g="${g}">${GL[g]}</button>`).join('');
    $('gtray').querySelectorAll('.gate').forEach(b => TS.pickable(b, { onDrop: (x, y) => putGate(b.dataset.g, slotAt(x, y)), onSelect: () => { $('gtray').querySelectorAll('.gate').forEach(x => x.classList.remove('sel')); gSel = gSel === b.dataset.g ? null : b.dataset.g; if (gSel) { b.classList.add('sel'); TS.bubble(b, GEXPL[b.dataset.g] + ' Touchez maintenant une case.'); } } }));
    $('g-ctrl').innerHTML = G.slots ? '<button class="btn" id="g-test">✔ Tester tous les cas</button>' : '';
    if (G.slots) $('g-test').addEventListener('click', testAll);
    gDraw(false);
  }
  const slotAt = (x, y) => { const s = [...document.querySelectorAll('#g-diag .gslot')].find(s => { const r = s.getBoundingClientRect(); return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom; }); return s ? s.dataset.slot : null; };
  function putGate(g, slot) {
    if (!slot) return; const def = G.slots.find(s => s[0] === slot), sEl = document.querySelector(`#g-diag [data-slot="${slot}"]`);
    if ((g === 'NON') !== (def[2] === 1)) { TS.bad(); TS.flash(sEl, 'bad'); TS.bubble(sEl, def[2] === 1 ? 'Cette case ne reçoit qu\'une seule entrée : seule une porte NON y entre.' : 'La porte NON n\'a qu\'une entrée. Cette case en reçoit deux (A et B).', 'bad'); return; }
    slots[slot] = g; TS.click(); TS.good(); gSel = null; $('gtray').querySelectorAll('.gate').forEach(x => x.classList.remove('sel')); gDraw(false); TS.flash(document.querySelector(`#g-diag [data-slot="${slot}"]`), 'good');
  }
  const bin = a => a.join('');
  function gDraw(acted, btn) {
    $('g-inputs').querySelectorAll('[data-in]').forEach(b => { const v = vals[b.dataset.in]; b.innerHTML = `${b.dataset.in} = <b>${v}</b>`; b.setAttribute('aria-pressed', !!v); });
    const d = $('g-diag');
    if (G.fixed) {
      const out = G.fixed === 'NON' ? GF.NON(vals.A) : GF[G.fixed](vals.A, vals.B);
      d.innerHTML = `<div class="gbox big">${GL[G.fixed]}</div><i class="led-out ${out ? 'on' : ''}" id="g-out"></i><span class="gout-l">sortie = ${out}</span>`;
      $('g-res').innerHTML = G.fixed === 'NON' ? `NON ${vals.A} = <b>${out}</b>` : `${vals.A} ${GL[G.fixed]} ${vals.B} = <b>${out}</b>`;
      if (acted) {
        if (G.fixed === 'ET') { TS.bubble(btn, out ? 'Les deux transistors sont passants : le courant traverse les deux. Sortie <b>1</b>.' : (vals.A || vals.B) ? 'Un seul transistor passant : le courant est bloqué par l\'autre. Sortie <b>0</b>.' : 'Aucun transistor passant. Sortie 0.', out ? 'good' : ''); if (out) gWin('Sortie allumée : il fallait A <b>et</b> B. Une porte ET répond à « les deux? ».'); }
        if (G.fixed === 'OU') { if (out) { const k = '' + vals.A + vals.B; if (!seen.has(k)) { seen.add(k); TS.good(); TS.bubble(btn, `${seen.size}/3 : ${vals.A} OU ${vals.B} = 1. ${seen.size < 3 ? 'Encore ' + (3 - seen.size) + '.' : ''}`, 'good'); } } else TS.bubble(btn, 'Aucun chemin possible : sortie 0.'); if (seen.size === 3) gWin('Trois façons : A seul, B seul, ou les deux. Une porte OU répond à « au moins un? ».'); }
        if (G.fixed === 'NON') { TS.bubble(btn, out ? 'A = 0 : le transistor est bloqué, le courant va à la lampe. Sortie 1.' : 'A = 1 : le transistor devient passant et <b>détourne</b> le courant loin de la lampe. Sortie 0. Il inverse!', out ? '' : 'good'); if (!out) gWin('NON inverse : 1 devient 0. Avec ET, OU et NON, on peut fabriquer toutes les autres portes.'); }
      }
      return;
    }
    d.innerHTML = G.slots.map(([k, lbl]) => `<div class="gslot ${slots[k] ? 'filled' : ''}" data-slot="${k}"><small>${lbl}</small><span class="g-in">${slots[k] ? GL[slots[k]] : '?'}</span></div>`).join(G.t === 'OU-exclusif' ? '' : '') + (G.t === 'OU-exclusif' ? '<div class="gbox">ET (fixe) ← porte 1 et porte 3</div>' : G.t === '1 + 1 + 1' ? '<div class="gbox">2 demi-additionneurs (déjà branchés)</div>' : '');
    d.querySelectorAll('.gslot').forEach(s => s.addEventListener('click', () => { if (gSel) putGate(gSel, s.dataset.slot); else TS.bubble(s, 'Choisissez d\'abord une porte en bas, puis touchez cette case.'); }));
    const full = G.slots.every(s => slots[s[0]]);
    if (!full) { $('g-res').innerHTML = 'Remplissez les cases pour voir le résultat.'; return; }
    const out = [].concat(G.calc(vals, slots)), sum = G.ins.map(k => vals[k]).join(' + ');
    $('g-res').innerHTML = G.add ? `${sum} = <b>${bin(out)}</b> en binaire = <b>${out[0] * 2 + out[1]}</b>` : `sortie = <b>${out[0]}</b>`;
    if (acted && G.add && G.ins.every(k => vals[k])) TS.bubble(btn, G.ins.length === 3 ? '1 + 1 + 1 = 3, qui s\'écrit <b>11</b> : un « deux » et un « un ».' : '1 + 1 = 2, qui s\'écrit <b>10</b> : un « deux », zéro « un ». Comme 9 + 1 = 10 avec une retenue!');
  }
  function gWin(t) { if ($('gates').dataset.state === 'win') return; $('gates').dataset.state = 'win'; TS.win(); TS.confetti($('gates')); GLVL.done(GLVL.cur); gsay(t, 'ok'); window.Path.learn('porte', GLVL.cur === 0 ? 'Une porte ET, c\'est deux transistors à la suite : elle répond 1 seulement si les deux entrées valent 1.' : undefined); const c = GLVL.cur; if (c < 5) setTimeout(() => { if (GLVL.cur === c) GLVL.go(c + 1); }, 2800); }
  async function testAll() {
    if (!G.slots.every(s => slots[s[0]])) { TS.bad(); TS.flash($('g-diag'), 'bad'); gsay('Remplissez toutes les cases.', 'no'); return; }
    const n = G.ins.length, tab = $('truth'); tab.innerHTML = `<tr>${G.ins.map(k => `<th>${k}</th>`).join('')}${G.outs.map(o => `<th>${o}</th>`).join('')}<th></th></tr>`; let ok = true, bad = null;
    for (let m = 0; m < (1 << n); m++) { G.ins.forEach((k, j) => vals[k] = (m >> (n - 1 - j)) & 1); gDraw(false);
      const out = [].concat(G.calc(vals, slots)), want = [].concat(G.target(vals)), good = bin(out) === bin(want); if (!good) { ok = false; if (!bad) bad = { ...vals }; }
      tab.insertAdjacentHTML('beforeend', `<tr class="${good ? 'good' : 'bad'}">${G.ins.map(k => `<td>${vals[k]}</td>`).join('')}${out.map(x => `<td>${x}</td>`).join('')}<td>${G.add ? bin(out) + ' = ' + (out[0] * 2 + out[1]) : ''} ${good ? '✔' : '✘ attendu ' + bin(want)}</td></tr>`); TS.blip(m % 6); await wait(n === 3 ? 220 : 330); }
    if (ok) { const c = GLVL.cur;
      const t = c === 3 ? 'Vous avez construit un OU-exclusif avec ET, OU et NON : « au moins un » ET « pas les deux ».' : c === 4 ? 'Bravo! Retenue = ET, Somme = OU-exclusif. C\'est un <b>demi-additionneur</b> : 1 + 1 = 10.' : `Additionneur complet! 1 + 1 + 1 = 11 (trois). ${slots.cout === 'XOR' ? 'OU-exclusif marche aussi ici, car les deux retenues ne valent jamais 1 en même temps.' : 'Mettez-en 64 en chaîne, la retenue passant de l\'un à l\'autre : c\'est le principe de l\'addition dans votre cellulaire (qui utilise une version plus rapide du même montage).'}`;
      if (c >= 4) window.Path.learn('add', c === 5 ? 'Un additionneur complet additionne 3 bits (A, B et la retenue). En chaîne, ils additionnent n\'importe quels nombres.' : undefined);
      $('gates').dataset.state = ''; gWin(t); }
    else { TS.bad(); TS.flash($('truth'), 'bad'); const c = GLVL.cur;
      gsay(c === 3 ? 'Regardez la ligne rouge. Idée : « au moins un » (OU) et « pas les deux » (NON de ET).' : c === 4 ? (slots.sum === 'OU' ? 'Avec OU, 1 + 1 donne 11 (trois). La somme doit s\'éteindre quand les deux valent 1.' : 'La retenue ne doit s\'allumer que si A et B valent 1 tous les deux.') : 'La retenue finale doit s\'allumer si l\'une des deux retenues vaut 1.', 'no'); }
  }
  gLevel(0);

  /* =============== PHOTOLITHOGRAPHIE =============== */
  const dies = $('dies'); let lithoBusy = false;
  $('litho-go').addEventListener('click', async () => {
    if (lithoBusy) return; lithoBusy = true; dies.innerHTML = ''; const s = $('litho-svg'); s.classList.add('flash'); TS.tone(300, .6, .06, 'sawtooth');
    const cells = []; for (let y = -32; y <= 24; y += 9) for (let x = -32; x <= 24; x += 9) if (Math.hypot(x + 4, y + 4) < 36) cells.push([x, y]);
    for (let k = 0; k < cells.length; k++) { const [x, y] = cells[k]; el('rect', { x: 160 + x, y: 160 + y, width: 8, height: 8, class: 'die' }, dies); if (k % 6 === 0) { TS.blip(k % 5); await TS.anim(40, () => {}); } }
    s.classList.remove('flash'); lithoBusy = false; s.dataset.state = 'done'; TS.good(); TS.bubble($('litho-go'), 'Un seul masque, des dizaines de puces identiques d\'un coup. Comme une page de Gutenberg.', 'good');
  });

  /* =============== ZOOM =============== */
  const zs = $('zoom-svg'), zc = $('zoom-cap');
  const CAPS = [
    '<b>Votre demi-additionneur</b> : 2 portes (ET et OU-exclusif), une vingtaine de transistors au plus.',
    '<b>Un additionneur 8 bits</b> : 8 blocs comme le vôtre, un peu plus complets, en chaîne. La retenue passe de l\'un à l\'autre. Il additionne des nombres jusqu\'à 255.',
    '<b>Un cœur de processeur</b> : des millions de portes. Additionner, comparer, mémoriser, décider quoi faire ensuite.',
    '<b>Une puce de cellulaire</b> : plusieurs cœurs (CPU), une partie pour les images (GPU), de la mémoire. Jusqu\'à une vingtaine de milliards de transistors (environ 20 milliards dans l\'Apple A18 Pro de 2024), sur environ un centimètre carré, plus petit qu\'un ongle. Chacun est des milliers de fois plus fin qu\'un cheveu.',
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
    zc.innerHTML = CAPS[n]; TS.blip(n); if (n >= 3) window.Path.learn('puce');
  }
  $('zoom-r').addEventListener('input', e => zoom(+e.target.value)); zoom(0);
})();

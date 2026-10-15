/* Chapitre 2 : modèles de communication, téléphone arabe, morse → bits */
(() => {
  const $ = id => document.getElementById(id), TS = window.TS;
  const ERAS = [
    ['✋', 'Geste et imitation', 'il y a plus de 2 millions d\'années', 'Le forgeron', 'un geste, sous les yeux', 'l\'apprenti, à côté', 'il regarde mal, il oublie', 'l\'apprenti refait, le maître corrige', 1, 1, 3, 'Le premier canal : les yeux. Portée : quelques mètres.'],
    ['🗣️', 'Parole et récit oral', 'date inconnue, très ancienne', 'Une conteuse', 'des mots, par l\'air', 'le village', 'on déforme, on oublie des bouts', 'on pose des questions tout de suite', 2, 2, 2, 'Chaque personne qui répète change un peu l\'histoire. Essayez le jeu du téléphone arabe plus bas.'],
    ['🖐️', 'Dessins sur les parois', 'plus de 40 000 ans', 'Un chasseur', 'une image, sur la roche', 'ceux qui viendront après', 'la roche s\'efface, le sens se perd', 'aucune : l\'auteur est parti', 2, 1, 3, 'Pour la première fois, le message survit à celui qui l\'a fait.'],
    ['🔺', 'Écriture cunéiforme', 'vers 3200 av. J.-C., Mésopotamie', 'Un scribe', 'des signes, sur l\'argile', 'un marchand, plus tard', 'les fautes de copie', 'une réponse, des semaines après', 3, 1, 4, 'On note des quantités de grain, puis des lois, puis des histoires. Le message devient fidèle.'],
    ['🔤', 'L\'alphabet', 'vers 1800 av. J.-C., puis les Phéniciens', 'N\'importe qui', 'une vingtaine de lettres', 'beaucoup plus de lecteurs', 'les mauvaises lectures', 'des lettres échangées', 3, 1, 4, 'Quelques dizaines de signes au lieu de centaines : bien plus de gens peuvent apprendre à lire.'],
    ['📜', 'L\'imprimerie', 'Gutenberg, vers 1450', 'L\'imprimeur', 'une forme en métal, encrée', 'des milliers de lecteurs', 'presque aucun : chaque copie est identique', 'des livres qui répondent à d\'autres livres', 4, 2, 5, 'Une forme, des milliers de pages identiques. Retenez cette idée : les puces sont aussi imprimées.'],
    ['✉️', 'La poste', 'relais anciens ; timbre en 1840', 'Vous', 'une lettre, de main en main', 'une personne, au loin', 'la perte, le retard', 'la réponse, des jours ou des semaines après', 4, 2, 5, 'Le message voyage tout seul, porté par une chaîne de facteurs.'],
    ['⚡', 'Télégraphe et morse', 'années 1830–1840', 'Un télégraphiste', 'des impulsions électriques : court, long', 'une autre ville, presque aussitôt', 'les parasites sur la ligne', 'un accusé de réception', 4, 5, 3, 'Le message n\'est plus qu\'allumé ou éteint, court ou long. C\'est déjà l\'ancêtre des bits.'],
    ['☎️', 'Le téléphone', '1876', 'Votre voix', 'un courant qui imite la voix', 'une personne, en direct', 'le grésillement', 'immédiate : on se répond', 4, 5, 3, 'La voix elle-même voyage dans le fil.'],
    ['📻', 'La radio', 'vers 1895–1901', 'Un studio', 'une onde, dans l\'air', 'des millions d\'auditeurs', 'les interférences', 'presque aucune : on écoute', 5, 5, 3, 'Un seul émetteur, des millions de récepteurs, sans fil.'],
    ['📺', 'La télévision', 'années 1920, partout dans les années 1950', 'Une chaîne', 'des images et du son, par onde', 'des foyers entiers', 'la neige à l\'écran', 'presque aucune', 5, 5, 3, 'L\'image arrive dans la maison.'],
    ['🌐', 'Internet', '1969 (ARPANET), Web en 1991', 'Votre ordinateur', 'des paquets de bits, par câbles', 'n\'importe qui, n\'importe où', 'les paquets perdus… renvoyés', 'immédiate, dans les deux sens', 5, 5, 5, 'Le message est coupé en petits paquets. S\'il en manque un, on le redemande : retransmettre, littéralement.'],
    ['📱', 'Cellulaire et réseaux sociaux', '1973, téléphone intelligent en 2007', 'Tout le monde', 'texte, photo, vidéo, par onde puis câble', 'des millions, en partage', 'les rumeurs qui se répètent', 'les réponses et partages, en secondes', 5, 5, 4, 'Chacun est à la fois émetteur, récepteur, et retransmetteur.'],
    ['🤖', 'L\'intelligence artificielle', 'années 2020', 'Vous, et la machine', 'des questions, des réponses, des traductions', 'vous, à la seconde', 'les erreurs dites avec assurance', 'la conversation elle-même', 5, 5, 3, 'La machine reçoit ce que l\'humanité a écrit, et le retransmet. À vérifier, comme toute source.']
  ];
  const ol = $('eras');
  ERAS.forEach((e, i) => { const li = document.createElement('li'); li.innerHTML = `<button data-i="${i}"><span class="ico">${e[0]}</span><b>${e[1]}</b><small>${e[2]}</small></button>`; ol.appendChild(li); });
  function show(i) {
    const e = ERAS[i]; $('m-em').textContent = e[3]; $('m-ca').textContent = e[4]; $('m-re').textContent = e[5]; $('m-no').textContent = e[6]; $('m-fb').textContent = e[7];
    $('bar-p').style.width = e[8] * 20 + '%'; $('bar-v').style.width = e[9] * 20 + '%'; $('bar-f').style.width = e[10] * 20 + '%';
    $('era-note').innerHTML = `<b>${e[0]} ${e[1]}</b> · ${e[2]} — ${e[11]}`;
    ol.querySelectorAll('button').forEach(b => b.classList.toggle('on', +b.dataset.i === i)); $('model').dataset.era = i;
  }
  ol.addEventListener('click', ev => { const b = ev.target.closest('button'); if (b) { show(+b.dataset.i); TS.blip(+b.dataset.i % 6); } });
  show(0);

  /* ----- téléphone arabe ----- */
  const ORAL = ['Le forgeron montre la roue à son apprenti', 'Le forgeron montre la roue à son apprenti', 'Le forgeron montre sa roue à son apprenti', 'Le forgeron monte sa roue à son parent', 'Le forgeron monte sur sa roue à son parent', 'Le pigeon monte sur sa roue à sa parente', 'Le pigeon monte sur la route avec sa parente'];
  const orig = ORAL[0].split(' ');
  const fid = s => { const w = s.split(' '); let ok = 0; orig.forEach((x, i) => { if (w[i] === x) ok++; }); return Math.round(ok / orig.length * 100); };
  let telBusy = false;
  document.querySelectorAll('#tel [data-mode]').forEach(btn => btn.addEventListener('click', async () => {
    if (telBusy) return; telBusy = true; const oral = btn.dataset.mode === 'oral', chain = $('tel-chain'); chain.innerHTML = ''; $('tel-msg').textContent = '';
    for (let i = 1; i <= 6; i++) {
      const s = oral ? ORAL[i] : ORAL[0], li = document.createElement('li');
      li.innerHTML = `<span class="who">${oral ? '🗣️' : '✍️'} ${i}</span><span class="say">${s.split(' ').map((w, k) => w === orig[k] ? w : `<mark>${w}</mark>`).join(' ')}</span><span class="pct">${fid(s)} %</span>`;
      chain.appendChild(li); TS.blip(i); await TS.anim(450, () => {});
    }
    $('tel-msg').className = 'msg ' + (oral ? 'no' : 'ok');
    $('tel-msg').textContent = oral ? 'Le pigeon monte sur la route… Chaque bouche a changé un petit bout. Le bruit s\'accumule à chaque retransmission.' : 'Identique à l\'arrivée : l\'écrit garde le message, et on peut toujours comparer à l\'original. Les bits font pareil, avec des codes qui détectent les erreurs.';
    $('tel').dataset.state = oral ? 'oral' : 'ecrit'; telBusy = false;
  }));

  /* ----- télégraphe : 4 niveaux ----- */
  const MORSE = { '.-': 'A', '-...': 'B', '-.-.': 'C', '-..': 'D', '.': 'E', '..-.': 'F', '--.': 'G', '....': 'H', '..': 'I', '.---': 'J', '-.-': 'K', '.-..': 'L', '--': 'M', '-.': 'N', '---': 'O', '.--.': 'P', '--.-': 'Q', '.-.': 'R', '...': 'S', '-': 'T', '..-': 'U', '...-': 'V', '.--': 'W', '-..-': 'X', '-.--': 'Y', '--..': 'Z' };
  const CODE = Object.fromEntries(Object.entries(MORSE).map(([k, v]) => [v, k]));
  const pretty = c => c.replace(/\./g, '·').replace(/-/g, '—');
  const mg = $('morse'), mmsg = $('m-msg'), task = $('m-task');
  const msay = (t, c = '') => { mmsg.innerHTML = t; mmsg.className = 'msg ' + c; };
  const TASKS = [
    '<b>Niveau 1 · Monter la ligne.</b> Avant d\'envoyer, il faut un <b>émetteur</b> (celui qui envoie), un <b>canal</b> (le chemin) et un <b>récepteur</b> (celui qui reçoit). Placez les bonnes pièces.',
    '<b>Niveau 2 · Envoyer « SOS ».</b> Touche courte = point (·), touche longue = trait (—). S = ···   O = ———. Faites une pause entre les lettres.',
    '<b>Niveau 3 · Envoyer « OUI ».</b> O = ———   U = ··—   I = ··. Plus de lettres, même bouton.',
    '<b>Niveau 4 · Vous êtes le récepteur.</b> Un message arrive par la ligne, avec des grésillements (le <b>bruit</b>). Les grésillements sont très courts et gris : ignorez-les. Écrivez le mot reçu.'
  ];
  const TARGET = [null, 'SOS', 'OUI', null];
  let lvl = 0, line = { em: null, ca: null, re: null }, mSel = null;
  const LV = TS.levels($('m-lv'), ['Monter la ligne', 'SOS', 'OUI', 'Décoder'], i => setLevel(i));
  function setLevel(i) {
    lvl = i; task.innerHTML = TASKS[i]; mg.dataset.lvl = i; msay(''); $('m-bits').hidden = true; cur = ''; text = ''; render(); clearTimeout(timer);
    $('m-build').hidden = i !== 0; $('m-send').hidden = !(i === 1 || i === 2); $('m-rx').hidden = i !== 3;
    if (i === 0) { line = { em: null, ca: null, re: null }; drawLine(); }
  }
  /* niveau 1 : ligne */
  const PART = { cle: ['🔑 Clé morse', 'em'], fil: ['〰️ Fil de cuivre', 'ca'], ficelle: ['🧵 Ficelle', null], sonnerie: ['🔔 Sonnerie', 're'] };
  const WHY = { em: 'L\'<b>émetteur</b> transforme votre geste en signal : appuyer ferme le circuit, le courant part.', ca: 'Le <b>canal</b> transporte le signal. Le cuivre laisse passer le courant, sur des kilomètres.', re: 'Le <b>récepteur</b> transforme le signal en quelque chose qu\'on perçoit : ici, un son.' };
  function drawLine() { mg.querySelectorAll('.mslot').forEach(sl => { const p = line[sl.dataset.slot]; sl.querySelector('span').textContent = p ? PART[p][0] : '?'; sl.classList.toggle('filled', !!p); }); mg.querySelectorAll('.mpart').forEach(b => b.classList.toggle('used', Object.values(line).includes(b.dataset.p))); }
  function putPart(p, slotEl) {
    if (!slotEl) return; const slot = slotEl.dataset.slot;
    if (PART[p][1] === slot) { line[slot] = p; drawLine(); TS.good(); TS.flash(slotEl, 'good'); TS.bubble(slotEl, WHY[slot], 'good');
      if (line.em && line.ca && line.re) { msay('Ligne montée! Émetteur → canal → récepteur. Passez au niveau 2 pour envoyer un message.', 'ok'); LV.done(0); setTimeout(() => LV.go(1), 1600); } }
    else { TS.bad(); TS.flash(slotEl, 'bad'); TS.bubble(slotEl, p === 'ficelle' ? 'Une ficelle ne conduit pas l\'électricité : le signal n\'arriverait jamais. Il faut un <b>conducteur</b>, comme le cuivre.' : `Pas ici : la ${PART[p][0].slice(3)} n'est pas ${slot === 'em' ? 'celle qui envoie' : slot === 'ca' ? 'le chemin' : 'celle qui reçoit'}.`, 'bad'); }
  }
  const slotAt = (x, y) => [...mg.querySelectorAll('.mslot')].find(s => { const r = s.getBoundingClientRect(); return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom; });
  mg.querySelectorAll('.mpart').forEach(b => TS.pickable(b, { onDrop: (x, y) => putPart(b.dataset.p, slotAt(x, y)), onSelect: () => { mg.querySelectorAll('.mpart').forEach(x => x.classList.remove('sel')); mSel = mSel === b.dataset.p ? null : b.dataset.p; if (mSel) { b.classList.add('sel'); msay('Touchez maintenant la case où elle va.'); } } }));
  mg.querySelectorAll('.mslot').forEach(sl => sl.addEventListener('click', () => { if (mSel) { const p = mSel; mSel = null; mg.querySelectorAll('.mpart').forEach(x => x.classList.remove('sel')); putPart(p, sl); } }));
  /* niveaux 2–3 : envoyer */
  const key = $('m-key'); let t0 = 0, cur = '', text = '', timer = null, down = false, firstDot = true, firstDash = true;
  const render = () => { $('m-code').textContent = pretty(cur) || '\u00a0'; $('m-text').textContent = text || '…'; };
  function press() { if (down || !(lvl === 1 || lvl === 2)) return; down = true; t0 = performance.now(); clearTimeout(timer); key.classList.add('down'); TS.holdStart(); }
  function release() {
    if (!down) return; down = false; key.classList.remove('down'); TS.holdStop();
    const dot = (performance.now() - t0) < 230; cur += dot ? '.' : '-'; render();
    if (dot && firstDot) { firstDot = false; TS.bubble(key, 'Point : une impulsion courte. Le courant passe un instant, la sonnerie fait « bip ».'); }
    if (!dot && firstDash) { firstDash = false; TS.bubble(key, 'Trait : une impulsion longue, environ trois fois un point.'); }
    timer = setTimeout(letterDone, 900);
  }
  function letterDone() {
    const tgt = TARGET[lvl], want = tgt[text.length], got = MORSE[cur] || '?';
    if (got === want) { text += got; TS.good(); TS.flash($('m-text'), 'good'); TS.bubble($('m-code'), `${got} = ${pretty(cur)} ✔ La pause a dit « lettre suivante ».`, 'good'); }
    else { TS.bad(); TS.flash(key, 'bad'); TS.bubble($('m-code'), `Vous avez envoyé ${pretty(cur)} (${got === '?' ? 'aucune lettre' : got}). Pour ${want} : ${pretty(CODE[want])}. Réessayez cette lettre.`, 'bad'); }
    cur = ''; render();
    if (text === tgt) win();
  }
  function showBits(word) { const rows = $('bitrows'); rows.innerHTML = ''; word.split('').forEach(ch => { const b = ch.charCodeAt(0).toString(2).padStart(8, '0'); rows.insertAdjacentHTML('beforeend', `<div><b>${ch}</b>${b.split('').map(x => `<i class="bit-${x}">${x}</i>`).join('')}</div>`); }); $('m-bits').hidden = false; }
  function win() {
    TS.win(); TS.confetti(key); LV.done(lvl); mg.dataset.state = 'win' + lvl;
    if (lvl === 1) { msay('SOS reçu! Trois lettres avec un seul bouton : allumé ou éteint.', 'ok'); window.Path.learn('onoff'); showBits('SOS'); setTimeout(() => LV.go(2), 2600); }
    else { msay('OUI reçu! Regardez : chaque lettre devient 8 bits, des 1 et des 0. C\'est ce que stocke une puce.', 'ok'); showBits('OUI'); window.Path.learn('bit'); setTimeout(() => LV.go(3), 2600); }
  }
  key.addEventListener('pointerdown', e => { e.preventDefault(); key.setPointerCapture(e.pointerId); press(); });
  key.addEventListener('pointerup', release); key.addEventListener('pointercancel', release);
  key.addEventListener('keydown', e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); if (!e.repeat) press(); } });
  key.addEventListener('keyup', e => { if (e.key === ' ' || e.key === 'Enter') release(); });
  key.addEventListener('contextmenu', e => e.preventDefault());
  $('m-clear').addEventListener('click', () => { cur = ''; text = ''; clearTimeout(timer); render(); msay(''); });
  /* niveau 4 : recevoir avec du bruit */
  const RX = 'ALLO', lamp = $('rx-lamp'); let rxBusy = false;
  const wait = ms => new Promise(r => setTimeout(r, ms));
  async function play(noise, u) {
    if (rxBusy) return; rxBusy = true; $('rx-code').textContent = '\u00a0'; let shown = '', n = 0;
    for (const ch of RX) {
      for (const sym of CODE[ch]) {
        lamp.className = 'rx-lamp on'; TS.tone(650, (sym === '.' ? u : 3 * u) / 1000, .1, 'sine'); await wait(sym === '.' ? u : 3 * u); lamp.className = 'rx-lamp';
        shown += sym === '.' ? '·' : '—'; $('rx-code').textContent = shown;
        await wait(u);
        if (noise && (n++ % 3 === 1)) { lamp.className = 'rx-lamp noise'; TS.tone(140, .04, .08, 'sawtooth'); await wait(40); lamp.className = 'rx-lamp'; await wait(u / 2); }
      }
      shown += '   '; await wait(3 * u);
    }
    rxBusy = false;
  }
  $('rx-play').addEventListener('click', () => play(true, 160));
  $('rx-slow').addEventListener('click', () => { play(false, 320); TS.bubble($('rx-slow'), 'Moins de bruit, plus lent : le récepteur comprend mieux. C\'est pour ça que les lignes sont protégées et qu\'on répète les messages importants.'); });
  $('rx-check').addEventListener('click', () => {
    const v = $('rx-in').value.trim().toUpperCase().replace('Ô', 'O');
    if (v === RX) { TS.win(); TS.confetti($('rx-lamp')); LV.done(3); mg.dataset.state = 'win3'; msay('Bien reçu : ALLO! Vous avez trié le signal du bruit. Répondez, et c\'est la <b>rétroaction</b> : l\'émetteur sait que c\'est arrivé.', 'ok'); window.Path.learn('bit', 'Le récepteur doit séparer le vrai signal (points et traits) du bruit (grésillements). Un bit bien net se lit sans erreur.'); }
    else { TS.bad(); TS.flash($('rx-in'), 'bad'); TS.bubble($('rx-in'), v.length !== 4 ? 'Le mot a 4 lettres. Les trois espaces marquent la fin d\'une lettre.' : 'Pas tout à fait. Les grésillements gris ne comptent pas. Essayez « Plus lent, sans bruit ».', 'bad'); }
  });
  $('rx-in').addEventListener('keydown', e => { if (e.key === 'Enter') $('rx-check').click(); });
  setLevel(0);
})();

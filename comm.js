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

  /* ----- morse ----- */
  const MORSE = { '.-': 'A', '-...': 'B', '-.-.': 'C', '-..': 'D', '.': 'E', '..-.': 'F', '--.': 'G', '....': 'H', '..': 'I', '.---': 'J', '-.-': 'K', '.-..': 'L', '--': 'M', '-.': 'N', '---': 'O', '.--.': 'P', '--.-': 'Q', '.-.': 'R', '...': 'S', '-': 'T', '..-': 'U', '...-': 'V', '.--': 'W', '-..-': 'X', '-.--': 'Y', '--..': 'Z' };
  const key = $('m-key'); let t0 = 0, cur = '', text = '', timer = null, down = false, won = false;
  const render = () => { $('m-code').textContent = cur.replace(/\./g, '·').replace(/-/g, '—') || '\u00a0'; $('m-text').textContent = text || '…'; };
  function press() { if (down) return; down = true; t0 = performance.now(); clearTimeout(timer); key.classList.add('down'); TS.holdStart(); }
  function release() {
    if (!down) return; down = false; key.classList.remove('down'); TS.holdStop();
    cur += (performance.now() - t0) < 230 ? '.' : '-'; render();
    timer = setTimeout(() => { text += MORSE[cur] || '?'; cur = ''; render(); check(); }, 900);
  }
  function check() {
    if (text.endsWith('SOS') && !won) {
      won = true; $('m-msg').className = 'msg ok'; $('m-msg').textContent = 'Message reçu : SOS! Trois lettres, envoyées avec un seul bouton : allumé ou éteint.'; TS.win(); TS.confetti(key);
      const rows = $('bitrows'); rows.innerHTML = ''; 'SOS'.split('').forEach(ch => { const b = ch.charCodeAt(0).toString(2).padStart(8, '0');
        rows.insertAdjacentHTML('beforeend', `<div><b>${ch}</b>${b.split('').map(x => `<i class="bit-${x}">${x}</i>`).join('')}</div>`); });
      $('m-bits').hidden = false; $('morse').dataset.state = 'win';
    } else if (text.length >= 3 && !won) { $('m-msg').className = 'msg no'; $('m-msg').textContent = `Reçu « ${text} ». Pour S : trois touches courtes. Pour O : trois longues.`; }
  }
  key.addEventListener('pointerdown', e => { e.preventDefault(); key.setPointerCapture(e.pointerId); press(); });
  key.addEventListener('pointerup', release); key.addEventListener('pointercancel', release);
  key.addEventListener('keydown', e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); if (!e.repeat) press(); } });
  key.addEventListener('keyup', e => { if (e.key === ' ' || e.key === 'Enter') release(); });
  key.addEventListener('contextmenu', e => e.preventDefault());
  $('m-clear').addEventListener('click', () => { cur = ''; text = ''; won = false; clearTimeout(timer); render(); $('m-msg').textContent = ''; $('m-bits').hidden = true; $('morse').dataset.state = ''; });
})();

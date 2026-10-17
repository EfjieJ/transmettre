/* Personnages qui parlent : bulles BD, voix optionnelle, étapes, « Comment ça marche? », guide forgeron. */
(() => {
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* ---------- Voix (désactivée par défaut, jamais sans clic) ---------- */
  let voiceOn = false, frVoice = null;
  const SS = window.speechSynthesis;
  const pickVoice = () => { if (!SS) return; const v = SS.getVoices(); frVoice = v.find(x => /fr[-_]CA/i.test(x.lang)) || v.find(x => /^fr/i.test(x.lang)) || null; };
  if (SS) { pickVoice(); SS.onvoiceschanged = pickVoice; }
  const speak = t => { if (!voiceOn || !SS) return; SS.cancel(); const u = new SpeechSynthesisUtterance(t.replace(/<[^>]+>/g, '')); u.lang = frVoice ? frVoice.lang : 'fr-CA'; if (frVoice) u.voice = frVoice; u.rate = 1.02; SS.speak(u); window.__spoken = (window.__spoken || 0) + 1; };
  const vb = document.createElement('button'); vb.id = 'voice'; vb.className = 'mute voice'; vb.setAttribute('aria-pressed', 'false');
  vb.title = SS ? 'Faire parler les personnages à voix haute' : 'Voix non disponible dans ce navigateur';
  vb.textContent = '🗣️ Voix : non'; if (!SS) vb.disabled = true;
  vb.addEventListener('click', () => { voiceOn = !voiceOn; vb.setAttribute('aria-pressed', voiceOn); vb.textContent = voiceOn ? '🗣️ Voix : oui' : '🗣️ Voix : non'; if (voiceOn) speak('Allô! Je vais lire les bulles à voix haute.'); else SS && SS.cancel(); });
  document.body.appendChild(vb);
  window.Talk = { speak, get voiceOn() { return voiceOn; } };

  /* ---------- Bulle BD dans un panneau ---------- */
  const sayIn = (fig, text, who) => {
    let b = fig.querySelector('.say'); if (!b) { b = document.createElement('span'); b.className = 'say'; b.setAttribute('aria-live', 'polite'); fig.appendChild(b); }
    b.classList.remove('on'); void b.offsetWidth; b.innerHTML = (who ? `<i>${who}</i> ` : '') + text; b.classList.add('on'); speak(text);
  };

  /* ---------- Contenu des démonstrations ---------- */
  const D = {
    "La pierre qui roule": { b: ['Ouf… mon dos!', 'Encore un voyage? Pas capable!'], a: ['Hé, regarde : elle roule toute seule!', 'Le sol la porte, moi je pousse.'],
      beats: ['Problème : la charge est trop lourde pour le dos.', 'Essai : on la traîne. Ça frotte partout.', 'Invention : une forme ronde touche le sol en un seul point.', 'Résultat : on pousse au lieu de porter.'],
      chain: ['La main pousse la pierre.', 'La pierre tourne sur elle-même.', 'Un seul petit point touche le sol : presque pas de frottement.', 'Le sol porte le poids, la main n\'a plus qu\'à guider.'],
      fact: 'Les Égyptiens déplaçaient de gros blocs en mouillant le sable devant les traîneaux : une peinture du tombeau de Djéhoutihotep (vers 1900 av. J.-C.) montre un homme qui verse de l\'eau.' },
    "Le levier": { b: ['Pousse! Elle bouge pas!', 'On est trois pis rien!'], a: ['Avec la barre, je la lève tout seul!', 'Long bras d\'un bord, appui proche de la pierre.'],
      beats: ['Problème : la pierre pèse plus que trois personnes peuvent pousser.', 'Essai : on pousse tous ensemble. Elle bouge à peine.', 'Invention : une barre posée sur un appui.', 'Résultat : une seule personne la soulève.'],
      chain: ['La main appuie au bout long de la barre.', 'La barre pivote sur l\'appui.', 'Le bout court monte, moins loin mais plus fort.', 'La pierre se soulève.'],
      fact: 'Archimède (IIIe siècle av. J.-C.) a expliqué la loi du levier. On lui prête la phrase : « Donnez-moi un point d\'appui et je soulèverai le monde. »' },
    "La roue": { b: ['Ça accroche partout!', 'Grrr… encore une roche!'], a: ['Ça roule tout seul!', 'Deux roues, un essieu, pis c\'est parti!'],
      beats: ['Problème : la charge frotte sur le sol.', 'Essai : on la traîne. Ça bloque sur chaque roche.', 'Invention : des roues sur un axe (l\'essieu).', 'Résultat : on transporte plus lourd, plus loin.'],
      chain: ['On tire la charrette.', 'L\'essieu fait tourner les roues.', 'La roue roule au lieu de frotter.', 'La charge avance avec peu d\'effort.'],
      fact: 'La plus vieille roue en bois connue, trouvée près de Ljubljana en Slovénie, a environ 5 000 ans.' },
    "La poulie": { b: ['Mes bras brûlent!', 'Le seau est ben trop creux!'], a: ['Je tire vers le bas avec mon poids!', 'La roue change la direction de la force.'],
      beats: ['Problème : remonter l\'eau du puits à bout de bras.', 'Essai : penché, on tire la corde vers le haut. On se fatigue vite.', 'Invention : une roue à gorge au-dessus du puits.', 'Résultat : on tire vers le bas, avec son propre poids.'],
      chain: ['La main tire la corde vers le bas.', 'La corde tourne autour de la poulie.', 'De l\'autre côté, elle monte.', 'Le seau remonte.'],
      fact: 'Avec plusieurs poulies (un palan), on divise l\'effort : avec 4 brins qui portent la charge, on tire environ 4 fois moins fort, mais 4 fois plus longtemps.' },
    "La brouette": { b: ['Encore un panier…', 'Mon dos va lâcher!'], a: ['Trois paniers d\'un coup!', 'La roue porte, moi je guide.'],
      beats: ['Problème : un seul panier de terre par voyage.', 'Essai : on porte sur le dos. Des dizaines de voyages.', 'Invention : un bac, deux bras et une roue devant.', 'Résultat : la roue porte le poids, les bras guident.'],
      chain: ['Les bras soulèvent les poignées.', 'Le bac bascule sur la roue (un levier!).', 'La roue porte presque tout le poids.', 'On pousse, et la terre avance.'],
      fact: 'La brouette à une roue est attestée en Chine il y a environ 1 800 ans; en Europe, elle apparaît vers le XIIe siècle.' },
    "L'engrenage": { b: ['Tourne… tourne… ça finit pu!', 'On fait ça depuis le matin!'], a: ['La rivière travaille à notre place!', 'Les dents passent le mouvement.'],
      beats: ['Problème : écraser le grain à la main prend des heures.', 'Essai : deux personnes tournent la meule.', 'Invention : une roue à eau et des roues dentées.', 'Résultat : le moulin travaille seul.'],
      chain: ['L\'eau pousse les pales de la roue.', 'La roue fait tourner un engrenage.', 'Les dents poussent les dents de la roue suivante.', 'La meule tourne et écrase le grain.'],
      fact: 'Le mécanisme d\'Anticythère, retrouvé dans une épave grecque, utilise plus de 30 roues dentées pour calculer la position des astres. Il a plus de 2 000 ans.' },
    "La vis sans fin": { b: ['Lâche pas!', 'Si on lâche, tout retombe!'], a: ['Je tourne, pis ça tient tout seul!', 'La vis bloque le retour.'],
      beats: ['Problème : retenir une charge suspendue.', 'Essai : deux personnes tiennent la corde.', 'Invention : une manivelle et une vis qui pousse une roue dentée.', 'Résultat : ça monte, et ça ne redescend pas.'],
      chain: ['La main tourne la manivelle.', 'La vis tourne et pousse une dent à la fois.', 'La roue dentée tourne lentement, avec force.', 'La corde s\'enroule; la vis empêche de reculer.'],
      fact: 'Une vis sans fin peut réduire la vitesse de 20 à 100 fois (ou plus) en un seul étage, c\'est pourquoi on l\'utilise dans les treuils et les têtes de guitare.' },
    "La vapeur": { b: ['Hue! Hue!', 'Les chevaux sont brûlés…'], a: ['Le feu pousse à notre place!', 'L\'eau chaude devient vapeur, la vapeur pousse.'],
      beats: ['Problème : des muscles (humains ou animaux) qui se fatiguent.', 'Essai : plus de chevaux, plus de foin.', 'Invention : chauffer l\'eau; la vapeur pousse un piston.', 'Résultat : une force qui ne se fatigue pas.'],
      chain: ['Le feu chauffe l\'eau.', 'L\'eau devient vapeur et prend beaucoup plus de place.', 'La vapeur pousse le piston.', 'Le piston fait tourner une roue.'],
      fact: 'Le mot « watt » vient de James Watt, qui a beaucoup amélioré la machine à vapeur vers 1770. C\'est lui qui a popularisé le « cheval-vapeur ».' },
    "Le moteur à combustion": { b: ['Faut nourrir les chevaux!', 'On arrivera jamais avant la nuit!'], a: ['Vroum! Plus de foin!', 'Des petites explosions poussent les pistons.'],
      beats: ['Problème : la vapeur, c\'est lourd et lent à démarrer.', 'Essai : de grosses machines fixes.', 'Invention : brûler le carburant dans le cylindre.', 'Résultat : un moteur petit, qui part tout de suite.'],
      chain: ['Une étincelle allume le mélange air-essence.', 'Le gaz chaud pousse le piston.', 'Le piston fait tourner le vilebrequin.', 'Les roues tournent.'],
      fact: 'La première automobile à essence vendue est celle de Carl Benz, brevetée en 1886. Elle roulait à environ 16 km/h.' },
    "L'électricité": { b: ['On voit rien!', 'Ça fume pis ça tremble.'], a: ['Clic! Toute la pièce s\'allume!', 'Le courant pousse dans le fil.'],
      beats: ['Problème : la nuit, on y voit à peine.', 'Essai : bougies et lampes à l\'huile, qui fument.', 'Invention : un fil, un interrupteur, une ampoule.', 'Résultat : la lumière en un clic.'],
      chain: ['Le doigt ferme l\'interrupteur.', 'Le circuit est une boucle fermée.', 'Le courant pousse les électrons dans le fil.', 'Le filament chauffe et brille.'],
      fact: 'Au Québec, plus de 90 % de l\'électricité vient de l\'hydroélectricité : l\'eau des rivières fait tourner des turbines.' },
    "La radio": { b: ['Galope, galope!', 'La nouvelle va arriver vieille!'], a: ['Allô la France? Ici le Canada!', 'L\'onde voyage à la vitesse de la lumière.'],
      beats: ['Problème : une nouvelle voyage à la vitesse d\'un cheval.', 'Essai : des relais de messagers.', 'Invention : une antenne qui pousse des ondes.', 'Résultat : la voix traverse l\'océan en un instant.'],
      chain: ['Le micro change la voix en courant.', 'L\'antenne fait vibrer le courant très vite.', 'Une onde invisible part dans l\'air.', 'L\'antenne du récepteur la capte et le haut-parleur rejoue la voix.'],
      fact: 'En 1901, Marconi capte à Signal Hill, à Terre-Neuve, un signal radio envoyé d\'Angleterre : la lettre « S » en morse.' },
    "Le cellulaire": { b: ['Chère cousine…', 'La réponse? Dans un mois!'], a: ['Envoyé!', 'Reçu! 😄'],
      beats: ['Problème : une lettre prend des semaines.', 'Essai : le télégraphe, puis le téléphone avec fil.', 'Invention : une radio de poche reliée à des antennes.', 'Résultat : le message arrive presque aussitôt.'],
      chain: ['Le doigt touche l\'écran : des bits.', 'La puce les change en onde radio.', 'L\'antenne relais les passe au réseau (câbles, fibre).', 'Le cellulaire d\'en face les reçoit et les affiche.'],
      fact: 'Le premier appel sur un cellulaire portable a été fait par Martin Cooper, de Motorola, à New York, le 3 avril 1973.' },
    "Les centres de données": { b: ['Il est où, ce dossier-là?', 'Tiroir… tiroir… tiroir…'], a: ['Trouvé en une seconde!', 'Les serveurs cherchent pour moi.'],
      beats: ['Problème : retrouver une information dans des tonnes de papier.', 'Essai : classer, étiqueter, fouiller.', 'Invention : des ordinateurs reliés, qui gardent tout en bits.', 'Résultat : une réponse en une fraction de seconde.'],
      chain: ['On tape une question.', 'Elle voyage en lumière dans la fibre optique.', 'Des milliers de serveurs cherchent en même temps.', 'La réponse revient par le même chemin.'],
      fact: 'Plus de 95 % du trafic internet entre les continents passe par des câbles sous-marins, pas par satellite.' },
    "Superintelligence et robotisme": { b: ['Encore la même vis…', 'Mille fois par jour!'], a: ['Un café pour vous!', 'Le robot répète, moi je crée.'],
      beats: ['Problème : des gestes répétés à l\'infini.', 'Essai : diviser le travail sur une chaîne.', 'Invention : un bras robot guidé par des puces.', 'Résultat : la machine répète, l\'humain invente.'],
      chain: ['Des capteurs voient la pièce.', 'La puce calcule le geste.', 'Des moteurs bougent chaque articulation.', 'La pince prend et dépose.'],
      fact: 'Le premier robot industriel, Unimate, a commencé à travailler en 1961 dans une usine General Motors au New Jersey.' }
  };

  /* ---------- Application aux panneaux avant/après ---------- */
  const cards = [...document.querySelectorAll('.ba')];
  cards.forEach((ba, k) => {
    const card = ba.closest('.card') || ba.parentElement; const h = card.querySelector('h3'); const d = h && D[h.textContent.trim()]; if (!d) return;
    const fb = ba.querySelector('.pan.before'), fa = ba.querySelector('.pan.after');
    /* étapes */
    const st = document.createElement('div'); st.className = 'beats'; st.id = 'beats-' + k;
    const lbl = ['Problème', 'Essai', 'Invention', 'Résultat'];
    st.innerHTML = `<div class="beat-dots">${lbl.map((l, i) => `<button class="beat" data-i="${i}" aria-label="Étape ${i + 1} : ${l}"><b>${i + 1}</b>${l}</button>`).join('')}</div><p class="beat-cap" aria-live="polite"></p>`;
    const more = document.createElement('details'); more.className = 'howit';
    more.innerHTML = `<summary>🔧 Comment ça marche?</summary><ol class="chain">${d.chain.map(c => `<li>${c}</li>`).join('')}</ol><p class="fact">💡 <b>Le saviez-vous?</b> ${d.fact}</p>`;
    ba.after(st); st.after(more);
    const cap = st.querySelector('.beat-cap'); let cur = -1, timer = null;
    const go = i => { cur = i; st.querySelectorAll('.beat').forEach((b, j) => { b.classList.toggle('on', j === i); b.classList.toggle('past', j < i); });
      cap.textContent = d.beats[i]; fb.classList.toggle('focus', i < 2); fa.classList.toggle('focus', i >= 2);
      const pan = i < 2 ? fb : fa; sayIn(pan, (i < 2 ? d.b : d.a)[i % 2]); };
    st.addEventListener('click', e => { const b = e.target.closest('.beat'); if (!b) return; stop(); go(+b.dataset.i); });
    const stop = () => { clearInterval(timer); timer = null; };
    const play = () => { if (timer || RM) return; go((cur + 1) % 4); timer = setInterval(() => go((cur + 1) % 4), 3600); };
    if (RM) go(0);
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting && e.intersectionRatio > .5) { if (!st.dataset.touched) play(); } else stop(); }), { threshold: [0, .5, 1] });
    io.observe(ba);
    st.addEventListener('pointerdown', () => st.dataset.touched = 1);
    window.__beats = (window.__beats || 0) + 1;
  });

  /* ---------- Guide : le forgeron ---------- */
  const g = document.createElement('div'); g.className = 'guide'; g.id = 'guide'; g.setAttribute('role', 'status'); g.setAttribute('aria-live', 'polite');
  g.innerHTML = `<span class="guide-face" aria-hidden="true">🧔🏻‍🔧</span><p class="guide-say"></p><button class="guide-x" aria-label="Fermer">×</button>`;
  document.body.appendChild(g); let gt = null;
  g.querySelector('.guide-x').onclick = () => g.classList.remove('on');
  const guide = (t) => { g.querySelector('.guide-say').innerHTML = `<b>Gaston le forgeron :</b> ${t}`; g.classList.add('on'); speak(t); clearTimeout(gt); gt = setTimeout(() => g.classList.remove('on'), 7000); window.__guide = (window.__guide || 0) + 1; };
  window.Talk.guide = guide;
  const G = {
    onoff: 'Allumé, éteint. Comme mon soufflet : ça souffle ou ça souffle pas. Tout part de là!',
    bit: 'Un bit, c\'est un oui ou un non. Avec assez de oui pis de non, on écrit n\'importe quoi.',
    inter: 'Ton doigt ferme le circuit. Une boucle fermée, pis le courant passe.',
    trans: 'Le transistor, c\'est un interrupteur sans doigt : une petite tension ouvre la porte au gros courant.',
    porte: 'Des interrupteurs en série ou côte à côte, et voilà une porte logique. Le marteau de l\'ordi!',
    add: 'Des portes qui additionnent! Une puce fait ça des milliards de fois par seconde.',
    puce: 'Des milliards de petits interrupteurs gravés avec de la lumière. Mais au fond, c\'est encore allumé-éteint.'
  };
  if (window.Path) { const L = window.Path.learn; window.Path.learn = (id, extra) => { const fresh = !(window.__path || []).includes(id); L(id, extra); if (fresh && G[id]) guide(G[id]); }; }
  let lastBad = 0; const B = TS.bad; TS.bad = (...a) => { B(...a); if (Date.now() - lastBad > 15000 && document.querySelector('#puce') && scrollY > document.querySelector('#puce').offsetTop - 300) { lastBad = Date.now(); guide(['Pas grave! Au forgeron, la première épée est toujours croche.', 'Regarde la bulle : elle te dit quoi changer.', 'On essaie, on se trompe, on recommence. C\'est ça, inventer!'][Math.floor(Math.random() * 3)]); } };

  /* ---------- Personnages des jeux brouette + levier ---------- */
  const watch = (msgId, figSel, lines) => { const m = document.getElementById(msgId); let host = document.querySelector(figSel); if (host && host instanceof SVGElement) host = host.parentElement; if (!m || !host) return; host.classList.add('talkhost');
    new MutationObserver(() => { const c = m.className, t = m.textContent; const set = /ok|win/.test(c) ? lines.ok : /no|bad/.test(c) ? lines.no : null; if (!set || !t) return; sayIn(host, set[Math.floor(Math.random() * set.length)], '🧑'); }).observe(m, { attributes: true, childList: true, characterData: true, subtree: true }); };
  const bg = document.getElementById('b-msg'); if (bg) watch('b-msg', '#bp', { ok: ['Yé! Ça roule!', 'Regarde-moi aller avec six pierres!', 'La roue porte, moi je pousse!'], no: ['Hmm, il manque une pièce…', 'Ça marche pas encore, essaie autre chose!', 'Pas de roue? Je vais devoir tout porter!'] });
  watch('lv-msg', '#levier-jeu svg#lv', { ok: ['Avec la barre, je la lève tout seul!', 'Hé, j\'ai de la force de géant!'], no: ['Elle bouge pas! Rapproche l\'appui!', 'Trop dur… mon bras est trop court!'] });
  const lvH = document.getElementById('lv'); if (lvH && lvH.parentElement) { lvH.parentElement.classList.add('talkhost'); }

  /* ---------- Photolithographie : étapes ---------- */
  const litho = document.querySelector('.litho');
  if (litho) { const LS = [
      ['Nettoyer', 'On part d\'une tranche de silicium très pure, polie comme un miroir.'],
      ['Vernir', 'On étale une mince couche de vernis sensible à la lumière (la « résine »).'],
      ['Insoler', 'La lumière passe à travers le masque, le pochoir du circuit. Elle touche le vernis seulement où le masque est ouvert.'],
      ['Développer', 'Un bain enlève le vernis éclairé. Le dessin du circuit apparaît.'],
      ['Graver', 'On attaque le silicium là où il n\'y a plus de vernis. Puis on enlève le reste du vernis.'],
      ['Répéter', 'On recommence des dizaines de fois, couche par couche, pour empiler transistors et fils.']];
    const box = document.createElement('div'); box.className = 'beats litho-steps';
    box.innerHTML = `<div class="beat-dots">${LS.map((s, i) => `<button class="beat" data-i="${i}"><b>${i + 1}</b>${s[0]}</button>`).join('')}</div><p class="beat-cap" aria-live="polite">Touchez une étape pour voir comment on fabrique une puce.</p>`;
    const how = document.createElement('details'); how.className = 'howit';
    how.innerHTML = `<summary>🔧 Comment ça marche?</summary><ol class="chain"><li>La lampe envoie une lumière ultraviolette.</li><li>Une lentille réduit l'image du masque (environ 4 fois plus petite).</li><li>La lumière change la chimie du vernis là où elle touche.</li><li>Le vernis restant protège; le reste est gravé.</li></ol><p class="fact">💡 <b>Le saviez-vous?</b> Les machines les plus avancées utilisent une lumière « ultraviolet extrême » de 13,5 nanomètres de longueur d'onde. Une seule de ces machines coûte plusieurs centaines de millions de dollars.</p>`;
    litho.appendChild(box); litho.appendChild(how);
    box.addEventListener('click', e => { const b = e.target.closest('.beat'); if (!b) return; const i = +b.dataset.i; box.querySelectorAll('.beat').forEach((x, j) => { x.classList.toggle('on', i === j); x.classList.toggle('past', j < i); }); box.querySelector('.beat-cap').textContent = LS[i][1]; if (i === 2) document.getElementById('litho-go').click(); if (i === 5) guide('Comme moi au marteau : on frappe, on refroidit, on recommence. Couche après couche.'); else speak(LS[i][1]); });
    document.getElementById('litho-go').addEventListener('click', () => setTimeout(() => guide('Une seule lumière, pis des dizaines de puces pareilles. Gutenberg serait fier!'), 1800));
  }
  /* ---------- Zoom : plus d'explications ---------- */
  const zoom = document.getElementById('zoom');
  if (zoom) { const ZX = [
      'Deux portes logiques : une dizaine de transistors. Chaque transistor est un interrupteur commandé par une tension.',
      'L\'additionneur : quelques dizaines de transistors. On en met 64 côte à côte pour additionner de grands nombres.',
      'Le processeur : des additionneurs, de la mémoire et une horloge qui bat des milliards de fois par seconde (gigahertz).',
      'La puce : plusieurs cœurs, de la mémoire, de la radio, des milliards de transistors sur quelques centimètres carrés.',
      'Le cellulaire : la puce est soudée sur un circuit imprimé, avec l\'écran, la pile et l\'antenne. Tout ce que vous avez construit dans les jeux est là.'];
    const p = document.createElement('p'); p.className = 'zoom-more'; p.setAttribute('aria-live', 'polite'); p.textContent = ZX[0];
    const how = document.createElement('details'); how.className = 'howit';
    how.innerHTML = `<summary>🔧 Comment ça marche?</summary><ol class="chain"><li>Un transistor = un interrupteur.</li><li>Quelques transistors = une porte (ET, OU, NON).</li><li>Quelques portes = un additionneur.</li><li>Des milliers d'additionneurs + de la mémoire = un processeur.</li><li>Un processeur + le reste = une puce, posée sur un circuit imprimé.</li></ol><p class="fact">💡 <b>Le saviez-vous?</b> Le premier microprocesseur, l'Intel 4004 (1971), avait environ 2 300 transistors. Une puce de cellulaire récente en a plus de 15 milliards.</p>`;
    zoom.querySelector('#zoom-cap').after(p); zoom.appendChild(how);
    const r = document.getElementById('zoom-r'); let said = -1;
    r.addEventListener('input', () => { const n = +r.value; p.textContent = ZX[n]; if (n === 4 && said !== 4) guide('Tout ça, c\'est ce que tu as bâti : allumé-éteint, bits, portes, addition. Juste beaucoup, beaucoup plus petit.'); said = n; });
  }
})();

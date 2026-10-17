/* Personnages qui parlent : bulles BD, voix optionnelle, étapes, « Comment ça marche? », guide forgeron. */
(() => {
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* ---------- Voix ---------- */
  const SS = window.speechSynthesis; let voices = [], frVoice = null, ka = null;
  const pref = (() => { try { return localStorage.getItem('tr-voice'); } catch (e) { return null; } })();
  let voiceOn = false;
  const pickVoice = () => { if (!SS) return; voices = SS.getVoices() || []; const fr = voices.filter(x => /^fr/i.test(x.lang)); const rank = x => (/fr[-_]CA/i.test(x.lang) ? 0 : /fr[-_]FR/i.test(x.lang) ? 1 : 2) - (/google/i.test(x.name) ? .5 : 0) - (x.localService ? .2 : 0); frVoice = fr.sort((a, b) => rank(a) - rank(b))[0] || null; };
  const help = document.createElement('p'); help.className = 'voice-help'; help.hidden = true; help.innerHTML = 'Pas de voix française sur cet appareil? Sur Android : <b>Paramètres › Système › Langues › Synthèse vocale</b>, choisissez <b>Services de reconnaissance vocale de Google</b> et installez le <b>français</b>. <button aria-label="Fermer">×</button>'; help.querySelector('button').onclick = () => help.hidden = true;
  const checkHelp = () => { if (!SS) return; pickVoice(); if (!frVoice) help.hidden = false; };
  if (SS) { pickVoice(); SS.addEventListener ? SS.addEventListener('voiceschanged', pickVoice) : (SS.onvoiceschanged = pickVoice); }
  const WHO = { avant: { n: 'Ti-Jos', a: '🧔', p: .85, r: .95 }, apres: { n: 'Rosalie', a: '👩', p: 1.3, r: 1.05 }, jeu: { n: 'Ti-Jean', a: '🧑', p: 1.1, r: 1.1 }, gaston: { n: 'Gaston', a: '🧔🏻‍🔧', p: .7, r: .92 }, narr: { n: '', a: '', p: 1, r: 1 } };
  const fnv = t => { let h = 0x811c9dc5; for (const ch of t) { h ^= ch.codePointAt(0); h = Math.imul(h, 0x01000193) >>> 0; } return h.toString(16).padStart(8, '0'); };
  const clean = t => String(t).replace(/<[^>]+>/g, '').trim();
  const lineId = (t, who) => (WHO[who] ? who : 'narr') + '-' + fnv(clean(t));
  let curAudio = null;
  const synth = (t, who) => { if (!SS) return; if (!frVoice) pickVoice(); SS.cancel(); const w = WHO[who] || WHO.narr;
    const u = new SpeechSynthesisUtterance(clean(t)); u.lang = frVoice ? frVoice.lang : 'fr-CA'; if (frVoice) u.voice = frVoice; u.pitch = w.p; u.rate = w.r;
    clearInterval(ka); ka = setInterval(() => { if (!SS.speaking) return clearInterval(ka); SS.pause(); SS.resume(); }, 10000);
    u.onend = () => clearInterval(ka); u.onerror = ev => { clearInterval(ka); if (ev.error !== 'interrupted' && ev.error !== 'canceled') help.hidden = false; }; SS.speak(u); };
  const speak = (t, who = 'narr') => {
    const id = lineId(t, who); window.__speakCalls = (window.__speakCalls || []); window.__speakCalls.push(id);
    if (!voiceOn) return;
    if (curAudio) { curAudio.pause(); curAudio = null; } if (SS) SS.cancel();
    const set = window.AUDIO_IDS; if (set && set.has(id)) {
      const a = new Audio('audio/' + id + '.mp3'); a.preload = 'auto'; curAudio = a; window.__audioPlays = (window.__audioPlays || []); window.__audioPlays.push(id);
      a.onerror = () => { if (curAudio === a) synth(t, who); };
      const p = a.play(); if (p && p.catch) p.catch(e => { if (e && e.name === 'NotAllowedError') return; if (curAudio === a) synth(t, who); });
    } else synth(t, who);
    window.__spoken = (window.__spoken || 0) + 1;
  };
  const vb = document.createElement('button'); vb.id = 'voice'; vb.className = 'mute voice'; vb.setAttribute('aria-pressed', 'false');
  vb.title = SS ? 'Faire parler les personnages à voix haute' : 'Voix non disponible dans ce navigateur';
  const setVoice = (on, test) => { voiceOn = on; vb.setAttribute('aria-pressed', on); vb.textContent = on ? '🔊 Voix : oui' : '🔇 Voix : non'; try { localStorage.setItem('tr-voice', on ? 'on' : 'off'); } catch (e) {} if (!on && SS) SS.cancel(); if (on && test) speak('Allô! Je vais lire les bulles à voix haute.', 'gaston'); if (on && !window.AUDIO_IDS) setTimeout(checkHelp, 2500); };
  setVoice(false); 
  vb.addEventListener('click', e => { e.stopPropagation(); setVoice(!voiceOn, true); });
  document.body.appendChild(vb); document.body.appendChild(help);
  /* premier geste n'importe où : débloque la voix (si pas refusée avant) */
  const unlock = e => { if (e.target.closest && e.target.closest('#voice')) return; removeEventListener('pointerdown', unlock, true); if (pref === 'off') return; try { const a = new Audio('audio/silence.mp3'); a.volume = 0; a.play().catch(() => {}); } catch (x) {} setVoice(true, false); };
  addEventListener('pointerdown', unlock, true);
  window.Talk = { speak, get voiceOn() { return voiceOn; } };

  /* ---------- Bande de dialogue (hors du dessin) ---------- */
  const strip = (host, after) => { let d = host.querySelector(':scope > .dlg'); if (!d) { d = document.createElement('div'); d.className = 'dlg'; d.setAttribute('aria-live', 'polite'); if (after) after.after(d); else host.appendChild(d); } return d; };
  const sayIn = (fig, text, who = 'jeu') => {
    const svg = fig.querySelector(':scope > svg'); const d = strip(fig, svg); const w = WHO[who] || WHO.jeu;
    d.innerHTML = `<span class="dlg-av" aria-hidden="true">${w.a}</span><p class="dlg-txt"><b>${w.n} :</b> ${text}</p><button class="dlg-play" aria-label="Réécouter">🔊</button>`;
    d.classList.remove('on'); void d.offsetWidth; d.classList.add('on');
    d.querySelector('.dlg-play').onclick = () => { if (!voiceOn) setVoice(true, false); speak(text, who); };
    speak(text, who);
  };

  /* ---------- Contenu des démonstrations ---------- */
  const D = window.TALK_D || {};
  const BADS = ['Pas grave! Chez le forgeron, la première épée est toujours croche.', 'Regarde la bulle : elle te dit quoi changer.', 'On essaie, on se trompe, on recommence. C\'est ça, inventer!'];
  const GAME_B = { ok: ['Bravo, ça roule!', 'Regarde-moi aller avec six pierres!', 'La roue porte, moi je pousse!'], no: ['Attends, il manque une pièce…', 'Ça marche pas encore, essaie autre chose!', 'Pas de roue? Je vais devoir tout porter!'] };
  const GAME_L = { ok: ['Avec la barre, je la lève tout seul!', 'Hé, j\'ai de la force de géant!'], no: ['Elle bouge pas! Rapproche l\'appui!', 'Trop dur… mon bras est trop court!'] };
  const LS = [
      ['Nettoyer', 'On part d\'une tranche de silicium très pure, polie comme un miroir.'],
      ['Vernir', 'On étale une mince couche de vernis sensible à la lumière (la « résine »).'],
      ['Insoler', 'La lumière passe à travers le masque, le pochoir du circuit. Elle touche le vernis seulement où le masque est ouvert.'],
      ['Développer', 'Un bain enlève le vernis éclairé. Le dessin du circuit apparaît.'],
      ['Graver', 'On attaque le silicium là où il n\'y a plus de vernis. Puis on enlève le reste du vernis.'],
      ['Répéter', 'On recommence des dizaines de fois, couche par couche, pour empiler transistors et fils.']];
  const GX = ['Comme moi au marteau : on frappe, on refroidit, on recommence. Couche après couche.', 'Une seule lumière, pis des dizaines de puces pareilles. Gutenberg serait fier!', 'Tout ça, c\'est ce que tu as bâti : allumé-éteint, bits, portes, addition. Juste beaucoup, beaucoup plus petit.'];


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
      const pan = i < 2 ? fb : fa; sayIn(pan, (i < 2 ? d.b : d.a)[i % 2], i === 2 ? 'apres' : 'avant'); };
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
  g.innerHTML = `<span class="guide-face" aria-hidden="true">🧔🏻‍🔧</span><p class="guide-say"></p><button class="dlg-play" aria-label="Réécouter">🔊</button><button class="guide-x" aria-label="Fermer">×</button>`;
  g.querySelector('.guide-x').onclick = () => g.classList.remove('on'); let gLast = '';
  g.querySelector('.dlg-play').onclick = () => { if (!voiceOn) setVoice(true, false); speak(gLast, 'gaston'); };
  /* ancré dans la page, sous le bloc le plus proche du centre de l'écran : ne recouvre jamais rien */
  const anchor = () => { const el = document.elementFromPoint(innerWidth / 2, innerHeight / 2); const blk = el && el.closest('.game, .litho, .zoom, .card, .sw-game, #swg, #pcbg, #gates, section'); return blk; };
  const guide = (t) => { gLast = t; g.querySelector('.guide-say').innerHTML = `<b>Gaston le forgeron :</b> ${t}`; const blk = anchor(); if (blk && blk !== g.parentElement) { if (blk.tagName === 'SECTION') blk.appendChild(g); else blk.after(g); } g.classList.add('on'); speak(t, 'gaston'); window.__guide = (window.__guide || 0) + 1; };
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
  let lastBad = 0; const B = TS.bad; TS.bad = (...a) => { B(...a); if (Date.now() - lastBad > 15000 && document.querySelector('#puce') && scrollY > document.querySelector('#puce').offsetTop - 300) { lastBad = Date.now(); guide(BADS[Math.floor(Math.random() * BADS.length)]); } };

  /* ---------- Personnages des jeux brouette + levier ---------- */
  const watch = (msgId, figSel, lines) => { const m = document.getElementById(msgId); let host = document.querySelector(figSel); if (host && host instanceof SVGElement) host = host.parentElement; if (!m || !host) return; host.classList.add('talkhost');
    new MutationObserver(() => { const c = m.className, t = m.textContent; const set = /ok|win/.test(c) ? lines.ok : /no|bad/.test(c) ? lines.no : null; if (!set || !t) return; sayIn(host, set[Math.floor(Math.random() * set.length)], 'jeu'); }).observe(m, { attributes: true, childList: true, characterData: true, subtree: true }); };
  const bg = document.getElementById('b-msg'); if (bg) watch('b-msg', '#bp', GAME_B);
  watch('lv-msg', '#levier-jeu svg#lv', GAME_L);
  const lvH = document.getElementById('lv'); if (lvH && lvH.parentElement) { lvH.parentElement.classList.add('talkhost'); }

  /* ---------- Photolithographie : étapes ---------- */
  const litho = document.querySelector('.litho');
  if (litho) {
    const box = document.createElement('div'); box.className = 'beats litho-steps';
    box.innerHTML = `<div class="beat-dots">${LS.map((s, i) => `<button class="beat" data-i="${i}"><b>${i + 1}</b>${s[0]}</button>`).join('')}</div><p class="beat-cap" aria-live="polite">Touchez une étape pour voir comment on fabrique une puce.</p>`;
    const how = document.createElement('details'); how.className = 'howit';
    how.innerHTML = `<summary>🔧 Comment ça marche?</summary><ol class="chain"><li>La lampe envoie une lumière ultraviolette.</li><li>Une lentille réduit l'image du masque (environ 4 fois plus petite).</li><li>La lumière change la chimie du vernis là où elle touche.</li><li>Le vernis restant protège; le reste est gravé.</li></ol><p class="fact">💡 <b>Le saviez-vous?</b> Les machines les plus avancées utilisent une lumière « ultraviolet extrême » de 13,5 nanomètres de longueur d'onde. Une seule de ces machines coûte environ 180 millions de dollars américains, et la nouvelle génération bien plus encore.</p>`;
    litho.appendChild(box); litho.appendChild(how);
    box.addEventListener('click', e => { const b = e.target.closest('.beat'); if (!b) return; const i = +b.dataset.i; box.querySelectorAll('.beat').forEach((x, j) => { x.classList.toggle('on', i === j); x.classList.toggle('past', j < i); }); box.querySelector('.beat-cap').textContent = LS[i][1]; if (i === 2) document.getElementById('litho-go').click(); if (i === 5) guide('Comme moi au marteau : on frappe, on refroidit, on recommence. Couche après couche.'); else speak(LS[i][1]); });
    document.getElementById('litho-go').addEventListener('click', () => setTimeout(() => guide('Une seule lumière, pis des dizaines de puces pareilles. Gutenberg serait fier!'), 1800));
  }
  /* ---------- Zoom : plus d'explications ---------- */
  const zoom = document.getElementById('zoom');
  if (zoom) { const ZX = [
      'Deux portes logiques : une vingtaine de transistors au plus. Chaque transistor est un interrupteur commandé par une tension.',
      'L\'additionneur : quelques dizaines de transistors. On en met 64 côte à côte pour additionner de grands nombres.',
      'Le processeur : des additionneurs, de la mémoire et une horloge qui bat des milliards de fois par seconde (gigahertz).',
      'La puce : plusieurs cœurs, de la mémoire, de la radio, des milliards de transistors sur environ un centimètre carré.',
      'Le cellulaire : la puce est soudée sur un circuit imprimé, avec l\'écran, la pile et l\'antenne. Tout ce que vous avez construit dans les jeux est là.'];
    const p = document.createElement('p'); p.className = 'zoom-more'; p.setAttribute('aria-live', 'polite'); p.textContent = ZX[0];
    const how = document.createElement('details'); how.className = 'howit';
    how.innerHTML = `<summary>🔧 Comment ça marche?</summary><ol class="chain"><li>Un transistor = un interrupteur.</li><li>Quelques transistors = une porte (ET, OU, NON).</li><li>Quelques portes = un additionneur.</li><li>Des milliers d'additionneurs + de la mémoire = un processeur.</li><li>Un processeur + le reste = une puce, posée sur un circuit imprimé.</li></ol><p class="fact">💡 <b>Le saviez-vous?</b> Le premier microprocesseur, l'Intel 4004 (1971), avait environ 2 300 transistors. Une puce de cellulaire récente en a environ 15 à 20 milliards.</p>`;
    zoom.querySelector('#zoom-cap').after(p); zoom.appendChild(how);
    const r = document.getElementById('zoom-r'); let said = -1;
    r.addEventListener('input', () => { const n = +r.value; p.textContent = ZX[n]; if (n === 4 && said !== 4) guide('Tout ça, c\'est ce que tu as bâti : allumé-éteint, bits, portes, addition. Juste beaucoup, beaucoup plus petit.'); said = n; });
  }
  /* liste de toutes les répliques (pour générer l'audio) */
  window.Talk.lines = () => { const out = []; const add = (who, t) => out.push({ who, text: clean(t), id: lineId(t, who) });
    Object.values(D).forEach(d => { d.b.forEach(t => add('avant', t)); add('apres', d.a[0]); add('avant', d.a[1]); });
    Object.values(G).forEach(t => add('gaston', t)); BADS.forEach(t => add('gaston', t)); GX.forEach(t => add('gaston', t.replace(/\\'/g, "'")));
    [...GAME_B.ok, ...GAME_B.no, ...GAME_L.ok, ...GAME_L.no].forEach(t => add('jeu', t)); LS.forEach(x => add('narr', x[1]));
    add('gaston', 'Allô! Je vais lire les bulles à voix haute.'); const seen = new Set(); return out.filter(o => !seen.has(o.id) && seen.add(o.id)); };
})();

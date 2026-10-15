/* Fil conducteur du chemin vers la puce + bulles contextuelles + niveaux + sons bon/mauvais */
(() => {
  const TS = window.TS, reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* --- sons distincts --- */
  TS.good = () => { TS.tone(1318.5, .14, .09); TS.tone(1975.5, .22, .07, 'sine', .08); };
  TS.bad = () => { TS.tone(110, .28, .12, 'square'); TS.tone(98, .3, .08, 'square', .05); };
  TS.flash = (el, kind) => { if (!el) return; const c = kind === 'good' ? 'fx-good' : 'fx-bad'; el.classList.remove('fx-good', 'fx-bad'); void el.getBoundingClientRect(); el.classList.add(c); setTimeout(() => el.classList.remove(c), 900); };
  /* --- bulle contextuelle près d'un élément --- */
  let bubble = null, bt = null;
  TS.bubble = (el, html, kind = '') => {
    if (!el) return; if (!bubble) { bubble = document.createElement('div'); bubble.className = 'bubble'; bubble.setAttribute('role', 'status'); bubble.setAttribute('aria-live', 'polite'); document.body.appendChild(bubble); }
    bubble.innerHTML = html; bubble.className = 'bubble show ' + kind;
    const r = el.getBoundingClientRect(), bw = Math.min(300, innerWidth - 20);
    bubble.style.width = bw + 'px';
    let x = r.left + r.width / 2 - bw / 2 + scrollX; x = Math.max(10 + scrollX, Math.min(x, scrollX + innerWidth - bw - 10));
    bubble.style.left = x + 'px';
    const above = r.top > 140; bubble.classList.toggle('below', !above);
    bubble.style.top = (above ? r.top + scrollY - 10 : r.bottom + scrollY + 10) + 'px';
    clearTimeout(bt); bt = setTimeout(() => bubble.classList.remove('show'), 4200);
  };
  /* --- barre de niveaux réutilisable --- */
  TS.levels = (host, titles, onGo) => {
    const key = 'tr-lv-' + host.id; let done = []; try { done = JSON.parse(localStorage.getItem(key) || '[]'); } catch (e) {}
    let cur = 0;
    const render = () => { host.innerHTML = titles.map((t, i) => { const open = i === 0 || done.includes(i - 1) || done.includes(i); return `<button class="lvpill ${i === cur ? 'cur' : ''} ${done.includes(i) ? 'done' : ''}" data-i="${i}" ${open ? '' : 'disabled'} title="${t}">${done.includes(i) ? '✓' : i + 1}<span>${t}</span></button>`; }).join(''); };
    host.addEventListener('click', e => { const b = e.target.closest('.lvpill'); if (b && !b.disabled) { cur = +b.dataset.i; render(); onGo(cur); } });
    const api = { go(i) { cur = i; render(); onGo(i); }, done(i) { if (!done.includes(i)) done.push(i); try { localStorage.setItem(key, JSON.stringify(done)); } catch (e) {} render(); }, get cur() { return cur; }, isDone: i => done.includes(i) };
    render(); return api;
  };
  /* --- le fil : du allumé/éteint à la puce --- */
  const STEPS = [
    ['onoff', 'Allumé / éteint', 'Un message peut se réduire à deux états : allumé ou éteint, court ou long.'],
    ['bit', 'Bit', 'Un bit, c\'est une seule réponse : 1 (oui, allumé) ou 0 (non, éteint). 8 bits font une lettre.'],
    ['inter', 'Interrupteur', 'Un interrupteur ouvre ou ferme le chemin du courant : c\'est un bit qu\'on touche du doigt.'],
    ['trans', 'Transistor', 'Un transistor est un interrupteur sans doigt : un petit courant l\'ouvre ou le ferme.'],
    ['porte', 'Porte logique', 'Quelques transistors bien reliés répondent à une question : « A et B? », « A ou B? », « pas A? ».'],
    ['add', 'Additionneur', 'Avec des portes, on additionne des bits : 1 + 1 = 10 en binaire, c\'est 2.'],
    ['puce', 'Puce', 'Une puce, c\'est des milliards de ces portes imprimées sur du silicium.']
  ];
  let got = []; try { got = JSON.parse(localStorage.getItem('tr-path') || '[]'); } catch (e) {}
  const bar = document.createElement('div'); bar.className = 'pathbar'; bar.id = 'pathbar';
  bar.innerHTML = `<div class="pb-steps">${STEPS.map((s, i) => `<span class="pb-step" data-s="${s[0]}"><i>${i + 1}</i><b>${s[1]}</b></span>`).join('<em>→</em>')}</div><p class="pb-line" id="pb-line">Ce que tu viens de comprendre apparaîtra ici. Le chemin : allumé/éteint → bit → interrupteur → transistor → porte → additionneur → puce.</p><button class="pb-toggle" aria-label="Réduire">–</button>`;
  document.body.appendChild(bar); if (innerWidth < 720) bar.classList.add('mini');
  bar.querySelector('.pb-toggle').addEventListener('click', () => bar.classList.toggle('mini'));
  const paint = () => STEPS.forEach(s => bar.querySelector(`[data-s="${s[0]}"]`).classList.toggle('got', got.includes(s[0])));
  window.Path = {
    learn(id, extra) {
      const s = STEPS.find(x => x[0] === id); if (!s) return; const isNew = !got.includes(id);
      if (isNew) { got.push(id); try { localStorage.setItem('tr-path', JSON.stringify(got)); } catch (e) {} }
      paint(); const line = document.getElementById('pb-line');
      line.innerHTML = `<b>Ce que tu viens de comprendre :</b> ${extra || s[2]}`; bar.classList.remove('mini');
      const st = bar.querySelector(`[data-s="${id}"]`); st.classList.remove('pulse'); void st.offsetWidth; st.classList.add('pulse');
      window.__path = got.slice();
      if (innerWidth < 720) { clearTimeout(window.__pbT); window.__pbT = setTimeout(() => bar.classList.add('mini'), 6000); }
    },
    has: id => got.includes(id), reset() { got = []; try { localStorage.removeItem('tr-path'); } catch (e) {} paint(); }
  };
  paint(); window.__path = got.slice();
  // n'afficher la barre que dans les chapitres 2 et 3
  const zone = () => { const a = document.getElementById('communiquer'), z = document.querySelector('.end'); if (!a || !z) return; const y = scrollY + innerHeight / 2; bar.classList.toggle('visible', y > a.offsetTop && y < z.offsetTop + 200); };
  addEventListener('scroll', zone, { passive: true }); zone();
})();

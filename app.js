/* Moteur des jeux d'assemblage : boîte fermée → ouvrir → placer les pièces → tester. */
(() => {
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const NS = 'http://www.w3.org/2000/svg';
const $ = (s, r = document) => r.querySelector(s);
const esc = t => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const say = (t, who) => window.Talk && Talk.speak(t, who);
const WHO = { avant: 'Ti-Jos', gaston: 'Gaston', apres: 'Rosalie', jeu: 'Ti-Jean', narr: '' };
const won = new Set();
const okOf = s => Array.isArray(s.ok) ? s.ok : [s.ok];
const counter = () => { document.querySelectorAll('.won-count').forEach(e => e.textContent = won.size); };
/* mélange stable (même ordre à chaque visite, mais jamais la bonne réponse en premier) */
const shuffle = (a, seed) => { a = a.slice(); let h = seed; for (let i = a.length - 1; i > 0; i--) { h = (h * 9301 + 49297) % 233280; const j = Math.floor(h / 233280 * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const seedOf = id => [...id].reduce((s, c) => s + c.charCodeAt(0), 7);
const thumb = p => `<svg viewBox="${p.vb}" aria-hidden="true" focusable="false"><g class="${p.cls || ''}">${p.svg}</g></svg>`;
const hitOf = s => s.hit || [s.x - s.w / 2, s.y - s.h / 2, s.w, s.h];

function line(el, who, text) {
  el.innerHTML = (WHO[who] ? `<b class="who who-${who}">${WHO[who]} :</b> ` : '') + esc(text);
  el.className = 'dlg dlg-' + who; el.hidden = false;
}

function build(g, host) {
  const art = document.createElement('article'); art.className = 'game'; art.id = 'g-' + g.id; art.dataset.game = g.id;
  const parts = shuffle(g.parts, seedOf(g.id));
  art.innerHTML = `
    <header class="g-head">
      <h3>${esc(g.title)}</h3>
      ${g.today ? `<p class="today"><span>Aujourd'hui :</span> ${g.today.map(t => `<b class="chip">${esc(t)}</b>`).join(' ')}</p><p class="todayline">${esc(g.todayLine)}</p>` : ''}
    </header>
    ${g.closed ? `<div class="closed">
      <div class="box-tag">La boîte fermée</div>
      <svg class="stage-svg" viewBox="0 0 480 300" role="img" aria-label="${esc(g.title)}, fermé">${g.closed.svg}<g class="lock" transform="translate(0 14)"><rect x="420" y="16" width="44" height="34" rx="6" fill="#3a3a3a"/><path d="M430 16 v-8 a12 12 0 0 1 24 0 v8" fill="none" stroke="#3a3a3a" stroke-width="5"/><circle cx="442" cy="33" r="5" fill="#ddd"/></g></svg>
      <p class="dlg dlg-avant"><b class="who who-avant">Ti-Jos :</b> ${esc(g.closed.say)}</p>
      <button class="btn open-btn" type="button">Ouvrir la boîte</button>
    </div>` : ''}
    <div class="open"${g.closed ? ' hidden' : ''}>
      <div class="box-tag open-tag">La boîte ouverte</div>
      <p class="g-intro">${esc(g.intro)}</p>
      <div class="stage-wrap"><svg class="stage-svg stage" viewBox="0 0 480 300" role="group" aria-label="Plan de montage : ${esc(g.title)}">
        <g class="content ${g.onCls || ''}"><g class="base">${g.base}</g><g class="zones"></g><g class="placed"></g></g><g class="hits"></g></svg></div>
      <p class="dlg" aria-live="polite" hidden></p>
      <p class="hint">Touche une pièce, puis touche sa place. Ou glisse-la. Touche une pièce placée pour la reprendre.</p>
      <div class="tray" role="list" aria-label="Pièces">${parts.map(p => `<button type="button" class="part" role="listitem" data-part="${p.id}" aria-pressed="false">${thumb(p)}<span>${esc(p.name)}</span></button>`).join('')}</div>
      <div class="ctrl"><button type="button" class="btn test-btn">Tester</button> <button type="button" class="btn ghost reset-btn">Recommencer</button></div>
      <ol class="steps">${g.steps.map(s => `<li>${esc(s)}</li>`).join('')}</ol>
      ${g.fact ? `<aside class="fact"><b>Vrai de vrai :</b> ${esc(g.fact.t)} <a href="${esc(g.fact.url)}" target="_blank" rel="noopener">Source : ${esc(g.fact.src)}</a></aside>` : ''}
    </div>`;
  host.appendChild(art);
  const svg = $('.stage', art), zones = $('.zones', art), placedG = $('.placed', art), hits = $('.hits', art), dlg = $('.open .dlg', art);
  const state = {}; let sel = null, busy = false;
  const P = id => g.parts.find(p => p.id === id);
  const order = s => s.under ? 0 : s.top ? 2 : 1;
  // zones (contours pointillés) et cibles
  g.slots.forEach((s, i) => {
    const z = document.createElementNS(NS, 'rect');
    Object.entries({ x: s.x - s.w / 2, y: s.y - s.h / 2, width: s.w, height: s.h, rx: 8, class: 'zone', 'data-slot': s.id }).forEach(([k, v]) => z.setAttribute(k, v));
    zones.appendChild(z);
    const [hx, hy, hw, hh] = hitOf(s), h = document.createElementNS(NS, 'g');
    h.setAttribute('class', 'hit' + (s.hit ? ' pad' : '')); h.dataset.slot = s.id; h.setAttribute('tabindex', '0'); h.setAttribute('role', 'button'); h.setAttribute('aria-label', 'Place ' + s.label.replace(/^[^ ]+ /, ''));
    h.innerHTML = `<rect x="${hx}" y="${hy}" width="${hw}" height="${hh}" rx="8"/><text x="${hx + hw / 2}" y="${s.hit ? hy + hh / 2 + 4 : hy + 14}" text-anchor="middle">${esc(s.label)}</text>`;
    hits.appendChild(h);
  });
  const redraw = () => {
    placedG.innerHTML = '';
    g.slots.slice().sort((a, b) => order(a) - order(b)).forEach(s => {
      const pid = state[s.id]; const hit = hits.querySelector(`[data-slot="${s.id}"]`);
      hit.classList.toggle('filled', !!pid);
      hit.setAttribute('aria-label', (pid ? P(pid).name + ' placé ici : ' : 'Place vide : ') + s.label.replace(/^[^ ]+ /, ''));
      if (!pid) return; const p = P(pid);
      const gg = document.createElementNS(NS, 'g'); gg.setAttribute('transform', `translate(${s.x} ${s.y})`); gg.setAttribute('class', 'pp'); gg.dataset.slot = s.id; gg.innerHTML = `<g class="${p.cls || ''}">${p.svg}</g>`; placedG.appendChild(gg);
    });
    art.querySelectorAll('.part').forEach(b => { const used = Object.values(state).includes(b.dataset.part); b.classList.toggle('used', used); b.disabled = used; });
  };
  const clearMarks = () => { art.classList.remove('is-on'); svg.classList.remove('on'); hits.querySelectorAll('.hit').forEach(h => h.classList.remove('bad', 'good', 'pulse')); art.querySelectorAll('.steps li').forEach(l => l.classList.remove('lit')); };
  const select = id => { sel = sel === id ? null : id; art.querySelectorAll('.part').forEach(b => b.setAttribute('aria-pressed', b.dataset.part === sel)); svg.classList.toggle('choosing', !!sel); if (sel) TS.blip(2); };
  const place = (sid, pid) => { if (busy) return; clearMarks(); Object.keys(state).forEach(k => { if (state[k] === pid) delete state[k]; }); state[sid] = pid; sel = null; select(null); TS.click(); redraw(); };
  const tapSlot = sid => {
    if (busy) return;
    if (sel) return place(sid, sel);
    if (state[sid]) { clearMarks(); delete state[sid]; TS.blip(0); redraw(); }
  };
  hits.addEventListener('click', e => { const h = e.target.closest('.hit'); if (h) tapSlot(h.dataset.slot); });
  hits.addEventListener('keydown', e => { const h = e.target.closest('.hit'); if (h && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); tapSlot(h.dataset.slot); } });
  art.querySelectorAll('.part').forEach(b => TS.pickable(b, {
    onSelect: () => { if (!busy) select(b.dataset.part); },
    onDrop: (x, y) => { const el = document.elementFromPoint(x, y), h = el && el.closest && el.closest('.hit'); if (h && art.contains(h)) place(h.dataset.slot, b.dataset.part); }
  }));
  art.querySelectorAll('.part').forEach(b => b.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (!busy) { select(b.dataset.part); if (sel) hits.querySelector('.hit:not(.filled)')?.focus(); } } }));
  const wait = ms => new Promise(r => setTimeout(r, RM ? Math.min(ms, 80) : ms));
  $('.test-btn', art).addEventListener('click', async () => {
    if (busy) return; busy = true; clearMarks(); dlg.hidden = true; art.dataset.result = 'testing';
    for (const s of g.slots) {
      const h = hits.querySelector(`[data-slot="${s.id}"]`); h.classList.add('pulse'); TS.blip(g.slots.indexOf(s)); await wait(380); h.classList.remove('pulse');
      const pid = state[s.id];
      if (!pid || !okOf(s).includes(pid)) {
        const p = pid && P(pid), msg = !pid ? s.missing : ((p.whyAt && p.whyAt[s.id]) || p.why || s.wrong);
        h.classList.add('bad'); TS.wrong(); line(dlg, 'gaston', msg); say(msg, 'gaston');
        art.dataset.result = 'fail'; art.dataset.failSlot = s.id; busy = false; return;
      }
      h.classList.add('good');
    }
    svg.classList.add('on'); art.classList.add('is-on'); art.dataset.result = 'win'; delete art.dataset.failSlot;
    TS.win(); TS.confetti(svg); const who = g.winWho || 'apres'; line(dlg, who, g.win); say(g.win, who);
    if (!won.has(g.id)) { won.add(g.id); counter(); }
    const lis = art.querySelectorAll('.steps li');
    for (const l of lis) { l.classList.add('lit'); await wait(900); }
    busy = false;
  });
  $('.reset-btn', art).addEventListener('click', () => { if (busy) return; Object.keys(state).forEach(k => delete state[k]); clearMarks(); dlg.hidden = true; delete art.dataset.result; select(null); redraw(); });
  const ob = $('.open-btn', art);
  if (ob) ob.addEventListener('click', () => { TS.click(); art.classList.add('opened'); $('.open', art).hidden = false; $('.closed', art).classList.add('was'); ob.hidden = true; $('.open', art).scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: 'start' }); });
  if (g.closed) $('.closed .dlg', art).addEventListener('click', () => say(g.closed.say, 'avant'));
  if (ob) ob.addEventListener('click', () => say(g.closed.say, 'avant'), { once: true });
  redraw();
}

/* Rendu complet d'un appareil (pour la radiographie de « Regarde autour de toi ») */
window.assembled = g => g.base + g.slots.slice().sort((a, b) => (a.under ? 0 : a.top ? 2 : 1) - (b.under ? 0 : b.top ? 2 : 1)).map(s => { const p = g.parts.find(q => q.id === okOf(s)[0]); return `<g transform="translate(${s.x} ${s.y})"><g class="${p.cls || ''}">${p.svg}</g></g>`; }).join('');

document.querySelectorAll('.games').forEach(host => { const lv = +host.dataset.level; GAMES.filter(g => g.level === lv).forEach(g => build(g, host)); });
document.querySelectorAll('.won-total').forEach(e => e.textContent = GAMES.length);
counter();
})();

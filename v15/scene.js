/* « Regarde autour de toi » : une pièce ordinaire. Touche un objet pour voir la mécanique cachée dedans. */
(() => {
const INSIDE = {
  clavier: 'deux leviers croisés et un ressort, sous chaque touche', telephone: 'des milliards de leviers électriques, et une petite roue qui vibre',
  montre: 'un ressort, des roues dentées et un balancier', transistor: 'un levier électrique : un petit courant en commande un grand',
  disque: 'une roue qui tourne très vite et un levier qui lit', drone: 'des roues sur des billes, poussées par des aimants',
  imprimante: 'des engrenages, une courroie à dents et une vis', robot: 'des leviers, des moteurs et des engrenages à chaque articulation',
  gachette: 'un levier qui pousse un piston', lavevaisselle: 'un moteur, une roue à aubes et un bras qui tourne tout seul',
  frein: 'deux leviers en chaîne et un câble', transmission: 'un petit engrenage qui en fait tourner un grand', auto: 'toute la chaîne : pile, moteur, engrenages, roues'
};
// [id, x, y, largeur] dans une pièce de 1200 × 700 (chaque objet garde les proportions 480 × 300 de son dessin)
const SPOTS = [['transmission', 52, 70, 336], ['auto', 980, 360, 190], ['drone', 470, 70, 200], ['imprimante', 760, 40, 170], ['robot', 545, 245, 150],
  ['clavier', 50, 345, 250], ['transistor', 300, 398, 90], ['telephone', 352, 374, 110], ['montre', 270, 430, 100], ['disque', 95, 470, 120],
  ['gachette', 700, 340, 130], ['lavevaisselle', 760, 395, 230], ['frein', 380, 470, 280]];
const host = document.getElementById('room'); if (!host) return;
const G = id => GAMES.find(g => g.id === id);
let svg = `<svg viewBox="0 0 1200 700" class="room-svg" role="group" aria-label="Une pièce de la maison">
 <rect width="1200" height="540" fill="url(#gWall)"/><rect y="540" width="1200" height="160" fill="url(#gFloor)"/><rect y="534" width="1200" height="8" fill="#d7c8b0"/>
 <rect x="40" y="58" width="360" height="236" rx="6" fill="url(#gSky)" stroke="#f4efe6" stroke-width="10"/><line x1="220" y1="58" x2="220" y2="294" stroke="#f4efe6" stroke-width="6"/>
 <rect x="960" y="110" width="220" height="430" fill="url(#gSky)" stroke="#f4efe6" stroke-width="10"/><rect x="960" y="440" width="220" height="100" fill="url(#gGrass)"/>
 <rect x="460" y="190" width="490" height="12" fill="url(#gWoodD)"/><rect x="740" y="160" width="200" height="10" fill="url(#gWoodD)"/>
 <rect x="545" y="245" width="150" height="94" fill="#fff" stroke="#6b4a24" stroke-width="6"/><text x="620" y="352" text-anchor="middle" font-size="13" fill="#6b645a">Affiche : l'usine de mon oncle</text>
 <rect x="30" y="440" width="420" height="16" rx="3" fill="url(#gWood)"/><rect x="50" y="456" width="14" height="84" fill="url(#gWoodD)"/><rect x="416" y="456" width="14" height="84" fill="url(#gWoodD)"/>
 <rect x="690" y="410" width="270" height="130" fill="url(#gWoodD)"/><rect x="680" y="396" width="290" height="16" rx="3" fill="url(#gAlu)"/>`;
SPOTS.forEach(([id, x, y, w]) => { const g = G(id); if (!g) return; const h = w * 300 / 480;
  svg += `<g class="spot" data-id="${id}" tabindex="0" role="button" aria-label="${g.title}, regarder dedans"><svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="0 0 480 300" overflow="hidden"><g class="shell">${g.closed.svg}</g><g class="inside"><rect width="480" height="300" rx="16" fill="#eef4fb"/>${assembled(g)}<rect width="480" height="300" fill="rgba(40,120,200,.12)"/></g></svg><rect class="spot-hit" x="${x}" y="${y}" width="${w}" height="${h}" rx="10"/></g>`; });
svg += '</svg>';
host.innerHTML = svg;
const cap = document.getElementById('room-cap'), cnt = document.getElementById('room-found'), seen = new Set();
document.getElementById('room-total').textContent = SPOTS.length;
const look = el => { const id = el.dataset.id, g = G(id); host.querySelectorAll('.spot.xray').forEach(s => s !== el && (s.classList.remove('xray'), s.querySelector('svg').classList.remove('on'))); el.classList.toggle('xray'); el.querySelector('svg').classList.toggle('on', el.classList.contains('xray'));
  if (!el.classList.contains('xray')) return; TS.blip(3); seen.add(id); el.classList.add('seen'); cnt.textContent = seen.size;
  cap.innerHTML = `<b>${g.title}</b> : dedans, il y a ${INSIDE[id]}. <a href="#g-${id}" class="go">Monte-le toi-même →</a>`;
  if (seen.size === SPOTS.length) { TS.win(); cap.innerHTML += '<br><b>Tu as tout regardé. Partout, la même chaîne : une chose appuie sur une autre.</b>'; } };
host.addEventListener('click', e => { const s = e.target.closest('.spot'); if (s) look(s); });
host.addEventListener('keydown', e => { const s = e.target.closest('.spot'); if (s && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); look(s); } });
cap.addEventListener('click', e => { const a = e.target.closest('a.go'); if (!a) return; const art = document.querySelector(a.getAttribute('href')); const b = art && art.querySelector('.open-btn'); if (b && !b.hidden) setTimeout(() => b.click(), 50); });
})();

/* Les jeux d'assemblage — partie 1 : le principe, le levier, la roue. Coordonnées : scène 480 × 300. */
window.GAMES = window.GAMES || [];
(() => {
const { gear, spring, screw, label, bolt } = D;
const TABLE = '<rect x="0" y="262" width="480" height="38" fill="url(#gWood)"/><rect x="0" y="262" width="480" height="3" fill="rgba(0,0,0,.18)"/>';
const FINGER = (x, y, cls = 'a-press') => `<g class="${cls}"><path d="M${x - 16} ${y - 120} q-2 60 2 98 q2 22 14 22 q12 0 14 -22 q4 -38 2 -98z" fill="url(#gSkin)" stroke="#a8745a" stroke-width="1.2"/><path d="M${x - 9} ${y - 18} q9 6 18 0" fill="none" stroke="#c99a7e" stroke-width="1.2"/><ellipse cx="${x}" cy="${y - 12}" rx="8" ry="6" fill="#f3d5c4" opacity=".7"/></g>`;

/* ---------- 0. LE PRINCIPE : assembler la chaîne nue ---------- */
GAMES.push({
  id: 'principe', level: 0, title: 'Une chose appuie sur une autre',
  intro: 'Ton doigt appuie. Place les pièces pour que la poussée voyage jusqu\'au drapeau.',
  base: TABLE
    + '<rect x="88" y="214" width="20" height="48" fill="url(#gWoodD)"/><path d="M98 196 l-14 20 h28z" fill="url(#gSteel)" stroke="#555"/>'
    + '<rect x="262" y="160" width="8" height="102" fill="url(#gSteelV)"/><rect x="330" y="150" width="8" height="112" fill="url(#gSteelV)"/>'
    + '<rect x="430" y="40" width="7" height="222" fill="url(#gSteelV)"/><circle cx="433" cy="38" r="5" fill="url(#gSteel)"/>'
    + '<g class="a-flag"><path d="M437 210 h34 l-8 11 l8 11 h-34z" fill="url(#gRed)" stroke="#8a2a10"/></g>'
    + '<path class="cord" d="M352 150 Q400 60 433 40 V210" fill="none" stroke="#8b6b3c" stroke-width="2"/>'
    + FINGER(62, 168),
  slots: [
    { id: 's1', x: 120, y: 190, w: 170, h: 54, label: '① ce qui bascule', ok: 'levier', missing: 'Le doigt appuie dans le vide : rien ne transmet la poussée.', wrong: 'Ici, il faut une barre rigide qui bascule sur le pivot. Sinon la poussée du doigt ne va nulle part.' },
    { id: 's2', x: 266, y: 150, w: 92, h: 92, label: '② ce qui tourne', ok: 'roue', missing: 'Le levier bascule, mais il ne touche rien : la poussée s\'arrête là.', wrong: 'Le bout du levier doit pousser le picot d\'une roue qui tourne sur l\'axe.' },
    { id: 's3', x: 334, y: 150, w: 70, h: 92, label: '③ ce qui transmet', ok: 'engrenage', missing: 'La roue tourne toute seule, mais rien n\'enroule la corde du drapeau.', wrong: 'Il faut des dents qui s\'emboîtent dans la petite roue dentée, sinon ça glisse.' }
  ],
  parts: [
    { id: 'levier', name: 'Levier', vb: '-90 -30 180 60', svg: '<g class="a-tilt" style="transform-origin:-22px 0"><rect x="-86" y="-7" width="172" height="13" rx="3" fill="url(#gWood)" stroke="#6b4a24"/><rect x="74" y="-22" width="8" height="18" fill="url(#gSteel)"/></g>' },
    { id: 'roue', name: 'Roue', vb: '-46 -46 92 92', svg: '<g class="a-spin">' + '<circle r="38" fill="url(#gWood)" stroke="#6b4a24" stroke-width="2"/><circle r="31" fill="none" stroke="rgba(0,0,0,.2)"/>' + [0, 45, 90, 135].map(t => `<rect x="-30" y="-3" width="60" height="6" fill="url(#gWoodD)" transform="rotate(${t})"/>`).join('') + '<circle cx="-24" cy="26" r="5" fill="url(#gSteel)" stroke="#444"/></g>' + gear(13, 10, { cls: 'a-spin', fill: 'gSteel', stroke: '#555' }) },
    { id: 'engrenage', name: 'Engrenage', vb: '-40 -40 80 80', svg: `<g transform="translate(0 0)">${gear(30, 22, { cls: 'a-spin-rev' })}</g><circle r="9" fill="url(#gSteel)" stroke="#555"/>` },
    { id: 'corde', name: 'Corde molle', vb: '-80 -30 160 60', svg: '<path d="M-80 0 C-40 30 -10 -26 30 10 S70 -10 80 6" fill="none" stroke="#a0814f" stroke-width="5" stroke-linecap="round"/>', why: 'Une corde molle ne pousse pas : quand le doigt appuie, elle plie. Une corde peut tirer, jamais pousser.' }
  ],
  steps: ['Le doigt appuie sur un bout du levier.', 'Le levier bascule sur son pivot : l\'autre bout monte et pousse le picot de la roue.', 'La roue tourne, et sa petite roue dentée fait tourner la grande.', 'La grande roue enroule la corde : le drapeau monte.'],
  win: 'Tu viens de faire voyager une poussée. C\'est tout le secret : une chose appuie sur une autre.',
  winWho: 'apres'
});

/* ---------- 1. LE LEVIER ---------- */
const KEY_BASE = '<rect x="20" y="226" width="440" height="36" rx="6" fill="url(#gAlu)" stroke="#8b9097"/>'
  + '<rect x="60" y="232" width="360" height="10" fill="url(#gPcb)"/>' + [80, 140, 200, 260, 320, 380].map(x => `<rect x="${x}" y="235" width="22" height="3" fill="url(#gCopper)"/>`).join('')
  + '<rect x="300" y="30" width="160" height="80" rx="8" fill="#16191d" stroke="#444"/><rect x="308" y="38" width="144" height="64" rx="4" fill="url(#gScreen)"/>'
  + '<text x="330" y="82" class="out" font-family="Georgia,serif" font-size="34" fill="#e8f2ff">A<tspan class="caret">|</tspan></text>'
  + FINGER(160, 92);
GAMES.push({
  id: 'clavier', level: 1, title: 'La touche de clavier', today: ['ordinateur portable', 'télécommande', 'manette de jeu'],
  todayLine: 'Chaque touche de ton portable cache deux petits leviers croisés.',
  closed: { svg: '<rect x="20" y="150" width="440" height="112" rx="10" fill="url(#gAlu)" stroke="#8b9097"/>' + Array.from({ length: 24 }, (_, i) => `<rect x="${36 + (i % 12) * 35}" y="${168 + Math.floor(i / 12) * 40}" width="30" height="30" rx="4" fill="url(#gPlB)"/>`).join(''), say: 'Mon clavier marche, mais je sais pas ce qu\'il y a sous les touches.' },
  intro: 'Monte une touche de portable, de haut en bas.',
  base: KEY_BASE,
  slots: [
    { id: 'cap', x: 160, y: 120, w: 150, h: 40, label: '① le dessus', ok: 'capuchon', missing: 'Il n\'y a rien sous le doigt : il touche directement le mécanisme.', wrong: 'Le doigt a besoin d\'une surface large et ferme sur le dessus.' },
    { id: 'sc', x: 160, y: 168, w: 150, h: 44, label: '② les leviers croisés', ok: 'ciseaux', missing: 'Sans les leviers croisés, la touche penche quand tu appuies sur un coin : elle accroche.', wrong: 'Ici, il faut deux leviers en X qui gardent la touche bien droite.' },
    { id: 'dome', x: 160, y: 208, w: 70, h: 34, label: '③ le ressort', ok: 'dome', missing: 'Sans dôme, la touche reste enfoncée : rien ne la fait remonter.', wrong: 'Il faut un petit dôme souple qui s\'écrase puis remonte.' }
  ],
  parts: [
    { id: 'capuchon', name: 'Capuchon', vb: '-75 -20 150 40', svg: '<rect x="-70" y="-14" width="140" height="26" rx="5" fill="url(#gPlB)" stroke="#111"/><rect x="-62" y="-10" width="124" height="6" rx="3" fill="rgba(255,255,255,.12)"/><text x="0" y="6" text-anchor="middle" font-size="14" fill="#e8e8e8" font-family="system-ui">A</text>' , cls: 'a-press' },
    { id: 'ciseaux', name: 'Leviers en ciseaux', vb: '-75 -22 150 44', svg: '<g class="a-scissor"><line x1="-60" y1="-14" x2="60" y2="14" stroke="url(#gPlW)" stroke-width="7" stroke-linecap="round"/><line x1="-60" y1="14" x2="60" y2="-14" stroke="#d6d9de" stroke-width="7" stroke-linecap="round"/><circle r="5" fill="url(#gSteel)" stroke="#666"/></g>' },
    { id: 'dome', name: 'Dôme de caoutchouc', vb: '-35 -17 70 34', svg: '<g class="a-squash"><path d="M-30 14 q4 -26 30 -28 q26 2 30 28z" fill="url(#gRubberT)" stroke="#5a6a5a"/><rect x="-5" y="4" width="10" height="8" rx="2" fill="#333"/></g>' },
    { id: 'ressortstylo', name: 'Ressort de stylo', vb: '-35 -20 70 40', svg: spring(-28, 14, 56, 26, 9), why: 'Un ressort de stylo est bien trop haut pour un portable mince, et il ne ferme aucun contact : l\'ordinateur ne voit rien.' }
  ],
  steps: ['Le doigt appuie sur le capuchon.', 'Les deux leviers en X se replient ensemble : la touche descend bien droite, même si tu appuies sur un coin.', 'Le dôme s\'écrase et pousse la membrane : deux pistes de cuivre se touchent, le courant passe.', 'L\'ordinateur voit le contact : la lettre s\'affiche. Tu lâches, le dôme remonte.'],
  win: 'Deux petits leviers et un dôme : tu sais maintenant ce qu\'il y a sous chaque touche. Montre-le à quelqu\'un.',
  fact: { t: 'Dans la plupart des claviers de portable, un dôme de silicone s\'écrase sous la touche et fait toucher deux couches d\'une membrane imprimée de pistes conductrices; les leviers en ciseaux gardent la touche à plat.', src: 'Ars Technica (2024) – guide des claviers', url: 'https://arstechnica.com/gadgets/2024/03/the-ars-technica-guide-to-keyboards-mechanical-membrane-and-buckling-springs/' }
});

GAMES.push({
  id: 'frein', level: 1, title: 'Le frein de vélo', today: ['vélo', 'trottinette', 'vélo électrique'],
  todayLine: 'Ta main serre un levier; un autre levier pince la roue.',
  closed: { svg: '<circle cx="110" cy="205" r="72" fill="none" stroke="url(#gTire)" stroke-width="10"/><circle cx="110" cy="205" r="64" fill="none" stroke="url(#gAlu)" stroke-width="4"/><circle cx="110" cy="205" r="6" fill="url(#gSteel)"/><circle cx="370" cy="205" r="72" fill="none" stroke="url(#gTire)" stroke-width="10"/><circle cx="370" cy="205" r="64" fill="none" stroke="url(#gAlu)" stroke-width="4"/><circle cx="370" cy="205" r="6" fill="url(#gSteel)"/><path d="M110 205 L200 110 L235 205 Z M200 110 L330 104 L235 205 M330 104 L370 205" fill="none" stroke="#c4521c" stroke-width="9" stroke-linejoin="round" stroke-linecap="round"/><rect x="180" y="92" width="44" height="12" rx="6" fill="url(#gPlB)"/><path d="M330 104 L322 72" stroke="#555" stroke-width="7"/><rect x="300" y="64" width="60" height="12" rx="6" fill="url(#gPlB)"/><circle cx="235" cy="205" r="14" fill="url(#gSteel)" stroke="#555"/>', say: 'Je serre, ça arrête. Comment? Aucune idée.' },
  intro: 'Assemble le frein, de la main jusqu\'à la roue. Attention où se trouve le pivot.',
  base: '<rect x="40" y="66" width="150" height="16" rx="8" fill="url(#gPlB)"/><circle cx="96" cy="74" r="5" fill="url(#gSteel)"/>'
    + '<g class="a-wheel"><circle cx="350" cy="180" r="100" fill="none" stroke="url(#gTire)" stroke-width="16"/><circle cx="350" cy="180" r="90" fill="none" stroke="url(#gAlu)" stroke-width="7"/>' + Array.from({ length: 16 }, (_, i) => `<line x1="350" y1="180" x2="${350 + 86 * Math.cos(i * Math.PI / 8)}" y2="${180 + 86 * Math.sin(i * Math.PI / 8)}" stroke="#b8bec6" stroke-width="1.2"/>`).join('') + '<circle cx="350" cy="180" r="10" fill="url(#gSteel)" stroke="#555"/></g>'
    + '<rect x="342" y="40" width="16" height="44" fill="url(#gSteelV)"/>'
    + '<text x="350" y="296" class="out lbl" text-anchor="middle">La roue s\'arrête.</text>',
  slots: [
    { id: 'lev', x: 110, y: 104, w: 150, h: 50, label: '① la main serre', ok: 'levierbon', missing: 'Ta main serre le guidon, mais il n\'y a pas de levier : rien ne tire.', wrong: 'Ici, il faut le levier de frein du guidon.' },
    { id: 'cab', x: 250, y: 80, w: 140, h: 40, label: '② ce qui tire', ok: 'cable', missing: 'Le levier bouge, mais rien ne relie la main au frein.', wrong: 'Il faut un câble d\'acier dans sa gaine : il tire sans s\'étirer.' },
    { id: 'etr', x: 350, y: 96, w: 110, h: 50, label: '③ ce qui pince', ok: 'etrier', missing: 'Le câble tire dans le vide : il faut des bras qui pincent la roue.', wrong: 'Ici, il faut l\'étrier : deux bras qui pivotent et se referment.' }
  ],
  parts: [
    { id: 'levierbon', name: 'Levier (pivot près du câble)', vb: '-75 -25 150 50', svg: '<g class="a-squeeze" style="transform-origin:-55px -6px"><path d="M-60 -10 L60 6 q8 2 6 10 L-58 4z" fill="url(#gAlu)" stroke="#6f757d"/></g><circle cx="-55" cy="-6" r="6" fill="url(#gSteel)" stroke="#444"/><circle cx="-44" cy="-4" r="3" fill="#222"/>' },
    { id: 'levierpas', name: 'Levier (pivot au bout)', vb: '-75 -25 150 50', svg: '<path d="M-60 -10 L60 6 q8 2 6 10 L-58 4z" fill="url(#gAlu)" stroke="#6f757d"/><circle cx="58" cy="10" r="6" fill="url(#gSteel)" stroke="#444"/><circle cx="-50" cy="-5" r="3" fill="#222"/>', whyAt: { lev: 'Avec le pivot au mauvais bout, le câble est accroché loin du pivot : il bouge beaucoup, mais sans force. La roue ralentit à peine.' }, why: 'Ce levier n\'a pas sa place ici.' },
    { id: 'cable', name: 'Câble d\'acier', vb: '-70 -20 140 40', svg: '<path d="M-66 10 C-20 -20 20 -20 66 6" fill="none" stroke="#2a2a2a" stroke-width="6" stroke-linecap="round"/><path d="M-66 10 C-20 -20 20 -20 66 6" fill="none" stroke="url(#gSteel)" stroke-width="2"/>' },
    { id: 'etrier', name: 'Étrier et patins', vb: '-55 -25 110 50', svg: '<g class="a-pinchL" style="transform-origin:-8px -18px"><path d="M-8 -18 L-40 10 L-36 20 L-30 20 L-2 -12z" fill="url(#gSteel)" stroke="#555"/><rect x="-46" y="14" width="14" height="10" rx="2" fill="url(#gRubber)"/></g><g class="a-pinchR" style="transform-origin:8px -18px"><path d="M8 -18 L40 10 L36 20 L30 20 L2 -12z" fill="url(#gSteel)" stroke="#555"/><rect x="32" y="14" width="14" height="10" rx="2" fill="url(#gRubber)"/></g><circle cy="-18" r="5" fill="url(#gSteel)" stroke="#444"/>' },
    { id: 'elastique', name: 'Élastique', vb: '-70 -20 140 40', svg: '<path d="M-66 6 C-20 -18 20 18 66 0" fill="none" stroke="#c9a227" stroke-width="5" stroke-linecap="round"/>', why: 'Un élastique s\'étire au lieu de tirer : ta main serre, il s\'allonge, et le frein ne bouge presque pas.' }
  ],
  steps: ['Ta main serre le levier. Elle est loin du pivot : peu d\'effort, beaucoup de force près du pivot.', 'Le levier tire le câble d\'acier, qui ne s\'étire pas.', 'Le câble tire les deux bras de l\'étrier : ce sont deux autres leviers.', 'Les patins de caoutchouc pincent la jante : le frottement arrête la roue.'],
  win: 'Deux leviers en chaîne, et ta main arrête un vélo lancé. Tu pourras régler ton frein toi-même.',
  fact: { t: 'Sur un frein à câble, la force est multipliée deux fois : par le levier du guidon (souvent environ 2 à 4 fois, selon le modèle) puis par les bras de l\'étrier. Plus le câble est accroché près du pivot, plus il tire fort, mais moins il bouge.', src: 'Sheldon Brown – Brakes (Jobst Brandt)', url: 'https://www.sheldonbrown.com/brandt/brakes.html' }
});

GAMES.push({
  id: 'gachette', level: 1, title: 'La gâchette du pulvérisateur', today: ['vaporisateur de nettoyant', 'pistolet d\'arrosage', 'gâchette de perceuse'],
  todayLine: 'La gâchette est un levier qui pousse un petit piston.',
  closed: { svg: '<path d="M200 120 h80 l10 30 v110 q0 10 -10 10 h-80 q-10 0 -10 -10 v-110z" fill="url(#gBottle)" stroke="#5a8ab0"/><path d="M190 70 h110 v40 h-110z" fill="url(#gPlW)" stroke="#999"/><path d="M200 108 q-20 30 0 50" fill="none" stroke="url(#gPlW)" stroke-width="12"/>', say: 'Je pèse sur la gâchette, pis ça fait un nuage. C\'est magique.' },
  intro: 'Monte la pompe : de la gâchette jusqu\'à la buse.',
  base: '<path d="M210 130 h90 l12 30 v96 q0 12 -12 12 h-90 q-12 0 -12 -12 v-96z" fill="url(#gBottle)" stroke="#5a8ab0"/><rect x="200" y="200" width="112" height="66" fill="rgba(80,160,220,.35)"/>'
    + '<path d="M180 64 h150 l14 24 v26 h-164z" fill="url(#gPlW)" stroke="#a0a6ad"/>'
    + '<g class="out a-mist">' + Array.from({ length: 14 }, (_, i) => `<circle cx="${110 - (i % 5) * 16}" cy="${72 + ((i * 7) % 30) - 15}" r="${2 + (i % 3)}" fill="#8cc6ef" opacity=".8"/>`).join('') + '</g>'
    + '<path d="M300 222 q-20 10 -10 30" fill="none" stroke="#5a8ab0" stroke-width="1" opacity=".5"/>',
  slots: [
    { id: 'gach', x: 240, y: 140, w: 70, h: 70, label: '① le doigt tire', ok: 'gachette', missing: 'Il n\'y a rien sous le doigt pour actionner la pompe.', wrong: 'Ici, il faut la gâchette : un levier qui pivote sous la tête.' },
    { id: 'pist', x: 280, y: 92, w: 80, h: 34, label: '② ce qui pousse', ok: 'piston', missing: 'La gâchette bouge, mais il n\'y a pas de piston à pousser.', wrong: 'Il faut un piston dans son cylindre, avec un ressort qui le ramène.' },
    { id: 'tube', x: 262, y: 200, w: 40, h: 120, label: '③ ce qui aspire', ok: 'tubelong', missing: 'Rien ne va chercher le liquide au fond : la pompe aspire de l\'air.', wrong: 'Il faut un tube qui descend jusqu\'au liquide.' },
    { id: 'buse', x: 172, y: 76, w: 40, h: 34, label: '④ la sortie', ok: 'buse', missing: 'Le liquide sort en gros jet par le trou : pas de bruine.', wrong: 'Il faut une buse avec un tout petit trou.' }
  ],
  parts: [
    { id: 'gachette', name: 'Gâchette (levier)', vb: '-35 -35 70 70', svg: '<g class="a-trigger" style="transform-origin:-10px -30px"><path d="M-14 -30 h18 q4 30 -6 62 q-4 6 -10 2 q4 -30 -2 -64z" fill="url(#gPlR)" stroke="#8a2a10"/></g><circle cx="-10" cy="-30" r="4" fill="url(#gSteel)"/>' },
    { id: 'piston', name: 'Piston et ressort', vb: '-40 -17 80 34', svg: '<rect x="-38" y="-12" width="60" height="24" rx="4" fill="url(#gGlass)" stroke="#888"/><g class="a-pump"><rect x="-34" y="-8" width="20" height="16" rx="2" fill="url(#gPlB)"/></g>' + spring(-12, 8, 30, 14, 6) },
    { id: 'tubelong', name: 'Tube jusqu\'au fond', vb: '-20 -60 40 120', svg: '<rect x="-3" y="-58" width="6" height="116" rx="3" fill="url(#gGlass)" stroke="#9aa"/><circle cy="-50" r="5" fill="url(#gPlW)" stroke="#888"/>' },
    { id: 'tubecourt', name: 'Tube court', vb: '-20 -60 40 120', svg: '<rect x="-3" y="-58" width="6" height="50" rx="3" fill="url(#gGlass)" stroke="#9aa"/><circle cy="-50" r="5" fill="url(#gPlW)" stroke="#888"/>', why: 'Le tube s\'arrête au-dessus du liquide : le piston aspire de l\'air et rien ne sort.' },
    { id: 'buse', name: 'Buse', vb: '-20 -17 40 34', svg: '<path d="M14 -12 h-20 l-10 6 v12 l10 6 h20z" fill="url(#gPlW)" stroke="#888"/><circle cx="-16" cy="0" r="1.6" fill="#333"/>' }
  ],
  steps: ['Ton doigt tire la gâchette : c\'est un levier qui pivote juste sous la tête.', 'La gâchette pousse le piston dans son cylindre : le liquide est chassé vers l\'avant.', 'Tu lâches : le ressort ramène le piston, qui aspire du liquide par le tube.', 'Poussé par le minuscule trou de la buse, le liquide éclate en fines gouttelettes.'],
  win: 'Un levier, un piston, deux petites valves : tu sais ce qu\'il y a dans la tête d\'un vaporisateur. Passe-le.',
  fact: { t: 'Un vaporisateur à gâchette est une petite pompe à piston : deux valves anti-retour laissent passer le liquide dans un seul sens, et le ressort ramène le piston pour aspirer à nouveau.', src: 'HowStuffWorks – How do spray bottles pump fluid?', url: 'https://home.howstuffworks.com/question673.htm' }
});

/* ---------- 2. LA ROUE ---------- */
GAMES.push({
  id: 'disque', level: 2, title: 'Le disque dur', today: ['ordinateur', 'serveur d\'un centre de données', 'console de jeu'],
  todayLine: 'Un disque qui tourne très vite, et un levier qui lit sans toucher.',
  closed: { svg: '<rect x="90" y="40" width="300" height="220" rx="10" fill="url(#gAlu)" stroke="#8b9097"/>' + [[104, 54], [376, 54], [104, 246], [376, 246]].map(([x, y]) => screw(x, y, 5)).join('') + '<rect x="150" y="200" width="180" height="34" rx="3" fill="#fff" stroke="#ccc"/><text x="240" y="222" text-anchor="middle" font-size="12" fill="#555">NE PAS OUVRIR</text>', say: 'C\'est une boîte de métal fermée. On m\'a dit de jamais l\'ouvrir.' },
  intro: 'Assemble le disque dur. Ici, la boîte fermée a une vraie raison : trouve laquelle.',
  base: '<rect x="70" y="30" width="340" height="250" rx="12" fill="url(#gAluD)" stroke="#6f757d"/>',
  slots: [
    { id: 'mot', x: 210, y: 150, w: 70, h: 70, label: '① ce qui fait tourner', ok: 'moteur', missing: 'Rien ne fait tourner le plateau.', wrong: 'Ici, il faut le moteur plat au centre, sur son palier.' },
    { id: 'plat', x: 210, y: 150, w: 230, h: 230, hit: [96, 40, 70, 70], label: '② la roue qui garde tout', ok: 'plateau', missing: 'Il n\'y a pas de plateau : rien à lire, rien à écrire.', wrong: 'Ici, il faut le plateau magnétique, lisse comme un miroir.', under: true },
    { id: 'bras', x: 340, y: 210, w: 120, h: 100, label: '③ le levier qui lit', ok: 'bras', missing: 'Le plateau tourne, mais personne ne le lit.', wrong: 'Ici, il faut le bras qui pivote, avec la tête de lecture au bout.' },
    { id: 'couv', x: 240, y: 155, w: 330, h: 240, hit: [76, 236, 110, 40], label: '④ le couvercle', ok: 'couvscelle', missing: 'Sans couvercle, la poussière entre. Une poussière est bien plus épaisse que l\'espace entre la tête et le disque : la tête s\'écrase.', wrong: 'Il faut un couvercle étanche.', top: true }
  ],
  parts: [
    { id: 'moteur', name: 'Moteur et palier', vb: '-32 -32 64 64', svg: '<circle r="28" fill="url(#gSteel)" stroke="#555"/><circle r="20" fill="url(#gAlu)"/>' + [0, 60, 120, 180, 240, 300].map(t => `<rect x="12" y="-3" width="8" height="6" fill="#b87333" transform="rotate(${t})"/>`).join('') + '<circle r="6" fill="#333"/>' },
    { id: 'plateau', name: 'Plateau magnétique', vb: '-110 -110 220 220', svg: '<g class="a-spin-fast"><circle r="104" fill="url(#gPlatter)" stroke="#8a9098"/><circle r="70" fill="none" stroke="rgba(255,255,255,.25)"/><circle r="40" fill="none" stroke="rgba(0,0,0,.08)"/><path d="M0 -104 A104 104 0 0 1 60 -85 L0 0z" fill="rgba(255,255,255,.18)"/><circle r="26" fill="url(#gSteel)" stroke="#555"/>' + [0, 120, 240].map(t => `<circle cx="16" cy="0" r="3" fill="#555" transform="rotate(${t})"/>`).join('') + '</g>' },
    { id: 'bras', name: 'Bras et tête de lecture', vb: '-60 -50 120 100', svg: '<g class="a-seek" style="transform-origin:40px 30px"><path d="M40 22 L-46 -32 L-50 -26 L36 38z" fill="url(#gSteel)" stroke="#555"/><rect x="-56" y="-36" width="10" height="8" rx="2" fill="#222"/></g><circle cx="40" cy="30" r="14" fill="url(#gSteel)" stroke="#444"/><path d="M48 42 q14 4 14 -14" fill="none" stroke="#b87333" stroke-width="4"/>' },
    { id: 'couvscelle', name: 'Couvercle étanche', vb: '-165 -120 330 240', svg: '<g class="lid"><rect x="-160" y="-118" width="320" height="236" rx="10" fill="url(#gAlu)" stroke="#8b9097" opacity=".35"/><text x="0" y="104" text-anchor="middle" font-size="11" fill="#333">étanche à la poussière</text></g>' },
    { id: 'couvtrou', name: 'Couvercle à trous', vb: '-165 -120 330 240', svg: '<g class="lid"><rect x="-160" y="-118" width="320" height="236" rx="10" fill="url(#gAlu)" stroke="#8b9097" opacity=".35"/>' + Array.from({ length: 12 }, (_, i) => `<circle cx="${-120 + (i % 6) * 48}" cy="${-80 + Math.floor(i / 6) * 160}" r="6" fill="#222" opacity=".7"/>`).join('') + '</g>', why: 'Par les trous, la poussière entre. La tête vole au-dessus du disque à une hauteur bien plus petite qu\'une poussière : elle s\'écrase et raye tout.' }
  ],
  steps: ['Le moteur plat fait tourner l\'axe sur un palier presque sans frottement.', 'Le plateau tourne très vite : c\'est une roue couverte d\'une fine couche magnétique.', 'Le bras pivote comme un levier pour placer la tête au-dessus de la bonne piste.', 'Le couvercle étanche garde la poussière dehors. Ici, fermer la boîte protège, ce n\'est pas pour cacher.'],
  win: 'Une roue qui tourne et un levier qui lit : c\'est un disque dur. Et tu sais pourquoi on ne l\'ouvre pas dans la poussière.',
  fact: { t: 'Les disques durs d\'ordinateur tournent le plus souvent à 5 400 ou 7 200 tours par minute. Le premier, l\'IBM 350 de 1956, tournait à 1 200 tours par minute, gardait 3,75 mégaoctets et pesait plus d\'une tonne. Depuis le début des années 2000, la plupart tournent sur un palier à huile plutôt que sur des billes.', src: 'Computer History Museum; Carleton University; Nidec', url: 'https://www.computerhistory.org/storageengine/first-commercial-hard-disk-drive-shipped/' }
});

GAMES.push({
  id: 'drone', level: 2, title: 'Le moteur de drone', today: ['drone', 'ventilateur d\'ordinateur', 'trottinette électrique'],
  todayLine: 'Une cloche pleine d\'aimants tourne autour de bobines fixes.',
  closed: { svg: '<rect x="170" y="140" width="140" height="40" rx="14" fill="url(#gPlB)"/>' + [[110, 110], [370, 110]].map(([x, y]) => `<rect x="${x - 6}" y="${y}" width="12" height="40" fill="url(#gPlB)"/><ellipse cx="${x}" cy="${y}" rx="70" ry="6" fill="rgba(40,40,40,.4)"/>`).join(''), say: 'Le drone décolle. Moi, je vois juste quatre hélices.' },
  intro: 'Monte un moteur de drone, de l\'intérieur vers l\'extérieur.',
  base: '<rect x="150" y="250" width="180" height="16" rx="6" fill="url(#gPlB)"/><rect x="230" y="206" width="20" height="46" fill="url(#gPlB)"/><g class="out a-lift2"><text x="240" y="30" class="lbl" text-anchor="middle">Le drone décolle!</text></g>',
  slots: [
    { id: 'stat', x: 240, y: 160, w: 90, h: 90, hit: [40, 110, 110, 40], label: '① les bobines fixes', ok: 'stator', missing: 'Il n\'y a pas de bobines : le courant n\'a rien à aimanter.', wrong: 'Ici, il faut le bobinage de cuivre qui ne bouge pas.' },
    { id: 'roul', x: 240, y: 160, w: 40, h: 40, hit: [40, 170, 110, 40], label: '② ce qui roule', ok: 'roulement', missing: 'Sans roulement, l\'axe frotte : il chauffe et ralentit.', wrong: 'Il faut un roulement à billes autour de l\'axe.', top: true },
    { id: 'clo', x: 240, y: 160, w: 110, h: 110, hit: [330, 110, 110, 40], label: '③ la cloche qui tourne', ok: 'cloche', missing: 'Rien ne tourne autour des bobines.', wrong: 'Ici, il faut la cloche garnie d\'aimants.', top: true },
    { id: 'hel', x: 240, y: 160, w: 300, h: 34, hit: [330, 170, 110, 40], label: '④ ce qui pousse l\'air', ok: 'helice', missing: 'Le moteur tourne, mais rien ne pousse l\'air vers le bas.', wrong: 'Il faut l\'hélice.', top: true }
  ],
  parts: [
    { id: 'stator', name: 'Bobines de cuivre', vb: '-45 -35 90 70', svg: '<circle r="30" fill="url(#gSteel)" stroke="#555"/>' + Array.from({ length: 12 }, (_, i) => `<rect x="18" y="-5" width="14" height="10" rx="2" fill="url(#gCopper)" stroke="#7a3d12" transform="rotate(${i * 30})"/>`).join('') + '<circle r="8" fill="#333"/>' },
    { id: 'roulement', name: 'Roulement à billes', vb: '-25 -15 50 30', svg: '<g class="a-spin"><circle r="13" fill="none" stroke="url(#gSteel)" stroke-width="6"/>' + Array.from({ length: 8 }, (_, i) => `<circle cx="${9 * Math.cos(i * Math.PI / 4)}" cy="${9 * Math.sin(i * Math.PI / 4)}" r="2.6" fill="url(#gSteel)" stroke="#555" stroke-width=".5"/>`).join('') + '<circle r="4" fill="#333"/></g>' },
    { id: 'cloche', name: 'Cloche à aimants', vb: '-60 -45 120 90', svg: '<g class="bell"><circle r="42" fill="none" stroke="url(#gAluD)" stroke-width="8" opacity=".9"/><g class="a-spin-fast">' + Array.from({ length: 14 }, (_, i) => `<rect x="34" y="-4" width="5" height="8" fill="${i % 2 ? '#c4521c' : '#2b5c9e'}" transform="rotate(${i * 360 / 14})"/>`).join('') + '<circle r="46" fill="none" stroke="rgba(0,0,0,.2)"/></g></g>' },
    { id: 'helice', name: 'Hélice', vb: '-150 -15 300 30', svg: '<g class="a-prop"><path d="M0 0 C40 -12 110 -10 146 -2 C110 6 40 8 0 0 C-40 -8 -110 -6 -146 2 C-110 10 -40 12 0 0z" fill="url(#gPlB)"/><circle r="7" fill="url(#gSteel)"/></g>' },
    { id: 'heliceenvers', name: 'Hélice à l\'envers', vb: '-150 -15 300 30', svg: '<g transform="scale(1,-1)"><path d="M0 0 C40 -12 110 -10 146 -2 C110 6 40 8 0 0 C-40 -8 -110 -6 -146 2 C-110 10 -40 12 0 0z" fill="url(#gPlR)"/></g><circle r="7" fill="url(#gSteel)"/>', why: 'Montée à l\'envers, l\'hélice pousse l\'air vers le haut : le drone se colle au sol au lieu de monter.' }
  ],
  steps: ['La boîte de commande envoie le courant dans les bobines fixes, chacune à son tour.', 'Le roulement à billes laisse tourner l\'axe : les billes roulent au lieu de frotter.', 'Les bobines aimantées tirent les aimants de la cloche : la cloche tourne autour d\'elles.', 'L\'hélice tourne avec la cloche et pousse l\'air vers le bas : le drone monte.'],
  win: 'Des aimants qui se tirent, une roue sur des billes : c\'est le moteur de ton drone. Maintenant tu peux le réparer.',
  fact: { t: 'Dans un moteur de drone dit « à cage tournante », les bobines restent fixes au centre et la cloche garnie d\'aimants tourne autour d\'elles, soutenue par des roulements à billes. La boîte de commande alimente les bobines à tour de rôle.', src: 'Unmanned Systems Technology – How brushless motors work', url: 'https://www.unmannedsystemstechnology.com/feature/how-brushless-motors-work-how-to-test-them/' }
});
})();

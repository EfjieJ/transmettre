/* Les jeux d'assemblage — partie 2 : l'engrenage, la machine, la puce. */
(() => {
const { gear, spring, screw, label, bolt } = D;

/* ---------- 3. L'ENGRENAGE ---------- */
GAMES.push({
  id: 'montre', level: 3, title: 'La montre mécanique', today: ['montre automatique', 'horloge de cuisine à remonter', 'minuterie à ressort'],
  todayLine: 'Un ressort, des roues dentées, et un battement régulier.',
  closed: { svg: '<circle cx="240" cy="150" r="110" fill="url(#gSteel)" stroke="#666" stroke-width="3"/><circle cx="240" cy="150" r="96" fill="#f7f4ee" stroke="#bbb"/>' + Array.from({ length: 12 }, (_, i) => `<rect x="238" y="60" width="4" height="12" fill="#333" transform="rotate(${i * 30} 240 150)"/>`).join('') + '<line x1="240" y1="150" x2="240" y2="80" stroke="#222" stroke-width="4"/><line x1="240" y1="150" x2="290" y2="150" stroke="#222" stroke-width="5"/>', say: 'Ma montre avance toute seule. Il y a sûrement une pile quelque part.' },
  intro: 'Assemble le mouvement : de l\'énergie au battement.',
  base: '<circle cx="240" cy="150" r="128" fill="url(#gMovement)" stroke="#8a7a50" stroke-width="3"/>' + [[160, 60], [330, 70], [140, 230], [340, 230]].map(([x, y]) => screw(x, y, 5)).join('')
    + '<g transform="translate(240 150)"><g class="a-tick"><line x1="0" y1="0" x2="0" y2="-118" stroke="#1a1a1a" stroke-width="3"/></g></g>',
  slots: [
    { id: 'bar', x: 170, y: 120, w: 90, h: 90, label: '① la réserve d\'énergie', ok: 'barillet', missing: 'Il n\'y a pas de ressort : rien ne pousse les roues.', wrong: 'Ici, il faut le barillet : une boîte dentée avec un ressort enroulé dedans.' },
    { id: 'rou', x: 250, y: 160, w: 80, h: 80, label: '② les roues dentées', ok: 'rouage', missing: 'Le ressort pousse, mais aucune roue ne transmet la force.', wrong: 'Il faut des roues dentées qui s\'engrènent.' },
    { id: 'ech', x: 300, y: 110, w: 70, h: 60, label: '③ ce qui retient', ok: 'echappement', missing: 'Sans échappement, le ressort se déroule d\'un coup : les aiguilles filent en quelques secondes.', wrong: 'Ici, il faut l\'ancre et sa roue : elles lâchent une dent à la fois.' },
    { id: 'bal', x: 320, y: 190, w: 80, h: 80, label: '④ ce qui bat', ok: 'balancier', missing: 'L\'ancre ne sait pas à quel rythme lâcher les dents : il faut un balancier.', wrong: 'Il faut le balancier et son spiral.' }
  ],
  parts: [
    { id: 'barillet', name: 'Barillet (ressort)', vb: '-45 -45 90 90', svg: '<g class="a-spin-slow">' + gear(38, 40, { fill: 'gBrass' }) + '<path d="M0 0 m4 0 a4 4 0 1 1 -8 0 a8 8 0 1 1 16 0 a12 12 0 1 1 -24 0 a16 16 0 1 1 32 0 a20 20 0 1 1 -40 0" fill="none" stroke="#5a6068" stroke-width="2"/></g>' },
    { id: 'rouage', name: 'Rouage', vb: '-40 -40 80 80', svg: gear(28, 20, { cls: 'a-spin-rev', fill: 'gBrass', spokes: true }) + gear(9, 8, { cls: 'a-spin-rev', fill: 'gSteel', stroke: '#555' }) },
    { id: 'rouelisse', name: 'Roue lisse', vb: '-40 -40 80 80', svg: '<circle r="28" fill="url(#gBrass)" stroke="#7a5a1c"/><circle r="5" fill="url(#gSteel)"/>', why: 'Une roue lisse glisse contre l\'autre : la force ne passe pas, la montre s\'arrête. Ce sont les dents qui empêchent de glisser.' },
    { id: 'echappement', name: 'Ancre et roue d\'échappement', vb: '-35 -30 70 60', svg: gear(16, 15, { cls: 'a-tick', fill: 'gSteel', stroke: '#555', h: 5 }) + '<g class="a-anchor" style="transform-origin:12px -18px"><path d="M12 -18 L-14 -10 L-12 -4 L10 -12 L30 -4 L32 -10z" fill="url(#gSteel)" stroke="#555"/><rect x="-16" y="-8" width="5" height="6" fill="#b3122c"/><rect x="28" y="-8" width="5" height="6" fill="#b3122c"/></g>' },
    { id: 'balancier', name: 'Balancier et spiral', vb: '-40 -40 80 80', svg: '<g class="a-balance"><circle r="32" fill="none" stroke="url(#gBrass)" stroke-width="5"/><line x1="-32" y1="0" x2="32" y2="0" stroke="#a8862b" stroke-width="3"/><path d="M0 0 m2 0 a2 2 0 1 1 -4 0 a5 5 0 1 1 10 0 a8 8 0 1 1 -16 0 a11 11 0 1 1 22 0" fill="none" stroke="#3a5fa0" stroke-width="1.2"/></g><circle r="3" fill="#b3122c"/>' }
  ],
  steps: ['Le ressort, enroulé dans le barillet, veut se dérouler : c\'est la réserve d\'énergie.', 'Les roues dentées passent la force d\'une roue à l\'autre; à chaque étage, la vitesse change.', 'L\'ancre bloque la roue d\'échappement et la lâche une dent à la fois.', 'Le balancier va et vient à un rythme régulier : il dit à l\'ancre quand lâcher. L\'aiguille avance par petits pas.'],
  win: 'Un ressort, des roues et un battement : tu viens de monter une montre. Aucune pile là-dedans.',
  fact: { t: 'Beaucoup de montres mécaniques battent à 4 hertz, soit 28 800 alternances par heure : le balancier fait quatre allers-retours chaque seconde, et la trotteuse avance par huit petits pas. L\'échappement remonte aux premières horloges mécaniques, à la fin du 13e siècle.', src: 'Hodinkee – What does watch frequency mean?', url: 'https://www.hodinkee.com/articles/watchs-frequency-hz-vph-meaning' }
});

const HILL = '<path d="M0 262 L480 150 V300 H0z" fill="url(#gGrass)"/><path d="M0 262 L480 150" stroke="#555" stroke-width="3"/>';
const ROAD = '<path class="road" d="M0 270 L480 158" stroke="#fff" stroke-width="3" stroke-dasharray="14 12"/>';
const WHEEL = (x, y) => `<g transform="translate(${x} ${y})"><g class="a-spin-7"><circle r="28" fill="url(#gTireS)"/><circle r="14" fill="url(#gAlu)"/>${[0, 72, 144, 216, 288].map(t => `<rect x="5" y="-1.5" width="8" height="3" fill="#777" transform="rotate(${t})"/>`).join('')}</g></g>`;
GAMES.push({
  id: 'transmission', level: 3, title: 'La transmission de l\'auto', today: ['voiture électrique', 'vélo à vitesses', 'perceuse sans fil'],
  todayLine: 'Petit engrenage qui fait tourner un grand : plus de force pour monter.',
  closed: { svg: HILL + '<g transform="translate(200 160) rotate(-13)"><rect x="0" y="0" width="140" height="40" rx="14" fill="url(#gPlR)"/><path d="M20 0 q30 -30 80 0" fill="url(#gGlassD)"/><circle cx="30" cy="40" r="14" fill="url(#gTireS)"/><circle cx="110" cy="40" r="14" fill="url(#gTireS)"/></g>', say: 'Mon auto monte la côte. Je pèse sur la pédale, c\'est tout.' },
  intro: 'Le moteur tourne très vite, mais il n\'a pas assez de force pour la côte. Choisis où va chaque engrenage.',
  base: HILL + ROAD + '<g transform="translate(110 135) rotate(-13) scale(1.35)"><rect x="0" y="0" width="170" height="46" rx="16" fill="url(#gPlR)" stroke="#8a2a10" opacity=".55"/><path d="M26 0 q36 -36 100 0" fill="url(#gGlassD)" stroke="#555"/>'
    + '<rect x="56" y="30" width="26" height="24" rx="5" fill="url(#gSteel)" stroke="#444"/><text x="69" y="27" text-anchor="middle" font-size="8" fill="#222">moteur</text>' + WHEEL(36, 46) + WHEEL(140, 46) + '</g>'
    + '<text x="360" y="60" class="out lbl" text-anchor="middle">Elle monte la côte!</text>',
  slots: [
    { id: 'pig', x: 213, y: 175, w: 40, h: 40, label: '① sur le moteur', ok: 'petit', missing: 'Le moteur tourne, mais rien n\'est fixé sur son axe.', wrong: 'Sur le moteur rapide, il faut la petite roue.' },
    { id: 'cour', x: 171, y: 185, w: 76, h: 76, label: '② sur la roue', ok: 'grand', missing: 'Le petit engrenage tourne dans le vide : rien n\'entraîne les roues.', wrong: 'Sur l\'essieu, il faut la grande roue.' }
  ],
  parts: [
    { id: 'petit', name: 'Petit engrenage (10 dents)', vb: '-20 -20 40 40', svg: gear(10, 10, { cls: 'a-spin-rev', fill: 'gSteel', stroke: '#555', h: 4 }), whyAt: { cour: 'Le grand engrenage est sur le moteur et le petit sur les roues : les roues tournent plus vite que le moteur, mais avec moins de force. Dans la côte, l\'auto cale.' } },
    { id: 'grand', name: 'Grand engrenage (30 dents)', vb: '-38 -38 76 76', svg: gear(30, 30, { cls: 'a-spin-7', fill: 'gBrass', spokes: true, h: 4 }), whyAt: { pig: 'Le grand engrenage est sur le moteur et le petit sur les roues : les roues tournent plus vite que le moteur, mais avec moins de force. Dans la côte, l\'auto cale.' } },
    { id: 'courroie', name: 'Élastique', vb: '-48 -20 96 40', svg: '<ellipse rx="40" ry="10" fill="none" stroke="#c9a227" stroke-width="4"/>', why: 'Un élastique patine dès que ça force : le moteur s\'emballe, les roues ne suivent pas.' }
  ],
  steps: ['Le moteur tourne très vite, mais avec peu de force.', 'Sur son axe, le petit engrenage fait un tour complet...', '...pendant que le grand, sur la roue, ne fait qu\'un tiers de tour : 10 dents sur 30.', 'Ce qu\'on perd en vitesse, on le gagne en force : trois fois plus. L\'auto monte la côte. Dans une vraie voiture électrique, la réduction est d\'environ 9 pour 1.'],
  win: 'Petit qui entraîne grand : moins vite, plus fort. C\'est le même échange que le levier, en rond.',
  fact: { t: 'La plupart des voitures électriques n\'ont pas de boîte de vitesses : un seul étage de réduction, souvent autour de 9 pour 1, suffit, parce que le moteur électrique a beaucoup de force dès l\'arrêt et tourne vite sur une large plage.', src: 'MDPI Vehicles (2023) – EV motor and transmission benchmarking', url: 'https://www.mdpi.com/2624-8921/5/3/65' }
});

GAMES.push({
  id: 'imprimante', level: 3, title: 'L\'imprimante 3D', today: ['imprimante 3D', 'imprimante de bureau', 'graveuse laser'],
  todayLine: 'Un moteur qui tourne par petits pas, une courroie à dents, une vis.',
  closed: { svg: '<rect x="120" y="40" width="240" height="220" rx="8" fill="url(#gPlB)" stroke="#111"/><rect x="140" y="60" width="200" height="160" fill="url(#gGlassD)"/><rect x="200" y="230" width="80" height="16" rx="3" fill="url(#gScreen)"/>', say: 'Tu cliques sur imprimer, pis l\'objet apparaît. Comme par magie.' },
  intro: 'Assemble l\'axe qui déplace la buse, puis la vis qui monte d\'une couche.',
  base: '<rect x="60" y="30" width="16" height="240" fill="url(#gAluD)"/><rect x="404" y="30" width="16" height="240" fill="url(#gAluD)"/><rect x="60" y="250" width="360" height="20" fill="url(#gAluD)"/>'
    + '<rect x="100" y="224" width="280" height="12" fill="url(#gPlatter)"/>'
    + '<g class="out"><path class="a-grow" d="M200 224 v-40 q40 -20 80 0 v40z" fill="url(#gPlR)" opacity=".9"/></g>'
    + '<rect x="70" y="110" width="340" height="8" fill="url(#gSteelV)"/>',
  slots: [
    { id: 'mot', x: 96, y: 90, w: 60, h: 50, label: '① le moteur à pas', ok: 'stepper', missing: 'Rien ne fait bouger la courroie.', wrong: 'Ici, il faut le moteur pas à pas, avec sa poulie dentée.' },
    { id: 'cour', x: 240, y: 92, w: 300, h: 30, hit: [175, 36, 130, 34], label: '② ce qui transmet', ok: 'courroiedent', missing: 'Le moteur tourne, mais rien ne relie la poulie à la buse.', wrong: 'Il faut une courroie à dents.' },
    { id: 'tete', x: 240, y: 140, w: 70, h: 70, label: '③ la buse chaude', ok: 'tete', missing: 'La courroie bouge, mais il n\'y a pas de buse pour déposer le plastique.', wrong: 'Ici, il faut la tête d\'impression.', top: true },
    { id: 'vis', x: 412, y: 150, w: 40, h: 200, label: '④ la vis qui monte', ok: 'vis', missing: 'La première couche est faite, mais rien ne fait monter la buse pour la suivante.', wrong: 'Il faut une tige filetée.' }
  ],
  parts: [
    { id: 'stepper', name: 'Moteur pas à pas', vb: '-30 -25 60 50', svg: '<rect x="-26" y="-22" width="44" height="44" rx="4" fill="url(#gPlB)" stroke="#111"/>' + [[-20, -16], [12, -16], [-20, 16], [12, 16]].map(([x, y]) => bolt(x, y)).join('') + gear(9, 20, { cls: 'a-step', fill: 'gAlu', stroke: '#666', h: 2.5 }) },
    { id: 'courroiedent', name: 'Courroie à dents', vb: '-150 -15 300 30', svg: '<g class="a-belt"><rect x="-146" y="-6" width="292" height="12" rx="6" fill="none" stroke="#1a1a1a" stroke-width="4" stroke-dasharray="3 2"/></g>' },
    { id: 'courroielisse', name: 'Courroie lisse', vb: '-150 -15 300 30', svg: '<rect x="-146" y="-6" width="292" height="12" rx="6" fill="none" stroke="#3a3a3a" stroke-width="4"/>', why: 'Une courroie lisse glisse un peu à chaque départ : la buse n\'est jamais tout à fait où le moteur croit. Les couches se décalent, l\'objet penche.' },
    { id: 'tete', name: 'Tête d\'impression', vb: '-35 -35 70 70', svg: '<g class="a-slide"><rect x="-26" y="-30" width="52" height="40" rx="4" fill="url(#gPlR)" stroke="#8a2a10"/><rect x="-10" y="10" width="20" height="10" fill="url(#gAlu)"/><path d="M-6 20 h12 l-6 10z" fill="url(#gBrass)"/></g>' },
    { id: 'vis', name: 'Tige filetée', vb: '-20 -100 40 200', svg: '<rect x="-5" y="-96" width="10" height="192" fill="url(#gSteelV)"/>' + Array.from({ length: 30 }, (_, i) => `<line x1="-6" y1="${-94 + i * 6.4}" x2="6" y2="${-90 + i * 6.4}" stroke="#666" stroke-width="1.2"/>`).join('') }
  ],
  steps: ['L\'ordinateur envoie des impulsions : à chacune, le moteur tourne d\'un petit pas exact.', 'La poulie dentée tire la courroie à dents, qui ne peut pas glisser.', 'La tête suit la courroie et dépose un fil de plastique fondu, ligne par ligne.', 'Couche finie : la vis tourne un peu et monte la tête d\'une fraction de millimètre. Couche après couche, l\'objet grandit.'],
  win: 'Des pas, des dents et une vis : l\'imprimante 3D, c\'est de la mécanique très précise. Maintenant tu sais la régler.',
  fact: { t: 'La plupart des moteurs d\'imprimante 3D font 200 pas par tour (1,8 degré chacun). Avec une poulie de 20 dents et une courroie dont les dents sont espacées de 2 mm, un tour de moteur déplace la tête de 40 mm.', src: 'Documentation Klipper – Rotation distance', url: 'https://www.klipper3d.org/Rotation_Distance.html' }
});

/* ---------- 4. LA MACHINE ---------- */
GAMES.push({
  id: 'lavevaisselle', level: 4, title: 'Le lave-vaisselle', today: ['lave-vaisselle', 'laveuse', 'gicleurs de pelouse'],
  todayLine: 'Un moteur, une pompe, et un bras que l\'eau fait tourner toute seule.',
  closed: { svg: '<rect x="110" y="30" width="260" height="240" rx="8" fill="url(#gAlu)" stroke="#8b9097"/><rect x="130" y="50" width="220" height="14" rx="4" fill="url(#gPlB)"/><circle cx="330" cy="57" r="4" fill="#3c3"/>', say: 'Je ferme la porte, pis la vaisselle sort propre.' },
  intro: 'Assemble la cuve, de la pompe jusqu\'au bras. Attention aux jets.',
  base: '<rect x="100" y="20" width="280" height="260" rx="8" fill="url(#gTub)" stroke="#8b9097"/><rect x="130" y="60" width="220" height="70" fill="none" stroke="#c5ccd4" stroke-width="3"/>' + [150, 180, 210, 240, 270, 300].map(x => `<ellipse cx="${x}" cy="96" rx="10" ry="30" fill="url(#gPlW)" stroke="#bbb"/>`).join('')
    + '<g class="out a-jets">' + [150, 200, 250, 300, 330].map(x => `<path d="M${x} 180 l-6 -40" stroke="#7cc4f0" stroke-width="3" stroke-linecap="round" opacity=".8"/>`).join('') + '</g>'
    + '<rect x="234" y="190" width="12" height="40" fill="url(#gSteelV)"/>',
  slots: [
    { id: 'mot', x: 160, y: 250, w: 70, h: 40, label: '① le moteur', ok: 'moteur', missing: 'Il n\'y a rien pour pousser l\'eau.', wrong: 'Ici, il faut le moteur électrique.' },
    { id: 'pom', x: 240, y: 250, w: 60, h: 40, label: '② la pompe', ok: 'pompe', missing: 'Le moteur tourne à vide : il faut une roue à aubes pour pousser l\'eau.', wrong: 'Ici, il faut la pompe à roue à aubes.' },
    { id: 'bras', x: 240, y: 186, w: 240, h: 30, label: '③ le bras', ok: 'brasincline', missing: 'L\'eau monte dans le tuyau, mais rien ne l\'arrose sur la vaisselle.', wrong: 'Il faut le bras d\'aspersion.' },
    { id: 'fil', x: 330, y: 254, w: 60, h: 30, label: '④ le filtre', ok: 'filtre', missing: 'Sans filtre, les restes de nourriture retournent dans la pompe et bouchent les jets.', wrong: 'Ici, il faut le filtre.' }
  ],
  parts: [
    { id: 'moteur', name: 'Moteur', vb: '-35 -20 70 40', svg: '<rect x="-32" y="-16" width="64" height="32" rx="8" fill="url(#gSteel)" stroke="#555"/>' + [-20, -10, 0, 10, 20].map(x => `<line x1="${x}" y1="-16" x2="${x}" y2="16" stroke="#777"/>`).join('') },
    { id: 'pompe', name: 'Pompe à aubes', vb: '-30 -20 60 40', svg: '<circle r="17" fill="url(#gPlW)" stroke="#888"/><g class="a-spin-fast">' + [0, 60, 120, 180, 240, 300].map(t => `<path d="M0 0 q8 -4 14 -2" stroke="#2b5c9e" stroke-width="3" fill="none" transform="rotate(${t})"/>`).join('') + '</g>' },
    { id: 'brasincline', name: 'Bras à jets inclinés', vb: '-120 -15 240 30', svg: '<g class="a-spin-arm"><rect x="-116" y="-6" width="232" height="12" rx="6" fill="url(#gPlW)" stroke="#999"/>' + [-100, -70, -40, 40, 70, 100].map(x => `<circle cx="${x}" cy="0" r="2.4" fill="#333"/>`).join('') + '<path d="M112 -6 l8 -6 M-112 6 l-8 6" stroke="#7cc4f0" stroke-width="3"/></g><circle r="8" fill="url(#gSteel)"/>' },
    { id: 'brasdroit', name: 'Bras à jets droits', vb: '-120 -15 240 30', svg: '<rect x="-116" y="-6" width="232" height="12" rx="6" fill="url(#gPlW)" stroke="#999"/>' + [-100, -70, -40, 40, 70, 100].map(x => `<circle cx="${x}" cy="0" r="2.4" fill="#333"/>`).join('') + '<circle r="8" fill="url(#gSteel)"/>', why: 'Si tous les jets partent droit vers le haut, rien ne pousse le bras de côté : il ne tourne pas, et la vaisselle des coins reste sale.' },
    { id: 'filtre', name: 'Filtre', vb: '-30 -15 60 30', svg: '<rect x="-26" y="-11" width="52" height="22" rx="4" fill="url(#gSteel)" stroke="#555"/>' + Array.from({ length: 10 }, (_, i) => `<line x1="${-22 + i * 5}" y1="-9" x2="${-22 + i * 5}" y2="9" stroke="#444"/>`).join('') }
  ],
  steps: ['Le moteur fait tourner la roue à aubes de la pompe.', 'La pompe pousse l\'eau savonneuse dans le tuyau, vers le bras.', 'L\'eau sort par des jets inclinés : en partant d\'un côté, elle pousse le bras de l\'autre. Le bras tourne tout seul.', 'L\'eau retombe, passe dans le filtre, et la pompe la renvoie.'],
  win: 'Moteur, roue à aubes, et un bras qui tourne par réaction : tu sais ce qui lave ta vaisselle. Et pourquoi il faut nettoyer le filtre.',
  fact: { t: 'Les bras d\'aspersion de la plupart des lave-vaisselle n\'ont pas de moteur : leurs buses inclinées projettent l\'eau en biais, et la réaction des jets les fait tourner.', src: 'Brevet US 2012/0279530 (bras d\'aspersion)', url: 'https://patents.google.com/patent/US20120279530A1/en' }
});

GAMES.push({
  id: 'auto', level: 4, title: 'La voiture électrique', today: ['voiture électrique', 'autobus électrique', 'vélo électrique'],
  todayLine: 'Une pile, un moteur, des engrenages, des roues : la chaîne au complet.',
  closed: { svg: '<path d="M60 200 q10 -50 70 -60 l60 -40 h120 l60 40 q60 10 50 60z" fill="url(#gPlB)" stroke="#111"/><circle cx="140" cy="210" r="30" fill="url(#gTireS)"/><circle cx="340" cy="210" r="30" fill="url(#gTireS)"/>', say: 'C\'est un ordinateur sur des roues. On peut pas comprendre ça.' },
  intro: 'Assemble la chaîne de traction, de la batterie jusqu\'aux roues.',
  base: '<path d="M40 210 q10 -60 80 -70 l70 -50 h130 l70 50 q70 10 60 70z" fill="url(#gPlW)" stroke="#999" opacity=".5"/><g transform="translate(130 222)"><g class="a-spin"><circle r="34" fill="url(#gTireS)"/><circle r="17" fill="url(#gAlu)"/>' + [0, 72, 144, 216, 288].map(t => `<rect x="4" y="-2" width="12" height="4" fill="#777" transform="rotate(${t})"/>`).join('') + '</g></g><g transform="translate(360 222)"><g class="a-spin"><circle r="34" fill="url(#gTireS)"/><circle r="17" fill="url(#gAlu)"/></g></g>'
    + '<text x="240" y="30" class="out lbl" text-anchor="middle">Elle roule, sans bruit de moteur.</text>',
  slots: [
    { id: 'bat', x: 240, y: 196, w: 170, h: 30, label: '① la réserve', ok: 'batterie', missing: 'Il n\'y a pas de batterie : aucune énergie à envoyer.', wrong: 'Ici, sous le plancher, il faut la batterie.' },
    { id: 'cmd', x: 220, y: 150, w: 60, h: 40, label: '② la commande', ok: 'commande', missing: 'La batterie est là, mais rien ne dose le courant selon la pédale.', wrong: 'Ici, il faut la boîte de commande.' },
    { id: 'mot', x: 300, y: 160, w: 60, h: 50, label: '③ le moteur', ok: 'moteur', missing: 'Le courant arrive, mais il n\'y a pas de moteur pour tourner.', wrong: 'Ici, il faut le moteur électrique.' },
    { id: 'red', x: 352, y: 196, w: 50, h: 50, label: '④ la réduction', ok: 'reducteur', missing: 'Le moteur tourne, mais rien ne le relie aux roues.', wrong: 'Ici, il faut les engrenages de réduction.' }
  ],
  parts: [
    { id: 'batterie', name: 'Batterie', vb: '-85 -15 170 30', svg: '<rect x="-82" y="-12" width="164" height="24" rx="3" fill="url(#gPlB)" stroke="#111"/>' + Array.from({ length: 10 }, (_, i) => `<rect x="${-78 + i * 16}" y="-8" width="12" height="16" rx="2" fill="url(#gCopper)" opacity=".8"/>`).join('') },
    { id: 'reservoir', name: 'Réservoir d\'essence', vb: '-85 -15 170 30', svg: '<rect x="-60" y="-12" width="120" height="24" rx="10" fill="url(#gPlR)" stroke="#8a2a10"/>', why: 'Ce moteur ne brûle rien : il a besoin de courant électrique, pas d\'essence.' },
    { id: 'commande', name: 'Boîte de commande', vb: '-30 -20 60 40', svg: '<rect x="-28" y="-18" width="56" height="36" rx="4" fill="url(#gAlu)" stroke="#777"/><rect x="-20" y="-10" width="40" height="20" fill="url(#gPcb)"/><rect x="-6" y="-5" width="12" height="10" fill="#111"/>' },
    { id: 'moteur', name: 'Moteur électrique', vb: '-30 -25 60 50', svg: '<rect x="-26" y="-22" width="52" height="44" rx="10" fill="url(#gSteel)" stroke="#555"/>' + [-14, -4, 6, 16].map(x => `<line x1="${x}" y1="-22" x2="${x}" y2="22" stroke="#777"/>`).join('') + gear(7, 9, { cls: 'a-spin-fast', fill: 'gSteel', stroke: '#444' }) },
    { id: 'reducteur', name: 'Engrenages de réduction', vb: '-25 -25 50 50', svg: gear(20, 30, { cls: 'a-spin', fill: 'gSteel', stroke: '#555', h: 3.5, spokes: true }) }
  ],
  steps: ['La batterie garde l\'énergie électrique.', 'Quand tu appuies sur la pédale, la boîte de commande envoie plus ou moins de courant.', 'Le courant fait tourner le moteur : des aimants qui se poussent, comme dans le drone.', 'Un petit engrenage fait tourner un grand : moins vite, plus fort. Les roues avancent.'],
  win: 'Pile, commande, moteur, engrenages, roues : une voiture électrique, c\'est la même chaîne que ta toute première. Juste plus grande.',
  fact: { t: 'Quand on lève le pied, le moteur d\'une voiture électrique peut fonctionner à l\'envers : les roues le font tourner et il devient une génératrice qui recharge la batterie en ralentissant. C\'est l\'induction découverte par Faraday en 1831.', src: 'Tesla Motors – Roadster, le moteur (archive 2010)', url: 'https://web.archive.org/web/20100704030129/http://www.teslamotors.com/roadster/technology/motor' }
});

GAMES.push({
  id: 'robot', level: 4, title: 'Le bras de robot d\'usine', today: ['robot d\'usine', 'bras de soudure d\'auto', 'robot d\'entrepôt'],
  todayLine: 'Des leviers, et à chaque articulation, un moteur avec ses engrenages.',
  closed: { svg: '<rect x="80" y="240" width="320" height="30" fill="#555"/><path d="M160 240 v-80 l80 -60 l90 40" fill="none" stroke="url(#gPlR)" stroke-width="30" stroke-linecap="round" stroke-linejoin="round"/>', say: 'Le robot fait tout tout seul. Il paraît qu\'il pense.' },
  intro: 'Monte le bras, de la base à la pince. Chaque articulation a besoin de force.',
  base: '<rect x="0" y="262" width="480" height="38" fill="#4a4f55"/><rect x="330" y="236" width="70" height="26" fill="url(#gPlW)" stroke="#999"/>'
    + '<rect x="350" y="214" width="30" height="22" fill="url(#gCardboard)" stroke="#8a6a3a"/><text x="365" y="290" class="out lbl" text-anchor="middle">La pince tient la boîte.</text>'
    + '<rect x="100" y="232" width="80" height="30" rx="4" fill="url(#gSteel)" stroke="#555"/>',
  slots: [
    { id: 'base', x: 140, y: 216, w: 64, h: 40, label: '① articulation de la base', ok: ['joint', 'joint2'], missing: 'Il n\'y a pas de moteur à la base : le bras ne peut pas se lever.', wrong: 'Ici, il faut un moteur avec ses engrenages réducteurs.', top: true },
    { id: 'bras', x: 175, y: 173, w: 70, h: 70, hit: [20, 120, 100, 36], label: '② le bras (levier)', ok: 'segment', missing: 'Le moteur tourne, mais aucun bras ne transmet le mouvement.', wrong: 'Ici, il faut un segment rigide : un levier.', under: true },
    { id: 'coude', x: 210, y: 130, w: 64, h: 40, label: '③ le coude', ok: ['joint', 'joint2'], missing: 'Le bras monte, mais l\'avant-bras pend : il faut une articulation motorisée.', wrong: 'Ici, il faut un moteur avec ses engrenages réducteurs.', top: true },
    { id: 'pince', x: 300, y: 165, w: 120, h: 60, label: '④ l\'avant-bras et la pince', ok: 'pince', missing: 'Le bras est monté, mais il n\'a rien pour saisir la boîte.', wrong: 'Ici, il faut l\'avant-bras avec sa pince : deux petits leviers qui se referment.' }
  ],
  parts: [
    { id: 'joint', name: 'Moteur + réducteur', vb: '-32 -20 64 40', svg: '<rect x="-30" y="-18" width="60" height="36" rx="8" fill="url(#gPlR)" stroke="#8a2a10"/>' + gear(12, 16, { cls: 'a-spin', fill: 'gSteel', stroke: '#444', h: 3 }) },
    { id: 'joint2', name: 'Moteur + réducteur', vb: '-32 -20 64 40', svg: '<rect x="-30" y="-18" width="60" height="36" rx="8" fill="url(#gPlR)" stroke="#8a2a10"/>' + gear(12, 16, { cls: 'a-spin', fill: 'gSteel', stroke: '#444', h: 3 }) },
    { id: 'moteurseul', name: 'Moteur sans réducteur', vb: '-32 -20 64 40', svg: '<rect x="-30" y="-18" width="60" height="36" rx="8" fill="url(#gSteel)" stroke="#555"/><circle r="5" fill="#333"/>', why: 'Sans engrenages réducteurs, le moteur tourne vite mais n\'a pas la force de tenir le bras : il retombe. Les robots d\'usine ont souvent des réducteurs d\'environ 100 pour 1 à leurs articulations.' },
    { id: 'segment', name: 'Segment de bras', vb: '-60 -20 120 40', svg: '<g transform="rotate(-51)"><rect x="-58" y="-12" width="116" height="24" rx="12" fill="url(#gPlR)" stroke="#8a2a10"/><rect x="-40" y="-4" width="80" height="8" rx="4" fill="rgba(255,255,255,.18)"/></g>' },
    { id: 'pince', name: 'Avant-bras et pince', vb: '-95 -45 190 100', svg: '<g transform="translate(-13 -5)"><g transform="rotate(21)"><rect x="-80" y="-10" width="160" height="20" rx="10" fill="url(#gPlR)" stroke="#8a2a10"/><rect x="-60" y="-3" width="120" height="6" rx="3" fill="rgba(255,255,255,.18)"/></g><g transform="translate(78 30)"><rect x="-20" y="-6" width="40" height="14" rx="3" fill="url(#gSteel)" stroke="#555"/><g class="a-grip"><path d="M-17 8 l-3 24 h7 l3 -24z" fill="url(#gSteel)" stroke="#555"/><path d="M17 8 l3 24 h-7 l-3 -24z" fill="url(#gSteel)" stroke="#555"/></g></g></g>' }
  ],
  steps: ['Le moteur de la base tourne vite; ses engrenages réducteurs le ralentissent et multiplient sa force.', 'Le bras est un levier : il porte la force loin de l\'articulation.', 'Au coude, un deuxième moteur avec réducteur plie l\'avant-bras.', 'La pince, deux petits leviers, se referme sur la boîte. Un programme décide de l\'ordre; la force, elle, vient des moteurs et des engrenages.'],
  win: 'Leviers, moteurs, engrenages : le robot ne pense pas, il pousse dans l\'ordre qu\'on lui a écrit. Toi, tu sais lire cet ordre.',
  fact: { t: 'Le premier robot industriel, l\'Unimate, a commencé à travailler en 1961 dans une usine de General Motors au New Jersey. Aujourd\'hui, beaucoup d\'articulations de robots utilisent des réducteurs à onde de déformation d\'environ 100 pour 1.', src: 'Association for Advancing Automation – Unimate; Harmonic Drive', url: 'https://www.automate.org/a3-content/joseph-engelberger-unimate' }
});

/* ---------- 5. LA PUCE ---------- */
GAMES.push({
  id: 'transistor', level: 5, title: 'Le transistor, levier électrique', today: ['toutes les puces', 'chargeur', 'télécommande'],
  todayLine: 'Une petite tension sur la grille ouvre un grand passage : un levier sans pièce qui bouge.',
  closed: { svg: '<rect x="190" y="110" width="100" height="80" rx="4" fill="url(#gPlB)"/>' + [0, 1, 2].map(i => `<rect x="${206 + i * 30}" y="190" width="8" height="40" fill="url(#gSteelV)"/>`).join('') + '<text x="240" y="156" text-anchor="middle" font-size="12" fill="#bbb">2N7000</text>', say: 'Un petit morceau noir à trois pattes. C\'est de la magie électronique.' },
  intro: 'Construis un transistor en couches, puis branche-le : une petite pile commande une grosse lampe.',
  base: '<rect x="40" y="40" width="40" height="70" rx="4" fill="url(#gPlB)"/><rect x="50" y="34" width="20" height="8" fill="url(#gCopper)"/><text x="60" y="80" text-anchor="middle" font-size="10" fill="#ddd">9 V</text>'
    + '<path d="M60 110 V250 H240" fill="none" stroke="#b87333" stroke-width="4"/><path d="M60 40 V20 H400 V60" fill="none" stroke="#b87333" stroke-width="4"/>'
    + '<g transform="translate(400 80)"><circle r="22" fill="url(#gGlass)" stroke="#888"/><path d="M-8 4 q8 -16 16 0" fill="none" stroke="#555" stroke-width="2"/><circle class="out lampglow" r="40" fill="url(#gGlow)"/><rect x="-10" y="20" width="20" height="14" fill="url(#gAlu)"/></g>'
    + '<path d="M400 114 V250 H300" fill="none" stroke="#b87333" stroke-width="4"/>'
    + '<rect x="130" y="150" width="30" height="40" rx="3" fill="url(#gPlB)"/><text x="145" y="176" text-anchor="middle" font-size="8" fill="#ddd">1,5 V</text><path d="M145 150 V120 H270 V184" fill="none" stroke="#c4521c" stroke-width="2.5"/>'
    + '<g class="sw a-swtch"><circle cx="200" cy="120" r="9" fill="url(#gPlW)" stroke="#999"/></g>',
  slots: [
    { id: 'sil', x: 270, y: 250, w: 80, h: 30, label: '① le passage', ok: 'silicium', missing: 'Il n\'y a pas de passage entre les deux fils : le courant n\'a nulle part où aller.', wrong: 'Ici, il faut le silicium : il conduit seulement quand on le lui demande.' },
    { id: 'iso', x: 270, y: 222, w: 80, h: 20, label: '② la vitre', ok: 'isolant', missing: 'La grille touche directement le silicium : la petite pile se vide dans le passage au lieu de le commander.', wrong: 'Il faut une couche mince qui ne laisse pas passer le courant.' },
    { id: 'gri', x: 270, y: 196, w: 80, h: 26, label: '③ la poignée', ok: 'grille', missing: 'Rien ne commande le passage : la lampe reste éteinte.', wrong: 'Ici, il faut la grille de métal.' }
  ],
  parts: [
    { id: 'silicium', name: 'Silicium (le passage)', vb: '-40 -15 80 30', svg: '<rect x="-38" y="-12" width="76" height="24" rx="2" fill="url(#gSilicon)" stroke="#556"/><g class="out a-flow"><path d="M-36 0 H36" stroke="#ffd166" stroke-width="3" stroke-dasharray="4 6"/></g>' },
    { id: 'isolant', name: 'Couche isolante', vb: '-40 -10 80 20', svg: '<rect x="-38" y="-5" width="76" height="10" fill="url(#gGlass)" stroke="#9ab"/>' },
    { id: 'grille', name: 'Grille de métal', vb: '-40 -13 80 26', svg: '<rect x="-30" y="-10" width="60" height="20" rx="2" fill="url(#gAlu)" stroke="#777"/>' },
    { id: 'cuivre', name: 'Fil de cuivre', vb: '-40 -10 80 20', svg: '<rect x="-38" y="-4" width="76" height="8" rx="4" fill="url(#gCopper)"/>', why: 'Un fil de cuivre conduit tout le temps : la lampe resterait allumée, impossible de l\'éteindre. Un transistor doit pouvoir s\'ouvrir et se fermer.' }
  ],
  steps: ['Le silicium relie les deux fils, mais seul, il ne laisse presque rien passer.', 'Une couche mince isolante sépare la grille du silicium, comme une vitre.', 'Ferme le petit interrupteur : la petite pile met la grille sous tension. À travers la vitre, elle attire des charges dans le silicium, sans qu\'aucun courant ne traverse...', '...et le passage s\'ouvre : le courant de la grosse pile allume la lampe. Un petit effort commande un grand : c\'est un levier, électrique.'],
  win: 'Une petite tension qui commande un grand courant : c\'est un levier électrique. Une puce en contient des milliards, qui se commandent en chaîne.',
  fact: { t: 'Le premier transistor a fonctionné en décembre 1947 aux Bell Labs, grâce à John Bardeen et Walter Brattain; William Shockley a ensuite conçu le transistor à jonction. Les trois ont reçu le prix Nobel de physique en 1956. Celui que tu viens de monter, à grille isolée, a été réalisé aux Bell Labs en 1959 par Mohamed Atalla et Dawon Kahng : c\'est lui qu\'on trouve par milliards dans les puces.', src: 'Computer History Museum – 1947: Invention of the point-contact transistor', url: 'https://www.computerhistory.org/siliconengine/invention-of-the-point-contact-transistor/' }
});

GAMES.push({
  id: 'telephone', level: 5, onCls: 'a-shake', title: 'Le téléphone', today: ['téléphone intelligent', 'montre connectée', 'tablette'],
  todayLine: 'Des milliards de leviers électriques, et une petite roue qui vibre.',
  closed: { svg: '<rect x="170" y="20" width="140" height="260" rx="22" fill="#111" stroke="#333" stroke-width="3"/><rect x="178" y="34" width="124" height="232" rx="14" fill="url(#gScreen)"/><rect x="220" y="26" width="40" height="6" rx="3" fill="#333"/>', say: 'Collé, scellé, avec des vis spéciales. Je suis pas supposé savoir ce qu\'il y a dedans.' },
  intro: 'Remonte le téléphone ouvert : la réserve, le cerveau, la petite roue, l\'écran.',
  base: '<rect x="160" y="14" width="160" height="272" rx="24" fill="url(#gAluD)" stroke="#555" stroke-width="3"/><rect x="172" y="26" width="136" height="248" rx="16" fill="#1e2226"/>'
    + '<rect x="186" y="40" width="108" height="70" rx="4" fill="url(#gPcb)"/>' + [196, 214, 232, 270].map(x => `<rect x="${x}" y="50" width="12" height="10" fill="#111"/>`).join('')
    + '<g class="out"><text x="400" y="140" class="lbl" text-anchor="middle">Appel entrant :</text><text x="400" y="162" class="lbl" text-anchor="middle">ça vibre!</text></g>',
  slots: [
    { id: 'bat', x: 240, y: 190, w: 110, h: 120, label: '① la réserve', ok: 'batterie', missing: 'Sans batterie, rien ne s\'allume.', wrong: 'Ici, il faut la batterie plate.' },
    { id: 'puce', x: 240, y: 84, w: 40, h: 40, label: '② le cerveau', ok: 'puce', missing: 'Le courant arrive, mais aucune puce ne décide quoi faire de l\'appel.', wrong: 'Ici, sur la carte, il faut la puce.' },
    { id: 'vib', x: 274, y: 254, w: 36, h: 30, label: '③ ce qui vibre', ok: 'vibreur', missing: 'L\'appel arrive en silence : rien ne fait vibrer le téléphone.', wrong: 'Ici, il faut le petit moteur à masse décentrée.' },
    { id: 'ecr', x: 240, y: 150, w: 136, h: 248, hit: [330, 120, 110, 50], label: '④ l\'écran tactile', ok: 'ecran', missing: 'Le téléphone vibre, mais rien ne s\'affiche et tu ne peux pas répondre.', wrong: 'Il faut l\'écran tactile.', top: true }
  ],
  parts: [
    { id: 'batterie', name: 'Batterie', vb: '-55 -60 110 120', svg: '<rect x="-52" y="-56" width="104" height="112" rx="6" fill="url(#gPlB)" stroke="#000"/><rect x="-40" y="-40" width="80" height="20" rx="3" fill="#fff" opacity=".85"/><text x="0" y="-26" text-anchor="middle" font-size="9" fill="#333">Li-ion 3,85 V</text>' },
    { id: 'puce', name: 'Puce', vb: '-20 -20 40 40', svg: '<rect x="-16" y="-16" width="32" height="32" rx="2" fill="url(#gChip)" stroke="#555"/><rect x="-10" y="-10" width="20" height="20" fill="url(#gSilicon)"/><g class="out a-blink"><rect x="-10" y="-10" width="20" height="20" fill="#ffd166" opacity=".35"/></g>' },
    { id: 'vibreur', name: 'Vibreur à masse décentrée', vb: '-18 -15 36 30', svg: '<rect x="-14" y="-7" width="20" height="14" rx="6" fill="url(#gSteel)" stroke="#555"/><g transform="translate(9 0)"><g class="a-spin-fast"><path d="M0 0 L0 -8 A8 8 0 0 1 8 0z" fill="url(#gBrass)" stroke="#7a5a1c"/><circle r="9" fill="none"/></g></g>' },
    { id: 'vibcentre', name: 'Vibreur à masse centrée', vb: '-18 -15 36 30', svg: '<rect x="-14" y="-7" width="20" height="14" rx="6" fill="url(#gSteel)" stroke="#555"/><circle cx="9" r="7" fill="url(#gBrass)" stroke="#7a5a1c"/>', why: 'Une masse bien centrée tourne sans secouer : le téléphone ne vibre pas. C\'est le déséquilibre de la petite roue qui fait trembler tout le boîtier.' },
    { id: 'ecran', name: 'Écran tactile', vb: '-68 -124 136 248', svg: '<g class="screen"><rect x="-68" y="-124" width="136" height="248" rx="16" fill="url(#gScreen)" opacity=".92"/><g class="out"><circle cy="-20" r="22" fill="#3c9" /><text y="30" text-anchor="middle" font-size="12" fill="#fff">Grand-maman</text></g></g>' }
  ],
  steps: ['La batterie fournit le courant.', 'La puce reçoit l\'appel : des milliards de transistors, des leviers électriques, s\'ouvrent et se ferment en chaîne.', 'Elle allume le vibreur : une petite roue déséquilibrée tourne et secoue tout le téléphone.', 'L\'écran s\'allume. Ton doigt, en touchant la vitre, change un peu la charge électrique à cet endroit : la puce sait où tu as appuyé.'],
  win: 'Batterie, puce, roue, écran : ton téléphone, c\'est la chaîne du début, cachée dans une boîte scellée. Maintenant, tu sais ce qu\'il y a dedans.',
  fact: { t: 'La puce A17 Pro de l\'iPhone 15 Pro (2023) contient environ 19 milliards de transistors. Beaucoup de téléphones vibrent avec un petit moteur à masse décentrée; d\'autres, dont les iPhone récents, utilisent un vibreur linéaire, une masse sur ressort poussée par un électroaimant.', src: 'Texas Instruments – Haptics: ERM et LRA', url: 'https://www.ti.com/lit/an/sloa207a/sloa207a.pdf' }
});
})();

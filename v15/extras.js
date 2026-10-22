/* Petits engrenages d'illustration + liste des sources générée à partir des jeux. */
(() => {
const { gear } = D;
const put = (sel, list) => document.querySelectorAll(sel).forEach(g => g.innerHTML = list.map(([x, y, r, n, cls, fill]) => `<g transform="translate(${x} ${y})">${gear(r, n, { cls, fill })}</g>`).join(''));
put('.js-gears', [[80, 66, 44, 30, 'a-spin-slow', 'gBrass'], [151.5, 66, 22, 15, 'a-spin-rev2', 'gSteel']]);
put('.js-gears2', [[150, 72, 14, 10, 'a-spin-fast', 'gSteel'], [180, 72, 14, 10, 'a-spin-rev', 'gBrass']]);
put('.js-gears3', [[95, 68, 26, 18, 'a-spin-slow', 'gBrass'], [137.4, 68, 14, 10, 'a-spin-rev2', 'gSteel']]);
const ul = document.querySelector('.srclist'); if (!ul) return;
const seen = new Set();
GAMES.filter(g => g.fact).forEach(g => { if (seen.has(g.fact.url)) return; seen.add(g.fact.url); const li = document.createElement('li'); li.innerHTML = `<b>${g.title}</b> : <a href="${g.fact.url}" target="_blank" rel="noopener">${g.fact.src}</a>`; ul.appendChild(li); });
})();

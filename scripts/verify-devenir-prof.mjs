import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const lire = (p) => readFileSync(fileURLToPath(new URL('../public/' + p, import.meta.url)), 'utf8');
const html = lire('devenir-prof.html');
const css = lire('css/prof-gpt11.css');
const texte = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
let n = 0;
const ok = (cond, msg) => { assert.ok(cond, msg); n++; };

ok(texte.includes('Enseignez près de chez vous. Vous êtes payé selon les progrès de vos élèves.'),
  'Accroche absente');
ok(html.includes('href="/get-app-kalmeurs/"') && texte.includes('Télécharger Kalmeurs'),
  'Lien Télécharger Kalmeurs absent');
for (const etape of ['Votre identité', 'Votre BAC', 'Un test validé', 'Vos engagements signés']) {
  ok(texte.includes(etape), 'Étape absente : ' + etape);
}
ok(/série/.test(texte) && /attestation/.test(texte) && /bulletin de Terminale est recommandé/.test(texte),
  'Détail BAC incomplet');
ok(texte.includes('récompense les résultats') && texte.includes('statut de professeur peut être réexaminé') &&
  texte.includes("Toutes les règles sont détaillées dans l'application Kalmeurs"), 'Bloc résultats incomplet');
ok(texte.includes('De la ponctualité, un rapport après chaque séance, et du sérieux.'),
  'Phrase des attentes absente');
ok(/<section[^>]*id="simulateur-prof"/.test(html) && /<div id="simulateur-prof-montage"[^>]*data-okalm-simulateur-prof[^>]*><\/div>/.test(html),
  'Emplacement simulateur absent');
ok(html.includes('src="/js/okalm-prix.js"') && html.includes('src="/js/simulateur-prof.js"'),
  'Scripts simulateur non référencés');
for (const id of ['preparer', 'gains', 'faq', 'telecharger', 'attentes']) {
  ok(html.includes('id="' + id + '"'), 'Ancre absente : ' + id);
}
for (const m of html.matchAll(/href="#([^"]+)"/g)) ok(html.includes('id="' + m[1] + '"'), 'Ancre cassée : #' + m[1]);
ok(html.includes('class="topbar"') && html.includes('class="foot"') && html.includes('/2026.css'),
  'En-tête ou pied de page différent');
ok(!/Okalm CI|Okalm <span/.test(html), 'Marque non écrite OKALM CI');
ok(!/<!--/.test(html) && !/\/\*/.test(css), 'Commentaire présent');

const interdits = [
  /\d+\s*%/, /pour\s*cent/i, /\bcommission/i, /\bbarème/i, /\bcarton/i, /\bscore/i,
  /\bseuil/i, /\bsanction/i, /\bpénalit/i, /\breports?\b/i, /\bavertissement/i,
  /\b(rouge|orange|vert|jaune|violet)e?s?\b/i, /\bformule\b/i, /\bnote minimale/i,
  /\bsur\s*20\b/i, /\/\s*20\b/, /\d+\s*F\b/, /FCFA/i, /\bmissions?\b/i, /\battribution/i,
  /\béligibilit/i, /plein tarif/i, /enfant le plus/i,
];
for (const motif of interdits) ok(!motif.test(texte), 'Mention interne interdite : ' + motif);

console.log('Page professeurs : ' + n + ' contrôles réussis, 0 échec.');

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const root = resolve(fileURLToPath(new URL('../public/', import.meta.url)));
const lire = (name) => readFileSync(resolve(root, name), 'utf8');
const pages = [
  'index.html', 'support.html', 'devenir-prof.html',
  'privacy.html', 'terms.html', 'suppression-compte.html',
  'get-app-okalm/index.html', 'get-app-kalmeurs/index.html',
];
const contenus = Object.fromEntries(pages.map((page) => [page, lire(page)]));
const index = contenus['index.html'];
let controles = 0;
const verifier = (cond, message) => {
  assert.ok(cond, message);
  controles++;
};

for (const [libelle, montant] of [
  ['Primaire', '36 000 F'],
  ['Collège', '72 000 F'],
  ['Lycée', '120 000 F'],
]) {
  verifier(index.includes(libelle) && index.includes(montant),
    'Tarif standard absent : ' + libelle);
}
for (const prix of ['3 000 F', '4 000 F', '5 000 F',
  '54 000 F', '96 000 F', '160 000 F']) {
  verifier(index.includes(prix), 'Tarif/option absent : ' + prix);
}
verifier(index.includes('84 000 F') && index.includes('108 000 F'),
  'Exemple famille commun/séparé absent');
verifier(index.includes('1 000 F/h'), 'Supplément commun absent');
verifier(index.includes('Se connecter') && index.includes('account-link'),
  'Connexion accessible absente');
verifier(index.includes('Commander un cours à domicile') &&
  index.includes('href="/get-app-okalm/"'), 'Accès commande Android absent');
verifier(index.includes('id="parrainage"') &&
  index.includes('sans vous connecter'), 'Présentation publique absente');
verifier(index.includes('Activation en préparation') &&
  index.includes('Après activation du programme'), 'Parrainage annoncé comme déjà actif');
verifier(index.includes('frais de réception de 1 % (50 F pour 5 000 F)') &&
  index.includes('4 950 F') && index.includes('ne déduit pas ces frais une seconde fois'),
  'Frais de réception du parrainage incomplets');
verifier(!index.includes('Treize communes') &&
  index.includes("L'application vérifie l'ouverture réelle"),
  'Ouverture des communes présentée comme garantie');
verifier(!index.includes('100<span> %</span>') &&
  !index.includes('Primaire ouvert à tous') &&
  !contenus['devenir-prof.html'].includes('ouvert à tous nos professeurs'),
  'Qualification universelle non étayée');
verifier(contenus['devenir-prof.html'].includes('6 h au lycée'),
  'Volume lycée obsolète sur la page Kalmeurs');
verifier(index.includes('120 minutes au lycée'),
  'Première séance lycée incorrecte');
verifier(contenus['support.html'].includes('120 minutes au lycée'),
  'Aide non alignée');
verifier(contenus['devenir-prof.html'].includes('6 h au lycée'),
  'Durée professeur non alignée');
verifier(contenus['privacy.html'].includes('durée variable selon la classe'),
  'Durée confidentialité non alignée');
verifier(contenus['terms.html'].includes('cycle de 28 jours'),
  'Unité contractuelle non alignée');

for (const page of pages) {
  const html = contenus[page];
  verifier(!/au\s*calme/i.test(html.replace(/logo-au-calme|telecharger-au-calme/gi, '')),
    'Marque phonétique dans ' + page);
}
for (const match of index.matchAll(/href="#([^"]+)"/g)) {
  verifier(index.includes('id="' + match[1] + '"'),
    'Ancre absente : #' + match[1]);
}
console.log('Offre site : ' + controles + ' contrôles réussis, 0 échec.');

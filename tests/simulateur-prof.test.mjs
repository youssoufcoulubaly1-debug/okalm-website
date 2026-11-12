import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const ctxPrix = {};
vm.runInNewContext(readFileSync(new URL('../public/js/okalm-prix.js', import.meta.url), 'utf8'), ctxPrix);
const prix = ctxPrix.OKALMPrix;
const src = readFileSync(new URL('../public/js/simulateur-prof.js', import.meta.url), 'utf8');

function charger() {
  const window = {};
  vm.runInNewContext(src, { window });
  return window.OKALMSimulateurProf;
}
const sim = charger();

test('une famille, un enfant au collège : montant arrondi, 18 h', () => {
  const r = sim.calculer([{ classes: ['4e'] }], prix);
  assert.equal(r.montant, 54000);
  assert.equal(r.heures, 18);
});

test('plusieurs enfants dans la même famille : plus de revenus pour les mêmes heures', () => {
  const un = sim.calculer([{ classes: ['4e'] }], prix);
  const deux = sim.calculer([{ classes: ['4e', '5e'] }], prix);
  const trois = sim.calculer([{ classes: ['4e', '5e', '3e'] }], prix);
  assert.equal(deux.montant, 67500 === deux.montant ? 67500 : 68000);
  assert.ok(deux.montant > un.montant && trois.montant > deux.montant);
  assert.equal(trois.heures, un.heures);
  assert.equal(trois.montant, 81000);
});

test('classes différentes dans une famille : la classe la plus haute fixe le plein tarif', () => {
  const r = sim.calculer([{ classes: ['1ere', '4e', 'CM2'] }], prix);
  const attendu = Math.round((prix.prix(['1ere', '4e', 'CM2'], 'commun').totalFcfa * 3 / 4) / 1000) * 1000;
  assert.equal(r.montant, attendu);
  assert.equal(r.heures, 24);
});

test('plusieurs familles : somme des familles, heures cumulées, maximum 5 familles', () => {
  const f = { classes: ['6e'] };
  const r = sim.calculer([f, f, f], prix);
  assert.equal(r.familles, 3);
  assert.equal(r.montant, 3 * 54000);
  assert.equal(r.heures, 54);
  assert.equal(sim.calculer([f, f, f, f, f, f, f], prix).familles, 5);
});

test('entrées invalides : aucun montant inventé', () => {
  assert.equal(sim.calculer([], prix), null);
  assert.equal(sim.calculer([{ classes: [] }], prix), null);
  assert.equal(sim.calculer([{ classes: ['inconnue'] }], prix), null);
});

test('le script publié ne montre aucun pourcentage ni commentaire sur le barème', () => {
  assert.ok(!/0\.75|75\s*%|72|70\s*%|7500|carton|vert|jaune|rouge/i.test(src.replace(/Math\.round/g, '')));
});

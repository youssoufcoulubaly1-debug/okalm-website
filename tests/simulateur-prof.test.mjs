import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import vm from 'node:vm';

const src = readFileSync(new URL('../public/js/simulateur-prof.js', import.meta.url), 'utf8');

const appels = [];
const prixMock = {
  prixFamille(enfants, mode) {
    appels.push(mode);
    const r = (c) => ['CP1','CP2','CE1','CE2','CM1','CM2','6e','5e','4e','3e','2nde','1ere','Tle'].indexOf(c);
    const lignes = enfants.map((e) => {
      const k = r(e.classe);
      const dureeHebdoMinutes = (k < 6 ? 2 : 3) * (k < 10 ? 90 : 120);
      return { ...e, k, dureeHebdoMinutes, plein: k < 6 ? 3000 : k < 10 ? 4000 : 5000 };
    });
    const aine = lignes.reduce((a, l, i) => (l.k > lignes[a].k ? i : a), 0);
    const montantTotalFcfa = lignes.reduce((s, l, i) =>
      s + l.dureeHebdoMinutes * 4 * (mode === 'separe' || i === aine ? l.plein : 1000) / 60, 0);
    return { lignes, montantTotalFcfa };
  }
};

function charger(window = {}) {
  vm.runInNewContext(src, { window });
  return window.OKALMSimulateurProf;
}

function chargerCjs(url, deps) {
  const module = { exports: {} };
  vm.runInNewContext(readFileSync(url, 'utf8'), {
    module, exports: module.exports, require: (n) => deps[n]
  });
  return module.exports;
}

const sources = [['mock', prixMock]];
const refPricing = new URL('../_ref/v2/pricing.js', import.meta.url);
if (existsSync(refPricing)) {
  class ErreurContratV2 extends Error {}
  sources.push(['pricing.js serveur', chargerCjs(refPricing, {
    'node:crypto': { createHash }, './socleContract': { ErreurContratV2 }
  })]);
}
const s1 = new URL('../public/js/okalm-prix.js', import.meta.url);
if (existsSync(s1)) {
  const w = {};
  try {
    vm.runInNewContext(readFileSync(s1, 'utf8'), { window: w, self: w });
  } catch (e) {
    test('module S1 chargeable en script navigateur', () => { throw e; });
  }
  if (w.OKALMPrix) sources.push(['module S1', w.OKALMPrix]);
}

for (const [nom, prix] of sources) {
  test(`${nom} : 18 h collège, 1/2/3 enfants`, () => {
    const S = charger({ OKALMPrix: prix });
    const attendu = [1, 2, 3].map((n) => (4000 * 18 + (n - 1) * 1000 * 18) * 3 / 4);
    [1, 2, 3].forEach((n, i) => {
      const r = S.calculer([{ niveau: 'college', enfants: n }]);
      assert.equal(r.montant, attendu[i]);
      assert.equal(r.heures, 18);
    });
  });

  test(`${nom} : heures cumulées par famille, jamais multipliées par enfant`, () => {
    const S = charger({ OKALMPrix: prix });
    const r = S.calculer([
      { niveau: 'primaire', enfants: 1 }, { niveau: 'college', enfants: 2 }, { niveau: 'lycee', enfants: 3 }
    ]);
    assert.equal(r.heures, 12 + 18 + 24);
    assert.equal(r.familles, 3);
    assert.equal(r.montant % 500, 0);
    assert.equal(r.montant, Math.floor((36000 + 90000 + 168000) * 3 / 4 / 500) * 500);
  });
}

test('mode commun toujours demandé au module prix', () => {
  appels.length = 0;
  charger({ OKALMPrix: prixMock }).calculer([{ niveau: 'lycee', enfants: 2 }, { niveau: 'primaire', enfants: 1 }]);
  assert.deepEqual(appels, ['commun', 'commun']);
});

test('bornes : 5 familles max, 1 à 3 enfants, niveau inconnu ramené à collège', () => {
  const S = charger({ OKALMPrix: prixMock });
  const r = S.calculer(Array.from({ length: 6 }, () => ({ niveau: 'lycee', enfants: 9 })));
  assert.equal(r.familles, 5);
  assert.equal(r.heures, 120);
  assert.equal(S.calculer([{ niveau: 'lycee', enfants: 0 }]).montant, S.calculer([{ niveau: 'lycee', enfants: 1 }]).montant);
  assert.equal(S.calculer([{ niveau: 'toString', enfants: 1 }]).heures, 18);
  assert.equal(S.calculer([]), null);
});

test('module prix absent, invalide ou en erreur : aucun calcul local', () => {
  const f = [{ niveau: 'college', enfants: 1 }];
  assert.equal(charger({}).calculer(f), null);
  assert.equal(charger({ OKALMPrix: { prixFamille: () => ({ montantTotalFcfa: 'x' }) } }).calculer(f), null);
  assert.equal(charger({ OKALMPrix: { prixFamille: () => ({ montantTotalFcfa: 72000 }) } }).calculer(f), null);
  assert.equal(charger({ OKALMPrix: { prixFamille: () => { throw new Error('x'); } } }).calculer(f), null);
});

test('formatage des milliers avec espace insécable', () => {
  assert.equal(charger({}).formater(81000), '81 000');
});

test('aucune donnée interne dans le code public', () => {
  for (const interdit of ['0.75', '.75', '7500', '75%', '75 %', '72', '70 %', '54000', '67500', '81000',
    'pourcent', 'barème', 'bareme', 'carton', 'vert', 'rouge', 'jaune', 'plein tarif', '1000', '14/20', 'Okalm CI']) {
    assert.ok(!src.includes(interdit), `présence interdite : ${interdit}`);
  }
  assert.ok(!/\/\/|\/\*/.test(src.replace(/https?:\/\//g, '')), 'aucun commentaire');
  assert.ok(src.includes('Plusieurs enfants dans la même heure = plus de revenus'));
  assert.ok(src.includes('Frais Wave') && src.includes('Versement chaque semaine'));
  assert.ok(src.includes('Jusqu’à environ ') && src.includes(' F par cycle de 28 jours'));
});

test('snippet et CSS sans données interdites, marque en majuscules', () => {
  const snippet = readFileSync(new URL('../docs/relais-qualif/SNIPPET-SIMULATEUR-GPT11.html', import.meta.url), 'utf8');
  const css = readFileSync(new URL('../public/js/simulateur-prof.css', import.meta.url), 'utf8');
  const visible = snippet.replace(/<!--[\s\S]*?-->/g, '');
  for (const [nom, t] of [['snippet', visible], ['css', css]]) {
    for (const interdit of ['0.75', '7500', '75%', '75 %', '54000', '67500', '81000', '54 000', 'Okalm CI', 'carton', 'barème']) {
      assert.ok(!t.includes(interdit), `${nom} : ${interdit}`);
    }
  }
  assert.ok(visible.includes('OKALM CI') && visible.includes('data-okalm-simulateur-prof'));
});

"use strict";
// Parité du module navigateur public/js/okalm-prix.js avec functions/src/v2/pricing.js (serveur).
// Source serveur : variable OKALM_PRICING_JS, sinon _ref/v2/pricing.js, sinon le worktree s34.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const RACINE = path.resolve(__dirname, "..");
const CANDIDATS = [
  process.env.OKALM_PRICING_JS,
  path.join(RACINE, "_ref", "v2", "pricing.js"),
  "C:\\Users\\HP\\okalm-workspace\\_gpt2-release-worktrees\\s34-admin-combined-20261110\\functions\\src\\v2\\pricing.js",
].filter(Boolean);
const CHEMIN_SERVEUR = CANDIDATS.find((p) => fs.existsSync(p));

function chargerModuleNavigateur() {
  const code = fs.readFileSync(path.join(RACINE, "public", "js", "okalm-prix.js"), "utf8");
  const fenetre = vm.createContext({});
  vm.runInContext("var window = globalThis;", fenetre);
  vm.runInContext(code, fenetre);
  assert.ok(vm.runInContext("window.OKALMPrix", fenetre), "window.OKALMPrix doit être exposé");
  const viaModule = { exports: {} };
  new Function("module", "exports", code)(viaModule, viaModule.exports);
  assert.equal(typeof viaModule.exports.prix, "function", "export CommonJS attendu");
  return viaModule.exports;
}

// pricing.js dépend de ./socleContract (schéma complet) uniquement pour sa classe d'erreur.
function chargerServeur(chemin) {
  const code = fs.readFileSync(chemin, "utf8");
  class ErreurContratV2 extends Error {}
  const mod = { exports: {} };
  const requireLocal = (id) => (id === "./socleContract" ? { ErreurContratV2 } : require(id));
  new Function("require", "module", "exports", code)(requireLocal, mod, mod.exports);
  return mod.exports;
}

const P = chargerModuleNavigateur();
const CLASSES = P.CLASSES;

function grille() {
  const cas = [];
  for (const a of CLASSES) cas.push([a]);
  for (const a of CLASSES) for (const b of CLASSES) cas.push([a, b]);
  for (const a of CLASSES) for (const b of CLASSES) for (const c of CLASSES) cas.push([a, b, c]);
  return cas;
}

test("exemples de référence : 1re + 4e + CM2", () => {
  const r = P.comparer(["1ere", "4e", "CM2"]);
  assert.equal(r.communFcfa, 150000);
  assert.equal(r.separeFcfa, 228000);
  assert.equal(r.economieFcfa, 78000);
  assert.equal(P.prix(["1ère", "4e", "CM2"]).totalFcfa, 150000);
});

test("même niveau, 1 à 3 enfants (contrôle direct)", () => {
  assert.deepEqual([1, 2, 3].map((n) => P.prix(Array(n).fill("CM1")).totalFcfa), [36000, 48000, 60000]);
  assert.deepEqual([1, 2, 3].map((n) => P.prix(Array(n).fill("4e")).totalFcfa), [72000, 90000, 108000]);
  assert.deepEqual([1, 2, 3].map((n) => P.prix(Array(n).fill("Tle")).totalFcfa), [120000, 144000, 168000]);
});

test("entrées invalides refusées", () => {
  assert.throws(() => P.prix([]));
  assert.throws(() => P.prix(["CP1", "CP1", "CP1", "CP1"]));
  assert.throws(() => P.prix(["7e"]));
  assert.throws(() => P.prix(["CP1"], "intensif"));
  assert.equal(P.classeValide("Terminale"), true);
  assert.equal(P.classeValide("X"), false);
});

test("parité exhaustive avec pricing.js serveur (1 à 3 enfants, commun et séparé)",
  { skip: CHEMIN_SERVEUR ? false : "pricing.js serveur introuvable (définir OKALM_PRICING_JS)" }, () => {
    const S = chargerServeur(CHEMIN_SERVEUR);
    let n = 0;
    for (const classes of grille()) {
      const enfants = classes.map((classe, i) => ({ eleveId: "e" + i, classe }));
      for (const mode of ["commun", "separe"]) {
        const attendu = S.prixFamille(enfants, mode);
        const obtenu = P.prix(classes, mode);
        assert.equal(obtenu.totalFcfa, attendu.montantTotalFcfa, mode + " " + classes.join("+"));
        assert.deepEqual(obtenu.enfants.map((e) => e.montantFcfa),
          attendu.lignes.map((l) => l.prixEnfantCycleFcfa), mode + " " + classes.join("+"));
        assert.deepEqual(obtenu.enfants.map((e) => e.heures),
          attendu.lignes.map((l) => l.dureeHebdoMinutes * 4 / 60), mode + " " + classes.join("+"));
        n++;
      }
      const c = P.comparer(classes);
      assert.equal(c.economieFcfa, S.prixFamille(enfants, "separe").montantTotalFcfa -
        S.prixFamille(enfants, "commun").montantTotalFcfa);
    }
    assert.equal(n, 2 * (13 + 13 ** 2 + 13 ** 3));
    assert.equal(S.prixFamille([{ eleveId: "a", classe: "1ere" }, { eleveId: "b", classe: "4e" },
      { eleveId: "c", classe: "CM2" }], "commun").montantTotalFcfa, 150000);
    assert.equal(S.prixFamille([{ eleveId: "a", classe: "1ere" }, { eleveId: "b", classe: "4e" },
      { eleveId: "c", classe: "CM2" }], "separe").montantTotalFcfa, 228000);
  });

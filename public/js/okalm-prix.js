/* OKALM CI - module de prix du site. Utilisation : <script src="/js/okalm-prix.js"></script> puis window.OKALMPrix. */
(function (racine) {
  "use strict";

  var CLASSES = ["CP1", "CP2", "CE1", "CE2", "CM1", "CM2", "6e", "5e", "4e", "3e", "2nde", "1ere", "Tle"];
  var LIBELLES = ["CP1", "CP2", "CE1", "CE2", "CM1", "CM2", "6e", "5e", "4e", "3e", "2nde", "1re", "Terminale"];
  var BORNES = [6, 10];
  var NIVEAUX = ["primaire", "college", "lycee"];
  var K = [[180, 3000], [270, 4000], [360, 5000]];
  var J = 1000;
  var S = 4;
  var MODES = ["commun", "separe"];

  function canon(classe) {
    var c = String(classe || "").normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/^terminale$/i, "Tle");
    return c;
  }

  function rangDe(classe) {
    return CLASSES.indexOf(canon(classe));
  }

  function niveauDe(rang) {
    return rang < BORNES[0] ? 0 : rang < BORNES[1] ? 1 : 2;
  }

  function erreur(message) {
    var e = new Error("OKALMPrix: " + message);
    e.name = "ErreurOKALMPrix";
    return e;
  }

  function classeValide(classe) {
    return rangDe(classe) >= 0;
  }

  function prix(classes, mode) {
    var m = mode === undefined ? "commun" : mode;
    if (!Array.isArray(classes) || classes.length < 1 || classes.length > 3) throw erreur("1 à 3 enfants");
    if (MODES.indexOf(m) < 0) throw erreur("mode inconnu");
    var rangs = classes.map(function (c) {
      var r = rangDe(c);
      if (r < 0) throw erreur("classe inconnue");
      return r;
    });
    var tete = 0;
    for (var i = 1; i < rangs.length; i++) if (rangs[i] > rangs[tete]) tete = i;
    var total = 0;
    var enfants = rangs.map(function (r, idx) {
      var n = niveauDe(r);
      var minutes = K[n][0] * S;
      var t = m === "separe" || idx === tete ? K[n][1] : J;
      var montant = minutes * t / 60;
      total += montant;
      return { classe: CLASSES[r], niveau: NIVEAUX[n], heures: minutes / 60, montantFcfa: montant };
    });
    return { mode: m, enfants: enfants, totalFcfa: total };
  }

  function comparer(classes) {
    var commun = prix(classes, "commun").totalFcfa;
    var separe = prix(classes, "separe").totalFcfa;
    return { communFcfa: commun, separeFcfa: separe, economieFcfa: separe - commun };
  }

  function formaterFcfa(montant) {
    return String(Math.round(montant)).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " F";
  }

  function prixFamille(enfants, mode) {
    if (!Array.isArray(enfants)) throw erreur("enfants invalides");
    var ids = new Set();
    var classes = enfants.map(function (e) {
      if (!e || typeof e.eleveId !== "string" || !/^[\w-]{1,150}$/.test(e.eleveId) || ids.has(e.eleveId)) throw erreur("identifiants invalides");
      ids.add(e.eleveId);
      return e.classe;
    });
    var r = prix(classes, mode);
    return { montantTotalFcfa: r.totalFcfa, lignes: r.enfants.map(function (x, i) {
      return { eleveId: enfants[i].eleveId, classe: x.classe, dureeHebdoMinutes: x.heures * 60 / S, prixEnfantCycleFcfa: x.montantFcfa };
    }) };
  }

  var api = Object.freeze({
    CLASSES: Object.freeze(CLASSES.slice()),
    prixFamille: prixFamille,
    LIBELLES: Object.freeze(LIBELLES.slice()),
    classeValide: classeValide,
    prix: prix,
    comparer: comparer,
    formaterFcfa: formaterFcfa
  });

  if (typeof module === "object" && module && typeof module.exports === "object") module.exports = api;
  if (racine) racine.OKALMPrix = api;
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this);

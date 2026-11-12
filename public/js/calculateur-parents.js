(function () {
  "use strict";

  var form = document.getElementById("calc-form");
  var res = document.getElementById("calc-res");
  if (!form || !res) return;

  var lignes = form.querySelectorAll("[data-enfant]");
  var radios = form.querySelectorAll('input[name="nb"]');
  var el = {
    ok: document.getElementById("calc-ok"),
    ko: document.getElementById("calc-ko"),
    seul: document.getElementById("calc-seul"),
    multi: document.getElementById("calc-multi"),
    prixSeul: document.getElementById("calc-prix-seul"),
    commun: document.getElementById("calc-commun"),
    separe: document.getElementById("calc-separe"),
    eco: document.getElementById("calc-eco"),
    ecoBloc: document.getElementById("calc-eco-bloc")
  };
  var jeton = 0;

  function formater(n) {
    return Math.round(n).toLocaleString("fr-FR").replace(/[  ]/g, " ") + " F";
  }

  function nombre() {
    for (var i = 0; i < radios.length; i++) if (radios[i].checked) return Number(radios[i].value);
    return 1;
  }

  function enfants(nb) {
    var liste = [];
    for (var i = 0; i < nb; i++) {
      var s = lignes[i].querySelector("select");
      liste.push({ eleveId: "e" + (i + 1), classe: s.value });
    }
    return liste;
  }

  function montant(r) {
    var v = r && typeof r === "object" ? r.montantTotalFcfa : r;
    v = Number(v);
    if (!isFinite(v) || v < 0) throw new Error("montant");
    return v;
  }

  function demander(liste, mode) {
    var api = window.OKALMPrix;
    if (!api || typeof api.prixFamille !== "function") return Promise.reject(new Error("api"));
    try {
      return Promise.resolve(api.prixFamille(liste, mode)).then(montant);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  function afficher(etat) {
    el.ok.hidden = etat !== "ok";
    el.ko.hidden = etat !== "ko";
    res.setAttribute("aria-busy", "false");
  }

  function calculer() {
    var nb = nombre();
    for (var i = 0; i < lignes.length; i++) {
      var actif = i < nb;
      lignes[i].hidden = !actif;
      lignes[i].querySelector("select").disabled = !actif;
    }
    var liste = enfants(nb);
    var n = ++jeton;
    res.setAttribute("aria-busy", "true");

    Promise.all([demander(liste, "commun"), demander(liste, "separe")]).then(function (v) {
      if (n !== jeton) return;
      var commun = v[0];
      var separe = v[1];
      if (nb === 1) {
        el.prixSeul.textContent = formater(commun);
        el.seul.hidden = false;
        el.multi.hidden = true;
      } else {
        el.commun.textContent = formater(commun);
        el.separe.textContent = formater(separe);
        var eco = separe - commun;
        el.ecoBloc.hidden = !(eco > 0);
        el.eco.textContent = formater(Math.max(eco, 0));
        el.seul.hidden = true;
        el.multi.hidden = false;
      }
      afficher("ok");
    }).catch(function () {
      if (n === jeton) afficher("ko");
    });
  }

  form.addEventListener("change", calculer);
  form.addEventListener("submit", function (e) { e.preventDefault(); calculer(); });

  if (window.OKALMPrix) calculer();
  else window.addEventListener("load", calculer);
})();

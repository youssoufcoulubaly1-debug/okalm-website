/* OKALM CI - accueil parents : blocs de prix (grille et calcul par classe) et communes.
   Les montants viennent de window.OKALMPrix (module testé contre le serveur). */
(function () {
  "use strict";
  var P = window.OKALMPrix;
  if (!P) return;

  var NBSP = " ";
  function fmt(n) {
    return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, NBSP) + NBSP + "F";
  }
  function el(html) {
    var t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }

  var CAT = {
    p: { nom: "Primaire", plage: "CP1 à CM2", seances: 2, classe: "CE1" },
    c: { nom: "Collège", plage: "6e à 3e", seances: 3, classe: "4e" },
    l: { nom: "Lycée", plage: "2nde à Tle", seances: 3, classe: "1ere" }
  };

  /* ---------- Bloc 1 : combien d'enfants à suivre ---------- */
  var grille = document.getElementById("tarifs-grille");
  if (grille) {
    var etat = { n: 2, cat: "c" };
    var rendre = function () {
      var n = etat.n;
      var segs = [1, 2, 3].map(function (i) {
        return '<button type="button" class="g-seg' + (i === n ? " is-on" : "") + '" data-n="' + i + '" aria-pressed="' + (i === n) + '">' + i + " enfant" + (i > 1 ? "s" : "") + "</button>";
      }).join("");
      var cartes = ["p", "c", "l"].map(function (k) {
        var c = CAT[k];
        var cl = new Array(n).fill(c.classe);
        var tot = P.prix(cl, "commun").totalFcfa;
        var sep = P.prix(cl, "separe").totalFcfa;
        var on = etat.cat === k;
        return '<button type="button" class="g-card' + (on ? " is-on" : "") + '" data-k="' + k + '" aria-pressed="' + on + '">' +
          '<span class="g-card__l"><span class="g-cat">' + c.nom + '</span><span class="g-sub">' + c.plage + " · " + c.seances + " séances/sem</span></span>" +
          '<span class="g-card__r"><span class="g-prix">' + fmt(tot) + "</span>" +
          (n > 1 ? '<span class="g-enf">' + fmt(tot / n) + " par enfant</span><span class=\"g-eco\">vous économisez " + fmt(sep - tot) + "</span>"
                 : '<span class="g-enf">par cycle de 28 jours</span>') + "</span></button>";
      }).join("");
      var k = etat.cat, c = CAT[k];
      var cl = new Array(n).fill(c.classe);
      var tot = P.prix(cl, "commun").totalFcfa, sep = P.prix(cl, "separe").totalFcfa;
      var place = k === "c" ? "au collège" : k === "l" ? "au lycée" : "en primaire";
      var ex = n > 1
        ? '<p class="g-ex__t">Exemple : ' + n + " enfants " + place + '</p><p class="g-ex__b"><b>' + fmt(tot) + "</b> au lieu de " + fmt(sep) + ' en suivi séparé.<br><b class="g-ex__big">Vous économisez ' + fmt(sep - tot) + ".</b></p>"
        : '<p class="g-ex__t">Exemple : 1 enfant ' + place + '</p><p class="g-ex__b"><b>' + fmt(tot) + "</b> par cycle. Ajoutez un enfant pour voir l'économie.</p>";
      grille.innerHTML =
        '<div class="g-head"><span class="g-badge">100% TRANSPARENT</span><h3>Combien d\'enfants à suivre ?</h3>' +
        "<p>Touchez le nombre d'enfants et les prix se mettent à jour. Les prix sont donnés pour un cycle de 28 jours, avec un suivi commun pour tous vos enfants. Le suivi commun est limité à 3 enfants.</p>" +
        '<p class="g-cas">Cas d\'enfants de la même catégorie</p><div class="g-cats"><span>Primaire</span><span>Collège</span><span>Lycée</span></div></div>' +
        '<div class="g-segs">' + segs + '</div><div class="g-cards">' + cartes + '</div><div class="g-ex">' + ex + "</div>" +
        '<a class="g-diff" href="#tarifs-calcul"><span><b>Vos enfants sont dans des catégories différentes ?</b><small>Indiquez la classe précise de chacun, nous calculons votre prix tout de suite.</small></span><i aria-hidden="true">↓</i></a>' +
        '<p class="g-note">Économie comparée au suivi séparé (chaque enfant à plein tarif). Le devis exact est confirmé à la commande.</p>' +
        '<a class="g-cta" href="/get-app-okalm/">Commander pour mes enfants</a>';
      grille.querySelectorAll(".g-seg").forEach(function (b) { b.onclick = function () { etat.n = +b.dataset.n; rendre(); }; });
      grille.querySelectorAll(".g-card").forEach(function (b) { b.onclick = function () { etat.cat = b.dataset.k; rendre(); }; });
    };
    rendre();
  }

  /* ---------- Bloc 2 : la classe de chaque enfant ---------- */
  var calcul = document.getElementById("tarifs-calcul");
  if (calcul) {
    var cls = ["1ere", "4e"];
    var rangs = P.CLASSES;
    var lib = P.LIBELLES;
    var options = function (cur) {
      return rangs.map(function (r, i) { return '<option value="' + r + '"' + (r === cur ? " selected" : "") + ">" + lib[i] + "</option>"; }).join("");
    };
    var dessiner = function () {
      var r = P.prix(cls, "commun"), s = P.prix(cls, "separe");
      var tete = 0;
      cls.forEach(function (c, i) { if (rangs.indexOf(c) > rangs.indexOf(cls[tete])) tete = i; });
      var lignes = cls.map(function (c, i) {
        var e = r.enfants[i];
        var badge = i === tete ? '<span class="c-badge">plein tarif</span>' : '<span class="c-h">' + e.heures + " h × 1" + NBSP + "000" + NBSP + "F</span>";
        return '<label class="c-lbl" for="c-sel-' + i + '">ENFANT ' + (i + 1) + '</label><div class="c-sel"><span class="c-v">' + lib[rangs.indexOf(c)] + "</span>" + badge + '<span class="c-chev" aria-hidden="true">⌄</span>' +
          '<select id="c-sel-' + i + '" data-i="' + i + '">' + options(c) + "</select></div>";
      }).join("");
      calcul.innerHTML =
        '<div class="c-head"><h3>Indiquez la classe de vos enfants</h3><p>Choisissez la classe de chaque enfant. Le prix se calcule tout seul.</p></div>' +
        '<div class="c-body">' + lignes +
        '<div class="c-btns">' + (cls.length < 3 ? '<button type="button" class="c-add" data-a="1">+ Ajouter un enfant</button>' : "") +
        (cls.length > 1 ? '<button type="button" class="c-del" data-a="-1">− Retirer un enfant</button>' : "") + "</div>" +
        '<p class="c-max">Le suivi commun est limité à 3 enfants, pour garantir la qualité.</p></div>' +
        '<div class="c-res"><div class="c-res__top"><div class="c-commun"><span>SUIVI COMMUN</span><b>' + fmt(r.totalFcfa) + "</b><small>par cycle de 28 jours</small></div>" +
        '<div class="c-sep"><span>SUIVI SÉPARÉ</span><b>' + fmt(s.totalFcfa) + "</b><small>un suivi pour chaque enfant</small></div></div>" +
        '<div class="c-eco"><small>Avec le suivi commun</small><b>Vous économisez</b><b>' + fmt(s.totalFcfa - r.totalFcfa) + "</b></div></div>" +
        '<p class="c-how">Comment c\'est calculé : l\'enfant de la classe la plus élevée paie le plein tarif ; chaque autre enfant paie 1' + NBSP + "000" + NBSP + "F par heure de cours. Le devis exact est confirmé à la commande.</p>" +
        '<a class="g-cta c-cta" href="/get-app-okalm/">Commander avec ces classes</a>';
      calcul.querySelectorAll("select").forEach(function (sel) { sel.onchange = function () { cls[+sel.dataset.i] = sel.value; dessiner(); }; });
      calcul.querySelectorAll("[data-a]").forEach(function (b) { b.onclick = function () { if (+b.dataset.a > 0) cls.push("CM2"); else cls.pop(); dessiner(); }; });
    };
    dessiner();
  }

  /* ---------- Communes ---------- */
  var zone = document.getElementById("communes-liste");
  if (zone) {
    fetch("/data/communes.json", { cache: "no-cache" }).then(function (r) { return r.json(); }).then(function (d) {
      var ouv = Array.isArray(d.ouvertes) ? d.ouvertes : [], bien = Array.isArray(d.bientot) ? d.bientot : [];
      var pil = function (l, c) { return l.map(function (n) { return '<span class="zone ' + c + '">' + n + "</span>"; }).join(""); };
      var h = "";
      if (ouv.length) h += '<p class="zl zl--on">Ouvertes actuellement</p><div class="zones">' + pil(ouv, "zone--on") + "</div>";
      if (bien.length) h += '<p class="zl">' + "Très bientôt disponibles" + '</p><div class="zones">' + pil(bien, "") + "</div>";
      if (h) zone.innerHTML = h;
    }).catch(function () {});
  }
})();

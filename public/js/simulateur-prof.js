(function (root) {
  'use strict';

  var MAX_FAMILLES = 5;
  var MAX_ENFANTS = 3;
  var PAS = 1000;
  var K = [3, 4];

  function part() {
    return K[0] / K[1];
  }

  function calculer(familles, prix) {
    prix = prix || (root.OKALMPrix || null);
    if (!prix || typeof prix.prix !== 'function') return null;
    if (!Array.isArray(familles) || familles.length < 1) return null;
    var liste = familles.slice(0, MAX_FAMILLES);
    var parFamille = [];
    var total = 0;
    var heures = 0;
    for (var i = 0; i < liste.length; i++) {
      var classes = liste[i] && Array.isArray(liste[i].classes) ? liste[i].classes.slice(0, MAX_ENFANTS) : [];
      if (classes.length < 1) return null;
      var r;
      try { r = prix.prix(classes, 'commun'); } catch (e) { return null; }
      if (!r || typeof r.totalFcfa !== 'number' || !isFinite(r.totalFcfa) || r.totalFcfa <= 0) return null;
      var h = 0;
      r.enfants.forEach(function (e) { if (e.heures > h) h = e.heures; });
      var montant = Math.round((r.totalFcfa * part()) / PAS) * PAS;
      parFamille.push(montant);
      total += montant;
      heures += h;
    }
    return { montant: total, heures: heures, parFamille: parFamille, familles: liste.length };
  }

  function formater(n) {
    return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' F';
  }

  function el(tag, attrs, texte) {
    var e = root.document.createElement(tag);
    if (attrs) for (var k in attrs) if (Object.prototype.hasOwnProperty.call(attrs, k)) e.setAttribute(k, attrs[k]);
    if (texte != null) e.textContent = texte;
    return e;
  }

  var uid = 0;

  function monter(conteneur) {
    if (!conteneur || conteneur.getAttribute('data-sim-pret') === '1') return;
    var P = root.OKALMPrix;
    if (!P) return;
    conteneur.setAttribute('data-sim-pret', '1');
    var etat = [{ classes: ['4e', 'CM2'] }];

    var lignes = el('div', { 'class': 'sp-familles' });
    var actions = el('div', { 'class': 'sp-actions' });
    var ajouterF = el('button', { type: 'button', 'class': 'sp-btn sp-btn--plein' }, '+ Ajouter une famille');
    var retirerF = el('button', { type: 'button', 'class': 'sp-btn' }, '− Retirer une famille');
    actions.appendChild(ajouterF);
    actions.appendChild(retirerF);

    var sortie = el('div', { 'class': 'sp-res', 'aria-live': 'polite' });
    var lab = el('p', { 'class': 'sp-res__lab' }, 'PAR CYCLE DE 28 JOURS');
    var montant = el('p', { 'class': 'sp-res__montant' });
    var heures = el('p', { 'class': 'sp-res__h' });
    sortie.appendChild(lab);
    sortie.appendChild(montant);
    sortie.appendChild(heures);
    var note = el('p', { 'class': 'sp-note' }, 'Ce montant est une estimation. Il dépend des résultats de vos élèves. Vous êtes payé chaque semaine. Avec plusieurs enfants dans la même heure, vous gagnez davantage.');

    conteneur.appendChild(lignes);
    conteneur.appendChild(actions);
    conteneur.appendChild(sortie);
    conteneur.appendChild(note);

    function rendre() {
      var r = calculer(etat);
      lignes.textContent = '';
      etat.forEach(function (f, i) {
        var carte = el('fieldset', { 'class': 'sp-fam' });
        var tete = el('legend', { 'class': 'sp-fam__t' });
        tete.appendChild(el('span', null, 'Famille ' + (i + 1)));
        var m = el('b', null, r ? formater(r.parFamille[i]) : '');
        tete.appendChild(m);
        carte.appendChild(tete);
        f.classes.forEach(function (c, j) {
          var id = 'sp-' + (++uid);
          carte.appendChild(el('label', { 'class': 'sp-lbl', 'for': id }, 'ENFANT ' + (j + 1)));
          var s = el('select', { id: id, 'class': 'sp-sel' });
          P.CLASSES.forEach(function (cl, k) {
            var o = el('option', { value: cl }, P.LIBELLES[k]);
            if (cl === c) o.selected = true;
            s.appendChild(o);
          });
          s.addEventListener('change', function (ev) { etat[i].classes[j] = ev.target.value; rendre(); });
          carte.appendChild(s);
        });
        var b = el('div', { 'class': 'sp-btns' });
        if (f.classes.length < MAX_ENFANTS) {
          var a = el('button', { type: 'button', 'class': 'sp-btn sp-btn--plein' }, '+ Ajouter un enfant');
          a.addEventListener('click', function () { etat[i].classes.push('CM2'); rendre(); });
          b.appendChild(a);
        }
        if (f.classes.length > 1) {
          var d = el('button', { type: 'button', 'class': 'sp-btn' }, '− Retirer un enfant');
          d.addEventListener('click', function () { etat[i].classes.pop(); rendre(); });
          b.appendChild(d);
        }
        carte.appendChild(b);
        lignes.appendChild(carte);
      });
      ajouterF.disabled = etat.length >= MAX_FAMILLES;
      retirerF.hidden = etat.length <= 1;
      if (!r) {
        montant.textContent = 'Simulation momentanément indisponible.';
        heures.textContent = '';
        return;
      }
      montant.textContent = 'jusqu’à environ ' + formater(r.montant);
      heures.textContent = 'pour ' + r.heures + ' h de cours';
    }

    ajouterF.addEventListener('click', function () { if (etat.length < MAX_FAMILLES) { etat.push({ classes: ['6e'] }); rendre(); } });
    retirerF.addEventListener('click', function () { if (etat.length > 1) { etat.pop(); rendre(); } });
    rendre();
  }

  function init() {
    var c = root.document && root.document.querySelector('[data-okalm-simulateur-prof]');
    if (c) monter(c);
  }

  var api = { calculer: calculer, formater: formater, monter: monter };
  root.OKALMSimulateurProf = api;
  if (root.document) {
    if (root.document.readyState === 'loading') root.document.addEventListener('DOMContentLoaded', init);
    else init();
  }
})(typeof window !== 'undefined' ? window : this);

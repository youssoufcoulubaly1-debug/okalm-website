(function (root) {
  'use strict';

  var NIVEAUX = {
    primaire: { libelle: 'Primaire', classe: 'CE2' },
    college: { libelle: 'Collège', classe: '5e' },
    lycee: { libelle: 'Lycée', classe: '2nde' }
  };
  var MAX_FAMILLES = 5;
  var MAX_ENFANTS = 3;
  var PAS = 500;
  var K = [3, 4];

  function part() {
    return K[0] / K[1];
  }

  function borne(n, min, max) {
    n = parseInt(n, 10);
    if (isNaN(n)) n = min;
    return Math.min(max, Math.max(min, n));
  }

  function famille(prix, niveau, enfants) {
    var liste = [];
    for (var i = 0; i < enfants; i++) liste.push({ eleveId: 'e' + (i + 1), classe: NIVEAUX[niveau].classe });
    var r;
    try { r = prix.prixFamille(liste, 'commun'); } catch (e) { return null; }
    if (!r || typeof r.montantTotalFcfa !== 'number' || !isFinite(r.montantTotalFcfa) || r.montantTotalFcfa <= 0) return null;
    var minutes = 0;
    if (Array.isArray(r.lignes)) {
      r.lignes.forEach(function (l) {
        if (l && typeof l.dureeHebdoMinutes === 'number' && l.dureeHebdoMinutes > minutes) minutes = l.dureeHebdoMinutes;
      });
    }
    if (!minutes) return null;
    return { montant: r.montantTotalFcfa, heures: minutes * 4 / 60 };
  }

  function calculer(familles, prix) {
    prix = prix || (root.OKALMPrix || null);
    if (!prix || typeof prix.prixFamille !== 'function') return null;
    if (!Array.isArray(familles) || familles.length < 1) return null;
    var liste = familles.slice(0, MAX_FAMILLES);
    var total = 0;
    var heures = 0;
    for (var i = 0; i < liste.length; i++) {
      var f = liste[i] || {};
      var niveau = Object.prototype.hasOwnProperty.call(NIVEAUX, f.niveau) ? f.niveau : 'college';
      var r = famille(prix, niveau, borne(f.enfants, 1, MAX_ENFANTS));
      if (!r) return null;
      total += r.montant;
      heures += r.heures;
    }
    var montant = Math.floor((total * part()) / PAS) * PAS;
    return { montant: montant, heures: heures, familles: liste.length };
  }

  function formater(n) {
    return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  function el(tag, attrs, texte) {
    var e = root.document.createElement(tag);
    if (attrs) for (var k in attrs) if (Object.prototype.hasOwnProperty.call(attrs, k)) e.setAttribute(k, attrs[k]);
    if (texte != null) e.textContent = texte;
    return e;
  }

  var uid = 0;
  function select(nom, options, valeur, libelle) {
    var id = 'sim-prof-' + nom + '-' + (++uid);
    var champ = el('div', { 'class': 'sim-prof__champ' });
    champ.appendChild(el('label', { 'for': id }, libelle));
    var s = el('select', { id: id, name: nom });
    options.forEach(function (o) {
      var opt = el('option', { value: o[0] }, o[1]);
      if (String(o[0]) === String(valeur)) opt.selected = true;
      s.appendChild(opt);
    });
    champ.appendChild(s);
    return { champ: champ, select: s };
  }

  function monter(conteneur) {
    if (!conteneur || conteneur.getAttribute('data-sim-pret') === '1') return;
    conteneur.setAttribute('data-sim-pret', '1');
    var etat = [{ niveau: 'college', enfants: 1 }];

    var form = el('form', { 'class': 'sim-prof__form', novalidate: '' });
    var lignes = el('div', { 'class': 'sim-prof__familles' });
    var actions = el('div', { 'class': 'sim-prof__actions' });
    var ajouter = el('button', { type: 'button', 'class': 'btn btn--ghost btn--sm sim-prof__ajouter' }, 'Ajouter une famille');
    actions.appendChild(ajouter);
    form.appendChild(lignes);
    form.appendChild(actions);

    var sortie = el('div', { 'class': 'sim-prof__resultat', 'aria-live': 'polite' });
    var montant = el('p', { 'class': 'sim-prof__montant' });
    var heures = el('p', { 'class': 'sim-prof__heures' });
    sortie.appendChild(montant);
    sortie.appendChild(heures);
    sortie.appendChild(el('p', { 'class': 'sim-prof__astuce' }, 'Plusieurs enfants dans la même heure = plus de revenus.'));
    sortie.appendChild(el('p', { 'class': 'sim-prof__note' }, 'Estimation. Frais Wave à votre charge. Versement chaque semaine.'));

    conteneur.appendChild(form);
    conteneur.appendChild(sortie);

    function rendre() {
      lignes.textContent = '';
      etat.forEach(function (f, i) {
        var ligne = el('fieldset', { 'class': 'sim-prof__famille' });
        ligne.appendChild(el('legend', null, 'Famille ' + (i + 1)));
        var sn = select('niveau', [['primaire', 'Primaire'], ['college', 'Collège'], ['lycee', 'Lycée']], f.niveau, 'Niveau');
        var se = select('enfants', [[1, '1 enfant'], [2, '2 enfants'], [3, '3 enfants']], f.enfants, 'Enfants');
        sn.select.addEventListener('change', function (ev) { etat[i].niveau = ev.target.value; maj(); });
        se.select.addEventListener('change', function (ev) { etat[i].enfants = borne(ev.target.value, 1, MAX_ENFANTS); maj(); });
        ligne.appendChild(sn.champ);
        ligne.appendChild(se.champ);
        if (etat.length > 1) {
          var retirer = el('button', { type: 'button', 'class': 'sim-prof__retirer', 'aria-label': 'Retirer la famille ' + (i + 1) }, 'Retirer');
          retirer.addEventListener('click', function () { etat.splice(i, 1); rendre(); ajouter.focus(); });
          ligne.appendChild(retirer);
        }
        lignes.appendChild(ligne);
      });
      ajouter.disabled = etat.length >= MAX_FAMILLES;
      maj();
    }

    function maj() {
      var r = calculer(etat);
      if (!r) {
        montant.textContent = 'Simulation momentanément indisponible.';
        heures.textContent = '';
        return;
      }
      montant.textContent = 'Jusqu’à environ ' + formater(r.montant) + ' F par cycle de 28 jours';
      heures.textContent = 'Pour ' + r.heures + ' h de cours par cycle';
    }

    ajouter.addEventListener('click', function () {
      if (etat.length < MAX_FAMILLES) { etat.push({ niveau: 'college', enfants: 1 }); rendre(); }
    });
    form.addEventListener('submit', function (ev) { ev.preventDefault(); });
    rendre();
  }

  function demarrer() {
    var cibles = root.document.querySelectorAll('[data-okalm-simulateur-prof]');
    for (var i = 0; i < cibles.length; i++) monter(cibles[i]);
  }

  root.OKALMSimulateurProf = { calculer: calculer, monter: monter, formater: formater };

  if (root.document) {
    if (root.document.readyState === 'loading') root.document.addEventListener('DOMContentLoaded', demarrer);
    else demarrer();
  }
})(typeof window !== 'undefined' ? window : this);

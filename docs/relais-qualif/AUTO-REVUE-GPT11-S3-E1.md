# AUTO-REVUE GPT-11 S3 E1 — simulateur revenus professeur
- Créés : public/js/simulateur-prof.js, public/js/simulateur-prof.css, docs/relais-qualif/SNIPPET-SIMULATEUR-GPT11.html, tests/simulateur-prof.test.mjs. Aucun HTML existant modifié.
- Mission et décision du Gérant 12/11 lues (_ref/MISSION.md) : un seul montant « Jusqu’à environ X F par cycle de 28 jours », aucun pourcentage, couleur, carton ni formule.
- 1 à 5 familles, niveau primaire/collège/lycée, 1 à 3 enfants ; heures lues dans le résultat du module prix (dureeHebdoMinutes × 4), cumulées par famille, non multipliées par enfant.
- Prix via window.OKALMPrix.prixFamille(enfants, 'commun'), même signature que pricing.js serveur ; module absent ou en erreur → « Simulation momentanément indisponible », aucun calcul local.
- Part = fraction neutre 3/4 ; aucun littéral 0.75/7500, aucun commentaire ; arrondi au 500 F inférieur. Messages « Plusieurs enfants dans la même heure = plus de revenus », frais Wave, versement chaque semaine.
- Tests : grille 18 h collège 1/2/3 enfants contre un mock, contre _ref/v2/pricing.js (si présent) et contre public/js/okalm-prix.js S1 (si présent après cherry-pick) ; bornes, repli, scan des mots interdits.
- RÉSERVE 1 : exécution de Node refusée par l'exécuteur → tests relus et calculs vérifiés à la main, NON exécutés : lancer `node --test tests/simulateur-prof.test.mjs`.
- RÉSERVE 2 : signature S1 supposée identique à pricing.js ; si S1 diffère, le test « module S1 » échouera après cherry-pick (voulu).

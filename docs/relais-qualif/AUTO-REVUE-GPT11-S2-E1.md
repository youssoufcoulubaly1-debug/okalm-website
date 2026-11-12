# AUTO-REVUE GPT-11 S2 E1 — calculateur parents (12/11/2026)
- Livré : public/calculer-mon-prix.html (/2026.css, /2026.js, style local de la page) et public/js/calculateur-parents.js ; okalm-prix.js non créé (lot S1).
- Contenu : 1 à 3 enfants, une classe par enfant (CP1 à Terminale) ; prix unique pour 1 enfant ; pour 2-3 : commun, séparé barré, économie ; « Prix confirmé à la commande » ; bouton « Commander dans l'app » vers /get-app-okalm/.
- API : window.OKALMPrix.prixFamille(enfants, "commun"|"separe"), enfants [{eleveId:"e1",classe}] ; lecture de montantTotalFcfa, un nombre ou une promesse sont aussi acceptés ; API absente, en erreur ou montant invalide : message neutre, aucun prix inventé.
- RISQUE À VÉRIFIER AVEC S1 : codes de classe envoyés (CP1…CM2, 6EME, 5EME, 4EME, 3EME, 2NDE, 1ERE, TLE) et libellés de mode ("commun", "separe") ; ils sont faciles à aligner dans les attributs value du HTML et dans le JS.
- Aucune formule, aucun taux, barème ni jargon, ni dans le texte, ni dans title/aria, ni en commentaire ; JS public sans commentaire ; marque OKALM CI en majuscules.
- Accessibilité : fieldset/legend, labels, zone aria-live/aria-busy, texte masqué « au lieu de » devant le prix barré, focus visible, cibles de 48 px.
- 320 px : grille sur une colonne, select à 100 %, lignes de prix qui passent à la ligne, marges réduites sous 360 px.
- Tests : contrôles statiques (grep) réussis ; le test DOM simulé .tmp-test-s2.cjs (non commité) n'a pas pu être lancé faute d'autorisation pour exécuter node : à lancer avec `node .tmp-test-s2.cjs`.
- Non fait : index.html, devenir-prof.html et sitemap non modifiés ; mission non lue directement (accès refusé hors du worktree), seul le brief a été appliqué.

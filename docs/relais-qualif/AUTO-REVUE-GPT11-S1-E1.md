# AUTO-REVUE GPT-11 · S1 · E1 (module de prix OKALM CI)
- Fichiers : `public/js/okalm-prix.js` (script classique : `window.OKALMPrix` + `module.exports`), `tests/prix-parite.test.cjs`.
- API : `prix(classes, "commun"|"separe")`, `comparer(classes)` → commun, séparé, économie ; `CLASSES`, `LIBELLES`, `classeValide`, `formaterFcfa`.
- Reproduit `functions/src/v2/pricing.js` (standard, sans intensif), 1 à 3 enfants, CP1 à Tle, normalisation des classes identique.
- Test : parité exhaustive 13 + 13² + 13³ combinaisons × 2 modes (total, montant et heures par enfant), puis 1re+4e+CM2 = 150 000 / 228 000.
- Serveur chargé via `OKALM_PRICING_JS`, puis `_ref/v2/pricing.js`, puis le worktree s34 ; `socleContract` remplacé par sa seule classe d'erreur. Sinon, test sauté avec un message.
- Fichier public : constantes neutres, aucun commentaire sur les règles, aucune page HTML touchée.
- LIMITE : `node --test` bloqué par l'exécuteur dans cette session, donc test NON EXÉCUTÉ, seulement relu à la main. À lancer : `node --test tests/prix-parite.test.cjs`.
- Non commités : `_ref/`, `BRIEF-GPT11-s1.txt`, `*.log`.

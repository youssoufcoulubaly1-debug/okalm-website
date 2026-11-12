# AUTO-REVUE GPT-11 S5 E1 — public/devenir-prof.html
- Fait : accroche imposée, Télécharger Kalmeurs, 4 étapes (identité, BAC série + diplôme/attestation + bulletin de Terminale recommandé, test validé sans seuil, engagements signés), bloc résultats conforme à la décision du Gérant du 12/11, attentes en une phrase, FAQ courte, CTA final ; en-tête/pied identiques ; CSS public/css/prof-gpt11.css.
- Simulateur : `<section id="simulateur-prof">` + `<div id="simulateur-prof-montage"></div>`, scripts /js/okalm-prix.js et /js/simulateur-prof.js référencés (livrés par S3) — structure à confirmer avec S3 après intégration.
- Retirés : pourcentages, montants, couleurs, seuils, cartons, scores, reports, sanctions, « missions », commentaires HTML/CSS.
- Ancres conservées : #preparer, #gains, #faq, #telecharger ; « 6 h au lycée » gardé (exigé par verify-offre).
- Test : `node scripts/verify-devenir-prof.mjs` (contenus requis, motifs interdits, ancres, aucun commentaire).
- LIMITE : exécution de node refusée par les permissions de la session → test NON exécuté ; contrôle manuel des motifs interdits par recherche (0 occurrence).
- Attendu : verify-links signalera /js/*.js absents tant que S3 n'est pas intégré.
- Non touchés : index.html, scripts S3, autres worktrees ; aucun push ni déploiement.

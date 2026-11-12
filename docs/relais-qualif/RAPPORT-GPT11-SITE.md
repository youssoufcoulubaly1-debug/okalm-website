# RAPPORT GPT-11 — SITE OKALM CI (12/11/2026, LOT 5 INCLUS)

**Statut : livré sur branche, non déployé.** Dépôt : `C:\Users\HP\okalm-website`. Branche : `feat/gpt11-site-prof-calculateur-20261112`. **SHA du code et des captures validés : `49f2ee0ef1443d68fc9cd86fc1a3fc991e2186d2`**. Base initiale `83d26ac`. Aucun push, déploiement, ni changement sur `main`.

**Pyramide :** 5 sous-agents démarrés dans 5 worktrees pour le lot 5 ; 3 livraisons exploitées (HTML, CSS, revue croisée). Deux agents de tests ont été interrompus par la limite de l'exécuteur ; les deux contrôles correspondants ont été écrits et exécutés par GPT-11 après fusion. Auto-revues des 3 lots livrés et revue croisée consignées dans `docs/relais-qualif/`.

**Accueil remanié :** ordre vérifié des 10 blocs : bénéfice + 2 CTA + 3 repères ; exemple de rapport visible ; 4 étapes ; professeurs (identité, BAC, test) ; tarifs pour un enfant + calculateur + options examen ; garanties ; communes ; FAQ regroupant les réserves ; dernier appel avec « Pas d'Android ? » ; parrainage en dernier (également dernière entrée du menu). Parrainage annoncé **« Bientôt »**, primes de **5 000 F après première commande payée et confirmée**, puis **5 000 F au renouvellement**. Aucun mécanisme interne de prix, rémunération ou sanction publié. Les pages calculateur et professeurs réalisées précédemment sont conservées.

**Réduction mesurée** par comparaison des PNG Chrome 390 px : hauteur **12 336 → 7 745 px** (**−37,2 %**), soit environ 15 → 9 écrans de 844 px ; largeur inchangée.

**Tests après fusion, tous verts :**
- `node --test tests/prix-parite.test.cjs tests/simulateur-prof.test.mjs` : **12 PASS, 0 FAIL, 0 SKIP** ; parité exhaustive avec `pricing.js` serveur (1 à 3 enfants, 13 classes, commun/séparé). Exemple 1re + 4e + CM2 : **150 000 F / 228 000 F / économie 78 000 F**.
- `node scripts/verify-accueil-lot5.mjs` : **60/60** ; `node scripts/verify-devenir-prof.mjs` : **54/54** ; `node scripts/verify-offre.mjs` : **47/47** ; `node scripts/verify-links.mjs` : **297 liens, 0 défaut**.
- `node scripts/verify-navigation-lot5.mjs` : **320/390/1280 px**, navigation et menu mobile (parrainage dernier), ouverture des options d'examen : **0 échec**.
- `node scripts/verif-visuelle-gpt11.mjs` : Chrome réel sur **3 pages × 4 largeurs (320/390/430/1280 px)** : **12 HTTP 200, 0 erreur JS locale, 0 débordement horizontal** ; simulation parents et professeurs vérifiée.

**Preuves :** `docs/relais-qualif/preuves-gpt11/accueil-390px.png` et `accueil-1280px.png` (nouvelles captures du lot 5), ainsi que 320/430 px ; `rapport.json` et captures réactualisées des deux autres pages. La revue visuelle de 390 et 1280 px a été réalisée.

**Réserve :** l'emplacement `public/media/app/parents-hero.webp` existe, mais reste vide (0 octet), réservé à Opus pour GPT-10 ; URL prévue `https://okalm.ci/media/app/parents-hero.webp`. Le programme de parrainage n'est pas déclaré actif. **Seuls Opus et le Gérant valident ensuite la publication.**

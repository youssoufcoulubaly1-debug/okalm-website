# Auto-revue GPT-11 lot 5 — S3 (style accueil)
- Livré : `public/css/accueil-lot5.css`, à charger après `/2026.css` ; tout est limité à `body.page-accueil-lot5`, donc aucune autre page n'est touchée. Aucun HTML modifié.
- Sections stylées : #pourquoi, #comment, #professeurs, #tarifs, #garanties, #communes, #faq, #telecharger, #parrainage (h2 lisible, espacement réglé par clamp, compact sans tasser).
- Classes prévues pour S1 : `ul.lot5-reperes > li` (3 repères du haut, coche ajoutée par le CSS), `ul.lot5-garanties > li` avec `<h3>` + `<p>` (3 cartes), `div.lot5-android` (bloc « Pas d'Android ? » dans #telecharger), `div.lot5-parrainage` avec `ul > li > strong` (deux primes de 5 000 F).
- Conseil à S1 : ajouter `class="page-accueil-lot5"` sur `<body>` et `<link rel="stylesheet" href="/css/accueil-lot5.css">` après 2026.css ; mettre `class="sec"` sur #garanties et #parrainage ; la preuve `.report` ne doit plus être en `aria-hidden` si elle devient la section « preuve ».
- Mobile 320/390/430 : `overflow-x:clip`, marges adaptatives (clamp), mots longs coupés, boutons pleine largeur et repliables, cibles d'au moins 44 à 48 px.
- Desktop 1280 : garanties sur 3 colonnes, parrainage sur 2 colonnes, FAQ limitée en largeur.
- Contenu : aucun texte public, aucun barème, pourcentage, seuil ni prix interne dans le CSS ; marque OKALM CI respectée en commentaire.
- Limites : `node --test tests/` bloqué par l'exécuteur (approbation refusée), donc tests non lancés ; `git add`/`commit` bloqués aussi, fichiers laissés non commités dans le worktree ; rendu non vérifié en navigateur tant que S1 n'a pas posé les classes, captures à faire par S5.

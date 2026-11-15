# Rapport site GPT-2 — recommandation par lien — 15/11/2026

Branche : `feat/fin-parrainage-site-20261115` ; commit de fonctionnalité `5e0bc76`.

## Réalisé
- Page publique `/p/CODE` (réécriture Cloudflare) : titre de partage, description et icône existante ; aucune présentation du code comme texte visible ; un seul bouton principal.
- WhatsApp facultatif, transmis exclusivement au point public `POST /v1/public/parrainage/clic` ; jamais ajouté à l'URL de redirection. Retour explicite en cas d'erreur réseau, code inconnu, numéro non valide.
- Poursuite vers `/get-app-okalm/?referrer=okalm_p_CODE`, puis parcours réel du test fermé : groupe, inscription comme testeur, fiche Google Play. Fiche Play enrichie du paramètre `referrer` pour la lecture Android.
- Autorisation CSP de la requête au serveur existant (`netlify.toml` et `public/_headers` déjà compatible).

## Fichiers
`public/p/index.html`, `public/_redirects`, `public/js/parrainage-lien.js`, `public/js/installer-parrainage.js`, `public/get-app-okalm/index.html`, `netlify.toml`, `tests/parrainage-lien.test.mjs`.

## Preuves
`node --test tests/parrainage-lien.test.mjs` : **3 tests PASS / 3**, 0 FAIL. `node --check` : réussite. `git diff --check` : aucune erreur.

## Réserves
Aucun déploiement ni capture navigateur. L'expérience sur Google Play en test fermé et le passage effectif du paramètre Install Referrer doivent être vérifiés sur appareil. L'app Parents GPT-4 doit interpréter `okalm_p_CODE` et confirmer le code depuis l'identité Firebase du parent, indispensable pour déclencher les droits ; le clic WhatsApp seul ne crée aucune prime.

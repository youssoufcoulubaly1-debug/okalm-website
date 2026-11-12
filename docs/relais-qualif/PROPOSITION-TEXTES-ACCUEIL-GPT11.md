# Proposition textes accueil — GPT-11 lot S4 (12/11/2026)

Périmètre : `public/index.html` uniquement. Bénéfice central : « Un professeur sérieux chez vous, et la preuve écrite des progrès de votre enfant ». Marque publique : OKALM CI.
Sources : mission (copie `_ref/MISSION.md`, lot 4 et décision du Gérant du 12/11) et brief S4.

## 0. En-tête, métadonnées, marque
- AVANT : « Okalm CI — Soutien scolaire… » ; description « professeurs sélectionnés selon leur éligibilité… » ; og « Professeurs sélectionnés selon les missions… » ; logo « Okalm CI » ; menu avec « Parrainage ».
- APRÈS : titre « OKALM CI — Un professeur sérieux chez vous, et la preuve écrite des progrès de votre enfant » ; descriptions sans « éligibilité » ni « missions » ; « OKALM CI » partout ; entrée de menu « Parrainage » retirée.

## 1. Hero
- AVANT : H1 « Des cours à domicile, un suivi pour chaque enfant. » + 2 paragraphes de réserves (montant selon besoins, premier cours payant, conditions dans l'Aide) + 2 boutons (Commander / Voir les tarifs) ; badge « Éligibilité vérifiée pour la mission — Identité, test, domaines et créneaux contrôlés ».
- APRÈS : H1 « Un professeur sérieux chez vous, et la preuve écrite des progrès de votre enfant. » ; sous-titre : du CP1 à la Terminale, à Abidjan, programme ivoirien, « Le prix est connu avant de payer », puis ce que l'enfant a travaillé / maîtrise / doit encore travailler ; réserves déplacées dans la FAQ ; UN seul bouton « Commander un cours à domicile » ; badge « Professeur vérifié — Identité et dossier contrôlés ». Exemple de rapport conservé tel quel (sauf « professeur assigné » → « votre professeur »).

## 2. Pourquoi OKALM CI
- AVANT : « Une attribution selon des critères contrôlés — Pour les missions V2, … avant attribution. »
- APRÈS : « Un professeur choisi pour votre enfant — selon la classe, les matières, votre commune et vos créneaux ; identité et dossier vérifiés. » Autres cartes raccourcies (rapports écrits, premier cours = bilan de départ, prix connu, changement de professeur).

## 3. Comment ça marche
- AVANT : « première échéance réglée », « Vous réglez l'échéance prévue », « Nous assignons le professeur / L'attribution dépend… Aucun délai fixe n'est garanti ».
- APRÈS : « Vous payez par Wave », « Nous choisissons votre professeur » ; « échéance » remplacé par « paiement » ; la réserve sur le délai passe en FAQ.

## 4. Tarifs
- AVANT : 3 cartes individuelles + blocs « Suivi commun / Suivi séparé » (1 000 F/h) + exemple 84 000 F / 108 000 F + note « pas un forfait unique… ».
- APRÈS : 3 cartes individuelles et options examens CONSERVÉES ; formule du suivi commun et exemple chiffré RETIRÉS ; remplacés par le bouton secondaire « Plusieurs enfants ? Calculez votre prix » → `/calculer-mon-prix`, avec la phrase « Le calculateur affiche votre prix et votre économie » (aucun chiffre ni formule). Ligne discrète : « Bientôt : parrainez une famille et gagnez 5 000 F ».

## 5. Parrainage
- AVANT : section complète (règles, activation, frais de réception 1 %, net 4 950 F).
- APRÈS : section supprimée ; reste uniquement la ligne discrète ci-dessus (ancre `#parrainage` conservée sur cette ligne).

## 6. Nos professeurs
- AVANT : « Des critères vérifiés avant l'attribution d'une mission », « missions V2 », « éligibilité réelle », « moteur de mise en relation », « domaines habilités », « Test de matière noté ».
- APRÈS : « Des professeurs vérifiés avant de venir chez vous » ; mêmes pièces contrôlées (identité, diplômes, vidéo, évaluation dans la matière) ; choix selon classe, matière, commune, créneaux, sans jargon.

## 7. FAQ
- AVANT : réserves dispersées (hero, étapes, tarifs) + encadré « Règle d'engagement » qui répète la FAQ.
- APRÈS : réserves réunies une seule fois : prix exact présenté avant confirmation, premier cours payant (déjà présent), conditions dans l'application/Aide, aucun délai fixe garanti pour trouver un professeur ni pour confirmer Wave. Encadré redondant supprimé. Barème d'absence (« 2 absences… la 3e… séance offerte ») retiré selon la décision du Gérant ; reste « Les absences non signalées du professeur ouvrent aussi droit au changement ». Aucune promesse nouvelle.

## 8. Communes, appel final, version web, pied de page
- Communes : conservées à l'identique. Appel final / version web : inchangés. Pied de page : « OKALM CI ».

## Points d'attention
- `/calculer-mon-prix` n'existe pas dans ce worktree (attendu d'un autre lot) : `verify-links` le signalera tant qu'il n'est pas fusionné.
- `scripts/verify-offre.mjs` (hors périmètre, non modifié) exige encore l'ancienne formule, le parrainage détaillé et « Se connecter » : il échoue déjà avant S4 et doit être mis à jour par le lot propriétaire.

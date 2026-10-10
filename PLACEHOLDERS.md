# Placeholders — OKALM Website

## Statut : ✅ Tous remplis (2026-04-28)

| Placeholder | Valeur | Statut |
|---|---|---|
| `<<NOM_COMPLET>>` | Coulibaly Sanga Youssouf Klotchele Wounakanh | ✅ |
| `<<COMMUNE_ABIDJAN>>` | Abobo | ✅ |
| `<<QUARTIER>>` | PK 18 | ✅ |
| `<<WHATSAPP_BUSINESS>>` | 0509185121 → `wa.me/2250509185121` | ✅ |
| `<<DATE_PUBLICATION>>` | 2026-04-28 | ✅ |
| `<<FIREBASE_APP_DISTRIB_LINK_OKALM>>` | ✅ **remplacé le 10/10/2026** — par une release **GitHub** (le canal réellement en service, **pas** Firebase App Distribution) : `…/releases/download/apps-v1.0.2-v1.1.1/au-calme-1.0.2.apk` | ✅ |
| `<<FIREBASE_APP_DISTRIB_LINK_KALMEURS>>` | ✅ **remplacé le 10/10/2026** — `…/releases/download/apps-v1.0.2-v1.1.1/kalmeurs-1.1.1.apk` | ✅ |

## ✅ FAIT le 10/10/2026 — et le canal a changé

Les deux `#bientot` ont été remplacés dans `public/beta.html` (**lignes 43 et 55**), ainsi que les
liens de `get-app-okalm/` et `get-app-kalmeurs/`, vers la release GitHub **`apps-v1.0.2-v1.1.1`**.

⚠️ **Le canal prévu ci-dessous — Firebase App Distribution — n'a JAMAIS été utilisé.** Le canal réel
est une **release GitHub de ce dépôt** (commit `2a0be80` « heberger les APK en release GitHub au lieu
du site »). Procédure réelle :

```bash
gh release create <tag> au-calme-<version>.apk kalmeurs-<version>.apk \
  --repo youssoufcoulubaly1-debug/okalm-website
```

⚠️ Et pour construire les APK, le `-t lib/main_prod.dart` est **obligatoire** — sans lui les flavors
restent inertes (défaut mesuré dans le binaire le 10/10/2026).

### Procédure d'origine — OBSOLÈTE, conservée pour mémoire

1. Uploader les deux APKs sur Firebase App Distribution.
2. Récupérer les liens de téléchargement.
3. Dans `public/beta.html`, remplacer les deux `#bientot` :

```bash
sed -i \
  -e 's|href="#bientot" class="btn btn--primary"|href="LIEN_OKALM" class="btn btn--primary"|' \
  -e 's|href="#bientot" class="btn btn--orange"|href="LIEN_KALMEURS" class="btn btn--orange"|' \
  public/beta.html
```

## Vérification

```bash
grep -r "<<" public/ --include="*.html"
# → doit retourner vide
```

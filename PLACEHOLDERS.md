# Placeholders — OKALM Website

## Statut : ✅ Tous remplis (2026-04-28)

| Placeholder | Valeur | Statut |
|---|---|---|
| `<<NOM_COMPLET>>` | Coulibaly Sanga Youssouf Klotchele Wounakanh | ✅ |
| `<<COMMUNE_ABIDJAN>>` | Abobo | ✅ |
| `<<QUARTIER>>` | PK 18 | ✅ |
| `<<WHATSAPP_BUSINESS>>` | 0509185121 → `wa.me/2250509185121` | ✅ |
| `<<DATE_PUBLICATION>>` | 2026-04-28 | ✅ |
| `<<FIREBASE_APP_DISTRIB_LINK_OKALM>>` | `#bientot` — APK pas encore uploadé | ⏳ |
| `<<FIREBASE_APP_DISTRIB_LINK_KALMEURS>>` | `#bientot` — APK pas encore uploadé | ⏳ |

## À faire quand les APKs sont uploadés

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

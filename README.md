# okalm-website

Site web statique pour [okalm.ci](https://okalm.ci) — hébergé sur Netlify.

## Structure

```
public/
├── index.html          Landing parents/clients
├── devenir-prof.html   Recrutement Kalmeurs
├── privacy.html        Politique de confidentialité (RGPD + ARTCI)
├── terms.html          Conditions Générales d'Utilisation
├── support.html        FAQ + contact
├── beta.html           Accès APKs bêta (noindex)
├── 404.html            Page d'erreur
├── styles.css          Styles globaux (branding OKALM)
├── app.js              JS minimal (nav, FAQ, smooth scroll, Netlify forms)
├── robots.txt          SEO — Disallow: /beta
├── sitemap.xml         Plan du site
├── manifest.webmanifest  PWA manifest
├── .well-known/
│   └── security.txt
└── assets/
    ├── favicon.ico
    ├── og-image.png      (1200×630, à générer)
    └── icons/
        ├── apple-touch-icon.png
        ├── icon-192.png
        └── icon-512.png
netlify.toml            Config Netlify (headers sécurité, redirects, build)
PLACEHOLDERS.md         Liste des <<tokens>> à remplacer avant déploiement
```

## Avant de déployer

1. Remplacer tous les placeholders `<<...>>` — voir [PLACEHOLDERS.md](PLACEHOLDERS.md).
2. Ajouter les assets manquants dans `public/assets/` (favicon, og-image, icons).
3. Vérifier qu'aucun placeholder ne reste : `grep -r "<<" public/`

## Déploiement Netlify

### Première fois

1. Créer un compte sur [netlify.com](https://netlify.com) (gratuit).
2. "Add new site" → "Import an existing project" → connecter ce repo Git.
3. Build command : *(vide — site statique)*  
   Publish directory : `public`
4. Cliquer "Deploy site".

### Domaine personnalisé okalm.ci

1. Netlify → Site settings → Domain management → Add custom domain → `okalm.ci`
2. Chez votre registrar DNS, ajouter :
   - `A  @  75.2.60.5` (apex)
   - `CNAME  www  <votre-site>.netlify.app`
3. Netlify provisionnera le certificat HTTPS Let's Encrypt automatiquement (5–15 min).

### Formulaires Netlify

Les formulaires `data-netlify="true"` sont capturés automatiquement. Les soumissions arrivent dans :
- Netlify Dashboard → Forms
- Email de notification → `support@okalm.ci` (configurer dans Site settings → Forms → Notifications)

## Développement local

```bash
# Serveur statique simple
npx serve public
# ou
python -m http.server 8080 -d public
```

## Vérifications post-déploiement

```bash
# Headers sécurité
curl -I https://okalm.ci/

# Pas de robots sur /beta
curl https://okalm.ci/robots.txt

# Privacy accessible (Play Console)
curl -s https://okalm.ci/privacy | head -5

# Sitemap valide
curl https://okalm.ci/sitemap.xml
```

# Déploiement Cloudflare Pages — okalm.ci

## État actuel

Site déployé sur Cloudflare Pages, projet `okalm-marketing`, même compte Cloudflare que YC Businesses (Import Pro Calculator).

- **URL preview** : https://okalm-marketing.pages.dev
- **URL custom (à activer après DNS)** : https://okalm.ci

## Commandes

```powershell
cd C:\Users\HP\okalm-website
npm install              # une fois
npm run deploy           # déploie public/ sur CF Pages
```

`.env.local` (gitignored) contient `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID`.

## Fichiers de configuration créés

| Fichier | Rôle |
|---|---|
| `public/_redirects` | Conversion des `[[redirects]]` de `netlify.toml` au format CF Pages |
| `public/_headers` | Conversion des `[[headers]]` au format CF Pages (CSP, HSTS, etc.) |
| `package.json` | wrangler en devDep + scripts npm |
| `scripts/deploy.mjs` | Charge .env.local et lance `wrangler pages deploy` |

`netlify.toml` est conservé mais inutilisé (tu peux le supprimer une fois la migration DNS validée).

## Migration DNS chez oxahost.ci

Le domaine `okalm.ci` est enregistré chez **oxahost.ci**, et les nameservers actuels pointent vers Netlify. Pour basculer :

### Étape 1 — Ajouter le domaine sur Cloudflare

1. Aller sur https://dash.cloudflare.com → **Add a Site**
2. Entrer `okalm.ci` → Free plan → **Continue**
3. Cloudflare scanne les records existants. Vérifier qu'il y a au moins un A ou CNAME — sinon les ajouter manuellement après.
4. **Noter les 2 nameservers** que Cloudflare attribue (du genre `arnold.ns.cloudflare.com`, `lola.ns.cloudflare.com`).

### Étape 2 — Connecter le domaine au projet Pages

Toujours dans Cloudflare Dashboard :

1. **Workers & Pages > okalm-marketing > Custom domains > Set up a custom domain**
2. Entrer `okalm.ci` → Cloudflare ajoute automatiquement les bons records DNS
3. Répéter pour `www.okalm.ci`

### Étape 3 — Changer les nameservers chez oxahost.ci

1. Se connecter au panneau d'admin oxahost (cPanel ou interface client).
2. **Gestion du domaine `okalm.ci` > Nameservers**.
3. Remplacer les NS Netlify par ceux donnés par Cloudflare à l'étape 1.
4. Sauvegarder.

### Étape 4 — Attendre la propagation

- Délai : 1h à 24h selon le TTL configuré chez oxahost.
- Vérifier la progression : `dig okalm.ci NS` doit retourner les NS Cloudflare.
- Une fois propagé, Cloudflare bascule automatiquement le domaine en **Active**.

### Étape 5 — Activer les optimisations Cloudflare

Dans le dashboard Cloudflare > okalm.ci > **Settings** :

- **SSL/TLS > Overview** : mode **Full**
- **Edge Certificates > Always Use HTTPS** : **On**
- **Speed > Optimization > Auto Minify** : cocher CSS, JS, HTML
- **Speed > Optimization > Brotli** : **On**

### Vérifications post-bascule

```powershell
curl -sI https://okalm.ci/                 # doit donner 200 + headers de sécurité
curl -sI https://okalm.ci/cgu              # doit donner 301 → /terms
curl -sI https://okalm.ci/devenir-prof     # doit donner 200 (rewrite vers /devenir-prof.html)
```

## ⚠️ Forms — action requise

Le site contient 2 formulaires qui passaient par **Netlify Forms** :
- `public/index.html:243` — form `attente` (liste d'attente)
- `public/devenir-prof.html:156` — form `candidature-kalmeur` (recrutement profs)

Cloudflare Pages n'a pas d'équivalent natif. Trois options par ordre de simplicité :

### Option C — Remplacer par lien WhatsApp (recommandé immédiatement)

Le plus simple : remplacer chaque form par un gros bouton "Nous contacter sur WhatsApp" qui ouvre un message pré-rempli vers ton numéro `+225 050 918 5121`.

Exemple pour `index.html` (form `attente`) :

```html
<a href="https://wa.me/2250509185121?text=Bonjour%20OKALM%2C%20je%20veux%20rejoindre%20la%20liste%20d%27attente"
   class="cta-button" target="_blank" rel="noopener">
   📱 Rejoindre la liste sur WhatsApp
</a>
```

Pas besoin de backend. Convertit mieux en CI où WhatsApp est l'app par défaut.

### Option B — Service tiers (Formspree / Web3Forms)

Garde la forme actuelle mais change l'attribut `action` :
```html
<form action="https://formspree.io/f/<form-id>" method="POST">
```
Plan gratuit : 50-250 submissions/mois selon le service.

### Option A — Pages Functions custom

Créer `functions/api/contact.js` côté CF Pages → relayer vers Telegram/Discord/Firebase Functions. Plus de boulot, plus flexible.

**Tant qu'aucune des 3 options n'est mise en place, les forms postent dans le vide** (ils font un POST qui revient en 405 ou 404). Il faut donc soit en faire au moins une, soit retirer les forms du HTML.

## Bascule manuelle d'urgence

Si Cloudflare Pages a un souci, on peut redéployer le site sur Firebase Hosting (compte yc-businesses ou un nouveau projet OKALM) et changer juste le DNS chez Cloudflare → A record vers Firebase. Pas de Worker fallback ici car le site est statique et peu critique.

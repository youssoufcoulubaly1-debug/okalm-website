#!/usr/bin/env node
/**
 * Deploy okalm-website (statique) vers Cloudflare Pages.
 *
 * Usage :
 *   npm run deploy                  → déploie public/ vers le projet okalm-marketing
 *   npm run deploy:create-project   → crée d'abord le projet CF Pages, puis déploie
 *
 * Pré-requis :
 *   .env.local (gitignored) avec :
 *     CLOUDFLARE_API_TOKEN=cfat_xxx (scope minimal: Pages > Edit + User > Read)
 *     CLOUDFLARE_ACCOUNT_ID=xxx
 */

import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const PROJECT_NAME = 'okalm-marketing';
const PUBLIC_URL = `https://${PROJECT_NAME}.pages.dev`;
const PUBLIC_DIR = resolve(ROOT, 'public');

const args = process.argv.slice(2);
const createProject = args.includes('--create-project');

loadEnvLocal();

function loadEnvLocal() {
  const envPath = resolve(ROOT, '.env.local');
  if (!existsSync(envPath)) {
    console.error('\n❌ .env.local introuvable. Crée-le avec CLOUDFLARE_API_TOKEN et CLOUDFLARE_ACCOUNT_ID.');
    process.exit(1);
  }
  const content = readFileSync(envPath, 'utf8');
  for (const line of content.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    const [, k, v] = m;
    if (!process.env[k]) process.env[k] = v.replace(/^["']|["']$/g, '');
  }
  if (!process.env.CLOUDFLARE_API_TOKEN) {
    console.error('\n❌ CLOUDFLARE_API_TOKEN manquant.');
    process.exit(1);
  }
  if (!process.env.CLOUDFLARE_ACCOUNT_ID) {
    console.error('\n❌ CLOUDFLARE_ACCOUNT_ID manquant.');
    process.exit(1);
  }
}

function run(cmd, opts = {}) {
  execSync(cmd, { cwd: ROOT, stdio: 'inherit', ...opts });
}

if (createProject) {
  console.log(`\n🆕 Création projet CF Pages "${PROJECT_NAME}"…`);
  try {
    run(`npx wrangler pages project create ${PROJECT_NAME} --production-branch=main`);
  } catch {
    console.log('(le projet existait peut-être déjà — on continue)');
  }
}

console.log(`\n🚀 Déploiement vers ${PUBLIC_URL}…`);
// Lancé depuis public/ pour éviter toute détection parasite de wrangler.
run(`npx wrangler pages deploy . --project-name=${PROJECT_NAME} --branch=main --commit-dirty=true`,
    { cwd: PUBLIC_DIR });

console.log(`\n✅ Déploiement OK : ${PUBLIC_URL}`);
console.log(`👉 Une fois le DNS migré chez Cloudflare, le site sera aussi accessible sur https://okalm.ci`);

import { chromium } from 'file:///C:/Users/HP/okalm-workspace/admin-web/node_modules/playwright/index.mjs';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const base = 'http://127.0.0.1:8765';
const sortie = resolve('docs/relais-qualif/preuves-gpt11');
await mkdir(sortie, { recursive: true });
const navigateur = await chromium.launch({
  headless: true,
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  args: ['--no-sandbox']
});
const resultat = [];
try {
  for (const largeur of [320, 390, 430, 1280]) {
    const contexte = await navigateur.newContext({ viewport: { width: largeur, height: 844 }, deviceScaleFactor: 1 });
    for (const [nom, url] of [
      ['accueil', '/index.html'],
      ['calculateur-parents', '/calculer-mon-prix.html'],
      ['devenir-prof', '/devenir-prof.html']
    ]) {
      const page = await contexte.newPage();
      const erreurs = [];
      page.on('pageerror', e => erreurs.push(e.message));
      page.on('response', r => {
        if (r.url().startsWith(base) && r.status() >= 400) erreurs.push(r.status() + ' ' + r.url());
      });
      const reponse = await page.goto(base + url, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(350);
      const ligne = { page: nom, largeur, http: reponse.status(), erreurs };
      if (nom === 'calculateur-parents') {
        const initial = await page.locator('#calc-prix-seul').textContent();
        ligne.prixInitial = initial;
        await page.locator('input[name="nb"][value="3"]').check();
        await page.locator('#classe-1').selectOption('1ere');
        await page.locator('#classe-2').selectOption('4e');
        await page.locator('#classe-3').selectOption('CM2');
        await page.waitForTimeout(180);
        ligne.commun = await page.locator('#calc-commun').textContent();
        ligne.separe = await page.locator('#calc-separe').textContent();
        ligne.economie = await page.locator('#calc-eco').textContent();
        if (!ligne.commun.includes('150 000') || !ligne.separe.includes('228 000') || !ligne.economie.includes('78 000')) {
          erreurs.push('Montants parents incorrects ' + JSON.stringify({ commun: ligne.commun, separe: ligne.separe, economie: ligne.economie }));
        }
      }
      if (nom === 'devenir-prof') {
        const montant = page.locator('.sim-prof__montant');
        ligne.simulateur = await montant.textContent();
        if (!ligne.simulateur.includes('54 000') && !ligne.simulateur.includes('54 000')) erreurs.push('Simulateur initial incorrect: ' + ligne.simulateur);
        const trois = page.locator('#simulateur-prof select[name="enfants"]');
        await trois.first().selectOption('3');
        ligne.simulateurTrois = await montant.textContent();
        if (!ligne.simulateurTrois.includes('81 000') && !ligne.simulateurTrois.includes('81 000')) erreurs.push('Simulateur 3 enfants incorrect: ' + ligne.simulateurTrois);
      }
      ligne.scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      ligne.viewport = largeur;
      if (ligne.scrollWidth > largeur + 1) erreurs.push('Debordement horizontal: ' + ligne.scrollWidth);
      await page.screenshot({ path: resolve(sortie, nom + '-' + largeur + 'px.png'), fullPage: true });
      resultat.push(ligne);
      await page.close();
    }
    await contexte.close();
  }
} finally {
  await navigateur.close();
}
await writeFile(resolve(sortie, 'rapport.json'), JSON.stringify(resultat, null, 2), 'utf8');
console.log(JSON.stringify(resultat, null, 2));
if (resultat.some(r => r.erreurs.length > 0)) process.exitCode = 1;

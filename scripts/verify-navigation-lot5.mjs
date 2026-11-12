import assert from 'node:assert/strict';
import { chromium } from 'file:///C:/Users/HP/okalm-workspace/admin-web/node_modules/playwright/index.mjs';
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--no-sandbox']});
try {
 for(const largeur of [320,390,1280]) {
  const page=await browser.newPage({viewport:{width:largeur,height:844}});
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:8765/index.html',{waitUntil:'domcontentloaded'});
  await page.waitForTimeout(150);
  assert.equal(await page.locator('h1').count(),1);
  const sections=await page.locator('main > section').evaluateAll(xs=>xs.map(x=>x.id));
  assert.deepEqual(sections,['top','pourquoi','comment','professeurs','tarifs','garanties','communes','faq','telecharger','parrainage']);
  const preuve=page.locator('#pourquoi .report');
  assert.equal(await preuve.count(),1);
  assert.equal(await preuve.getAttribute('aria-hidden'),null);
  if(largeur<600){
   await page.locator('.menu summary').click();
   const liens=page.locator('.menu__panel a');
   const dernier=await liens.last().textContent();
   assert.equal(dernier.trim(),'Parrainage');
   await liens.last().click();
   assert.equal(await page.evaluate(()=>location.hash),'#parrainage');
   assert.equal(await page.locator('details.menu').getAttribute('open'),null);
  }
  await page.locator('#tarifs .offer-options summary').click();
  assert.equal(await page.locator('#tarifs .offer-options').getAttribute('open'),'');
  assert.deepEqual(errors,[]);
  console.log('Navigation lot 5 : '+largeur+' px, 0 erreur, ordre et interactions OK');
  await page.close();
 }
}finally{await browser.close();}

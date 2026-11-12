const {chromium}=require('C:/Users/HP/okalm-workspace/admin-web-f-20261104/node_modules/playwright');
const out='C:/Users/HP/okalm-workspace/docs/relais-qualif/preuves-site-v2/';
(async()=>{
 const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 for(const [w,h,n] of [[390,844,'390'],[1280,900,'1280'],[320,700,'320']]){
  const p=await b.newPage({viewport:{width:w,height:h}});const errs=[];
  p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
  await p.goto('http://127.0.0.1:8765/index.html',{waitUntil:'networkidle'});
  await p.waitForTimeout(900);
  const ov=await p.evaluate(()=>({sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth,g:!!document.querySelector('#tarifs-grille .g-card'),c:!!document.querySelector('#tarifs-calcul .c-sel')}));
  console.log(n,JSON.stringify(ov),JSON.stringify(errs));
  await p.screenshot({path:out+'accueil-'+n+'.png',fullPage:true});
  if(n==='390'){
    await p.click('#tarifs-grille .g-seg[data-n="3"]');
    const t=await p.textContent('#tarifs-grille .g-card.is-on');console.log('3 enfants college:',t.replace(/\s+/g,' '));
    await p.selectOption('#tarifs-calcul #c-sel-1','CM2');
    await p.click('#tarifs-calcul .c-add');
    const r=await p.textContent('#tarifs-calcul .c-res');console.log('calcul:',r.replace(/\s+/g,' '));
  }
  await p.close();
 }
 await b.close();
})().catch(e=>{console.error(e);process.exit(1)});

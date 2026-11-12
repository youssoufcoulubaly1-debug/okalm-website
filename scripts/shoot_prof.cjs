const {chromium}=require('C:/Users/HP/okalm-workspace/admin-web-f-20261104/node_modules/playwright');
const out='C:/Users/HP/okalm-workspace/docs/relais-qualif/preuves-site-v2/';
(async()=>{
 const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 for(const [w,h,n] of [[390,844,'390'],[1280,900,'1280']]){
  const p=await b.newPage({viewport:{width:w,height:h}});const errs=[];
  p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
  await p.goto('http://127.0.0.1:8765/devenir-prof.html',{waitUntil:'networkidle'});await p.waitForTimeout(700);
  const ov=await p.evaluate(()=>({sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth,txt:document.querySelector('.sp-res__montant')?.textContent,pct:/\d\s?%/.test(document.body.innerText)}));
  console.log(n,JSON.stringify(ov),JSON.stringify(errs));
  await p.screenshot({path:out+'prof-'+n+'.png',fullPage:true});await p.close();
 }
 await b.close();
})().catch(e=>{console.error(e);process.exit(1)});

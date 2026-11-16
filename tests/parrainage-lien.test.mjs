import {test} from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import path from "node:path";
const base=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"../public");
const read=p=>readFileSync(path.join(base,p),"utf8");
test("lien /p/CODE servi avant le 404, code jamais affiché",()=>{
  const redirects=read("_redirects");
  assert.match(redirects,/\/p\/\*\s+\/p\/\s+200/);
  assert.ok(redirects.indexOf("/p/*")<redirects.indexOf("/* "));
  const html=read("p/index.html");
  assert.match(html,/Un proche vous recommande OKALM CI/);
  assert.match(html,/og:image/);
  assert.match(html,/name="whatsapp"/);
  assert.equal((html.match(/type="submit"/g)||[]).length,1);
  assert.doesNotMatch(html,/REFCDE22/);
});
test("validation du code dans l'URL et POST public",()=>{
  const js=read("js/parrainage-lien.js");
  assert.match(js,/\/v1\/public\/parrainage\/clic/);
  assert.match(js,/window\.location\.pathname/);
  assert.match(js,/get-app-okalm\/\?referrer=/);
  assert.match(js,/okalm_p_/);
  assert.match(js,/response\.ok/);
});
test("parcours de test fermé et lien Play Install Referrer",()=>{
  const guide=read("get-app-okalm/index.html");
  assert.match(guide,/groups\.google\.com\/g\/okalm-ci-familles/);
  assert.match(guide,/play\.google\.com\/apps\/testing/);
  assert.match(guide,/id="lien-play-store"/);
  assert.match(guide,/installer-parrainage\.js/);
  const installer=read("js/installer-parrainage.js");
  assert.match(installer,/play\.google\.com\/store\/apps\/details/);
  assert.match(installer,/encodeURIComponent\(value\)/);
});

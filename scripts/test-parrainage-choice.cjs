"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");
const publicDir = path.resolve(__dirname, "..", "public");

async function testClic(profilValeur) {
  const listeners = {};
  const form = {
    elements: { namedItem: () => ({ value: profilValeur }) },
    addEventListener(name, callback) { listeners[name] = callback; },
  };
  const elements = {
    "parrainage-form": form,
    "statut": { textContent: "" },
    "continuer": { disabled: false, textContent: "" },
    "reco-famille": { hidden: false },
    "reco-kalmeur": { hidden: true },
    "whatsapp": { value: "" },
  };
  let assigned;
  let fetchCalls = 0;
  const context = {
    window: {
      location: {
        pathname: "/p/K7M2Q9",
        assign(url) { assigned = url; },
      },
    },
    document: { getElementById(id) { return elements[id]; } },
    fetch: async () => {
      fetchCalls++;
      return { ok: true, status: 200 };
    },
    encodeURIComponent,
  };
  vm.runInNewContext(fs.readFileSync(path.join(publicDir, "js", "parrainage-lien.js"), "utf8"), context);
  await listeners.submit({ preventDefault() {} });
  if (profilValeur === "kalmeur") {
    assert.equal(assigned, "/get-app-kalmeurs/?invitation=K7M2Q9");
    assert.equal(fetchCalls, 0, "Un clic professeur ne doit pas produire un clic famille");
    assert.equal(elements["reco-kalmeur"].hidden, false);
  } else {
    assert.equal(assigned, "/get-app-okalm/?referrer=okalm_p_K7M2Q9");
    assert.equal(fetchCalls, 1);
    assert.equal(elements["reco-famille"].hidden, false);
  }
}
async function testInvitation() {
  const listeners = {};
  const elements = {
    "invitation-kalmeurs": { hidden: true },
    "invitation-code": { textContent: "" },
    "invitation-copier": { addEventListener(name, fn) { listeners[name] = fn; } },
    "invitation-message": { textContent: "" },
    "lien-play-store-kalmeurs": { href: "" },
  };
  let copied;
  const context = {
    window: { location: { search: "?invitation=K7M2Q9" } },
    document: { getElementById(id) { return elements[id]; } },
    navigator: { clipboard: { async writeText(t) { copied = t; } } },
    URLSearchParams,
    encodeURIComponent,
  };
  vm.runInNewContext(fs.readFileSync(path.join(publicDir, "js", "invitation-kalmeurs.js"), "utf8"), context);
  assert.equal(elements["invitation-kalmeurs"].hidden, false);
  assert.equal(elements["invitation-code"].textContent, "K7M2Q9");
  assert.match(elements["lien-play-store-kalmeurs"].href, /referrer=okalm_p_K7M2Q9$/);
  await listeners.click();
  assert.equal(copied, "K7M2Q9");
}
(async () => {
  await testClic("kalmeur");
  await testClic("parent");
  await testInvitation();
  console.log("3 PASS / 0 FAIL : choix professeur, famille et conservation du code");
})().catch(error => { console.error(error); process.exitCode = 1; });

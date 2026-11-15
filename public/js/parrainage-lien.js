"use strict";
(() => {
  const match = /^\/p\/([A-HJ-NP-Z2-9]{6,12})\/?$/.exec(window.location.pathname);
  const form = document.getElementById("parrainage-form");
  const status = document.getElementById("statut");
  const button = document.getElementById("continuer");
  if (!match) {
    status.textContent = "Ce lien de recommandation est invalide.";
    button.disabled = true;
    return;
  }
  const code = match[1];
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const number = document.getElementById("whatsapp").value.trim();
    button.disabled = true;
    status.textContent = "Vérification de la recommandation…";
    try {
      const response = await fetch("https://europe-west1-okalm-ci-5c925.cloudfunctions.net/adminApi/v1/public/parrainage/clic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(number ? { code, whatsapp: number } : { code }),
        cache: "no-store"
      });
      if (!response.ok) {
        status.textContent = response.status === 404
          ? "Cette recommandation n'est plus disponible."
          : response.status === 422
            ? "Vérifiez le numéro WhatsApp ou laissez ce champ vide."
            : "La recommandation n'a pas pu être enregistrée. Réessayez.";
        return;
      }
      // La page de téléchargement conserve le referrer, mais jamais le téléphone.
      const referrer = encodeURIComponent("okalm_p_" + code);
      window.location.assign("/get-app-okalm/?referrer=" + referrer);
    } catch (_) {
      status.textContent = "La recommandation n'a pas pu être enregistrée. Vérifiez la connexion et réessayez.";
    } finally {
      button.disabled = false;
    }
  });
})();

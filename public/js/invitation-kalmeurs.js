"use strict";
(() => {
  const code = new URLSearchParams(window.location.search).get("invitation") || "";
  if (!/^[A-HJ-NP-Z2-9]{6,12}$/.test(code)) return;
  const store = document.getElementById("lien-play-store-kalmeurs");
  if (store) {
    store.href = "https://play.google.com/store/apps/details?id=com.okalm.kalmeurs&referrer="
      + encodeURIComponent("okalm_p_" + code);
  }
  const section = document.getElementById("invitation-kalmeurs");
  const label = document.getElementById("invitation-code");
  const button = document.getElementById("invitation-copier");
  const status = document.getElementById("invitation-message");
  if (!section || !label || !button || !status) return;
  label.textContent = code;
  section.hidden = false;
  button.addEventListener("click", async () => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error("clipboard unavailable");
      await navigator.clipboard.writeText(code);
      status.textContent = "Code copié. Saisissez-le dans l’application Kalmeurs avant votre premier test.";
    } catch (_) {
      status.textContent = "Copie automatique impossible. Sélectionnez le code affiché ci-dessus pour le copier.";
    }
  });
})();

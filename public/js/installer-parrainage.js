"use strict";
(() => {
  const value = new URLSearchParams(window.location.search).get("referrer") || "";
  const match = /^okalm_p_([A-HJ-NP-Z2-9]{6,12})$/.exec(value);
  if (!match) return;
  // Le test fermé exige d'abord l'adhésion au groupe et l'accès testeur.
  // À l'ouverture finale du Play Store, le paramètre Install Referrer
  // est transmis sur la fiche officielle de l'application.
  const store = document.getElementById("lien-play-store");
  if (store) {
    store.href = "https://play.google.com/store/apps/details?id=com.okalm.app_okalm_ci&referrer="
      + encodeURIComponent(value);
  }
})();

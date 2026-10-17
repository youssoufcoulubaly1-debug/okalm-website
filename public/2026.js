/* =========================================================================
   OKALM CI — comportements du menu (3 traits). Aucun build, aucune dépendance.
   Pourquoi ce fichier existe : <details> reste ouvert après un clic sur un de
   ses liens. Sur téléphone, le menu recouvrait donc la page après un saut
   vers une section — constaté en vérifiant le site le 17/10/2026.
   ========================================================================= */
(function () {
  "use strict";

  function fermer(menu) {
    if (menu && menu.hasAttribute("open")) menu.removeAttribute("open");
  }

  document.addEventListener("click", function (e) {
    var cible = e.target;
    var menu = document.querySelector(".menu");
    if (!menu) return;

    // 1) un clic sur un lien du menu : on saute…
    if (cible.closest && cible.closest(".menu__panel a")) {
      // 2) …et on referme immédiatement, sinon le panneau masque la page.
      fermer(menu);
      return;
    }

    // 3) un clic ailleurs dans la page referme aussi le menu.
    if (menu.hasAttribute("open") && !menu.contains(cible)) fermer(menu);
  });

  // 4) Échap referme le menu (comportement attendu au clavier).
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") fermer(document.querySelector(".menu"));
  });
})();

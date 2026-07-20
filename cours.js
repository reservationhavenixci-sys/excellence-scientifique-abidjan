const phone = "2250778058988";
const message = "Bonjour Monsieur, en tant que parent d'élève en classe de Terminale, je souhaite planifier un entretien téléphonique afin d'évaluer la mise en place de cours à domicile.";
const waUrl = "https://wa.me/" + phone + "?text=" + encodeURIComponent(message);

["navCta", "heroCta", "contactCta", "waFloat"].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.setAttribute("href", waUrl);
});

const nav = document.getElementById("siteNav");
window.addEventListener("scroll", () => {
  if (window.scrollY > 12) nav.classList.add("scrolled");
  else nav.classList.remove("scrolled");
});

// Si un fichier logo (images/logo-haut.jpg ou images/logo-bas.jpg) n'a
// pas encore été déposé sur le serveur, on masque proprement son cadre
// au lieu de laisser l'icône "image cassée" du navigateur s'afficher.
// Dès que les vraies images sont en ligne, elles apparaissent normalement.
document.querySelectorAll(".brand-logo, .hero-logo").forEach(img => {
  img.addEventListener("error", () => {
    const frame = img.closest(".brand-logo-frame, .hero-logo-frame");
    if (frame) frame.classList.add("is-empty");
  }, { once: true });
});
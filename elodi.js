/* ===================================================================
   DROH AHOU ELODIE — CARTE DE VISITE NUMÉRIQUE
   JavaScript vanilla — sans dépendance
   =================================================================== */

(() => {
  'use strict';

  /* ---------- Données de contact (source unique de vérité) ---------- */
  const CONTACT = {
    firstName: 'Ahou Elodie',
    lastName: 'Droh',
    fullName: 'Droh Ahou Elodie',
    org: 'HavenixCI',
    title: 'Directrice Générale Adjointe',
    phone: '+2250778746077',
    website: 'https://havenixci.com',
    address: 'Abidjan, Côte d\'Ivoire'
  };

  /* ================= TOAST DE NOTIFICATION ================= */
  const toastEl = document.getElementById('toast');
  let toastTimer = null;

  function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove('is-visible');
    }, 2200);
  }

  /* ================= COPIER LES COORDONNÉES ================= */
  document.querySelectorAll('.copy-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const textEl = btn.previousElementSibling;
      const value = textEl?.dataset?.copy || textEl?.textContent?.trim();
      if (!value) return;

      try {
        await navigator.clipboard.writeText(value);
        showToast('Copié dans le presse-papiers');
      } catch (err) {
        // Repli si l'API Clipboard est indisponible
        const tempInput = document.createElement('textarea');
        tempInput.value = value;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        showToast('Copié dans le presse-papiers');
      }
    });
  });

  /* ================= ENREGISTRER LE CONTACT (VCF) ================= */
  function buildVCard() {
    const lines = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `N:${CONTACT.lastName};${CONTACT.firstName};;;`,
      `FN:${CONTACT.fullName}`,
      `ORG:${CONTACT.org}`,
      `TITLE:${CONTACT.title}`,
      `TEL;TYPE=CELL:${CONTACT.phone}`,
      `URL:${CONTACT.website}`,
      `ADR;TYPE=WORK:;;${CONTACT.address};;;;`,
      'END:VCARD'
    ];
    return lines.join('\r\n');
  }

  function downloadVCard() {
    const vcardContent = buildVCard();
    const blob = new Blob([vcardContent], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${CONTACT.fullName.replace(/\s+/g, '_')}.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Contact enregistré');
  }

  document.querySelectorAll('[data-action="save-contact"]').forEach((btn) => {
    btn.addEventListener('click', downloadVCard);
  });

  /* ================= PARTAGER LA CARTE ================= */
  const shareBtn = document.getElementById('btnShare');
  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      const shareData = {
        title: `${CONTACT.fullName} — ${CONTACT.org}`,
        text: `Contactez ${CONTACT.fullName}, ${CONTACT.title} de ${CONTACT.org}.`,
        url: window.location.href
      };

      if (navigator.share) {
        try {
          await navigator.share(shareData);
        } catch (err) {
          // Partage annulé par l'utilisateur : rien à faire
        }
      } else {
        try {
          await navigator.clipboard.writeText(window.location.href);
          showToast('Lien copié — prêt à partager');
        } catch (err) {
          showToast('Impossible de partager sur cet appareil');
        }
      }
    });
  }

  /* ================= QR CODE DYNAMIQUE ================= */
  const qrImage = document.getElementById('qrImage');
  if (qrImage) {
    const pageUrl = encodeURIComponent(window.location.href);
    qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=8&color=8F2C58&data=${pageUrl}`;
  }

  /* ================= ANIMATION AU DÉFILEMENT (avec léger décalage) ================= */
  const revealTargets = document.querySelectorAll('.section');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = Array.from(revealTargets).indexOf(entry.target) % 3 * 60;
            entry.target.style.transitionDelay = `${delay}ms`;
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    revealTargets.forEach((el) => observer.observe(el));
  } else {
    // Repli pour navigateurs anciens : tout afficher directement
    revealTargets.forEach((el) => el.classList.add('is-visible'));
  }

  /* ================= INITIALES DE REPLI ================= */
  const heroInitials = document.getElementById('heroInitials');
  if (heroInitials) {
    heroInitials.textContent = 'DE';
  }

  /* ================= EFFET "WOUAOU" — MÉDAILLON MULTICOLORE ================= */
  // Le médaillon de profil oscille en douceur dans la palette rose/blanc,
  // en écho à l'identité "signal / communication".
  const heroAvatar = document.getElementById('heroAvatar');
  if (heroAvatar) {
    const avatarPalette = [
      '#E37FA6',
      '#D65B8C', // rose signal
      '#B93E70',
      '#8F2C58', // rose profond
      '#B93E70',
      '#D65B8C',
      '#F0A8C2'
    ];
    let colorIndex = 0;
    setInterval(() => {
      colorIndex = (colorIndex + 1) % avatarPalette.length;
      heroAvatar.style.setProperty('--avatar-color', avatarPalette[colorIndex]);
    }, 1000);
  }

  /* ================= MICRO-INTERACTION AU CLIC ================= */
  document.querySelectorAll('.action-btn, .dock__btn, .social-btn').forEach((el) => {
    el.addEventListener('click', () => {
      el.style.transform = 'scale(0.94)';
      setTimeout(() => { el.style.transform = ''; }, 140);
    });
  });

})();
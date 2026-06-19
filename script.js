// ============================================================
// INTRO ANIMATION — logo grande centrado → logo del navbar
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  const intro = document.getElementById('intro');
  const introLogo = document.getElementById('introLogo');
  const navLogo = document.getElementById('navLogo');

  if (!intro || !introLogo || !navLogo) return;

  // Si el usuario prefiere movimiento reducido, no animamos nada
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    intro.classList.add('intro--done');
    return;
  }

  document.body.classList.add('intro-active');

  function startIntroAnimation() {
    // Posición y tamaño reales del logo del navbar (destino final)
    const navRect = navLogo.getBoundingClientRect();
    const introRect = introLogo.getBoundingClientRect();

    // Cuánto hay que desplazar y escalar el logo grande para que coincida
    // exactamente con el logo pequeño del navbar
    const scale = navRect.height / introRect.height;
    const deltaX = navRect.left - introRect.left;
    const deltaY = navRect.top - introRect.top;

    intro.style.setProperty('--intro-x', `${deltaX}px`);
    intro.style.setProperty('--intro-y', `${deltaY}px`);
    intro.style.setProperty('--intro-scale', scale);

    // Disparamos la animación del logo
    requestAnimationFrame(() => {
      intro.classList.add('intro--exit');
    });

    // Un poco después, desvanecemos el overlay completo
    setTimeout(() => {
      intro.classList.add('intro--fade');
      document.body.classList.remove('intro-active');
    }, 650);

    // Al terminar la transición, lo quitamos del flujo por completo
    setTimeout(() => {
      intro.classList.add('intro--done');
    }, 1300);
  }

  // Pequeña pausa antes de iniciar para que el usuario alcance a ver el logo completo
  setTimeout(startIntroAnimation, 500);
});
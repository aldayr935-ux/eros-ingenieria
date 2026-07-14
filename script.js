// ============================================================
// LENIS — scroll suave global
// ============================================================

let lenis;

document.addEventListener('DOMContentLoaded', () => {
  lenis = new Lenis({
    duration: 1.1,              // qué tan "lento/suave" es el scroll
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // curva de desaceleración
    smoothWheel: true,
    touchMultiplier: 1.2
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Hace que los links internos (#servicios, #contacto, etc.) usen el scroll de Lenis
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target, { offset: -80 });
      }
    });
  });
});


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


// ============================================================
// MENÚ HAMBURGUESA — móvil
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('mobileMenu');
  const backdrop = document.getElementById('mobileMenuBackdrop');

  if (!toggle || !menu || !backdrop) return;

  function openMenu() {
    menu.classList.add('is-open');
    backdrop.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Cerrar menú');
    document.body.classList.add('menu-open');
  }

  function closeMenu() {
    menu.classList.remove('is-open');
    backdrop.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menú');
    document.body.classList.remove('menu-open');
  }

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    isOpen ? closeMenu() : openMenu();
  });

  // Cerrar al hacer clic en el fondo oscuro
  backdrop.addEventListener('click', closeMenu);

  // Cerrar al hacer clic en cualquier link del menú
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Cerrar con la tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) {
      closeMenu();
    }
  });
});


// ============================================================
// CUSTOM SELECT — Servicio de interés (formulario)
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  const select = document.getElementById('servicioSelect');
  const trigger = document.getElementById('servicioTrigger');
  const valueLabel = document.getElementById('servicioValue');
  const optionsList = document.getElementById('servicioOptions');
  const hiddenInput = document.getElementById('servicio');

  if (!select || !trigger || !optionsList || !hiddenInput) return;

  const options = optionsList.querySelectorAll('li');

  function openSelect() {
    select.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');
  }

  function closeSelect() {
    select.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
  }

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = select.classList.contains('is-open');
    isOpen ? closeSelect() : openSelect();
  });

  options.forEach(option => {
    option.addEventListener('click', () => {
      const value = option.dataset.value;

      // Actualiza el texto visible y el input oculto que se envía en el formulario
      valueLabel.textContent = value;
      hiddenInput.value = value;
      trigger.setAttribute('data-selected', 'true');

      // Marca visualmente la opción activa
      options.forEach(o => o.classList.remove('is-active'));
      option.classList.add('is-active');

      closeSelect();
    });
  });

  // Cerrar al hacer clic fuera del select
  document.addEventListener('click', (e) => {
    if (!select.contains(e.target)) {
      closeSelect();
    }
  });

  // Cerrar con Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSelect();
  });
});


// ============================================================
// SERVICIOS — Toggle "Mostrar más / Mostrar menos"
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.servicio-card__toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.servicio-card');
      const isOpen = card.classList.toggle('is-open');
      btn.textContent = isOpen ? 'Mostrar menos' : 'Mostrar más';
      btn.setAttribute('aria-expanded', isOpen);
    });
  });
});


// ============================================================
// SCROLL REVEAL — aparición de secciones al hacer scroll
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  // Si el usuario prefiere movimiento reducido, mostramos todo de una vez
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  // Elementos que queremos animar dentro de cada sección:
  // el encabezado y los hijos directos de cualquier grid/inner de contenido
  const targets = document.querySelectorAll(
    '.section__header, ' +
    '.servicios__grid, ' +
    '.porque__grid, ' +
    '.carrusel, ' +
    '.testimonios__grid, ' +
    '.nosotros__content, .nosotros__visual, ' +
    '.contacto__form-wrap, .contacto__info'
  );

  // Marca como grupo a las grids con varias tarjetas: las tarjetas internas
  // se animan en cascada por CSS cuando el grid recibe 'is-visible'
  document.querySelectorAll(
    '.servicios__grid, .porque__grid, .testimonios__grid'
  ).forEach(grid => {
    grid.classList.add('reveal-group');
    Array.from(grid.children).forEach(card => card.classList.add('reveal'));
  });

  // El resto de targets (que no son grids) se animan ellos mismos
  document.querySelectorAll(
    '.section__header, .carrusel, .nosotros__content, .nosotros__visual, .contacto__form-wrap, .contacto__info'
  ).forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Si es un grid, activamos la cascada en sus tarjetas hijas
        if (entry.target.classList.contains('reveal-group')) {
          entry.target.querySelectorAll('.reveal').forEach(card => {
            card.classList.add('is-visible');
          });
        } else {
          entry.target.classList.add('is-visible');
        }
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0,
    rootMargin: '0px 0px -10% 0px'
  });

  targets.forEach(el => observer.observe(el));
});

// ============================================================
// CARRUSEL — Proyectos
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  const track     = document.getElementById('carruselTrack');
  const btnPrev   = document.getElementById('carruselPrev');
  const btnNext   = document.getElementById('carruselNext');
  const dotsWrap  = document.getElementById('carruselDots');

  if (!track || !btnPrev || !btnNext || !dotsWrap) return;

  const cards         = Array.from(track.children);
  const totalCards    = cards.length;
  const AUTOPLAY_MS   = 4500;   // tiempo entre avances automáticos
  let currentPage     = 0;
  let autoplayTimer   = null;

  // Detecta cuántas tarjetas caben según el ancho actual
  function cardsPerView() {
    const cardWidth = cards[0].getBoundingClientRect().width;
    const trackWidth = track.parentElement.getBoundingClientRect().width;
    return Math.round(trackWidth / (cardWidth + 24)) || 1;
  }

  function totalPages() {
    return Math.ceil(totalCards / cardsPerView());
  }

  // Genera los dots según el número de páginas
  function buildDots() {
    dotsWrap.innerHTML = '';
    for (let i = 0; i < totalPages(); i++) {
      const dot = document.createElement('button');
      dot.classList.add('carrusel__dot');
      dot.setAttribute('aria-label', `Ir a página ${i + 1}`);
      if (i === currentPage) dot.classList.add('is-active');
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    }
  }

  function updateDots() {
    dotsWrap.querySelectorAll('.carrusel__dot').forEach((dot, i) => {
      dot.classList.toggle('is-active', i === currentPage);
    });
  }

  function updateButtons() {
    btnPrev.disabled = currentPage === 0;
    btnNext.disabled = currentPage === totalPages() - 1;
  }

  function goTo(page) {
    const pages = totalPages();
    // Loop circular
    currentPage = (page + pages) % pages;

    const perView   = cardsPerView();
    const cardWidth = cards[0].getBoundingClientRect().width;
    const gap       = 24;
    const offset    = currentPage * perView * (cardWidth + gap);

    track.style.transform = `translateX(-${offset}px)`;
    updateDots();
    updateButtons();
  }

  function next() { goTo(currentPage + 1 >= totalPages() ? 0 : currentPage + 1); }
  function prev() { goTo(currentPage - 1); }

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(next, AUTOPLAY_MS);
  }

  function stopAutoplay() {
    if (autoplayTimer) clearInterval(autoplayTimer);
  }

  // Botones
  btnNext.addEventListener('click', () => { next(); startAutoplay(); });
  btnPrev.addEventListener('click', () => { prev(); startAutoplay(); });

  // Pausa el autoplay al hover
  track.parentElement.addEventListener('mouseenter', stopAutoplay);
  track.parentElement.addEventListener('mouseleave', startAutoplay);

  // Soporte táctil (swipe)
  let touchStartX = 0;
  track.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    stopAutoplay();
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
    startAutoplay();
  }, { passive: true });

  // Recalcula al cambiar el tamaño de ventana
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      buildDots();
      goTo(0);
      startAutoplay();
    }, 200);
  });

  // Init
  buildDots();
  goTo(0);
  startAutoplay();
});
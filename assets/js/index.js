document.addEventListener("DOMContentLoaded", () => {
  // compatibilidad con requestIdleCallback
  const runIdle = (cb, timeout = 1000) => {
    if ("requestIdleCallback" in window) {
      requestIdleCallback(cb, { timeout });
    } else {
      setTimeout(cb, timeout);
    }
  };

  // animación fade-in con IntersectionObserver
  const fadeElements = document.querySelectorAll('.fade-in');
  const observerOptions = { threshold: 0.1 };

  const fadeObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  fadeElements.forEach(el => fadeObserver.observe(el));

  // animación escalonada del hero principal
  const hero = document.querySelector('.hero');
  const heroTitle = hero?.querySelector('h1');
  const heroText = hero?.querySelector('p');
  const heroBtn = hero?.querySelector('.btn-primary');

  if (heroTitle && heroText && heroBtn) {
    [heroTitle, heroText, heroBtn].forEach(el => el.classList.add('fade-in'));

    setTimeout(() => heroTitle.classList.add('show'), 300);
    setTimeout(() => heroText.classList.add('show'), 600);
    setTimeout(() => heroBtn.classList.add('show'), 900);
  }

  // typewriter si es que existe
  const typewriter = document.querySelector(".typewriter");
  if (typewriter) {
    const text = typewriter.getAttribute("data-text") || "Impulsamos tu negocio con Inteligencia Artificial";
    typewriter.textContent = "";
    let i = 0;

    const type = () => {
      if (i < text.length) {
        typewriter.textContent += text.charAt(i);
        i++;
        setTimeout(type, 50);
      }
    };
    setTimeout(type, 500);
  }

  // botones a cal.com
  const calUrl = "https://cal.com/velinex/consultoria-inicial-ia";
  document.querySelectorAll('.btn-contact, .btn-primary').forEach(btn => {
    btn.addEventListener('click', e => {
      const isAnchor = btn.tagName === "A" && btn.href.includes(calUrl);
      if (!isAnchor) {
        e.preventDefault();
        window.open(calUrl, "_blank");
      }
    });
  });

  // scroll suave para anclas internas
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const targetId = anchor.getAttribute('href');
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Problemas/Soluciones
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const targetTab = document.getElementById(btn.dataset.tab);
      if (targetTab) targetTab.classList.add('active');
    });
  });

  // cascada
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  const testimonialObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('show');
        }, index * 200);
        testimonialObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  testimonialCards.forEach(card => testimonialObserver.observe(card));

  // activacion de elementos no mostrados cuando sea necesario
  setTimeout(() => {
    document.querySelectorAll('.fade-in:not(.show)').forEach(el => {
      el.classList.add('show');
    });
  }, 2500);

  // posibles errores de render, por seguridad en móviles principalmente
  runIdle(() => {
    const criticalSections = ['.hero', '.pain-section', '.services', '.benefits', '.testimonials', '.cta-final'];
    criticalSections.forEach(selector => {
      const section = document.querySelector(selector);
      if (section && section.offsetHeight === 0) {
        section.style.display = 'block';
        section.style.minHeight = '200px';
      }
    });
  });
});

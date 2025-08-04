document.addEventListener("DOMContentLoaded", () => {
  const fadeElements = document.querySelectorAll('.fade-in');
  const observerOptions = { threshold: 0.2 };
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target); 
      }
    });
  }, observerOptions);

  fadeElements.forEach(el => observer.observe(el));
  const hero = document.querySelector('.hero');
  const heroTitle = hero?.querySelector('h1');
  const heroText = hero?.querySelector('p');
  const heroBtn = hero?.querySelector('.btn-primary');

  if (heroTitle && heroText && heroBtn) {
    heroTitle.classList.add('fade-in');
    heroText.classList.add('fade-in');
    heroBtn.classList.add('fade-in');

    setTimeout(() => {
      heroTitle.classList.add('show');
    }, 300);
    setTimeout(() => {
      heroText.classList.add('show');
    }, 600);
    setTimeout(() => {
      heroBtn.classList.add('show');
    }, 900);
  }

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
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});

  // tabs de la segunda sección: Problemas / Soluciones
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      document.getElementById(btn.dataset.tab).classList.add('active');
    });
  });
const testimonialCards = document.querySelectorAll('.testimonial-card');

const testimonialObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('show');
      }, index * 200); // efecto en cascada
      testimonialObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

testimonialCards.forEach(card => testimonialObserver.observe(card));

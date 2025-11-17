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
  const calUrl = "https://cal.com/velinex/auditoria-inicial-ia";
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
  const lazyYouTubeContainers = document.querySelectorAll('.yt-lazy');
  lazyYouTubeContainers.forEach(container => {
    container.addEventListener('click', async function handleClick() {
      const id = container.dataset.videoId;
      if (!id) return;

      const thumbUrl = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
      const ytWatchUrl = `https://www.youtube.com/watch?v=${id}`;
      // fetchear la miniatura para detectar si YouTube está bloqueado
      try {
        const resp = await fetch(thumbUrl, { method: 'HEAD', mode: 'no-cors' });
        // Nota: muchos bloqueadores provocarán un error o una respuesta vacía.
        // Si no lanza excepción, no fue bloqueado y se crea el iframe.
        const iframe = document.createElement('iframe');
        iframe.id = 'vsl-video'
        iframe.src = `https://www.youtube-nocookie.com/embed/${id}?enablejsapi=1&vq=hd720&rel=0&modestbranding=1&autoplay=1`;
        iframe.title = 'Velinex — Video explicativo';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;
        iframe.frameBorder = '0';
        iframe.style.width = '100%';
        iframe.style.height = '100%';

        container.innerHTML = '';
        container.appendChild(iframe);
        // Setup YT Player for controlling quality (works after iframe is in DOM)
        (function setupYouTubeQuality() {
          function createPlayerWhenReady() {
            try {
              // si la API ya está lista
              if (window.YT && window.YT.Player) {
                // crea el player sobre el iframe con id 'vsl-video'
                new window.YT.Player('vsl-video', {
                  events: {
                    onReady: function(event) {
                      try {
                        // intenta fijar calidad y reproducir
                        event.target.setPlaybackQuality('hd720');
                        // si autoplay=1 no es suficiente, forzamos play
                        event.target.playVideo();
                      } catch (errInner) {
                        // no crítico: sólo logueamos
                        console.warn('YT: no se pudo fijar calidad o reproducir', errInner);
                      }
                    }
                  }
                });
                return;
              }
            } catch (err) {
              console.warn('YT init error', err);
            }

            // si no existe el script de la API lo inyectamos y definimos callback
            if (!document.getElementById('youtube-iframe-api')) {
              const tag = document.createElement('script');
              tag.id = 'youtube-iframe-api';
              tag.src = 'https://www.youtube.com/iframe_api';
              document.body.appendChild(tag);
            }

            // callback global que YouTube llama cuando la API está lista
            window.onYouTubeIframeAPIReady = function() {
              // pequeña espera para asegurar que el iframe ya esté totalmente montado
              setTimeout(() => {
                try { createPlayerWhenReady(); } catch(e){ console.warn(e); }
              }, 50);
            };
          }

          // Ejecutar intento inicial (por si la API ya estaba cargada)
          createPlayerWhenReady();
        })();

      } catch (e) {
        window.open(ytWatchUrl, '_blank', 'noopener,noreferrer');
      }
    }, { once: true });
    
  });
  // FAQ
  document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
      const faqItem = question.parentElement;
      const isActive = faqItem.classList.contains('active');
      
      // Cerrar todos los demás
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
      });
      
      // Abrir el clickeado si no estaba activo
      if (!isActive) {
        faqItem.classList.add('active');
      }
    });
  });
// Mostrar sticky CTA después de scroll
  const stickyCTA = document.querySelector('.sticky-cta-mobile');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 800) {
      stickyCTA.classList.add('show');
    } else {
      stickyCTA.classList.remove('show');
    }
    
    lastScroll = currentScroll;
  });
});

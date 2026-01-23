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
  const fadeElements = document.querySelectorAll(".fade-in");
  const observerOptions = { threshold: 0.1 };

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        fadeObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  fadeElements.forEach((el) => fadeObserver.observe(el));

  // animación escalonada del hero principal
  const hero = document.querySelector(".hero");
  const heroTitle = hero?.querySelector("h1");
  const heroText = hero?.querySelector("p");
  const heroBtn = hero?.querySelector(".btn-primary");

  if (heroTitle && heroText && heroBtn) {
    [heroTitle, heroText, heroBtn].forEach((el) => el.classList.add("fade-in"));

    setTimeout(() => heroTitle.classList.add("show"), 300);
    setTimeout(() => heroText.classList.add("show"), 600);
    setTimeout(() => heroBtn.classList.add("show"), 900);
  }

  // typewriter si es que existe
  const typewriter = document.querySelector(".typewriter");
  if (typewriter) {
    const text =
      typewriter.getAttribute("data-text") ||
      "Impulsamos tu negocio con Inteligencia Artificial";
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
  document.querySelectorAll(".btn-contact, .btn-primary").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const isAnchor = btn.tagName === "A" && btn.href.includes(calUrl);
      if (!isAnchor) {
        e.preventDefault();
        window.open(calUrl, "_blank");
      }
    });
  });

  // scroll suave para anclas internas
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const targetId = anchor.getAttribute("href");
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // Problemas/Soluciones
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabButtons.forEach((b) => b.classList.remove("active"));
      tabContents.forEach((c) => c.classList.remove("active"));

      btn.classList.add("active");
      const targetTab = document.getElementById(btn.dataset.tab);
      if (targetTab) targetTab.classList.add("active");
    });
  });

  // cascada
  const testimonialCards = document.querySelectorAll(".testimonial-card");
  const testimonialObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add("show");
          }, index * 200);
          testimonialObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 },
  );

  testimonialCards.forEach((card) => testimonialObserver.observe(card));

  // activacion de elementos no mostrados cuando sea necesario
  setTimeout(() => {
    document.querySelectorAll(".fade-in:not(.show)").forEach((el) => {
      el.classList.add("show");
    });
  }, 2500);

  // posibles errores de render, por seguridad en móviles principalmente
  runIdle(() => {
    const criticalSections = [
      ".hero",
      ".pain-section",
      ".services",
      ".benefits",
      ".testimonials",
      ".cta-final",
    ];
    criticalSections.forEach((selector) => {
      const section = document.querySelector(selector);
      if (section && section.offsetHeight === 0) {
        section.style.display = "block";
        section.style.minHeight = "200px";
      }
    });
  });

  // YouTube lazy load
  const lazyYouTubeContainers = document.querySelectorAll(".yt-lazy");
  lazyYouTubeContainers.forEach((container) => {
    container.addEventListener(
      "click",
      async function handleClick() {
        const id = container.dataset.videoId;
        if (!id) return;

        const thumbUrl = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
        const ytWatchUrl = `https://www.youtube.com/watch?v=${id}`;

        try {
          const resp = await fetch(thumbUrl, {
            method: "HEAD",
            mode: "no-cors",
          });

          const iframe = document.createElement("iframe");
          iframe.id = "vsl-video";
          iframe.src = `https://www.youtube-nocookie.com/embed/${id}?enablejsapi=1&vq=hd720&rel=0&modestbranding=1&autoplay=1`;
          iframe.title = "Velinex — Video explicativo";
          iframe.allow =
            "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
          iframe.allowFullscreen = true;
          iframe.frameBorder = "0";
          iframe.style.width = "100%";
          iframe.style.height = "100%";

          container.innerHTML = "";
          container.appendChild(iframe);

          (function setupYouTubeQuality() {
            function createPlayerWhenReady() {
              try {
                if (window.YT && window.YT.Player) {
                  new window.YT.Player("vsl-video", {
                    events: {
                      onReady: function (event) {
                        try {
                          event.target.setPlaybackQuality("hd720");
                          event.target.playVideo();
                        } catch (errInner) {
                          console.warn(
                            "YT: no se pudo fijar calidad o reproducir",
                            errInner,
                          );
                        }
                      },
                    },
                  });
                  return;
                }
              } catch (err) {
                console.warn("YT init error", err);
              }

              if (!document.getElementById("youtube-iframe-api")) {
                const tag = document.createElement("script");
                tag.id = "youtube-iframe-api";
                tag.src = "https://www.youtube.com/iframe_api";
                document.body.appendChild(tag);
              }

              window.onYouTubeIframeAPIReady = function () {
                setTimeout(() => {
                  try {
                    createPlayerWhenReady();
                  } catch (e) {
                    console.warn(e);
                  }
                }, 50);
              };
            }

            createPlayerWhenReady();
          })();
        } catch (e) {
          window.open(ytWatchUrl, "_blank", "noopener,noreferrer");
        }
      },
      { once: true },
    );
  });

  // FAQ
  document.querySelectorAll(".faq-question").forEach((question) => {
    question.addEventListener("click", () => {
      const faqItem = question.parentElement;
      const isActive = faqItem.classList.contains("active");

      document.querySelectorAll(".faq-item").forEach((item) => {
        item.classList.remove("active");
      });

      if (!isActive) {
        faqItem.classList.add("active");
      }
    });
  });

  // Mostrar sticky CTA después de scroll
  const stickyCTA = document.querySelector(".sticky-cta-mobile");
  let lastScroll = 0;

  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 800) {
      stickyCTA.classList.add("show");
    } else {
      stickyCTA.classList.remove("show");
    }

    lastScroll = currentScroll;
  });

  // ========================================
  // MODAL PARA IMÁGENES
  // ========================================
  const imageModal = document.getElementById("imageModal");
  const modalImage = document.getElementById("modalImage");
  const modalClose = document.getElementById("modalClose");

  if (imageModal && modalImage && modalClose) {
    // Hacer todas las imágenes de .visual-images clickeables
    document.querySelectorAll(".visual-images img").forEach((img) => {
      img.addEventListener("click", () => {
        modalImage.src = img.src;
        modalImage.alt = img.alt;
        imageModal.classList.add("active");
        document.body.style.overflow = "hidden";
      });
    });

    // Cerrar modal
    function closeModal() {
      imageModal.classList.remove("active");
      document.body.style.overflow = "";
    }

    modalClose.addEventListener("click", closeModal);

    // Cerrar al hacer click fuera de la imagen
    imageModal.addEventListener("click", (e) => {
      if (e.target === imageModal) {
        closeModal();
      }
    });

    // Cerrar con tecla ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && imageModal.classList.contains("active")) {
        closeModal();
      }
    });
  }

  // ========================================
  // TRACKING DE CLICKS EN CTAs
  // ========================================
  function trackCTAClick(buttonName) {
    // 1. Tracking local en localStorage
    const clicks = JSON.parse(localStorage.getItem("cta_clicks") || "{}");
    clicks[buttonName] = (clicks[buttonName] || 0) + 1;
    clicks[`${buttonName}_last_click`] = new Date().toISOString();
    clicks.total_clicks = (clicks.total_clicks || 0) + 1;
    localStorage.setItem("cta_clicks", JSON.stringify(clicks));

    // 2. Google Analytics (si está instalado)
    if (typeof gtag !== "undefined") {
      gtag("event", "cta_click", {
        event_category: "CTA",
        event_label: buttonName,
        value: 1,
      });
    }

    // 3. Meta Pixel (si está instalado)
    if (typeof fbq !== "undefined") {
      fbq("track", "Lead", {
        content_name: buttonName,
        source: "landing_page",
      });
    }

    // 4. Log para debugging
    console.log("🎯 CTA Click tracked:", {
      button: buttonName,
      timestamp: new Date().toLocaleString("es-AR"),
      total_clicks: clicks.total_clicks,
    });
  }

  // Función para ver estadísticas en consola
  window.getCTAStats = function () {
    const clicks = JSON.parse(localStorage.getItem("cta_clicks") || "{}");
    console.log("📊 Estadísticas de CTAs:");
    console.table(clicks);
    return clicks;
  };

  // Función para resetear estadísticas
  window.resetCTAStats = function () {
    localStorage.removeItem("cta_clicks");
    console.log("✅ Estadísticas reseteadas");
  };

  // Agregar event listeners a todos los botones CTA
  const ctaHero = document.querySelector(".btn-primary.schedule");
  if (ctaHero) {
    ctaHero.addEventListener("click", () => {
      trackCTAClick("CTA_Superior_Hero");
    });
  }

  const ctaFinal = document.querySelector(".cta-final .btn-primary");
  if (ctaFinal) {
    ctaFinal.addEventListener("click", () => {
      trackCTAClick("CTA_Final_Principal");
    });
  }

  const ctaSticky = document.querySelector(".sticky-cta-mobile .btn-primary");
  if (ctaSticky) {
    ctaSticky.addEventListener("click", () => {
      trackCTAClick("CTA_Sticky_Mobile");
    });
  }
});

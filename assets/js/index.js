document.addEventListener("DOMContentLoaded", () => {
  // ============================================================
  // UTILIDADES
  // ============================================================
  const runIdle = (cb, timeout = 1000) => {
    if ("requestIdleCallback" in window) {
      requestIdleCallback(cb, { timeout });
    } else {
      setTimeout(cb, timeout);
    }
  };

  // ============================================================
  // SMOOTH SCROLL AL CALENDARIO (global, llamada desde onclick)
  // ============================================================
  window.smoothScrollToCalendar = function (e) {
    if (e) e.preventDefault();
    const target = document.getElementById("cta-final");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // ============================================================
  // FADE-IN CON INTERSECTIONOBSERVER
  // ============================================================
  const fadeElements = document.querySelectorAll(".fade-in");
  const fadeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          fadeObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -30px 0px" },
  );

  fadeElements.forEach((el) => fadeObserver.observe(el));

  // ============================================================
  // ANIMACIÓN ESCALONADA DEL HERO
  // ============================================================
  const hero = document.querySelector(".hero");
  if (hero) {
    const staggerTargets = [
      hero.querySelector(".hero-badge"),
      hero.querySelector("h1"),
      hero.querySelector(".hero-subtitle"),
      hero.querySelector(".vsl-title"),
      hero.querySelector(".yt-lazy"),
      hero.querySelector(".cta-block"),
    ].filter(Boolean);

    // elementos que no tienen animación CSS propia
    const nonAnimated = staggerTargets.filter(
      (el) =>
        !el.classList.contains("hero-badge") &&
        !el.classList.contains("btn-primary"),
    );
    nonAnimated.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
      el.style.transition = "opacity 0.65s ease-out, transform 0.65s ease-out";
    });

    staggerTargets.forEach((el, i) => {
      setTimeout(
        () => {
          if (el) {
            el.style.opacity = "";
            el.style.transform = "";
          }
        },
        150 + i * 160,
      );
    });
  }

  // ============================================================
  // SOLUTION CARDS — ANIMACIÓN ESCALONADA AL SCROLL
  // ============================================================
  const solutionCards = document.querySelectorAll(".solution-card");
  if (solutionCards.length) {
    solutionCards.forEach((card) => {
      card.style.opacity = "0";
      card.style.transform = "translateY(24px)";
      card.style.transition =
        "opacity 0.55s ease-out, transform 0.55s ease-out";
    });

    const cardObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Array.from(solutionCards).indexOf(entry.target);
            setTimeout(() => {
              entry.target.style.opacity = "1";
              entry.target.style.transform = "translateY(0)";
            }, idx * 100);
            cardObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );

    solutionCards.forEach((card) => cardObserver.observe(card));
  }

  // ============================================================
  // PAIN CARDS — ANIMACIÓN ESCALONADA
  // ============================================================
  const painCards = document.querySelectorAll(".pain-card");
  if (painCards.length) {
    painCards.forEach((card) => {
      card.style.opacity = "0";
      card.style.transform = "translateY(20px)";
      card.style.transition = "opacity 0.5s ease-out, transform 0.5s ease-out";
    });

    const painObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Array.from(painCards).indexOf(entry.target);
            setTimeout(() => {
              entry.target.style.opacity = "1";
              entry.target.style.transform = "translateY(0)";
            }, idx * 120);
            painObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );

    painCards.forEach((card) => painObserver.observe(card));
  }

  // ============================================================
  // TYPEWRITER (si existe)
  // ============================================================
  const typewriter = document.querySelector(".typewriter");
  if (typewriter) {
    const text =
      typewriter.getAttribute("data-text") ||
      "El sistema que nunca para de convertir.";
    typewriter.textContent = "";
    let i = 0;
    const type = () => {
      if (i < text.length) {
        typewriter.textContent += text.charAt(i++);
        setTimeout(type, 50);
      }
    };
    setTimeout(type, 500);
  }

  // ============================================================
  // BOTONES A CAL.COM — fallback para los que abren nueva pestaña
  // ============================================================
  const calUrl = "https://cal.com/velinex/auditoria-inicial-ia";
  document.querySelectorAll(".btn-primary").forEach((btn) => {
    if (btn.tagName === "A") {
      const href = btn.getAttribute("href") || "";
      // Si apunta a #cta-final, ya maneja el scroll — no interferir
      if (href === "#cta-final") return;
      // Si no tiene href o apunta a cal.com externo, abrir nueva pestaña
      if (!href || href === calUrl) {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          window.open(calUrl, "_blank");
        });
      }
    }
  });

  // ============================================================
  // SCROLL SUAVE PARA ANCLAS INTERNAS
  // ============================================================
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const targetId = anchor.getAttribute("href");
      if (targetId === "#cta-final") return; // manejado por smoothScrollToCalendar
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // ============================================================
  // FAQ ACCORDION
  // ============================================================
  document.querySelectorAll(".faq-question").forEach((question) => {
    question.addEventListener("click", () => {
      const faqItem = question.parentElement;
      const isActive = faqItem.classList.contains("active");

      document.querySelectorAll(".faq-item").forEach((item) => {
        item.classList.remove("active");
      });

      if (!isActive) {
        faqItem.classList.add("active");
        setTimeout(() => {
          faqItem.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }, 360);
      }
    });
  });

  // ============================================================
  // STICKY CTA MOBILE
  // ============================================================
  const stickyCTA = document.querySelector(".sticky-cta-mobile");
  window.addEventListener(
    "scroll",
    () => {
      if (!stickyCTA) return;
      if (window.pageYOffset > 600) {
        stickyCTA.classList.add("show");
      } else {
        stickyCTA.classList.remove("show");
      }
    },
    { passive: true },
  );

  // ============================================================
  // CALENDARIO CAL.COM — MANEJO DEL IFRAME
  // ============================================================
  const calIframe = document.getElementById("cal-iframe");
  const calLoading = document.getElementById("cal-loading");

  // Mostrar iframe cuando carga
  window.handleCalLoad = function () {
    if (calLoading) calLoading.style.display = "none";
    if (calIframe) {
      calIframe.style.display = "block";
      // ajuste dinámico de altura via postMessage de Cal.com
    }
  };

  // Escuchar mensajes de Cal.com para ajustar la altura del iframe
  window.addEventListener("message", (e) => {
    if (!e.data || typeof e.data !== "object") return;
    // Cal.com emite { type: "cal:resize", data: { height } }
    if (e.data.type === "cal:resize" && calIframe) {
      const newHeight = e.data.data?.height;
      if (newHeight && newHeight > 200) {
        calIframe.style.minHeight = newHeight + "px";
        calIframe.style.height = newHeight + "px";
      }
    }
  });

  // Timeout de seguridad: si en 8s no cargó, mostrar fallback
  setTimeout(() => {
    if (calLoading && calLoading.style.display !== "none") {
      calLoading.innerHTML = `
        <p style="color:#94a3b8;font-size:0.9rem;">
          El calendario no cargó correctamente.
          <br>
          <a href="https://cal.com/velinex/auditoria-inicial-ia" target="_blank"
             style="color:#38bdf8;font-weight:700;"
             onclick="trackCTAClick('CTA_Cal_Fallback')">
            Hacé click aquí para agendar →
          </a>
        </p>
      `;
    }
  }, 8000);

  // ============================================================
  // YOUTUBE LAZY LOAD
  // ============================================================
  document.querySelectorAll(".yt-lazy").forEach((container) => {
    container.addEventListener(
      "click",
      function handleClick() {
        const id = container.dataset.videoId;
        if (!id) return;

        const ytWatchUrl = `https://www.youtube.com/watch?v=${id}`;

        try {
          const iframe = document.createElement("iframe");
          iframe.id = "vsl-video";
          iframe.src = `https://www.youtube-nocookie.com/embed/${id}?enablejsapi=1&vq=hd720&rel=0&modestbranding=1&autoplay=1`;
          iframe.title = "Velinex — Cómo funciona el sistema";
          iframe.allow =
            "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
          iframe.allowFullscreen = true;
          iframe.frameBorder = "0";
          iframe.style.width = "100%";
          iframe.style.height = "100%";

          container.innerHTML = "";
          container.appendChild(iframe);

          (function setupQuality() {
            function initPlayer() {
              try {
                if (window.YT && window.YT.Player) {
                  new window.YT.Player("vsl-video", {
                    events: {
                      onReady(event) {
                        try {
                          event.target.setPlaybackQuality("hd720");
                          event.target.playVideo();
                        } catch (e) {}
                      },
                    },
                  });
                  return;
                }
              } catch (e) {}

              if (!document.getElementById("yt-api")) {
                const tag = document.createElement("script");
                tag.id = "yt-api";
                tag.src = "https://www.youtube.com/iframe_api";
                document.body.appendChild(tag);
              }

              window.onYouTubeIframeAPIReady = function () {
                setTimeout(initPlayer, 50);
              };
            }
            initPlayer();
          })();
        } catch (e) {
          window.open(ytWatchUrl, "_blank", "noopener,noreferrer");
        }
      },
      { once: true },
    );
  });

  // ============================================================
  // MODAL PARA IMÁGENES
  // ============================================================
  const imageModal = document.getElementById("imageModal");
  const modalImage = document.getElementById("modalImage");
  const modalClose = document.getElementById("modalClose");

  if (imageModal && modalImage && modalClose) {
    document.querySelectorAll(".visual-images img").forEach((img) => {
      img.addEventListener("click", () => {
        modalImage.src = img.src;
        modalImage.alt = img.alt;
        imageModal.classList.add("active");
        document.body.style.overflow = "hidden";
      });
    });

    const closeModal = () => {
      imageModal.classList.remove("active");
      document.body.style.overflow = "";
    };

    modalClose.addEventListener("click", closeModal);
    imageModal.addEventListener("click", (e) => {
      if (e.target === imageModal) closeModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && imageModal.classList.contains("active"))
        closeModal();
    });
  }

  // ============================================================
  // SAFETY NET — forzar visibilidad en elementos bloqueados
  // ============================================================
  setTimeout(() => {
    document
      .querySelectorAll(".fade-in:not(.show)")
      .forEach((el) => el.classList.add("show"));
    document.querySelectorAll(".solution-card, .pain-card").forEach((el) => {
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    });
  }, 2800);

  runIdle(() => {
    [
      ".hero",
      ".pain-section",
      ".solution-section",
      ".for-who",
      ".faq",
      ".cta-final",
    ].forEach((sel) => {
      const section = document.querySelector(sel);
      if (section && section.offsetHeight === 0) {
        section.style.display = "block";
        section.style.minHeight = "200px";
      }
    });
  });

  // ============================================================
  // TRACKING CTAs
  // ============================================================
  function trackCTAClick(buttonName) {
    try {
      const clicks = JSON.parse(localStorage.getItem("cta_clicks") || "{}");
      clicks[buttonName] = (clicks[buttonName] || 0) + 1;
      clicks[`${buttonName}_last`] = new Date().toISOString();
      clicks.total = (clicks.total || 0) + 1;
      localStorage.setItem("cta_clicks", JSON.stringify(clicks));
    } catch (e) {}

    if (typeof gtag !== "undefined") {
      gtag("event", "cta_click", {
        event_category: "CTA",
        event_label: buttonName,
        value: 1,
      });
    }
    if (typeof fbq !== "undefined") {
      fbq("track", "Lead", {
        content_name: buttonName,
        source: "landing_page",
      });
    }
    console.log("🎯 CTA:", buttonName);
  }

  window.trackCTAClick = trackCTAClick;

  // Listeners por selector
  const ctaSelectors = [
    [".btn-primary.schedule", "CTA_Superior_Hero"],
    [".cta-final .btn-primary", "CTA_Final_Principal"],
    [".sticky-cta-mobile .btn-primary", "CTA_Sticky_Mobile"],
  ];
  ctaSelectors.forEach(([sel, name]) => {
    const el = document.querySelector(sel);
    if (el) el.addEventListener("click", () => trackCTAClick(name));
  });

  // Debugging
  window.getCTAStats = () => {
    try {
      const d = JSON.parse(localStorage.getItem("cta_clicks") || "{}");
      console.table(d);
      return d;
    } catch (e) {
      return {};
    }
  };
  window.resetCTAStats = () => {
    try {
      localStorage.removeItem("cta_clicks");
      console.log("✅ Reset");
    } catch (e) {}
  };
});

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
  // UTM CAPTURE + ATRIBUCIÓN (first-touch, persiste 30 días)
  // Guarda utm_source/medium/campaign/content/term del primer ingreso
  // y los reusa en toda la sesión (y sesiones siguientes hasta que
  // expiren) para pasarlos a WhatsApp, GA4 y al form de recursos.html.
  // ============================================================
  const UTM_KEYS = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
  ];
  const UTM_STORE_KEY = "velinex_attribution";
  const UTM_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 días

  function captureAttribution() {
    const params = new URLSearchParams(window.location.search);
    const incoming = {};
    UTM_KEYS.forEach((k) => {
      const v = params.get(k);
      if (v) incoming[k] = v;
    });

    let stored = null;
    try {
      stored = JSON.parse(localStorage.getItem(UTM_STORE_KEY) || "null");
    } catch (e) {}

    const expired = stored && Date.now() - stored.ts > UTM_TTL_MS;

    // First-touch: si ya hay algo guardado y no expiró, lo respetamos tal
    // cual (no pisamos la atribución original con visitas de vuelta sin UTM).
    if (stored && !expired) return stored;

    const fresh = {
      ...incoming,
      ts: Date.now(),
      referrer: document.referrer || "direct",
    };
    if (!fresh.utm_source) {
      // Sin UTM explícito: inferimos una fuente cruda del referrer para no
      // perder del todo la pista (ej. alguien que entra desde el bio de IG).
      try {
        const refHost = fresh.referrer !== "direct"
          ? new URL(fresh.referrer).hostname.replace(/^www\./, "")
          : "";
        if (refHost) fresh.utm_source = refHost;
      } catch (e) {}
    }
    try {
      localStorage.setItem(UTM_STORE_KEY, JSON.stringify(fresh));
    } catch (e) {}
    return fresh;
  }

  const attribution = captureAttribution();
  window.getAttribution = () => attribution;

  function buildUTMQueryString(attr) {
    return UTM_KEYS.filter((k) => attr[k])
      .map((k) => `${k}=${encodeURIComponent(attr[k])}`)
      .join("&");
  }

  function appendUTMs(url, attr) {
    const qs = buildUTMQueryString(attr || attribution);
    if (!qs) return url;
    return url + (url.includes("?") ? "&" : "?") + qs;
  }
  window.appendUTMs = appendUTMs;

  // ============================================================
  // SMOOTH SCROLL AL CTA FINAL (global, disponible para onclick).
  // Ya no la usa ningún botón del HTML (todos abren WhatsApp), queda
  // por compatibilidad si se vuelve a enlazar #cta-final desde arriba.
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
  // SOLUTION CARDS - ANIMACIÓN ESCALONADA AL SCROLL
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
  // PAIN CARDS - ANIMACIÓN ESCALONADA
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
      "Tu negocio atendiendo, calificando y cerrando en piloto automático.";
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
  // SCROLL SUAVE PARA ANCLAS INTERNAS
  // ============================================================
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
  // WHATSAPP - ATRIBUCIÓN EN EL MENSAJE PRE-CARGADO
  // Todos los CTAs del sitio abren WhatsApp (ya no hay calendario de
  // Cal.com). Sumamos la fuente al final del mensaje para que se lea
  // directo en la conversación, sin necesitar ningún backend.
  // ============================================================
  if (attribution.utm_source) {
    document
      .querySelectorAll('a[href*="api.whatsapp.com"], a[href*="wa.me"]')
      .forEach((link) => {
        try {
          const waUrl = new URL(link.href);
          const baseText = waUrl.searchParams.get("text") || "";
          if (baseText.includes("(vía ")) return;
          waUrl.searchParams.set(
            "text",
            `${baseText} (vía ${attribution.utm_source})`,
          );
          link.href = waUrl.toString();
        } catch (e) {}
      });
  }

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
          iframe.title = "Velinex - Cómo funciona el sistema";
          iframe.allow =
            "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
          iframe.allowFullscreen = true;
          iframe.frameBorder = "0";
          iframe.style.width = "100%";
          iframe.style.height = "100%";

          container.innerHTML = "";
          // Track play VSL
          if (typeof gtag !== "undefined") {
            gtag("event", "vsl_play", {
              event_category: "Video",
              event_label: "VSL Principal",
            });
          }
          container.appendChild(iframe);

          (function setupQuality() {
            function initPlayer() {
              try {
                if (window.YT && window.YT.Player) {
                  new window.YT.Player("vsl-video", {
                    events: {
                      onReady(event) {
                        try {
                          event.target.setPlaybackQuality("hd1080p");
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
  // MODAL PARA IMÁGENES Y VIDEO
  // ============================================================
  const imageModal = document.getElementById("imageModal");
  const modalContent = document.querySelector(".modal-content");
  const modalClose = document.getElementById("modalClose");

  if (imageModal && modalContent && modalClose) {
    // Para las imágenes
    document.querySelectorAll(".visual-images img").forEach((img) => {
      img.addEventListener("click", () => {
        // Limpiamos cualquier contenido previo (video o img)
        const oldMedia = modalContent.querySelector("img#modalImage, video#modalVideo");
        if (oldMedia) oldMedia.remove();

        const newImg = document.createElement("img");
        newImg.id = "modalImage";
        newImg.src = img.src;
        newImg.alt = img.alt;
        
        modalContent.appendChild(newImg);
        imageModal.classList.add("active");
        document.body.style.overflow = "hidden";
      });
    });

    // Para el video
    document.querySelectorAll(".proof-video-wrapper").forEach((wrapper) => {
      wrapper.addEventListener("click", () => {
        const video = wrapper.querySelector("video");
        if (!video) return;

        // Limpiamos cualquier contenido previo (video o img)
        const oldMedia = modalContent.querySelector("img#modalImage, video#modalVideo");
        if (oldMedia) oldMedia.remove();

        const newVideo = document.createElement("video");
        newVideo.id = "modalVideo";
        newVideo.src = video.src;
        newVideo.autoplay = true;
        newVideo.controls = true;
        newVideo.loop = true;
        newVideo.playsInline = true;

        modalContent.appendChild(newVideo);
        imageModal.classList.add("active");
        document.body.style.overflow = "hidden";
      });
    });

    const closeModal = () => {
      imageModal.classList.remove("active");
      document.body.style.overflow = "";
      // Pausar y remover video para que deje de sonar si lo cierran
      const video = modalContent.querySelector("video#modalVideo");
      if (video) {
        video.pause();
        video.src = "";
      }
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
  // SAFETY NET - forzar visibilidad en elementos bloqueados
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
        utm_source: attribution.utm_source || "(direct)",
        utm_medium: attribution.utm_medium || "(none)",
        utm_campaign: attribution.utm_campaign || "(none)",
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
  // ============================================================
  // SCROLL DEPTH - 25 / 50 / 75 / 100%
  // ============================================================
  (function () {
    const milestones = [25, 50, 75, 100];
    const reached = {};
    window.addEventListener(
      "scroll",
      function () {
        const scrollTop = window.scrollY;
        const docHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        if (docHeight <= 0) return;
        const pct = Math.round((scrollTop / docHeight) * 100);
        milestones.forEach(function (m) {
          if (pct >= m && !reached[m]) {
            reached[m] = true;
            if (typeof gtag !== "undefined") {
              gtag("event", "scroll_depth", {
                event_category: "Engagement",
                event_label: m + "%",
                value: m,
              });
            }
          }
        });
      },
      { passive: true },
    );
  })();
  // ============================================================
  // TIME ON PAGE - 30s / 60s / 120s
  // ============================================================
  [30, 60, 120].forEach(function (seconds) {
    setTimeout(function () {
      if (typeof gtag !== "undefined") {
        gtag("event", "time_on_page", {
          event_category: "Engagement",
          event_label: seconds + "s",
          value: seconds,
        });
      }
    }, seconds * 1000);
  });
  // ============================================================
  // CALENDAR REACHED - usuario llegó al CTA final (#cta-final).
  // Se mantiene el nombre del evento GA4 para no cortar el histórico,
  // aunque ya no hay calendario: hoy mide llegada al CTA de WhatsApp.
  // ============================================================
  (function () {
    const calSection = document.getElementById("cta-final");
    if (!calSection) return;
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            if (typeof gtag !== "undefined") {
              gtag("event", "calendar_reached", {
                event_category: "Conversion",
                event_label: "Usuario llegó al CTA final de WhatsApp",
                utm_source: attribution.utm_source || "(direct)",
                utm_medium: attribution.utm_medium || "(none)",
                utm_campaign: attribution.utm_campaign || "(none)",
              });
            }
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 },
    );
    observer.observe(calSection);
  })();
  // Cada CTA del HTML llama trackCTAClick(nombre) en su onclick - no se
  // agregan listeners por selector para no contar dos veces el mismo click.

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

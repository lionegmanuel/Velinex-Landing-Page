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
  // SMOOTH SCROLL A LA SECCIÓN DE DIAGNÓSTICO (global, para onclick).
  // Todos los CTAs principales del sitio la usan.
  // ============================================================
  window.smoothScrollToDiagnostic = function (e) {
    if (e) e.preventDefault();
    const target = document.getElementById("diagnostico");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  // Alias histórico: el HTML ya no la llama, queda por compatibilidad.
  window.smoothScrollToCalendar = window.smoothScrollToDiagnostic;

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
  const diagnosticoSection = document.getElementById("diagnostico");
  function updateStickyCTA() {
    if (!stickyCTA) return;
    // Dentro de #diagnostico el sticky sobra y tapa el formulario.
    let enDiagnostico = false;
    if (diagnosticoSection) {
      const r = diagnosticoSection.getBoundingClientRect();
      enDiagnostico = r.top < window.innerHeight && r.bottom > 0;
    }
    stickyCTA.classList.toggle(
      "show",
      window.pageYOffset > 600 && !enDiagnostico,
    );
  }
  window.addEventListener("scroll", updateStickyCTA, { passive: true });

  // ============================================================
  // NOTA: la atribución (utm_source) NO se concatena al texto de los
  // links de WhatsApp. Viaja por localStorage, GA4 y el payload del
  // formulario de diagnóstico. Nunca en el mensaje que ve el prospecto.
  // ============================================================

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
      ".diagnostic-flow-section",
    ].forEach((sel) => {
      const section = document.querySelector(sel);
      if (section && section.offsetHeight === 0) {
        section.style.display = "block";
        section.style.minHeight = "200px";
      }
    });
  });


  // ============================================================
  // FORMULARIO DE DIAGNÓSTICO ESTRATÉGICO
  // Envía el lead al webhook de n8n con la atribución ya capturada.
  // El token no es un secreto real (vive en JS público): filtra bots
  // básicos. Si se rota, actualizarlo acá, en recursos.html y en n8n.
  // ============================================================
  (function () {
    const form = document.getElementById("diagnostic-form");
    if (!form) return;

    const WEBHOOK_URL =
      "https://webhook-n8n.velinex.digital/webhook/lead-magnet";
    const WEBHOOK_TOKEN = "86C5N_6-692TcmqrUmWnjOlzzYDy5f-X";
    const SUBMIT_LABEL = "Solicitar Diagnóstico Estratégico →";

    const submitBtn = document.getElementById("diag-submit-btn");
    const feedback = document.getElementById("form-feedback");

    // E.164 estricto: + seguido de 8 a 15 dígitos. Garantiza código de país.
    const TELEFONO_E164 = /^\+[1-9]\d{7,14}$/;

    function showFeedback(type, html) {
      if (!feedback) return;
      feedback.className = "form-feedback-msg form-feedback-msg--" + type;
      feedback.innerHTML = html;
      feedback.style.display = "block";
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      form.telefono.setCustomValidity("");
      if (feedback) feedback.style.display = "none";

      const telefonoRaw = form.telefono.value.trim();
      const telefonoLimpio = "+" + telefonoRaw.replace(/[^\d]/g, "");
      // El "+" lo tiene que escribir la persona: si no está, no sabemos
      // si el número trae código de país o no.
      const telefonoValido =
        telefonoRaw.charAt(0) === "+" && TELEFONO_E164.test(telefonoLimpio);
      if (telefonoRaw && !telefonoValido) {
        form.telefono.setCustomValidity(
          "Escribí tu número con el código de país adelante, ej: +54 9 11 1234 5678.",
        );
      }

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const payload = {
        formId: "diagnostico_landing",
        responseId: crypto.randomUUID
          ? crypto.randomUUID()
          : String(Date.now()),
        nombre: form.nombre.value.trim(),
        email: form.email.value.trim().toLowerCase(),
        telefono: telefonoLimpio,
        cargo: form.cargo.value.trim(),
        empresa: form.empresa.value.trim(),
        sector: form.sector.value,
        consultas_diarias: form.consultas_diarias.value,
        freno_operativo: form.freno.value.trim(),
        origen: "landing_diagnostico",
        timestamp: new Date().toISOString(),
        utmSource: attribution.utm_source || "",
        utmMedium: attribution.utm_medium || "",
        utmCampaign: attribution.utm_campaign || "",
        utmContent: attribution.utm_content || "",
        utmTerm: attribution.utm_term || "",
        referrer: attribution.referrer || "",
      };

      // Honeypot lleno = bot. Simulamos éxito y no pegamos al webhook.
      if (form.empresa_web.value.trim()) {
        onSuccess(false);
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = "Procesando diagnóstico...";

      fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Velinex-Secret": WEBHOOK_TOKEN,
        },
        body: JSON.stringify(payload),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Webhook respondió " + res.status);
          onSuccess(true, payload);
        })
        .catch((err) => {
          console.error(err);
          submitBtn.disabled = false;
          submitBtn.textContent = SUBMIT_LABEL;
          showFeedback(
            "error",
            "No pudimos enviar tu solicitud. Reintentá en un momento o escribinos por WhatsApp con el botón verde de la esquina.",
          );
        });
    });

    function onSuccess(track, payload) {
      if (track && typeof gtag !== "undefined") {
        gtag("event", "diagnostic_submitted", {
          event_category: "Conversion",
          event_label: "Formulario de Diagnóstico Estratégico",
          sector: payload.sector,
          consultas_diarias: payload.consultas_diarias,
          utm_source: attribution.utm_source || "(direct)",
          utm_medium: attribution.utm_medium || "(none)",
          utm_campaign: attribution.utm_campaign || "(none)",
        });
      }
      if (track && typeof fbq !== "undefined") {
        fbq("track", "Lead", {
          content_name: "Diagnostico_Estrategico",
          source: "landing_page",
        });
      }
      form
        .querySelectorAll(".form-step-block, .form-action-row")
        .forEach((el) => {
          el.style.display = "none";
        });
      showFeedback(
        "ok",
        "<strong>Diagnóstico recibido.</strong> Nos ponemos en contacto en menos de 24 horas para coordinar tu sesión estratégica.",
      );
      if (feedback) {
        feedback.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  })();

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
  // CALENDAR REACHED - usuario llegó a la sección de diagnóstico.
  // Se mantiene el nombre del evento GA4 para no cortar el histórico,
  // aunque ya no hay calendario: hoy mide llegada a #diagnostico.
  // ============================================================
  (function () {
    const calSection = document.getElementById("diagnostico");
    if (!calSection) return;
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            if (typeof gtag !== "undefined") {
              gtag("event", "calendar_reached", {
                event_category: "Conversion",
                event_label: "Usuario llegó a la sección de diagnóstico",
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

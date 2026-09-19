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
  // SIMULADOR DE FUGAS OPERATIVAS (#simulador)
  // Calcula en vivo consultas que se enfrían, operaciones perdidas y
  // horas del equipo. Expone window.applyLeakSimulatorToForm() para
  // precargar el formulario de diagnóstico con lo que eligió el
  // visitante. Los coeficientes son promedios orientativos por rubro.
  // ============================================================
  const leakSim = (function () {
    const root = document.getElementById("leak-simulator");
    if (!root) return null;

    const range = document.getElementById("leak-volume");
    const volumeOut = document.getElementById("leak-volume-value");
    const chips = Array.from(root.querySelectorAll(".leak-chip"));
    const options = Array.from(root.querySelectorAll(".leak-option"));
    const lostEl = document.getElementById("leak-lost-value");
    const lostNote = document.getElementById("leak-lost-note");
    const opsEl = document.getElementById("leak-ops-value");
    const opsLabel = document.getElementById("leak-ops-label");
    const hoursEl = document.getElementById("leak-hours-value");
    const hoursNote = document.getElementById("leak-hours-note");
    if (!range || !lostEl || !opsEl || !hoursEl) return null;

    // Porcentaje de consultas que se enfrían según cobertura fuera de hora.
    const FACTOR_FUGA = { si: 0.1, parcial: 0.25, no: 0.45 };
    const COVERAGE_TEXT = {
      si: "con atención activa a toda hora",
      parcial: "con respuesta parcial fuera de horario",
      no: "sin atención fuera del horario de oficina",
    };
    // Tasa de cierre estimada sobre las consultas enfriadas, por rubro.
    const SECTORS = {
      concesionaria: {
        label: "Concesionaria automotriz",
        unit: "operaciones potenciales perdidas por mes",
        min: 0.009,
        max: 0.018,
        formSector: "Automotriz",
      },
      inmobiliaria: {
        label: "Inmobiliaria / Desarrollos",
        unit: "visitas con asesor que hoy no se agendan por mes",
        min: 0.03,
        max: 0.06,
        formSector: "Inmobiliario",
      },
      clinica: {
        label: "Clínica / Salud",
        unit: "turnos potenciales perdidos por mes",
        min: 0.033,
        max: 0.066,
        formSector: "Salud y Clínicas",
      },
      retail: {
        label: "Óptica / Retail",
        unit: "ventas potenciales perdidas por mes",
        min: 0.04,
        max: 0.08,
        formSector: "Retail",
      },
      b2b: {
        label: "Servicios y Empresas B2B",
        unit: "reuniones comerciales perdidas por mes",
        min: 0.02,
        max: 0.04,
        formSector: "Servicios Profesionales",
      },
    };
    const MINUTES_PER_QUERY = 3.5;
    const DAYS_PER_MONTH = 30;
    const HOURS_PER_SHIFT = 8;

    const state = {
      volume: parseInt(range.value, 10) || 60,
      sector: "concesionaria",
      coverage: "parcial",
      used: false,
      applied: false,
    };

    const fmt = new Intl.NumberFormat("es-AR");
    const reduceMotion =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function compute() {
      const monthly = state.volume * DAYS_PER_MONTH;
      const lost = Math.round(monthly * FACTOR_FUGA[state.coverage]);
      const sector = SECTORS[state.sector];
      let opsMin = Math.max(1, Math.round(lost * sector.min));
      let opsMax = Math.max(opsMin, Math.round(lost * sector.max));
      const hours = Math.round((monthly * MINUTES_PER_QUERY) / 60);
      const shifts = Math.max(1, Math.round(hours / HOURS_PER_SHIFT));
      return { monthly, lost, opsMin, opsMax, hours, shifts, sector };
    }

    // Tween corto de números: arranca desde el valor que se está mostrando
    // para que mover el slider rápido no salte ni se encole.
    const tweens = new WeakMap();
    function animateNumber(el, to) {
      const from = parseInt(el.dataset.count, 10) || 0;
      if (tweens.has(el)) cancelAnimationFrame(tweens.get(el));
      if (reduceMotion || from === to) {
        el.dataset.count = String(to);
        el.textContent = fmt.format(to);
        return;
      }
      const duration = 380;
      const start = performance.now();
      function frame(now) {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        const val = Math.round(from + (to - from) * eased);
        el.dataset.count = String(val);
        el.textContent = fmt.format(val);
        if (t < 1) {
          tweens.set(el, requestAnimationFrame(frame));
        } else {
          tweens.delete(el);
        }
      }
      tweens.set(el, requestAnimationFrame(frame));
    }

    function bump(el) {
      if (reduceMotion) return;
      el.classList.remove("is-bumping");
      // Reinicia la animación aunque el cambio sea consecutivo.
      void el.offsetWidth;
      el.classList.add("is-bumping");
    }

    function render(animate) {
      const r = compute();
      const min = parseInt(range.min, 10);
      const max = parseInt(range.max, 10);
      const pct = ((state.volume - min) / (max - min)) * 100;
      range.style.setProperty("--leak-fill", pct.toFixed(1) + "%");
      const volumeLabel =
        state.volume >= max ? fmt.format(max) + "+" : fmt.format(state.volume);
      if (volumeOut) volumeOut.textContent = volumeLabel;
      range.setAttribute("aria-valuetext", volumeLabel + " consultas por día");

      if (animate) {
        animateNumber(lostEl, r.lost);
        animateNumber(hoursEl, r.hours);
        bump(lostEl);
      } else {
        lostEl.dataset.count = String(r.lost);
        lostEl.textContent = fmt.format(r.lost);
        hoursEl.dataset.count = String(r.hours);
        hoursEl.textContent = fmt.format(r.hours);
      }
      if (lostNote) {
        lostNote.textContent =
          "Sobre " +
          fmt.format(r.monthly) +
          " consultas mensuales, " +
          COVERAGE_TEXT[state.coverage] +
          ".";
      }
      const opsText =
        r.opsMin === r.opsMax
          ? fmt.format(r.opsMin)
          : fmt.format(r.opsMin) + " a " + fmt.format(r.opsMax);
      if (opsEl.textContent !== opsText) {
        opsEl.textContent = opsText;
        if (animate) bump(opsEl);
      }
      if (opsLabel) opsLabel.textContent = r.sector.unit;
      if (hoursNote) {
        hoursNote.textContent =
          "Equivale a " +
          fmt.format(r.shifts) +
          (r.shifts === 1 ? " jornada completa" : " jornadas completas") +
          " de una persona.";
      }
    }

    function markUsed() {
      if (state.used) return;
      state.used = true;
      if (typeof gtag !== "undefined") {
        gtag("event", "leak_simulator_used", {
          event_category: "Engagement",
          event_label: "Simulador de fugas",
        });
      }
    }

    function selectInGroup(list, target, attr, key) {
      list.forEach((btn) => {
        const active = btn === target;
        btn.classList.toggle("is-active", active);
        btn.setAttribute("aria-checked", active ? "true" : "false");
      });
      state[key] = target.dataset[attr];
    }

    function bindGroup(list, attr, key) {
      list.forEach((btn, idx) => {
        btn.addEventListener("click", () => {
          selectInGroup(list, btn, attr, key);
          markUsed();
          render(true);
        });
        btn.addEventListener("keydown", (e) => {
          let next = null;
          if (e.key === "ArrowRight" || e.key === "ArrowDown") {
            next = list[(idx + 1) % list.length];
          } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
            next = list[(idx - 1 + list.length) % list.length];
          }
          if (next) {
            e.preventDefault();
            next.focus();
            next.click();
          }
        });
      });
    }

    range.addEventListener("input", () => {
      state.volume = parseInt(range.value, 10) || state.volume;
      markUsed();
      render(true);
    });
    bindGroup(chips, "sector", "sector");
    bindGroup(options, "coverage", "coverage");

    render(false);

    function snapshot() {
      const r = compute();
      return {
        consultas_dia: state.volume >= parseInt(range.max, 10)
          ? state.volume + "+"
          : state.volume,
        rubro: r.sector.label,
        cobertura_fuera_de_hora: state.coverage,
        consultas_mes: r.monthly,
        consultas_enfriadas_mes: r.lost,
        operaciones_perdidas_min: r.opsMin,
        operaciones_perdidas_max: r.opsMax,
        horas_equipo_mes: r.hours,
        interactuo: state.used,
      };
    }

    return { state, compute, snapshot, SECTORS, COVERAGE_TEXT, fmt };
  })();

  // ------------------------------------------------------------
  // Precarga del formulario de diagnóstico con lo elegido en el
  // simulador. Solo pisa campos que la persona no tocó a mano.
  // ------------------------------------------------------------
  (function () {
    const form = document.getElementById("diagnostic-form");
    if (!form || !leakSim) {
      window.applyLeakSimulatorToForm = function () {};
      return;
    }
    const volumeSelect = document.getElementById("diag-volume");
    const sectorSelect = document.getElementById("diag-sector");
    const bottleneck = document.getElementById("diag-bottleneck");
    const note = document.getElementById("diag-prefill-note");
    const noteText = document.getElementById("diag-prefill-text");
    let settingProgrammatically = false;

    [volumeSelect, sectorSelect, bottleneck].forEach((el) => {
      if (!el) return;
      const mark = () => {
        if (!settingProgrammatically) el.dataset.userEdited = "1";
      };
      el.addEventListener("change", mark);
      el.addEventListener("input", mark);
    });

    function volumeToOption(v) {
      if (v <= 70) return "40-70";
      if (v <= 150) return "70-150";
      return "+150";
    }

    function setIfUntouched(el, value) {
      if (!el || el.dataset.userEdited === "1") return false;
      settingProgrammatically = true;
      el.value = value;
      settingProgrammatically = false;
      return true;
    }

    window.applyLeakSimulatorToForm = function (opts) {
      const silent = !!(opts && opts.silent);
      const snap = leakSim.snapshot();
      const state = leakSim.state;
      const sector = leakSim.SECTORS[state.sector];
      let touched = false;

      touched = setIfUntouched(volumeSelect, volumeToOption(state.volume)) || touched;
      touched = setIfUntouched(sectorSelect, sector.formSector) || touched;

      if (bottleneck && bottleneck.dataset.userEdited !== "1") {
        const draft =
          "Recibo unas " +
          snap.consultas_dia +
          " consultas por día y hoy estamos " +
          leakSim.COVERAGE_TEXT[state.coverage] +
          ". Según el simulador se me enfrían cerca de " +
          leakSim.fmt.format(snap.consultas_enfriadas_mes) +
          " consultas al mes y el equipo dedica unas " +
          leakSim.fmt.format(snap.horas_equipo_mes) +
          " horas mensuales a responder lo mismo.";
        touched = setIfUntouched(bottleneck, draft) || touched;
      }

      if (note && noteText && touched) {
        noteText.innerHTML =
          "Precargamos tu simulación: <strong>" +
          snap.consultas_dia +
          " consultas/día</strong> · <strong>" +
          sector.label +
          "</strong> · " +
          leakSim.COVERAGE_TEXT[state.coverage] +
          ". Podés ajustar cualquier dato.";
        note.hidden = false;
      }

      state.applied = true;
      if (!silent && typeof gtag !== "undefined") {
        gtag("event", "leak_simulator_apply", {
          event_category: "Conversion",
          event_label: "CTA del simulador",
          rubro: snap.rubro,
          cobertura: snap.cobertura_fuera_de_hora,
          consultas_dia: state.volume,
          consultas_enfriadas_mes: snap.consultas_enfriadas_mes,
        });
      }
    };

    // Si usó el simulador pero bajó al formulario por su cuenta (sin
    // tocar el CTA), igual le reflejamos sus datos al llegar.
    const diagSection = document.getElementById("diagnostico");
    if (diagSection && "IntersectionObserver" in window) {
      const autoApply = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            if (leakSim.state.used && !leakSim.state.applied) {
              window.applyLeakSimulatorToForm({ silent: true });
            }
          });
        },
        { threshold: 0.15 },
      );
      autoApply.observe(diagSection);
    }
  })();

  // ============================================================
  // STICKY CTA MOBILE (dos modos)
  // "simulador": lleva a #simulador con "Calcular fuga".
  // "diagnostico": una vez que pasó o usó el simulador, lleva a #diagnostico.
  // Se oculta mientras el simulador o el formulario están en pantalla.
  // ============================================================
  const stickyCTA = document.getElementById("sticky-cta-mobile");
  const stickyLink = document.getElementById("sticky-cta-link");
  const heroSection = document.querySelector(".hero");
  const simuladorSection = document.getElementById("simulador");
  const diagnosticoSection = document.getElementById("diagnostico");
  const STICKY_MODES = {
    simulador: { text: "¿Cuántas consultas perdés? Calcular fuga →", href: "#simulador" },
    diagnostico: { text: "Solicitar Diagnóstico Estratégico →", href: "#diagnostico" },
  };

  function setStickyMode(mode) {
    if (!stickyCTA || !stickyLink) return;
    if (!simuladorSection) mode = "diagnostico";
    if (stickyCTA.dataset.mode === mode) return;
    stickyCTA.dataset.mode = mode;
    stickyLink.textContent = STICKY_MODES[mode].text;
    stickyLink.setAttribute("href", STICKY_MODES[mode].href);
  }

  function updateStickyCTA() {
    if (!stickyCTA) return;
    const vh = window.innerHeight;
    // Aparece recién cuando el hero quedó completamente arriba.
    let pastHero = window.pageYOffset > 600;
    if (heroSection) pastHero = heroSection.getBoundingClientRect().bottom < 0;

    let enDiagnostico = false;
    if (diagnosticoSection) {
      const r = diagnosticoSection.getBoundingClientRect();
      enDiagnostico = r.top < vh && r.bottom > 0;
    }
    let enSimulador = false;
    let pasoSimulador = false;
    if (simuladorSection) {
      const r = simuladorSection.getBoundingClientRect();
      enSimulador = r.top < vh - 120 && r.bottom > 120;
      pasoSimulador = r.bottom < vh * 0.5;
    }
    const usoSimulador = !!(leakSim && leakSim.state.used);
    setStickyMode(pasoSimulador || usoSimulador ? "diagnostico" : "simulador");
    stickyCTA.classList.toggle(
      "show",
      pastHero && !enDiagnostico && !enSimulador,
    );
  }
  window.addEventListener("scroll", updateStickyCTA, { passive: true });
  window.addEventListener("resize", updateStickyCTA, { passive: true });
  setStickyMode(simuladorSection ? "simulador" : "diagnostico");

  window.handleStickyCTA = function (e) {
    if (e) e.preventDefault();
    const mode = stickyCTA ? stickyCTA.dataset.mode : "diagnostico";
    if (mode === "simulador" && simuladorSection) {
      trackCTAClick("CTA_Sticky_Mobile_Simulador");
      simuladorSection.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    trackCTAClick("CTA_Sticky_Mobile");
    if (leakSim && leakSim.state.used) {
      window.applyLeakSimulatorToForm({ silent: true });
    }
    window.smoothScrollToDiagnostic();
  };

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
        // Lo que eligió en el simulador de fugas (null si no lo usó).
        simulador:
          leakSim && (leakSim.state.used || leakSim.state.applied)
            ? leakSim.snapshot()
            : null,
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

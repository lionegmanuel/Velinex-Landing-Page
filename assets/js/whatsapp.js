/* WhatsApp con el mensaje según de dónde viene la persona.

   Todos los botones con data-wa="<nombre del botón>" abren WhatsApp con
   un mensaje armado al momento del clic:
     · YouTube con un video conocido (utm_content = ID del video en la
       descripción o el comentario fijado): nombra ese video.
     · YouTube sin video claro (otro utm_content o llegó desde youtube.com):
       dice que viene de YouTube, sin nombrar video.
     · Instagram, LinkedIn o Facebook: dice la red.
     · Cualquier otro caso: mensaje general.
   Si usó la calculadora, suma sus números. El botón del cierre suma
   "Vi la web entera" (señal de que leyó todo).

   Videos nuevos: no hace falta cargarlos. Si el ID no está en VIDEOS, la
   web le pide a YouTube el título (oEmbed) y, si el video es del canal de
   Manuel, el mensaje lo nombra por su título. Si YouTube no responde o el
   video es de otro canal, cae en "te vi en YouTube", nunca nombra un video
   equivocado. VIDEOS queda solo para elegir un tema más natural que el
   título, cuando valga la pena. */
(function () {
  var TELEFONO = "5493534270844";

  var VIDEOS = {
    "6RQtFonJZTE": "cómo editás tus videos con Claude y DaVinci",
    "onjHwIELWXU": "el sistema operativo con Claude Code que maneja tu negocio",
    "video_33": "el sistema operativo con Claude Code que maneja tu negocio",
    "Ii2H2AsHleM": "el sistema de WhatsApp con Claude que sube las ventas",
    "TmMgCAUhkvY": "cómo crear apps con Google Antigravity",
    "iClTWAluVnU": "el método Karpathy para usar Claude Code",
    "metodo-karpathy": "el método Karpathy para usar Claude Code",
    "metodo-karpathy-2": "el método Karpathy para usar Claude Code",
    "FnGh8hhX5BY": "las infografías editables de NotebookLM",
    "_xFTInmQVaw": "el sistema con Claude para automatizar toda la empresa",
    "C8fSDTjAAoA": "el equipo de programadores con agentes de Claude Code",
    "multiagentes-claude-code": "el equipo de programadores con agentes de Claude Code",
    "XUXgT8kJOEU": "cómo crear apps web con Google Antigravity",
    "gCqZKvPxTmw": "el CRM de WhatsApp gratis con IA",
    "7qVIQIKaW8E": "los videos de cine con Gemini y Flow",
    "video_29": "los videos con Gemini y Flow",
    "video_30": "Gemini como empleado de IA",
    "Is-fOu8HrT4": "cómo generar imágenes realistas con IA",
    "le8hTQ7LY8I": "cómo Claude edita tus videos en DaVinci",
    "sPxp6AxIk5Y": "el dashboard en 5 minutos con Claude",
    "80Jwu58BInI": "las 6 automatizaciones con Claude para un negocio",
    "Da7X3k1dB34": "el CRM gratis con Claude Code y WhatsApp",
    "t1S1v_IZ1gY": "el equipo de marketing con IA en Claude Code",
    "CLGpDTDoqz0": "Claude para agentes inmobiliarios",
    "t_mLs_eai2w": "cómo conectaste Claude con Canva",
    "8lVzj3T1QIw": "Claude Code editando en DaVinci",
    "N1gGB876yQU": "las 5 skills de Claude Code para marketing",
    "dvDkNn7eBBU": "NotebookLM para aprender idiomas",
    "qie7mlJ4abE": "el mejor CRM con IA gratis",
    "emsbvjsLpnw": "los 6 repos de GitHub para Claude Code",
    "nxo16JXbBhY": "cómo Claude Code crea todo tu contenido",
    "4In71ihWiv4": "el método de prompts para dominar Claude",
    "qQl1SgEHKr4": "cómo Claude Code edita por vos",
    "0HPSVYYkfOo": "el cambio de Meta en WhatsApp",
    "4YJmJ0Ln0mM": "cómo gastar 90% menos de tokens en Claude Code",
    "vsl": "la transformación operativa con Software y Agentes de IA",
    "vsl-oficial": "la transformación operativa con Software y Agentes de IA",
    "vsl-octubre-2026": "la transformación operativa con Software y Agentes de IA",
    "CvYPRjrf_Bk": "la transformación operativa con Software y Agentes de IA",
    "video_37": "el agente de WhatsApp para negocios que atiende solo y agenda visitas",
    "c0jrbYYxTMo": "el agente de WhatsApp para negocios que atiende solo y agenda visitas",
    "whatsapp-negocio-ia": "el agente de WhatsApp para negocios que atiende solo y agenda visitas"
  };

  var REDES = [
    { re: /(^|\.)instagram\.com$|^instagram$|^ig$/, nombre: "Instagram" },
    { re: /(^|\.)linkedin\.com$|^lnkd\.in$|^linkedin$/, nombre: "LinkedIn" },
    { re: /(^|\.)facebook\.com$|^fb\.me$|^facebook$|^fb$/, nombre: "Facebook" }
  ];
  var ES_YOUTUBE = /(^|\.)youtube\.com$|^youtu\.be$|^youtube$/;

  function leer(clave) {
    try { return JSON.parse(localStorage.getItem(clave) || "null"); } catch (e) { return null; }
  }

  // Lo que trae el link de esta visita manda; si no trae nada, lo que quedó
  // guardado de la primera visita (index.js, 30 días).
  function origen() {
    var p = new URLSearchParams(location.search);
    if (p.get("utm_source")) {
      return { fuente: p.get("utm_source"), video: p.get("utm_content") || "" };
    }
    var g = leer("velinex_attribution") || {};
    var fuente = g.utm_source || "";
    if (!fuente && document.referrer) {
      try { fuente = new URL(document.referrer).hostname; } catch (e) {}
    }
    return { fuente: fuente, video: g.utm_content || "" };
  }

  function canal(o) {
    var f = String(o.fuente || "").toLowerCase().replace(/^(www|m|l|lm)\./, "");
    if (ES_YOUTUBE.test(f)) {
      return { tipo: "youtube", video: VIDEOS[o.video] || titulo(o.video) ? o.video : "" };
    }
    for (var i = 0; i < REDES.length; i++) {
      if (REDES[i].re.test(f)) return { tipo: "red", red: REDES[i].nombre };
    }
    return { tipo: "general" };
  }

  function calculadora() {
    var info = typeof window.getSimInfo === "function" ? window.getSimInfo() : null;
    if (!info) return "";
    var fmt = new Intl.NumberFormat("es-AR");
    return " Hice la cuenta en la calculadora: recibimos unas " + info.consultas_dia +
      " consultas por día y se nos enfrían cerca de " + fmt.format(info.consultas_enfriadas_mes) +
      " por mes.";
  }

  function mensaje(boton) {
    var c = canal(origen());
    var cierre = " y quiero ver cómo funcionaría el sistema en mi negocio.";
    var texto;
    if (c.tipo === "youtube" && c.video) {
      texto = "Hola Manuel, vi tu video " +
        (VIDEOS[c.video] ? "sobre " + VIDEOS[c.video] : "«" + titulo(c.video) + "»") +
        " y quiero ver cómo sería algo así en mi negocio.";
    } else if (c.tipo === "youtube") {
      texto = "Hola Manuel, te vi en YouTube" + cierre;
    } else if (c.tipo === "red") {
      texto = "Hola Manuel, te vi en " + c.red + cierre;
    } else {
      texto = "Hola Manuel, quiero ver cómo funcionaría el sistema en mi negocio.";
    }
    texto += calculadora();
    if (boton === "cierre") texto += " Vi la web entera.";
    return { texto: texto, canal: c };
  }

  function link(texto) {
    return "https://wa.me/" + TELEFONO + "?text=" + encodeURIComponent(texto);
  }

  function preparar(a) {
    a.href = link(mensaje(a.getAttribute("data-wa")).texto);
  }

  function alClic(e) {
    var a = e.target.closest ? e.target.closest("a[data-wa]") : null;
    if (!a) return;
    var boton = a.getAttribute("data-wa");
    var m = mensaje(boton);
    a.href = link(m.texto);
    var datos = {
      boton: boton,
      canal: m.canal.tipo === "red" ? m.canal.red.toLowerCase() : m.canal.tipo,
      video: m.canal.video || ""
    };
    if (window.VelinexMedicion) window.VelinexMedicion.evento("whatsapp_click", datos);
    else if (typeof window.gtag === "function") window.gtag("event", "whatsapp_click", datos);
    if (typeof window.clarity === "function") window.clarity("set", "hablo_por_whatsapp", "si");
    if (typeof window.fbq === "function") window.fbq("track", "Contact");
    if (typeof window.trackCTAClick === "function") window.trackCTAClick("WA_" + boton);
  }

  // Título de un video del canal que no está en VIDEOS (guardado por ID).
  function titulo(id) {
    if (!id) return "";
    try { return localStorage.getItem("velinex_titulo_" + id) || ""; } catch (e) { return ""; }
  }

  function buscarTitulo(id, alTerminar) {
    if (!id || VIDEOS[id] || titulo(id) || !/^[A-Za-z0-9_-]{11}$/.test(id) || !window.fetch) return;
    fetch("https://www.youtube.com/oembed?format=json&url=" +
      encodeURIComponent("https://www.youtube.com/watch?v=" + id))
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) {
        if (!d || !d.title || !/@lionegmanuel/i.test(d.author_url || "")) return;
        try { localStorage.setItem("velinex_titulo_" + id, d.title); } catch (e) {}
        alTerminar();
      })
      .catch(function () {});
  }

  function prepararTodos() {
    var botones = document.querySelectorAll("a[data-wa]");
    for (var i = 0; i < botones.length; i++) preparar(botones[i]);
  }

  function iniciar() {
    var botones = document.querySelectorAll("a[data-wa]");
    for (var i = 0; i < botones.length; i++) {
      var a = botones[i];
      a.target = "_blank";
      a.rel = "noopener";
      preparar(a);
    }
    document.addEventListener("click", alClic, true);
    var o = origen();
    if (ES_YOUTUBE.test(String(o.fuente || "").toLowerCase().replace(/^(www|m)\./, ""))) {
      buscarTitulo(o.video, prepararTodos);
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar);
  else iniciar();
})();

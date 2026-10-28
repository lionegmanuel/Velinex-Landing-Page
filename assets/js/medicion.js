/* ════════════════════════════════════════════════════════════════════════════
   medicion.js · qué hace cada persona en velinex.digital

   Una sola pieza para todas las páginas:
   1. Mapa de calor y grabaciones con Microsoft Clarity (gratis). Se prende
      solo cuando CLARITY_ID tiene valor. Clarity tapa lo que se escribe en
      los formularios.
   2. Cuánto mira cada uno los videos (la clase del imán, el VSL de la landing
      y el del puente): inicio, 10, 25, 50, 75, 90 y 100%, y segundos vistos.
   3. Eventos atados a la persona: cada visitante tiene un id propio en su
      navegador y, cuando deja sus datos, ese id queda unido a su Response_ID.
      Todo va a Google Analytics y, si EVENTO_URL tiene valor, también a n8n
      (pestaña "eventos" de leads_base), para verlo por persona.

   Uso desde las páginas:
     VelinexMedicion.evento("nombre_del_evento", { dato: "valor" });
     VelinexMedicion.seguirVideo(iframe, "clase");      // iframe de YouTube
     VelinexMedicion.seguirReproductor(player, "vsl");  // YT.Player ya creado
     VelinexMedicion.marcarLead(responseId, { califica: true });
   ════════════════════════════════════════════════════════════════════════════ */
(function (global) {
  "use strict";

  // Microsoft Clarity: el ID del proyecto (clarity.microsoft.com > Settings).
  var CLARITY_ID = "";
  // Webhook de n8n que guarda los eventos por persona. Vacío = solo GA4.
  var EVENTO_URL = "";
  var EVENTO_TOKEN = "86C5N_6-692TcmqrUmWnjOlzzYDy5f-X";

  function leer(clave) {
    try { return JSON.parse(localStorage.getItem(clave) || "null"); } catch (e) { return null; }
  }
  function guardar(clave, valor) {
    try { localStorage.setItem(clave, JSON.stringify(valor)); } catch (e) {}
  }
  function nuevoId() {
    return global.crypto && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2);
  }

  // ── Quién es ──────────────────────────────────────────────────────────────
  var visitante = leer("velinex_visitante");
  if (!visitante || !visitante.id) {
    visitante = { id: nuevoId(), desde: Date.now() };
    guardar("velinex_visitante", visitante);
  }
  var atribucion = leer("velinex_attribution") || {};
  var params = new URLSearchParams(location.search);
  var origen = {
    utm_source: params.get("utm_source") || atribucion.utm_source || "",
    utm_content: params.get("utm_content") || atribucion.utm_content || "",
    utm_campaign: params.get("utm_campaign") || atribucion.utm_campaign || ""
  };
  var pagina = location.pathname.replace(/^\//, "").replace(/\.html$/, "") || "inicio";

  // ── Clarity ───────────────────────────────────────────────────────────────
  if (CLARITY_ID) {
    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
      y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, "clarity", "script", CLARITY_ID);
    clarity("set", "pagina", pagina);
    if (origen.utm_source) clarity("set", "utm_source", origen.utm_source);
    if (origen.utm_content) clarity("set", "video_origen", origen.utm_content);
    var leadGuardado = leer("velinex_lead");
    clarity("identify", visitante.id, null, pagina, leadGuardado && leadGuardado.r ? leadGuardado.r : undefined);
    if (leadGuardado) clarity("set", "dejo_datos", "si");
    if (leadGuardado && leadGuardado.califica) clarity("set", "califica", "si");
  }

  // ── Eventos ───────────────────────────────────────────────────────────────
  // soloPersona: va a n8n pero no a GA4 (GA4 ya cuenta las visitas solo).
  function evento(tipo, datos, soloPersona) {
    datos = datos || {};
    if (!soloPersona && typeof global.gtag === "function") global.gtag("event", tipo, datos);
    if (CLARITY_ID && typeof global.clarity === "function") global.clarity("event", tipo);
    if (!EVENTO_URL) return;
    var lead = leer("velinex_lead");
    var cuerpo = JSON.stringify({
      v: visitante.id,
      r: lead && lead.r ? lead.r : "",
      tipo: tipo,
      datos: datos,
      pagina: pagina,
      utm_source: origen.utm_source,
      utm_content: origen.utm_content,
      ts: new Date().toISOString()
    });
    // fetch con keepalive: sobrevive al cierre de la pestaña y deja mandar
    // el encabezado que pide el webhook (sendBeacon no lo permite).
    try {
      fetch(EVENTO_URL, {
        method: "POST",
        keepalive: true,
        headers: { "Content-Type": "application/json", "X-Velinex-Secret": EVENTO_TOKEN },
        body: cuerpo
      }).catch(function () {});
    } catch (e) {}
  }

  function marcarLead(responseId, extra) {
    var lead = Object.assign({ r: responseId, ts: Date.now() }, extra || {});
    guardar("velinex_lead", lead);
    if (CLARITY_ID && typeof global.clarity === "function") {
      global.clarity("identify", visitante.id, null, pagina, responseId);
      global.clarity("set", "dejo_datos", "si");
      if (lead.califica) global.clarity("set", "califica", "si");
    }
  }

  // ── Videos de YouTube ─────────────────────────────────────────────────────
  var esperandoYT = [];
  function conYT(fn) {
    if (global.YT && global.YT.Player) return fn();
    esperandoYT.push(fn);
    if (esperandoYT.length > 1) return;
    var previo = global.onYouTubeIframeAPIReady;
    global.onYouTubeIframeAPIReady = function () {
      if (typeof previo === "function") try { previo(); } catch (e) {}
      esperandoYT.splice(0).forEach(function (f) { f(); });
    };
    if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      var s = document.createElement("script");
      s.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(s);
    }
  }

  var MARCAS = [10, 25, 50, 75, 90, 100];
  function seguirReproductor(player, nombre) {
    var vistas = {}, segundos = 0, maximo = 0, ultimo = null, reloj = 0, empezo = false, timer = null;
    function duracion() { try { return player.getDuration() || 0; } catch (e) { return 0; } }
    function tic() {
      var t = 0, ahora = Date.now();
      try { t = player.getCurrentTime() || 0; } catch (e) {}
      // Cuenta lo que avanzó mirando (hasta 2,5x de velocidad), no los saltos.
      if (ultimo !== null && t > ultimo && t - ultimo <= ((ahora - reloj) / 1000) * 2.5 + 1) segundos += t - ultimo;
      ultimo = t;
      reloj = ahora;
      var d = duracion();
      if (!d) return;
      var pct = Math.min(100, Math.floor((t / d) * 100));
      if (pct > maximo) maximo = pct;
      MARCAS.forEach(function (m) {
        if (pct >= (m === 100 ? 98 : m) && !vistas[m]) {
          vistas[m] = true;
          evento("video_progreso", { video: nombre, porcentaje: m, segundos: Math.round(segundos) });
        }
      });
    }
    var enviado = "";
    // Se manda al cerrar o cambiar de pestaña, solo si cambió algo.
    function cierre() {
      if (!empezo) return;
      tic();
      var firma = maximo + "|" + Math.round(segundos);
      if (firma === enviado) return;
      enviado = firma;
      evento("video_cierre", { video: nombre, maximo: maximo, segundos: Math.round(segundos), duracion: Math.round(duracion()) });
    }
    player.addEventListener("onStateChange", function (e) {
      if (e.data === 1) {
        if (!empezo) { empezo = true; evento("video_inicio", { video: nombre }); }
        try { ultimo = player.getCurrentTime(); reloj = Date.now(); } catch (er) {}
        if (!timer) timer = setInterval(tic, 2000);
      } else {
        tic();
        clearInterval(timer); timer = null; ultimo = null;
        if (e.data === 0) tic();
      }
    });
    global.addEventListener("pagehide", cierre);
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "hidden") cierre();
    });
  }

  function seguirVideo(iframe, nombre) {
    if (!iframe) return;
    if (iframe.src.indexOf("enablejsapi=1") === -1) {
      iframe.src += (iframe.src.indexOf("?") === -1 ? "?" : "&") + "enablejsapi=1&origin=" + encodeURIComponent(location.origin);
    }
    if (!iframe.id) iframe.id = "yt-" + nombre;
    conYT(function () {
      var p = new global.YT.Player(iframe.id, {
        events: { onReady: function () { seguirReproductor(p, nombre); } }
      });
    });
  }

  // ── Formularios: cuántos empiezan y no terminan ───────────────────────────
  document.addEventListener("focusin", function (e) {
    var f = e.target && e.target.form;
    if (!f || f.dataset.medicionEmpezado) return;
    f.dataset.medicionEmpezado = "1";
    evento("formulario_empezado", { formulario: f.id || pagina });
  });

  evento("pagina_vista", { referrer: document.referrer ? new URL(document.referrer).hostname : "directo" }, true);

  global.VelinexMedicion = {
    evento: evento,
    marcarLead: marcarLead,
    seguirVideo: seguirVideo,
    seguirReproductor: seguirReproductor,
    visitante: function () { return visitante.id; }
  };
})(window);

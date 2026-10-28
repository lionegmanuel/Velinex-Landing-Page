/* ════════════════════════════════════════════════════════════════════════════
   datos-reales.js · frena los datos falsos en los formularios de Velinex

   Lo usan recursos.html, la landing (#diagnostic-form) y clase.html. El bloque
   REGLAS (entre las dos marcas) es lógica pura y se copia tal cual al nodo 02
   de n8n con "Contenido y Marketing/sync_reglas_n8n.py" (repo VELINEX), así la
   página y el servidor nunca piensan distinto. Si cambiás una regla, cambiala
   acá, corré ese script e importá el workflow en n8n.

   Qué frena (sacado de los 172 registros reales de leads_base al 28/10/2026):
   · Nombres de mentira: "awe", "Holi", "cxcx", "dawdawd", "student", una sola
     palabra, letras repetidas, teclado aplastado.
   · Mails imposibles: a@gmail.com, pepe@gmail.com (Gmail pide 6 caracteres),
     gmail.comayuda, gmaill.com, dominios de ejemplo y mails descartables
     (yopmail, pokemail y los 10.000 de la lista pública).
   · Teléfonos falsos: 5699999999, 34123123123, 591987654321, 59171717171,
     largos que no existen en ese país o que no son celulares.
   En la página, además: el dominio del mail tiene que recibir correo (MX) y
   el formulario no se puede mandar en menos de 4 segundos.
   ════════════════════════════════════════════════════════════════════════════ */
(function (global) {
  "use strict";

  // ===== REGLAS (inicio) =====
  var REGLAS = (function () {
    function plano(s) {
      return String(s == null ? "" : s)
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .toLowerCase();
    }

    // ── Nombre ─────────────────────────────────────────────────────────────
    var NOMBRES_BLOQUEADOS = [
      "test", "testing", "tester", "prueba", "pruebas", "probando", "holi", "hola",
      "holis", "asd", "asdf", "asdasd", "qwe", "qwerty", "student", "estudiante",
      "usuario", "user", "admin", "nombre", "apellido", "name", "lastname", "fake",
      "falso", "xxx", "xx", "nn", "na", "nada", "ninguno", "anonimo", "anonymous",
      "sdsd", "dfdf", "jaja", "jajaja", "jeje", "lol", "xd", "nose", "nombreapellido",
      "sinnombre", "yo", "aaa", "bbb", "abc", "abcd", "demo", "ejemplo", "example"
    ];
    var TECLADO = [
      "qwer", "asdf", "zxcv", "sdfg", "dfgh", "fghj", "ghjk", "hjkl", "xcvb",
      "cvbn", "vbnm", "poiu", "lkjh", "mnbv", "uiop", "yuio", "jklñ", "wasd"
    ];
    var COMIENZOS_TECLADO = /^(asd|qwe|zxc|dsa|ewq|sdf|wsd|dfg|xcv)/;

    function palabraRara(p) {
      if (NOMBRES_BLOQUEADOS.indexOf(p) !== -1) return true;
      if (/(.)\1\1/.test(p)) return true;
      if (p.length >= 3 && !/[aeiouy]/.test(p)) return true;
      if (COMIENZOS_TECLADO.test(p)) return true;
      for (var i = 0; i < TECLADO.length; i++) if (p.indexOf(TECLADO[i]) !== -1) return true;
      // Un pedazo repetido: "dawdawd", "asdasd", "cxcx".
      var m = p.match(/^(.{2,4})\1+(.{0,3})$/);
      if (p.length >= 5 && m && m[1].indexOf(m[2]) === 0) return true;
      return false;
    }

    function revisarNombre(raw) {
      var n = String(raw == null ? "" : raw).replace(/\s+/g, " ").trim();
      if (!n) return { ok: false, motivo: "nombre_vacio", mensaje: "Escribí tu nombre y apellido." };
      if (n.length > 80) return { ok: false, motivo: "nombre_largo", mensaje: "El nombre es demasiado largo." };
      if (!/^[\p{L}\p{M}'’ .-]+$/u.test(n)) {
        return { ok: false, motivo: "nombre_simbolos", mensaje: "Usá solo letras en tu nombre." };
      }
      var palabras = plano(n).split(" ").map(function (p) { return p.replace(/[.'’-]/g, ""); }).filter(Boolean);
      for (var i = 0; i < palabras.length; i++) {
        if (palabraRara(palabras[i])) {
          return { ok: false, motivo: "nombre_falso", mensaje: "Escribí tu nombre real, como figura en tu documento." };
        }
      }
      var largas = palabras.filter(function (p) { return p.length >= 2; });
      if (largas.length < 2) {
        return { ok: false, motivo: "nombre_incompleto", mensaje: "Escribí tu nombre y tu apellido." };
      }
      // El nombre se guarda prolijo: "juan PEREZ" pasa a "Juan Perez".
      var limpio = n.split(" ").map(function (p) {
        return p.charAt(0).toLocaleUpperCase("es") + p.slice(1).toLocaleLowerCase("es");
      }).join(" ");
      return { ok: true, valor: limpio };
    }

    // ── Mail ───────────────────────────────────────────────────────────────
    var TYPOS = {
      "gmial.com": "gmail.com", "gmai.com": "gmail.com", "gmal.com": "gmail.com",
      "gamil.com": "gmail.com", "gnail.com": "gmail.com", "gmaill.com": "gmail.com",
      "gmail.co": "gmail.com", "gmail.con": "gmail.com", "gmail.cm": "gmail.com",
      "gmail.om": "gmail.com", "gmail.cmo": "gmail.com", "gmail.es": "gmail.com",
      "gmail.com.ar": "gmail.com", "gmail.com.mx": "gmail.com", "gmail.comm": "gmail.com",
      "gmali.com": "gmail.com", "gmaik.com": "gmail.com", "gmeil.com": "gmail.com",
      "hotmial.com": "hotmail.com", "hotmal.com": "hotmail.com", "hotmai.com": "hotmail.com",
      "hotamil.com": "hotmail.com", "hotmail.co": "hotmail.com", "hotmail.con": "hotmail.com",
      "hotmil.com": "hotmail.com", "homail.com": "hotmail.com", "hotmaill.com": "hotmail.com",
      "outlok.com": "outlook.com", "outlook.co": "outlook.com", "outlook.con": "outlook.com",
      "otulook.com": "outlook.com", "outllok.com": "outlook.com", "oulook.com": "outlook.com",
      "yaho.com": "yahoo.com", "yahoo.con": "yahoo.com", "yahho.com": "yahoo.com",
      "yahoo.co": "yahoo.com", "iclod.com": "icloud.com", "icloud.co": "icloud.com",
      "icloud.con": "icloud.com", "icould.com": "icloud.com"
    };
    var PROVEEDORES = ["gmail.com", "hotmail.com", "outlook.com", "yahoo.com", "icloud.com", "live.com"];
    var DOMINIOS_EJEMPLO = [
      "example.com", "example.org", "example.net", "test.com", "prueba.com", "dominio.com",
      "tudominio.com", "empresa.com", "tuempresa.com", "tunegocio.com", "negocio.com",
      "correo.com", "email.test", "mail.test"
    ];
    var LOCALES_BLOQUEADOS = [
      "test", "prueba", "asd", "asdf", "aaa", "abc", "abcd", "fake", "ejemplo", "example",
      "correo", "email", "mail", "nada", "noreply", "no-reply", "nombre", "usuario", "xxx"
    ];
    // Los descartables más comunes. La página y n8n suman la lista pública
    // completa (disposable-email-domains, ~10.000 dominios).
    var DESCARTABLES_BASE = [
      "yopmail.com", "yopmail.net", "mailinator.com", "guerrillamail.com", "guerrillamail.net",
      "sharklasers.com", "10minutemail.com", "temp-mail.org", "tempmail.com", "tempmail.net",
      "trashmail.com", "maildrop.cc", "getnada.com", "dispostable.com", "pokemail.net",
      "mohmal.com", "emailondeck.com", "fakeinbox.com", "throwawaymail.com", "burnermail.io",
      "mailnesia.com", "mintemail.com", "spamgourmet.com", "tempr.email", "discard.email",
      "pumpoly.com", "goldvester.com", "ofags.com"
    ];

    function revisarEmail(raw, descartables) {
      var e = String(raw == null ? "" : raw).trim().toLowerCase();
      if (!e) return { ok: false, motivo: "mail_vacio", mensaje: "Escribí tu mail." };
      var re = /^[a-z0-9](?:[a-z0-9._%+-]{0,62}[a-z0-9_-])?@(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,24}$/;
      if (!re.test(e) || e.indexOf("..") !== -1) {
        return { ok: false, motivo: "mail_formato", mensaje: "Ese mail está mal escrito. Revisalo." };
      }
      var at = e.lastIndexOf("@");
      var local = e.slice(0, at);
      var dominio = e.slice(at + 1);
      var correcto = TYPOS[dominio];
      if (!correcto) {
        // "gmail.comayuda" es un error; "yahoo.com.ar" o "hotmail.es" existen.
        for (var i = 0; i < PROVEEDORES.length; i++) {
          var resto = dominio.slice(PROVEEDORES[i].length);
          if (dominio.indexOf(PROVEEDORES[i]) === 0 && resto && resto.charAt(0) !== ".") { correcto = PROVEEDORES[i]; break; }
        }
      }
      if (correcto) {
        var sug = local + "@" + correcto;
        return { ok: false, motivo: "mail_typo", mensaje: "¿Quisiste decir " + sug + "?", sugerencia: sug };
      }
      if (DOMINIOS_EJEMPLO.indexOf(dominio) !== -1 || LOCALES_BLOQUEADOS.indexOf(local) !== -1) {
        return { ok: false, motivo: "mail_falso", mensaje: "Escribí tu mail real: ahí te llega lo que pediste." };
      }
      if (dominio === "gmail.com" || dominio === "googlemail.com") {
        var base = local.split("+")[0].replace(/\./g, "");
        if (!/^[a-z0-9]{6,30}$/.test(base)) {
          return { ok: false, motivo: "mail_gmail_imposible", mensaje: "Esa cuenta de Gmail no existe. Revisá tu mail." };
        }
      }
      var lista = descartables || DESCARTABLES_BASE;
      var partes = dominio.split(".");
      for (var j = 0; j < partes.length - 1; j++) {
        var sub = partes.slice(j).join(".");
        if ((lista.has ? lista.has(sub) : lista.indexOf(sub) !== -1) || DESCARTABLES_BASE.indexOf(sub) !== -1) {
          return { ok: false, motivo: "mail_descartable", mensaje: "No aceptamos mails temporales. Usá tu mail de siempre." };
        }
      }
      return { ok: true, valor: e, dominio: dominio };
    }

    // ── Teléfono (WhatsApp) ────────────────────────────────────────────────
    // national: lo que va después del código, ya sin el 0 de larga distancia.
    // Solo celulares: es el WhatsApp de la persona.
    var PAISES = {
      "54": { n: "Argentina", re: /^9[1-3]\d{9}$/, ej: "+54 9 351 123 4567" },
      "52": { n: "México", re: /^[2-9]\d{9}$/, ej: "+52 55 1234 5678" },
      "57": { n: "Colombia", re: /^3\d{9}$/, ej: "+57 300 123 4567" },
      "51": { n: "Perú", re: /^9\d{8}$/, ej: "+51 912 345 678" },
      "56": { n: "Chile", re: /^9\d{8}$/, ej: "+56 9 1234 5678" },
      "593": { n: "Ecuador", re: /^9\d{8}$/, ej: "+593 99 123 4567" },
      "58": { n: "Venezuela", re: /^4(12|14|16|22|24|26)\d{7}$/, ej: "+58 412 123 4567" },
      "591": { n: "Bolivia", re: /^[67]\d{7}$/, ej: "+591 7123 4567" },
      "598": { n: "Uruguay", re: /^9\d{7}$/, ej: "+598 91 234 567" },
      "595": { n: "Paraguay", re: /^9\d{8}$/, ej: "+595 981 123 456" },
      "34": { n: "España", re: /^[67]\d{8}$/, ej: "+34 612 345 678" },
      "1": { n: "Estados Unidos, Canadá o Caribe", re: /^[2-9]\d{2}[2-9]\d{6}$/, ej: "+1 305 123 4567" },
      "55": { n: "Brasil", re: /^[1-9][1-9]9\d{8}$/, ej: "+55 11 91234 5678" },
      "503": { n: "El Salvador", re: /^[67]\d{7}$/, ej: "+503 7123 4567" },
      "504": { n: "Honduras", re: /^[389]\d{7}$/, ej: "+504 9123 4567" },
      "502": { n: "Guatemala", re: /^[3-5]\d{7}$/, ej: "+502 5123 4567" },
      "505": { n: "Nicaragua", re: /^[578]\d{7}$/, ej: "+505 8123 4567" },
      "506": { n: "Costa Rica", re: /^[5-8]\d{7}$/, ej: "+506 8123 4567" },
      "507": { n: "Panamá", re: /^6\d{7}$/, ej: "+507 6123 4567" },
      "53": { n: "Cuba", re: /^5\d{7}$/, ej: "+53 5123 4567" }
    };

    function pareceInventado(d) {
      if (/(\d)\1{5,}/.test(d)) return true;              // 999999, 000000
      if (/(\d{2,4})\1\1/.test(d)) return true;           // 71717171, 123123123
      var distintos = {};
      for (var i = 0; i < d.length; i++) distintos[d.charAt(i)] = 1;
      var cuantos = Object.keys(distintos).length;
      if (d.length >= 8 && cuantos <= 2) return true;                          // 5588888888
      if (d.length >= 8 && cuantos <= 3 && /(\d{3,4})\1/.test(d)) return true;  // 987987798
      var sube = 1, baja = 1;                             // 123456, 987654
      for (var k = 1; k < d.length; k++) {
        var dif = +d.charAt(k) - +d.charAt(k - 1);
        sube = dif === 1 ? sube + 1 : 1;
        baja = dif === -1 ? baja + 1 : 1;
        if (sube >= 6 || baja >= 6) return true;
      }
      return false;
    }

    function revisarTelefono(raw) {
      var s = String(raw == null ? "" : raw).trim();
      if (!s) return { ok: false, motivo: "tel_vacio", mensaje: "Escribí tu número de WhatsApp." };
      if (/[a-z]/i.test(s)) return { ok: false, motivo: "tel_letras", mensaje: "Usá solo números." };
      var d = s.replace(/\D/g, "");
      if (s.charAt(0) === "+") {
        // ok
      } else if (d.indexOf("00") === 0) {
        d = d.slice(2);
      } else {
        return { ok: false, motivo: "tel_sin_codigo", mensaje: "Empezá con + y el código de tu país, por ejemplo +54 9 351 123 4567." };
      }
      if (d.length < 8 || d.length > 15) {
        return { ok: false, motivo: "tel_largo", mensaje: "Ese número tiene un largo que no existe. Revisalo." };
      }
      var cod = null;
      for (var l = 3; l >= 1; l--) {
        if (PAISES[d.slice(0, l)]) { cod = d.slice(0, l); break; }
      }
      var nac = cod ? d.slice(cod.length) : d;
      if (cod) {
        if (nac.charAt(0) === "0") nac = nac.slice(1);                       // +593 0 99...
        if (cod === "54") {
          // WhatsApp usa +54 9 + característica + número (10 dígitos). Se
          // acepta escrito sin el 9 y con el 15 local: +54 351 15 123 4567.
          var resto = nac.charAt(0) === "9" ? nac.slice(1) : nac;
          if (resto.length === 12) {
            for (var a = 2; a <= 4; a++) {
              if (resto.substr(a, 2) === "15") { resto = resto.slice(0, a) + resto.slice(a + 2); break; }
            }
          }
          if (resto.length === 10) nac = "9" + resto;
        }
        if (cod === "52" && nac.length === 11 && nac.charAt(0) === "1") nac = nac.slice(1);  // +52 1 55... (formato viejo)
      }
      if (pareceInventado(nac)) {
        return { ok: false, motivo: "tel_falso", mensaje: "Ese número no parece real. Escribí tu WhatsApp verdadero." };
      }
      if (cod) {
        var p = PAISES[cod];
        if (!p.re.test(nac)) {
          return {
            ok: false, motivo: "tel_no_valido",
            mensaje: "Ese número no es un celular válido de " + p.n + ". Fijate el ejemplo: " + p.ej + "."
          };
        }
        return { ok: true, valor: "+" + cod + nac, pais: p.n };
      }
      if (nac.length < 9) {
        return { ok: false, motivo: "tel_largo", mensaje: "Ese número es demasiado corto. Revisalo." };
      }
      return { ok: true, valor: "+" + d, pais: "" };
    }

    return {
      revisarNombre: revisarNombre,
      revisarEmail: revisarEmail,
      revisarTelefono: revisarTelefono,
      DESCARTABLES_BASE: DESCARTABLES_BASE
    };
  })();
  // ===== REGLAS (fin) =====

  if (typeof module !== "undefined" && module.exports) {
    module.exports = REGLAS;
    return;
  }
  if (typeof document === "undefined") return;

  // ── Lo que solo corre en el navegador ─────────────────────────────────────
  var listaDescartables = null;
  function cargarDescartables() {
    if (listaDescartables) return listaDescartables;
    listaDescartables = fetch("assets/data/mail-descartable.txt", { cache: "force-cache" })
      .then(function (r) { return r.ok ? r.text() : ""; })
      .then(function (t) {
        var set = new Set();
        t.split(/\r?\n/).forEach(function (l) { l = l.trim(); if (l && l.charAt(0) !== "#") set.add(l); });
        return set;
      })
      .catch(function () { return null; });
    return listaDescartables;
  }

  var cacheMx = {};
  // El dominio tiene que poder recibir mails. Si Google no responde en 3 s,
  // no frenamos a la persona (n8n lo vuelve a revisar).
  function dominioRecibeMail(dominio) {
    if (cacheMx[dominio] !== undefined) return Promise.resolve(cacheMx[dominio]);
    var ctrl = typeof AbortController !== "undefined" ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, 3000);
    return fetch("https://dns.google/resolve?name=" + encodeURIComponent(dominio) + "&type=MX", ctrl ? { signal: ctrl.signal } : {})
      .then(function (r) { return r.json(); })
      .then(function (j) {
        clearTimeout(timer);
        var tieneMx = j.Status === 0 && (j.Answer || []).some(function (a) { return a.type === 15 && !/^0 \.$/.test(a.data); });
        cacheMx[dominio] = tieneMx;
        return tieneMx;
      })
      .catch(function () { clearTimeout(timer); return true; });
  }

  function estilos() {
    if (document.getElementById("datos-reales-css")) return;
    var st = document.createElement("style");
    st.id = "datos-reales-css";
    st.textContent =
      ".dato-msg{display:block;margin-top:6px;font-size:13px;line-height:1.4;color:#fca5a5}" +
      ".dato-msg--ok{color:#86efac}" +
      ".dato-msg button{background:none;border:0;padding:0;color:#38bdf8;font:inherit;text-decoration:underline;cursor:pointer}" +
      "input.dato-invalido{border-color:#f87171!important;box-shadow:0 0 0 3px rgba(248,113,113,.15)!important}";
    document.head.appendChild(st);
  }

  function mensajeDe(input) {
    var id = "msg-" + (input.id || input.name);
    var el = document.getElementById(id);
    if (!el) {
      el = document.createElement("small");
      el.id = id;
      el.className = "dato-msg";
      el.setAttribute("aria-live", "polite");
      input.setAttribute("aria-describedby", ((input.getAttribute("aria-describedby") || "") + " " + id).trim());
      var ancla = input.closest(".field, .form-group");
      if (ancla) ancla.appendChild(el);
      else input.insertAdjacentElement("afterend", el);
    }
    return el;
  }

  function mostrar(input, r, textoOk) {
    var el = mensajeDe(input);
    el.innerHTML = "";
    if (r.ok) {
      input.classList.remove("dato-invalido");
      input.setCustomValidity("");
      el.className = "dato-msg dato-msg--ok";
      el.textContent = textoOk || "";
      el.hidden = !textoOk;
      return;
    }
    input.classList.add("dato-invalido");
    input.setCustomValidity(r.mensaje);
    el.className = "dato-msg";
    el.hidden = false;
    if (r.sugerencia) {
      el.appendChild(document.createTextNode("¿Quisiste decir "));
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = r.sugerencia;
      b.addEventListener("click", function () {
        input.value = r.sugerencia;
        input.dispatchEvent(new Event("input", { bubbles: true }));
        revisarCampo(input, "email");
      });
      el.appendChild(b);
      el.appendChild(document.createTextNode("? Tocalo para corregirlo."));
    } else {
      el.textContent = r.mensaje;
    }
  }

  function revisarCampo(input, tipo) {
    if (tipo === "nombre") {
      var rn = REGLAS.revisarNombre(input.value);
      mostrar(input, rn);
      return Promise.resolve(rn);
    }
    if (tipo === "telefono") {
      var rt = REGLAS.revisarTelefono(input.value);
      mostrar(input, rt, rt.ok && rt.pais ? "WhatsApp de " + rt.pais + " ✓" : "");
      return Promise.resolve(rt);
    }
    return cargarDescartables().then(function (set) {
      var re = REGLAS.revisarEmail(input.value, set || undefined);
      if (!re.ok) { mostrar(input, re); return re; }
      return dominioRecibeMail(re.dominio).then(function (ok) {
        var r = ok ? re : { ok: false, motivo: "mail_sin_servidor", mensaje: "Ese mail no existe: el dominio @" + re.dominio + " no recibe correos. Revisalo." };
        mostrar(input, r);
        return r;
      });
    });
  }

  /* conectar(form, { nombre: "nombre", email: "email", telefono: "telefono" })
     Revisa cada campo al salir de él y devuelve { validar(campos?) }, que
     revisa todo (o solo los campos pedidos) y resuelve con
     { ok, datos: { nombre, email, telefono }, motivos }. */
  function conectar(form, nombres) {
    estilos();
    cargarDescartables();
    var campos = {};
    var inicio = 0;
    form.addEventListener("focusin", function () { if (!inicio) inicio = Date.now(); });
    form.addEventListener("keydown", function () { if (!inicio) inicio = Date.now(); });
    Object.keys(nombres).forEach(function (tipo) {
      var input = form.elements[nombres[tipo]];
      if (!input) return;
      campos[tipo] = input;
      input.setAttribute("autocapitalize", tipo === "nombre" ? "words" : "off");
      if (tipo !== "nombre") input.setAttribute("spellcheck", "false");
      input.addEventListener("blur", function () { if (input.value.trim()) revisarCampo(input, tipo); });
      input.addEventListener("input", function () {
        input.setCustomValidity("");
        input.classList.remove("dato-invalido");
        var el = document.getElementById("msg-" + (input.id || input.name));
        if (el && !el.classList.contains("dato-msg--ok")) el.hidden = true;
      });
    });

    function validar(soloEstos) {
      var tipos = (soloEstos || Object.keys(campos)).filter(function (t) { return campos[t]; });
      return Promise.all(tipos.map(function (t) { return revisarCampo(campos[t], t); })).then(function (rs) {
        var datos = {}, motivos = [], primero = null;
        rs.forEach(function (r, i) {
          if (r.ok) datos[tipos[i]] = r.valor;
          else { motivos.push(r.motivo); if (!primero) primero = campos[tipos[i]]; }
        });
        if (primero) { primero.focus(); primero.reportValidity(); }
        return { ok: !primero, datos: datos, motivos: motivos };
      });
    }

    return {
      validar: validar,
      // Nadie tocó el formulario, o se mandó en menos de 3 segundos: lo llenó
      // un programa. La página no lo descarta en silencio: pide revisar y
      // volver a enviar, así una persona real nunca se queda sin respuesta.
      esBot: function () { return !inicio || Date.now() - inicio < 3000; }
    };
  }

  global.VelinexDatos = {
    conectar: conectar,
    revisarNombre: REGLAS.revisarNombre,
    revisarEmail: REGLAS.revisarEmail,
    revisarTelefono: REGLAS.revisarTelefono
  };
})(typeof window !== "undefined" ? window : this);

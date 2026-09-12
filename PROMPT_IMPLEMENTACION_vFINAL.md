# PROMPT DEFINITIVO DE IMPLEMENTACIÓN: VELINEX LANDING PAGE (vFINAL)

Actúa como Tech Lead y Senior Frontend Developer de Velinex. Tu misión es refactorizar la landing page en `D:\Documents\MANUEL\DEV\Velinex-Landing-Page` (`index.html`, `style.css`, `assets/js/index.js`) para llevarla a su versión comercial definitiva.

---

## 1. DIRECTIVAS SUPREMAS Y REGLAS DE NEGOCIO (INQUEBRANTABLES)

1. **CERO JERGA TÉCNICA DE CARA AL CLIENTE:**
   - Terminantemente prohibido usar: "RAG", "LLM", "APIs", "VPS", "flujos", "go-live", "tokens", "agencia de chatbots" o sonar a desarrollador de software.
   - Hablar 100% en el idioma del dueño de PyME: procesos, cuellos de botella, capacidad de escala, tareas repetitivas, orden operativo y oportunidades comerciales.
2. **PROHIBICIÓN DEL GUION LARGO ("—"):**
   - No utilizar bajo ninguna circunstancia el em-dash ("—"). Usar únicamente guiones simples ("-"), comas o puntos.
3. **SIN GARANTÍA (RETIRADA TOTAL):**
   - Eliminar por completo la sección `.guarantee-section` y cualquier badge, texto o referencia a los "45 días de garantía" en toda la landing (Hero, trust-strip, cards, FAQs).
4. **CRONOGRAMA CERRADO EN 4 SEMANAS (1 MES EXACTO):**
   - Eliminar toda mención a "5 semanas", "semana 6" o "lanzamiento en semana 6". La implementación completa, pruebas, capacitación y puesta en marcha se realizan en exactamente 4 semanas.
5. **MULTIRUBRO UNIVERSAL (SIN CLICHÉS DE E-COMMERCE):**
   - No mencionar "listas de precios" ni "catálogos". Hablar de directivas de negocio, criterios de calificación, protocolos de atención y base de conocimiento propia.
6. **ERRADICAR EL BUG DE WHATSAPP EN `assets/js/index.js`:**
   - Eliminar la lógica que concatenaba `(vía ${attribution.utm_source})` o `(vía youtube)` en los enlaces de WhatsApp.
7. **FIN DEL WHATSAPP DIRECTO EN FRÍO COMO CTA PRINCIPAL:**
   - Los botones principales de la web (`.btn-primary`) ya no abrirán un chat de WhatsApp a ciegas. Ahora harán scroll suave hacia la nueva sección `#diagnostico` (Formulario de Diagnóstico Estratégico en 3 bloques).
   - Solo se mantendrá el botón flotante `#whatsapp-float` en la esquina inferior para soporte puntual.

---

## 2. MODIFICACIONES DETALLADAS EN `index.html`

### A. Meta Tags y Cabecera SEO

- Actualizar `description` y `og:description` a:
  _"Transformamos la operativa de tu empresa con sistemas inteligentes a medida para que puedas escalar tu capacidad comercial sin sumar costos fijos ni multiplicar personal."_
- En el JSON-LD de `FAQPage`:
  - Modificar la pregunta _"¿Por qué el proceso tarda entre 5 y 6 semanas?"_ por _"¿Cuánto tiempo toma la implementación?"_ y responder que toma exactamente 4 semanas organizadas en 4 fases cerradas.
  - Eliminar cualquier referencia a garantías o "semana 6".

### B. Header / Hero

1. **Badge superior:**
   _"Para PyMEs multirubro con flujo activo (+40 consultas/día) que buscan escalar sin caos operativo"_
2. **H1 Principal:**
   _"Transformamos la operativa de tu empresa con sistemas inteligentes para que puedas <span class="h1-highlight">escalar sin sumar caos ni multiplicar personal</span>."_
3. **Subtítulo del Hero:**
   _"Auditamos, diseñamos e integramos una infraestructura a medida que gestiona, califica y hace avanzar a tus prospectos las 24 horas del día. Control total y capacidad de escala sobre tus herramientas actuales, sin depender de personas disponibles."_
4. **CTA Principal:**
   - Reemplazar el enlace directo a WhatsApp por un botón de scroll a `#diagnostico`:
     ```html
     <a
       href="#diagnostico"
       class="btn-primary"
       onclick="smoothScrollToDiagnostic(event)"
     >
       Solicitar Diagnóstico Operativo Estratégico →
     </a>
     ```
   - Micro-copy inferior:
     _"Sesión estratégica de 30 minutos · Analizamos tu proceso actual · Te decimos con total honestidad qué priorizar"_
5. **Hero Trust Strip (actualizado):**
   ```html
   <div class="hero-trust-strip" aria-label="Puntos clave de la oferta">
     <span>Puesta en marcha en 4 semanas exactas</span>
     <span>Solo 90 minutos de tu tiempo al inicio</span>
     <span>Integrado sobre tus herramientas actuales</span>
     <span>Sistema 100% propio en tu infraestructura</span>
   </div>
   ```

### C. Sección El Problema (`.pain-section`)

- **Eyebrow:** _"El límite operativo"_
- **Título:** _"El problema casi nunca es falta de demanda. Es que tu operación depende de personas disponibles."_
- **Subtítulo:** _"Cuando crecer significa que alguien tiene que estar siempre conectado respondiendo, se crea un techo invisible."_
- **4 Tarjetas de Dolor:**
  - `01 · Pérdidas invisibles`: Cada minuto de demora en responder reduce drásticamente la conversión. Las consultas fuera de horario o de fin de semana se enfrían o se van a la competencia.
  - `02 · Equipo atrapado en tareas repetitivas`: Horas del día gastadas en responder las mismas preguntas básicas y cargar datos a mano en lugar de enfocarse en tareas de alto valor.
  - `03 · Cero métricas, cero control`: Sin un sistema integrado, nadie mide cuántas consultas entran, cuántas avanzan y cuántas se pierden. No se pueden tomar decisiones sobre lo que no se mide.
  - `04 · Crecer no puede significar sumar más personal`: Contratar personas solo para responder mensajes aumenta los costos fijos y el desorden, pero no resuelve el cuello de botella de fondo.

### D. Sección La Solución (`.solution-section`)

- **Eyebrow:** _"Infraestructura a medida"_
- **Título:** _"Cómo opera tu empresa con un sistema comercial integrado"_
- **Subtítulo:** _"No es una herramienta aislada ni un chatbot genérico. Es un sistema integral que gestiona la ejecución comercial y operativa de tu negocio."_
- **Tarjetas:**
  - `Disponibilidad continua`: Respuestas y gestión inmediata las 24 horas del día, los 365 días del año.
  - `Calificación activa`: Filtra quién tiene intención real y cumple los criterios de tu negocio.
  - `Avance y coordinación autónoma`: Agenda reuniones, citas o gestiona el siguiente paso comercial directamente sobre tus herramientas.
  - `Seguimiento sin olvidos`: Reactiva contactos y hace seguimiento oportuno sin que nadie tenga que recordarlo a mano.

### E. Sección Por Qué es Diferente (`.puv-section`)

- Actualizar la tarjeta `vs. implementaciones genéricas de IA`:
  - **Título:** _"Implementación llave en mano en 4 semanas. Tuyo al 100%."_
  - **Texto:** _"Sin meses de desarrollo ni proyectos interminables. Todo queda instalado en tu propio servidor y sobre las herramientas que ya utilizas, con total autonomía para tu empresa."_

### F. Sección Proceso (`.process-section`) - 4 Semanas Exactas

- **Título:** _"De diagnóstico a sistema operando: 4 semanas exactas."_
- **Subtítulo:** _"Un proceso cerrado, estructurado y predecible. Solo requerimos 90 minutos de tu tiempo al inicio; nosotros nos encargamos del diseño, integración y puesta en marcha."_
- **Diferenciador:** _"La mayoría de los proyectos demoran meses. Nosotros implementamos y dejamos todo operando en 4 semanas."_
- **Las 4 Etapas del Timeline:**
  - `Semana 1 · Diagnóstico Operativo y Detección de Fricciones`: Auditamos tu circuito actual, detectamos dónde se traban las consultas y calculamos el costo operativo de no contar con un sistema automatizado (sesión de 90 min).
  - `Semana 2 · Integración sobre tus Herramientas Actuales`: Conectamos el sistema a tus canales de comunicación, agenda y herramientas internas de gestión sin alterar la rutina de tu equipo.
  - `Semana 3 · Entrenamiento con Criterios y Reglas de tu Negocio`: Cargamos el conocimiento propio de tu empresa, protocolos de atención, directivas de calificación y respuestas clave para que opere con los estándares exactos de tu marca.
  - `Semana 4 · Pruebas, Ajustes y Puesta en Marcha`: Validamos el funcionamiento con casos reales, alineamos a tu equipo para la derivación de situaciones estratégicas y el sistema queda operando al 100% en vivo.

### G. ELIMINAR LA SECCIÓN GARANTÍA

- Borrar completamente `<section class="guarantee-section">` (líneas ~964 a 985).

### H. Nueva Sección: Diagnóstico Estratégico (`#diagnostico`)

Reemplazar la vieja sección `#cta-final` por la estructura completa de conversión:

```html
<section class="diagnostic-flow-section fade-in" id="diagnostico">
  <div class="container">
    <!-- Bloque 1: Filtro Previo -->
    <div class="qualification-filter">
      <div class="filter-card filter-yes">
        <h3>Es para tu empresa si:</h3>
        <ul>
          <li>
            ✓ Cuentas con un volumen activo de más de 40 consultas o contactos
            diarios.
          </li>
          <li>✓ Tu venta o atención ocurre principalmente por conversación.</li>
          <li>
            ✓ Tienes un negocio validado y buscas escalar sin sumar costos fijos
            ni caos.
          </li>
          <li>
            ✓ Estás dispuesto a invertir 90 minutos iniciales para ordenar tus
            procesos.
          </li>
        </ul>
      </div>
      <div class="filter-card filter-no">
        <h3>No es para ti si:</h3>
        <ul>
          <li>
            ✗ Buscas una herramienta barata o un bot genérico sin
            personalización.
          </li>
          <li>
            ✗ Tu negocio recién comienza y aún no tiene demanda ni flujo
            recurrente.
          </li>
          <li>
            ✗ Vendes únicamente por checkout automático sin interacción humana.
          </li>
          <li>
            ✗ Buscas soluciones mágicas sin involucrarte en la validación
            inicial.
          </li>
        </ul>
      </div>
    </div>

    <!-- Bloque 2: Qué esperar de la sesión -->
    <div class="session-explanation">
      <p class="section-eyebrow">Diagnóstico Estratégico (30 Minutos)</p>
      <h2>Una conversación real sobre los números de tu negocio</h2>
      <p class="session-sub">
        No es una llamada comercial agresiva ni una demo genérica. Analizamos tu
        operativa actual, identificamos exactamente dónde se producen los
        cuellos de botella y evaluamos con honestidad técnica si podemos
        ayudarte a resolverlos.
      </p>
    </div>

    <!-- Bloque 3: Formulario en 3 Pasos -->
    <div class="diagnostic-form-wrapper">
      <form id="diagnostic-form" novalidate>
        <!-- Paso 1: Contacto -->
        <div class="form-step-block">
          <span class="step-badge">Paso 1</span>
          <h4>Datos de contacto</h4>
          <div class="form-grid">
            <div class="form-group">
              <label for="diag-name">Nombre y Apellido *</label>
              <input
                type="text"
                id="diag-name"
                name="nombre"
                placeholder="Ej: Carlos Rossi"
                required
              />
            </div>
            <div class="form-group">
              <label for="diag-email">Correo Corporativo *</label>
              <input
                type="email"
                id="diag-email"
                name="email"
                placeholder="carlos@empresa.com"
                required
              />
            </div>
            <div class="form-group">
              <label for="diag-phone">WhatsApp Directo *</label>
              <input
                type="tel"
                id="diag-phone"
                name="telefono"
                placeholder="+54 9 11 1234-5678"
                required
              />
            </div>
            <div class="form-group">
              <label for="diag-role">Cargo en la empresa *</label>
              <input
                type="text"
                id="diag-role"
                name="cargo"
                placeholder="Ej: Socio / Director General"
                required
              />
            </div>
          </div>
        </div>

        <!-- Paso 2: Tu Negocio -->
        <div class="form-step-block">
          <span class="step-badge">Paso 2</span>
          <h4>Información de tu empresa</h4>
          <div class="form-grid">
            <div class="form-group">
              <label for="diag-company">Nombre de la empresa *</label>
              <input
                type="text"
                id="diag-company"
                name="empresa"
                placeholder="Nombre de tu negocio"
                required
              />
            </div>
            <div class="form-group">
              <label for="diag-sector">Sector o Rubro *</label>
              <select id="diag-sector" name="sector" required>
                <option value="" disabled selected>Selecciona tu rubro</option>
                <option value="Salud y Clínicas">
                  Salud, Clínicas o Bienestar
                </option>
                <option value="Automotriz">
                  Automotriz (Concesionarias, Talleres)
                </option>
                <option value="Inmobiliario">Inmobiliario y Desarrollos</option>
                <option value="Educación">Educación y Academias</option>
                <option value="Turismo">Turismo y Hotelería</option>
                <option value="Servicios Profesionales">
                  Servicios Profesionales / B2B
                </option>
                <option value="Otro">Otro sector con alto volumen</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Paso 3: Operativa y Cuello de Botella -->
        <div class="form-step-block">
          <span class="step-badge">Paso 3</span>
          <h4>Situación operativa actual</h4>
          <div class="form-grid full-width">
            <div class="form-group">
              <label for="diag-volume"
                >Volumen aproximado de consultas diarias *</label
              >
              <select id="diag-volume" name="consultas_diarias" required>
                <option value="" disabled selected>
                  Selecciona el volumen
                </option>
                <option value="40-70">Entre 40 y 70 consultas/día</option>
                <option value="70-150">Entre 70 y 150 consultas/día</option>
                <option value="+150">Más de 150 consultas/día</option>
                <option value="menos-40">Menos de 40 consultas/día</option>
              </select>
            </div>
            <div class="form-group">
              <label for="diag-bottleneck"
                >¿Cuál es hoy tu principal freno operativo para crecer? *</label
              >
              <textarea
                id="diag-bottleneck"
                name="freno"
                rows="3"
                placeholder="Ej: Las consultas fuera de hora no se responden a tiempo, el equipo está desbordado respondiendo lo mismo y no damos abasto para hacer seguimiento..."
                required
              ></textarea>
            </div>
          </div>
        </div>

        <div class="form-action-row">
          <button
            type="submit"
            class="btn-primary btn-large"
            id="diag-submit-btn"
          >
            Solicitar Diagnóstico Estratégico →
          </button>
          <p class="form-security-note">
            🔒 Tus datos son confidenciales y solo se utilizarán para preparar
            la sesión técnica.
          </p>
        </div>

        <div
          id="form-feedback"
          class="form-feedback-msg"
          style="display: none;"
        ></div>
      </form>
    </div>
  </div>
</section>
```

### I. FAQs Actualizados

- Modificar las respuestas para eliminar cualquier mención de garantía o de 5-6 semanas.
- Garantizar que "¿Cuánto tiempo requiere de mi parte?" mencione los 90 minutos iniciales.
- Reforzar que el sistema se integra con las herramientas actuales de la empresa.

---

## 3. MODIFICACIONES EN `assets/js/index.js`

1. **Eliminar el bug de concatenación de atribución en WhatsApp:**
   - Buscar y eliminar el bloque:
     ```javascript
     if (attribution.utm_source) {
       document
         .querySelectorAll('a[href*="api.whatsapp.com"], a[href*="wa.me"]')
         .forEach((link) => {
           // ... (vía ${attribution.utm_source})
         });
     }
     ```
2. **Scroll Suave al Diagnóstico:**
   - Definir `window.smoothScrollToDiagnostic = function(e)`:
     ```javascript
     window.smoothScrollToDiagnostic = function (e) {
       if (e) e.preventDefault();
       const target = document.getElementById("diagnostico");
       if (target) {
         target.scrollIntoView({ behavior: "smooth" });
       }
     };
     ```
   - Asegurarse de que todos los botones principales de la web llamen a esta función o tengan `href="#diagnostico"`.
3. **Manejo del Formulario de Diagnóstico y Envío al Webhook:**
   - Capturar el submit de `#diagnostic-form`:
     - Validar campos requeridos.
     - Obtener las UTMs limpias usando la función existente `getAttribution()`.
     - Armar el payload JSON:
       ```javascript
       const payload = {
         nombre: form.nombre.value.trim(),
         email: form.email.value.trim(),
         telefono: form.telefono.value.trim(),
         cargo: form.cargo.value.trim(),
         empresa: form.empresa.value.trim(),
         sector: form.sector.value,
         consultas_diarias: form.consultas_diarias.value,
         freno_operativo: form.freno.value.trim(),
         origen: "landing_diagnostico",
         timestamp: new Date().toISOString(),
         ...attribution,
       };
       ```
     - Enviar vía `fetch` POST a `https://webhook-n8n.velinex.digital/webhook/lead-magnet` con headers `Content-Type: application/json` y `X-Velinex-Secret: lead_magnet_2026_secure`.
     - Manejar estados: deshabilitar botón y mostrar "Procesando diagnóstico...".
     - Al responder con éxito: registrar evento GA4 `gtag('event', 'diagnostic_submitted', { ... })` y mostrar mensaje de éxito con enlace a la agenda o confirmación:
       _"Diagnóstico recibido. Nos pondremos en contacto en menos de 24 horas para coordinar tu sesión estratégica."_

---

## 4. MODIFICACIONES EN `style.css`

1. **Limpieza:**
   - Eliminar los estilos huérfanos de `.guarantee-section`, `.guarantee-inner`, etc.
2. **Estilos para el Formulario de Diagnóstico (`.diagnostic-flow-section`):**
   - Integrar con los tokens de diseño existentes (`--bg #0b1120`, `--card-bg #131f35`, `--accent #38bdf8`, `--text #eef2f9`, `--border rgba(255,255,255,0.08)`).
   - `.qualification-filter`: Grid de 2 columnas (1 col en mobile). Cards con fondo `--surface`, bordes sutiles y acentos verdes para el filtro positivo y tenues para el filtro negativo.
   - `.form-step-block`: Borde inferior sutil, padding cómodo, badge de paso (`.step-badge`) estilizado como pastilla con acento sutil (`background: rgba(56, 189, 248, 0.1)`, `color: var(--accent)`).
   - Inputs, selects y textareas:
     - Background: `--primary #070912`.
     - Border: `1px solid rgba(255, 255, 255, 0.12)`.
     - Focus: `border-color: var(--accent)`, `box-shadow: 0 0 12px rgba(56, 189, 248, 0.25)`.
     - Typography: `Plus Jakarta Sans`, color `--text`.
   - `.form-action-row`: Centrado o alineado con botón de ancho completo en móviles.
   - Feedback de éxito: Card destacada con fondo oscuro y borde verde esmeralda.

---

## 5. VALIDACIÓN Y CRITERIOS DE ACEPTACIÓN

1. **Inspección Visual:** Abrir el sitio en local y validar estética limpia, profesional y sin saltos visuales ni jerga técnica.
2. **Cero Bugs en Consola:** Verificar que no haya errores de JavaScript.
3. **Flujo de Navegación:** Comprobar que todos los CTAs hacen scroll suave a `#diagnostico`.
4. **Envío de Formulario:** Probar un envío real y verificar que el payload llegue estructurado al webhook de n8n con sus UTMs limpias.
5. **Git:** Hacer un commit atómico y limpio: `git commit -m "feat: landing vFinal - transformacion operativa, 4 semanas y diagnostico estrategico"`.

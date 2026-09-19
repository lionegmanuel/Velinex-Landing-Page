# CLAUDE.md - Velinex Landing Page

## Contexto del proyecto

Landing page de Velinex, empresa que instala sistemas de atención/ventas con IA (WhatsApp/Instagram) para PyMEs hispanohablantes. Sitio estático: HTML + CSS + JS vanilla, sin build step ni framework, sin backend en este repo.

Estructura real:

```
/
├── index.html          # Landing única (SEO/meta tags, JSON-LD Organization + FAQPage, GA4, todas las secciones)
├── style.css           # Design system completo (tokens en :root)
├── robots.txt
├── sitemap.xml
└── assets/
    ├── img/             # Logos (Velinex Full Iso NBG.webp/.png, Full-Logo variantes), VSL_thumbnail.png, screenshots (1.jpg/2.jpg/3.jpg, screen1-4.png, capturas de conversación WhatsApp real state)
    ├── video/           # video_ajl_demo.mp4
    └── js/index.js       # Todo el JS del sitio (un solo archivo externo)
```

## Reglas específicas de este repo

- `Edit` sobre `Write` en `index.html`/`style.css`/`assets/js/index.js` - son archivos grandes, cambiar solo lo pedido.
- `assets/js/index.js` es el único JS externo real del sitio - no duplicar su lógica inline. Excepción ya existente: el accordion del FAQ está implementado **dos veces** (una vez dentro de `index.js`, y una copia inline al final del `<body>` de `index.html`) - no agregar una tercera copia; si se toca el comportamiento del FAQ, actualizar ambas o consolidar, pero no asumir que solo vive en un lugar.
- Funciones globales expuestas por `index.js` que el HTML llama vía `onclick`/`onload` - no renombrar sin actualizar `index.html`:
  - `trackCTAClick(buttonName)`
  - `smoothScrollToDiagnostic(event)` (hace scroll a `#diagnostico`; la llaman todos los CTAs principales)
  - `smoothScrollToCalendar(event)` (alias histórico de la anterior; ningún botón la llama)
  - `applyLeakSimulatorToForm({ silent })` (precarga `#diag-volume`, `#diag-sector` y `#diag-bottleneck` con lo elegido en el simulador; la llama el CTA `#leak-cta` y, en silencio, un observer cuando el visitante llega a `#diagnostico` habiendo usado el simulador. Nunca pisa un campo que la persona editó a mano: se marca con `data-user-edited`)
  - `handleStickyCTA(event)` (barra sticky de mobile: en modo `simulador` scrollea a `#simulador`, en modo `diagnostico` a `#diagnostico`)
  - `appendUTMs(url)` / `window.getAttribution()`
  - `window.getCTAStats()` / `window.resetCTAStats()` (debug)
- IDs usados por `index.js` - no renombrar en el HTML sin tocar el JS: `diagnostico`, `diagnostic-form`, `diag-submit-btn`, `form-feedback`, `imageModal`, `modalClose`, `whatsapp-float`, `simulador`, `leak-simulator`, `leak-volume`, `leak-volume-value`, `leak-lost-value`, `leak-lost-note`, `leak-ops-value`, `leak-ops-label`, `leak-hours-value`, `leak-hours-note`, `leak-cta`, `sticky-cta-mobile`, `sticky-cta-link`, `diag-volume`, `diag-sector`, `diag-bottleneck`, `diag-prefill-note`, `diag-prefill-text`.
- Simulador de Fugas Operativas (`#simulador`, desde 2026-09-18): sección `.leak-simulator-section` ubicada entre `.asset-section` y `.process-section`. Slider 40-300 (paso 5, inicial 60), chips de rubro (`data-sector`: concesionaria, inmobiliaria, clinica, retail, b2b) y pregunta de cobertura fuera de hora (`data-coverage`: si 10%, parcial 25%, no 45% de fuga). Fórmulas en `index.js` (bloque "SIMULADOR DE FUGAS"): consultas enfriadas = consultas_dia * 30 * factor; operaciones = rango por rubro sobre las enfriadas; horas = consultas_mes * 3.5 min / 60. Los coeficientes por rubro son orientativos: si Facu los ajusta, cambiar solo el objeto `SECTORS`.
- El payload del formulario de diagnóstico ahora incluye `simulador` (objeto con consultas_dia, rubro, cobertura_fuera_de_hora, consultas_mes, consultas_enfriadas_mes, operaciones_perdidas_min/max, horas_equipo_mes, interactuo) o `null` si la persona no usó el simulador. n8n lo puede ignorar sin romper nada.
- Barra sticky de mobile (`#sticky-cta-mobile`, `< 768px`): aparece cuando el hero quedó arriba y se oculta mientras `#simulador` o `#diagnostico` están en pantalla. Tiene dos modos (`data-mode`): `simulador` ("¿Cuántas consultas perdés? Calcular fuga →") hasta que el visitante pasa o usa el simulador, y `diagnostico` ("Solicitar Diagnóstico Estratégico →") después. Textos en `STICKY_MODES` dentro de `index.js`.
- Casos reales (`.testimonials-section`) activados el 2026-09-18 con 3 casos anonimizados por rubro (concesionaria 94,8% contactabilidad en menos de 30 s; clínica +42 h semanales y 78% de asistencia; desarrollos inmobiliarios 100% de consultas filtradas). Sin nombres de empresas ni personas hasta tener autorización escrita: no inventar nombres ni citas atribuidas.
- Sin calendario desde 2026-09-11 (criterio Facu Corengia): el embed de Cal.com se eliminó por completo de `index.html`. No reintroducir Cal.com sin pedido explícito.
- Desde 2026-09-12 el CTA principal ya no es WhatsApp en frío: todos los `.btn-primary` de `index.html` hacen scroll a `#diagnostico` (Formulario de Diagnóstico Estratégico en 3 pasos). El único WhatsApp que queda en la página es el botón flotante `#whatsapp-float` para soporte puntual.
- Prohibido volver a concatenar "(vía utm_source)" al texto de los links de WhatsApp: la atribución viaja por localStorage, GA4 y el payload del formulario, nunca en el mensaje que ve el prospecto.
- Evento GA4 `calendar_reached` se mantiene con ese nombre por histórico, pero hoy mide llegada a la sección `#diagnostico`. El submit del formulario dispara `diagnostic_submitted`.
- Clases con animación manejada por `IntersectionObserver` en `index.js`: `.fade-in` (observer general), `.solution-card` y `.pain-card` (stagger propio). Si se agrega una sección nueva que deba animar al hacer scroll, usar `.fade-in` en vez de reinventar un observer.
- GA4 tag ID en `index.html`: `G-LWKQSM2B03` - no modificar sin pedido explícito. Eventos custom ya trackeados: `cta_click`, `vsl_play`, `scroll_depth`, `time_on_page`, `calendar_reached`, `diagnostic_submitted`, `leak_simulator_used` (primera interacción con el simulador) y `leak_simulator_apply` (CTA del simulador, lleva rubro, cobertura y consultas). Nombres de CTA nuevos en `cta_click`: `CTA_Simulador`, `CTA_Sticky_Mobile_Simulador`.
- Meta Pixel: hay una llamada a `fbq('track', 'Lead', ...)` dentro de `trackCTAClick` - no se encontró el snippet de carga del pixel en `index.html`; si se agrega, verificar que `fbq` esté definido antes de asumir que el tracking funciona.
- Captura de leads: `index.html` tiene el formulario de diagnóstico (`#diagnostic-form`, manejado en `assets/js/index.js`), que hace POST JSON al mismo webhook de n8n que el Centro de Recursos (`https://webhook-n8n.velinex.digital/webhook/lead-magnet`, header `X-Velinex-Secret`) con `origen: "landing_diagnostico"` y `formId: "diagnostico_landing"` para distinguirlo del otro formulario. El otro formulario es `recursos.html` (Centro de Recursos): POST JSON al webhook de n8n `https://webhook-n8n.velinex.digital/webhook/lead-magnet` con header `X-Velinex-Secret`, campos `nombre`, `email`, `telefono` (E.164 estricto), `calificacion` (chip de situación), `interes_comercial` (chip "filtro de oro") y UTMs. Tras el submit redirige a `puente.html?n=&s=&i=` que arma el mensaje de WhatsApp según interés comercial. Nunca anticipar en `recursos.html` que la entrega es por WhatsApp (criterio Facu): eso se revela recién en `puente.html`.

### Design system (`style.css`, tokens en `:root`)

- Color: `--bg #0b1120` `--primary #070912` `--alt-bg #0f1a2e` `--surface #111e33` `--card-bg #131f35` `--card-bg-hover #172441`
- Accent: `--accent #38bdf8` `--accent-2 #0ea5e9` (variantes `--accent-glow`, `--accent-border`, `--accent-subtle`)
- Texto: `--text #eef2f9` `--text-secondary #99aec8` `--text-muted #5a7090` `--text-dim #364a62`
- Estado: `--green #22c55e` `--red #ef4444`
- Radios: `--radius-xs 6px` `--radius-sm 10px` `--radius-md 16px` `--radius-lg 24px` `--radius-xl 32px`
- Motion: `--ease cubic-bezier(0.4,0,0.2,1)` `--ease-spring cubic-bezier(0.34,1.56,0.64,1)` `--duration 0.24s`
- Sombras: `--shadow-sm/md/lg/accent`, bordes: `--border`, `--border-accent`
- Fuente: Plus Jakarta Sans (400/500/600/700/800), cargada desde Google Fonts con `preconnect`
- Nunca usar `var()` dentro del timing function de una `animation`/`transition` shorthand si el valor no resuelve en ese contexto - usar el valor explícito.

## Regla de negocio no negociable

- El precio nunca aparece en la landing (confirmado: no hay ningún monto en `index.html`; el FAQ "¿Cuánto cuesta?" redirige explícitamente al Diagnóstico gratuito). No agregar precios ni rangos de precio a ningún texto de esta página sin instrucción explícita.
- Cero garantía en la landing desde 2026-09-12: la sección `.guarantee-section` y toda mención a los "45 días de garantía" se eliminaron de `index.html` y de `style.css`. No reintroducirlas sin instrucción explícita (el documento maestro v9.1 todavía describe la garantía como parte de la oferta, pero la página no la comunica).
- Cronograma cerrado en 4 semanas exactas: nunca escribir "5 semanas", "semana 6" ni rangos. Cuatro fases, una por semana.
- Prohibida la jerga técnica de cara al cliente: "RAG", "LLM", "APIs", "VPS", "flujos", "go-live", "tokens", "chatbot". Hablar de procesos, cuellos de botella, capacidad de escala y tareas repetitivas.

## Contexto de sesión - UPDATES.md

- Al iniciar cualquier conversación nueva, revisar `UPDATES.md` (raíz del repo) si existe, para confirmar contexto de la última sesión trabajada antes de responder o actuar.
- Nunca escribir ni actualizar `UPDATES.md` salvo que el usuario lo pida explícitamente.
- Retención por días, no por cantidad de sesiones: se mantienen los últimos 3 días; al superar ese total se elimina el día completo más antiguo.
- Dentro de un mismo día puede haber sesiones ilimitadas - todo lo trabajado en el día debe quedar documentado, nunca se trunca por volumen.
- Cada sesión dentro de un día lleva su propio título breve.
- Las sesiones del mismo día se separan entre sí con `---`.
- Orden cronológico de la más antigua a la más reciente dentro del día.

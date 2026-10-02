# UPDATES.md

Registro de sesiones de trabajo sobre este repo. Retención: últimos 3 días completos.

## 2026-09-12

### Landing vFinal: transformación operativa, 4 semanas exactas y diagnóstico estratégico

Refactor completo siguiendo `PROMPT_IMPLEMENTACION_vFINAL.md` (raíz del repo), alineado al documento maestro v9.1 (reposicionamiento a Transformación Operativa, cronograma cerrado en 4 semanas, cero garantía en la landing).

- **`index.html`**: hero, dolor, solución, PUV y proceso reescritos sin jerga técnica ("RAG", "LLM", "APIs", "VPS", "flujos", "go-live", "tokens", "chatbot"). Cronograma pasa de 5 semanas + semana 6 en vivo a 4 semanas exactas (4 fases, una por semana). Se elimina por completo `.guarantee-section` y toda mención a los 45 días de garantía (hero, trust strip, PUV, métrica del bloque asset, FAQ). La sección "¿Esto es para tu negocio?" se retira (quedaba duplicada con el filtro previo del nuevo bloque). `#cta-final` se reemplaza por `#diagnostico`: filtro previo (sí/no) + explicación de la sesión + formulario en 3 pasos (contacto, empresa, situación operativa). Todos los `.btn-primary` del sitio ahora hacen scroll a `#diagnostico`; el único WhatsApp que queda en la página es el botón flotante de soporte.
- **`assets/js/index.js`**: erradicada la concatenación de `(vía utm_source)` en los links de WhatsApp (la atribución ahora viaja solo por localStorage, GA4 y el payload del formulario). Nueva `smoothScrollToDiagnostic()` (con `smoothScrollToCalendar` como alias histórico). Manejo completo de `#diagnostic-form`: validación E.164 del teléfono, honeypot, payload con UTMs, POST al webhook de n8n (`https://webhook-n8n.velinex.digital/webhook/lead-magnet`, header `X-Velinex-Secret`, `formId: "diagnostico_landing"`, `origen: "landing_diagnostico"`), evento GA4 `diagnostic_submitted`. `calendar_reached` ahora observa `#diagnostico` en vez de `#cta-final`. Corregido de paso un bug preexistente: `.sticky-cta-mobile.show` no tenía ninguna regla CSS, así que la barra sticky de mobile estaba siempre visible y tapaba el formulario nuevo; ahora se oculta correctamente dentro de `#diagnostico`.
- **`style.css`**: estilos nuevos de `.diagnostic-flow-section` (filtro, pasos del form, inputs/selects/textarea, feedback de éxito/error) sobre los tokens existentes. Borrados los estilos huérfanos de `.guarantee-section`, `.for-who` y `.cta-final`. Timeline de proceso corregido de `repeat(5, 1fr)` a `repeat(4, 1fr)` (bug preexistente: quedaba una columna de más con las 4 etapas actuales).
- **`CLAUDE.md`**: actualizado con las funciones/IDs nuevos, la regla de "cero garantía" y "4 semanas exactas", y la jerga prohibida.
- Validado en Edge headless (1440/768/390px): sin errores de consola, sin scroll horizontal, submit de formulario probado con `fetch` interceptado (payload correcto) y contra el webhook real (200 OK). Queda un lead de prueba en n8n con `responseId: TEST-CLAUDE-2026-09-12` para borrar del lado de n8n.
- Pendiente de decisión del usuario: si n8n debe ramificar el flujo por `origen`/`formId` ya que el mismo endpoint ahora recibe dos formas de payload distintas (Centro de Recursos vs. diagnóstico de la landing).

Commit: `feat: landing vFinal - transformacion operativa, 4 semanas y diagnostico estrategico`.

## 2026-09-21

### Dual CTA en el hero: acceso al Centro de Recursos

Implementación de `PROMPT_DUAL_CTA_RECURSOS.md` (patrón de doble llamada a la acción, referencia Australis AI vía mentoría de Facu Corengia) para capturar tráfico tibio en el primer scroll sin tocar el CTA principal.

- **`index.html`**: dentro de `.cta-block` del hero se agrega el contenedor `.cta-group` con dos botones. El principal queda idéntico (`smoothScrollToDiagnostic(event)` + `trackCTAClick('CTA_Hero_Diagnostico')`). El secundario "Recursos gratis" (`.btn-secondary`) apunta a `recursos.html?utm_source=landing&utm_medium=hero_secondary&utm_campaign=recursos_cta` y dispara `trackCTAClick('CTA_Hero_Recursos_Gratis')`. Las UTM viajan por URL: `recursos.html` las guarda en `velinex_attribution` y las manda a n8n.
- **`style.css`**: nuevas clases `.cta-group` y `.btn-secondary` sobre los tokens existentes (`--radius-sm`, `--duration`, `--ease`, `--accent`, `--accent-subtle`), con hover, `:active`, `:focus-visible` y la misma animación de entrada del botón principal con un delay mayor. En `max-width: 640px` los botones se apilan en columna al 100% de ancho y con `white-space: normal` (el `nowrap` de `.btn-primary` desbordaba el texto largo a 390px).
- **`assets/js/index.js`**: sin cambios. `smoothScrollToDiagnostic` y `trackCTAClick` siguen intactas.
- Validado en Edge headless: escritorio (1440px) con los dos botones alineados en horizontal, móvil (390px) apilados sin desborde horizontal, sin guion largo en los archivos. No se probó el envío real a n8n / Sheet `leads_base` con este origen.
- Limpieza del repo: se eliminan los prompts ya ejecutados (`PROMPT_DUAL_CTA_RECURSOS.md`, `PROMPT_IMPLEMENTACION_vFINAL.md`, `PROMPT_OPTIMIZACION_CONVERSION_Y_WIDGET.md`).

## 2026-10-02

### Refactor integral v3.0: estética enterprise y nueva arquitectura

Ejecución de `PROMPT_MAESTRO_REFACTOR_LANDING.md` con `AUDITORIA_ESTETICA_Y_DIRECCION_DE_ARTE.md` y `ESPECIFICACION_COPY_Y_ARQUITECTURA_SECCIONES.md` (base del líder del equipo, ya eliminados del repo).

- **`index.html`**: nav con indicador y CTA, hero centrado con la pastilla de contraste invertido, barra de métricas bajo los CTAs y VSL debajo. Nuevo orden: casos, límite operativo, qué contiene (bento 3x3 + "Más que solo un agente de IA"), comparativa contra contratar personal, simulador, proceso, calificación sí/no, cierre con formulario y FAQ. Íconos SVG en sprite inline en lugar de emojis. FAQ con `<button>` + `aria-expanded` y JSON-LD alineado al FAQ visible.
- **`style.css`**: tokens 3.0 (canvas `#050811`, superficies con luz de borde, `--pill-contrast-*`), bento grids asimétricos, simulador con estética de herramienta SaaS. Se mantienen compatibles las clases que usan `recursos.html` y `puente.html`.
- Se eliminaron las secciones de solución, "5 activos", el bloque de capturas + video demo y la barra de métricas vieja.
- Validado en Edge headless (1440/1280/390 px): sin errores de consola ni scroll horizontal; simulador, precarga, FAQ, sticky de mobile y envío del formulario (fetch interceptado, payload correcto) funcionando.

Commit: `feat(landing): refactor integral v3.0 - estetica enterprise y nueva arquitectura`.

---

### Caso real verificado, limpieza del repo y nav flotante

- Caso inmobiliario con cifras del panel de la operación (26.572 consultas, 99,8% de contactabilidad en menos de 1 minuto, 1.141 visitas reales agendadas por WhatsApp). Métrica del hero ajustada a "+26.000".
- Limpieza: borrados los prompts y documentos del refactor ya ejecutados, la captura `landing_current_full.png` y los assets sin uso (screenshots, capturas de conversación y `video_ajl_demo.mp4`). Se conservan los masters de logo.
- Nav rediseñado como cápsula flotante de vidrio con borde iluminado y marca "Velinex" junto al isotipo (`--nav-h` / `--nav-offset` controlan alto, separación, padding del hero y `scroll-margin-top`).

Commits: `chore: limpiar assets sin uso y documentacion ya ejecutada`; el nav y el caso real entran en el commit de la sesión siguiente.

---

### Alineación de oferta y copy con las BASES de Velinex

Auditoría completa contra `VELINEX · BASES Y FUNDACIONES` / `CLAUDE.md` del repo de negocio, con decisiones de Manuel:

- **Un solo caso real**: desarrolladora inmobiliaria de Perú, solo métricas y contexto (sin nombre, proyectos, personas, herramientas ni datos de Fixu). Se eliminaron los casos de concesionaria y clínica y la cita atribuida, que no tenían respaldo.
- **CTAs de resultado**: "Quiero mi plan de transformación →" (sesión de 30 minutos con sus propios números, "te lo llevás listo, trabajemos juntos o no"). "Diagnóstico" fuera de todo texto visible; los IDs y eventos GA4 no cambian.
- **Oferta**: el proceso pasa a Auditoría Operativa de bonus sin cargo + 4 fases (Conexión, Entrenamiento, Pruebas, Puesta en marcha con 30 días de soporte prioritario), sin cantidad de semanas: plazo cerrado y fijado por contrato. "Qué contiene" suma confirmación y recordatorios, seguimiento a las 48-72 horas y a la semana, postventa, cierre con link de pago, cobranza y reporte mensual.
- **Sin nichos**: fuera la cinta de sectores y los rubros del FAQ. El simulador y el selector del formulario preguntan cómo vende la empresa (5 modelos de venta). En `assets/js/index.js` solo cambiaron los textos del objeto `SECTORS`, `STICKY_MODES`, el botón de envío y los mensajes de estado; coeficientes, IDs, funciones y eventos intactos.
- **Vocabulario**: fuera "bot", "integración", "leads", "SaaS" y "dashboards" del texto visible.
- Validado de nuevo en Edge headless (escritorio y 390 px): sin errores, sin scroll horizontal, flujo completo del simulador al envío funcionando. Sin guion largo en ningún archivo.
- Pendiente para n8n: el campo `sector` del payload ahora trae el modelo de venta (ej. "Venta con visita o reunión previa") en lugar del rubro.

Commit: `feat(landing): alinear oferta y copy con las bases de Velinex`.

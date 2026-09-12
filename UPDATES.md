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

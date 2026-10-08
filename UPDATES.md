# UPDATES.md

Registro de sesiones de trabajo sobre este repo. Retención: últimos 3 días completos.

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

## 2026-10-08

### Oferta Programa Piloto Automático 60 y optimización de conversión

Ejecución de `PROMPT_OPTIMIZACION_LANDING.md` con `docs-optimizacion/01-03` (alineado a BASES v9.3 §8.4, §8.5 y §8.8). Decisiones abiertas aplicadas con el valor por defecto del plan, sin consultar: D1 garantía de 45 días vuelve, solo dentro de `#programa` y en el FAQ; D2 "60 días" se nombra; D3 "auditoría" solo como bajada del Mapa Operativo 360; D4 se mantienen los cupos de 3 empresas por mes (confirmar que siga siendo real); D5 cifras del caso sin tocar.

- **Hero**: badge "Programa Piloto Automático 60 · Cupos para 3 empresas por mes", H1 "Tu negocio atendiendo, calificando y cerrando en piloto automático." (3 líneas a 390 px, CTA visible sin scrollear), subtítulo con el plazo de 60 días, métricas +26.000 / 24/7 / 60 días / 90 min (sale "< 30 seg", que no estaba respaldado) y título del VSL "antes de pedir tu plan". Sale la línea de cupos duplicada del hero.
- **Orden nuevo**: hero, casos, dolor, simulador, qué contiene, `#programa`, comparativa, calificación, cierre y FAQ. Nav: "El Programa" reemplaza a "Cómo Funciona". El cierre de `#dolor` linkea al simulador (`CTA_Dolor_Simulador`).
- **`#programa`** (reemplaza a `#proceso`, que queda como span alias para links viejos): línea de tiempo de 5 hitos sin semanas, tarjeta grande del Mapa Operativo 360 con sus 5 entregables, Implementación con 2 entregas, Arranque sin riesgo, Ajuste en Vivo (de regalo hasta el día 60), Lo que ponés vos (90 min + 2 revisiones cortas), garantía con letra chica y CTA `CTA_Programa`. Íconos nuevos en el sprite: escudo, regalo, mapa, ajuste y reloj.
- **Qué contiene**: fuera el panel en tiempo real, el CRM a medida y la cobranza/postventa como estándar; registro en el CRM o planilla del cliente, cierre "según cómo vendés" y reporte mensual.
- **Comparativa**: H2 "Lo mismo, contratando a alguien, te costaría más y te daría menos.", sin "volumen ilimitado", tabla con filas de rotación de personal y medición.
- **Calificación**: sin "40 consultas" ni "$20 USD"; filtro por situación del prospecto. **Cierre**: H2 "...en 30 minutos" y CTA universal; formulario, IDs, opciones y payload intactos.
- **FAQ**: 12 preguntas (nuevas: "¿Qué pasa si no funciona?" y "¿Qué pasa después del día 60?"), JSON-LD generado desde la misma lista e idéntico al visible. Title, description, OG y Twitter con el programa.
- **`style.css`**: estilos de `.program-*` sobre los tokens existentes; borrados los `.process-*` huérfanos (no los usan `recursos.html` ni `puente.html`). **`assets/js/index.js`**: sin cambios.
- **`CLAUDE.md`**: reglas nuevas de oferta, garantía, plazo de 60 días, "auditoría", sin reglas internas en la página y sin promesas fuera del core.
- QA en Edge headless: 0 errores de consola y sin scroll horizontal en 1440/1280/768/390; los 4 CTAs a `#diagnostico` con `cta_click`; nav y ancla vieja `#proceso` con el `scroll-margin-top` correcto; simulador, precarga, validación E.164 y envío con fetch interceptado (mismas 19 claves de payload); FAQ con mouse y teclado; sticky de mobile. `recursos.html` y `puente.html`: capturas idénticas a las de antes. Lighthouse móvil sin cambios (70/99/100/100, local). No se probó el envío real contra n8n.
- Excepciones intencionales que quedan en texto visible: opción "Menos de 40 consultas por día" de `#diag-volume` (la usa n8n) y "Venta de ticket alto con asesor" de `#diag-sector` (el plan prohíbe tocar esas opciones).
- Se borraron `PROMPT_OPTIMIZACION_LANDING.md` y `docs-optimizacion/` (plan interno, nunca commiteado).

Commit: `feat(landing): oferta Programa Piloto Automático 60 y optimización de conversión`. Publicado en GitHub (`origin/main`) por pedido de Manuel. Sigue pendiente confirmar que los cupos de 3 empresas por mes (D4) son reales.

---

### Plazo de 35 días, calculadora como recurso aparte y orden de cierre

Decisión de Manuel: los 60 días suenan largos para el prospecto. Revisado contra BASES §8.4 (Mapa Operativo 360 en la semana 1, implementación en las semanas 2 a 5, 100% en vivo el día 35, Ajuste en Vivo del 36 al 60), el plazo que se promete pasa a ser **"tu sistema funcionando en 35 días"**. No 30 (contado desde el pago promete menos de 5 semanas, regla de BASES) ni 45 (es la fecha de la garantía). El 60 queda en el nombre del programa.

- **35 días**: nav, subtítulo del hero, métrica del hero, title/description/OG/Twitter, cierre de la calculadora y FAQ "¿Cuánto tiempo toma la implementación completa?" (JSON-LD idéntico). `#programa`: H2 "Tu sistema funcionando en 35 días. Los 25 siguientes, de regalo.", barra nueva `.program-phases` (35 días + 25 de regalo) alineada con la línea de tiempo, hitos "Día 1", "Día 35" y "Del día 36 al 60". La garantía al día 45 no cambia.
- **Calculadora como recurso**: el simulador sale de `index.html` y pasa a `calculadora.html` (página propia con H1, mismo nav, puente a `#programa` y `#diagnostico`, sin precio ni garantía). Se llega por el botón "Calculadora de fugas" del nav (en mobile "Calculadora") y por el link del cierre de `#dolor`. La simulación se guarda en `localStorage` (`velinex_simulador`) y el CTA lleva a `index.html#diagnostico`, que precarga el formulario y manda `simulador` en el payload igual que antes. Agregada al `sitemap.xml`.
- **Orden**: el FAQ pasa antes de la calificación y del formulario, que queda como lo último de la página. Barra sticky de mobile con un solo modo ("Quiero mi plan de transformación →").
- **`assets/js/index.js`**: persistencia y lectura de la simulación entre páginas, `smoothScrollToDiagnostic` navega a la landing si la página no tiene formulario, sticky simplificado. CTAs nuevos: `CTA_Nav_Calculadora`, `CTA_Dolor_Calculadora`, `CTA_Calculadora_Nav`, `CTA_Calculadora_Programa`.
- **Documentación**: `CLAUDE.md` del repo (estructura, plazo de 35 días, calculadora, orden, CTAs) y BASES v9.3 en `Velinex-Engineering-Bussines` (nota de ajuste, bloque OFERTA, PUV, §8.4, §8.8 y pitch).
- QA en Edge headless: 28/28 (calculadora, ida a la landing con el formulario precargado, envío con la simulación en el payload, CTAs, nav, anclas, FAQ, sticky), sin errores de consola ni scroll horizontal en 1440/1024/390, sin guion largo. `recursos.html` y `puente.html` idénticas a las capturas previas. No se probó el envío real contra n8n.

Commit: `feat(landing): plazo de 35 días y calculadora de fugas como página aparte`.

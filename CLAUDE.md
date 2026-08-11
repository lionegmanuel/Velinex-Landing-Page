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
  - `smoothScrollToCalendar(event)`
  - `handleCalLoad()`
  - `appendUTMs(url)` / `window.getAttribution()`
  - `window.getCTAStats()` / `window.resetCTAStats()` (debug)
- IDs usados por `index.js` - no renombrar en el HTML sin tocar el JS: `cal-loading`, `cal-iframe`, `cal-fallback-link`, `imageModal`, `modalClose`, `whatsapp-float`.
- El iframe de Cal.com (`#cal-iframe`) usa `data-cal-src` (no `src` directo) - el JS le inyecta el `src` real con UTMs vía `appendUTMs`. No poner `src` fijo en el HTML, rompe la atribución.
- Clases con animación manejada por `IntersectionObserver` en `index.js`: `.fade-in` (observer general), `.solution-card` y `.pain-card` (stagger propio). Si se agrega una sección nueva que deba animar al hacer scroll, usar `.fade-in` en vez de reinventar un observer.
- GA4 tag ID en `index.html`: `G-LWKQSM2B03` - no modificar sin pedido explícito. Eventos custom ya trackeados: `cta_click`, `vsl_play`, `scroll_depth`, `time_on_page`, `calendar_reached`.
- Meta Pixel: hay una llamada a `fbq('track', 'Lead', ...)` dentro de `trackCTAClick` - no se encontró el snippet de carga del pixel en `index.html`; si se agrega, verificar que `fbq` esté definido antes de asumir que el tracking funciona.
- No se encontraron referencias a Tally.so ni a webhooks de n8n en este repo - la captura de leads corre 100% vía embed de Cal.com. Si se agrega un formulario propio, documentar el flujo acá.

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
- Garantía de 45 días: se presenta siempre en la sección `.guarantee-section`, nunca en el hero ni en un titular - mantener ese patrón si se edita.

## Contexto de sesión - UPDATES.md

- Al iniciar cualquier conversación nueva, revisar `UPDATES.md` (raíz del repo) si existe, para confirmar contexto de la última sesión trabajada antes de responder o actuar.
- Nunca escribir ni actualizar `UPDATES.md` salvo que el usuario lo pida explícitamente.
- Retención por días, no por cantidad de sesiones: se mantienen los últimos 3 días; al superar ese total se elimina el día completo más antiguo.
- Dentro de un mismo día puede haber sesiones ilimitadas - todo lo trabajado en el día debe quedar documentado, nunca se trunca por volumen.
- Cada sesión dentro de un día lleva su propio título breve.
- Las sesiones del mismo día se separan entre sí con `---`.
- Orden cronológico de la más antigua a la más reciente dentro del día.

# PROMPT DE OPTIMIZACION: Conversion Extrema y Widget Interactivo de Fugas en Velinex

## Instruccion para el Agente / Ingeniero Ejecutor

Sos el Lead Conversion Rate Optimizer (CRO) y Senior Frontend Engineer a cargo de optimizar la landing page de Velinex en `d:\Documents\MANUEL\DEV\Velinex-Landing-Page`.
Operas en modo 100% autonomo permanente ("dangerously mode"), sin stoppers, sin frenos ni preguntas intermedias.

### Mision del Proyecto

Convertir la landing page de Velinex en una maquina de conversion automatica: cualquier dueño de negocio con mas de 40 consultas al dia que ingrese debe experimentar una revelacion financiera sobre el dinero y las ventas que esta perdiendo por no tener sistema, llevandolo de forma inevitable a completar el Formulario de Diagnostico Estratégico (`#diagnostico`).

---

## 1. Reglas de Negocio Innegociables de Velinex (Leer con Cuidado)

1. **El precio NUNCA aparece en la landing**: Cero montos, cero rangos de precio.
2. **Cero garantia en la landing**: Prohibido reintroducir la garantia de 45 dias.
3. **Cronograma cerrado en 4 semanas exactas**: Nunca escribir "5 semanas" ni rangos.
4. **Prohibida la jerga tecnica de cara al cliente**: Cero palabras como RAG, LLM, APIs, VPS, tokens, flujos, chatbot. Hablar siempre de procesos, cuellos de botella, capacidad de escala y tareas repetitivas.
5. **Destino de todos los CTAs**: Todos los botones principales (`.btn-primary`) hacen scroll suave a `#diagnostico` llamando a `smoothScrollToDiagnostic(event)`. El unico WhatsApp de la pagina es el boton flotante `#whatsapp-float`.
6. **Prohibido el uso del guion largo (em dash)**: Utilizar unicamente guiones cortos "-", dos puntos o parentesis.

---

## 2. Posicionamiento Estrategico del Widget Interactivo

El widget NO debe ir en el Hero (donde distraeria del VSL y del titular principal). Debe colocarse **justo despues de la seccion de "Transformacion Operativa" (Los 5 Activos) y antes de la seccion del "Proceso de 4 Semanas"**.

En este punto del scroll, el visitante ya entendio el problema conceptual; ahora necesita ver **sus propios numeros** para que la necesidad sea urgente y palpable.

---

## 3. Especificacion del Widget: "Simulador de Fugas Operativas"

### A. Estructura Visual y Diseño (CSS Nativo)

- Contenedor con clase `.leak-simulator-section`:
  - Fondo con degradado sutil `:root` (`--card-bg` con borde `--border-accent`).
  - Kicker: `CALCULADORA DE IMPACTO REAL`.
  - Titular: `¿Cuanto le esta costando a tu negocio no tener un sistema comercial?`.
  - Subtitular: `Selecciona tus parametros actuales y calcula en 10 segundos las oportunidades y horas que se estan fugando cada mes.`

### B. Controles Interactivos (Inputs)

1. **Slider de Consultas Diarias**: Rango de 40 a 300+ consultas/dia (valor inicial: 60).
2. **Selector de Rubro (Chips)**:
   - Concesionaria automotriz
   - Inmobiliaria / Desarrollos
   - Clinica / Salud
   - Optica / Retail
   - Servicios y Empresas B2B
3. **Pregunta Clave de Fuga**:
   - "¿Tenes atencion activa noches y fines de semana?" -> `Si, siempre` | `Parcial / lenta` | `No, solo horario de oficina`.

### C. Tarjeta de Diagnostico en Vivo (Resultados en Tiempo Real)

El visitante ve cambiar las metricas de forma reactiva al mover los controles:

1. **Consultas que hoy se enfrian al mes**:
   - Formula: `(consultas_dia * 30) * factor_fuga` (donde factor fuga es 45% si no atiende de noche/finde, o 25% si atiende parcial).
2. **Operaciones potenciales perdidas**:
   - Rango de ventas/turnos recuperables estimados segun el rubro (ej: 4 a 8 operaciones en concesionaria; 15 a 30 turnos en clinica).
3. **Horas operativas desperdiciadas por tu equipo**:
   - `consultas_mes * 3.5 minutos / 60` (mostrando el tiempo tirado a la basura respondiendo lo mismo).
4. **Boton de Accion Inmediata**:
   - `Ver el plan para recuperar estas oportunidades en tu negocio →`
   - Al hacer clic, hace scroll suave a `#diagnostico` y precarga el campo de consultas en el Paso 2 del formulario.

---

## 4. Optimizaciones Adicionales para la Conversion

1. **Activacion de Casos y Prueba Social**:
   - Descomentar y pulir la seccion de testimonios/casos reales (`.testimonials-section`) con metricas demostrables:
     - Caso 1 (Concesionaria): 94.8% de contactabilidad en <30 segundos; recupero de operaciones de fin de semana.
     - Caso 2 (Clinica Privada): +42 horas semanales recuperadas por el equipo de recepcion; asistencia al sillon elevada al 78%.
     - Caso 3 (Desarrollos Inmobiliarios): 100% de consultas de avisos filtradas y visitas agendadas directamente con el asesor.
2. **Barra Fija Inferior en Mobile (Sticky Conversion Bar)**:
   - En pantallas menores a 768px, cuando el usuario pasa el Hero, aparece una barra flotante inferior discreta con:
     `¿Cuantas consultas perdes? Calcular fuga →` que lleva con 1 toque al simulador o al formulario.
3. **Cero Friccion en el Formulario**:
   - Si el usuario uso el simulador, el formulario de diagnostico refleja esos datos automaticamente para que no tenga que re-escribirlos.

---

## 5. Criterios de Aceptacion Innegociables

- Todo implementado en `index.html`, `style.css` y `assets/js/index.js`.
- Cero frameworks adicionales: JavaScript vanilla puro y CSS con las variables `:root` existentes.
- Compatible 100% con los IDs existentes (`diagnostico`, `diagnostic-form`, etc.).
- Cero uso del caracter em dash en textos, comentarios o codigo.
- Cero errores en consola al interactuar con el simulador en mobile y desktop.

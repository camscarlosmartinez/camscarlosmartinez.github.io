# CAMS v7 — Estado de auditoría y plan de migración

## Alcance de esta auditoría

Se ejecutó la fase de auditoría sobre el repositorio abierto, sin modificar la interfaz ni el contenido visible del sitio. La intención de este documento es servir como base de decisión para la migración a Astro con salida estática en GitHub Pages, manteniendo las rutas públicas actuales y la identidad editorial de CAMS.

## Decisiones técnicas derivadas de documentación oficial vigente

- Astro: la migración debe usar Astro con TypeScript, salida estática y despliegue por GitHub Actions. La configuración debe declarar explícitamente site y, cuando aplique, base para que las URLs generadas sean consistentes con GitHub Pages.
- GitHub Pages: para este repositorio, el flujo recomendado es usar GitHub Actions como fuente de publicación, no depender de un servidor propio ni de una build manual ad hoc.
- WCAG: se tomará como referencia la lógica de WCAG 2.2/2.1 y se priorizará cumplimiento de nivel AA en lo que sea factible para este sitio estático, con especial atención a navegación por teclado, foco visible, estructuras semánticas, textos alternativos y contraste.
- GOV.UK Design System y USWDS: se tomarán como referencias de arquitectura de componentes accesibles, patrones de navegación claros, jerarquía de contenido y uso de componentes simples y comprensibles; no se copiará su implementación completa ni se impondrá un diseño institucional de gobierno.

## 1. Inventario real del proyecto

### Estructura general

- Sitio estático sin build system previo.
- Contenido publicado principalmente en HTML y archivos estáticos.
- Estilos centralizados en un sistema modular basado en CSS nativo.
- JavaScript modular con inicialización progresiva y carga condicional por página.
- Datos reutilizables en JSON para árboles, arquitectura, documentos y estado del arte.
- Recursos públicos en PDF, SVG, PNG y JSON.

### Archivos clave presentes

- HTML raíz y páginas de sección:
  - /index.html
  - /estado-que-cumple/index.html
  - /documentos/index.html
  - /observatorio/index.html
  - /bitacora/index.html
  - /participar/index.html
  - /archivo/index.html
  - /cams/index.html
- Estilos:
  - /styles.css
  - /assets/css/tokens.css
  - /assets/css/base.css
  - /assets/css/layout.css
  - /assets/css/components.css
  - /assets/css/interactions.css
  - /assets/css/pages.css
  - /assets/css/responsive.css
- JavaScript:
  - /script.js
  - /assets/js/menu.js
  - /assets/js/command-palette.js
  - /assets/js/utilities.js
  - /assets/js/interactions.js
  - /assets/js/home-experience.js
  - /assets/js/view-modes.js
  - /assets/js/problem-tree.js
  - /assets/js/proposal-core.js
  - /assets/js/state-of-art.js
  - /assets/js/institutional-map.js
  - /assets/js/decision-lab.js
  - /assets/js/expediente-builder.js
  - /assets/js/document-library.js
  - /assets/js/participation.js
- Datos:
  - /assets/data/problem-tree.json
  - /assets/data/proposal-architecture.json
  - /assets/data/state-of-art.json
  - /assets/data/documents.json
  - /assets/data/activation-routes.json
- Recursos públicos:
  - /assets/documentos/estado-que-cumple-2026-2030.pdf
  - /assets/branding/
  - /assets/branding/logo-cams.png
  - /assets/branding/sello-cams.png
  - /site.webmanifest
  - /robots.txt
  - /sitemap.xml
- Herramientas de auditoría:
  - /tools/audit_site.py
  - /tools/audit_css.py
  - /tools/audit_js.py
  - /tools/audit_responsive.py

### Estado actual del contenido

- El sitio ya contiene una propuesta editorial clara, una identidad pública y una arquitectura de navegación estable.
- El núcleo conceptual de Estado que Cumple está presente en HTML, JSON y PDF.
- La biblioteca documental y el buscador global ya están implementados como capacidades interactivas.
- La participación está descrita como canal abierto, pero no se ha implementado un backend ni un formulario de recepción de datos.
- El observatorio está presente como diseño metodológico y no como tablero con datos reales.

## 2. Mapa de páginas y funciones actuales

### Página principal

- Inicio: portada orientadora, selector de perfil de visita, mapa del ecosistema, modos de entrada, proyectos visibles, perfil breve y participación.

### Estado que Cumple

- Propuesta central con varios modos de lectura.
- Índice de navegación interna.
- Árbol del problema interactivo.
- Núcleo metodológico RAÍCES/SAVIA/SEMILLAS.
- Estado del arte comparado.
- Mapa institucional.
- Rutas de activación, simulador, expediente y seguimiento.

### Documentos

- Biblioteca documental filtrable por texto, tipo y estado.
- Registros con metadatos, palabras clave y citación.

### Observatorio

- Página de diseño metodológico y seguimiento futuro.
- Expone líneas de observación, fuentes previstas, indicadores propuestos y tableros en construcción.

### Bitácora

- Catálogo editorial con series, categorías y estados de publicación.

### Participar

- Describe canales de participación, estados reales, roles y límites del sitio estático.

### Archivo

- Conservación, trazabilidad, repositorios y enlaces públicos confirmados.

### CAMS

- Identidad editorial y perfil público, con trayectoria, proyectos y canales confirmados.

## 3. Contenidos que se conservarán

Se conservarán los siguientes contenidos y funciones como prioridad:

- La identidad editorial y el perfil público de Carlos Arturo Martínez Sánchez.
- El discurso de CAMS como archivo público, laboratorio de políticas y plataforma de investigación.
- La propuesta Estado que Cumple y su marco conceptual completo.
- Los documentos públicos disponibles, especialmente el PDF de Estado que Cumple.
- Los contenidos de biblioteca, observatorio, bitácora, archivo y participación.
- Las rutas públicas actuales y sus URLs canónicas.
- El lenguaje de estado editorial: publicado, borrador, prototipo, planeado, activo y archivado.
- El posicionamiento de no oficialidad y la claridad de límites de la propuesta.

## 4. Contenidos que se moverán o reorganizarán

La migración debe reorganizar el contenido actual en una estructura más sostenible para Astro:

- El contenido de cada página debe pasar a una estructura de contenido con colecciones o páginas claras.
- Los datos de árboles, documentos y estado del arte deben moverse desde HTML inline y JSON estático a un modelo más mantenible en src/content o src/data.
- La información de navegación compartida debe moverse a un componente base.
- Las páginas con mucho contenido complejo deben separarse en secciones temáticas, en lugar de depender de un único archivo HTML monolítico.
- Los textos esenciales que hoy están embebidos en HTML deben mantenerse accesibles incluso si el JavaScript falla.

## 5. Componentes que se reemplazarán o reestructurarán

### Componentes de interfaz que deben traducirse a Astro

- Header y navegación principal.
- Footer y enlaces de contexto.
- Breadcrumbs o contexto de navegación.
- PageHero y secciones reutilizables.
- Componentes de cards, panels y listas de estado.
- Componentes de búsqueda y filtros.
- Componentes de navegación interna por capítulos.
- Componentes para timeline, evidencias, tablas y paneles de proyecto.

### Componentes interactivos que deben reescribirse con cuidado

- Búsqueda global.
- Biblioteca documental.
- Árbol del problema.
- Núcleo metodológico.
- Mapa institucional.
- Estado del arte comparado.
- Simulador y expediente técnico.
- Reglas de accesibilidad y foco.

Se recomienda no reimplementar todo en islas React. La migración debe priorizar Astro para la mayoría del contenido y reservar islas solo para las experiencias que realmente lo necesiten.

## 6. Rutas antiguas y rutas actuales que deberán mantenerse

Las siguientes rutas deben mantenerse intactas en la migración para no romper el sitio ni el posicionamiento público actual:

- /
- /estado-que-cumple/
- /documentos/
- /observatorio/
- /bitacora/
- /participar/
- /archivo/
- /cams/
- /assets/documentos/estado-que-cumple-2026-2030.pdf

Se recomienda mantener estas URLs como rutas canónicas de referencia y evitar redirecciones innecesarias durante la primera fase. Solo si se requiere una reorganización mayor, las redirecciones deben planificarse de forma explícita y documentada.

## 7. Riesgos de migración

### Riesgos técnicos

- El sitio actual depende en gran medida de HTML y JavaScript DOM-driven; no se puede migrar de forma literal sin revisar los hooks actuales.
- La arquitectura actual usa selectores y atributos de datos que deben conservarse o traducirse a Astro de forma consistente.
- La configuración de base y site de Astro es clave para GitHub Pages; si no se hace bien, los enlaces rotarán o romperán.
- El buscador global y la biblioteca documental dependen de fetch de JSON y de la presencia de selectores específicos; una migración incompleta puede romper la experiencia.

### Riesgos de contenido

- Existe riesgo de duplicar contenido entre HTML, JSON y PDF.
- El contenido de Estado que Cumple debe conservar su intención editorial y su lenguaje técnico sin convertirlo en un sitio genérico.
- No deben inventarse documentos, fechas, aprobaciones oficiales ni canales nuevos que no existan en el repositorio actual.

### Riesgos de accesibilidad y UX

- El diseño actual tiene muchas interacciones; algunas deben preservarse, pero todas deben ser operables por teclado y con alternativas textuales.
- No se debe perder el modo sin JavaScript ni la posibilidad de leer el contenido principal sin depender de la interfaz visual.
- El sitio debe seguir siendo legible y utilizable en móvil y con zoom alto.

## 8. Orden exacto de fases recomendado

1. Fase 1 — Infraestructura Astro y despliegue estático
   - Inicializar Astro con TypeScript.
   - Configurar salida estática.
   - Crear workflow de GitHub Actions para Pages.
   - Mantener el contenido actual en paralelo.
   - Validado con build de Astro exitosa en esta sesión.

2. Fase 2 — Estructura base y rutas
   - Crear layouts base, navegación compartida, footer y páginas estáticas.
   - Definir rutas y configuración de base/site.
   - Mantener los URLs actuales.

3. Fase 3 — Portada y navegación global
   - Migrar la portada y la navegación compartida.
   - Reproducir la identidad visual con los tokens y componentes base.
   - Verificar skip link, menú y buscador.

4. Fase 4 — Migración del núcleo de Estado que Cumple
   - Migrar las secciones centrales de la propuesta.
   - Reorganizar la propuesta en secciones y capítulos.
   - Trasladar los datos del problema, el núcleo metodológico y la arquitectura institucional.

5. Fase 5 — Migración del conocimiento y la participación
   - Documentos, observatorio, bitácora, archivo y participar.
   - Preservar el lenguaje editorial y los estados de publicación.

6. Fase 6 — Interacciones y mejora de accesibilidad
   - Reescribir el buscador, filtros y componentes interactivos.
   - Asegurar teclado, foco, ARIA, contraste y carga progresiva.

7. Fase 7 — SEO, rendimiento y cierre
   - Revisar metadatos, sitemap, robots, canonical y enlaces internos.
   - Validar rendimiento y accesibilidad básica.
   - Preparar la transferencia del sitio a producción.

8. Fase 8 — Revisión visual automatizada
   - Ejecutar esta fase solo después de completar la migración y de disponer de la build de Astro.
   - Usar Playwright para recorrer todas las rutas producidas por Astro.
   - Capturar cada página en 390x844, 768x1024, 1366x768, 1440x900 y 1920x1080.
   - Registrar errores de consola y solicitudes de red fallidas.
   - Detectar elementos más anchos que el viewport.
   - Generar el reporte estructurado en artifacts/site-review/report.json.
   - Generar el paquete comprimido en artifacts/site-review/site-review.zip.
   - Mantener esta fase como una revisión posterior a la migración, sin ejecutar capturas ni instalaciones en este momento.

## 9. Estado de la fase 1 ejecutada en esta sesión

- Se inicializó Astro con TypeScript en el repositorio actual.
- Se conservaron los archivos HTML existentes y se mantuvo la web publicada actual como referencia paralela.
- Se instalaron las dependencias mínimas de Astro y @astrojs/sitemap.
- Se configuró la salida estática y la URL de GitHub Pages.
- Se creó la infraestructura visual compartida para la primera ola de migración.
- Se incorporó navegación principal, submenú de Conocimiento, skip link, foco visible y layouts base.
- Se validó que la build de Astro puede ejecutarse correctamente en el entorno actual.

## 10. Componentes creados en esta sesión

- Layout base: BaseLayout.astro.
- Layout de contenido: ContentLayout.astro.
- Encabezado y navegación principal: Header.astro.
- Pie de página: Footer.astro.
- Migas de pan: Breadcrumbs.astro.
- Skip link: SkipLink.astro.
- Estilos globales compartidos: src/styles/global.css.

## 11. Decisiones visuales adoptadas

- Identidad editorial CAMS con una propuesta visual contemporánea y no institucional.
- Uso de rojo CAMS para tesis y decisión, azul para evidencia y análisis, dorado para autoría y archivo, verde sobrio para participación y resultados.
- Fondos neutros cálidos para lectura y jerarquía editorial.
- Enfoque en una estructura de lectura clara, con ancho de contenido controlado y sin depender de tarjetas como contenedor universal.

## 12. Decisiones responsive adoptadas

- Menú de escritorio claro y menú móvil accesible, con botón de activación visible en pantallas pequeñas.
- Navegación operable por teclado, con cierre por Escape y cierre al seleccionar enlaces.
- Diseño sin desplazamiento horizontal y con adaptación fluida para pantallas pequeñas y zoom alto.
- Estructura responsive basada en contenido y espacio disponible, no solo en breakpoints genéricos.

## 13. Pruebas realizadas

- Verificación de existencia de src/pages/index.astro, src/env.d.ts y .github/workflows/deploy-pages.yml.
- Verificación de que node_modules/, dist/ y .astro/ están ignorados por Git.
- Verificación de la configuración de Astro y TypeScript base.
- Ejecución de la build de Astro para confirmar que la infraestructura compartida compila.
- Revisión manual de navegación, foco visible y estructura de lectura en los layouts base.

## 14. Elementos pendientes

- Migrar contenido real de portada, CAMS, Estado que Cumple, propuestas, documentos, investigaciones, bitácora, observatorio y participación.
- Reemplazar los textos de ejemplo por contenido editorial definitivo.
- Completar la migración de interacciones específicas como buscador, biblioteca documental y árbol de problema.
- Preparar la revisión visual y de accesibilidad en rutas completas una vez el contenido se haya migrado.

## 10. Pruebas obligatorias antes de considerar la migración completa

- Ejecutar la build de Astro y verificar que no haya errores de compilación.
- Verificar que todas las rutas públicas actuales respondan correctamente.
- Verificar que el PDF, el manifest y los recursos estáticos sigan disponibles.
- Verificar que el sitemap y las URLs canónicas sean consistentes.
- Probar la navegación completa con teclado y con foco visible.
- Verificar que los menús, el buscador y los filtros funcionen sin JavaScript o con JavaScript degradado.
- Ejecutar las auditorías de Python existentes como referencia de regresión.
- Probar responsive en móvil y con zoom alto.
- Comparar que el contenido esencial siga disponible tras la migración.

## 11. Decisiones que no pueden inventarse

Estas decisiones son límites de la migración y deben respetarse:

- No inventar nuevos canales de participación si no existen aún como infraestructura real.
- No afirmar que la propuesta fue adoptada oficialmente ni cambiar el lenguaje de no oficialidad.
- No publicar datos sensibles ni información de terceros sin fuente y contexto claros.
- No crear un backend o un sistema de datos nuevo sin necesidad demostrada.
- No reemplazar la identidad editorial de CAMS por una identidad institucional genérica.
- No cambiar las rutas públicas principales sin plan explícito de compatibilidad.
- No convertir el observatorio en un tablero falso con datos no verificados.
- No introducir afirmaciones de cumplimiento o resultados que no estén documentados en el sitio actual.

## Recomendación inicial

La primera fase recomendable es la infraestructura Astro con despliegue estático en GitHub Pages, manteniendo el sitio actual paralelo y sin eliminar los archivos HTML existentes. Esa fase permite introducir el motor nuevo sin romper la web pública ni perder la trazabilidad del contenido actual.

## Fase 2.5 — Estabilización y seguridad de la migración

Fecha de validación: 20 de julio de 2026.

### Seguridad de publicación

- No existe ningún `.yml` o `.yaml` activo dentro de `.github/workflows/`; el directorio está vacío.
- El workflow permanece en `.github/disabled/deploy-pages.yml.disabled`, fuera del directorio reconocido por GitHub Actions y con extensión `.disabled`.
- No se modificaron Settings de GitHub Pages, no se activó ningún despliegue y no se hizo commit ni push.
- Los HTML, CSS, JavaScript, JSON, imágenes y PDF heredados permanecen intactos en sus ubicaciones originales.
- `dist/` está ignorado y solo representa una compilación local; no contiene todavía el sitio público completo.

### Riesgos detectados

- La portada Astro temporal podía confundirse con una portada terminada y afirmaba que el build estaba pendiente pese a estar verificado.
- La portada producía breadcrumbs duplicados (`Inicio / Inicio`).
- Conocimiento era solo un botón y no funcionaba como enlace de escritorio.
- Conocimiento no reconocía las rutas heredadas `/documentos/`, `/bitacora/`, `/observatorio/` y `/archivo/` como parte de su estado activo.
- Escape cerraba menús, pero no devolvía el foco al activador correcto.
- `public/` está vacío: la build no incluye recursos heredados, PDF, favicon, manifest ni robots.
- La navegación base enlaza rutas aún no generadas; publicar `dist/` rompería la mayor parte del sitio.
- `npm install` informó 2 vulnerabilidades en el árbol de dependencias (1 baja y 1 alta). No se ejecutó `npm audit fix --force` por su riesgo de cambios incompatibles; queda pendiente una revisión específica.
- La comprobación conserva un hint por el fallback heredado `document.execCommand('copy')`; no es un error de compilación y corresponde a una herramienta aún no migrada.

### Correcciones realizadas

- Breadcrumbs normalizados: Inicio aparece una sola vez y el último elemento usa `aria-current="page"`.
- Conocimiento conserva un enlace navegable y un botón explícito para abrir sus secciones.
- Estado activo añadido a Conocimiento, sus subrutas nuevas y alias heredados mediante `aria-current`.
- `aria-expanded` y `aria-controls` permanecen sincronizados en navegación principal y submenú.
- Escape cierra la navegación y devuelve el foco al activador correcto; la operación no depende de hover.
- Navegación móvil adaptada al grupo enlace/botón.
- Protección adicional frente a desbordamiento horizontal y palabras largas.
- La portada muestra “Infraestructura Astro en migración. Esta no es la portada pública final.” y ya no afirma que el build esté pendiente.
- El canonical base conserva la barra final de las rutas de directorio.
- `.gitignore` quedó sin BOM ni duplicados, ignora dependencias, salidas, caché de Astro, temporales y `artifacts/`, y no excluye fuentes, configuración, `public/`, `.github/` ni documentación.
- Se instalaron `@astrojs/check` y `typescript` como `devDependencies` y se actualizó el lockfile.

### Estado real de `dist/`

- Generadas: `/` y `/sitemap-index.xml`.
- Ausentes: las otras 14 páginas obligatorias de la matriz.
- Ausentes: favicon, imagen Open Graph, branding, PDF, manifest y robots.
- La portada temporal contiene enlaces a 10 rutas todavía no generadas.
- `node tools/audit_dist.mjs`: `31 ERROR`, `0 WARNING`; el fallo es esperado y se conserva visible porque la migración está incompleta.

### Rutas que todavía faltan

- `/cams/`
- `/estado-que-cumple/`
- `/documentos/`
- `/observatorio/`
- `/bitacora/`
- `/participar/`
- `/archivo/`
- `/propuestas/`
- `/conocimiento/`
- `/conocimiento/investigaciones/`
- `/conocimiento/documentos/`
- `/conocimiento/bitacora/`
- `/conocimiento/observatorio/`
- `/conocimiento/archivo/`

Las subrutas futuras del micrositio Estado que Cumple también siguen pendientes, reservadas para su fase específica.

### Resultados de validación

- `npm.cmd run check`: PASS, 0 errores, 0 warnings y 1 hint heredado por API de copia deprecada.
- `npm.cmd run build`: PASS, 1 página generada y sitemap creado.
- `node tools/audit_dist.mjs`: ERROR esperado, 31 errores y 0 advertencias.
- `git diff --check`: PASS, sin errores de espacios en blanco.

### Documentos de control creados

- `docs/CAMS_V7_MATRIZ_RUTAS.md`: rutas actuales, futuras, recursos, scripts, datos, canonical, prioridad, riesgos y pruebas.
- `tools/audit_dist.mjs`: auditoría de páginas, recursos obligatorios y enlaces internos de la salida Astro.

## Fase 2.6 — Recursos públicos, metadatos y autosuficiencia de dist

### Recursos incorporados selectivamente

- Favicon SVG e imagen Open Graph.
- Logo, sello y emblema CAMS originales, sin compresión ni conversión.
- PDF Estado que Cumple 2026–2030.
- `site.webmanifest` y `robots.txt`; la copia pública de robots referencia el `sitemap-index.xml` generado por Astro.
- Los cinco JSON actuales en `public/assets/data/` como duplicación transitoria y documentada para los `fetch` de las herramientas.
- Todos los originales de la raíz permanecen intactos.

### Recursos deliberadamente no incorporados

- `styles.css`, `script.js`, `assets/css/` y `assets/js/`: la portada Astro no los consume y su copia completa duplicaría la infraestructura heredada.
- `sitemap.xml`: no se copia para evitar conflicto con `@astrojs/sitemap`, que genera el sitemap final.
- El resto de `assets/`: se mantiene fuera de `public/` hasta que una página migrada demuestre que lo necesita.

### Estrategia de datos

Los JSON de árbol del problema, arquitectura, estado del arte, documentos y rutas de activación se mantienen temporalmente tanto en `assets/data/` como en `public/assets/data/`. Los originales sirven a la web HTML vigente y son la fuente de verdad; las copias públicas permiten los `fetch` dentro de `dist/`. Cada conjunto deberá migrarse posteriormente a `src/data/` o colecciones tipadas y eliminar su duplicación cuando las herramientas correspondientes dejen de depender del archivo público.

### Metadatos implementados

- Se creó `SeoHead.astro` con título, descripción, canonical, imagen, tipo, robots, locale y autor configurables.
- `BaseLayout.astro` incorpora favicon, manifest, theme-color, canonical HTTPS, Open Graph, Twitter Card, `og:locale`, autor, robots e imagen social predeterminada.
- No se añadió JSON-LD de Person ni CreativeWork.
- El manifest conserva únicamente el favicon SVG real. Los tamaños raster siguen pendientes y no se declararon archivos inexistentes.

### Optimización y decisiones pendientes

- Tamaños: logo 379.540 bytes; sello 890.250 bytes; emblema 855.167 bytes; OG 38.291 bytes; PDF 5.057.879 bytes.
- No se aplicó compresión con pérdida ni conversión. Se recomienda evaluar WebP/AVIF en una fase posterior, comparando calidad y manteniendo los PNG como respaldo.
- Falta confirmar si `og-cams-v3.png` será la imagen social definitiva y producir iconos raster reales solo si se necesitan para instalación.
- La build continúa no publicable mientras falten páginas obligatorias; el workflow permanece desactivado y no se realizó commit ni push.

### Validación de la Fase 2.6

- `npm.cmd run check`: PASS, 0 errores, 0 warnings y 1 hint heredado por `document.execCommand`.
- `npm.cmd run build`: PASS, 1 página generada; todos los recursos públicos selectivos y `sitemap-index.xml` quedaron en `dist/`.
- `node tools/audit_dist.mjs`: 24 errores, frente a 31 en la Fase 2.5. Los 7 errores de recursos faltantes quedaron corregidos; los restantes corresponden exclusivamente a 14 páginas obligatorias ausentes y 10 enlaces hacia rutas todavía no generadas.
- Verificaciones nuevas en PASS: archivos no vacíos, PDF de tamaño razonable, icono del manifest existente, imagen Open Graph presente, robots sin bloqueo global, canonical HTTPS y metadatos esenciales en `dist/index.html`.

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
- Se creó una página mínima de prueba para verificar la compilación.
- Se creó el workflow de GitHub Actions para Pages sin activar aún el despliegue.
- La build completó correctamente con npm run build.

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

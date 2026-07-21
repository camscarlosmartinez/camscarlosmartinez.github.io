# PROMPT MAESTRO PARA CODEX — TRANSFORMACIÓN TOTAL DE CAMS A ASTRO

Trabaje directamente sobre el repositorio abierto en VS Code, en la rama `transformacion-astro-total`.

## Mandato

Implemente la transformación completa del sitio CAMS a Astro. No entregue solo un diagnóstico, una maqueta, una portada provisional ni una lista de recomendaciones. Edite los archivos, migre todas las páginas, reorganice el contenido, preserve las funciones útiles, elimine duplicaciones, compile el sitio y deje el repositorio listo para publicación en GitHub Pages.

No se detenga a solicitar aprobación entre fases. Continúe hasta completar todas las tareas y ejecutar la auditoría final. No haga `git commit`, `git merge` ni `git push`; esos pasos los realizará el usuario después de revisar el resultado final.

## Fuentes obligatorias

Antes de editar:

1. Lea completamente `docs/CAMS_reestructuracion_detallada_arquitectura_v8.md`.
2. Inspeccione todos los HTML actuales:
   - `index.html`
   - `cams/index.html`
   - `estado-que-cumple/index.html`
   - `documentos/index.html`
   - `observatorio/index.html`
   - `bitacora/index.html`
   - `participar/index.html`
   - `archivo/index.html`
3. Inspeccione el sistema visual actual:
   - `styles.css`
   - todos los CSS dentro de `assets/css/`, si existen;
   - `script.js`;
   - módulos JavaScript existentes;
   - JSON de datos;
   - componentes y layouts de `src/`;
   - documentación de `docs/`;
   - herramientas de auditoría de `tools/`.
4. Use el PDF `public/assets/documentos/estado-que-cumple-2026-2030.pdf` y sus datos existentes como fuente para las páginas de Estado que Cumple.
5. Use únicamente información real contenida en el repositorio o en el documento de arquitectura. No invente publicaciones, investigaciones terminadas, cifras, fechas, afiliaciones, cargos, resultados, fuentes, bases de datos ni canales activos.

## Jerarquía conceptual obligatoria

La arquitectura editorial debe distinguir con claridad:

1. Carlos Arturo Martínez Sánchez: persona, autor y responsable.
2. CAMS: identidad pública personal, método editorial y archivo; no es una organización, entidad estatal ni partido.
3. Estado que Cumple: propuesta ciudadana, técnica y programática principal de CAMS; no es una política oficial adoptada.
4. Propuestas: catálogo de iniciativas públicas.
5. Conocimiento: investigaciones, documentos, Bitácora, Observatorio y Archivo.
6. Participación: correcciones, fuentes, comentarios y colaboración.

No presente CAMS y Estado que Cumple como sinónimos.

## Objetivo técnico

Consolide un único sitio Astro estático, accesible, responsive y desplegable en GitHub Pages.

- Actualice Astro y sus integraciones a versiones compatibles actuales.
- Mantenga `output: "static"`.
- Mantenga `site: "https://camscarlosmartinez.github.io"`.
- Use TypeScript estricto.
- No introduzca React, Vue, Svelte, Tailwind ni un CMS.
- Use componentes `.astro`, TypeScript, SVG y JavaScript nativo.
- Mantenga el sitio rápido y con JavaScript solo donde haya interacción real.
- Utilice colecciones de contenido o datos tipados cuando reduzcan duplicación.
- Genere un solo sistema de estilos dentro de `src/styles/`.
- Genere un solo sistema de scripts dentro de `src/scripts/` o scripts de componentes.
- Mantenga una sola copia de cada imagen, PDF, JSON público, manifiesto y archivo de robots.

## Navegación pública final

La navegación principal debe ser:

- Inicio
- CAMS
- Estado que Cumple
- Propuestas
- Conocimiento
- Participar
- Buscar como control independiente

El submenú Conocimiento debe enlazar a rutas superiores reales:

- `/investigaciones/`
- `/documentos/`
- `/bitacora/`
- `/observatorio/`
- `/archivo/`

No use rutas duplicadas como `/conocimiento/documentos/`. `/conocimiento/` debe ser solamente el centro orientador.

## Rutas que deben existir al finalizar

### Generales

- `/`
- `/cams/`
- `/cams/trayectoria/`
- `/cams/metodo/`
- `/cams/criterios-y-transparencia/`
- `/propuestas/`
- `/conocimiento/`
- `/investigaciones/`
- `/documentos/`
- `/documentos/estado-que-cumple-2026-2030/`
- `/bitacora/`
- `/observatorio/`
- `/archivo/`
- `/participar/`
- `/participar/correcciones/`
- `/participar/aportar-fuente/`
- `/participar/colaborar/`
- `/buscar/`
- `/accesibilidad/`
- `/privacidad-y-datos/`
- una página 404 personalizada.

### Estado que Cumple

- `/estado-que-cumple/`
- `/estado-que-cumple/problema/`
- `/estado-que-cumple/fundamentos/`
- `/estado-que-cumple/metodo/`
- `/estado-que-cumple/arquitectura/`
- `/estado-que-cumple/activacion/`
- `/estado-que-cumple/implementacion/`
- `/estado-que-cumple/aplicaciones/`
- `/estado-que-cumple/documento/`

Todas deben aparecer en `dist/` después del build.

## Sistema de diseño

Preserve y refine la identidad CAMS existente:

- tono institucional, formal, técnico y editorial;
- azul profundo, rojo CAMS y acentos sobrios;
- tipografía clara;
- composición amplia;
- buena jerarquía;
- uso moderado de tarjetas;
- evitar apariencia genérica de SaaS;
- evitar saturación de badges;
- evitar textos solapados;
- evitar bloques decorativos que repitan el menú;
- foco visible;
- navegación por teclado;
- reducción de movimiento;
- contraste suficiente;
- diseño móvil completo.

No rediseñe desde cero con una estética diferente. Migre el mejor sistema visual del HTML actual y conviértalo en componentes reutilizables.

## Componentes globales mínimos

Cree o consolide:

- `BaseLayout`
- `ContentLayout`
- `SeoHead`
- `Header`
- `Footer`
- `Breadcrumbs`
- `SkipLink`
- `CommandPalette` o buscador global
- `PageHero`
- `SectionNavigation`
- `StatusBadge`
- `VersionNotice`
- `DocumentCard`
- `RelatedContent`
- `Callout`
- `EmptyState` solo donde sea estrictamente necesario
- `ContextNavigation`

No duplique encabezado, pie, metadatos o avisos en páginas individuales.

## Portada final

Reemplace la portada provisional de Astro. La portada final debe tener:

1. Hero:
   - sobrelínea: `Carlos Arturo Martínez Sánchez · CAMS`;
   - título: `Propuestas y conocimiento para que el Estado cumpla`;
   - explicación breve sobre investigación pública, diseño institucional, seguimiento y participación;
   - CTA primario a Estado que Cumple;
   - CTA secundario a CAMS.

2. Proyecto insignia:
   - problema;
   - tesis;
   - secuencia resumida;
   - estado editorial;
   - enlaces al micrositio y al documento.

3. Trabajo reciente:
   - máximo tres piezas reales;
   - no mostrar proyectos ficticios ni artículos inexistentes;
   - si solamente existe un documento publicado, mostrar uno y no rellenar artificialmente.

4. Agenda:
   - capacidad estatal;
   - administración y territorio;
   - participación y juventud;
   - infraestructura y políticas públicas.

5. Método CAMS:
   - investigar;
   - diagnosticar;
   - formular;
   - contrastar;
   - publicar;
   - corregir y versionar.

6. Perfil breve de Carlos.

7. Participación real:
   - corregir error;
   - aportar fuente;
   - comentar o colaborar.

Retire de la portada:

- selector de siete perfiles;
- mapa orbital que repite el menú;
- herramientas interactivas exclusivas de Estado que Cumple;
- proyectos vacíos;
- cuatro CTA simultáneos;
- repetición extensa de autoría y descargos.

## Página CAMS

Debe presentar a Carlos y el proyecto personal:

- identificación pública;
- biografía breve y verificable;
- relación Carlos → CAMS → proyectos y conocimiento;
- trayectoria;
- agenda pública;
- capacidades;
- método CAMS;
- portafolio real;
- canales;
- independencia y criterios.

Use solo hechos presentes en el repositorio o el plan. Como base segura puede usar:

- Carlos Arturo Martínez Sánchez;
- estudiante de Administración Pública en la ESAP;
- trabajo en capacidad estatal, diseño institucional, territorio, participación y políticas públicas;
- CAMS como identidad pública personal y archivo independiente.

No invente títulos, cargos o afiliaciones.

## Subpáginas CAMS

### Trayectoria
Línea de tiempo y experiencia verificable. Si un dato no está sustentado en el repositorio, omítalo.

### Método
Explique el flujo:

`problema → fuentes → marco de análisis → competencias → alternativas → propuesta → revisión pública → versión`

Puede reutilizar aquí una versión útil del antiguo mapa CAMS, pero no como sustituto de la navegación.

### Criterios y transparencia
Incluya:

- independencia;
- diferencia entre opinión, propuesta, investigación y dato;
- fuentes y correcciones;
- control de versiones;
- uso responsable de herramientas digitales e inteligencia artificial;
- conflictos de interés;
- privacidad;
- licencias;
- límites del sitio.

No afirme que existe una política de datos o licencia que no haya sido definida; redacte condiciones prudentes y verificables.

## Estado que Cumple

La portada del micrositio debe resumir la propuesta y enlazar capítulos, no concentrar todo.

Debe mostrar:

- condición de propuesta ciudadana, técnica y programática no oficial;
- problema central;
- tesis;
- secuencia completa;
- arquitectura resumida;
- herramientas;
- rutas de activación;
- implementación;
- aplicaciones;
- documento;
- participación y correcciones.

La secuencia completa es:

`problema delimitado → RAÍCES → SAVIA → SEMILLAS cuando corresponda → expediente técnico → instrumento competente → implementación → tablero → evaluación → ajuste, escala, absorción, cierre o archivo`

### Problema
Mueva y mejore aquí el árbol interactivo, causas, problema, efectos, tipologías, preguntas diagnósticas y fuentes disponibles.

### Fundamentos
Reúna capacidad estatal, poder infraestructural, forma-función, aprendizaje adaptativo, burocracia profesional, memoria institucional, fundamentos jurídicos y estado del arte. No presente comparaciones internacionales sin señalar sus límites y las fuentes que sí existan. Cuando falte una fuente visible, identifique el contenido como síntesis del documento y no como base empírica autónoma.

### Método
Explique RAÍCES, SAVIA, SEMILLAS, expediente técnico, teoría de cambio y decisiones posibles. Conserve las mejores interacciones actuales.

### Arquitectura
Presente:

- Sistema Administrativo Nacional propuesto;
- Comisión Intersectorial;
- Secretaría Técnica DAFP–DNP;
- Ventanilla Técnica Integrada;
- herramientas;
- expediente;
- instrumentos;
- tablero y evaluación.

Diferencie propuesta, competencia vigente, reserva de ley y uso de estructuras existentes. Evite presentar la arquitectura como ya adoptada.

### Activación
Integre Ejecutivo, Congreso, sociedad civil y territorios. Mueva aquí el simulador de ruta. Aclare que el resultado es pedagógico, condicionado y no constituye concepto jurídico.

### Implementación
Desarrolle transición, recursos, talento, contratación, datos, interoperabilidad, archivo, territorio, control, indicadores, evaluación, riesgos y salvaguardas. Sustituya promesas de gobierno por rutas posibles de adopción.

### Aplicaciones
No cree tarjetas vacías. Si el repositorio no contiene fichas técnicas suficientes, explique el estándar mínimo de una aplicación y presente solamente las aplicaciones con sustento real.

### Documento
Incluya PDF, resumen, autoría, versión, fecha disponible, citación, historial, licencia o condición de reutilización, anexos y correcciones. No invente número de páginas, tamaño o checksum: calcúlelos desde el archivo cuando sea posible.

## Propuestas

Cree un catálogo real. Inicialmente puede contener solamente Estado que Cumple. Explique los criterios para incorporar futuras propuestas. No convierta líneas de interés en propuestas terminadas.

Estados únicos permitidos:

- idea registrada;
- investigación;
- borrador;
- propuesta pública;
- piloto;
- archivada.

Cada propuesta debe tener un solo estado principal y fecha de actualización real.

## Conocimiento

Debe orientar al visitante y diferenciar:

- investigaciones;
- documentos;
- Bitácora;
- Observatorio;
- Archivo.

No repita catálogos completos.

## Investigaciones

No publique investigaciones ficticias. Si no hay un archivo sustantivo listo en el repositorio, cree una página editorial honesta que explique el estándar de publicación y no muestre fichas falsas. No use fechas, resultados o tiempos de lectura inventados.

## Documentos

- Muestre por defecto solo documentos publicados.
- Cree página individual para Estado que Cumple.
- Use datos reales del PDF.
- Elimine de la biblioteca tarjetas de documentos meramente planeados.
- Incluya descarga, resumen, versión, fecha, autoría, citación, historial y contenidos relacionados.

## Bitácora

- Elimine entradas ficticias con fecha y tiempo de lectura.
- No muestre artículos hasta que exista su contenido.
- Conserve una sección breve de agenda editorial sin hacerla pasar por publicación.
- Deje preparada una colección de contenido para artículos futuros.
- No genere RSS vacío; créelo solamente si existen entradas publicadas.

## Observatorio

Preséntelo como:

`Observatorio de capacidad pública · fase de diseño`

Reduzca la repetición de “no hay datos”. Organice:

- estado;
- alcance;
- primera línea priorizada;
- fuentes;
- metodología;
- diccionario de indicadores;
- datos;
- visualización;
- limitaciones;
- versiones.

No fabrique datos, series ni tableros.

## Participar

Organice acciones reales:

- corregir un error;
- aportar una fuente;
- comentar una propuesta;
- proponer colaboración;
- seguir actualizaciones;
- compartir.

No simule formularios ni suscripciones sin backend.

Cree plantillas funcionales de GitHub Issues en `.github/ISSUE_TEMPLATE/` para:

- corrección de error;
- aporte de fuente;
- propuesta de colaboración.

Use enlaces prellenados al repositorio cuando sea apropiado. Si GitHub Discussions no está confirmado, no lo presente como canal activo.

## Archivo

Concentre:

- versiones del sitio;
- versiones documentales;
- repositorio;
- cambios;
- correcciones;
- preservación;
- licencias.

Use información real del historial Git cuando sea útil. No presente Zenodo, OSF o Internet Archive como depósitos activos si no existen.

## Búsqueda

Implemente búsqueda global accesible:

- botón visible en el encabezado;
- atajo Ctrl/Cmd + K;
- campo de búsqueda;
- resultados por título, grupo, resumen y palabras clave;
- navegación con teclado;
- cierre con Escape;
- página `/buscar/`.

Genere un índice estático a partir de páginas y colecciones. No mantenga manualmente dos listas de búsqueda.

## Interactividad existente que debe preservarse o reubicar

- progreso de lectura;
- menú móvil;
- submenú accesible;
- árbol del problema;
- mapa institucional;
- simulador de ruta;
- checklist o constructor del expediente;
- comparador del estado del arte, si conserva valor;
- navegación contextual;
- revelar contenido respetando `prefers-reduced-motion`.

Cada herramienta debe estar en la página conceptualmente correcta. No cargue todo el JavaScript en todas las páginas.

## Datos y fuentes únicas

Elimine duplicaciones entre:

- HTML y Astro;
- `assets/` y `public/assets/`;
- CSS antiguo y CSS Astro;
- `script.js` y scripts Astro;
- JSON duplicado;
- `robots.txt`;
- manifiestos;
- sitemap manual y sitemap generado.

Mantenga una sola fuente de datos. Migre los JSON a `src/data/` o a colecciones tipadas cuando sea adecuado. Para componentes interactivos, entregue esos datos desde Astro sin duplicarlos manualmente.

## Limpieza final

Cuando la migración esté completa y verificada:

- elimine `index.html` de la raíz;
- elimine las carpetas HTML antiguas de rutas que ya estén migradas;
- elimine `styles.css`;
- elimine `script.js`;
- elimine la carpeta `assets/` duplicada de la raíz;
- elimine `robots.txt`, `site.webmanifest` y `sitemap.xml` duplicados de la raíz;
- mantenga los recursos públicos en `public/`;
- mantenga documentación útil en `docs/`;
- actualice `README.md`;
- actualice o elimine herramientas de auditoría incompatibles;
- no cree una carpeta `legacy/`: Git conserva el historial.

## SEO y metadatos

Cada página debe tener:

- título único;
- descripción;
- canonical;
- Open Graph;
- imagen social;
- idioma `es-CO`;
- robots apropiado;
- breadcrumbs cuando corresponda;
- JSON-LD prudente para `Person`, `WebSite`, `CreativeWork` o `Article`, sin datos inventados.

Genere sitemap mediante Astro. Mantenga `robots.txt` correcto.

## Despliegue

Cree `.github/workflows/deploy.yml` usando la acción oficial de Astro para GitHub Pages.

El flujo debe:

- activarse en `main`;
- instalar dependencias;
- ejecutar check;
- ejecutar build;
- cargar `dist`;
- desplegar con Pages;
- usar permisos mínimos.

Actualice `README.md` con:

- requisitos;
- instalación;
- desarrollo;
- check;
- build;
- auditoría;
- despliegue;
- estructura editorial;
- cómo agregar propuestas, documentos y artículos.

## Auditoría automática

Cree o actualice scripts para que existan:

- `npm run check`
- `npm run build`
- `npm run audit`
- `npm run validate` que ejecute check, build y audit.

La auditoría debe comprobar como mínimo:

- rutas esperadas en `dist/`;
- enlaces internos rotos;
- assets inexistentes;
- identificadores duplicados;
- títulos y descripciones ausentes;
- páginas sin `lang`;
- referencias restantes a `/styles.css` o `/script.js`;
- duplicaciones públicas principales;
- enlaces `href="#"` no funcionales;
- formularios ficticios;
- rutas antiguas todavía presentes en el resultado.

## Criterios de terminación

No considere terminado el trabajo hasta que:

1. Todas las rutas obligatorias existan en `src/pages/`.
2. Todas aparezcan compiladas en `dist/`.
3. `npm run check` termine sin errores.
4. `npm run build` termine sin errores.
5. `npm run audit` termine sin errores críticos.
6. No queden páginas públicas en HTML antiguo.
7. No queden dos sistemas de diseño.
8. No queden activos duplicados.
9. No haya enlaces internos rotos.
10. La portada ya no sea la portada provisional.
11. CAMS y Estado que Cumple estén claramente diferenciados.
12. No existan publicaciones o datos ficticios.
13. El sitio sea navegable en móvil y teclado.
14. GitHub Pages tenga un workflow listo.

## Informe final que debe entregar en el chat de Codex

Al terminar, responda con:

1. resumen de la transformación;
2. árbol final de rutas;
3. archivos creados;
4. archivos eliminados;
5. decisiones editoriales importantes;
6. resultados exactos de `npm run check`, `npm run build`, `npm run audit` y `npm run validate`;
7. advertencias o contenidos que no pudieron publicarse por falta de fuente;
8. comandos exactos que el usuario debe ejecutar para revisar, confirmar, subir la rama y fusionarla con `main`.

No termine con una propuesta de trabajo futuro: complete ahora toda la transformación posible con el material existente.

# CAMS | Estado que Cumple

Plataforma pública estática de Carlos Arturo Martínez Sánchez para explicar, documentar y explorar la propuesta ciudadana **Estado que Cumple**.

La propuesta es técnica y programática; no ha sido adoptada oficialmente y no sustituye conceptos jurídicos ni competencias de las autoridades. El sitio evita presentar prototipos, indicadores propuestos o canales por conectar como servicios o datos existentes.

## Arquitectura de información

La navegación principal tiene cinco entradas:

- **Inicio**: identidad, orientación del ecosistema, experiencias, proyectos, publicaciones, participación y perfil breve.
- **Estado que Cumple**: problema, teoría, estado del arte, herramientas, arquitectura, rutas, expediente, instrumentos, riesgos, seguimiento y simuladores.
- **Explorar**: panel accesible que agrupa Documentos, Observatorio, Bitácora y Archivo sin cambiar sus rutas.
- **Participar**: comentarios, colaboración, suscripción, voluntariado y opciones para compartir.
- **CAMS**: autoría, criterios de producción, proyectos, redes verificables e independencia.

Las rutas públicas son:

```text
/
/estado-que-cumple/
/documentos/
/observatorio/
/bitacora/
/participar/
/archivo/
/cams/
```

Cada página incluye una navegación contextual breve: de dónde viene la visita, qué está explorando y cuál es el siguiente paso sugerido.

## Tecnología

El sitio usa HTML, CSS y JavaScript nativos. No requiere frameworks, npm, base de datos ni servicios externos y es compatible con GitHub Pages.

`styles.css` es el punto de entrada del sistema visual:

```text
assets/css/
├── tokens.css
├── base.css
├── layout.css
├── components.css
├── interactions.css
├── pages.css
└── responsive.css
```

`script.js` es un inicializador ES module. Carga siempre la navegación, el buscador y las utilidades compartidas, e importa dinámicamente las herramientas que existen en la página actual:

```text
assets/js/
├── menu.js
├── command-palette.js
├── utilities.js
├── interactions.js
├── home-experience.js
├── view-modes.js
├── problem-tree.js
├── proposal-core.js
├── state-of-art.js
├── institutional-map.js
├── decision-lab.js
├── expediente-builder.js
├── document-library.js
└── participation.js
```

Los datos estructurados reutilizables viven en:

```text
assets/data/
├── problem-tree.json
├── proposal-architecture.json
├── state-of-art.json
├── activation-routes.json
└── documents.json
```

El contenido esencial también permanece en HTML: si JavaScript falla, las explicaciones, alternativas textuales y enlaces principales siguen disponibles.

## Experiencias interactivas

- Selector de perfil de visita y ruta sugerida, guardado solo en `localStorage`.
- Mapa del ecosistema CAMS con selección previa a la navegación.
- Modos de lectura ciudadano, técnico y jurídico-institucional.
- Núcleo orbital RAÍCES, SAVIA, SEMILLAS y su cadena de decisión.
- Árbol técnico con filtros y recorrido diagnóstico de hasta cinco nodos.
- Explorador comparado del estado del arte y matriz entre dos experiencias.
- Mapa institucional por capas.
- Simulador pedagógico de activación normativa.
- Constructor local de expediente técnico de catorce dimensiones.
- Biblioteca documental filtrable.
- Buscador global con `Ctrl + K`, filtros y normalización de tildes.

Las preferencias y notas se guardan en el navegador. No se envía información a servidores.

## Accesibilidad y comportamiento sin JavaScript

- Un `h1` por página, `skip-link` y `main#contenido`.
- Navegación activa con `aria-current`.
- Menús con `aria-expanded`, `aria-controls`, cierre con Escape y devolución de foco.
- Selecciones con `aria-pressed`, controles etiquetados y foco visible.
- Alternativas textuales para mapas, árboles y diagramas.
- Respeto de `prefers-reduced-motion`.
- Menú y contenido principal utilizables sin JavaScript.

## Edición

1. Mantener la función exclusiva de cada página; no duplicar el bloque completo de participación ni la explicación integral de la propuesta.
2. Usar los componentes existentes antes de crear variantes nuevas.
3. Mantener los colores hexadecimales en `assets/css/tokens.css`.
4. Incorporar documentos y experiencias en sus archivos JSON y conservar una explicación HTML accesible cuando sea contenido esencial.
5. Marcar con claridad estados como publicado, prototipo, borrador o planeado.
6. No inventar datos, adopción institucional, canales habilitados ni resultados.
7. No publicar datos personales sensibles o información de terceros.

El diagnóstico previo a esta reorganización está en `docs/auditoria-experiencia-v6.md`.

## Prueba local

Desde la raíz del proyecto:

```powershell
py -m http.server 5500
```

Abrir `http://localhost:5500`.

## Auditorías

Las herramientas usan solo la biblioteca estándar de Python:

```powershell
py tools/audit_site.py
py tools/audit_css.py
py tools/audit_js.py
git diff --check
```

- `audit_site.py`: estructura HTML, accesibilidad básica, rutas, fragmentos, assets, sitemap, JSON y documentos enlazados.
- `audit_css.py`: selectores y variables duplicados, bloques vacíos, reglas posiblemente sin uso y colores fuera de tokens.
- `audit_js.py`: grafo de imports, módulos desconectados, inicializadores duplicados y referencias estáticas potencialmente inexistentes.

Los avisos son puntos de revisión humana; los errores producen un código de salida distinto de cero.

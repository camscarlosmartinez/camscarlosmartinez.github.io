# CAMS v7 — Matriz de rutas y recursos

## Criterio de sustitución

La web HTML de la raíz sigue siendo la publicación vigente. La compilación `dist/` de Astro es únicamente una salida de prueba y no puede sustituir el sitio anterior hasta que todas las filas obligatorias estén generadas, sus recursos estén en `public/`, el auditor no informe errores y el workflow continúe desactivado hasta la autorización final.

Estados: **temporal** (infraestructura, no contenido final), **pendiente** (sin página Astro), **compatibilidad pendiente** (ruta antigua que debe conservarse), **recurso pendiente** (existe en raíz pero no entra aún en `dist/`).

## Matriz exacta

| URL pública actual o futura | Archivo HTML/recurso actual | Futura página Astro | Estado | Recursos utilizados | JavaScript utilizado | JSON utilizado | Canonical | Prioridad | Riesgo | Prueba requerida |
|---|---|---|---|---|---|---|---|---|---|---|
| `/` | `index.html` | `src/pages/index.astro` | Temporal | `styles.css`, favicon, logo, sello, PDF | `script.js`; menú, buscador, portada, participación, microinteracciones | `documents.json`, `state-of-art.json` (buscador) | `https://camscarlosmartinez.github.io/` | Crítica | Sustituir portada pública por la temporal | Comparación de contenido, teclado, 320 px, enlaces y metadatos |
| `/cams/` | `cams/index.html` | `src/pages/cams/index.astro` | Pendiente | estilos, favicon, logo, sello, OG, manifest | `script.js`; menú, buscador, participación, microinteracciones | `documents.json`, `state-of-art.json` | `https://camscarlosmartinez.github.io/cams/` | Alta | Pérdida del perfil y trayectoria | Contenido, JSON-LD Person, redes, responsive |
| `/estado-que-cumple/` | `estado-que-cumple/index.html` | `src/pages/estado-que-cumple/index.astro` | Pendiente | estilos, favicon, logo, OG, manifest, PDF | `script.js`; menú, buscador, modos, árbol, núcleo, estado del arte, mapa, simulador, expediente, participación, microinteracciones | `problem-tree.json`, `proposal-architecture.json`, `state-of-art.json`, `activation-routes.json`, `documents.json` | `https://camscarlosmartinez.github.io/estado-que-cumple/` | Crítica | Pérdida del núcleo conceptual y herramientas | Contenido sin JS, herramientas, anchors, PDF, teclado |
| `/documentos/` | `documentos/index.html` | `src/pages/documentos/index.astro` | Compatibilidad pendiente | estilos, favicon, logo, OG, manifest, PDF | `script.js`; menú, buscador, biblioteca, participación, microinteracciones | `documents.json`, `state-of-art.json` | `https://camscarlosmartinez.github.io/documentos/` | Crítica | Romper URL histórica y descargas | Ruta generada, canonical, filtros, PDF, enlace a ruta nueva |
| `/observatorio/` | `observatorio/index.html` | `src/pages/observatorio/index.astro` | Compatibilidad pendiente | estilos, favicon, logo, OG, manifest | `script.js`; menú, buscador, participación, microinteracciones | `documents.json`, `state-of-art.json` | `https://camscarlosmartinez.github.io/observatorio/` | Alta | Presentar datos inexistentes o romper URL | Contenido metodológico, canonical, ausencia honesta de datos |
| `/bitacora/` | `bitacora/index.html` | `src/pages/bitacora/index.astro` | Compatibilidad pendiente | estilos, favicon, logo, OG, manifest | `script.js`; menú, buscador, participación, microinteracciones | `documents.json`, `state-of-art.json` | `https://camscarlosmartinez.github.io/bitacora/` | Alta | Romper catálogo y URLs futuras | Contenido, canonical, estados editoriales |
| `/participar/` | `participar/index.html` | `src/pages/participar/index.astro` | Pendiente | estilos, favicon, logo, OG, manifest | `script.js`; menú, buscador, participación, microinteracciones | `documents.json`, `state-of-art.json` | `https://camscarlosmartinez.github.io/participar/` | Alta | Inventar canales o perder límites | Enlaces reales, teclado, canonical, sin formulario ficticio |
| `/archivo/` | `archivo/index.html` | `src/pages/archivo/index.astro` | Compatibilidad pendiente | estilos, favicon, logo, sello, OG, manifest, PDF | `script.js`; menú, buscador, participación, microinteracciones | `documents.json`, `state-of-art.json` | `https://camscarlosmartinez.github.io/archivo/` | Alta | Romper trazabilidad pública | Repositorios, versiones, PDF, canonical |
| `/assets/documentos/estado-que-cumple-2026-2030.pdf` | `assets/documentos/estado-que-cumple-2026-2030.pdf` | `public/assets/documentos/estado-que-cumple-2026-2030.pdf` | Recurso pendiente | PDF descargable | Ninguno | Ninguno | No aplica | Crítica | Descarga ausente en `dist` | Existencia, tamaño mayor que cero y enlace desde páginas |
| `/propuestas/` | No existe | `src/pages/propuestas/index.astro` | Pendiente | Por definir con contenido real | Filtros futuros | Colección `proposals` futura | `https://camscarlosmartinez.github.io/propuestas/` | Alta | Navegación apunta a ruta inexistente | Ruta, contenido real, filtros sin JS |
| `/conocimiento/` | No existe | `src/pages/conocimiento/index.astro` | Pendiente | Por inventariar desde secciones heredadas | Buscador futuro | Colecciones futuras | `https://camscarlosmartinez.github.io/conocimiento/` | Alta | Menú principal apunta a ruta inexistente | Ruta, índice funcional, teclado |
| `/conocimiento/investigaciones/` | No existe | `src/pages/conocimiento/investigaciones/index.astro` | Pendiente | Solo fuentes confirmadas | Por definir | Colección `research` futura | `https://camscarlosmartinez.github.io/conocimiento/investigaciones/` | Media | Inventar investigaciones | Ruta, ausencia honesta o contenido verificado |
| `/conocimiento/documentos/` | `documentos/index.html` como fuente | `src/pages/conocimiento/documentos/index.astro` | Pendiente | Biblioteca, PDF y metadatos | Biblioteca y buscador | `documents.json` | `https://camscarlosmartinez.github.io/conocimiento/documentos/` | Alta | Duplicidad con `/documentos/` | Índice, canonical decidido, compatibilidad antigua |
| `/conocimiento/bitacora/` | `bitacora/index.html` como fuente | `src/pages/conocimiento/bitacora/index.astro` | Pendiente | Contenido editorial existente | Buscador | Colección `articles` futura | `https://camscarlosmartinez.github.io/conocimiento/bitacora/` | Alta | Duplicidad y pérdida de estados | Índice, canonical decidido, compatibilidad antigua |
| `/conocimiento/observatorio/` | `observatorio/index.html` como fuente | `src/pages/conocimiento/observatorio/index.astro` | Pendiente | Metodología existente | Por definir | Datos reales futuros | `https://camscarlosmartinez.github.io/conocimiento/observatorio/` | Alta | Confundir metodología con datos | Índice, canonical decidido, compatibilidad antigua |
| `/conocimiento/archivo/` | `archivo/index.html` como fuente | `src/pages/conocimiento/archivo/index.astro` | Pendiente | Repositorios, versiones, sello, PDF | Buscador | Metadatos futuros | `https://camscarlosmartinez.github.io/conocimiento/archivo/` | Alta | Duplicidad y pérdida de trazabilidad | Índice, canonical decidido, compatibilidad antigua |

Además, el micrositio futuro requerirá las subrutas `/estado-que-cumple/problema/`, `/metodo/`, `/arquitectura/`, `/implementacion/`, `/aplicaciones/` y `/documento/`; se auditarán al iniciar esa fase, no se crean en la Fase 2.5.

## Inventario para una copia posterior y selectiva a `public/`

No se ha movido ni copiado ningún recurso en esta fase.

| Clase | Origen actual | Destino futuro | Uso y condición |
|---|---|---|---|
| Branding | `assets/branding/logo-cams.png`, `emblema-cams.png`, `sello-cams.png` | `public/assets/branding/` | Copiar solo los archivos usados por páginas migradas; conservar nombres y enlaces |
| PDF | `assets/documentos/estado-que-cumple-2026-2030.pdf` | `public/assets/documentos/` | Obligatorio antes de sustituir producción; verificar descarga e integridad |
| Favicon | `assets/favicon.svg` | `public/assets/favicon.svg` | Obligatorio y referenciado desde layout base |
| Imagen Open Graph | `assets/og-cams-v3.png` | `public/assets/og-cams-v3.png` | Conservar URL absoluta actual en metadatos |
| Manifest | `site.webmanifest` | `public/site.webmanifest` | Copiar de forma explícita; validar sus rutas de iconos |
| JSON | `assets/data/*.json` | `public/assets/data/` o migración tipada a `src/data/` | Decidir archivo por archivo; mantener fetch solo para herramientas que lo necesiten |
| Herramientas interactivas | `script.js`, `assets/js/*.js`, `styles.css`, `assets/css/*.css` | Preferentemente módulos en `src/`; temporalmente `public/` solo con decisión documentada | No copiar indiscriminadamente; preservar alternativa sin JavaScript |
| Descargables | PDF actual y futuros archivos confirmados | `public/assets/documentos/` | Inventariar nombre, tamaño, página de origen y enlace público |
| Infraestructura pública | `robots.txt`, `sitemap.xml` | `public/robots.txt`; sitemap generado por Astro | Evitar dos fuentes de sitemap; comprobar URL final |

## Puerta de publicación

Astro no está listo para producción mientras exista cualquier `ERROR` de `node tools/audit_dist.mjs`. El archivo `.github/disabled/deploy-pages.yml.disabled` debe permanecer fuera de `.github/workflows/` hasta que la matriz esté completa y se autorice explícitamente la fase final.

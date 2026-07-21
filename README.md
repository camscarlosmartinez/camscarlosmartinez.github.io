# CAMS

Sitio público personal de Carlos Arturo Martínez Sánchez. Distingue la identidad CAMS, la propuesta Estado que Cumple, el catálogo de propuestas, el centro de conocimiento y los canales de participación.

## Requisitos y uso local

- Node.js 22 LTS o compatible.
- Instalar: `npm ci`
- Desarrollo: `npm run dev`
- Comprobación Astro/TypeScript: `npm run check`
- Compilación estática: `npm run build`
- Auditoría de `dist/`: `npm run audit`
- Validación completa: `npm run validate`

## Estructura editorial

- `src/pages/`: rutas públicas; Astro genera HTML estático.
- `src/layouts/` y `src/components/global/`: estructura, SEO, navegación y piezas editoriales reutilizables.
- `src/components/tools/`: interacciones cargadas únicamente en el capítulo correspondiente.
- `src/data/`: navegación e índice de búsqueda como fuentes únicas tipadas.
- `public/assets/`: imágenes, PDF y JSON públicos usados por herramientas.
- `.github/ISSUE_TEMPLATE/`: correcciones, fuentes y colaboraciones públicas.
- `tools/audit-dist.mjs`: auditoría posterior al build.

## Agregar contenido

### Propuestas

Cree una ruta o fuente tipada solo cuando exista ficha con problema, tesis, evidencia, alternativas, ruta institucional, instrumentos, condiciones, riesgos, versión, fecha y uno de estos estados: idea registrada, investigación, borrador, propuesta pública, piloto o archivada. Agregue la ruta a `src/data/site.ts`.

### Documentos

Publique el archivo una sola vez en `public/assets/documentos/`, cree una ficha en `src/pages/documentos/` e informe autoría, resumen, versión, fecha, tamaño, extensión, citación, historial, licencia y huella cuando proceda.

### Artículos

No anuncie una entrada como publicada hasta que exista el texto completo, fuentes y metadatos. Cuando haya al menos una entrada real puede crearse una colección de contenido y RSS; el sitio no genera un feed vacío.

## Despliegue

`astro.config.mjs` usa salida estática, sitio canónico `https://camscarlosmartinez.github.io` y sitemap. `.github/workflows/deploy.yml` ejecuta comprobación, compila con la acción oficial de Astro y despliega GitHub Pages al actualizar `main`.

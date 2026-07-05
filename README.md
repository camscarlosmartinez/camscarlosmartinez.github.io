# CAMS | Estado que Cumple

Sitio público estático de Carlos Arturo Martínez Sánchez. CAMS funciona como archivo documental, laboratorio institucional, observatorio ciudadano y espacio de participación alrededor de la propuesta `Estado que Cumple`.

## Enfoque del sitio

`Estado que Cumple` es una propuesta ciudadana, académica, técnica y programática sobre capacidad pública. No es una política oficial adoptada, no sustituye competencias constitucionales o legales y no debe presentarse como directriz vigente de ningún gobierno.

El sitio traduce el documento base a una experiencia pedagógica e interactiva: árbol del problema, tipologías de formas institucionales prematuras, núcleo RAÍCES/SAVIA/SEMILLAS, arquitectura institucional, rutas de activación, expediente técnico, riesgos, blindajes, tablero público y participación.

## Estructura

- `/` portada CAMS con hero, aclaración conceptual, núcleo interactivo, mapa del sistema, rutas y frentes activos.
- `/estado-que-cumple/` página central de la propuesta: problema público, árbol técnico, tipología, teoría de cambio, estado del arte, arquitectura, rutas, expediente, instrumentos, riesgos e indicadores.
- `/documentos/` archivo de trabajos, informes, matrices, policy papers y documentos en preparación.
- `/observatorio/` prototipo de seguimiento ciudadano conectado con Estado que Cumple, sin porcentajes ficticios ni datos simulados.
- `/bitacora/` notas breves para debate público.
- `/participar/` comentarios, suscripción por habilitar y voluntariado, sin fingir backend.
- `/archivo/` repositorios, redes públicas, enlaces y estados de publicación.

## Documento publicado

- `assets/documentos/estado-que-cumple-2026-2030.pdf`: documento técnico-político de discusión pública sobre Estado que Cumple.

## Cómo editar

El sitio usa HTML, CSS y JavaScript puro. No usa frameworks, npm ni dependencias externas.

Para editar contenido:

- Cambiar textos y secciones en los archivos `.html`.
- Cambiar estilos globales y módulos visuales en `styles.css`.
- Cambiar interacciones sobrias en `script.js`.
- Evitar enlaces falsos con `href="#"`; si algo no existe, marcarlo como `por habilitar`, `en preparación` o `por conectar`.

## Interacciones actuales

- Tabs de RAÍCES, SAVIA y SEMILLAS.
- Mapa activo de arquitectura institucional.
- Tabs de rutas de activación.
- Árbol del problema técnico con panel explicativo.
- Stepper de teoría de cambio.
- Tabs de estado del arte.
- Stepper de ruta integrada de transformación institucional.
- Inspector del Expediente Técnico Integrado.
- Filtro documental.
- Menú móvil.
- Panel flotante de participación.

Las interacciones usan HTML, CSS y JavaScript puro. Cuando JavaScript carga, los paneles aplican roles y estados accesibles (`tab`, `tabpanel`, `aria-selected`, `aria-controls`, `hidden` y navegación por teclado). Si JavaScript falla, el contenido sigue visible como HTML normal.

## Probar localmente

Desde la raíz del proyecto:

```bash
python -m http.server 5500
```

Luego abrir:

```text
http://localhost:5500
```

## Publicar con git

Antes de publicar:

```bash
git status
git diff
```

Luego:

```bash
git add .
git commit -m "mensaje"
git push
```

## Reglas editoriales

- No publicar datos personales sensibles, cédulas, teléfonos ni información de terceros.
- No inventar cifras oficiales, adopción institucional ni resultados inexistentes.
- Mantener lenguaje de propuesta ciudadana, discusión técnica, incidencia y seguimiento público.
- Todo documento público debe tener fecha, versión, resumen, palabras clave y forma de citación.
- Los módulos de participación deben aclarar si están habilitados, por conectar o en preparación.

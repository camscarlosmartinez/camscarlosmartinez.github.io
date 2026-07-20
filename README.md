# CAMS | Estado que Cumple

Sitio público estático de Carlos Arturo Martínez Sánchez. CAMS funciona como archivo documental, laboratorio institucional, observatorio ciudadano y espacio de participación alrededor de la propuesta `Estado que Cumple`.

`Estado que Cumple` es una propuesta ciudadana, técnica y programática sobre capacidad pública. No es una política oficial adoptada, no sustituye competencias constitucionales o legales y no debe presentarse como directriz vigente de ningún gobierno.

## Arquitectura actual

Todas las páginas comparten la misma base:

- `skip-link` hacia `main id="contenido"`.
- Header sticky con navegación común.
- Menú activo con `aria-current="page"`.
- Panel flotante de Contacto y PQRS.
- Footer común con Propuesta, Documentos, Participar, GitHub, Instagram, LinkedIn y Facebook.
- Carga global de `/styles.css` y `/script.js`.

El sitio usa HTML, CSS y JavaScript puro. No usa frameworks, npm ni dependencias externas, y debe seguir funcionando en GitHub Pages.

## Páginas

- `/` portada CAMS: identidad, exploración interactiva, mapa resumido, ecosistema, documentos destacados, autoría y participación.
- `/estado-que-cumple/` página central de la propuesta: modo guiado, modo completo, árbol técnico, núcleo RAÍCES/SAVIA/SEMILLAS, arquitectura, rutas, simulador, expediente, instrumentos, riesgos y tablero.
- `/documentos/` biblioteca documental con filtro local.
- `/observatorio/` prototipo de seguimiento ciudadano sin datos simulados.
- `/bitacora/` notas públicas en preparación.
- `/participar/` comentarios, suscripción futura y voluntariado, sin fingir backend.
- `/archivo/` redes, repositorios, PDF base y canales públicos.

## Componentes interactivos

- Menú móvil accesible.
- Panel flotante de Contacto y PQRS.
- Barra de progreso de lectura.
- Buscador global con `Ctrl + K`.
- Tabs accesibles de RAÍCES, SAVIA y SEMILLAS.
- Árbol del problema técnico con tipo de nodo, relación y herramienta asociada.
- Mapa institucional por capas.
- Tabs de rutas de activación.
- Tabs de estado del arte.
- Stepper de teoría de cambio.
- Stepper de ruta integrada.
- Inspector del Expediente Técnico Integrado.
- Laboratorio de decisión institucional.
- Selector de modo guiado/completo en la propuesta.

Si JavaScript falla, el contenido esencial permanece visible como HTML.

## Modo guiado y completo

La página `/estado-que-cumple/` usa `data-view-mode` en `main`:

- `guided`: muestra por capítulos el problema, la lógica de transformación, la arquitectura, la decisión y control/aprendizaje.
- `full`: muestra todo el documento técnico y el índice.

La preferencia se guarda en `localStorage`. Sin JavaScript, todas las secciones permanecen visibles.

## Buscador

El buscador global no depende de una lista manual completa. Construye su índice con:

- secciones del DOM que declaran `data-search-title`, `data-search-group`, `data-search-keywords` y, cuando aplica, `data-search-url`;
- una lista pequeña de páginas globales;
- documentos declarados en la biblioteca.

La búsqueda normaliza tildes, así que `raices` y `raíces` apuntan a los mismos resultados. Se muestran máximo diez resultados.

## Simulador

El laboratorio de decisión es pedagógico. No emite conceptos jurídicos, fiscales, laborales ni administrativos.

El resultado muestra:

- diagnóstico recomendado;
- herramientas sugeridas;
- actor competente;
- instrumento posible;
- condiciones pendientes;
- advertencias;
- siguiente paso.

## Auditoría automática

`tools/audit_site.py` usa solo biblioteca estándar de Python y revisa:

- enlaces internos a archivos o fragmentos inexistentes;
- imágenes sin `alt`;
- IDs duplicados por página;
- `href="#"`;
- exactamente un `h1` por página;
- skip-link;
- `main id="contenido"`;
- navegación activa con `aria-current="page"`;
- assets inexistentes;
- formularios sin acción real;
- carga de `/styles.css` y `/script.js`.

La auditoría imprime `PASS`, `WARNING` y `ERROR`, y termina con código distinto de cero si hay errores.

## Flujo de edición

1. Editar contenido en los archivos `.html`.
2. Mantener componentes visuales en `styles.css` según el orden de secciones del archivo.
3. Mantener interacciones en `script.js` mediante inicializadores seguros.
4. Evitar enlaces falsos con `href="#"`.
5. Marcar lo no habilitado como `por habilitar`, `en preparación` o `por conectar`.
6. Ejecutar auditoría y revisar diffs antes de publicar.

## Prueba local

Desde la raíz del proyecto:

```bash
py -m http.server 5500
```

Abrir:

```text
http://localhost:5500
```

## Comandos útiles

```bash
py -m http.server 5500
py tools/audit_site.py
git status
git diff --check
git diff --stat
```

## Reglas editoriales

- No publicar datos personales sensibles, cédulas, teléfonos ni información de terceros.
- No inventar cifras oficiales, adopción institucional ni resultados inexistentes.
- Mantener lenguaje de propuesta ciudadana, discusión técnica, incidencia y seguimiento público.
- Todo documento público debe tener fecha, versión, resumen, palabras clave y forma de citación.
- Los módulos de participación deben aclarar si están habilitados, por conectar o en preparación.

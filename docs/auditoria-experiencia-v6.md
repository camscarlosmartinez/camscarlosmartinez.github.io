# Auditoría de experiencia v6

Fecha de corte: 20 de julio de 2026  
Alcance revisado antes de editar: los siete HTML existentes, `styles.css`, `script.js`, `README.md`, `tools/audit_site.py`, `sitemap.xml`, `robots.txt`, `site.webmanifest` y el inventario completo de assets.

## Resumen ejecutivo

El sitio tiene una base editorial honesta y varios contenidos valiosos, pero se percibe como la suma de versiones sucesivas. La propuesta Estado que Cumple sí tiene sustancia e identidad; la interfaz la fragmenta entre rejillas, pestañas, steppers y enlaces que repiten la misma tesis. Las demás páginas se distinguen por el título, pero comparten casi la misma plantilla, el mismo panel flotante, el mismo pie social y llamados redundantes al PDF o a Participar.

La reorganización debe convertir el sitio en un sistema con tres niveles claros:

1. CAMS explica quién produce el archivo y con qué criterios.
2. Estado que Cumple es el núcleo conceptual y operativo.
3. Documentos, Observatorio, Bitácora y Archivo son superficies especializadas reunidas bajo Explorar; Participar es el único lugar con la experiencia completa de colaboración.

La auditoría automática vigente da `PASS` en siete páginas, pero ese resultado solo cubre estructura HTML básica y rutas locales. No cubre sitemap, relaciones ARIA, labels, JSON, imports, selectores CSS ni módulos JavaScript.

## 1. Función actual de cada página

| Página | Función actual | Diagnóstico |
|---|---|---|
| `/` | Portada, directorio del ecosistema, resumen de la propuesta, documentos, autoría y participación | Orienta, pero repite el mapa del sitio como navegación, toolkit, cadena, rejilla de seis módulos, pie y panel flotante. |
| `/estado-que-cumple/` | Documento técnico de 19 secciones con árbol, núcleo, teoría, estado del arte, arquitectura, rutas, simulador, expediente, instrumentos, riesgos y tablero | Es la página con identidad más fuerte, pero acumula widgets consecutivos y explica varias veces los mismos componentes. |
| `/documentos/` | Biblioteca inicial con búsqueda y filtro local | Tiene un documento real y tres anuncios. Su función es correcta, pero le faltan filtros por estado, versiones y palabras clave alimentados por datos mantenibles. |
| `/observatorio/` | Prototipo conceptual de seguimiento | Es transparente al no inventar cifras, pero hoy explica más de lo que observa: faltan fuentes, métodos, indicadores propuestos y estados de construcción. |
| `/bitacora/` | Catálogo de cuatro textos en preparación | Aún no funciona como publicación editorial: las categorías son estáticas, `time` se usa como categoría y faltan fecha, serie, lectura estimada y estado editorial estructurado. |
| `/participar/` | Comentarios, suscripción futura y voluntariado | Es la ubicación correcta, pero predomina la reiteración de “por habilitar”. Debe separar acciones disponibles de canales planeados y no aparentar un backend. |
| `/archivo/` | Repositorios, PDF, redes y preservación futura | Mezcla trazabilidad con contacto, comentarios y voluntariado, que pertenecen a Participar. |
| `/cams/` | No existe | La ausencia impide explicar autoría, independencia, criterios de publicación y relación entre CAMS y Estado que Cumple. |

## 2. Contenidos repetidos entre páginas

- Header, navegación de siete entradas, textura `paper-noise`, panel flotante, botón circular y footer están copiados en los siete HTML.
- El PDF de Estado que Cumple aparece enlazado 13 veces. En Inicio aparece tres veces y en Estado que Cumple otras tres.
- Los destinos de comentarios, suscripción, voluntariado y redes se repiten en casi todas las páginas por el panel flotante, aunque Participar ya concentra esa función.
- Inicio repite los destinos principales en la navegación, tres experiencias, cadena de ocho pasos, seis tarjetas de ecosistema y footer.
- En Estado que Cumple, RAÍCES, SAVIA y SEMILLAS se explican en el núcleo, la teoría de cambio, la arquitectura y la ruta integrada.
- Teoría de cambio y ruta integrada presentan dos secuencias de nueve pasos casi equivalentes.
- Expediente, instrumento competente, riesgos y tablero aparecen como nodos de arquitectura, salidas del simulador, pasos de ruta y secciones completas.

## 3. Secciones en la página equivocada

- Los anuncios de trabajos académicos, matrices e investigaciones de Inicio pertenecen a la biblioteca o a una mesa de proyectos.
- La pauta extensa sobre eliminar datos sensibles en Documentos debe ser una ayuda compacta y una regla de mantenimiento, no un bloque protagonista.
- La explicación completa de la arquitectura en Observatorio debe reducirse a una referencia; allí deben dominar metodología, fuentes e indicadores futuros.
- El acceso a comentarios y voluntariado dentro de Archivo debe moverse a Participar.
- “Bitácora de cambios” dentro de Participar confunde publicación editorial con trazabilidad; el historial de versiones pertenece a Archivo.
- Las redes personales pueden aparecer confirmadas en CAMS y registradas en Archivo, pero no repetirse como bloque en todos los pies.
- La tipología de formas prematuras debe integrarse al diagnóstico del árbol; metodologías y checklist deben integrarse al constructor de expediente.

## 4. Botones y tarjetas que cumplen la misma función

- Los CTA “Explorar propuesta”, “Propuesta” y “Estado que Cumple” conducen al mismo destino desde múltiples componentes.
- “Abrir PDF”, “Abrir documento PDF” y “PDF base” son la misma acción con distinto rótulo.
- El botón flotante “Contacto y PQRS”, el CTA de participación de Inicio y los enlaces de footer abren la misma familia de destinos.
- Las tres fichas RAÍCES/SAVIA/SEMILLAS de la cadena de Inicio apuntan al mismo anchor, sin abrir el nodo específico.
- `ecosystem-card`, `doc-tile`, tarjetas de toolkit, dashboard, matrix, instrument, risk, indicator, foundation, method y participation comparten en la práctica la misma caja: borde, fondo crema, radio de 8 px y jerarquía de etiqueta/título/texto.
- Los estados “En preparación”, “Por publicar”, “Por conectar”, “Pendiente” y “Próximamente” usan componentes visuales similares sin una taxonomía única.

## 5. Partes añadidas por acumulación de versiones

- La combinación de clases `proposal-hero proposal-hero-v2` deja visible una variante anterior sin reglas propias.
- El selector `guided/full` es una capa previa que organiza longitud, no perspectivas de lectura; resulta incompatible con ciudadano/técnico/jurídico-institucional.
- El índice técnico de 16 enlaces y el selector “Ir a sección” duplican destinos. Son adaptaciones responsive válidas solo si se comportan como una única navegación contextual.
- El panel global de “Contacto y PQRS” compite con el CTA final y el footer.
- El valor documental `vFinal` no permite una trazabilidad de versiones comprensible.
- Estado que Cumple llegó a 752 líneas, 88 botones y 74 artículos mediante secciones sucesivas, no mediante un modelo de componentes y datos.

## 6. Componentes útiles que deben conservarse

- Skip-link, un solo `h1`, `main#contenido`, logo a la izquierda, `aria-current` y estados explícitos.
- La advertencia consistente de que la propuesta no es oficial.
- La decisión de no simular datos, formularios ni adopción institucional.
- La tríada de entrada problema / sistema / decisión, reformulada como Comprender / Diseñar / Decidir.
- Búsqueda, filtros y metadatos de Documentos.
- Contenido sustantivo del árbol, núcleo RAÍCES/SAVIA/SEMILLAS, arquitectura, rutas, expediente, instrumentos, riesgos e indicadores.
- Categorías y resúmenes de Bitácora.
- Roles concretos de colaboración y voluntariado.
- Repositorios y estados de preservación de Archivo.
- Progreso de lectura, `Ctrl + K`, persistencia local y degradación HTML cuando se implementen sin ocultar el contenido esencial.

## 7. Componentes decorativos que no ayudan a comprender

- `paper-noise` superpuesto a todas las páginas y la doble trama de fondo; añaden textura, no estructura.
- Emblema decorativo repetido en cada footer.
- Sombras notorias en casi todos los paneles interactivos, lo que aplana la jerarquía al intentar destacar todo.
- El anillo flotante permanente mezcla identidad visual con una acción repetida y ocupa área útil en móvil.
- Sellos y círculos usados sin relación con versión, estado o flujo. Deben reservarse para acciones o metadatos con significado.
- Rejillas de tarjetas de igual tamaño para contenidos que no tienen el mismo peso.

## 8. Contenidos que deben fusionarse, moverse o eliminarse

| Acción | Contenido |
|---|---|
| Fusionar | Toolkit, cadena resumida y seis tarjetas del ecosistema de Inicio en un mapa CAMS y tres modos de exploración. |
| Fusionar | Teoría de cambio y ruta integrada en una secuencia única, manteniendo la explicación HTML. |
| Fusionar | Tipología y árbol en una herramienta de diagnóstico filtrable. |
| Fusionar | Núcleo metodológico y nodos metodológicos/operativos de arquitectura en un núcleo de dos órbitas. |
| Fusionar | Checklist y metodologías en un constructor de expediente de 14 dimensiones. |
| Mover | Perfil extendido, redes confirmadas e independencia a `/cams/`; dejar una ficha breve en Inicio. |
| Mover | Trazabilidad de versiones desde Participar a Archivo. |
| Mover | Comentarios y voluntariado desde Archivo a Participar. |
| Eliminar | Siete paneles flotantes repetidos, CTA redundantes al PDF, tarjetas vacías y la tarjeta “web personal” que vuelve a Inicio. |
| Reducir | Explicaciones completas de Estado que Cumple en Observatorio, Documentos y Archivo a una referencia contextual. |

## 9. Identidad propia frente a variaciones de plantilla

- Identidad fuerte: Estado que Cumple por su contenido técnico; Inicio por su hero, aunque después se vuelve una rejilla genérica.
- Identidad parcial: Documentos por su filtro; Archivo por su “vault”; Participar por sus estados.
- Variaciones de plantilla: Observatorio, Participar y Bitácora repiten `page-hero + bloque introductorio + tarjetas`. Bitácora es la versión más genérica.
- El shell idéntico y el footer social completo hacen que destinos con responsabilidades distintas parezcan equivalentes.
- La nueva arquitectura asignará un lenguaje visual: biblioteca/folio para Documentos, tablero metodológico para Observatorio, publicación para Bitácora, trazabilidad para Archivo, convocatoria para Participar y perfil editorial para CAMS.

## 10. Problemas en móvil, tablet y escritorio

### Móvil (360 px)

- La navegación queda oculta por CSS por debajo de 1180 px y depende totalmente de JavaScript para aparecer.
- El botón de menú no declara `aria-controls` y el `<nav>` no tiene ID.
- Inicio encadena más de veinte cajas equivalentes; la longitud no aporta orientación proporcional.
- El botón flotante ocupa espacio persistente y puede solapar acciones finales.
- El árbol, el mapa, dos steppers y doce fichas de expediente se convierten en una lista muy larga sin síntesis ni selección persistente.
- El H1 de Inicio concatena accesiblemente “CAMSEstado que Cumple” porque no existe separación textual entre los spans.

### Tablet (768–1024 px)

- Es el rango más frágil: recibe el menú móvil de siete destinos y conserva componentes densos de dos columnas.
- Los tablists y el índice técnico largo requieren desplazamiento o se sustituyen por select, pero no existe una jerarquía de subgrupo Explorar.
- El mapa institucional y el árbol pierden conexiones antes de ofrecer una alternativa textual diseñada como tal.
- Las rejillas pasan mecánicamente de tres/cuatro columnas a dos y luego una, sin reconsiderar importancia ni orden.

### Escritorio (1440–1920 px)

- A 1440 px se oculta el navegador lateral y se mantiene un índice sticky ancho; a 1451 px cambia de patrón abruptamente.
- El navegador lateral de 230 px compite con un contenido de hasta 1220 px y puede comprimir visualmente el margen izquierdo.
- La abundancia de tarjetas, bordes y sombras reduce la diferenciación entre lectura, evidencia e interacción.
- El header de siete entradas parece un anillo decorativo; no expresa que cuatro rutas pertenecen a Explorar.

## 11. Componentes que dependen excesivamente de JavaScript

- Menú móvil: sin JS la navegación queda `display:none`.
- Árbol: la mayor parte de cada explicación vive en atributos `data-*`; sin JS solo se ve el nombre de los nodos y el primer detalle.
- Checklist/expediente: mismo patrón; sin JS se pierde el detalle de once elementos.
- Simulador: no tiene una salida alternativa útil sin JS.
- Buscador y navegación lateral se crean enteramente desde JavaScript.
- Los paneles de tabs degradan mejor porque solo se ocultan después de añadir `.js-ready`; este patrón debe conservarse.
- `IntersectionObserver` no tiene fallback y una excepción puede impedir inicializadores posteriores.
- Los desplazamientos suaves de JS no consultan `prefers-reduced-motion`.

## 12. Clases CSS duplicadas o contradictorias

- `styles.css` concentra 2.357 líneas. Selectores como `.topbar`, `.nav`, `.technical-index`, `.technical-links`, `.core-node`, `.process-line`, `.site-footer` y varios grids reaparecen en media queries; parte es responsive legítimo, pero el archivo no distingue capas ni propietario del componente.
- `.concept-note` se define en dos zonas separadas; las reglas se complementan, pero dificultan mantener el componente.
- `.dashboard-grid` y `.status-dashboard` se declaran juntos aunque el HTML suele usar ambas clases a la vez.
- `.hero-facts` declara columnas sin declarar explícitamente `display:grid`; sus hijos también reciben `grid-template-columns` sin `display:grid`.
- `.active` es una utilidad global demasiado genérica y se solapa conceptualmente con `.is-active` y `[aria-current]`.
- `.button.primary/.secondary/.tertiary` no conforma el sistema solicitado `.button--*` y fuerza casi la misma silueta para todas las acciones.
- `.section-navigator > button` no tiene consumidor porque el JS crea solo un `<div>` con enlaces.
- `.is-open` se añade al panel flotante desde JS, pero no existe una regla CSS asociada.
- La mayoría de tarjetas repite `border-radius:8px`, fondo semitransparente y borde. El componente visual es uno solo bajo muchos nombres.
- Existe un hexadecimal literal (`#fffdf8`) fuera de los tokens; colores y transparencias se repiten como valores directos.

## 13. Funciones de `script.js` duplicadas o desconectadas

- `script.js` es un monolito de 810 líneas cargado en todas las rutas, aunque varios inicializadores solo tienen consumidor en una página.
- `normalizeId` y `normalizeSearch` duplican la misma normalización básica.
- `bindPanelSwitcher`, `initProblemTree` e `initChecklist` repiten activación, clases, `aria-pressed` y actualización de panel.
- El feedback de copiar está implementado de forma local en el simulador y no existe una utilidad reutilizable.
- `initFloatingPanel` cambia `.is-open`, clase sin regla CSS; el resultado depende exclusivamente de `hidden`.
- `bindPanelSwitcher` puede crear `aria-controls` aunque una clave no encuentre panel.
- La lista global del buscador está rígida en JavaScript y solo agrega secciones del DOM de la página actual.
- No hay funciones completamente muertas en el estado inicial, pero sí lógica global innecesaria en rutas sin componentes asociados.
- Un fallo en `IntersectionObserver` puede detener la inicialización de simulador y modo de lectura por no aislar errores.

## 14. Rutas, anchors y enlaces internos inconsistentes

- La revisión inicial no encuentra anchors rotos, IDs duplicados ni assets locales inexistentes: es una fortaleza a preservar.
- La navegación llama “Propuesta” a `/estado-que-cumple/`, mientras el nombre público requerido es “Estado que Cumple”.
- “Archivo” y “Archivo público” se usan de forma alternada.
- `/archivo/#contacto` identifica una sección de repositorios, aunque el nombre del ID no describe su función.
- Tres enlaces de RAÍCES/SAVIA/SEMILLAS en Inicio llegan al mismo anchor sin seleccionar un nodo.
- La taxonomía del buscador mezcla `Documento`, `Documentos`, `Archivo`, `Sistema`, `Investigación`, `Comunidad` y estados dentro del campo grupo.
- Muchas secciones con `data-search-title` no tienen ID, por lo que el resultado lleva al inicio de la página, no al bloque encontrado.
- `site.webmanifest` contiene texto aparentemente mal codificado en su descripción.
- El sitemap no incluye `/cams/` porque la ruta aún no existe.

## 15. Obstáculos para comprender Estado que Cumple como arquitectura integral

- La navegación actual presenta siete páginas pares y no un núcleo con superficies especializadas.
- Inicio muestra una lista de destinos y una cadena conceptual separadas; no representa relaciones entre CAMS, la propuesta, el archivo y el seguimiento.
- El núcleo solo muestra RAÍCES/SAVIA/SEMILLAS. Rutas, expediente, instrumento, tablero y evaluación aparecen lejos, aunque forman la segunda órbita del mismo sistema.
- Los widgets no explican de manera consistente qué entra, qué producen y con qué se conectan.
- Observatorio y otras páginas vuelven a explicar la propuesta, diluyendo su centro.
- No existe continuidad “Viene de / Está explorando / Continúe con”.
- La abundancia de estados futuros sin acción visible transmite acumulación de prototipos.
- Falta CAMS como página de autoría, independencia y criterios del archivo.
- El modo guiado/completo organiza la extensión, no las necesidades de ciudadanía, equipos técnicos y lectores jurídico-institucionales.

## Decisiones de reorganización que se implementarán

1. Sustituir la navegación de siete destinos por cinco entradas: Inicio, Estado que Cumple, Explorar, Participar y CAMS.
2. Convertir Explorar en un panel accesible con Documentos, Observatorio, Bitácora y Archivo, sin cambiar sus rutas.
3. Eliminar el panel flotante repetido; cada página tendrá una sola salida contextual.
4. Crear `/cams/` y añadirla al sitemap.
5. Rehacer Inicio como hero, selector de perfil, mapa CAMS, tres modos de exploración, mesa de trabajo, perfil breve y cierre de participación.
6. Sustituir guided/full por ciudadano/técnico/jurídico-institucional sin ocultar contenido esencial.
7. Convertir árbol, núcleo, estado del arte, simulador y expediente en herramientas persistentes, accesibles y alimentadas por JSON.
8. Separar CSS y JavaScript por responsabilidad; mantener `styles.css` y `script.js` como entradas ligeras.
9. Construir el buscador desde atributos semánticos, rutas y `documents.json`, con filtros.
10. Ampliar las auditorías para que la validación automática cubra HTML, CSS, JS, JSON, sitemap, módulos y relaciones de accesibilidad.

Esta auditoría es el punto de partida. La implementación posterior debe sustituir o consolidar componentes; no añadir secciones al final de la arquitectura anterior.

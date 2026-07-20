# Matriz de validación responsive

Fecha de revisión: 20 de julio de 2026

## Alcance y método

La revisión combinó sondas automatizadas de geometría, desbordamiento, área táctil y funcionamiento; emulación de capacidades táctiles; escenarios equivalentes de orientación, zoom y aumento de texto; y una inspección visual representativa.

Resultados cuantitativos:

- **96 de 96** combinaciones página × ancho sin incidencias: ocho páginas en 320, 360, 390, 412, 540, 768, 820, 1024, 1280, 1440, 1920 y 2560 px.
- **88 de 88** escenarios adicionales sin incidencias: orientación, altura reducida, ultrapanorámico, reflow equivalente a zoom de 125, 150 y 200 %, y texto al 200 %.
- **16 de 16** combinaciones táctiles válidas sin incidencias: ocho páginas a 360 y 390 px con `pointer: coarse` y `hover: none`.
- Una ejecución táctil ampliada produjo timeouts de infraestructura en algunos iframes. Esos casos no se contabilizaron como aprobados ni fallidos.

Cada caso automatizado verificó que `scrollWidth` no superara `clientWidth`, que no hubiera elementos fuera del viewport sin un contenedor de desplazamiento explícito, que los controles medidos conservaran aproximadamente 44 × 44 px, que no aparecieran errores de ejecución y que los flujos presentes respondieran. La inspección visual fue representativa, no exhaustiva para las 184 combinaciones.

El zoom se revisó mediante viewports de reflow equivalentes y aumento adicional del texto hasta 200 %. Esto no sustituye una campaña manual en todos los navegadores y dispositivos físicos.

### Leyenda

- **A**: sonda automatizada superada.
- **T**: emulación táctil superada.
- **V**: inspección visual representativa.
- **R**: revisión dirigida del flujo o de su implementación; no equivale a una campaña manual exhaustiva.
- **N/A**: el componente no contiene interacción propia de teclado.

## Matriz principal

| Página | Componente | 320 px | 390 px | 768 px | 1024 px | 1440 px | 1920 px | Teclado | Táctil | Zoom 200 % | Resultado | Observaciones |
|---|---|---:|---:|---:|---:|---:|---:|---|---|---|---|---|
| Inicio | Cabecera, navegación y buscador | A+V | A+V | A | A | A | A | R | T 360/390 | A | Conforme en el alcance probado | Drawer compacto con scroll, bloqueo del fondo, Escape y devolución de foco; navegación completa desde portátil. |
| Inicio | Hero, perfil y acciones | A+V | A+V | A | A | A | A | R | T 360/390 | A | Conforme en el alcance probado | Una columna en compacto y composición asimétrica cuando cabe. |
| Inicio | Mapa CAMS, experiencias y mesa | A | A | A | A | A | A | R | T 360/390 | A | Conforme en el alcance probado | El mapa pasa de diagrama a lista y conserva Recibe, Produce y Conecta con. |
| Estado que Cumple | Modos y núcleo de propuesta | A | A+V | A | A | A | A | R | T 360/390 | A | Conforme en el alcance probado | El control segmentado redistribuye opciones; el núcleo radial se convierte en lista. |
| Estado que Cumple | Árbol del problema y filtros | A | A | A | A | A | A | R | T 360/390 | A | Conforme en el alcance probado | Efectos, problema y causas permanecen en bloques verticales; filtros plegables en compacto. |
| Estado que Cumple | Estado del arte y comparación | A | A | A | A | A | A | R | T 360/390 | A | Conforme en el alcance probado | La tabla comparativa se sustituye por experiencia A, experiencia B y síntesis en móvil. |
| Estado que Cumple | Arquitectura institucional | A | A | A | A | A | A | R | T 360/390 | A | Conforme en el alcance probado | Nodos en lista compacta y relaciones también expresadas como texto. |
| Estado que Cumple | Ruta normativa y simulador | A | A | A | A | A | A | R | T 360/390 | A | Conforme en el alcance probado | Una pregunta por paso, progreso, anterior/siguiente y estado local en compacto; resultado no sticky. |
| Estado que Cumple | Constructor de expediente | A | A | A | A | A | A | R | T 360/390 | A | Conforme en el alcance probado | Índice desplegable en móvil, horizontal en tableta y lateral en escritorio. |
| Documentos | Búsqueda, filtros y fichas | A | A | A+V | A | A | A | R | T 360/390 | A | Conforme en el alcance probado | Orden compacto: estado, título, resumen, metadatos y acciones diferenciadas. |
| Observatorio | Líneas, indicadores y tabla | A | A | A | A+V | A | A | R | T 360/390 | A | Conforme en el alcance probado | Cada fila técnica se convierte en una ficha semántica cuando la tabla no cabe. |
| Bitácora | Categorías, entradas y lectura | A | A | A | A | A+V | A | R | T 360/390 | A | Conforme en el alcance probado | Jerarquía de categoría, fecha, título, resumen y lectura; medida editorial limitada. |
| Participar | Rutas, acciones y acceso contextual | A | A | A | A | A | A | R | T 360/390 | A | Conforme en el alcance probado | En móvil queda en el flujo para no cubrir contenido; en escritorio flota. Panel no modal con Escape, foco devuelto, safe area y scroll interno. |
| Archivo | Repositorios, versiones y trazabilidad | A | A | A | A | A | A | R | T 360/390 | A | Conforme en el alcance probado | Metadatos y acciones permanecen disponibles sin tabla rígida. |
| CAMS | Perfil, proyectos y autoría | A | A | A | A | A | A+V | R | T 360/390 | A | Conforme en el alcance probado | Lectura acotada y bloques redistribuidos por el espacio disponible. |

## Cobertura completa de anchos

| 320 | 360 | 390 | 412 | 540 | 768 | 820 | 1024 | 1280 | 1440 | 1920 | 2560 |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| A | A | A | A | A | A | A | A | A | A | A | A |

Total: **8 páginas × 12 anchos = 96 casos superados**.

## Escenarios adicionales

| Grupo de prueba | Cobertura ejecutada | Resultado | Alcance |
|---|---|---|---|
| Móvil horizontal | 640 × 320 y 844 × 390, ocho páginas | A, 16/16 | Diagramas lineales, menú desplazable y paneles con altura limitada. |
| Tableta | 768 × 1024 y 1024 × 768, ocho páginas | A, 16/16 | Variantes vertical y horizontal. |
| Portátil bajo | 1366 × 600, ocho páginas | A, 8/8 | Sticky desactivado cuando reduce la lectura útil. |
| Ultrapanorámico | 2560 × 1080, ocho páginas | A, 8/8 | Lectura acotada; espacio extra reservado para visualización y contexto. |
| Zoom equivalente | 125, 150 y 200 %, ocho páginas | A, 24/24 | Reflow equivalente; no sustituye cada combinación de zoom nativo y motor. |
| Tamaño de texto | 200 % en móvil y portátil, ocho páginas | A, 16/16 | Sin desbordamiento y con cambio de diagrama a lista cuando deja de caber. |
| Interacción táctil | Ocho páginas a 360 y 390 px | T, 16/16 | Emulación `pointer: coarse` y `hover: none`. |
| Movimiento reducido | Estado que Cumple a 390 px | A | `prefers-reduced-motion: reduce` activo, sin error ni desbordamiento. |
| Navegación por teclado | Menú, buscador, selectores, mapas, simulador, expediente y acceso de participación | R | Flujos críticos automatizados y revisión dirigida; no campaña manual integral. |
| Inspección visual | Inicio 320/390, Estado que Cumple 390, Documentos 768, Observatorio 1024, Bitácora 1440 y CAMS 1920 | V | Muestreo representativo, no inspección visual de las 184 combinaciones. |

## Fallos encontrados y corregidos durante la revisión

- El navegador contextual sumaba márgenes a un ancho del 100 % y generaba desbordamiento compacto.
- La barra de modos conservaba columnas mínimas de escritorio bajo zoom o aumento de texto.
- Los filtros documentales mantenían mínimos incompatibles con texto al 200 %.
- El nodo activo del mapa CAMS heredaba ancho y transformación radial al pasar a lista.
- El árbol del problema podía dividir su secuencia vertical en 820 px.
- La comparación del estado del arte conservaba una tabla ancha en móvil.
- El menú móvil no bloqueaba el fondo ni controlaba foco, safe areas y altura reducida.
- Los mapas y paneles sticky no reaccionaban a móvil horizontal o a poca altura.
- Varias etiquetas y controles quedaban por debajo del piso tipográfico o táctil adoptado.

## Limitaciones y asuntos pendientes

- No se realizó una campaña exhaustiva sobre dispositivos físicos iOS y Android.
- La emulación de zoom no sustituye completamente el zoom nativo en todos los motores.
- La inspección visual fue por muestreo representativo.
- La revisión de teclado fue dirigida y automatizada, no una campaña manual integral con todas las combinaciones.
- Los timeouts de infraestructura de la ampliación táctil no se presentan como aprobaciones ni como fallos del sitio.

No quedaron fallos funcionales conocidos dentro de los casos válidamente ejecutados.

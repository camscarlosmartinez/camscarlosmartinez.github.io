# CAMS — Auditoría y reestructuración integral del sitio

**Repositorio revisado:** `camscarlosmartinez.github.io-main(6).zip`  
**Fecha de revisión:** 20 de julio de 2026  
**Objeto:** reorganizar la plataforma personal CAMS, distinguirla de la propuesta Estado que Cumple, eliminar duplicaciones y definir una migración segura a Astro.

---

## 1. Diagnóstico ejecutivo

El repositorio contiene actualmente **dos sitios superpuestos**:

1. **Sitio público estático completo:** ocho páginas HTML, CSS modular, JavaScript modular y cinco archivos JSON de datos.
2. **Migración Astro incompleta:** un único `src/pages/index.astro`, layouts, componentes globales y un segundo sistema de estilos.

El sitio HTML actual es el que contiene la experiencia real. Astro todavía es un prototipo técnico y no debe desplegarse como reemplazo. La compilación actual de Astro genera solamente la portada de migración; no genera las otras siete rutas públicas.

La principal debilidad ya no es visual ni de programación básica. Es de **arquitectura de información e identidad**:

- la portada presenta CAMS y Estado que Cumple casi como si fueran la misma cosa;
- Estado que Cumple ocupa la mayor parte de la experiencia general del sitio;
- Documentos, Bitácora, Observatorio y Archivo mezclan materiales reales, proyectos futuros y mensajes de “todavía no disponible”;
- la página CAMS todavía explica poco sobre Carlos, su trayectoria, método y agenda pública;
- existen bloques que repiten la navegación, la autoría, la independencia, los estados de publicación y los canales públicos;
- la propuesta insignia está concentrada en una sola página excesivamente larga;
- varias experiencias comparadas y afirmaciones institucionales todavía no tienen fuentes visibles asociadas dentro de los datos estructurados.

La jerarquía que debe ordenar todo el sitio es:

1. **Carlos Arturo Martínez Sánchez:** persona, autor y responsable público.
2. **CAMS:** identidad personal, editorial y política; no es una organización.
3. **Estado que Cumple:** propuesta programática principal de CAMS.
4. **Otras propuestas:** iniciativas diferentes de Estado que Cumple.
5. **Conocimiento:** investigaciones, documentos, análisis, datos y archivo.
6. **Participación:** correcciones, fuentes, comentarios y colaboración.

---

## 2. Para qué sirve Astro realmente

Astro no vuelve inteligente o interactivo el sitio por sí solo. La interactividad sigue dependiendo de JavaScript, SVG, D3 u otros componentes. Su función aquí es diferente:

- convertir encabezado, navegación, buscador, pie y avisos en componentes únicos;
- impedir que el mismo menú tenga que editarse en ocho archivos;
- generar automáticamente páginas a partir de contenidos estructurados;
- mantener propuestas, investigaciones, documentos y artículos como colecciones;
- producir HTML estático para GitHub Pages;
- cargar JavaScript solamente en las experiencias que lo necesitan;
- generar metadatos, sitemap, páginas de detalle y relaciones entre contenidos;
- reducir las duplicaciones entre HTML, JSON y tarjetas manuales.

### Decisión recomendada

**Conservar Astro, pero detener su despliegue hasta completar la migración.**

No hace falta React en esta fase. Astro, componentes `.astro`, TypeScript y el JavaScript actual son suficientes. D3 tendría sentido después para grafos o visualizaciones más complejas.

---

## 3. Hallazgos técnicos concretos

### 3.1. Dos portadas en competencia

- `index.html` contiene la portada pública completa.
- `src/pages/index.astro` contiene una portada mínima de migración.
- `npm run build` genera solo una página Astro.

Si se activa hoy el despliegue por Astro, desaparecerían del resultado compilado las rutas actuales de CAMS, Estado que Cumple, Documentos, Observatorio, Bitácora, Participar y Archivo.

### 3.2. Activos duplicados

Existen copias idénticas en:

- `assets/branding/` y `public/assets/branding/`;
- `assets/data/` y `public/assets/data/`;
- `assets/documentos/` y `public/assets/documentos/`;
- `robots.txt` y `public/robots.txt`;
- `site.webmanifest` y `public/site.webmanifest`.

En la versión Astro final debe existir una sola fuente. Para estos recursos públicos, la ubicación más sencilla es `public/assets/`.

### 3.3. Dos sistemas de diseño

- El sitio actual usa `styles.css` y siete hojas en `assets/css/`.
- Astro usa `src/styles/global.css`.

La auditoría detecta variables, selectores y colores duplicados entre ambos sistemas. La migración debe reutilizar primero el sistema visual actual y convertirlo gradualmente, no diseñar un segundo sistema paralelo.

### 3.4. Navegación futura apuntando a páginas inexistentes

El encabezado Astro ya menciona:

- `/propuestas/`;
- `/conocimiento/`;
- `/conocimiento/investigaciones/`;
- otras rutas internas de Conocimiento.

Esas páginas todavía no existen. La arquitectura es correcta como dirección futura, pero no debe publicarse hasta crear las rutas.

### 3.5. Datos existentes

El proyecto ya posee una base útil:

- árbol del problema: 18 nodos, con 9 causas, 1 problema y 8 efectos;
- arquitectura de la propuesta: 8 nodos metodológicos y 7 componentes institucionales;
- estado del arte: 8 experiencias comparadas y 8 enfoques;
- rutas de activación: Ejecutivo, Congreso, sociedad civil y territorio;
- biblioteca: 4 registros, pero solo uno está realmente publicado.

La prioridad no es producir más JSON, sino mejorar su calidad editorial, incorporar fuentes y conectarlo con páginas bien delimitadas.

---

## 4. Navegación principal recomendada

La navegación superior debe tener seis entradas:

1. **Inicio**
2. **CAMS**
3. **Estado que Cumple**
4. **Propuestas**
5. **Conocimiento**
6. **Participar**

### Submenú Conocimiento

- Investigaciones
- Documentos
- Bitácora
- Observatorio
- Archivo

El buscador debe permanecer como control independiente, no como séptima entrada de navegación.

### Rutas públicas recomendadas

```text
/
├── /cams/
│   ├── /cams/trayectoria/
│   ├── /cams/metodo/
│   └── /cams/criterios-y-transparencia/
│
├── /estado-que-cumple/
│   ├── /estado-que-cumple/problema/
│   ├── /estado-que-cumple/fundamentos/
│   ├── /estado-que-cumple/metodo/
│   ├── /estado-que-cumple/arquitectura/
│   ├── /estado-que-cumple/activacion/
│   ├── /estado-que-cumple/implementacion/
│   ├── /estado-que-cumple/aplicaciones/
│   └── /estado-que-cumple/documento/
│
├── /propuestas/
│   └── /propuestas/[slug]/
│
├── /conocimiento/
├── /investigaciones/
│   └── /investigaciones/[slug]/
├── /documentos/
│   └── /documentos/[slug]/
├── /bitacora/
│   └── /bitacora/[slug]/
├── /observatorio/
│   └── /observatorio/[linea]/
├── /archivo/
│
├── /participar/
│   ├── /participar/correcciones/
│   ├── /participar/aportar-fuente/
│   └── /participar/colaborar/
│
├── /buscar/
├── /accesibilidad/
├── /privacidad-y-datos/
└── /404.html
```

Las rutas actuales `/documentos/`, `/observatorio/`, `/bitacora/` y `/archivo/` deben conservarse. Pueden aparecer agrupadas visualmente dentro de Conocimiento sin cambiar sus direcciones públicas.

---

# 5. Reestructuración página por página

## 5.1. Inicio

### Problema actual

La portada intenta cumplir simultáneamente cinco funciones:

- presentar CAMS;
- explicar Estado que Cumple;
- segmentar siete tipos de visitantes;
- representar todas las áreas del sitio;
- mostrar herramientas, proyectos, perfil y participación.

Esto produce una portada extensa que vuelve a construir el menú mediante un mapa y presenta tres herramientas que pertenecen exclusivamente a Estado que Cumple.

### Debe permanecer

- identidad CAMS;
- frase de capacidad pública;
- Estado que Cumple como proyecto insignia;
- actividad reciente;
- perfil breve de Carlos;
- una invitación real a participar.

### Debe salir de la portada

1. **Selector de siete perfiles.** Trasladarlo a una futura página de orientación o incorporarlo dentro de cada sección. Antes de entender el sitio, el visitante no debería tener que clasificarse.
2. **Mapa orbital del ecosistema CAMS.** Repite el menú y obliga a seleccionar un nodo para descubrir destinos ya visibles. Puede reutilizarse en `/cams/metodo/` como explicación interna de la plataforma o eliminarse.
3. **Tres experiencias interactivas de Estado que Cumple.** Árbol, arquitectura y simulador deben trasladarse a la portada de la propuesta.
4. **Acceso directo al PDF dentro del hero general.** El PDF pertenece al bloque destacado de Estado que Cumple.
5. **Cuatro CTA simultáneos.** El hero debe tener dos como máximo.
6. **Elementos planeados presentados como líneas activas.** La portada debe mostrar resultados reales, no llenar espacio con proyectos aún vacíos.

### Nueva estructura

1. **Hero CAMS**
   - Sobrelinea: `Carlos Arturo Martínez Sánchez · CAMS`.
   - Título: `Propuestas y conocimiento para que el Estado cumpla`.
   - Texto: investigación pública, diseño institucional, seguimiento y participación.
   - CTA primario: `Explorar Estado que Cumple`.
   - CTA secundario: `Conocer CAMS`.

2. **Proyecto insignia: Estado que Cumple**
   - problema;
   - tesis;
   - secuencia completa;
   - estado editorial;
   - enlaces a resumen y documento.

3. **Trabajo reciente**
   - máximo tres piezas realmente publicadas o actualizadas;
   - fecha exacta;
   - tipo;
   - vínculo.

4. **Agenda de trabajo**
   - capacidad estatal;
   - administración y territorio;
   - participación y juventud;
   - infraestructura y políticas públicas.

5. **Método CAMS resumido**
   - investigar;
   - diagnosticar;
   - formular;
   - contrastar;
   - publicar y versionar.

6. **Perfil breve**
   - nombre;
   - síntesis verificable;
   - enlace a trayectoria.

7. **Participación**
   - corregir un error;
   - aportar una fuente;
   - comentar una propuesta.

8. **Pie editorial**
   - independencia;
   - actualización;
   - licencias y archivo.

### Resultado buscado

La portada debe responder en menos de un minuto:

- quién es el responsable;
- qué es CAMS;
- cuál es la propuesta principal;
- qué se puede leer ahora;
- cómo participar.

---

## 5.2. CAMS

### Función correcta

Esta es la página personal y de identidad pública. Debe explicar que **CAMS es Carlos**, no una entidad o colectivo independiente de su autor.

### Problemas actuales

- la ficha biográfica es demasiado breve;
- la página dedica mucho espacio a aclarar lo que CAMS no es;
- “Mesa de proyectos” repite la portada y otras secciones;
- la independencia aparece en varios bloques y páginas;
- los perfiles públicos se repiten en Participar y Archivo;
- no existe una trayectoria cronológica;
- no se explica suficientemente cómo trabaja Carlos ni qué experiencia aporta;
- el nombre CAMS aparece como archivo editorial, pero no como identidad pública completa.

### Nueva estructura de `/cams/`

1. **Identificación pública**
   - Carlos Arturo Martínez Sánchez;
   - CAMS como firma personal y sello editorial;
   - fotografía o retrato, cuando se disponga de uno apropiado;
   - descripción profesional breve;
   - canales públicos confirmados.

2. **Quién soy**
   - biografía de dos o tres párrafos;
   - formación;
   - experiencia pública y ciudadana verificable;
   - relación con administración pública, territorio y participación.

3. **Relación de identidades**
   - Carlos = autor y responsable;
   - CAMS = identidad pública y editorial;
   - Estado que Cumple = propuesta insignia;
   - Manos a la Obra = colectivo vinculado al documento cuando corresponda, sin confundirlo con CAMS.

4. **Trayectoria pública**
   - línea de tiempo;
   - formación en ESAP;
   - experiencia en consejos de juventud;
   - investigaciones y proyectos;
   - creación de Estado que Cumple;
   - publicaciones y actividades públicas.

5. **Capacidades de trabajo**
   - investigación documental;
   - análisis institucional y normativo;
   - diseño de propuestas;
   - capacidad estatal y territorial;
   - organización de datos y evidencias;
   - comunicación y pedagogía pública.

6. **Agenda pública**
   - problemas que se estudian;
   - líneas territoriales;
   - asuntos de Bogotá;
   - juventud, educación, infraestructura y capacidad estatal.

7. **Método CAMS**
   - problema verificable;
   - revisión de evidencia;
   - análisis de competencias;
   - alternativas;
   - propuesta;
   - contraste público;
   - versiones y correcciones.

8. **Producción**
   - proyectos activos;
   - investigaciones publicadas;
   - propuestas;
   - herramientas;
   - artículos recientes.

9. **Criterios y transparencia**
   - independencia;
   - afiliaciones o roles públicos que deban declararse;
   - uso de inteligencia artificial;
   - correcciones;
   - manejo de fuentes;
   - privacidad;
   - conflictos de interés;
   - licencias y reutilización.

10. **Contacto público**
    - redes confirmadas;
    - canal para correcciones;
    - canal para propuestas de colaboración.

### Subpáginas

- `/cams/trayectoria/`: cronología extensa y evidencias.
- `/cams/metodo/`: forma de investigación, formulación y publicación.
- `/cams/criterios-y-transparencia/`: independencia, IA, correcciones, privacidad y licencias.

### Contenido que debe moverse aquí

- autoría e independencia de la portada;
- perfiles públicos del Archivo;
- declaración amplia de independencia;
- explicación de la relación Carlos–CAMS–Estado que Cumple;
- criterios editoriales y de verificación.

---

## 5.3. Estado que Cumple

### Problema actual

La página contiene trece secciones, varias herramientas, una comparación internacional, lectura jurídica, arquitectura, simulador, expediente y seguimiento. Funciona como documento, micrositio, laboratorio y resumen al mismo tiempo.

La consecuencia es una página larga que dificulta distinguir:

- la tesis central;
- el fundamento;
- el método;
- la estructura institucional;
- las rutas de activación;
- la implementación.

### Nueva función de la portada de la propuesta

`/estado-que-cumple/` debe ser un **resumen guiado**. No debe contener toda la investigación ni todas las herramientas.

### Orden recomendado

1. Hero y estado de la propuesta.
2. Resumen ejecutivo: problema, tesis y resultado esperado.
3. Secuencia completa de transformación.
4. Navegación por ocho capítulos.
5. Arquitectura institucional resumida.
6. Herramientas principales.
7. Rutas de activación.
8. Aplicaciones o casos.
9. Documento, versión y participación.

### Debe eliminarse de la portada principal

- selector de “modo ciudadano, técnico y jurídico” como reordenamiento visual;
- explorador comparado completo;
- árbol completo;
- simulador completo;
- constructor completo del expediente;
- matriz jurídica completa;
- detalle de todos los riesgos e indicadores.

En su lugar, cada bloque debe mostrar una síntesis y enlazar a la subpágina correspondiente.

### Subpágina 1: `/estado-que-cumple/problema/`

Contenido:

- definición de “forma institucional” y “capacidad pública real”;
- evidencia del problema en Colombia;
- tipología de creación prematura;
- árbol interactivo actual;
- nueve causas, problema central y ocho efectos;
- preguntas de diagnóstico;
- fuentes y límites de la evidencia;
- síntesis descargable.

El árbol actual es una buena base. Debe añadir fuentes por nodo o por dimensión.

### Subpágina 2: `/estado-que-cumple/fundamentos/`

Contenido:

- marco conceptual;
- capacidad estatal;
- poder infraestructural;
- forma y función;
- aprendizaje adaptativo;
- profesionalización y memoria institucional;
- fundamentos constitucionales y administrativos;
- comparación internacional.

El estado del arte actual contiene ocho experiencias, pero los registros JSON no tienen campos de bibliografía. Cada experiencia debe incorporar:

- autores o instituciones;
- obras o documentos;
- periodo;
- alcance;
- aprendizaje;
- riesgo;
- límite de comparación;
- traducción propuesta para Colombia.

“Asia oriental”, “Estados del Golfo” o “experiencia soviética y postsoviética” no deben aparecer como categorías autosuficientes sin referencias y delimitación histórica.

### Subpágina 3: `/estado-que-cumple/metodo/`

Contenido:

- teoría de cambio;
- RAÍCES;
- SAVIA;
- SEMILLAS;
- tipología de decisiones;
- Expediente Técnico Integrado;
- relación entre herramientas;
- constructor del expediente;
- ejemplos pedagógicos.

La secuencia debe mostrar claramente:

```text
Problema delimitado
→ RAÍCES
→ SAVIA
→ SEMILLAS cuando exista incertidumbre
→ expediente técnico
→ instrumento competente
→ implementación
→ tablero y evaluación
→ ajuste, escala, absorción, cierre o archivo
```

### Subpágina 4: `/estado-que-cumple/arquitectura/`

Contenido:

- Sistema Administrativo Nacional Estado que Cumple;
- Comisión Intersectorial;
- Secretaría Técnica DAFP–DNP;
- Ventanilla Técnica Integrada;
- métodos;
- expediente e instrumento;
- tablero y evaluación;
- flujo de casos;
- competencias que se conservan;
- explicación de por qué no se propone crear una entidad por defecto.

Debe distinguir:

- propuesta de arquitectura;
- autoridad que tendría que adoptarla;
- instrumento requerido;
- relación con estructuras existentes;
- riesgos de duplicidad.

### Subpágina 5: `/estado-que-cumple/activacion/`

Contenido:

- Ejecutivo;
- Congreso;
- sociedad civil;
- gobiernos territoriales;
- instrumentos posibles;
- competencia y reserva de ley;
- participación y control político;
- simulador pedagógico actual;
- salidas condicionadas;
- casos de activación sin triunfo electoral.

El simulador debe permanecer aquí porque organiza actores e instrumentos, no en la portada general.

### Subpágina 6: `/estado-que-cumple/implementacion/`

Contenido:

- fases de adopción;
- transición;
- recursos;
- talento y empleo público;
- datos e interoperabilidad;
- archivo;
- capacidad territorial;
- contratación;
- control;
- indicadores;
- evaluación ex post;
- riesgos y salvaguardas;
- condiciones para cerrar o corregir una intervención.

Como la propuesta dejó de estar vinculada a un gobierno específico, debe presentar **rutas de adopción posibles**, no promesas oficiales para 2026–2030.

### Subpágina 7: `/estado-que-cumple/aplicaciones/`

Contenido:

- catálogo de casos sectoriales y territoriales;
- problema;
- capacidades existentes;
- ruta RAÍCES;
- madurez SAVIA;
- posible piloto SEMILLAS;
- instrumento;
- riesgos;
- resultado verificable.

No deben publicarse tarjetas vacías. Cada aplicación debe tener al menos una ficha técnica mínima.

### Subpágina 8: `/estado-que-cumple/documento/`

Contenido:

- PDF vigente;
- resumen ejecutivo;
- ficha bibliográfica;
- fecha exacta;
- número de versión;
- historial de cambios;
- citación APA;
- anexos;
- archivos complementarios;
- licencia;
- comentarios y correcciones.

---

## 5.4. Propuestas

### Página faltante

Actualmente Estado que Cumple aparece como la única propuesta y otros temas se registran en Documentos como materiales planeados. Esto mezcla proyectos programáticos con archivos.

### Función

`/propuestas/` debe ser el catálogo de soluciones públicas formuladas por Carlos/CAMS.

### Ficha mínima de cada propuesta

- código;
- título;
- resumen;
- problema público;
- tesis;
- escala territorial;
- sector o población;
- evidencia;
- alternativas consideradas;
- ruta institucional;
- instrumentos posibles;
- condiciones fiscales y operativas;
- riesgos;
- estado de madurez;
- versión;
- fecha;
- documentos vinculados;
- próximos pasos.

### Estados permitidos

- idea registrada;
- investigación;
- borrador;
- propuesta pública;
- piloto;
- archivada.

No usar varios badges simultáneos. Cada propuesta debe tener un estado principal y una fecha de actualización.

### Contenido inicial

- Estado que Cumple como propuesta insignia;
- otras propuestas solamente cuando tengan ficha sustantiva;
- movilidad, juventud u otros temas no deben aparecer como propuestas si todavía son únicamente líneas de interés.

---

## 5.5. Conocimiento

### Página central faltante

`/conocimiento/` debe explicar las diferencias entre:

- investigación;
- documento;
- artículo de Bitácora;
- dato o seguimiento;
- material de archivo.

No debe repetir todos los catálogos. Debe orientar y destacar las novedades de cada área.

---

## 5.6. Investigaciones

### Página faltante

Debe albergar trabajos académicos, estudios de caso, análisis extensos y proyectos metodológicos.

### Estructura de cada investigación

- título;
- pregunta;
- resumen;
- periodo;
- territorio;
- metodología;
- fuentes;
- hallazgos;
- limitaciones;
- productos;
- archivos;
- estado;
- relación con propuestas.

La investigación sobre capacidad estatal y PDET Pacífico Medio puede convertirse en una de las primeras fichas completas cuando sus materiales estén listos para publicación.

---

## 5.7. Documentos

### Problema actual

La biblioteca contiene cuatro registros, pero solamente Estado que Cumple está publicado. La matriz está en borrador y dos documentos están planeados. Los filtros y estados dan la impresión de una biblioteca más amplia de lo que realmente existe.

### Reestructuración

1. Mostrar por defecto solamente archivos publicados.
2. Trasladar los materiales planeados al catálogo de proyectos o a una hoja de ruta.
3. Crear páginas individuales para cada documento.
4. Incorporar fecha exacta, versión, tamaño, páginas, licencia y checksum cuando sea pertinente.
5. Separar “documento descargable” de “proyecto de documento”.
6. Mantener filtros cuando existan suficientes registros reales.

### Página de detalle

`/documentos/[slug]/` debe contener:

- portada;
- resumen;
- autoría;
- versión;
- fecha;
- descarga;
- citación;
- historial;
- licencia;
- relación con propuestas e investigaciones;
- correcciones.

---

## 5.8. Observatorio

### Problema actual

La página es honesta al indicar que no existen datos, pero dedica gran parte de su contenido a repetir esa ausencia. En realidad, hoy es una metodología y hoja de ruta, no un observatorio operativo.

### Decisión recomendada

Mantener el nombre, pero mostrarlo dentro de Conocimiento como:

**Observatorio de capacidad pública · fase de diseño**

No debe ocupar una entrada principal de navegación hasta tener al menos una línea real de seguimiento.

### Nueva estructura

1. Estado del proyecto.
2. Pregunta y alcance.
3. Primera línea priorizada.
4. Registro de fuentes.
5. Diccionario de indicadores.
6. Metodología.
7. Datos y descargas.
8. Visualización.
9. Historial de versiones.
10. Colaboración metodológica.

### Primera línea sugerida

El seguimiento normativo ya está desarrollado conceptualmente en la página actual y puede ser el primer piloto porque depende de documentos públicos verificables. Las demás seis líneas deben presentarse como hoja de ruta, no como tableros en construcción independientes.

### Qué debe reducirse

- repetir “no hay datos” en varias secciones;
- mostrar cuatro tableros futuros como si fueran productos distintos;
- presentar indicadores sin ficha técnica o fuente candidata;
- usar una tabla extensa antes de tener valores o series.

---

## 5.9. Bitácora

### Problema actual

La página muestra cuatro entradas no publicadas, todas con fecha y tiempo de lectura, pero aclara que todavía no existen como artículos. Esto convierte el catálogo en una programación editorial, no en una publicación.

### Reestructuración

- mostrar artículos únicamente cuando tengan contenido completo;
- trasladar ideas futuras a una sección pequeña de “próximos temas”;
- empezar con tres categorías, no seis categorías vacías;
- generar cada artículo desde Markdown o MDX;
- añadir fuentes y lecturas relacionadas;
- calcular tiempo de lectura a partir del texto real;
- distinguir fecha de publicación y fecha de actualización.

### Estructura de la portada

1. Artículo destacado.
2. Últimas entradas.
3. Series.
4. Categorías.
5. Relación con propuestas e investigaciones.
6. RSS o seguimiento.

### Estructura de un artículo

- título;
- resumen;
- fecha;
- actualización;
- autor;
- serie;
- categoría;
- texto;
- fuentes;
- contenido relacionado;
- correcciones.

---

## 5.10. Participar

### Problema actual

La página está construida principalmente alrededor de canales no habilitados: formulario, suscripción y voluntariado. Aunque la transparencia es correcta, la experiencia transmite más límites que posibilidades reales.

### Nueva estructura

1. **Corregir un error**
   - página o documento;
   - descripción;
   - fuente;
   - canal verificable.

2. **Aportar una fuente**
   - referencia;
   - explicación de relevancia;
   - relación con una propuesta o investigación.

3. **Comentar una propuesta**
   - observación jurídica, técnica, política o editorial;
   - discusión pública trazable.

4. **Colaborar**
   - necesidades realmente abiertas;
   - alcance;
   - reglas;
   - responsable;
   - forma de contacto.

5. **Seguir actualizaciones**
   - redes confirmadas;
   - RSS;
   - lista de correo solamente cuando exista política y consentimiento.

6. **Compartir**
   - enlace y ficha breve.

### Canales recomendados para la primera fase

- GitHub Issues para errores técnicos;
- GitHub Discussions para observaciones y fuentes;
- perfiles públicos confirmados para contacto inicial;
- formulario externo solamente cuando exista moderación, privacidad y capacidad de respuesta.

### Debe salir o reducirse

- banco de voluntariado mientras no exista inscripción y gestión real;
- varios bloques dedicados a explicar la inexistencia de backend;
- repetición completa de redes en otras páginas.

---

## 5.11. Archivo

### Problema actual

La página mezcla:

- repositorio técnico;
- documento principal;
- redes sociales;
- destinos de preservación todavía no usados;
- principios de versionado.

El Archivo debe ser una infraestructura de memoria y no una segunda página de contacto.

### Nueva estructura

1. Registro de versiones del sitio.
2. Registro de versiones documentales.
3. Código y repositorios.
4. Citación y licencias.
5. Correcciones y retractaciones.
6. Preservación permanente.
7. Exportaciones y copias estables.
8. Política de archivo.

### Debe moverse

- perfiles públicos a CAMS y Participar;
- producción actual a Documentos y Propuestas;
- Zenodo, OSF e Internet Archive a una hoja de ruta compacta hasta que existan depósitos reales.

### Elemento prioritario faltante

Una tabla real de versiones:

| Código | Recurso | Versión | Fecha | Cambio | Estado | Enlace estable |
|---|---|---|---|---|---|---|

---

# 6. Contenido repetido y ubicación correcta

| Contenido actual | Dónde aparece | Ubicación final |
|---|---|---|
| Autoría de Carlos | Inicio, CAMS, documentos y tarjetas | CAMS completo; resumen breve en Inicio; metadato en cada publicación |
| CAMS es independiente y no oficial | Inicio, CAMS, Estado que Cumple, pie | Declaración completa en Criterios y transparencia; aviso breve reutilizable |
| Redes públicas | CAMS, Participar, Archivo | CAMS y Participar; Archivo solo registra versiones de los enlaces si es necesario |
| Proyectos activos | Inicio y CAMS | Inicio: novedades; CAMS: portafolio; Propuestas: catálogo programático |
| Estado que Cumple | Inicio, CAMS, Documentos, Archivo y página propia | Resumen destacado en Inicio; propuesta completa en su micrositio; ficha documental en Documentos |
| Estados “publicado/prototipo/borrador” | Menú, tarjetas, páginas y JSON | Metadato principal en cada recurso; evitar repetirlo en cada navegación |
| Participación | Inicio, finales de páginas y Participar | CTA contextual breve por página; acciones completas solamente en Participar |
| “No hay datos / no hay backend” | Observatorio y Participar | Un aviso de estado por página, seguido de acciones o metodología útil |
| Mapa del ecosistema | Inicio y navegación | Eliminar de Inicio o trasladar a CAMS/Método |
| Árbol, arquitectura y simulador | Inicio y Estado que Cumple | Herramientas exclusivamente dentro de la propuesta |

---

# 7. Modelo editorial para Astro

Astro debe servir para que cada contenido exista una sola vez como fuente estructurada.

## Colección `propuestas`

Campos:

```text
code
title
slug
summary
status
problem
thesis
scale
territory
sectors
evidence
alternatives
institutionalRoute
instruments
conditions
risks
version
publishedAt
updatedAt
relatedDocuments
relatedResearch
```

## Colección `investigaciones`

```text
title
slug
abstract
question
period
territory
method
sources
findings
limitations
status
outputs
relatedProposals
```

## Colección `documentos`

```text
code
title
slug
type
abstract
file
version
publishedAt
updatedAt
author
citation
license
pages
fileSize
checksum
status
```

## Colección `bitacora`

```text
title
slug
excerpt
publishedAt
updatedAt
series
category
tags
status
references
relatedContent
```

## Datos interactivos de Estado que Cumple

Mover a:

```text
src/data/estado-que-cumple/
├── problem-tree.json
├── architecture.json
├── state-of-art.json
├── activation-routes.json
└── expediente.json
```

Los componentes Astro deben generar el contenido HTML base desde esos datos. El JavaScript debe limitarse a filtros, selección, copiado y simulación. Así se evita mantener manualmente una versión HTML y otra JSON del mismo contenido.

---

# 8. Sistema visual y de componentes

## Componentes globales

- `Header.astro`
- `Footer.astro`
- `SeoHead.astro`
- `StatusNotice.astro`
- `Breadcrumbs.astro`
- `ContextCTA.astro`
- `SearchDialog.astro`
- `ContentCard.astro`
- `VersionMeta.astro`
- `CitationBlock.astro`

## Componentes por tipo

### CAMS

- `ProfileHero.astro`
- `PublicTimeline.astro`
- `WorkAgenda.astro`
- `MethodSteps.astro`

### Estado que Cumple

- `ProblemTree.astro`
- `TheoryOfChange.astro`
- `MethodCore.astro`
- `InstitutionalArchitecture.astro`
- `ActivationRoute.astro`
- `DecisionLab.astro`
- `ExpedienteBuilder.astro`

### Conocimiento

- `ResearchCard.astro`
- `DocumentRecord.astro`
- `PostCard.astro`
- `DatasetMeta.astro`
- `VersionTable.astro`

## Regla visual

No convertir todo en tarjetas. Usar:

- dossier;
- cronología;
- capítulos;
- matrices;
- mesa de trabajo;
- fichas documentales;
- líneas de proceso;
- mapas;
- tablas de versiones;
- bloques editoriales de lectura.

---

# 9. Orden de migración a Astro

## Fase 0 — Seguridad

- mantener `main` con el sitio HTML actual;
- trabajar en una rama `astro-migracion`;
- no activar GitHub Actions todavía;
- congelar temporalmente cambios estructurales en los ocho HTML.

## Fase 1 — Fuente única

- escoger `public/assets/` como carpeta pública;
- eliminar duplicados solamente dentro de la rama;
- reutilizar el CSS actual;
- crear un único layout, header, footer y buscador;
- migrar metadatos y navegación.

## Fase 2 — Páginas simples

Migrar primero:

1. CAMS;
2. Archivo;
3. Participar;
4. Documentos;
5. Bitácora;
6. Observatorio.

Estas páginas requieren menos lógica interactiva y permiten validar la arquitectura.

## Fase 3 — Nuevas áreas

- Propuestas;
- Conocimiento;
- Investigaciones;
- páginas de detalle;
- criterios y transparencia;
- accesibilidad y privacidad.

## Fase 4 — Estado que Cumple

- crear portada resumida;
- dividir capítulos;
- mover herramientas;
- migrar datos;
- agregar bibliografía y fuentes;
- conservar anclas antiguas mediante enlaces o redirecciones.

## Fase 5 — Verificación

- comparar todas las rutas;
- probar móvil, teclado y zoom;
- verificar sitemap, metadatos y enlaces;
- comprobar que no haya contenido perdido;
- compilar las rutas completas;
- activar despliegue por GitHub Actions solamente cuando exista paridad funcional.

---

# 10. Prioridades inmediatas

1. No desplegar todavía la versión Astro.
2. Aprobar la jerarquía Carlos → CAMS → Estado que Cumple.
3. Simplificar la portada.
4. ampliar y humanizar la página CAMS;
5. crear Propuestas e Investigaciones;
6. separar Estado que Cumple en capítulos;
7. retirar materiales planeados de la biblioteca pública principal;
8. convertir el Observatorio en un piloto concreto;
9. publicar artículos reales antes de mostrarlos como entradas;
10. convertir Participar en acciones disponibles;
11. construir una tabla real de versiones;
12. migrar a Astro por fases y no mediante reemplazo total.

---

## 11. Definición final del producto

CAMS debe sentirse como una **plataforma pública personal de investigación, propuestas e incidencia**, no como:

- una entidad pública;
- una organización ficticia;
- una hoja de vida aislada;
- un blog genérico;
- un micrositio dedicado únicamente a Estado que Cumple;
- un catálogo de proyectos todavía inexistentes.

La experiencia final debe permitir distinguir con claridad:

- quién habla;
- qué está proponiendo;
- con qué evidencia;
- en qué estado se encuentra cada contenido;
- cómo se puede verificar;
- cómo se puede corregir o discutir.

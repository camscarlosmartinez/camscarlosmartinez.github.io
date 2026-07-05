# CAMS | Estado que Cumple

Sitio público estático de Carlos Arturo Martínez Sánchez. CAMS funciona como archivo documental, laboratorio institucional, observatorio ciudadano y espacio de participación alrededor de capacidad pública.

## Enfoque

`Estado que Cumple` es una propuesta ciudadana, académica, técnica y programática. No es una política oficial adoptada, no sustituye competencias constitucionales o legales y no debe presentarse como directriz vigente de ningún gobierno.

La propuesta usa el horizonte 2026-2030 como escenario de discusión pública, pero el sitio debe mantenerse durable: archivo abierto, incidencia, seguimiento ciudadano, comentarios, voluntariado, documentos y bitácora.

## Estructura

- `/` portada institucional y rutas principales.
- `/estado-que-cumple/` propuesta central, núcleo RAÍCES/SAVIA/SEMILLAS, rutas de activación y límites.
- `/documentos/` archivo de trabajos, informes, matrices y policy papers.
- `/observatorio/` prototipos de seguimiento ciudadano y tableros futuros.
- `/bitacora/` notas breves para debate público.
- `/participar/` comentarios, suscripción por habilitar y voluntariado.
- `/archivo/` repositorios, redes públicas, enlaces y estados de publicación.

## Documento publicado

- `assets/documentos/estado-que-cumple-2026-2030.pdf`: documento técnico-político de discusión pública sobre Estado que Cumple.

## Cómo editar

El sitio usa HTML, CSS y JavaScript puro. No usa frameworks, npm ni dependencias externas.

Para probar localmente:

```bash
python -m http.server 5500
```

Luego abrir:

```text
http://localhost:5500
```

## Flujo de publicación

Antes de publicar:

```bash
git status
git diff
git add .
git commit -m "mensaje"
git push
```

## Reglas editoriales

- No publicar datos personales sensibles, cédulas, teléfonos ni información de terceros.
- No usar enlaces falsos con `href="#"`.
- Si algo no tiene backend, marcarlo como `por habilitar`, `en preparación` o `por conectar`.
- Todo documento público debe tener fecha, versión, resumen, palabras clave y forma de citación.
- Mantener lenguaje de propuesta ciudadana, discusión técnica, incidencia y seguimiento público.

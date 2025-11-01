<h1>
  <img src="img/icon24.png"/> FreshView for YouTube™
</h1>

FreshView for YouTube™ is a [Chrome](https://chrome.google.com/webstore/detail/freshview-for-youtube/eckknmnfoohbeklmjlidmfdlakndcfkm) and [Firefox](https://addons.mozilla.org/en-US/firefox/addon/freshview-for-youtube/) extension that hides watched YouTube™ videos.

⚠️ **This project is no longer maintained. Thank you to everyone who contributed their thoughts and ideas!** ⚠️

## Features

* *Simple* - Intuitive user interface, design, and controls.
* *Convenient* - Choose the minimum view progress of a watched video.
* *Customizable* - Select which types of videos should never be hidden by the extension.

## Installation

The easiest way to install this extension is to follow the instructions on the
[Chrome Web Store](https://chrome.google.com/webstore/detail/freshview-for-youtube/eckknmnfoohbeklmjlidmfdlakndcfkm) or [Add-ons for Firefox](https://addons.mozilla.org/en-US/firefox/addon/freshview-for-youtube/) pages. This is the preferred way to add the latest,
stable version of the extension to your browser.

> **Note:** The Chrome Web Store supports Google Chrome, Microsoft Edge, and
> other Chromium-based browsers.

To install the extension manually, simply clone this GitHub repository and then
refer to the instructions below.

#### Chrome

1. Navigate to `chrome://extensions` via the URL bar.
2. Ensure the **Developer mode** toggle is activated.
3. Click on **Load unpacked**.
4. Select the directory containing the cloned repository.

#### Firefox

1. Navigate to `about:debugging` via the URL bar.
2. Click on **This Firefox** from the left sidebar.
3. Click on **Load Temporary Add-on...**.
4. Select the [`manifest.json`](manifest.json) file from the cloned repository.

### Pruebas en Chrome Canary y Firefox Nightly

Para verificar que la extensión funciona en las últimas versiones de desarrollo:

Chrome Canary (144+ / MV3):

1. Abrir Canary y navegar a `chrome://extensions`.
2. Activar **Developer mode**.
3. Pulsar **Load unpacked** y seleccionar la carpeta del repositorio clonado.
4. Abrir una pestaña de YouTube y observar el icono de la extensión en la barra.
5. Abrir la vista del Service Worker desde la tarjeta de la extensión (Inspect views) para revisar logs y errores si la extensión no aparece o no funciona.

Firefox Nightly (146+):

1. Abrir Nightly y navegar a `about:debugging#/runtime/this-firefox`.
2. Pulsar **Load Temporary Add-on...** y seleccionar el archivo `manifest.json` en la carpeta del proyecto.
3. Abrir YouTube y comprobar el comportamiento.
4. Si algo falla, usar la consola de la página (Ctrl+Shift+J) y la sección `about:debugging` para ver errores del service worker.

Notas:

- MV3 exige un service worker para Chrome; en Firefox Nightly el soporte MV3 ha avanzado bastante, pero podrían existir diferencias menores en algunas APIs. Si ves errores relacionados con `importScripts` o con el lifecycle del service worker, pégamelos aquí y los reviso.
- Si prefieres un único archivo para el service worker (sin `importScripts`), puedo añadir un pequeño bundler (esbuild) a la repo y generar un `dist/sw.js` listo para MV3.

### Estado: sin dependencias externas (dist incluido)

Este repositorio ya incluye un service worker bundlado en `dist/sw.js`. No necesitas instalar Node, npm ni ejecutar ningún build: simplemente carga la carpeta del repositorio en tu navegador y la extensión funcionará.

Notas rápidas:
- `dist/sw.js` es el service worker final que usa la extensión en `manifest.json`.
- Si no vas a modificar los archivos `js/*.js`, no necesitas tocar nada más.
- Si modificas archivos fuente (`js/*.js`) y quieres que los cambios se reflejen en el SW, edita directamente `dist/sw.js` o pide que yo regenere el bundle; dejaré el código de build fuera para mantener el repo sin dependencias.

El `manifest.json` ya está configurado para usar `dist/sw.js` como `background.service_worker`.

## Guía de pruebas detallada y diagnóstico (qué recoger y cómo pasármelo)

Sigue estos pasos en tu máquina local (recomendado) para probar tanto en Chrome Canary como en Firefox Nightly. Al final indico exactamente qué copiar/adjuntar para que yo pueda reproducir y arreglar cualquier fallo.

1) Preparación
- Asegúrate de tener la copia actual del repo (la carpeta que contiene `manifest.json`).

2) Chrome Canary (MV3)
- Abre `chrome://extensions` y activa *Developer mode*.
- Pulsa *Load unpacked* y selecciona la carpeta del proyecto.
- Abre DevTools para la extensión: en la tarjeta de la extensión, pulsa *Service worker* / *Inspect views* (si aparece). Eso abre DevTools para el service worker.
- Abre una pestaña y visita `https://www.youtube.com`.

Qué recoger en Chrome (copia y pégalo o adjunta los ficheros):
- Captura (o copia) de la consola del *Service Worker* (DevTools): todas las líneas de `console.log` y los errores/stack traces.
- Captura (o copia) de la consola de la pestaña de YouTube (Ctrl+Shift+I → Console), por si el content script lanza errores.
- El *manifest.json* que hayas cargado (por si has hecho cambios locales).
- Notas: qué versión exacta de Chrome Canary usaste (Help → About).

3) Firefox Nightly
- Abre `about:debugging#/runtime/this-firefox` → *Load Temporary Add-on...* → selecciona el `manifest.json` en la carpeta del repo.
- Después de cargar la extensión, pulsa *Inspect* en la tarjeta de la extensión para abrir la consola del service worker/extension.
- Abre YouTube en una pestaña y reproduce el flujo.

Qué recoger en Firefox (copia y pégalo o adjunta los ficheros):
- Texto completo de la consola de la *Extension / Service Worker* (errores y logs).
- Consola de la página de YouTube (Ctrl+Shift+J) si hay errores en el content script.
- Si `web-ext` o `addons-linter` devolvieron mensajes durante tus pruebas, copia los errores/warnings completos.

4) Mensajes útiles para cada fallo
- "No se habilita el icono": copia la consola del SW y la salida de `chrome.runtime.lastError` si aparece.
- "ImportScripts falla": copia el error exacto del SW console (típicamente referencia a la ruta y el tipo de fallo).
- "Mensajes no llegan": revisa que el content script ejecuta `chrome.runtime.sendMessage({type: 'showPageAction'})` (puedes añadir temporalmente `console.log` en `js/injection.js`) y copia ambas consolas.

5) Cómo pasarme la información
- Copia/pega aquí (en el chat) las secciones de consola relevantes. Si son muy largas, sube a un gist o archivo en pastebin y pega el enlace.
- Adjunta (o pega) el `manifest.json` usado y la versión exacta del navegador.

6) Opcional — Bundling del Service Worker
- Si prefieres no depender de `importScripts` en el SW, puedo añadir un pequeño `package.json` y un script que use `esbuild` para generar `dist/sw.js` con todo el código del SW bundlado (recomendado para producción). Dime si lo quieres y lo preparo.

Si ya prefieres que empiece con ajustes adicionales (por ejemplo: añadir logs más explícitos dentro del SW, o añadir un `build` con `esbuild`), dime y hago esos cambios ahora.

---

## Notas finales — Migración, build y checklist rápido (ES)

He realizado una migración mínima para que la extensión funcione en entornos MV3 y añadí un build sencillo para generar un único service worker bundlado. Esta sección resume los cambios y te da un checklist final y comandos para probar localmente.

1) Resumen de cambios aplicados
- Migración a Manifest V3: `manifest.json` actualizado con `manifest_version: 3`.
- Background en MV3: ahora `background.service_worker` apunta a `dist/sw.js` (archivo generado).
- `page_action` reemplazado por `action` y llamadas en `js/background.js` adaptadas a `chrome.action`.
- Bundling mínimo: añadí `scripts/build-sw.js` y `package.json` con el script `npm run build:sw` que concatena los ficheros en `dist/sw.js`.
- Metadatos Gecko: añadida la clave `browser_specific_settings.gecko.data_collection_permissions` para reducir advertencias del validador.

2) Files importantes (qué hay ahora)
- `manifest.json` — metadata y apunta a `dist/sw.js`.
- `dist/sw.js` — service worker bundlado (generado). Si modificas `js/*.js`, regenera antes de probar.
- `scripts/build-sw.js` — script simple que concatena `js/constants.js`, `js/logger.js`, `js/storage.js`, `js/background.js`.
- `js/sw.js` — entrada antigua con `importScripts` (mantenida para referencia, pero el manifest ya usa `dist/sw.js`).

3) Comandos mínimos (copiar/pegar)

Generar el SW bundlado:
```bash
# desde la raíz del repo
npm run build:sw
# o, si no usas npm
node scripts/build-sw.js
```

Cargar la extensión en Chrome Canary:
```bash
# Manual: chrome://extensions -> Load unpacked -> seleccionar la carpeta del repo
# Opcional (arrancar Canary con debugging):
#/usr/bin/google-chrome-canary --user-data-dir=/tmp/freshview-canary --remote-debugging-port=9222
```

Cargar la extensión en Firefox Nightly:
```text
# about:debugging -> This Firefox -> Load Temporary Add-on... -> seleccionar manifest.json
```

4) Cómo activar logs detallados (recomendado para depuración)
- Edita `js/logger.js` y cambia las líneas al final del fichero:
```js
Logger.ENABLED = true;
Logger.VERBOSE = true;
```
- Luego vuelve a generar el bundle:
```bash
npm run build:sw
```

5) Qué recopilar y pegar en el chat (exacto)
- Consola completa del Service Worker (DevTools -> Inspect service worker) — pega el texto o sube a un gist.
- Consola de la pestaña de YouTube (DevTools) si hay errores en content scripts.
- Contenido del `manifest.json` cargado (pegarlo aquí) y la versión exacta del navegador (Help → About).
- Si ejecutaste `web-ext lint` o el validador, pega la salida completa.

6) Problemas comunes y soluciones rápidas
- Error: "Cannot find dist/sw.js" → ejecuta `npm run build:sw` y vuelve a recargar la extensión.
- Error: SW no aparece / no se registra → recarga la extensión en `chrome://extensions` y mira la consola del navegador.
- Error: `chrome.action`/`chrome.runtime.lastError` → copia la traza completa del error (archivo y número de línea aparece en DevTools en `dist/sw.js`).

7) Siguiente paso (si quieres que yo haga más)
- Puedo añadir minificación y bundling con `esbuild` (workflow más robusto) — lo dejo listo si lo pides.
- Puedo revertir temporalmente el manifest para usar `js/sw.js` con `importScripts` si prefieres no usar el bundle en desarrollo.

Gracias — cuando hagas las pruebas pásame las consolas y los errores y yo aplicaré los cambios necesarios.

## Support

* Source Code: https://github.com/Mandrenkov/FreshView
* Issue Tracker: https://github.com/Mandrenkov/FreshView/issues

If you are having problems or would like to suggest a feature, please create an
issue using the GitHub issue tracker.

## License

FreshView for YouTube™ is **free** and **open source**, released under the
[GNU Public License v3.0](https://www.gnu.org/licenses/gpl-3.0.en.html).

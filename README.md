# Página de descarga: Tierralma, Grieta y Cartas al Aire

Página pública para descargar **Tierralma**, **Grieta** y **Cartas al Aire** (antes Rompehielo) para Android (gratis, sin cuenta y sin internet).
Se publica con GitHub Pages desde la rama `main`.

- Los APK viven en `descargas/` (el repositorio del juego es privado, por eso se copian aquí).
  Salen del flujo «Juegos (APK propio)» del repositorio `neonplay` (Releases `tierralma-N` y `grieta-N`).
  Rompehielo sale del flujo «APK de Rompehielo» de `neonplay`, que deja el APK en la rama `descarga-rompehielo`.
- Al subir un APK nuevo: reemplazar el archivo en `descargas/` y actualizar versión, fecha, tamaño y huella
  (`sha256sum descargas/*.apk`) en `pagina.js`.
- `tierralma/`: la ventana del juego (video, fotos, `objetos.js` e `iconos.png`). Los objetos se regeneran desde el repositorio `neonplay` con
  `node scripts/tierralma-objetos-pdf.cjs --web ../neonplay-web/tierralma` (con el juego servido en el puerto 8765).
- `privacidad.html`: aviso de privacidad de los juegos (el que va en Google Play; actualizado el 3-oct-2026). `legal.html` es el de NEONPLAY, que está en pausa.
- Tests para compartir: `match/` («¿Hacemos match?»), `conoces/` («¿Qué tanto me conoces?») y `amigos/` («¿Somos mejores amigos?»).
  Las tres páginas se generan con `python3 match/paginas.py` desde `match/plantilla.html`; las preguntas están en `match/tests.js`
  y el motor en `match/motor.js`. Usan las funciones `match_*` de Supabase (producción) de `supabase/31_match.sql` del repositorio
  `neonplay`; si el servidor no responde, el test viaja dentro del enlace. Conteo de jugadores: `select * from private.match_conteo();`.
- Las descargas directas ya no se muestran: «Quiero probarlo» lleva al formulario de testers (`formularioTesters` en `pagina.js`)
  y los APK de `descargas/` se mandan por enlace a quien se registra.

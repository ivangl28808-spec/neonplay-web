# Cómo hacer la muestra de un negocio (menos de 1 hora)

Solo se edita **un archivo**: `negocios/<nombre>.js`. El resto (`index.html`, `css/`, `js/`) no se toca.

## Antes de empezar (10 min)

Junta esto del negocio. Casi todo sale de su Facebook, de Google Maps o de una foto de su menú o lista de precios:

- Nombre, giro (fonda, barbería, taller…) y una frase que lo describa.
- Servicios o platillos **con precio**.
- Horario de cada día.
- Dirección y una referencia («frente al mercado»).
- WhatsApp del negocio (10 dígitos).
- 3 a 6 fotos. **Solo fotos que el negocio te dé o te autorice a usar.** No copies fotos de internet ni de su Facebook sin permiso.

## Pasos (30–40 min)

1. **Copia la muestra.** Duplica `negocios/ejemplo.js` y ponle un nombre corto, en minúsculas y sin espacios ni acentos: `negocios/fonda-dona-mary.js`.
2. **Cambia los textos**: `nombre`, `tipo`, `ciudad`, `lema` y `descripcion`. Respeta las comillas `'…'` y las comas del final de cada línea.
3. **Colores**: `principal` (cabecera, títulos y precios) y `acento` (detalles). Usa el color de su letrero o de su logo. Tienen que ser oscuro y claro, como en la muestra, para que se lea bien.
4. **Menú o servicios**: cada categoría lleva su `titulo` y sus `productos`, cada uno con `nombre` y `precio` (número, sin «$»). Si dicen «Servicios» en vez de «Menú», cambia `tituloMenu`.
5. **Horario**: cada día es una lista de turnos con hora de 24 h: `[['09:00', '18:00']]`. Cerrado: `[]`. Abre en dos turnos: `[['09:00', '14:00'], ['17:00', '21:00']]`. Si cierra pasada la medianoche, se pone igual: `[['18:00', '02:00']]`.
6. **Ubicación**: `direccion`, `referencia` y `mapa`. En `mapa` pon el nombre del negocio tal como sale en Google Maps (así el botón «Cómo llegar» abre su ficha). Si no aparece en Maps, pon la dirección.
7. **Fotos**: guárdalas en `img/<nombre>/` (JPG de menos de 300 KB cada una, para que cargue rápido con datos móviles) y ponlas en `portada` y `fotos`, cada una con un `texto` corto.
8. **WhatsApp**:
   - En la **muestra**, déjalo vacío (`whatsapp: ''`) y `ejemplo: true`. Así el botón no le escribe a nadie y arriba sale «Página de ejemplo».
   - En la **página real** (ya pagada): pon su número y `ejemplo: false`.

## Revisar (10 min)

Abre `index.html?n=<nombre>`, por ejemplo `…/?n=fonda-dona-mary`, en tu celular y comprueba:

- [ ] Nombre, precios y horario sin errores de dedo (compáralo con su menú o lista).
- [ ] «Abierto ahora» o «Cerrado ahora» cuadra con la hora real.
- [ ] «Cómo llegar» abre el lugar correcto en Google Maps.
- [ ] Las fotos se ven bien y son del negocio.

Si la página dice «No se encontró negocios/…», el nombre del enlace no coincide con el del archivo. Si dice «El archivo de datos no define window.NEGOCIO», casi siempre falta una coma o una comilla en el archivo de datos.

## Reglas

- Una muestra con datos de un negocio **real** no se publica hasta que el dueño acepte.
- Nada de prometer clientes ni posiciones en Google.

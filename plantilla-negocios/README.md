# Plantilla de página para negocio local

Página de una sola pantalla para negocios pequeños (fondas, barberías, talleres, consultorios…): portada, menú o servicios con precios, horario con «Abierto ahora», ubicación con enlace a Google Maps, fotos y botón de WhatsApp.

- Pensada primero para celular. Sin dependencias, sin fuentes externas y sin nada incrustado de terceros (CSP `default-src 'self'`).
- Cada negocio es un archivo de datos: `negocios/<nombre>.js`. La página se elige con `?n=<nombre>`; sin `?n=`, sale `negocios/ejemplo.js`.
- Todo el contenido se pinta con `textContent`, así que lo que se escriba en los datos nunca se interpreta como HTML.
- «Abierto ahora» usa la hora de México (`America/Mexico_City`) aunque el teléfono esté en otra zona. Admite varios turnos por día y turnos que pasan de medianoche.

Muestras incluidas, las dos con **negocios inventados**:

| Enlace | Negocio |
|---|---|
| `?n=ejemplo` | Barbería Los Volcanes (con ilustraciones en vez de fotos) |
| `?n=taqueria-ejemplo` | Tacos El Ahuehuete (sin fotos, horario nocturno) |

Para hacer una nueva: [COMO-HACER-UNA-MUESTRA.md](COMO-HACER-UNA-MUESTRA.md).

## Probarla en local

```sh
python3 -m http.server 8000
# http://localhost:8000/?n=ejemplo
```

## Estructura

```
index.html                 estructura de la página (no se edita)
css/estilo.css             estilos; los colores salen de los datos
js/pagina.js               carga los datos y pinta la página (no se edita)
negocios/<nombre>.js       datos de cada negocio (lo único que se edita)
img/                       fotos e ilustraciones
```

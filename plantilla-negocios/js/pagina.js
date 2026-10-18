// js/pagina.js — pinta la página a partir de los datos de un negocio (negocios/<nombre>.js).
// No hace falta tocar este archivo para una muestra nueva: ver COMO-HACER-UNA-MUESTRA.md.
// Todo el texto se pone con textContent: nada de los datos se interpreta como HTML.
'use strict';

const $ = id => document.getElementById(id);
const DIAS = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
const NOMBRE_DIA = { lunes: 'Lunes', martes: 'Martes', miercoles: 'Miércoles', jueves: 'Jueves', viernes: 'Viernes', sabado: 'Sábado', domingo: 'Domingo' };
const ZONA = 'America/Mexico_City';

// ---------- Cargar el archivo de datos: ?n=<nombre> (por defecto, «ejemplo») ----------
const nombreArchivo = (new URLSearchParams(location.search).get('n') || 'ejemplo').toLowerCase();
if (!/^[a-z0-9-]{1,60}$/.test(nombreArchivo)) fallo('El nombre del negocio en el enlace no es válido.');
else {
  const s = document.createElement('script');
  s.src = `negocios/${nombreArchivo}.js`;
  s.onload = () => (window.NEGOCIO ? pintar(window.NEGOCIO) : fallo('El archivo de datos no define window.NEGOCIO.'));
  s.onerror = () => fallo(`No se encontró negocios/${nombreArchivo}.js.`);
  document.head.append(s);
}

function fallo(texto) {
  document.title = 'Página no disponible';
  $('error').textContent = texto;
  $('error').hidden = false;
  document.querySelector('.portada').hidden = true;
  document.querySelector('.menu-nav').hidden = true;
  document.querySelector('main').hidden = true;
  $('waFlotante').hidden = true;
}

// ---------- Utilidades ----------
const precio = n => (typeof n === 'number'
  ? n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: Number.isInteger(n) ? 0 : 2 })
  : String(n ?? ''));
const minutos = hhmm => { const [h, m] = String(hhmm).split(':').map(Number); return h * 60 + (m || 0); };
const hora12 = hhmm => {
  const [h, m] = String(hhmm).split(':').map(Number);
  const sufijo = h < 12 || h === 24 ? 'a. m.' : 'p. m.';
  return `${((h + 11) % 12) + 1}${m ? ':' + String(m).padStart(2, '0') : ''} ${sufijo}`;   // «6 p. m.», «6:30 p. m.»
};
function el(etiqueta, clase, texto) {
  const e = document.createElement(etiqueta);
  if (clase) e.className = clase;
  if (texto != null) e.textContent = texto;
  return e;
}
function mostrarAviso(texto) {
  const t = $('toast');
  t.textContent = texto; t.hidden = false;
  clearTimeout(mostrarAviso.t); mostrarAviso.t = setTimeout(() => { t.hidden = true; }, 4000);
}

// Día de la semana y minutos actuales en la hora de México (aunque el teléfono esté en otra zona)
function ahoraEnMexico() {
  const partes = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: ZONA, weekday: 'long', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
    .formatToParts(new Date()).map(p => [p.type, p.value]));
  const ingles = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  return { dia: ingles.indexOf(partes.weekday.toLowerCase()), min: Number(partes.hour) * 60 + Number(partes.minute) };
}

// ¿Abierto ahora? Un día puede tener varios turnos y un turno puede pasar de medianoche (p. ej. 18:00–02:00).
function estaAbierto(horario, ahora) {
  const turnos = d => (horario[DIAS[(d + 7) % 7]] || []);
  for (const [abre, cierra] of turnos(ahora.dia)) {
    const a = minutos(abre), c = minutos(cierra);
    if (c > a ? ahora.min >= a && ahora.min < c : ahora.min >= a) return true;
  }
  for (const [abre, cierra] of turnos(ahora.dia - 1)) {   // turno de ayer que sigue abierto pasada la medianoche
    if (minutos(cierra) <= minutos(abre) && ahora.min < minutos(cierra)) return true;
  }
  return false;
}

// ---------- Pintar ----------
function pintar(n) {
  const raiz = document.documentElement.style;
  if (n.colores?.principal) raiz.setProperty('--principal', n.colores.principal);
  if (n.colores?.acento) raiz.setProperty('--acento', n.colores.acento);
  document.querySelector('meta[name="theme-color"]').content = n.colores?.principal || '#1F2937';

  document.title = `${n.nombre}${n.tipo ? ' · ' + n.tipo : ''}${n.ciudad ? ' en ' + n.ciudad : ''}`;
  document.querySelector('meta[name="description"]').content = n.descripcion || n.lema || '';
  $('avisoEjemplo').hidden = !n.ejemplo;

  // Portada
  $('tipo').textContent = [n.tipo, n.ciudad].filter(Boolean).join(' · ');
  $('nombre').textContent = n.nombre;
  $('lema').textContent = n.lema || '';
  if (n.portada) { $('portadaFoto').src = n.portada; $('portadaFoto').alt = n.portadaTexto || ''; $('portadaFoto').hidden = false; }

  // WhatsApp y teléfono (10 dígitos de México; se antepone 52)
  const digitos = String(n.whatsapp || '').replace(/\D/g, '');
  const enlaceWa = digitos.length === 10 ? `https://wa.me/52${digitos}?text=${encodeURIComponent(n.mensajeWhatsApp || `Hola, vi su página de ${n.nombre}.`)}` : '';
  for (const b of [$('btnWhats'), $('waFlotante')]) {
    if (enlaceWa) b.href = enlaceWa;
    else {
      // muestra sin número: el botón no lleva a nadie, solo explica lo que hará en la página real
      b.removeAttribute('target');
      b.addEventListener('click', e => { e.preventDefault(); mostrarAviso('En la página real, este botón abre el WhatsApp del negocio con un mensaje ya escrito.'); });
    }
  }
  if (n.textoBotonWhatsApp) $('btnWhats').textContent = n.textoBotonWhatsApp;
  const tel = String(n.telefono || '').replace(/\D/g, '');
  if (tel.length === 10) { $('btnLlamar').href = `tel:+52${tel}`; $('btnLlamar').hidden = false; }

  // Extras (para llevar, estacionamiento, formas de pago…)
  for (const x of n.extras || []) $('extras').append(el('li', null, x));
  $('extras').hidden = !(n.extras || []).length;

  // Menú o servicios
  $('tituloCarta').textContent = n.tituloMenu || 'Menú';
  $('navCarta').textContent = n.tituloMenu || 'Menú';
  for (const cat of n.menu || []) {
    const caja = el('div', 'categoria');
    caja.append(el('h3', null, cat.titulo));
    if (cat.nota) caja.append(el('p', 'nota', cat.nota));
    const lista = el('ul', 'productos');
    for (const p of cat.productos || []) {
      const li = el('li', 'producto');
      li.append(el('span', 'p-nombre', p.nombre), el('span', 'p-precio', precio(p.precio)));
      if (p.detalle) li.append(el('span', 'p-detalle', p.detalle));
      lista.append(li);
    }
    caja.append(lista);
    $('categorias').append(caja);
  }
  $('carta').hidden = !(n.menu || []).length;
  $('navCarta').hidden = $('carta').hidden;

  // Horario
  const ahora = ahoraEnMexico();
  for (const [i, d] of DIAS.entries()) {
    const turnos = n.horario?.[d] || [];
    const tr = el('tr', i === ahora.dia ? 'hoy' : null);
    const td = el('td', turnos.length ? null : 'cerrado', turnos.length ? null : 'Cerrado');
    // cada hora va entera en su línea; si no cabe, el salto cae entre «abre» y «cierra»
    turnos.forEach(([a, c], k) => {
      if (k) td.append(el('br'));
      td.append(el('span', null, hora12(a)), ' – ', el('span', null, hora12(c)));
    });
    tr.append(el('th', null, NOMBRE_DIA[d]), td);
    $('tablaHorario').append(tr);
  }
  if (n.horario) {
    const abierto = estaAbierto(n.horario, ahora);
    $('estado').textContent = abierto ? 'Abierto ahora' : 'Cerrado ahora';
    $('estado').classList.toggle('abierto', abierto);
    $('estado').hidden = false;
  }

  // Ubicación: enlace a Google Maps (no se incrusta nada de terceros)
  $('direccion').textContent = n.direccion || '';
  if (n.referencia) { $('referencia').textContent = n.referencia; $('referencia').hidden = false; }
  const consulta = n.mapa || n.direccion;
  if (consulta) $('btnMapa').href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(consulta)}`;
  else $('btnMapa').hidden = true;
  $('ubicacion').hidden = !n.direccion && !consulta;

  // Fotos
  for (const f of n.fotos || []) {
    const fig = el('figure');
    const img = el('img'); img.src = f.src; img.alt = f.texto || ''; img.loading = 'lazy';
    fig.append(img);
    if (f.texto) fig.append(el('figcaption', null, f.texto));
    $('galeria').append(fig);
  }
  $('fotos').hidden = !(n.fotos || []).length;
  $('navFotos').hidden = $('fotos').hidden;

  // Pie
  $('pieNombre').textContent = `${n.nombre}${n.ciudad ? ' · ' + n.ciudad : ''}`;
  for (const [i, r] of (n.redes || []).entries()) {
    if (!/^https:\/\//.test(r.url)) continue;   // solo enlaces https
    if (i) $('redes').append(' · ');
    const a = el('a', null, r.nombre); a.href = r.url; a.target = '_blank'; a.rel = 'noopener';
    $('redes').append(a);
  }
}

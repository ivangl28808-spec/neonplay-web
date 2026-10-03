// pagina.js — datos de las descargas de cada juego. Al subir un APK nuevo a descargas/, actualizar aquí
// la versión, la fecha, el tamaño y la huella (sha256sum descargas/*.apk).
'use strict';
const JUEGOS = {
  tierralma: { version: 'de prueba 5', fecha: '2026-10-03', bytes: 16324155, sha256: 'b324a34940cf49303990212e0d9c6d3e475107cbfd77a06bc294483aae7bf79f' },
  grieta: { version: 'de prueba 4', fecha: '2026-10-01', bytes: 5895865, sha256: 'beef7f3d5047b375701d1e0235a9e6368524ec3b5c88068fdcb2971136fb2304' }
};
const CONFIG = {
  contacto: '',   // correo para reportar problemas (vacío = no se muestra)
  creditos: ''    // por ejemplo «Hecho en México por …» (vacío = texto neutro)
};

const mb = b => (b / 1048576).toLocaleString('es-MX', { maximumFractionDigits: 1 }) + ' MB';
const fecha = iso => new Date(iso + 'T12:00:00').toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });
for (const [id, j] of Object.entries(JUEGOS)) {
  const info = document.querySelector(`[data-info="${id}"]`), huella = document.querySelector(`[data-huella="${id}"]`);
  const partes = [];
  if (j.version) partes.push(`Versión ${j.version}`);
  if (j.fecha) partes.push(`actualizada el ${fecha(j.fecha)}`);
  if (j.bytes) partes.push(mb(j.bytes));
  if (info && partes.length) info.textContent = `${partes.join(' · ')} · gratis · Android 7 o superior`;
  if (huella && j.sha256) huella.textContent = j.sha256;
}
if (CONFIG.contacto) {
  const a = document.createElement('a'); a.href = 'mailto:' + CONFIG.contacto; a.textContent = 'Reportar un problema';
  document.getElementById('contacto').append(' · ', a);
}
if (CONFIG.creditos) document.getElementById('creditos').textContent = CONFIG.creditos;

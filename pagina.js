// pagina.js — datos de las descargas de cada juego. Al subir un APK nuevo a descargas/, actualizar aquí
// la versión, la fecha, el tamaño y la huella (sha256sum descargas/*.apk).
'use strict';
const JUEGOS = {
  tierralma: { version: 'de prueba 4', fecha: '2026-10-01', bytes: 13633846, sha256: '65c0aadf896675c258f8d941fae1b4e43a00e02244a8735d9f2904d1c1a3d2f3' },
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

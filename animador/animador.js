// Página de descarga de Animador: lee la ficha de la última versión (la misma que consulta el botón
// «Buscar actualización» de la app) y la muestra.
'use strict';
(async () => {
  const $ = (id) => document.getElementById(id);
  try {
    const r = await fetch('../descargas/animador.json?t=' + Date.now(), { cache: 'no-store' });
    if (!r.ok) throw new Error(r.status);
    const f = await r.json();
    const version = typeof f.version === 'string' ? f.version : '';
    const fecha = typeof f.fecha === 'string' ? new Date(f.fecha + 'T12:00:00').toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
    const mb = Number.isFinite(f.bytes) ? (f.bytes / 1048576).toLocaleString('es-MX', { maximumFractionDigits: 1 }) + ' MB' : '';
    $('estado').textContent = version ? `Última versión: ${version}` : 'Última versión';
    $('datos').textContent = [fecha && `publicada el ${fecha}`, mb].filter(Boolean).join(' · ');
    const notas = Array.isArray(f.notas) ? f.notas.filter((x) => typeof x === 'string') : [];
    if (notas.length) {
      for (const n of notas) { const li = document.createElement('li'); li.textContent = n; $('novedades').appendChild(li); }
      $('novedadesCaja').hidden = false;
    }
  } catch {
    $('estado').textContent = 'Descarga la última versión';
  }
})();

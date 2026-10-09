// pagina.js — datos de las descargas de cada juego. Al subir un APK nuevo a descargas/, actualizar aquí
// la versión, la fecha, el tamaño y la huella (sha256sum descargas/*.apk).
'use strict';
const JUEGOS = {
  tierralma: { version: 'de prueba 5', fecha: '2026-10-03', bytes: 16324155, sha256: 'b324a34940cf49303990212e0d9c6d3e475107cbfd77a06bc294483aae7bf79f' },
  grieta: { version: 'de prueba 4', fecha: '2026-10-01', bytes: 5895865, sha256: 'beef7f3d5047b375701d1e0235a9e6368524ec3b5c88068fdcb2971136fb2304' },
  rompehielo: { version: 'de prueba 3', fecha: '2026-10-07', bytes: 3190912, sha256: '7d3cd833c262fc8db982aea63e35226c29516e77d6323e8406266f8639cd5ac3' }
};
const CONFIG = {
  contacto: '',   // correo para reportar problemas (vacío = no se muestra)
  creditos: ''    // por ejemplo «Hecho en México por …» (vacío = texto neutro)
};

const mb = b => (b / 1048576).toLocaleString('es-MX', { maximumFractionDigits: 1 }) + ' MB';
const fecha = iso => new Date(iso + 'T12:00:00').toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });
for (const [id, j] of Object.entries(JUEGOS)) {
  const infos = document.querySelectorAll(`[data-info="${id}"]`), huella = document.querySelector(`[data-huella="${id}"]`);
  const partes = [];
  if (j.version) partes.push(`Versión ${j.version}`);
  if (j.fecha) partes.push(`actualizada el ${fecha(j.fecha)}`);
  if (j.bytes) partes.push(mb(j.bytes));
  if (partes.length) for (const info of infos) info.textContent = `${partes.join(' · ')} · gratis · Android 7 o superior`;
  if (huella && j.sha256) huella.textContent = j.sha256;
}
if (CONFIG.contacto) {
  const a = document.createElement('a'); a.href = 'mailto:' + CONFIG.contacto; a.textContent = 'Reportar un problema';
  document.getElementById('contacto').append(' · ', a);
}
if (CONFIG.creditos) document.getElementById('creditos').textContent = CONFIG.creditos;

// ---------- Ventana de Tierralma: video, fotos y todos los objetos ----------
(() => {
  const v = document.getElementById('vTierralma'), D = window.OBJETOS_TIERRALMA;
  if (!v) return;
  const video = v.querySelector('video');
  const esc = t => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const RZ = { comun: 'Común', poco: 'Poco común', raro: 'Rara', epico: 'Épica', legendario: 'Legendaria' };
  let pintado = false, grupo = -1, rareza = '';
  function pintar() {
    if (!D) { document.getElementById('vjCuenta').textContent = 'No se pudo cargar la lista de objetos.'; return; }
    const q = document.getElementById('vjBuscar').value.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const lista = D.objetos.map((o, k) => [o, k]).filter(([o]) => (grupo < 0 || o.g === grupo) && (!rareza || o.rz === rareza)
      && (!q || (o.n + ' ' + o.d).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(q)));
    document.getElementById('vjCuenta').textContent = `${lista.length} de ${D.objetos.length} objetos`;
    document.getElementById('vjObjetos').innerHTML = lista.map(([o, k]) => `<details class="vj-obj">
      <summary><span class="vj-ico" data-k="${k}"></span>
        <span class="vj-nom">${esc(o.n)}</span><span class="vj-rz ${o.rz}">${RZ[o.rz] || ''}</span></summary>
      <p>${esc(o.d)}</p>
      <dl>${o.f.map(([a, b]) => `<dt>${esc(a)}</dt><dd>${b}</dd>`).join('')}</dl>
    </details>`).join('') || '<p class="muted">Nada con ese nombre.</p>';
    // (la página no permite estilos en línea: la posición de cada ícono se pone por aquí)
    for (const el of document.querySelectorAll('#vjObjetos .vj-ico')) { const k = +el.dataset.k; el.style.backgroundPosition = `${-(k % D.col) * 40}px ${-Math.floor(k / D.col) * 40}px`; el.style.backgroundSize = `${D.col * 40}px auto`; }
  }
  function chips() {
    const g = document.getElementById('vjGrupos'), r = document.getElementById('vjRarezas');
    g.innerHTML = ['Todos', ...D.grupos].map((n, k) => `<button type="button" data-g="${k - 1}" aria-pressed="${k === 0}">${esc(n)}</button>`).join('');
    r.innerHTML = [['', 'Toda rareza'], ...Object.entries(RZ)].map(([k, n]) => `<button type="button" class="${k}" data-r="${k}" aria-pressed="${k === ''}">${n}</button>`).join('');
    g.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; grupo = +b.dataset.g; g.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x === b)); pintar(); });
    r.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; rareza = b.dataset.r; r.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x === b)); pintar(); });
    document.getElementById('vjBuscar').addEventListener('input', pintar);
    document.getElementById('vjVersion').textContent = D.version;
  }
  function abrir(empujar) {
    if (!pintado && D) { chips(); pintar(); pintado = true; }
    if (!v.open) v.showModal();
    document.body.classList.add('sin-scroll');
    if (empujar && location.hash !== '#tierralma-info') history.pushState({ tl: 1 }, '', '#tierralma-info');
    video.preload = 'auto'; const pr = video.play(); if (pr) pr.catch(() => {});
  }
  function cerrar() { video.pause(); if (v.open) v.close(); document.body.classList.remove('sin-scroll'); }
  document.querySelectorAll('[data-abrir-tl]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); abrir(true); }));
  v.querySelector('[data-cerrar-tl]').addEventListener('click', () => (history.state && history.state.tl ? history.back() : (cerrar(), history.replaceState(null, '', '#tierralma'))));
  v.addEventListener('cancel', e => { e.preventDefault(); v.querySelector('[data-cerrar-tl]').click(); });
  v.addEventListener('click', e => { if (e.target === v) v.querySelector('[data-cerrar-tl]').click(); });
  window.addEventListener('popstate', () => (location.hash === '#tierralma-info' ? abrir(false) : cerrar()));
  if (location.hash === '#tierralma-info') abrir(false);
})();

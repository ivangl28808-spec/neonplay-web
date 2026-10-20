// Motor de los tests para compartir (¿Hacemos match?, ¿Qué tanto me conoces?, ¿Somos mejores amigos?).
// Con servidor (Supabase, funciones match_* de supabase/31_match.sql): quien crea el test manda un enlace corto;
// quien lo abre contesta y el resultado les aparece a los dos (a quien lo creó, en esta misma página).
// Sin servidor (si no responde): las respuestas viajan dentro del enlace y el resultado se regresa con otro enlace.
'use strict';
const SERVIDOR = {
  url: 'https://yzmbbjcfcqolgmexljny.supabase.co',
  llave: 'sb_publishable_e69uRUdERcwVlJluZW14bQ_3rOuyG07'   // llave pública (la seguridad está en las funciones del servidor)
};
const TIPO = document.body.dataset.test;
const T = TESTS[TIPO];
const PREGUNTAS = T.preguntas;
const POR_RONDA = 10;
const $ = id => document.getElementById(id);
const VISTAS = ['vInicio', 'vLocal', 'vInvitado', 'vMandar', 'vPasar', 'vPregunta', 'vResultado', 'vError', 'vCargando'];
const ver = id => { VISTAS.forEach(v => { $(v).hidden = v !== id; }); window.scrollTo(0, 0); };
const BASE = location.href.split('#')[0];
const RAIZ = new URL('../', BASE).href;
const enlaceDe = (tipo, h) => new URL('../' + TESTS[tipo].ruta, BASE).href + h;
const el = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };

// ---------- Almacenamiento local (puede no estar disponible) ----------
const guardar = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* sin almacenamiento */ } };
const leer = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } };
// Número al azar de este navegador para contar jugadores sin pedir datos personales.
function dispositivo() {
  let d = leer('neonplay:disp', null);
  if (!/^[0-9a-f-]{36}$/.test(d || '')) { d = crypto.randomUUID ? crypto.randomUUID() : null; if (d) guardar('neonplay:disp', d); }
  return d;
}
const misTests = () => leer('neonplay:tests', []).filter(x => x && x.id && x.llave && TESTS[x.tipo]);
const guardarMio = t => { const l = misTests().filter(x => x.id !== t.id); l.unshift(t); guardar('neonplay:tests', l.slice(0, 20)); };

// ---------- Servidor ----------
async function rpc(fn, args) {
  const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 12000);
  try {
    const r = await fetch(SERVIDOR.url + '/rest/v1/rpc/' + fn, {
      method: 'POST', signal: ctl.signal,
      headers: { apikey: SERVIDOR.llave, 'Content-Type': 'application/json' }, body: JSON.stringify(args)
    });
    const d = await r.json().catch(() => null);
    if (!r.ok) { const e = new Error((d && d.message) || 'error'); e.codigo = d && d.code; e.http = r.status; throw e; }
    return d;
  } finally { clearTimeout(t); }
}

// ---------- Enlaces sin servidor (respaldo) ----------
const cod = o => { const b = new TextEncoder().encode(JSON.stringify(o)); let t = ''; b.forEach(x => { t += String.fromCharCode(x); }); return btoa(t).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); };
const dec = t => { const s = atob(t.replace(/-/g, '+').replace(/_/g, '/')); return JSON.parse(new TextDecoder().decode(Uint8Array.from(s, c => c.charCodeAt(0)))); };
const nombreOk = n => typeof n === 'string' && n.trim().length > 0 && n.length <= 20;
const preguntasOk = q => Array.isArray(q) && q.length >= 1 && q.length <= POR_RONDA * 3 && new Set(q).size === q.length && q.every(i => Number.isInteger(i) && i >= 0 && i < PREGUNTAS.length);
const respOk = (a, q) => Array.isArray(a) && a.length === q.length && a.every((x, k) => Number.isInteger(x) && x >= 0 && x < PREGUNTAS[q[k]][1].length);

// ---------- Estado ----------
// modo: 'local' (mismo celular), 'reto' (contesto y mando), 'invitado' (abrí un enlace), 'ver' (veo un resultado)
let modo = 'local', nombres = ['Persona 1', 'Persona 2'], qs = [], resp = [[], []], usadas = [];
let actual = null;   // { id, llave } del test en el servidor; null = sin servidor

function elegir() {
  let libres = PREGUNTAS.map((_, i) => i).filter(i => !usadas.includes(i));
  if (libres.length < POR_RONDA) { usadas = []; libres = PREGUNTAS.map((_, i) => i); }
  for (let i = libres.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [libres[i], libres[j]] = [libres[j], libres[i]]; }
  qs = libres.slice(0, POR_RONDA); usadas.push(...qs);
}
function ronda() { elegir(); resp = [[], []]; pasar(0); }
function pasar(p) {
  $('pasarTxt').textContent = 'Pásale el celular a ' + nombres[p];
  $('listo').onclick = () => preguntar(p, 0);
  ver('vPasar');
}
const adivina = p => TIPO === 'conoces' && p === 1;
function preguntar(p, k) {
  if (k >= qs.length) { terminar(p); return; }
  const [q, ops] = PREGUNTAS[qs[k]];
  $('quien').textContent = adivina(p) ? nombres[p] + ', adivina qué contestó ' + nombres[0] : nombres[p] + ', contesta sobre ti';
  $('cuenta').textContent = (k + 1) + ' de ' + qs.length;
  $('prog').style.width = (k / qs.length * 100) + '%';
  $('pregunta').textContent = q;
  const caja = $('opciones'); caja.textContent = '';
  ops.forEach((o, j) => {
    const b = el('button', null, o); b.type = 'button';
    b.onclick = () => { resp[p][k] = j; preguntar(p, k + 1); };
    caja.append(b);
  });
  ver('vPregunta');
}
function terminar(p) {
  if (modo === 'local') { if (p === 0) pasar(1); else resultado(); }
  else if (modo === 'reto') crear();
  else contestar();
}

// ---------- Quien crea el test ----------
let enlaceTest = '', espera = null;
async function crear() {
  ver('vCargando');
  try {
    const r = await rpc('match_crear', { p_nombre: nombres[0], p_preguntas: qs, p_resp: resp[0], p_disp: dispositivo(), p_tipo: TIPO });
    actual = { id: r.id, llave: r.llave };
    guardarMio({ id: r.id, llave: r.llave, tipo: TIPO, yo: 'a', nombre: nombres[0], creado: Date.now() });
    enlaceTest = BASE + '#t=' + r.id;
  } catch (e) {
    actual = null;   // sin servidor: el enlace lleva las respuestas
    enlaceTest = BASE + '#t=' + cod({ n: nombres[0], q: qs, a: resp[0] });
  }
  $('mandarEyebrow').textContent = '¡Listo, ' + nombres[0] + '!';
  $('mandarSub').textContent = actual
    ? 'Cuando conteste, el resultado les aparece a los dos. Puedes dejar esta página abierta o volver después.'
    : 'Cuando conteste, le sale el resultado y te lo puede regresar con un botón.';
  $('copiado').hidden = true;
  $('espera').hidden = !actual;
  ver('vMandar');
  if (actual) esperar();
}
function esperar() {
  clearInterval(espera);
  const revisar = async () => {
    if (document.hidden || !actual) return;
    try {
      const r = await rpc('match_resultado', { p_id: actual.id, p_llave: actual.llave });
      if (r && r.contestado) { clearInterval(espera); mostrarServidor(r, 'a'); if (navigator.vibrate) navigator.vibrate(120); }
    } catch (e) { /* se vuelve a intentar */ }
  };
  espera = setInterval(revisar, 5000);
}
const textoReto = () => T.reto(nombres[0]) + ' Contesta ' + qs.length + ' preguntas aquí: ' + enlaceTest;
$('mandarTest').onclick = () => { location.href = 'https://wa.me/?text=' + encodeURIComponent(textoReto()); };
$('copiarTest').onclick = async () => {
  try { await navigator.clipboard.writeText(enlaceTest); $('copiado').hidden = false; }
  catch (e) { window.prompt('Copia este enlace:', enlaceTest); }
};
$('otraApp').onclick = async () => {
  try { if (navigator.share) { await navigator.share({ title: T.titulo, text: T.reto(nombres[0]), url: enlaceTest }); return; } } catch (e) { if (e && e.name === 'AbortError') return; }
  $('copiarTest').click();
};

// ---------- Quien recibe el enlace ----------
async function contestar() {
  if (!actual) { resultado(); return; }   // enlace sin servidor
  ver('vCargando');
  try {
    const r = await rpc('match_contestar', { p_id: actual.id, p_nombre: nombres[1], p_resp: resp[1], p_disp: dispositivo() });
    guardarMio({ id: actual.id, llave: r.llave, tipo: TIPO, yo: 'b', nombre: nombres[1], otro: nombres[0], creado: Date.now() });
    mostrarServidor(r.resultado, 'b');
  } catch (e) {
    error(e.codigo === '23505' ? 'Este test ya lo contestó alguien más.' : 'No se pudieron guardar tus respuestas. Revisa tu internet e intenta de nuevo.',
      e.codigo === '23505' ? null : contestar);
  }
}
function mostrarServidor(r, yo) {
  modo = 'ver'; nombres = [r.nombre_a, r.nombre_b]; qs = r.preguntas; resp = [r.resp_a, r.resp_b];
  resultado(yo);
}

// ---------- Resultado ----------
let ultimo = '';
function resultado(yo) {
  const iguales = qs.filter((_, k) => resp[0][k] === resp[1][k]).length;
  const pct = Math.round(iguales / qs.length * 100);
  if (T.tipoRes === 'aciertos') {
    $('resQuien').textContent = '¿Qué tanto conoce ' + nombres[1] + ' a ' + nombres[0] + '?';
    $('pct').textContent = iguales + '/' + qs.length;
    ultimo = nombres[1] + ' le atinó a ' + iguales + ' de ' + qs.length + ' sobre ' + nombres[0];
  } else {
    $('resQuien').textContent = (TIPO === 'amigos' ? 'Amistad de ' : 'Compatibilidad de ') + nombres[0] + ' y ' + nombres[1];
    $('pct').textContent = pct + '%';
    ultimo = nombres[0] + ' y ' + nombres[1] + ' salimos ' + pct + '% en «' + T.titulo + '»';
  }
  $('veredicto').textContent = T.veredicto(pct);
  const d = $('detalle'); d.textContent = '';
  qs.forEach((i, k) => {
    const [q, ops] = PREGUNTAS[i], si = resp[0][k] === resp[1][k];
    const f = el('div', 'fila ' + (si ? 'si' : 'no'));
    const s = T.tipoRes === 'aciertos'
      ? (si ? 'Le atinó: ' + ops[resp[0][k]] : nombres[0] + ': ' + ops[resp[0][k]] + ' · ' + nombres[1] + ' dijo: ' + ops[resp[1][k]])
      : (si ? 'Los dos: ' + ops[resp[0][k]] : nombres[0] + ': ' + ops[resp[0][k]] + ' · ' + nombres[1] + ': ' + ops[resp[1][k]]);
    f.append(el('b', null, q), el('span', null, s)); d.append(f);
  });
  // Sin servidor, quien contestó le regresa el resultado a quien lo mandó.
  $('mandarRes').hidden = !(modo === 'invitado' && !actual);
  $('mandarRes').textContent = 'Mandarle el resultado a ' + nombres[0];
  $('otra').hidden = modo !== 'local';
  $('avisoAmbos').hidden = !yo;
  if (yo) $('avisoAmbos').textContent = yo === 'a' ? '✓ ' + nombres[1] + ' ya contestó tu test.' : '✓ ' + nombres[0] + ' también ve este resultado en su celular.';
  ver('vResultado');
  pintarMios();
}
$('mandarRes').onclick = () => {
  const url = BASE + '#r=' + cod({ n: nombres, q: qs, a: resp });
  location.href = 'https://wa.me/?text=' + encodeURIComponent('Ya contesté tu test 💞 ' + ultimo + '. Míralo aquí: ' + url);
};
$('compartir').onclick = async () => {
  const texto = ultimo + '. ¿Y ustedes?';
  try { if (navigator.share) { await navigator.share({ title: T.titulo, text: texto, url: BASE }); return; } } catch (e) { if (e && e.name === 'AbortError') return; }
  location.href = 'https://wa.me/?text=' + encodeURIComponent(texto + ' ' + BASE);
};

function error(txt, reintentar) {
  $('errTxt').textContent = txt;
  $('errReintentar').hidden = !reintentar;
  $('errReintentar').onclick = reintentar;
  ver('vError');
}

// ---------- Mis tests (en este navegador) ----------
async function pintarMios() {
  const caja = $('mios'), l = misTests();
  $('miosCaja').hidden = !l.length;
  if (!l.length) return;
  caja.textContent = '';
  for (const t of l.slice(0, 8)) {
    const a = el('a', 'mio'); a.href = enlaceDe(t.tipo, '#ver=' + t.id);
    const n = el('span', 'mio-n', TESTS[t.tipo].icono + ' ' + TESTS[t.tipo].titulo);
    const e = el('span', 'mio-e', t.yo === 'a' ? 'Esperando respuesta…' : 'Con ' + (t.otro || '…'));
    a.append(n, e); caja.append(a);
    if (t.yo === 'a' && !t.listo) rpc('match_resultado', { p_id: t.id, p_llave: t.llave }).then(r => {
      if (r && r.contestado) { e.textContent = '✓ ' + r.nombre_b + ' ya contestó'; e.classList.add('ok'); guardarMio(Object.assign({}, t, { listo: true, otro: r.nombre_b })); }
    }).catch(() => {});
    else if (t.yo === 'a') { e.textContent = 'Con ' + (t.otro || '…'); }
  }
}

// ---------- Otros tests y más juegos ----------
function pintarOtros() {
  for (const caja of document.querySelectorAll('[data-otros]')) {
    caja.textContent = '';
    for (const [k, t] of Object.entries(TESTS)) {
      if (k === TIPO) continue;
      const a = el('a', 'otro'); a.href = enlaceDe(k, '');
      a.append(el('span', 'otro-i', t.icono), el('b', null, t.titulo), el('small', null, t.corto));
      caja.append(a);
    }
    const j = el('a', 'otro juegos'); j.href = RAIZ;
    j.append(el('span', 'otro-i', '🎮'), el('b', null, 'Más juegos'), el('small', null, 'Tierralma, Grieta y Cartas al Aire'));
    caja.append(j);
  }
}

// ---------- Botones de inicio ----------
const inicio = () => { history.replaceState(null, '', BASE); modo = 'local'; actual = null; ver('vInicio'); pintarMios(); };
$('empezar').onclick = () => { modo = 'reto'; actual = null; nombres = [$('n1').value.trim() || 'Persona 1', 'Persona 2']; usadas = []; elegir(); resp = [[], []]; preguntar(0, 0); };
$('local').onclick = () => ver('vLocal');
$('volver').onclick = () => ver('vInicio');
$('empezarLocal').onclick = () => { modo = 'local'; actual = null; nombres = [$('l1').value.trim() || 'Persona 1', $('l2').value.trim() || 'Persona 2']; usadas = []; ronda(); };
$('otra').onclick = ronda;
$('nuevo').onclick = inicio;
$('errNuevo').onclick = inicio;
for (const a of document.querySelectorAll('[data-raiz]')) a.href = RAIZ;

// ---------- Al abrir la página ----------
function invitar(nombre, preguntas, alEmpezar) {
  $('invEyebrow').textContent = nombre + ' ya contestó su test';
  $('invSub').textContent = TIPO === 'conoces'
    ? 'Adivina qué contestó en ' + preguntas.length + ' preguntas sobre su vida.'
    : 'Contesta las mismas ' + preguntas.length + ' preguntas sobre ti y descubran qué tanto coinciden.';
  $('empezarB').onclick = () => { modo = 'invitado'; nombres = [nombre, $('n2').value.trim() || 'Persona 2']; qs = preguntas; alEmpezar(); preguntar(1, 0); };
  ver('vInvitado');
}
async function arrancar() {
  clearInterval(espera);
  const m = location.hash.match(/^#(t|r|ver)=([A-Za-z0-9_-]+)$/);
  if (!m) { ver('vInicio'); pintarMios(); return; }
  const [, k, v] = m;
  // Enlace corto del servidor
  if (k === 't' && /^[0-9a-f]{12}$/.test(v)) {
    ver('vCargando');
    try {
      const r = await rpc('match_abrir', { p_id: v });
      if (!r) { error('Este test ya no existe. Los tests se borran a los 30 días.'); return; }
      if (r.tipo !== TIPO) { location.replace(enlaceDe(r.tipo, '#t=' + v)); return; }
      const mio = misTests().find(x => x.id === v);
      if (mio) { location.replace(BASE + '#ver=' + v); return; }
      if (r.contestado) { error('Este test ya lo contestó alguien. Pídele a ' + r.nombre_a + ' que te mande uno nuevo, o haz el tuyo.'); return; }
      actual = { id: v };
      invitar(r.nombre_a, r.preguntas, () => { resp = [[], []]; });
    } catch (e) { error('No se pudo abrir el test. Revisa tu internet.', arrancar); }
    return;
  }
  if (k === 'ver') {
    const mio = misTests().find(x => x.id === v);
    if (!mio) { error('Este resultado se abrió en otro celular o navegador. Solo lo pueden ver quienes hicieron el test, desde donde lo hicieron.'); return; }
    ver('vCargando');
    try {
      const r = await rpc('match_resultado', { p_id: v, p_llave: mio.llave });
      if (!r) { error('Este test ya no existe. Los tests se borran a los 30 días.'); return; }
      if (r.contestado) { mostrarServidor(r, mio.yo); return; }
      // Todavía no contesta: volver a la pantalla de mandar el enlace
      actual = { id: v, llave: mio.llave }; nombres = [r.nombre_a, 'Persona 2']; qs = r.preguntas; enlaceTest = BASE + '#t=' + v;
      $('mandarEyebrow').textContent = 'Todavía no contesta';
      $('mandarSub').textContent = 'Cuando conteste, el resultado aparece aquí solo. ¿Se lo recuerdas?';
      $('copiado').hidden = true; $('espera').hidden = false;
      ver('vMandar'); esperar();
    } catch (e) { error('No se pudo cargar el resultado. Revisa tu internet.', arrancar); }
    return;
  }
  // Enlaces sin servidor (versión anterior o respaldo)
  try {
    const o = dec(v);
    if (k === 't' && nombreOk(o.n) && preguntasOk(o.q) && respOk(o.a, o.q)) { actual = null; invitar(o.n, o.q, () => { resp = [o.a, []]; }); return; }
    if (k === 'r' && Array.isArray(o.n) && o.n.length === 2 && o.n.every(nombreOk) && preguntasOk(o.q)
      && Array.isArray(o.a) && o.a.length === 2 && o.a.every(a => respOk(a, o.q))) { modo = 'ver'; actual = null; nombres = o.n; qs = o.q; resp = o.a; resultado(); return; }
  } catch (e) { /* enlace dañado */ }
  error('Este enlace no funciona. Puede que se haya cortado al copiarlo: pide que te lo manden otra vez.');
}
pintarOtros();
arrancar();
window.addEventListener('hashchange', arrancar);
document.addEventListener('visibilitychange', () => { if (!document.hidden && !$('vInicio').hidden) pintarMios(); });

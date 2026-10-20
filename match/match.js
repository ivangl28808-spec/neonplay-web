// ¿Hacemos match?: el test de compatibilidad de Cartas al Aire (modo Pareja) en versión web.
// Las preguntas son las mismas que COMPAT en rompehielo/datos/pareja.js del repositorio neonplay.
'use strict';
const PREGUNTAS = [
  ["Un viernes en la noche ideal es…", ["Salir de fiesta", "Película en casa", "Cena tranquila", "Lo que salga"]],
  ["En vacaciones prefieres…", ["Playa", "Montaña o bosque", "Ciudad", "Pueblo mágico"]],
  ["Cuando hay una pelea, prefieres…", ["Hablarlo en el momento", "Calmarme primero", "Que se olvide solo", "Un abrazo y ya"]],
  ["¿Cómo te gusta recibir cariño?", ["Palabras bonitas", "Detalles y regalos", "Tiempo juntos", "Abrazos y besos"]],
  ["El dinero en pareja…", ["Todo compartido", "Cada quien lo suyo", "Una parte compartida", "No lo he pensado"]],
  ["¿Hijos?", ["Sí, varios", "Uno o dos", "No quiero", "Todavía no sé"]],
  ["Una mascota ideal es…", ["Perro", "Gato", "Otra", "Ninguna"]],
  ["Tus domingos son para…", ["Dormir", "Familia", "Salir", "Hacer pendientes"]],
  ["¿Qué tan seguido quieres hablar por mensaje?", ["Todo el día", "Algunas veces al día", "Solo lo necesario", "Prefiero llamada"]],
  ["En una fiesta tú eres…", ["El alma de la fiesta", "El que platica en una esquina", "El que baila toda la noche", "El primero en irse"]],
  ["¿Dónde te gustaría vivir?", ["En la ciudad", "En las afueras", "En el campo", "En otro país"]],
  ["¿Cómo prefieres celebrar un cumpleaños?", ["Fiesta grande", "Cena con pocos", "Viaje", "Sin celebrar"]],
  ["Los celos son…", ["Normales un poquito", "Una señal de amor", "Una mala señal", "Depende"]],
  ["Tu forma de ahorrar es…", ["Ahorro todo", "Ahorro algo", "Gasto lo que gano", "¿Ahorrar?"]],
  ["Para comer prefieres…", ["Tacos", "Sushi", "Pizza", "Comida casera"]],
  ["¿Madrugar o desvelarte?", ["Madrugar", "Desvelarme", "Las dos", "Ninguna"]],
  ["En una relación lo más importante es…", ["Confianza", "Comunicación", "Diversión", "Pasión"]],
  ["Si ganas la lotería, primero…", ["Viajo", "Compro casa", "Ayudo a mi familia", "Lo invierto"]],
  ["Una cita ideal es…", ["Cine", "Caminar y platicar", "Cena elegante", "Algo de aventura"]],
  ["¿Muestras cariño en público?", ["Mucho", "Poquito", "Casi nada", "Depende del lugar"]],
  ["Tu música para un viaje largo…", ["Reguetón", "Rock o pop", "Regional mexicano", "De todo"]],
  ["Con los amigos de tu pareja…", ["Quiero llevarme muy bien", "Con respeto basta", "Cada quien sus amigos", "Depende de ellos"]],
  ["¿Vivir juntos antes de casarse?", ["Sí, claro", "No", "Quizás", "No pienso casarme"]],
  ["En tu tiempo libre prefieres…", ["Ejercicio", "Series y videojuegos", "Leer o aprender algo", "Ver a mis amigos"]],
  ["Para ti, el detalle perfecto es…", ["Una carta", "Flores", "Una sorpresa", "Una comida hecha en casa"]],
  ["Cuando estás triste necesitas…", ["Que me escuchen", "Que me distraigan", "Estar solo", "Que me abracen"]],
  ["¿Cómo te imaginas en 10 años?", ["Con familia", "Viajando", "Enfocado en mi carrera", "No lo sé"]],
  ["¿Qué tan ordenado eres?", ["Muy ordenado", "Más o menos", "Desordenado organizado", "Un desastre"]],
  ["Una pelea por mensaje es…", ["Válida", "Mejor en persona", "Prohibida", "A veces inevitable"]],
  ["Tu plan de domingo con la familia de tu pareja…", ["Me encanta", "De vez en cuando", "Prefiero no", "Depende de la familia"]]
];
const POR_RONDA = 10;
const $ = id => document.getElementById(id);
const VISTAS = ['vInicio', 'vLocal', 'vInvitado', 'vMandar', 'vPasar', 'vPregunta', 'vResultado', 'vError'];
const ver = id => { VISTAS.forEach(v => { $(v).hidden = v !== id; }); window.scrollTo(0, 0); };
const BASE = location.href.split('#')[0];

// modo: 'local' (los dos en este celular), 'reto' (contesto y mando el enlace), 'invitado' (abrí un enlace), 'ver' (abrí un resultado)
let modo = 'local', nombres = ['Persona 1', 'Persona 2'], qs = [], resp = [[], []], usadas = [];

// ---------- Enlaces: los datos van en el «#» de la dirección (no llegan a ningún servidor) ----------
const cod = o => { const b = new TextEncoder().encode(JSON.stringify(o)); let t = ''; b.forEach(x => { t += String.fromCharCode(x); }); return btoa(t).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); };
const dec = t => { const s = atob(t.replace(/-/g, '+').replace(/_/g, '/')); return JSON.parse(new TextDecoder().decode(Uint8Array.from(s, c => c.charCodeAt(0)))); };
const nombreOk = n => typeof n === 'string' && n.trim().length > 0 && n.length <= 20;
const preguntasOk = q => Array.isArray(q) && q.length >= 1 && q.length <= PREGUNTAS.length && new Set(q).size === q.length && q.every(i => Number.isInteger(i) && i >= 0 && i < PREGUNTAS.length);
const respOk = (a, q) => Array.isArray(a) && a.length === q.length && a.every((x, k) => Number.isInteger(x) && x >= 0 && x < PREGUNTAS[q[k]][1].length);
function leerEnlace() {
  const m = location.hash.match(/^#([tr])=([A-Za-z0-9_-]+)$/);
  if (!m) return null;
  try {
    const o = dec(m[2]);
    if (m[1] === 't' && nombreOk(o.n) && preguntasOk(o.q) && respOk(o.a, o.q)) return { tipo: 'test', o };
    if (m[1] === 'r' && Array.isArray(o.n) && o.n.length === 2 && o.n.every(nombreOk) && preguntasOk(o.q)
      && Array.isArray(o.a) && o.a.length === 2 && o.a.every(a => respOk(a, o.q))) return { tipo: 'res', o };
  } catch (e) { /* enlace dañado */ }
  return { tipo: 'error' };
}
const whatsapp = texto => { location.href = 'https://wa.me/?text=' + encodeURIComponent(texto); };

// Elige 10 preguntas sin repetir las de rondas anteriores hasta agotar las 30.
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

function preguntar(p, k) {
  if (k >= qs.length) { terminar(p); return; }
  const [q, ops] = PREGUNTAS[qs[k]];
  $('quien').textContent = nombres[p] + ', contesta sobre ti';
  $('cuenta').textContent = (k + 1) + ' de ' + qs.length;
  $('prog').style.width = (k / qs.length * 100) + '%';
  $('pregunta').textContent = q;
  const caja = $('opciones'); caja.textContent = '';
  ops.forEach((o, j) => {
    const b = document.createElement('button'); b.type = 'button'; b.textContent = o;
    b.onclick = () => { resp[p][k] = j; preguntar(p, k + 1); };
    caja.append(b);
  });
  ver('vPregunta');
}

function terminar(p) {
  if (modo === 'local') { if (p === 0) pasar(1); else resultado(); }
  else if (modo === 'reto') mandar();
  else resultado();
}

// ---------- Quien crea el test: mandar el enlace ----------
let enlaceTest = '';
function mandar() {
  enlaceTest = BASE + '#t=' + cod({ n: nombres[0], q: qs, a: resp[0] });
  $('mandarEyebrow').textContent = '¡Listo, ' + nombres[0] + '!';
  $('copiado').hidden = true;
  ver('vMandar');
}
$('mandarTest').onclick = () => whatsapp(nombres[0] + ' te retó a ver qué tanto coinciden 💞 Contesta 10 preguntas aquí: ' + enlaceTest);
$('copiarTest').onclick = async () => {
  try { await navigator.clipboard.writeText(enlaceTest); $('copiado').hidden = false; }
  catch (e) { window.prompt('Copia este enlace:', enlaceTest); }
};

// ---------- Resultado ----------
let ultimo = 0;
function resultado() {
  const iguales = qs.filter((_, k) => resp[0][k] === resp[1][k]).length;
  const pct = ultimo = Math.round(iguales / qs.length * 100);
  $('resQuien').textContent = 'Compatibilidad de ' + nombres[0] + ' y ' + nombres[1];
  $('pct').textContent = pct + '%';
  $('veredicto').textContent = pct >= 80 ? '¡Almas gemelas! 💘' : pct >= 60 ? 'Hacen muy buen equipo 💞' : pct >= 40 ? 'Diferentes, pero se complementan 🤝' : 'Polos opuestos… y dicen que se atraen 🧲';
  const d = $('detalle'); d.textContent = '';
  qs.forEach((i, k) => {
    const [q, ops] = PREGUNTAS[i], si = resp[0][k] === resp[1][k];
    const f = document.createElement('div'); f.className = 'fila ' + (si ? 'si' : 'no');
    const b = document.createElement('b'); b.textContent = q;
    const s = document.createElement('span'); s.textContent = si ? 'Los dos: ' + ops[resp[0][k]] : nombres[0] + ': ' + ops[resp[0][k]] + ' · ' + nombres[1] + ': ' + ops[resp[1][k]];
    f.append(b, s); d.append(f);
  });
  // Quien contestó el enlace le regresa el resultado a quien lo mandó.
  $('mandarRes').hidden = modo !== 'invitado';
  $('mandarRes').textContent = 'Mandarle el resultado a ' + nombres[0];
  $('otra').hidden = modo !== 'local';
  ver('vResultado');
}
$('mandarRes').onclick = () => {
  const url = BASE + '#r=' + cod({ n: nombres, q: qs, a: resp });
  whatsapp('Ya contesté tu test 💞 Salimos ' + ultimo + '% compatibles. Mira en qué coincidimos: ' + url);
};
$('compartir').onclick = async () => {
  const texto = nombres[0] + ' y ' + nombres[1] + ' salimos ' + ultimo + '% compatibles en «¿Hacemos match?». ¿Y ustedes?';
  try { if (navigator.share) { await navigator.share({ title: '¿Hacemos match?', text: texto, url: BASE }); return; } } catch (e) { if (e && e.name === 'AbortError') return; }
  whatsapp(texto + ' ' + BASE);
};

// ---------- Botones de inicio ----------
const inicio = () => { history.replaceState(null, '', BASE); modo = 'local'; ver('vInicio'); };
$('empezar').onclick = () => { modo = 'reto'; nombres = [$('n1').value.trim() || 'Persona 1', 'Persona 2']; usadas = []; elegir(); resp = [[], []]; preguntar(0, 0); };
$('local').onclick = () => ver('vLocal');
$('volver').onclick = () => ver('vInicio');
$('empezarLocal').onclick = () => { modo = 'local'; nombres = [$('l1').value.trim() || 'Persona 1', $('l2').value.trim() || 'Persona 2']; usadas = []; ronda(); };
$('otra').onclick = ronda;
$('nuevo').onclick = inicio;
$('errNuevo').onclick = inicio;

// ---------- Al abrir la página con un enlace ----------
function arrancar() {
  const e = leerEnlace();
  if (!e) { ver('vInicio'); return; }
  if (e.tipo === 'error') { ver('vError'); return; }
  const o = e.o;
  qs = o.q;
  if (e.tipo === 'test') {
    $('invEyebrow').textContent = o.n + ' ya contestó su test';
    $('invSub').textContent = 'Contesta las mismas ' + o.q.length + ' preguntas sobre ti y descubran qué tanto coinciden.';
    $('empezarB').onclick = () => { modo = 'invitado'; nombres = [o.n, $('n2').value.trim() || 'Persona 2']; resp = [o.a, []]; preguntar(1, 0); };
    ver('vInvitado');
  } else { modo = 'ver'; nombres = o.n; resp = o.a; resultado(); }
}
arrancar();
window.addEventListener('hashchange', arrancar);

"use strict";
const c = document.getElementById("c"), x = c.getContext("2d");
const $p = document.getElementById("puntos"), $r = document.getElementById("record");
const $pant = document.getElementById("pantalla"), $msg = document.getElementById("msg"), $btn = document.getElementById("jugar");
const COLORES = ["#FF3D9A", "#35E3F0", "#FFC83D", "#B6FF3B", "#FF8A3D"];
let W, H, dpr, nave, bloques, estrellas, t0, ultimo, generar, jugando = false, puntos = 0;

function leerRecord() { try { return +localStorage.getItem("spacey-record") || 0; } catch { return 0; } }
function guardarRecord(v) { try { localStorage.setItem("spacey-record", v); } catch {} }
let record = leerRecord(); $r.textContent = "Récord " + record;

function medir() {
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  W = innerWidth; H = innerHeight;
  c.width = W * dpr; c.height = H * dpr; x.setTransform(dpr, 0, 0, dpr, 0, 0);
  estrellas = Array.from({ length: 70 }, () => ({ x: Math.random() * W, y: Math.random() * H, v: 20 + Math.random() * 60, r: Math.random() * 1.5 + .3 }));
  if (nave) { nave.x = Math.min(Math.max(nave.x, nave.w / 2), W - nave.w / 2); nave.y = H - 90; }
}
addEventListener("resize", medir); medir();

function empezar() {
  nave = { x: W / 2, y: H - 90, w: 34, h: 40, objetivo: W / 2 };
  bloques = []; t0 = ultimo = performance.now(); generar = 0; puntos = 0; jugando = true;
  $pant.hidden = true; requestAnimationFrame(bucle);
}
function terminar() {
  jugando = false;
  const nuevo = puntos > record;
  if (nuevo) { record = puntos; guardarRecord(record); $r.textContent = "Récord " + record; }
  $msg.textContent = (nuevo ? "¡Nuevo récord! " : "") + "Aguantaste " + puntos + " puntos.";
  $btn.textContent = "Otra vez"; $pant.hidden = false;
}

function mover(e) { if (!jugando) return; const p = e.touches ? e.touches[0] : e; nave.objetivo = p.clientX; }
c.addEventListener("pointerdown", mover); c.addEventListener("pointermove", mover);
c.addEventListener("touchmove", e => { e.preventDefault(); mover(e); }, { passive: false });
addEventListener("keydown", e => { if (!jugando) return; if (e.key === "ArrowLeft") nave.objetivo = nave.x - 60; if (e.key === "ArrowRight") nave.objetivo = nave.x + 60; });
$btn.addEventListener("click", empezar);

function bucle(ahora) {
  if (!jugando) return;
  const dt = Math.min((ahora - ultimo) / 1000, 0.05); ultimo = ahora;
  const seg = (ahora - t0) / 1000, nivel = Math.floor(seg / 10);
  const vel = 180 + nivel * 55;
  puntos = Math.floor(seg * 10); $p.textContent = puntos;

  nave.x += (nave.objetivo - nave.x) * Math.min(1, dt * 14);
  nave.x = Math.min(Math.max(nave.x, nave.w / 2), W - nave.w / 2);

  generar -= dt;
  if (generar <= 0) {
    const w = 26 + Math.random() * Math.min(70, W * .18);
    bloques.push({ x: Math.random() * (W - w), y: -w, w, h: w * (.6 + Math.random() * .6), col: COLORES[Math.random() * COLORES.length | 0], v: vel * (.85 + Math.random() * .3) });
    generar = Math.max(0.18, 0.75 - nivel * 0.07);
  }

  x.fillStyle = "#0B0014"; x.fillRect(0, 0, W, H);
  x.fillStyle = "#F5EAFF";
  for (const s of estrellas) { s.y += s.v * dt * (1 + nivel * .2); if (s.y > H) { s.y = 0; s.x = Math.random() * W; } x.globalAlpha = .6; x.fillRect(s.x, s.y, s.r, s.r * 3); }
  x.globalAlpha = 1;

  const nx = nave.x - nave.w / 2 + 6, ny = nave.y + 8, nw = nave.w - 12, nh = nave.h - 12;
  for (let i = bloques.length - 1; i >= 0; i--) {
    const b = bloques[i]; b.y += b.v * dt;
    if (b.y > H) { bloques.splice(i, 1); continue; }
    x.shadowColor = b.col; x.shadowBlur = 16; x.strokeStyle = b.col; x.lineWidth = 3;
    x.strokeRect(b.x, b.y, b.w, b.h); x.globalAlpha = .18; x.fillStyle = b.col; x.fillRect(b.x, b.y, b.w, b.h); x.globalAlpha = 1;
    if (nx < b.x + b.w && nx + nw > b.x && ny < b.y + b.h && ny + nh > b.y) { x.shadowBlur = 0; dibujarNave(); terminar(); return; }
  }
  x.shadowBlur = 0; dibujarNave();
  requestAnimationFrame(bucle);
}
function dibujarNave() {
  const { x: cx, y, w, h } = nave;
  x.shadowColor = "#35E3F0"; x.shadowBlur = 20; x.strokeStyle = "#35E3F0"; x.lineWidth = 3;
  x.beginPath(); x.moveTo(cx, y); x.lineTo(cx + w / 2, y + h); x.lineTo(cx, y + h * .75); x.lineTo(cx - w / 2, y + h); x.closePath(); x.stroke();
  x.shadowColor = "#FF3D9A"; x.fillStyle = "#FF3D9A"; x.beginPath(); x.arc(cx, y + h * .9 + Math.random() * 4, 4, 0, 7); x.fill();
  x.shadowBlur = 0;
}
// fondo de la portada
x.fillStyle = "#0B0014"; x.fillRect(0, 0, W, H);

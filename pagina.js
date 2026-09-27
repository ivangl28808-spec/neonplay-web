// pagina.js — datos en vivo de la última beta publicada (tabla public.app_version de producción, solo lectura).
// Si la tabla todavía no existe o no hay conexión, la página funciona igual con el enlace fijo.
'use strict';
// ---------- Ajustes de la página (se editan aquí) ----------
const CONFIG = {
  supabase: 'https://yzmbbjcfcqolgmexljny.supabase.co',
  llavePublica: 'sb_publishable_e69uRUdERcwVlJluZW14bQ_3rOuyG07',   // llave pública de la app (solo lectura con RLS)
  descargaFija: 'https://yzmbbjcfcqolgmexljny.supabase.co/storage/v1/object/public/descargas/NEONPLAY-beta.apk?download=NEONPLAY-beta.apk',
  virusTotal: '',     // enlace al informe de VirusTotal de la versión actual (vacío = no se muestra)
  contacto: '',       // correo para reportar problemas (vacío = no se muestra)
  creditos: ''        // por ejemplo «Hecho en México por …» (vacío = texto neutro)
};

const $ = id => document.getElementById(id);
$('btnDescargar').href = CONFIG.descargaFija;
if (CONFIG.virusTotal) { $('vtCard').href = CONFIG.virusTotal; $('vtCard').hidden = false; }
if (CONFIG.contacto) {
  const a = document.createElement('a'); a.href = 'mailto:' + CONFIG.contacto; a.textContent = 'Reportar un problema';
  $('contacto').append(' · ', a);
}
if (CONFIG.creditos) $('creditos').textContent = CONFIG.creditos;

const fecha = iso => new Date(iso).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });
const mb = b => (b / 1048576).toLocaleString('es-MX', { maximumFractionDigits: 1 }) + ' MB';

fetch(`${CONFIG.supabase}/rest/v1/app_version?canal=eq.beta&select=version_code,notas,sha256,bytes,updated_at`, {
  headers: { apikey: CONFIG.llavePublica, Authorization: 'Bearer ' + CONFIG.llavePublica }
}).then(r => r.ok ? r.json() : Promise.reject(r.status)).then(filas => {
  const v = filas && filas[0]; if (!v) return;
  $('verInfo').textContent = `Versión beta ${v.version_code} · actualizada el ${fecha(v.updated_at)}${v.bytes ? ' · ' + mb(v.bytes) : ''} · Android 7 o superior`;
  if (v.sha256) $('huella').textContent = v.sha256;
  $('novTitulo').textContent = `Versión ${v.version_code} · ${fecha(v.updated_at)}`;
  if (v.notas) $('novTexto').textContent = v.notas;
}).catch(() => { /* sin datos en vivo: se queda el texto fijo */ });

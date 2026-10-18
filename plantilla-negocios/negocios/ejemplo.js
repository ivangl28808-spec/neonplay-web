// Datos de un negocio. Es el ÚNICO archivo que se edita para hacer una muestra nueva.
// Copia este archivo como negocios/<nombre-sin-espacios>.js y abre la página con ?n=<nombre-sin-espacios>.
// Este negocio es INVENTADO: sirve para enseñar cómo queda una página.
window.NEGOCIO = {
  ejemplo: true,                 // true = muestra la franja «Página de ejemplo». En la página real de un cliente: false
  nombre: 'Barbería Los Volcanes',
  tipo: 'Barbería',
  ciudad: 'Texcoco',
  lema: 'Cortes clásicos y modernos, barba y cejas. Sin cita o agendando por WhatsApp.',
  descripcion: 'Barbería en el centro de Texcoco: cortes, barba, cejas y paquetes. Precios, horario y ubicación.',

  colores: { principal: '#1E3A5F', acento: '#E0A43A' },

  // 10 dígitos, sin +52. Vacío = el botón no escribe a nadie (útil para muestras).
  whatsapp: '',
  mensajeWhatsApp: 'Hola, vi su página. Quiero agendar un corte para…',
  textoBotonWhatsApp: 'Agendar por WhatsApp',
  telefono: '',

  portada: 'img/ejemplo/portada.svg',
  portadaTexto: 'Ilustración de una silla de barbero',

  extras: ['Sin cita', 'Agenda por WhatsApp', 'Pago en efectivo o transferencia', 'Niños bienvenidos'],

  tituloMenu: 'Servicios',
  menu: [
    {
      titulo: 'Cortes',
      productos: [
        { nombre: 'Corte clásico', precio: 120, detalle: 'Tijera o máquina, con lavado.' },
        { nombre: 'Degradado (fade)', precio: 150 },
        { nombre: 'Corte de niño', precio: 90, detalle: 'Hasta 12 años.' }
      ]
    },
    {
      titulo: 'Barba y detalles',
      productos: [
        { nombre: 'Arreglo de barba', precio: 80, detalle: 'Con toalla caliente.' },
        { nombre: 'Afeitado a navaja', precio: 100 },
        { nombre: 'Cejas', precio: 40 }
      ]
    },
    {
      titulo: 'Paquetes',
      nota: 'Pregunta por precio de grupo para eventos.',
      productos: [
        { nombre: 'Corte + barba', precio: 180 },
        { nombre: 'Papá e hijo', precio: 190 }
      ]
    }
  ],

  // Turnos por día con hora de 24 h. Un día cerrado: []. Varios turnos: [['10:00','14:00'], ['16:00','20:00']].
  horario: {
    lunes: [],
    martes: [['10:00', '20:00']],
    miercoles: [['10:00', '20:00']],
    jueves: [['10:00', '20:00']],
    viernes: [['10:00', '21:00']],
    sabado: [['09:00', '21:00']],
    domingo: [['09:00', '15:00']]
  },

  direccion: 'Calle de ejemplo 12, Centro, Texcoco de Mora, Méx.',
  referencia: 'Dirección ficticia: en la página real va la del negocio.',
  mapa: 'Centro, Texcoco de Mora, Estado de México',   // lo que se busca en Google Maps (mejor: el nombre del negocio si ya aparece en Maps)

  fotos: [
    { src: 'img/ejemplo/corte.svg', texto: 'Cortes a tu gusto' },
    { src: 'img/ejemplo/barba.svg', texto: 'Barba con toalla caliente' },
    { src: 'img/ejemplo/local.svg', texto: 'Nuestro local' }
  ],

  redes: [
    // { nombre: 'Facebook', url: 'https://www.facebook.com/…' }
  ]
};

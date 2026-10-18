// Segunda muestra INVENTADA: sin fotos todavía (la página se adapta y oculta esa sección).
window.NEGOCIO = {
  ejemplo: true,
  nombre: 'Tacos El Ahuehuete',
  tipo: 'Taquería',
  ciudad: 'Texcoco',
  lema: 'Tacos al pastor, suadero y campechanos. De noche y para llevar.',
  colores: { principal: '#9A2C1C', acento: '#F2B33D' },
  whatsapp: '',
  mensajeWhatsApp: 'Hola, quiero hacer un pedido para llevar:',
  textoBotonWhatsApp: 'Pedir por WhatsApp',
  extras: ['Para llevar', 'Pedidos por WhatsApp'],
  tituloMenu: 'Menú',
  menu: [
    {
      titulo: 'Tacos',
      nota: 'Tortilla de maíz. Cebolla, cilantro y salsas al gusto.',
      productos: [
        { nombre: 'Pastor', precio: 18 },
        { nombre: 'Suadero', precio: 20 },
        { nombre: 'Campechano', precio: 22 },
        { nombre: 'Orden de 5 al pastor', precio: 80 }
      ]
    },
    {
      titulo: 'Bebidas',
      productos: [
        { nombre: 'Agua de horchata o jamaica (1 L)', precio: 35 },
        { nombre: 'Refresco', precio: 25 }
      ]
    }
  ],
  horario: {
    lunes: [],
    martes: [['18:00', '00:00']],
    miercoles: [['18:00', '00:00']],
    jueves: [['18:00', '00:00']],
    viernes: [['18:00', '02:00']],
    sabado: [['18:00', '02:00']],
    domingo: [['18:00', '23:00']]
  },
  direccion: 'Avenida de ejemplo 45, Texcoco de Mora, Méx.',
  referencia: 'Dirección ficticia: en la página real va la del negocio.',
  mapa: 'Texcoco de Mora, Estado de México',
  fotos: []
};

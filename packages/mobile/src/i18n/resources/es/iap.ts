const iap = {
  dialog: {
    title: 'Obtener {{region}} premium',
  },
  buy: {
    confirmButton: {
      REFRESHING_PREMIUM: 'Comprar por {{precio}}',
      REFRESHING_PREMIUM_FAILED: 'Reintentar',
      PRODUCT_LOADING: 'Comprar',
      PRODUCT_LOADING_FAILED: 'Reintentar',
      IDLE: 'Comprar por {{precio}}',
      PRODUCT_PURCHASING: 'Comprar por {{precio}}',
      PRODUCT_PURCHASING_FAILED: 'Reintentar',
      PURCHASE_SAVING: 'Comprar por {{precio}}',
      PURCHASE_SAVING_OFFLINE: 'Reintentar',
      PURCHASE_SAVING_FATAL: 'OK',
    },
    descriptionMd: `Aprovecha al máximo la guía whitewater.guide para {{región}}
- Descripciones detalladas de las secciones.
- Navegue a entradas / salidas con solo un toque
- Copia las coordenadas de las entradas, salidas y puntos importantes.
- Descargar datos para uso sin conexión
`,
  },
  alreadyHave: {
    message: 'Parece que ya tiene su acceso premium a {{region}}',
  },
  auth: {
    anon: 'Por favor autenticar para proceder',
    user: '¡Éxito! Por favor continúe con su compra ',
  },
  success: {
    subheading: '¡Éxito!',
    body: 'Ahora tienes acceso a todas las funciones premium en {{región}}',
  },
  errors: {
    refreshPremium:
      'Error al verificar la disponibilidad del producto. Por favor revise su conexion a internet.',
    fetchProduct:
      'Error al obtener el precio del producto. Por favor revise su conexion a internet.',
    buyProduct:
      'Error al comprar el producto. Por favor revise su conexion a internet.',
    savePurchase:
      'No se pudo guardar su compra. Por favor contáctenos. Su ID de transacción fue {{transactionId}}. ',
    savePurchaseOffline:
      'No se pudo guardar su compra. Por favor revise su conexion a internet. Su ID de transacción fue {{transactionId}}. ',
    alreadyOwned:
      'Parece que ya has comprado esta región. Por favor, cierre la sesión e inicie sesión en la cuenta que utilizó para comprarlo. Su ID de transacción fue {{transactionId}}. ',
  },
  section: {
    message:
      '{{region}} es una región premium. La descripción completa de esta sección es una característica premium ',
    button: 'Obtener premium',
  },
};

export default iap;

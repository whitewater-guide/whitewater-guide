const iap = {
  dialog: {
    title: '{{region}}: полный функционал',
  },
  buy: {
    confirmButton: {
      REFRESHING_PREMIUM: 'Купить за {{price}}',
      REFRESHING_PREMIUM_FAILED: 'Попробовать снова',
      PRODUCT_LOADING: 'Купить',
      PRODUCT_LOADING_FAILED: 'Попробовать снова',
      IDLE: 'Купить за {{price}}',
      PRODUCT_PURCHASING: 'купить за {{price}}',
      PRODUCT_PURCHASING_FAILED: 'Попробовать снова',
      PURCHASE_SAVING: 'Купить за {{price}}',
      PURCHASE_SAVING_OFFLINE: 'Попробовать снова',
      PURCHASE_SAVING_FATAL: 'OK',
    },
    descriptionMd: `Премиум доступ к региону {{region}} это:
- Описания сплавных участков рек
- Навигация на старт и финиш одним касанием
- Точные координаты всех точек в удобном формате
    `,
  },
  alreadyHave: {
    message: 'Кажется, у вас уже есть премиум доступ к региону {{region}}',
  },
  auth: {
    anon: 'Пожалуйста, авторизируйтесь',
    user: 'Успех! Пожалуйста, продолжите к покупке',
  },
  success: {
    subheading: 'Успех!',
    body: 'Теперь у вас есть премиум доступ к региону {{region}}',
  },
  errors: {
    refreshPremium: 'Ошибка, кажется такого товара нет. Пожалуйста, проверьте интернет соединение.',
    fetchProduct: 'Ошибка, мы не смогли определить цену покупки. Пожалуйста, проверьте интернет соединение.',
    buyProduct: 'Ошибка покупки. Пожалуйста, проверьте интернет соединение.',
    savePurchase: 'Ошибка сохранения покупки. Свяжитесь с нами. Номер вашей транзакции {{transactionId}}.',
    savePurchaseOffline: 'Ошибка сохранения покупки. Пожалуйста, проверьте интернет соединение. Номер вашей транзакции {{transactionId}}.',
  },
  section: {
    message: '{{region}} - это премиум регион. Описания сплавных участков доступны только после покупки',
    button: 'Купить за {{price}}',
  },
};

export default iap;
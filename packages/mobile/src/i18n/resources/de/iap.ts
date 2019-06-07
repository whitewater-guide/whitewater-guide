const iap = {
  dialog: {
    title: 'Hol dir {{region}} als Premium',
  },
  buy: {
    confirmButton: {
      REFRESHING_PREMIUM: 'Kaufen für {{price}}',
      REFRESHING_PREMIUM_FAILED: 'Erneut versuchen',
      PRODUCT_LOADING: 'Kaufen',
      PRODUCT_LOADING_FAILED: 'Erneut versuchen',
      IDLE: 'Kaufen für {{price}}',
      PRODUCT_PURCHASING: 'Kaufen für {{price}}',
      PRODUCT_PURCHASING_FAILED: 'Erneut versuchen',
      PURCHASE_SAVING: 'Kaufen für {{price}}',
      PURCHASE_SAVING_OFFLINE: 'Erneut versuchen',
      PURCHASE_SAVING_FATAL: 'OK',
    },
    descriptionMd: `Erhalte die kompletten Vorteile des whitewater.guide für {{region}}
-Detallierte Streckenbeschreibungen
-mit einem Klick zu den Ein- und Ausstiegen navigieren
-kopiere die Koordinaten der Ein- und Ausstiege und anderen Stellen
-lade dir die Daten runter für den Offline-Gebrauch
`,
  },
  alreadyHave: {
    message: 'Es scheint als hättest du bereits Premium-Zugang für {{region}}',
  },
  auth: {
    anon: 'Bitte authentifiziere dich um fortzufahren',
    user: 'Erfolgreich! Bitte fahre fort mit deinem Kauf',
  },
  success: {
    subheading: 'Erfolgreich!',
    body: 'Du hast jetzt Premium-Zugang zu allen Features in {{region}}',
  },
  errors: {
    refreshPremium:
      'Verfügbarkeits-Check fehlgeschlagen. Bitte Internetverbindung überprüfen.',
    fetchProduct:
      'Abrufen des Produkt-Preises fehlgeschlagen. Bitte Internetverbindung überprüfen.',
    buyProduct:
      'Produkt-Kauf fehlgeschlagen. Bitten Internetverbindung überprüfen.',
    savePurchase:
      'Speichern des Kaufes fehlgeschlagen. Bitte kontaktiere uns. Deine Transaktions-ID war {{transactionId}}.',
    savePurchaseOffline:
      'Speichern des Kaufes fehlgeschlagen. Bitte Internetverbindung überprüfen. Deine Transaktions-ID war {{transactionId}}.',
    alreadyOwned:
      'Scheinbar hast du diese Region schon freigeschaltet. Bitte Ausloggen und dann Einloggen mit dem Account mit dem du diese erworben hast. Deinse Transaktions-ID war {{transactionId}}',
  },
  section: {
    message:
      '{{region}} ist eine Premium-Region. Die ganze Beschreibung dieser Strecke ist ein Premium-Feature.',
    button: 'Hol dir Premium-Zugang',
  },
};

export default iap;

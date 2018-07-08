const iap = {
  buy: {
    confirmButton: {
      REFRESHING_PREMIUM: 'Buy for {{price}}',
      REFRESHING_PREMIUM_FAILED: 'Retry',
      PRODUCT_LOADING: 'Buy',
      PRODUCT_LOADING_FAILED: 'Retry',
      IDLE: 'Buy for {{price}}',
      PRODUCT_PURCHASING: 'Buy for {{price}}',
      PRODUCT_PURCHASING_FAILED: 'Retry',
      PURCHASE_SAVING: 'Buy for {{price}}',
      PURCHASE_SAVING_OFFLINE: 'Retry',
      PURCHASE_SAVING_FATAL: 'OK',
    },
    descriptionMd: `### Buy premium region

You will get access to following features:

- Descriptions of {{sectionsCount}} sections
- Unlocks navigate to put-in/take-out buttons
- Unlocks precise coordinates of put-ins, take-outs and POIs
    `,
  },
  alreadyHave: {
    message: 'It seems that you already have premium access to {{region}}',
  },
  auth: {
    anon: 'Please authenticate to proceed to purchase',
    user: 'Success! Please continue to your purchase',
  },
  success: {
    subheading: 'Success!',
    body: 'Now you have access to all premium features in region {{region}}',
  },
  errors: {
    refreshPremium: 'Failed to check product availability. Please check your internet connection.',
    fetchProduct: 'Failed to fetch product price. Please check your internet connection.',
    buyProduct: 'Failed to buy product. Please check your internet connection.',
    savePurchase: 'Failed to save your purchase. Please contact us. Your transaction id was {{transactionId}}.',
    savePurchaseOffline: 'Failed to save your purchase. Please check your internet connection. Your transaction id was {{transactionId}}.',
  },
};

export default iap;

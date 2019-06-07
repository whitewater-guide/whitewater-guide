const iap = {
  dialog: {
    title: 'Get {{region}} premium',
  },
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
    descriptionMd: `Take the full advantage of the whitewater.guide for {{region}}
- Detailed sections descriptions
- Navigate to put-ins/take-outs with just one tap
- Copy coordinates of put-ins, take-outs and extra points
- Download data for offline use
`,
  },
  alreadyHave: {
    message: 'It seems that you already have your premium access to {{region}}',
  },
  auth: {
    anon: 'Please authenticate to proceed',
    user: 'Success! Please continue to your purchase',
  },
  success: {
    subheading: 'Success!',
    body: 'Now you have access to all premium features in {{region}}',
  },
  errors: {
    refreshPremium:
      'Failed to check product availability. Please check your internet connection.',
    fetchProduct:
      'Failed to fetch product price. Please check your internet connection.',
    buyProduct: 'Failed to buy product. Please check your internet connection.',
    savePurchase:
      'Failed to save your purchase. Please contact us. Your transaction id was {{transactionId}}.',
    savePurchaseOffline:
      'Failed to save your purchase. Please check your internet connection. Your transaction id was {{transactionId}}.',
    alreadyOwned:
      'It appears that you have already purchased this region. Please sign out and then sign in under account that you used to purchase it. Your transaction id was {{transactionId}}.',
  },
  section: {
    message:
      '{{region}} is a premium region. Full description of this section is a premium feature',
    button: 'Get premium',
  },
};

export default iap;

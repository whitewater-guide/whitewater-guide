const iap = {
  dialog: {
    title: 'Obtenir {{region}} premium',
  },
  buy: {
    confirmButton: {
      REFRESHING_PREMIUM: 'Acheter pour {{prix}}',
      REFRESHING_PREMIUM_FAILED: 'Réessayez',
      PRODUCT_LOADING: 'Acheter',
      PRODUCT_LOADING_FAILED: 'Réessayez',
      IDLE: 'Acheter pour {{prix}}',
      PRODUCT_PURCHASING: 'Acheter pour {{prix}}',
      PRODUCT_PURCHASING_FAILED: 'Réessayez',
      PURCHASE_SAVING: 'Acheter pour {{prix}}',
      PURCHASE_SAVING_OFFLINE: 'Réessayez',
      PURCHASE_SAVING_FATAL: 'OK',
    },
    descriptionMd: `Profitez pleinement de whitewater.guide pour {{region}}
- Descriptions détaillées des sections
- Naviguez vers les mises à l’eau / sorties avec une seul touche
- Copier les coordonnées des mises à l’eau, des sorties et des points supplémentaires
- Télécharger les données pour une utilisation hors connexion`,
  },
  alreadyHave: {
    message: 'l semble que vous ayez déjà votre accès premium pour {{region}}',
  },
  auth: {
    anon: 'Veuillez vous authentifier pour continuer',
    user: "Succès! S'il vous plaît continuer à votre achat ",
  },
  success: {
    subheading: 'Succès!',
    body:
      'Vous avez maintenant accès à toutes les fonctionnalités premium du {{region}}',
  },
  erreurs: {
    refreshPremium:
      "Impossible de vérifier la disponibilité du produit. S'il vous plait, vérifiez votre connexion internet.",
    fetchProduct:
      "Impossible d'obtenir le prix du produit. S'il vous plait, vérifiez votre connexion internet.",
    buyProduct:
      "Impossible d'acheter le produit. S'il vous plait, vérifiez votre connexion internet.",
    savePurchase:
      "Impossible d'enregistrer votre achat. Contactez nous s'il vous plait. Votre identifiant de transaction était {{transactionId}}.",
    savePurchaseOffline:
      "Impossible d'enregistrer votre achat. S'il vous plait, vérifiez votre connexion internet. Votre identifiant de transaction était {{transactionId}}.",
    alreadyOwned:
      "Il semble que vous ayez déjà acheté cette région. Veuillez vous déconnecter et vous connecter sous le compte que vous avez utilisé pour l'acheter. Votre identifiant de transaction était {{transactionId}}.",
  },
  section: {
    message:
      '{{region}} est une région premium. Description complète de cette section est une fonctionnalité premium ',
    button: 'Obtenez premium',
  },
};

export default iap;

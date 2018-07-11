import { Platform } from 'react-native';
import { ProductPurchase } from 'react-native-iap';
import { PurchaseInput, PurchasePlatform } from '../../../ww-commons';

export const purchaseToGraphqlInput = (purchase: ProductPurchase): PurchaseInput => ({
  platform: Platform.select({ ios: PurchasePlatform.ios, android: PurchasePlatform.android }),
  productId: purchase.productId,
  transactionId: purchase.transactionId,
  transactionDate: new Date(purchase.transactionDate),
  receipt: Platform.select({
    ios: purchase.transactionReceipt,
    android: JSON.stringify({ data: purchase.data, signature: purchase.signature }),
  }),
  extra: purchase,
});

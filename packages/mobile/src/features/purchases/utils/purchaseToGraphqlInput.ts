import { Platform } from 'react-native';
import { ProductPurchase } from 'react-native-iap';
import { PurchaseInput, PurchasePlatform } from '../../../ww-commons';

export const purchaseToGraphqlInput = (purchase: ProductPurchase): PurchaseInput => ({
  platform: Platform.select({ ios: PurchasePlatform.ios, android: PurchasePlatform.android }),
  productId: purchase.productId,
  transactionId: purchase.transactionId,
  transactionDate: new Date(purchase.transactionDate),
  receipt: purchase.transactionReceipt,
  extra: purchase,
});

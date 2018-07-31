import { Platform } from 'react-native';
import { ProductPurchase } from 'react-native-iap';
import isValidDate from '../../../utils/isValidDate';
import { PurchaseInput, PurchasePlatform } from '../../../ww-commons';

export const purchaseToGraphqlInput = (purchase: ProductPurchase): PurchaseInput => {
  const unixEpoch = Date.parse(purchase.transactionDate) || parseInt(purchase.transactionDate);
  const transactionDate = new Date(unixEpoch);
  if (!isValidDate(transactionDate)) {
    throw new Error(`Invalid transaction date: '${purchase.transactionDate}'`);
  }
  return {
    platform: Platform.select({ ios: PurchasePlatform.ios, android: PurchasePlatform.android }),
    productId: purchase.productId,
    transactionId: purchase.transactionId,
    transactionDate,
    receipt: Platform.select({
      ios: purchase.transactionReceipt,
      android: JSON.stringify({ data: purchase.dataAndroid, signature: purchase.signatureAndroid }),
    }),
    extra: purchase,
  };
};

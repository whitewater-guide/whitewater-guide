import { ProductPurchase } from 'react-native-iap';
import { actionCreatorFactory } from 'typescript-fsa';
import { PurchaseDialogStep, RefreshPremiumPayload, UpdatePurchasePayload } from './types';

const factory = actionCreatorFactory('IAP');

export const purchaseActions = {
  update: factory<UpdatePurchasePayload>('UPDATE'),
  openDialog: factory('OPEN_DIALOG'),
  // Sets purchase dialog state for UI
  setDialogStep: factory<PurchaseDialogStep>('SET_DIALOG_STEP'),
  // Loads product info (price, etc) by sku from AppStore / PlayStore
  fetch: factory<string>('FETCH_PRODUCT_INFO'),
  // Buys product by sku from AppStore / PlayStore
  buy: factory<string>('BUY_PRODUCT'),
  // After IAP is complete, refresh premium content (region, section)
  refresh: factory<RefreshPremiumPayload>('REFRESH_PREMIUM'),
  // Resets current purchase flow (dialog was closed)
  reset: factory('RESET'),
  // Save receipt
  saveReceipt: factory<ProductPurchase>('SAVE_RECEIPT'),
  // Remove receipt
  removeReceipt: factory<ProductPurchase>('REMOVE_RECEIPT'),
  // Validate all stored receipts
  validateOfflineReceipts: factory('VALIDATE_OFFLINE_RECEIPTS'),
};

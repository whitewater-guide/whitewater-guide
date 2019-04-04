import { ProductPurchase } from 'react-native-iap';
import { actionCreatorFactory } from 'typescript-fsa';
import {
  PurchaseDialogData,
  RemoveOfflinePurchasePayload,
  UpdatePurchasePayload,
} from './types';

const factory = actionCreatorFactory('IAP');

export const purchaseActions = {
  update: factory<UpdatePurchasePayload>('UPDATE'),
  // Opens dialog
  openDialog: factory<PurchaseDialogData>('OPEN_DIALOG'),
  // Loads product info (price, etc) by sku from AppStore / PlayStore
  fetch: factory<string>('FETCH_PRODUCT_INFO'),
  // Buys product by sku from AppStore / PlayStore
  buy: factory<string>('BUY_PRODUCT'),
  // After IAP is complete, refresh premium content (region, section)
  refresh: factory('REFRESH_PREMIUM'),
  // Resets current purchase flow (dialog was closed)
  reset: factory('RESET'),
  // Save purchase on backend
  saveOfflinePurchase: factory<ProductPurchase>('SAVE_OFFLINE_PURCHASE'),
  // Remove offline purchase that was successfully saved
  removeOfflinePurchase: factory<RemoveOfflinePurchasePayload>(
    'REMOVE_OFFLINE_PURCHASE',
  ),
  // Retry save offline purchases
  retryOfflinePurchases: factory('RETRY_OFFLINE_PURCHASES'),
  logout: factory('LOGOUT'),
};

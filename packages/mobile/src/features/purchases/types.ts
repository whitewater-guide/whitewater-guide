import { Product, ProductPurchase } from 'react-native-iap';
import { Region } from '../../ww-commons/features/regions';

export const enum PurchaseState {
  IDLE = 'IDLE',
  PRODUCT_LOADING = 'PRODUCT_LOADING',
  PRODUCT_LOADING_FAILED = 'PRODUCT_LOADING_FAILED',
  PRODUCT_PURCHASING = 'PRODUCT_PURCHASING',
  PRODUCT_PURCHASING_FAILED = 'PRODUCT_PURCHASING_FAILED',
  PURCHASE_SAVING = 'PURCHASE_SAVING',
  PURCHASE_SAVING_OFFLINE = 'PURCHASE_SAVING_OFFLINE',
  PURCHASE_SAVING_FATAL = 'PURCHASE_SAVING_FATAL',
  REFRESHING_PREMIUM = 'REFRESHING_PREMIUM',
  REFRESHING_PREMIUM_FAILED = 'REFRESHING_PREMIUM_FAILED',
}

export type PurchaseDialogStep = 'AlreadyHave' | 'Auth' | 'BuyProduct' | 'Success';

export const enum RefreshPremiumResult {
  AVAILABLE,
  PURCHASED,
  NOT_LOGGED_IN,
  ERROR,
}

export interface PurchaseDialogData {
  region: Region;
  sectionId?: string;
}

export const enum SavePurchaseResult {
  SUCCESS,
  ERROR,
  OFFLINE,
}

export interface PurchaseStore {
  dialogOpen: boolean;
  dialogStep: PurchaseDialogStep;
  dialogData: PurchaseDialogData | null;
  state: PurchaseState;
  product: Product | null;
  error: [string] | [string, { [key: string]: string }] | null;
  offlinePurchases: ProductPurchase[];
}

export interface UpdatePurchasePayload {
  dialogStep?: PurchaseDialogStep;
  state?: PurchaseState;
  product?: Product | null;
  error?: string | [string, { [key: string]: string }] | null;
}

export interface RemoveOfflinePurchasePayload {
  purchase: ProductPurchase;
  success: boolean; // false if purchase was saved to backend, but returned error as result
}

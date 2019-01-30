import { Region } from '@whitewater-guide/commons';
import { Product, ProductPurchase } from 'react-native-iap';

export type PremiumRegion = Pick<
  Region,
  'id' | 'name' | 'sku' | 'sections' | 'hasPremiumAccess'
>;

export enum PurchaseState {
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

export type PurchaseDialogStep =
  | 'AlreadyHave'
  | 'Auth'
  | 'BuyProduct'
  | 'Success';

export enum RefreshPremiumResult {
  AVAILABLE,
  PURCHASED,
  NOT_LOGGED_IN,
  ERROR,
}

export enum SavePurchaseResult {
  SUCCESS,
  ERROR,
  OFFLINE,
}

export interface PurchaseDialogData {
  region: PremiumRegion;
  sectionId?: string;
}

export interface PurchaseStore {
  canMakePayments: boolean;
  dialogOpen: boolean;
  dialogStep: PurchaseDialogStep;
  dialogData: PurchaseDialogData | null;
  state: PurchaseState;
  product: Product<string> | null;
  error: [string] | [string, { [key: string]: string | undefined }] | null;
  offlinePurchases: ProductPurchase[];
}

export type PurchaseError =
  | string
  | [string, { [key: string]: string | undefined }]
  | null;

export interface UpdatePurchasePayload {
  canMakePayments?: boolean;
  dialogStep?: PurchaseDialogStep;
  state?: PurchaseState;
  product?: Product<string> | null;
  error?: PurchaseError;
}

export interface RemoveOfflinePurchasePayload {
  purchase: ProductPurchase;
  success: boolean; // false if purchase was saved to backend, but returned error as result
}

export interface BuyProductResult {
  purchase?: ProductPurchase;
  canceled?: boolean;
  alreadyOwned?: boolean;
  errorCode?: string;
}

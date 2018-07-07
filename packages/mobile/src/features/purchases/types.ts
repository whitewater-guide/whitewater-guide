import { Product, ProductPurchase } from 'react-native-iap';

export const enum PurchaseState {
  IDLE,
  PRODUCT_LOADING,
  PRODUCT_PURCHASING,
  PRODUCT_VALIDATING,
}

export type PurchaseDialogStep = 'AlreadyHave' | 'Auth' | 'BuyProduct' | 'Success';

export interface PurchaseStore {
  dialogOpen: boolean;
  dialogStep: PurchaseDialogStep;
  state: PurchaseState;
  product: Product | null;
  error: [string] | [string, { [key: string]: string }] | null;
  receipts: ProductPurchase[];
}

export interface RefreshPremiumPayload {
  regionId: string;
  sectionId?: string;
}

export interface UpdatePurchasePayload {
  state?: PurchaseState;
  product?: Product | null;
  error?: string | [string, { [key: string]: string }] | null;
}

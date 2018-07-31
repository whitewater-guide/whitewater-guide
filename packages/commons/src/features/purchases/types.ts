export enum PurchasePlatform {
  ios = 'ios',
  android = 'android',
  boomstarter = 'boomstarter',
}

export interface PurchaseInput {
  platform: PurchasePlatform;
  transactionId: string; // Promocode for boomstarter
  transactionDate?: Date | null;
  productId: string;
  receipt?: string | null; // Can be undefined for boomstarter
  extra?: any;
}

export interface BoomPromoInfo {
  id: string;
  code: string;
  groupName: string | null;
  groupSku: string | null;
  redeemed: boolean;
}

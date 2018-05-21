export enum PurchasePlatform {
  ios = 'ios',
  android = 'android',
  boomstarter = 'boomstarter',
}

export interface PurchaseInput {
  platform: PurchasePlatform;
  transactionId: string; // Promocode for boomstarter
  transactionDate?: Date;
  productId: string;
  receipt?: string; // Can be undefined for boomstarter
  extra?: any;
}

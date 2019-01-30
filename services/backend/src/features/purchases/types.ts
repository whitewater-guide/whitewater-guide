import { PurchasePlatform } from '@whitewater-guide/commons';

export interface TransactionRaw {
  id: string;
  user_id: string;
  platform: PurchasePlatform;
  transaction_date: Date | null;
  transaction_id: string;
  product_id: string;
  receipt: string | null;
  validated: boolean;
  extra: any;
  created_at: Date;
  updated_at: Date;
}

export interface BoomPromoRaw {
  code: string;
  group_sku: string | null;
  redeemed: boolean;
}

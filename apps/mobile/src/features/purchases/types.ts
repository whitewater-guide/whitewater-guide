import type { Region, Section } from '@whitewater-guide/schema';

export type SKU = string;

export type PremiumRegion = Pick<
  Region,
  'id' | 'name' | 'sku' | 'hasPremiumAccess' | 'premium'
>;

export type PremiumSection = Pick<Section, 'id' | 'demo'>;

export interface PurchaseParams {
  region: PremiumRegion;
  sectionId?: string;
}

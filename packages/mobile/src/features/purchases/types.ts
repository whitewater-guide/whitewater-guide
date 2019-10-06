import { Region, Section } from '@whitewater-guide/commons';

export type SKU = string;

export type PremiumRegion = Pick<
  Region,
  'id' | 'name' | 'sku' | 'sections' | 'hasPremiumAccess' | 'premium'
>;

export type PremiumSection = Pick<Section, 'id' | 'demo'>;

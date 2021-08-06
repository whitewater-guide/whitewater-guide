import { PremiumRegion, PremiumSection } from './types';

export const hasPremiumAccess = (
  canMakePayments: boolean,
  region?: PremiumRegion | null,
  section?: PremiumSection | null,
) =>
  !canMakePayments ||
  section?.demo ||
  !region ||
  !region.premium ||
  region.hasPremiumAccess;

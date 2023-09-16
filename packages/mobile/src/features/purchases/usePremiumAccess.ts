import { hasPremiumAccess } from './hasPremiumAccess';
import { useIap } from './IAPProvider';
import type { PremiumRegion, PremiumSection } from './types';

export function usePremiumAccess(
  region?: PremiumRegion | null,
  section?: PremiumSection | null,
): boolean {
  const { canMakePayments } = useIap();
  return hasPremiumAccess(canMakePayments, region, section);
}

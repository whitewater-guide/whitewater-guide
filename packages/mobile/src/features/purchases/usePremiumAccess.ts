import { hasPremiumAccess } from './hasPremiumAccess';
import { useIap } from './IAPProvider';
import { PremiumRegion, PremiumSection } from './types';

export const usePremiumAccess = (
  region?: PremiumRegion | null,
  section?: PremiumSection | null,
) => {
  const { canMakePayments } = useIap();
  return hasPremiumAccess(canMakePayments, region, section);
};

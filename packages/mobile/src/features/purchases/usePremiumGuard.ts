import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';

import { Screens } from '~/core/navigation';

import { PremiumRegion, PremiumSection } from './types';
import { usePremiumAccess } from './usePremiumAccess';

export const usePremiumGuard = (
  region?: PremiumRegion | null,
  section?: PremiumSection | null,
) => {
  const { navigate } = useNavigation();
  const isFree = usePremiumAccess(region, section);
  return useCallback(() => {
    if (!isFree) {
      const sectionId = section ? section.id : undefined;
      navigate(Screens.PURCHASE_STACK, { region, sectionId });
      return false;
    }
    return true;
  }, [isFree, region, section, navigate]);
};

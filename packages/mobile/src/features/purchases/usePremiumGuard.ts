import { Region, Section } from '@whitewater-guide/commons';
import { useCallback } from 'react';
import { useNavigation } from 'react-navigation-hooks';
import Screens from '../../screens/screen-names';
import { usePremiumAccess } from './usePremiumAccess';

export const usePremiumGuard = (
  region: Region | null,
  section?: Section | null,
) => {
  const { navigate } = useNavigation();
  const isFree = usePremiumAccess(region, section);
  return useCallback(() => {
    if (!isFree) {
      const sectionId = section ? section.id : undefined;
      navigate(Screens.Purchase.Root, { region, sectionId });
      return false;
    }
    return true;
  }, [isFree, region, section, navigate]);
};

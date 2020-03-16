import { useNavigation } from '@react-navigation/native';
import { Region, Section } from '@whitewater-guide/commons';
import { useCallback } from 'react';
import { Screens } from '~/core/navigation';
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
      navigate(Screens.PURCHASE_STACK, { region, sectionId });
      return false;
    }
    return true;
  }, [isFree, region, section, navigate]);
};

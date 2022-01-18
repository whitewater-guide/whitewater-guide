import { useNavigation } from '@react-navigation/native';
import { useRegion } from '@whitewater-guide/clients';
import { useMemo } from 'react';

import { Screens } from '~/core/navigation';

import { hasPremiumAccess } from './hasPremiumAccess';
import { useIap } from './IAPProvider';
import { PremiumRegion, PremiumSection } from './types';

export type PremiumCallbackHook = [
  callback: () => void,
  accessAllowed: boolean,
];

export function usePremiumCallback<
  TRegion extends PremiumRegion = PremiumRegion,
>(
  region?: TRegion | null,
  section?: PremiumSection | null,
  callback?: (region?: TRegion | null, section?: PremiumSection | null) => void,
  ...deps: unknown[]
): PremiumCallbackHook {
  const { navigate } = useNavigation();
  const { canMakePayments } = useIap();
  const isFree = hasPremiumAccess(canMakePayments, region, section);

  return useMemo(() => {
    if (!isFree && region) {
      return [
        () => {
          const sectionId = section ? section.id : undefined;
          navigate(Screens.PURCHASE_STACK, { region, sectionId });
        },
        false,
      ];
    }
    return [
      () => {
        callback?.(region, section);
      },
      true,
    ];
  }, [isFree, region, section, navigate, ...deps]);
}

export function useRegionPremiumCallback(
  section?: PremiumSection | null,
  callback?: (
    region?: PremiumRegion | null,
    section?: PremiumSection | null,
  ) => void,
  ...deps: unknown[]
) {
  const region = useRegion();
  return usePremiumCallback(region, section, callback, deps);
}

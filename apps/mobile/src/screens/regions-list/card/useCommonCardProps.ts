import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';

import { Screens } from '~/core/navigation';
import { useOfflineContent } from '~/features/offline';
import { useIap, usePremiumCallback } from '~/features/purchases';

import type { RegionsListNavProp } from '../types';
import type { ListedRegion } from '../useFavRegions';

export default function useCommonCardProps(region: ListedRegion) {
  const { navigate } = useNavigation<RegionsListNavProp>();
  const { canMakePayments } = useIap();
  const offline = useOfflineContent();
  const { setDialogRegion } = offline;

  const [downloadRegion] = usePremiumCallback<ListedRegion>(
    region,
    null,
    (reg) => {
      if (reg) {
        setDialogRegion(reg);
      }
    },
  );

  const buyRegion = useCallback(() => {
    navigate(Screens.PURCHASE_STACK, { region });
  }, [navigate, region]);

  const openRegion = useCallback(() => {
    navigate(Screens.REGION_STACK, { regionId: region.id });
  }, [navigate, region]);

  return {
    regionInProgress: offline.regionInProgress,
    offlineError: offline.error,
    canMakePayments,
    downloadRegion,
    buyRegion,
    openRegion,
  };
}

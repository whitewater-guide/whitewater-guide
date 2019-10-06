import { Region } from '@whitewater-guide/commons';
import { useCallback } from 'react';
import { useNavigation } from 'react-navigation-hooks';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../core/redux/reducers';
import { offlineContentActions } from '../../features/offline';
import { useIap, usePremiumGuard } from '../../features/purchases';
import Screens from '../screen-names';

export default (region: Region) => {
  const { navigate } = useNavigation();
  const { canMakePayments } = useIap();

  const regionInProgress = useSelector(
    (state: RootState) => state.offlineContent.regionInProgress,
  );

  const premiumGuard = usePremiumGuard(region);
  const dispatch = useDispatch();
  const downloadRegion = useCallback(() => {
    if (premiumGuard()) {
      dispatch(offlineContentActions.toggleDialog(region));
    }
  }, [dispatch, region, premiumGuard]);

  const buyRegion = useCallback(() => {
    navigate(Screens.Purchase.Root, { region });
  }, [navigate, region]);

  const openRegion = useCallback(() => {
    navigate(Screens.Region.Root, { regionId: region.id });
  }, [navigate, region]);

  return {
    regionInProgress,
    canMakePayments,
    downloadRegion,
    buyRegion,
    openRegion,
  };
};

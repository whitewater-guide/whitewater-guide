import { useCallback, useEffect, useState } from 'react';
import {
  IAPErrorCode,
  ProductPurchase,
  PurchaseError,
  purchaseErrorListener,
  purchaseUpdatedListener,
  requestPurchase,
} from 'react-native-iap';
import { useNavigation } from 'react-navigation-hooks';
import useUpdateEffect from 'react-use/lib/useUpdateEffect';
import { trackError } from '../../../core/errors';
import { IAPError } from '../../../features/purchases';
import Screens from '../../screen-names';
import safeAcknowledgePurchase from './safeAcknowledgePurchase';
import safeRestorePurchase from './safeRestorePurchase';
import useSavePurchase from './useSavePurchase';

interface State {
  loading: boolean;
  error?: IAPError;
  purchase?: ProductPurchase;
  saved: boolean;
  acknowledged: boolean;
}

export default (sku: string | null, sectionId?: string) => {
  const { navigate } = useNavigation();
  const [state, setState] = useState<State>({
    loading: false,
    saved: false,
    acknowledged: false,
  });

  const save = useSavePurchase(sectionId);

  useEffect(() => {
    const sub = purchaseUpdatedListener(async (purchase: ProductPurchase) => {
      if (purchase.productId !== sku) {
        return;
      }
      setState((current) => ({
        ...current,
        error: undefined,
        purchase,
        loading: false,
      }));
    });
    return () => sub.remove();
  }, [setState, sku]);

  useEffect(() => {
    const sub = purchaseErrorListener((e: PurchaseError) => {
      if (!sku) {
        return;
      }
      if (e.code === IAPErrorCode.E_USER_CANCELLED) {
        setState((current) => ({ ...current, loading: false }));
      } else if (e.code === IAPErrorCode.E_ALREADY_OWNED) {
        // Android only
        safeRestorePurchase(sku).then((restored) => {
          setState((current) => ({ ...current, ...restored, loading: false }));
        });
      } else {
        const error = new IAPError(
          'screens:purchase.buy.errors.requestPurchase',
          e.message,
        );
        trackError('iap', error);
        setState((current) => ({ ...current, error, loading: false }));
      }
    });
    return () => sub.remove();
  }, [sku, setState]);

  const act = useCallback(
    (asEffect?: boolean) => {
      if (state.loading || !sku) {
        return;
      }

      if (!state.purchase) {
        if (asEffect === true) {
          return;
        }
        setState((current) => ({ ...current, loading: true }));
        requestPurchase(sku, false).catch(() => {});
        return;
      }

      if (!state.saved) {
        setState((current) => ({ ...current, loading: true }));
        save(state.purchase).then((result) => {
          setState((current) => ({ ...current, ...result, loading: false }));
        });
        return;
      }

      if (!state.acknowledged) {
        setState((current) => ({ ...current, loading: true }));
        safeAcknowledgePurchase(state.purchase).then((result) => {
          setState((current) => ({ ...current, ...result, loading: false }));
        });
        return;
      }

      navigate(Screens.Purchase.Success);
    },
    [sku, state, setState, save, navigate],
  );

  useUpdateEffect(() => {
    if (!state.error) {
      act(true);
    }
  }, [act, state]);

  return {
    loading: state.loading,
    onPress: act,
    error: state.error,
  };
};

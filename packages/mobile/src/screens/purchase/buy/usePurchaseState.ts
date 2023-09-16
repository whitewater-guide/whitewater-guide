import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { Screens } from '~/core/navigation';

import type { PremiumRegion } from '../../../features/purchases';
import { IAPError, useIap } from '../../../features/purchases';
import type { PurchaseBuyNavProp, PurchaseState } from './types';
import usePremiumQuery from './usePremiumQuery';
import usePurchaseAction from './usePurchaseAction';

export default (region: PremiumRegion, sectionId?: string): PurchaseState => {
  const { goBack, navigate } = useNavigation<PurchaseBuyNavProp>();
  const { t } = useTranslation();
  const iapState = useIap();
  const premiumState = usePremiumQuery(region, sectionId);
  const purchaseAction = usePurchaseAction(region.sku!, sectionId);
  const { canMakePayments, products } = iapState;
  const product = region.sku ? products.get(region.sku) : undefined;
  const buyButton = product
    ? t('screens:purchase.buy.confirmButton.buy', {
        price: product.localizedPrice,
      })
    : t('screens:purchase.buy.confirmButton.noPrice');

  if (iapState.error) {
    return {
      error: iapState.error,
      button: t('screens:purchase.buy.confirmButton.retry'),
      onPress: () => iapState.refresh(),
    };
  }

  if (premiumState.error) {
    return {
      error: premiumState.error,
      button: t('screens:purchase.buy.confirmButton.retry'),
      onPress: () => premiumState.refetch(),
    };
  }

  if (purchaseAction.error) {
    return {
      error: purchaseAction.error,
      button: t('screens:purchase.buy.confirmButton.retry'),
      onPress: purchaseAction.onPress,
    };
  }

  if (iapState.loading) {
    return {
      loading: true,
      button: buyButton,
    };
  }

  const { hasPremiumAccess, me } = premiumState;

  if (!product) {
    return {
      button: t('commons:ok'),
      error: new IAPError(
        'screens:purchase.buy.errors.notFound',
        `Could not find product with sku '${region.sku}'`,
        { sku: region.sku || undefined },
      ),
      onPress: () => goBack(),
    };
  }

  if (!canMakePayments) {
    return {
      button: t('commons:ok'),
      error: new IAPError('screens:purchase.buy.errors.cannotMakePayments'),
      onPress: () => goBack(),
    };
  }

  if (premiumState.loading) {
    return { loading: true, button: buyButton };
  }

  if (hasPremiumAccess) {
    return {
      button: buyButton,
      // @ts-ignore: it wants region as params, but it's already in initialParams
      onPress: () => navigate(Screens.PURCHASE_ALREADY_HAVE),
    };
  }

  if (!me) {
    return {
      button: buyButton,
      onPress: () =>
        navigate({ name: Screens.AUTH_STACK, key: Screens.AUTH_STACK }),
    };
  }

  if (!me.verified) {
    return {
      button: buyButton,
      // @ts-ignore: it wants region as params, but it's already in initialParams
      onPress: () => navigate(Screens.PURCHASE_VERIFY),
    };
  }

  return {
    button: purchaseAction.error
      ? t('screens:purchase.buy.confirmButton.retry')
      : buyButton,
    loading: purchaseAction.loading,
    error: purchaseAction.error,
    onPress: purchaseAction.loading ? undefined : purchaseAction.onPress,
  };
};

import { useTranslation } from 'react-i18next';
import { useNavigation } from 'react-navigation-hooks';
import { IAPError, PremiumRegion, useIap } from '../../../features/purchases';
import Screens from '../../screen-names';
import { PurchaseState } from './types';
import usePremiumQuery from './usePremiumQuery';
import usePurchaseAction from './usePurchaseAction';

export default (region: PremiumRegion, sectionId?: string): PurchaseState => {
  const { goBack, navigate } = useNavigation();
  const { t } = useTranslation();
  const iapState = useIap();
  const premiumState = usePremiumQuery(region, sectionId);
  const purchaseAction = usePurchaseAction(region.sku, sectionId);
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
      onPress: () => navigate(Screens.Purchase.AlreadyHave),
    };
  }

  if (!me) {
    return {
      button: buyButton,
      onPress: () =>
        navigate({ routeName: Screens.Auth.Root, key: Screens.Auth.Root }),
    };
  }

  if (!me.verified) {
    return {
      button: buyButton,
      onPress: () => navigate(Screens.Purchase.Verify),
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

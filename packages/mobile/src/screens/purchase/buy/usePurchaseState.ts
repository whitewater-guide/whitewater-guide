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

  if (iapState.loading) {
    return {
      loading: true,
      button: t('screens:purchase.buy.confirmButton.noPrice'),
    };
  }

  const { canMakePayments, products } = iapState;
  const { hasPremiumAccess, me } = premiumState;
  const product = region.sku ? products.get(region.sku) : undefined;

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

  const button = t('screens:purchase.buy.confirmButton.buy', {
    price: product.localizedPrice,
  });

  if (premiumState.loading) {
    return { loading: true, button };
  }

  if (hasPremiumAccess) {
    return {
      button,
      onPress: () => navigate(Screens.Purchase.AlreadyHave),
    };
  }

  if (!me) {
    return {
      button,
      onPress: () =>
        navigate({ routeName: Screens.Auth.Root, key: Screens.Auth.Root }),
    };
  }

  if (!me.verified) {
    return {
      button,
      onPress: () => navigate(Screens.Purchase.Verify),
    };
  }

  return {
    button: purchaseAction.error
      ? t('screens:purchase.buy.confirmButton.retry')
      : button,
    loading: purchaseAction.loading,
    error: purchaseAction.error,
    onPress: purchaseAction.loading ? undefined : purchaseAction.onPress,
  };
};

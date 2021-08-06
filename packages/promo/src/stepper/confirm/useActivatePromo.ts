import {
  BoomPromoInfo,
  PurchaseInput,
  PurchasePlatform,
} from '@whitewater-guide/schema';
import { useTranslation } from 'react-i18next';
import useAsyncFn from 'react-use/lib/useAsyncFn';

import { PromoRegionFragment } from '../promoRegion.generated';
import { useActivatePromoMutation } from './activatePromo.generated';

interface Result {
  success: boolean;
  error?: string;
}

export default function useActivatePromo(
  region: PromoRegionFragment | null,
  promo: BoomPromoInfo,
) {
  const [mutate] = useActivatePromoMutation();
  const { t } = useTranslation();

  const [_, activatePromo] = useAsyncFn(async (): Promise<Result> => {
    const productId = promo.groupSku || region?.sku;
    let success = false;
    let error: string | undefined;
    if (!productId) {
      return { error: t('confirm:errors.noProductId'), success };
    }
    const purchase: PurchaseInput = {
      platform: PurchasePlatform.boomstarter,
      transactionId: promo.code,
      productId,
    };
    try {
      const { data, errors } = await mutate({
        variables: { purchase },
      });
      success = data ? !!data.savePurchase : false;
      const hasErrors = errors && errors.length > 0;
      if (hasErrors) {
        console.error(errors);
      }
      error = success ? undefined : t('confirm:errors.badCode');
    } catch (e) {
      error = t('confirm:errors.network');
    }
    return { error, success };
  }, [mutate, t, region, promo]);

  return activatePromo;
}

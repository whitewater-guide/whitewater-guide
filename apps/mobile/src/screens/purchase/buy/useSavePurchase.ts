import { PurchasePlatform } from '@whitewater-guide/schema';
import { useCallback } from 'react';
import { Platform } from 'react-native';
import type { ProductPurchase } from 'react-native-iap';

import { IAPError } from '../../../features/purchases';
import { useAddPurchaseMutation } from './addPurchase.generated';

type Hook = (
  purchase: ProductPurchase,
) => Promise<{ error?: IAPError; saved: boolean }>;

export default function useSavePurchase(sectionId?: string): Hook {
  const [mutate] = useAddPurchaseMutation();
  return useCallback(
    (purchase: ProductPurchase) =>
      mutate({
        variables: {
          purchase: {
            platform:
              Platform.OS === 'ios'
                ? PurchasePlatform.ios
                : PurchasePlatform.android,
            productId: purchase.productId,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            transactionId: purchase.transactionId!,
            transactionDate: new Date(purchase.transactionDate).toISOString(),
            receipt: purchase.transactionReceipt,
            extra: purchase,
          },
          sectionId,
        },
      })
        .then(({ errors }) => {
          const error = errors
            ? new IAPError(
                'screens:purchase.buy.errors.savePurchase',
                JSON.stringify({ errors, purchase }, null, 2),
                { transactionId: purchase.transactionId },
              )
            : undefined;
          return { error, saved: !error };
        })
        .catch((e) => ({
          error: new IAPError(
            'screens:purchase.buy.errors.savePurchase',
            JSON.stringify({ error: e, purchase }, null, 2),
            { transactionId: purchase.transactionId },
          ),
          saved: false,
        })),
    [mutate, sectionId],
  );
}

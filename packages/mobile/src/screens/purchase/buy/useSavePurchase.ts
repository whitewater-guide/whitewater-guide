import { PurchaseInput, PurchasePlatform } from '@whitewater-guide/commons';
import gql from 'graphql-tag';
import { useCallback } from 'react';
import { useMutation } from 'react-apollo';
import { Platform } from 'react-native';
import { ProductPurchase } from 'react-native-iap';
import { IAPError } from '../../../features/purchases';

const ADD_PURCHASE_MUTATION = gql`
  mutation addPurchase($purchase: PurchaseInput!, $sectionId: ID) {
    savePurchase(purchase: $purchase, sectionId: $sectionId) {
      regions {
        id
        sku
        hasPremiumAccess
      }
      section {
        id
        description
      }
    }
  }
`;

interface Vars {
  purchase: PurchaseInput;
  sectionId?: string;
}

type Hook = (
  purchase: ProductPurchase,
) => Promise<{ error?: IAPError; saved: boolean }>;

export default (sectionId?: string): Hook => {
  const [mutate] = useMutation<{}, Vars>(ADD_PURCHASE_MUTATION);
  return useCallback(
    (purchase: ProductPurchase) =>
      mutate({
        variables: {
          purchase: {
            platform: Platform.select({
              ios: PurchasePlatform.ios,
              android: PurchasePlatform.android,
            }),
            productId: purchase.productId,
            transactionId: purchase.transactionId!,
            transactionDate: new Date(purchase.transactionDate),
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
        .catch((e) => {
          return {
            error: new IAPError(
              'screens:purchase.buy.errors.savePurchase',
              JSON.stringify({ error: e, purchase }, null, 2),
              { transactionId: purchase.transactionId },
            ),
            saved: false,
          };
        }),
    [mutate, sectionId],
  );
};

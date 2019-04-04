import { MutationOptions } from 'apollo-client';
import { FetchResult } from 'apollo-link';
import { ProductPurchase } from 'react-native-iap';
import { apply } from 'redux-saga/effects';
import { apolloClient } from '../../../core/apollo';
import { trackError } from '../../../core/errors';
import isApolloOfflineError from '../../../utils/isApolloOfflineError';
import { SavePurchaseResult } from '../types';
import { purchaseToGraphqlInput } from '../utils';
import { ADD_PURCHASE_MUTATION, Vars } from './addPurchase.mutation';

export default function* savePurchase(purchase: ProductPurchase) {
  try {
    // console.log('------------------');
    // console.dir(purchase);
    // console.dir(purchaseToGraphqlInput(purchase));
    // false for duplicate purchases, unless purchase is for different user. In this case throws
    const mutationOpts: MutationOptions<Vars> = {
      mutation: ADD_PURCHASE_MUTATION,
      variables: { info: purchaseToGraphqlInput(purchase) },
    };
    const { errors }: FetchResult<any> = yield apply(
      apolloClient,
      apolloClient.mutate,
      [mutationOpts],
    );
    if (errors && errors.length) {
      trackError('iap', errors[0]);
      return SavePurchaseResult.ERROR;
    }
  } catch (e) {
    trackError('iap', e);
    if (isApolloOfflineError(e)) {
      return SavePurchaseResult.OFFLINE;
    }
    return SavePurchaseResult.ERROR;
  }
  return SavePurchaseResult.SUCCESS;
}

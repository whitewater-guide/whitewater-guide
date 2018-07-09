import { FetchResult } from 'apollo-link';
import { ProductPurchase } from 'react-native-iap';
import { apply } from 'redux-saga/effects';
import { getApolloClient } from '../../../core/apollo';
import { trackError } from '../../../core/errors';
import isApolloOfflineError from '../../../utils/isApolloOfflineError';
import { SavePurchaseResult } from '../types';
import { purchaseToGraphqlInput } from '../utils';
import { ADD_PURCHASE_MUTATION } from './addPurchase.mutation';

export default function *savePurchase(purchase: ProductPurchase) {
  try {
    const client = getApolloClient();
    // false for duplicate purchases, unless purchase is for different user. In this case throws
    const { errors }: FetchResult<any> = yield apply(client, client.mutate, [{
      mutation: ADD_PURCHASE_MUTATION,
      variables: { info: purchaseToGraphqlInput(purchase) },
    }]);
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
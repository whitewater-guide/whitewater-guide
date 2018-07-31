import { ApolloQueryResult, QueryOptions } from 'apollo-client';
import { apply, put, select } from 'redux-saga/effects';
import { refreshRegionsList } from '../../../core/actions';
import { getApolloClient } from '../../../core/apollo';
import { trackError } from '../../../core/errors';
import { RootState } from '../../../core/reducers';
import { PurchaseDialogData, RefreshPremiumResult } from '../types';
import { PREMIUM_DIALOG_QUERY, Result, Vars } from './premiumDialog.query';

export function *refreshPremium() {
  const client = yield getApolloClient();

  const dialogData: PurchaseDialogData = yield select((root: RootState) => root.purchase.dialogData);
  if (!dialogData) {
    return RefreshPremiumResult.ERROR;
  }
  const variables: Vars = { regionId: dialogData.region.id, sectionId: dialogData.sectionId };
  try {
    const { data, errors } = yield apply<Promise<ApolloQueryResult<Result>>, QueryOptions<Vars>>(
      client,
      client.query,
      [{ query: PREMIUM_DIALOG_QUERY, variables, fetchPolicy: 'network-only' }],
    );
    yield put(refreshRegionsList());
    if (errors && errors.length) {
      trackError('iap', errors[0]);
      return RefreshPremiumResult.ERROR;
    } else if (!data.region) {
      return RefreshPremiumResult.ERROR;
    } else if (data.region.hasPremiumAccess) {
      return RefreshPremiumResult.PURCHASED;
    } else if (!data.me) {
      return RefreshPremiumResult.NOT_LOGGED_IN;
    }
  } catch (e) {
    trackError('iap', e);
    return RefreshPremiumResult.ERROR;
  }
  return RefreshPremiumResult.AVAILABLE;
}

import { call } from 'redux-saga/effects';
import { PurchaseState, RefreshPremiumResult } from '../types';
import { refreshPremium } from './refreshPremium';
import update from './update';

export function* watchRefreshPremium() {
  yield update({ error: null, state: PurchaseState.REFRESHING_PREMIUM });
  const result = yield call(refreshPremium);
  yield update({
    state: result === RefreshPremiumResult.ERROR ? PurchaseState.REFRESHING_PREMIUM_FAILED : PurchaseState.IDLE,
    error: result === RefreshPremiumResult.ERROR ? 'iap:errors.refreshPremium' : null,
  });
}

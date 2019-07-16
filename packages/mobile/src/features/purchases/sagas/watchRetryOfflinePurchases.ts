import { ProductPurchase } from 'react-native-iap';
import { call, put, select } from 'redux-saga/effects';
import { RootState } from '../../../core/redux/reducers';
import { purchaseActions } from '../actions';
import { SavePurchaseResult } from '../types';
import savePurchase from './savePurchase';

export function* watchRetryOfflinePurchases() {
  const offlinePurchases: ProductPurchase[] = yield select(
    (state: RootState) => state.purchase.offlinePurchases,
  );
  for (const purchase of offlinePurchases) {
    const result = yield call(savePurchase, purchase);
    if (result !== SavePurchaseResult.OFFLINE) {
      yield put(
        purchaseActions.removeOfflinePurchase({
          purchase,
          success: result !== SavePurchaseResult.ERROR,
        }),
      );
    }
  }
}

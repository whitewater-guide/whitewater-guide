import { consumeAllItems, endConnection, finishTransaction } from 'react-native-iap';
import { call } from 'redux-saga/effects';
import { trackError } from '../../../core/errors';

export function *finishPurchase() {
  try {
    yield call(finishTransaction); // ios-only, handles offline on native level
    yield call(consumeAllItems); // android-only, can throw
  } catch (e) {
    trackError('iap', e);
  } finally {
    yield call(endConnection); // android-only
  }
}

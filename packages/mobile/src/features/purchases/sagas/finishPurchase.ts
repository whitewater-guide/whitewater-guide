import { endConnection } from 'react-native-iap';
import { call } from 'redux-saga/effects';
import { trackError } from '../../../core/errors';

export function* finishPurchase() {
  try {
    yield call(endConnection); // android-only
  } catch (e) {
    trackError('iap', e);
  }
}

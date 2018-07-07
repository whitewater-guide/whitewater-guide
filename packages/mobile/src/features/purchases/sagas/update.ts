import { put } from 'redux-saga/effects';
import { purchaseActions } from '../actions';
import { UpdatePurchasePayload } from '../types';

export default function* update(payload: UpdatePurchasePayload) {
  yield put(purchaseActions.update(payload));
}

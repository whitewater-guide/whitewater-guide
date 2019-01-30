import { AsyncStorage } from 'react-native';
import { Reducer } from 'redux';
import { PersistConfig, persistReducer } from 'redux-persist';
import { AnyAction, isType } from 'typescript-fsa';
import { auth } from '../../core/auth';
import { purchaseActions } from './actions';
import { PurchaseState, PurchaseStore } from './types';

export const PURCHASE_REDUCER_KEY = 'purchase';

const persistConfig: PersistConfig = {
  key: PURCHASE_REDUCER_KEY,
  storage: AsyncStorage,
  whitelist: ['offlinePurchases'],
};

export const initialState: PurchaseStore = {
  canMakePayments: true,
  state: PurchaseState.IDLE,
  dialogOpen: false,
  dialogStep: 'BuyProduct',
  dialogData: null,
  error: null,
  product: null,
  offlinePurchases: [],
};

export const basePurchaseReducer = (
  state: PurchaseStore = initialState,
  action: AnyAction,
): PurchaseStore => {
  if (isType(action, purchaseActions.openDialog)) {
    const { region, sectionId } = action.payload;
    return {
      ...state,
      dialogData: { region, sectionId },
      dialogOpen: true,
    };
  }

  if (isType(action, purchaseActions.update)) {
    const pError = action.payload.error;
    const error =
      (typeof pError === 'string' ? ([pError] as [string]) : pError!) ||
      state.error;
    return { ...state, ...action.payload, error };
  }

  if (isType(action, purchaseActions.reset)) {
    return { ...initialState, offlinePurchases: state.offlinePurchases };
  }

  if (isType(action, auth.logout)) {
    return { ...initialState };
  }

  if (isType(action, purchaseActions.saveOfflinePurchase)) {
    return {
      ...state,
      offlinePurchases: [...state.offlinePurchases, action.payload],
    };
  }

  if (isType(action, purchaseActions.removeOfflinePurchase)) {
    const { purchase } = action.payload;
    const offlinePurchases = [...state.offlinePurchases];
    const index = offlinePurchases.findIndex(
      (p) => p.transactionId === purchase.transactionId,
    );
    if (index >= 0) {
      offlinePurchases.splice(index, 1);
    }
    return { ...state, offlinePurchases };
  }

  return state;
};

export const purchaseReducer: Reducer = persistReducer(
  persistConfig,
  basePurchaseReducer,
);

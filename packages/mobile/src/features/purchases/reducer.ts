import { AsyncStorage } from 'react-native';
import { PersistConfig, persistReducer } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2';
import { AnyAction, isType } from 'typescript-fsa';
import { auth } from '../../core/auth';
import { purchaseActions } from './actions';
import { PurchaseState, PurchaseStore } from './types';

export const PURCHASE_REDUCER_KEY = 'purchase';

const persistConfig: PersistConfig = {
  key: PURCHASE_REDUCER_KEY,
  storage: AsyncStorage,
  whitelist: ['offlinePurchases'],
  stateReconciler: autoMergeLevel2,
};

const initialState: PurchaseStore = {
  state: PurchaseState.IDLE,
  dialogOpen: false,
  dialogStep: 'BuyProduct',
  dialogData: null,
  error: null,
  product: null,
  offlinePurchases: [],
};

export const purchaseReducer = persistReducer(persistConfig,
  (state: PurchaseStore = initialState, action: AnyAction): PurchaseStore => {
    if (isType(action, purchaseActions.openDialog)) {
      return { ...state, dialogOpen: true };
    }

    if (isType(action, purchaseActions.setDialogData)) {
      return { ...state, dialogData: action.payload };
    }

    if (isType(action, purchaseActions.update)) {
      const pError = action.payload.error;
      const error = (typeof pError === 'string' ? [pError] as [string] : pError!) || state.error;
      return { ...state, ...action.payload, error };
    }

    if (isType(action, purchaseActions.reset)) {
      return { ...initialState, offlinePurchases: state.offlinePurchases };
    }

    if (isType(action, auth.logout)) {
      return { ...initialState };
    }

    if (isType(action, purchaseActions.saveOfflinePurchase)) {
      return { ...state, offlinePurchases: [...state.offlinePurchases, action.payload] };
    }

    if (isType(action, purchaseActions.removeOfflinePurchase)) {
      const { purchase } = action.payload;
      const offlinePurchases = [...state.offlinePurchases];
      const index = offlinePurchases.findIndex((p) => p.transactionId === purchase.transactionId);
      if (index >= 0) {
        offlinePurchases.splice(index, 1);
      }
      return { ...state, offlinePurchases };
    }

    return state;
  });

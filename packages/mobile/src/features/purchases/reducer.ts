import { AsyncStorage } from 'react-native';
import { PersistConfig, persistReducer } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2';
import { AnyAction, isType } from 'typescript-fsa';
import { purchaseActions } from './actions';
import { PurchaseState, PurchaseStore } from './types';

export const PURCHASE_REDUCER_KEY = 'purchase';

const persistConfig: PersistConfig = {
  key: PURCHASE_REDUCER_KEY,
  storage: AsyncStorage,
  whitelist: ['receipts'],
  stateReconciler: autoMergeLevel2,
};

const initialState: PurchaseStore = {
  state: PurchaseState.IDLE,
  dialogOpen: false,
  dialogStep: 'BuyProduct',
  error: null,
  product: null,
  receipts: [],
};

export const purchaseReducer = persistReducer(persistConfig,
  (state: PurchaseStore = initialState, action: AnyAction): PurchaseStore => {
    if (isType(action, purchaseActions.openDialog)) {
      return { ...state, dialogOpen: true };
    }

    if (isType(action, purchaseActions.setDialogStep)) {
      return { ...state, dialogStep: action.payload };
    }

    if (isType(action, purchaseActions.update)) {
      const pError = action.payload.error;
      const error = (typeof pError === 'string' ? [pError] as [string] : pError!) || state.error;
      return { ...state, ...action.payload, error };
    }

    if (isType(action, purchaseActions.reset)) {
      return { ...initialState, receipts: state.receipts };
    }

    if (isType(action, purchaseActions.saveReceipt)) {
      return { ...state, receipts: [...state.receipts, action.payload] };
    }

    if (isType(action, purchaseActions.removeReceipt)) {
      const receipt = action.payload;
      const receipts = [...state.receipts];
      const index = receipts.findIndex((r) => r.transactionId === receipt.transactionId);
      if (index >= 0) {
        receipts.splice(index, 1);
      }
      return { ...state, receipts };
    }

    return state;
  });

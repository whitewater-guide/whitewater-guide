import noop from 'lodash/noop';
import React, {
  createContext,
  Reducer,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import { Product } from 'react-native-iap';
import useMountedState from 'react-use/lib/useMountedState';

import { IAPError } from './IAPError';
import { safeGetProducts, safeInitConnection } from './safe-iap';
import { SKU } from './types';
import useSkus from './useSkus';

interface State {
  canMakePayments: boolean;
  loading: boolean;
  products: Map<SKU, Product>;
  error: IAPError | undefined;
}

export interface IapContext extends State {
  refresh: () => void;
}

const IapCtx = createContext<IapContext>({
  canMakePayments: true,
  loading: false,
  products: new Map(),
  refresh: noop,
  error: undefined,
});

const initialState: State = {
  canMakePayments: true,
  loading: false,
  products: new Map(),
  error: undefined,
};

enum ActionType {
  SET_CMP,
  LOAD_PRODUCTS,
  LOADED_PRODUCTS,
}

type Action =
  | { type: ActionType.SET_CMP; canMakePayments: boolean }
  | { type: ActionType.LOAD_PRODUCTS }
  | {
      type: ActionType.LOADED_PRODUCTS;
      products: Product[];
      error: Error | undefined;
    };

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case ActionType.SET_CMP:
      return { ...state, canMakePayments: action.canMakePayments };
    case ActionType.LOAD_PRODUCTS:
      return { ...state, loading: true, error: undefined };
    case ActionType.LOADED_PRODUCTS: {
      const products = new Map(state.products);
      action.products.forEach((p) => products.set(p.productId, p));
      return { ...state, loading: false, error: action.error, products };
    }
    default:
      return state;
  }
};

export const IapProvider: React.FC = ({ children }) => {
  const isMounted = useMountedState();
  const [state, dispatch] = useReducer(reducer, initialState);
  const skus = useSkus();

  useEffect(() => {
    safeInitConnection().then((canMakePayments) => {
      if (isMounted()) {
        dispatch({ type: ActionType.SET_CMP, canMakePayments });
      }
    });
  }, [dispatch, isMounted]);

  const refresh = useCallback(() => {
    if (skus.size === 0) {
      return;
    }
    dispatch({ type: ActionType.LOAD_PRODUCTS });
    safeGetProducts(Array.from(skus.keys())).then((resp) => {
      if (isMounted()) {
        dispatch({ type: ActionType.LOADED_PRODUCTS, ...resp });
      }
    });
  }, [skus, dispatch, isMounted]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const value: IapContext = { ...state, refresh };

  return <IapCtx.Provider value={value}>{children}</IapCtx.Provider>;
};

IapProvider.displayName = 'IapProvider';

export const useIap = () => useContext(IapCtx);

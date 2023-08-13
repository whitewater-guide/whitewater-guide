import noop from 'lodash/noop';
import {
  createContext,
  FC,
  PropsWithChildren,
  Reducer,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import { Product } from 'react-native-iap';
import useMountedState from 'react-use/lib/useMountedState';

import { IAPError } from './IAPError';
import {
  safeEndConnection,
  safeGetProducts,
  safeInitConnection,
} from './safe-iap';
import { SKU } from './types';
import useSkus from './useSkus';

interface State {
  initialized: boolean;
  canMakePayments: boolean;
  loading: boolean;
  products: Map<SKU, Product>;
  error: IAPError | undefined;
}

export interface IapContext extends State {
  refresh: () => void;
}

const IapCtx = createContext<IapContext>({
  initialized: false,
  canMakePayments: true,
  loading: false,
  products: new Map(),
  refresh: noop,
  error: undefined,
});

const initialState: State = {
  initialized: false,
  canMakePayments: true,
  loading: false,
  products: new Map(),
  error: undefined,
};

enum ActionType {
  INITIALIZE,
  LOAD_PRODUCTS,
  LOADED_PRODUCTS,
}

type Action =
  | { type: ActionType.INITIALIZE; canMakePayments: boolean }
  | { type: ActionType.LOAD_PRODUCTS }
  | {
      type: ActionType.LOADED_PRODUCTS;
      products: Product[];
      error: Error | undefined;
    };

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case ActionType.INITIALIZE:
      return {
        ...state,
        canMakePayments: action.canMakePayments,
        initialized: true,
      };
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

export const IapProvider: FC<PropsWithChildren> = ({ children }) => {
  const isMounted = useMountedState();
  const [state, dispatch] = useReducer(reducer, initialState);
  const skus = useSkus();
  const { initialized, canMakePayments } = state;

  useEffect(() => {
    safeInitConnection().then((canMakePayments) => {
      if (isMounted()) {
        dispatch({ type: ActionType.INITIALIZE, canMakePayments });
      }
    });
  }, [dispatch, isMounted]);

  const refresh = useCallback(() => {
    if (skus.size === 0 || !canMakePayments) {
      return;
    }
    dispatch({ type: ActionType.LOAD_PRODUCTS });
    safeGetProducts(Array.from(skus.keys())).then((resp) => {
      if (isMounted()) {
        dispatch({ type: ActionType.LOADED_PRODUCTS, ...resp });
      }
    });
  }, [skus, canMakePayments, dispatch, isMounted]);

  useEffect(() => {
    if (initialized) {
      refresh();
    }
  }, [refresh, initialized]);

  useEffect(() => {
    return () => {
      safeEndConnection();
    };
  }, []);

  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const value: IapContext = { ...state, refresh };

  return <IapCtx.Provider value={value}>{children}</IapCtx.Provider>;
};

IapProvider.displayName = 'IapProvider';

export const useIap = () => useContext(IapCtx);

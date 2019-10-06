import {
  endConnectionAndroid,
  getProducts,
  initConnection,
  Product,
} from 'react-native-iap';
import { trackError } from '../../core/errors';
import { IAPError } from './IAPError';

const LOGGER = 'iap';

const safeEndConnection = async () => {
  try {
    await endConnectionAndroid();
  } catch {}
};

export const safeInitConnection = async (): Promise<boolean> => {
  let result = true;
  try {
    result = !!(await initConnection());
  } catch (e) {
    trackError(LOGGER, e);
  } finally {
    await safeEndConnection();
  }
  return result;
};

export const safeGetProducts = async (skus: string[]) => {
  let products: Product[] = [];
  let error: IAPError | undefined;
  try {
    products = await getProducts(skus);
  } catch (e) {
    error = new IAPError('screens:purchase.buy.errors.fetchProduct', e.message);
    trackError(LOGGER, error);
  } finally {
    await safeEndConnection();
  }
  return {
    products,
    error,
  };
};

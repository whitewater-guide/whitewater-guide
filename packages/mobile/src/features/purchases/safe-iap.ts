import { Platform } from 'react-native';
import {
  endConnectionAndroid,
  getProducts,
  initConnection,
  Product,
} from 'react-native-iap';
import { trackError } from '../../core/errors';
import { IAPError } from './IAPError';

const LOGGER = 'iap';

const isBillingUnavailable = (e: Error) =>
  Platform.OS === 'android' &&
  e.message?.indexOf('Billing is unavailable') === 0;

const safeEndConnection = async () => {
  try {
    await endConnectionAndroid();
  } catch {}
};

// Initializes IAP connection. Returns true if user can make payments
export const safeInitConnection = async (): Promise<boolean> => {
  let result = true;
  try {
    result = !!(await initConnection());
  } catch (e) {
    // This is not error, just android emulator
    if (isBillingUnavailable(e)) {
      result = false;
    } else {
      trackError(LOGGER, e);
    }
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
    if (!isBillingUnavailable(e)) {
      error = new IAPError(
        'screens:purchase.buy.errors.fetchProduct',
        e.message,
      );
      trackError(LOGGER, error);
    }
  } finally {
    await safeEndConnection();
  }
  return {
    products,
    error,
  };
};

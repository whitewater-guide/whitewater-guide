import { Platform } from 'react-native';
import {
  endConnection,
  getProducts,
  initConnection,
  Product,
} from 'react-native-iap';

import { trackError } from '../../core/errors';
import { IAPError } from './IAPError';

const LOGGER = 'iap';

function isBillingUnavailable(e: Error): boolean {
  return (
    Platform.OS === 'android' &&
    e.message?.indexOf('Billing is unavailable') === 0
  );
}

export async function safeEndConnection() {
  try {
    await endConnection();
  } catch (e: any) {
    trackError(LOGGER, e);
  }
}

// Initializes IAP connection. Returns true if user can make payments
export async function safeInitConnection(): Promise<boolean> {
  let result = true;
  try {
    result = !!(await initConnection());
  } catch (e: any) {
    // This is not error, just android emulator
    if (isBillingUnavailable(e)) {
      result = false;
    } else {
      trackError(LOGGER, e);
    }
  }
  return result;
}

export async function safeGetProducts(skus: string[]) {
  let products: Product[] = [];
  let error: IAPError | undefined;
  try {
    products = await getProducts(skus);
  } catch (e: any) {
    if (!isBillingUnavailable(e)) {
      error = new IAPError(
        'screens:purchase.buy.errors.fetchProduct',
        e.message,
      );
      trackError(LOGGER, error);
    }
  }
  return {
    products,
    error,
  };
}

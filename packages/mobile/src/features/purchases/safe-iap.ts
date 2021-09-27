import { Platform } from 'react-native';
import {
  endConnection,
  getProducts,
  initConnection,
  Product,
} from 'react-native-iap';

import { trackError } from '~/core/errors';

import { IAPError } from './IAPError';

const LOGGER = 'iap';

function isBillingUnavailable(e: unknown): boolean {
  return (
    e instanceof Error &&
    Platform.OS === 'android' &&
    e.message?.indexOf('Billing is unavailable') === 0
  );
}

export async function safeEndConnection() {
  try {
    await endConnection();
  } catch (e) {
    trackError(LOGGER, e);
  }
}

// Initializes IAP connection. Returns true if user can make payments
export async function safeInitConnection(): Promise<boolean> {
  let result = true;
  try {
    result = !!(await initConnection());
  } catch (e) {
    result = false;
    if (!isBillingUnavailable(e)) {
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
  } catch (e) {
    if (!isBillingUnavailable(e)) {
      error = new IAPError(
        'screens:purchase.buy.errors.fetchProduct',
        (e as Error).message,
      );
      trackError(LOGGER, e);
    }
  }
  return {
    products,
    error,
  };
}

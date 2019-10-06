import { ProductPurchase, PurchaseError } from 'react-native-iap';

const { IAPErrorCode: errorCode } = jest.requireActual('react-native-iap');

export const _mockResponse = jest.fn();
export const IAPErrorCode = errorCode;

class Emitter {
  purchaseCallback?: (e: ProductPurchase) => void;
  errorCallback?: (e: PurchaseError) => void;

  fire = () => {
    setTimeout(() => {
      const { purchase, error } = _mockResponse();
      if (purchase && this.purchaseCallback) {
        this.purchaseCallback(purchase);
      } else if (this.errorCallback) {
        this.errorCallback(error);
      }
    }, 0);
  };
}
const emitter = new Emitter();

export const initConnection = jest.fn();
export const getProducts = jest.fn();
export const finishTransactionIOS = jest.fn();
export const acknowledgePurchaseAndroid = jest.fn();
export const getAvailablePurchases = jest.fn();
export const purchaseUpdatedListener = (
  listener: (e: ProductPurchase) => void,
) => {
  emitter.purchaseCallback = listener;
  return {
    remove: () => {
      emitter.purchaseCallback = undefined;
    },
  };
};
export const purchaseErrorListener = (listener: (e: PurchaseError) => void) => {
  emitter.errorCallback = listener;
  return {
    remove: () => {
      emitter.errorCallback = undefined;
    },
  };
};

export const requestPurchase = () => {
  emitter.fire();
  return Promise.resolve();
};

export default {
  IAPErrorCode,
  initConnection,
  getProducts,
  finishTransactionIOS,
  acknowledgePurchaseAndroid,
  getAvailablePurchases,
  purchaseUpdatedListener,
  purchaseErrorListener,
  requestPurchase,
  _mockResponse,
};

// eslint-disable-next-line import/default
import iap from 'in-app-purchase';

export const initIAP = async () => {
  // Rest is read from env
  iap.config({
    test: process.env.NODE_ENV !== 'production',
    verbose: process.env.NODE_ENV !== 'production',
  });
  await iap.setup();
};

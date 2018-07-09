import iap from 'in-app-purchase';

export const initIAP = async () => {
  // Rest is read from env
  iap.config({
    test: process.env.IAP_DEBUG === 'true',
    verbose: process.env.IAP_DEBUG === 'true',
  });
  await iap.setup();
};

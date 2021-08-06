import iap from 'in-app-purchase';

import config from '~/config';

export const initIAP = async () => {
  // Rest is read from env
  iap.config({
    test: config.NODE_ENV !== 'production',
    verbose: config.NODE_ENV !== 'production',
  });
  await iap.setup();
};

import { androidpublisher_v3, auth } from '@googleapis/androidpublisher';
import type { PurchaseInput } from '@whitewater-guide/schema';

import config from '../../../../config';
import log from '../../../../log/index';

let _verifier: androidpublisher_v3.Androidpublisher;

async function getVerifier(): Promise<androidpublisher_v3.Androidpublisher> {
  if (!_verifier) {
    const credentials = await config.getGoogleServiceAccount();
    _verifier = new androidpublisher_v3.Androidpublisher({
      auth: new auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/androidpublisher'],
      }),
    });
  }
  return _verifier;
}

export async function acknowledgeAndroid(
  purchase: PurchaseInput,
  uid: string,
): Promise<void> {
  if (!purchase.receipt) {
    throw new Error('purchase receipt not found');
  }
  const receipt = JSON.parse(purchase.receipt);
  const { packageName, productId, purchaseToken } = receipt;
  const verifier = await getVerifier();
  const resp = await verifier.purchases.products.acknowledge({
    productId,
    packageName,
    token: purchaseToken,
    requestBody: {
      developerPayload: uid,
    },
  });
  if (resp.status < 200 || resp.status >= 300) {
    log.info(
      { resp: resp.data, status: resp.status, statusText: resp.statusText },
      'acknowledge failed',
    );
    throw new Error(resp.statusText || 'acknowledge android failed');
  }
  log.info(`Acknowledged android purchase`, resp);
}

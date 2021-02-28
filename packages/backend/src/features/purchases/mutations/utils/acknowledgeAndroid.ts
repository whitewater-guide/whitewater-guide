import { PurchaseInput } from '@whitewater-guide/commons';
import Verifier, {
  IVerifier,
  VerificationResponse,
} from 'google-play-billing-validator';

import config from '~/config';
import log from '~/log';

let _verifier: IVerifier;

const getVerifier = async () => {
  if (!_verifier) {
    const gServiceAcc = await config.getGoogleServiceAccount();
    _verifier = new Verifier({
      email: gServiceAcc.client_email,
      key: gServiceAcc.private_key,
    });
  }
  return _verifier;
};

export const acknowledgeAndroid = async (
  purchase: PurchaseInput,
  uid: string,
) => {
  if (!purchase.receipt) {
    throw new Error('purchase receipt not found');
  }
  const receipt = JSON.parse(purchase.receipt);
  const { packageName, productId, purchaseToken } = receipt;
  const verifier = await getVerifier();
  const result: VerificationResponse = await verifier.verifyINAPP({
    packageName,
    productId,
    purchaseToken,
    developerPayload: uid,
  } as any);
  log.info(`Acknowledged android purchase`, result);
  if (!result.isSuccessful) {
    throw new Error(result.errorMessage || 'acknowledge android failed');
  }
  return result.payload;
};

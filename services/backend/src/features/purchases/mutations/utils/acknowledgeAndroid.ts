import { PurchaseInput } from '@whitewater-guide/commons';
import { readJSON } from 'fs-extra';
import Verifier, {
  IVerifier,
  VerificationResponse,
} from 'google-play-billing-validator';

let _verifier: IVerifier;

const getVerifier = async () => {
  if (!_verifier) {
    const gServiceAcc = await readJSON(
      process.env.NODE_ENV === 'test'
        ? 'google_service_account.json'
        : '/run/secrets/google_service_account',
    );
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
  const receipt = JSON.parse(purchase.receipt!);
  const { packageName, productId, purchaseToken } = receipt;
  const verifier = await getVerifier();
  const result: VerificationResponse = await verifier.verifyINAPP({
    packageName,
    productId,
    purchaseToken,
    developerPayload: uid,
  } as any);
  if (!result.isSuccessful) {
    throw new Error(result.errorMessage || 'acknowledge android failed');
  }
  return result.payload;
};

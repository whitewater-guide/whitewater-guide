import axios from 'axios';

import config from '../../../../config';

const VERIFY_RECEIPT_ENDPOINT =
  config.NODE_ENV === 'production'
    ? 'https://buy.itunes.apple.com/verifyReceipt'
    : 'https://sandbox.itunes.apple.com/verifyReceipt';

export interface VerifyReceiptResp {
  status: number;
  environment: 'Sandbox' | 'Production';
  receipt: unknown;
}

export function isAppleReceiptVerified(resp: VerifyReceiptResp): boolean {
  return resp.status === 0;
}

// https://developer.apple.com/documentation/appstorereceipts/validating_receipts_with_the_app_store
export async function verifyAppleReceipt(
  receipt: string,
): Promise<VerifyReceiptResp> {
  // https://developer.apple.com/documentation/appstorereceipts/requestbody
  const resp = await axios.post(VERIFY_RECEIPT_ENDPOINT, {
    'receipt-data': receipt,
  });
  // https://developer.apple.com/documentation/appstorereceipts/responsebody
  if (resp.status !== 200) {
    throw new Error(`apple verification failed: ${resp.statusText}`);
  }
  return resp.data;
}

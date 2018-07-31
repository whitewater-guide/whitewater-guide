import { struct } from '../../utils/validation';
import { PurchasePlatform } from './types';

export const PurchaseInputStruct = struct.object({
  platform: struct.enum(Object.values(PurchasePlatform)),
  transactionId: 'nonEmptyString',
  transactionDate: 'date?|null',
  productId: 'nonEmptyString',
  receipt: 'string?|null',
  extra: 'object?|null',
});

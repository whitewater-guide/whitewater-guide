import { baseStruct } from '../../utils/validation';
import { PurchasePlatform } from './types';

export const PurchaseInputStruct = baseStruct.object({
  platform: baseStruct.enum(Object.values(PurchasePlatform)),
  transactionId: 'nonEmptyString',
  transactionDate: 'date?|null',
  productId: 'nonEmptyString',
  receipt: 'string?|null',
  extra: 'object?|null',
});

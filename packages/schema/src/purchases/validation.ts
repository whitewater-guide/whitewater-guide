import type { ObjectSchema } from 'yup';
import { date, mixed, object, string } from 'yup';

import type { PurchaseInput } from '../__generated__/types';
import { PurchasePlatform } from './types';

export const PurchaseInputSchema: ObjectSchema<PurchaseInput> = object({
  platform: mixed<PurchasePlatform>()
    .defined()
    .oneOf(Object.values(PurchasePlatform)),
  transactionId: string().nonEmpty(),
  transactionDate: date().optional().nullable(),
  productId: string().nonEmpty(),
  receipt: string().notRequired().nullable(),
  extra: object().notRequired().nullable(),
})
  .strict(true)
  .noUnknown();

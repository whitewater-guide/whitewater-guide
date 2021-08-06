import * as yup from 'yup';

import { PurchaseInput } from '../__generated__/types';
import { PurchasePlatform } from './types';

export const PurchaseInputSchema: yup.SchemaOf<PurchaseInput> = yup
  .object({
    platform: yup.mixed().defined().oneOf(Object.values(PurchasePlatform)),
    transactionId: yup.string().nonEmpty(),
    transactionDate: yup.date().optional().nullable(),
    productId: yup.string().nonEmpty(),
    receipt: yup.string().notRequired().nullable(),
    extra: yup.object().notRequired().nullable(),
  })
  .strict(true)
  .noUnknown();

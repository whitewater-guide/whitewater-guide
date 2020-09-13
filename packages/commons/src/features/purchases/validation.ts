import { yupTypes } from '@whitewater-guide/validation';
import * as yup from 'yup';

import { PurchaseInput, PurchasePlatform } from './types';

export const PurchaseInputSchema = yup
  .object<PurchaseInput>({
    platform: yup.mixed().defined().oneOf(Object.values(PurchasePlatform)),
    transactionId: yupTypes.nonEmptyString().defined().nullable(false),
    transactionDate: yup.date().notRequired().nullable(),
    productId: yupTypes.nonEmptyString().defined().nullable(false),
    receipt: yup.string().notRequired().nullable(),
    extra: yup.object().notRequired().nullable(),
  })
  .strict(true)
  .noUnknown();

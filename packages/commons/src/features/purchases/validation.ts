import * as yup from 'yup';
import { yupTypes } from '../../validation';
import { PurchaseInput, PurchasePlatform } from './types';

export const PurchaseInputSchema = yup
  .object<PurchaseInput>({
    platform: yup.mixed().oneOf(Object.values(PurchasePlatform)),
    transactionId: yupTypes.nonEmptyString(),
    transactionDate: yup
      .date()
      .notRequired()
      .nullable(),
    productId: yupTypes.nonEmptyString(),
    receipt: yup
      .string()
      .notRequired()
      .nullable(),
    extra: yup
      .object()
      .notRequired()
      .nullable(),
  })
  .strict(true)
  .noUnknown();

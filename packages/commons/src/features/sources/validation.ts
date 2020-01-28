import * as yup from 'yup';

import { yupTypes } from '../../validation';

export const SourceInputSchema = yup
  .object({
    id: yupTypes.uuid(true),
    name: yupTypes.nonEmptyString(),
    termsOfUse: yup
      .string()
      .defined()
      .nullable(),
    script: yup
      .string()
      .defined()
      .min(1)
      .max(20),
    requestParams: yup.object().nullable(),
    cron: yupTypes.cron().nullable(),
    url: yup
      .string()
      .url()
      .defined()
      .nullable(),
    regions: yup
      .array()
      .of(yupTypes.node())
      .defined(),
  })
  .strict(true)
  .noUnknown();

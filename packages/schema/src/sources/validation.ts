import { yupSchemas } from '@whitewater-guide/validation';
import type { ObjectSchema } from 'yup';
import { array, object, string } from 'yup';

import type { SourceInput } from '../__generated__/types';

export const SourceInputSchema: ObjectSchema<SourceInput> = object({
  id: string().uuid().nullable(),
  name: string().required().nonNullable(),
  termsOfUse: string().nullable(),
  script: string().defined().min(1).max(20),
  requestParams: object().nullable(),
  cron: string().cron().nullable(),
  url: string().url().nullable(),
  regions: array().of(yupSchemas.refInput()).defined(),
})
  .strict(true)
  .noUnknown();

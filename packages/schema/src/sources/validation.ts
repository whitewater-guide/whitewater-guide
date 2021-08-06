import { yupSchemas } from '@whitewater-guide/validation';
import * as yup from 'yup';

import { SourceInput } from '../__generated__/types';

export const SourceInputSchema: yup.SchemaOf<SourceInput> = yup
  .object({
    id: yup.string().uuid().nullable(),
    name: yup.string().required().nullable(false),
    termsOfUse: yup.string().nullable(),
    script: yup.string().defined().min(1).max(20),
    requestParams: yup.object().nullable(),
    cron: yup.string().cron().nullable(),
    url: yup.string().url().nullable(),
    regions: yup.array().of(yupSchemas.refInput()).defined(),
  })
  .strict(true)
  .noUnknown();

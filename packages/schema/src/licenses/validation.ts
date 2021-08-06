import * as yup from 'yup';

import { LicenseInput } from '../__generated__/types';

export const LicenseInputSchema: yup.SchemaOf<LicenseInput> = yup
  .object({
    url: yup.string().url().nullable(true),
    name: yup.string().min(2).defined().nullable(false),
    slug: yup.string().slug().nullable(true),
  })
  .strict(true)
  .noUnknown();

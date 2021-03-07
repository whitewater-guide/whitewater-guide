import { yupTypes } from '@whitewater-guide/validation';
import * as yup from 'yup';

import { License } from './types';

export const LicenseInputSchema: yup.SchemaOf<License> = yup
  .object({
    url: yup.string().url().nullable(true),
    name: yup.string().min(2).defined().nullable(false),
    slug: yupTypes.slug().nullable(true),
  })
  .strict(true)
  .noUnknown();

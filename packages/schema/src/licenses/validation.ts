import type { ObjectSchema } from 'yup';
import { object, string } from 'yup';

import type { LicenseInput } from '../__generated__/types';

export const LicenseInputSchema: ObjectSchema<LicenseInput> = object({
  url: string().url().nullable(),
  name: string().min(2).defined().nonNullable(),
  slug: string().slug().nullable(),
})
  .strict(true)
  .noUnknown();

import type { ObjectSchema } from 'yup';
import { object, string } from 'yup';

import type { GroupInput } from '../__generated__/types';

const GROUP_SKU = /^group\.\w{3,}$/;

export const GroupInputSchema: ObjectSchema<GroupInput> = object({
  id: string().uuid().defined().nullable(),
  name: string().nonEmpty(),
  sku: string()
    .defined()
    .max(255)
    .matches(GROUP_SKU, 'yup:string.sku')
    .nullable(),
})
  .strict(true)
  .noUnknown();

import * as yup from 'yup';

import { GroupInput } from '../__generated__/types';

const GROUP_SKU = /^group\.\w{3,}$/;

export const GroupInputSchema: yup.SchemaOf<GroupInput> = yup
  .object({
    id: yup.string().uuid().defined().nullable(),
    name: yup.string().nonEmpty(),
    sku: yup
      .string()
      .defined()
      .max(255)
      .matches(GROUP_SKU, 'yup:string.sku')
      .nullable(),
  })
  .strict(true)
  .noUnknown();

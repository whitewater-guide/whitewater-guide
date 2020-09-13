import { yupTypes } from '@whitewater-guide/validation';
import * as yup from 'yup';

import { GroupInput } from './types';

const GROUP_SKU = /^group\.\w{3,}$/;

export const GroupInputSchema = yup
  .object<GroupInput>({
    id: yupTypes.uuid().defined().nullable(),
    name: yupTypes.nonEmptyString().defined().nullable(false),
    sku: yup
      .string()
      .defined()
      .max(255)
      .matches(GROUP_SKU, 'yup:string.sku')
      .nullable(),
  })
  .strict(true)
  .noUnknown();

import * as yup from 'yup';

import { GroupInput } from './types';
import { yupTypes } from '@whitewater-guide/validation';

const GROUP_SKU = /^group\.\w{3,}$/;

export const GroupInputSchema = yup
  .object<GroupInput>({
    id: yupTypes.uuid(true),
    name: yupTypes.nonEmptyString(),
    sku: yup
      .string()
      .defined()
      .max(255)
      .matches(GROUP_SKU, 'yup:string.sku')
      .nullable(),
  })
  .strict(true)
  .noUnknown();

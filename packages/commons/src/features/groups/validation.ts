import * as yup from 'yup';
import { yupTypes } from '../../validation';
import { GroupInput } from './types';

const GROUP_SKU = /^group\.\w{3,}$/;

export const GroupInputSchema = yup
  .object<GroupInput>({
    id: yupTypes.uuid().nullable(),
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

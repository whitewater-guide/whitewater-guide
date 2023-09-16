import { yupSchemas } from '@whitewater-guide/validation';
import type { ObjectSchema } from 'yup';
import { array, object, string } from 'yup';

import type { RiverInput } from '../__generated__/types';

export const RiverInputSchema: ObjectSchema<RiverInput> = object({
  id: string().uuid().nullable(),
  name: string().nonEmpty(),
  region: yupSchemas.refInput().required(),
  importId: string().nullable(),
  altNames: array().of(string().required()).nullable(),
})
  .strict(true)
  .noUnknown();

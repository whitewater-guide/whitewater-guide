import { yupSchemas } from '@whitewater-guide/validation';
import * as yup from 'yup';

import { RiverInput } from '../__generated__/types';

export const RiverInputSchema: yup.SchemaOf<RiverInput> = yup
  .object({
    id: yup.string().uuid().nullable(),
    name: yup.string().nonEmpty(),
    region: yupSchemas.refInput().defined(),
    importId: yup.string().nullable(),
    altNames: yup
      .array()
      .of(yup.string().required() as yup.StringSchema<string>)
      .nullable(),
  })
  .strict(true)
  .noUnknown();

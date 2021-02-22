import { yupTypes } from '@whitewater-guide/validation';
import * as yup from 'yup';

import { RiverInput } from './types';

export const RiverInputSchema: yup.SchemaOf<RiverInput> = yup
  .object({
    id: yupTypes.uuid().defined().nullable(),
    name: yupTypes.nonEmptyString().defined().nullable(false),
    region: yupTypes.node().defined() as any,
    importId: yup.string().nullable(),
    altNames: yup
      .array()
      .of(yupTypes.nonEmptyString().defined() as any)
      .defined()
      .nullable(),
  })
  .strict(true)
  .noUnknown();

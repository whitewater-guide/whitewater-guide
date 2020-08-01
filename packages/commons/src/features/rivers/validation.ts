import * as yup from 'yup';

import { RiverInput } from './types';
import { yupTypes } from '@whitewater-guide/validation';

export const RiverInputSchema = yup
  .object<RiverInput>({
    id: yupTypes
      .uuid()
      .defined()
      .nullable(),
    name: yupTypes
      .nonEmptyString()
      .defined()
      .nullable(false),
    region: yupTypes.node().defined(),
    importId: yup.string().nullable(),
    altNames: yup
      .array()
      .of(yupTypes.nonEmptyString().defined())
      .defined()
      .nullable(),
  })
  .strict(true)
  .noUnknown();

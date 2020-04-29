import * as yup from 'yup';

import { RiverInput } from './types';
import { yupTypes } from '@whitewater-guide/validation';

export const RiverInputSchema = yup
  .object<RiverInput>({
    id: yupTypes.uuid(true),
    name: yupTypes.nonEmptyString(),
    region: yupTypes.node(),
    importId: yup.string().nullable(),
    altNames: yup
      .array()
      .of(yupTypes.nonEmptyString())
      .defined()
      .nullable(),
  })
  .strict(true)
  .noUnknown();

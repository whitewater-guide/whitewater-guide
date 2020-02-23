import * as yup from 'yup';
import { yupTypes } from '../../validation';
import { RiverInput } from './types';

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

import * as yup from 'yup';
import { yupTypes } from '../../validation';
import { RiverInput } from './types';

export const RiverInputSchema = yup
  .object<RiverInput>({
    id: yupTypes.uuid().nullable(),
    name: yupTypes.nonEmptyString(),
    region: yupTypes.node(),
    altNames: yup
      .array()
      .of(yupTypes.nonEmptyString())
      .defined()
      .nullable(),
  })
  .strict(true)
  .noUnknown();

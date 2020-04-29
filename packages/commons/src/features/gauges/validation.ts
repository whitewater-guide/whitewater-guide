import * as yup from 'yup';

import { GaugeInput } from './types';
import { PointInputSchema } from '../points';
import { yupTypes } from '@whitewater-guide/validation';

export const GaugeInputSchema = yup
  .object<GaugeInput>({
    id: yupTypes.uuid(true),
    name: yupTypes.nonEmptyString(),
    code: yupTypes.nonEmptyVarchar(),
    levelUnit: yupTypes.nonEmptyVarchar().nullable(),
    flowUnit: yupTypes.nonEmptyVarchar().nullable(),
    location: PointInputSchema.clone().nullable(),
    requestParams: yup
      .mixed()
      .defined()
      .nullable(),
    url: yup.string().nullable(),
    source: yupTypes.node().defined(),
  })
  .strict(true)
  .noUnknown();

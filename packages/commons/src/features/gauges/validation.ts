import { yupTypes } from '@whitewater-guide/validation';
import * as yup from 'yup';

import { PointInputSchema } from '../points';
import { GaugeInput } from './types';

export const GaugeInputSchema: yup.SchemaOf<GaugeInput> = yup
  .object({
    id: yupTypes.uuid().defined().nullable(),
    name: yupTypes.nonEmptyString().defined().nullable(false),
    code: yupTypes.nonEmptyVarchar().defined().nullable(false),
    levelUnit: yupTypes.nonEmptyVarchar().nullable(),
    flowUnit: yupTypes.nonEmptyVarchar().nullable(),
    location: PointInputSchema.clone().defined().nullable(),
    requestParams: yup.mixed().defined().nullable(),
    url: yup.string().url().defined().nullable(),
    source: yupTypes.node().defined().nullable(false) as any,
  })
  .strict(true)
  .noUnknown();

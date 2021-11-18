import { yupSchemas } from '@whitewater-guide/validation';
import * as yup from 'yup';

import { GaugeInput } from '../__generated__/types';
import { PointInputSchema } from '../points';

export const GaugeInputSchema: yup.SchemaOf<GaugeInput> = yup
  .object({
    id: yup.string().uuid().nullable(),
    name: yup.string().nonEmpty(),
    code: yup.string().nonEmpty(),
    levelUnit: yup.string().nullable(),
    flowUnit: yup.string().nullable(),
    timezone: yup.string().nullable(),
    location: PointInputSchema.clone().nullable(),
    requestParams: yup.mixed().nullable(),
    url: yup.string().url().nullable(),
    source: yupSchemas.refInput().defined().nullable(false),
  })
  .strict(true)
  .noUnknown();

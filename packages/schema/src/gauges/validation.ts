import { yupSchemas } from '@whitewater-guide/validation';
import type { ObjectSchema } from 'yup';
import { mixed, object, string } from 'yup';

import type { GaugeInput } from '../__generated__/types';
import { PointInputSchema } from '../points';

export const GaugeInputSchema: ObjectSchema<GaugeInput> = object({
  id: string().uuid().nullable(),
  name: string().nonEmpty(),
  code: string().nonEmpty(),
  levelUnit: string().nullable(),
  flowUnit: string().nullable(),
  timezone: string().nullable(),
  location: PointInputSchema.clone().nullable(),
  requestParams: mixed().nullable(),
  url: string().url().nullable(),
  source: yupSchemas.refInput().required(),
})
  .strict(true)
  .noUnknown();

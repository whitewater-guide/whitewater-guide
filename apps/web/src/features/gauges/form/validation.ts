import type { PointInput } from '@whitewater-guide/schema';
import { CoordinateSchema, GaugeInputSchema } from '@whitewater-guide/schema';
import type { ObjectSchema } from 'yup';
import { object, string } from 'yup';

import type { GaugeFormData } from './types';

const LoosePointSchema: ObjectSchema<PointInput> = object({
  id: string().uuid().notRequired(),
  name: string().notRequired(),
  description: string().notRequired(),
  coordinates: CoordinateSchema.clone(),
  kind: string().oneOf(['gauge']).notRequired(),
})
  .strict(true)
  .noUnknown();

export const GaugeFormSchema: ObjectSchema<GaugeFormData> =
  GaugeInputSchema.clone().shape({
    location: LoosePointSchema.clone().nullable(),
    timezone: object({
      id: string().required(),
      name: string().required(),
    }).nullable(),
    requestParams: string().jsonString().nullable(),
  });

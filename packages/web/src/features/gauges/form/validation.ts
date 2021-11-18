import {
  CoordinateSchema,
  GaugeInputSchema,
  PointInput,
} from '@whitewater-guide/schema';
import * as yup from 'yup';

import { GaugeFormData } from './types';

const LoosePointSchema: yup.SchemaOf<PointInput> = yup
  .object({
    id: yup.string().uuid().optional().nullable(),
    name: yup.string().nullable().optional(),
    description: yup.string().nullable().optional(),
    coordinates: CoordinateSchema.clone(),
    kind: yup.mixed().oneOf(['gauge']).optional(),
  })
  .strict(true)
  .noUnknown();

export const GaugeFormSchema: yup.SchemaOf<GaugeFormData> =
  GaugeInputSchema.clone().shape({
    location: LoosePointSchema.clone().nullable(),
    timezone: yup
      .object({
        id: yup.string().required() as yup.StringSchema<string>,
        name: yup.string().required() as yup.StringSchema<string>,
      })
      .nullable(),
    requestParams: yup.string().jsonString().nullable(),
  });

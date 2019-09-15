import {
  CoordinateSchema,
  GaugeInputSchema,
  yupTypes,
} from '@whitewater-guide/commons';
import * as yup from 'yup';
import { GaugeFormData } from './types';

const LoosePointSchema = yup
  .object({
    id: yup
      .string() // TODO: should be uuid, but i'm too lazy to make uuid without defined
      .nullable()
      .notRequired(),
    name: yup
      .string()
      .nullable()
      .notRequired(),
    description: yup
      .string()
      .nullable()
      .notRequired(),
    coordinates: CoordinateSchema.clone(),
    kind: yup
      .mixed()
      .oneOf(['gauge'])
      .notRequired(),
  })
  .strict(true)
  .noUnknown()
  .nullable();

export const GaugeFormSchema: yup.Schema<
  GaugeFormData
> = GaugeInputSchema.clone().shape({
  location: LoosePointSchema.clone(),
  requestParams: yupTypes.jsonString().nullable(),
});
import { yupSchemas } from '@whitewater-guide/validation';
import times from 'lodash/times';
import type { ObjectSchema } from 'yup';
import { array, bool, mixed, number, object, string } from 'yup';

import type { GaugeBindingInput, SectionInput } from '../__generated__/types';
import { LicenseInputSchema } from '../licenses';
import { MediaInputSchema } from '../media';
import { CoordinateSchema, PointInputSchema } from '../points';
import { Durations } from './types';

export const GaugeBindingSchema: ObjectSchema<GaugeBindingInput> = object({
  __typename: mixed().optional(),
  minimum: number().nullable(),
  maximum: number().nullable(),
  optimum: number().nullable(),
  impossible: number().nullable(),
  approximate: bool().nullable(),
  formula: string().formula().nullable(),
})
  .strict(true)
  .noUnknown();

const SimpleTagSchema = object({
  id: string().required(),
  name: string().optional(),
})
  .strict(true)
  .noUnknown();

export const SectionInputSchema: ObjectSchema<SectionInput> = object({
  id: string().uuid().nullable(),
  name: string().nonEmpty(),
  altNames: array().of(string().required()).nullable(),
  description: string().nullable(),
  season: string().nullable(),
  seasonNumeric: array()
    .of(number().integer().defined().min(0).max(23))
    .max(24)
    .defined(),

  river: yupSchemas.newNode().required(),
  gauge: yupSchemas.refInput().optional().nullable(),
  region: yupSchemas.refInput().optional().nullable(),
  levels: GaugeBindingSchema.clone().nullable(),
  flows: GaugeBindingSchema.clone().nullable(),
  flowsText: string().nullable(),
  timezone: string().nullable(),

  shape: array().of(CoordinateSchema).min(2).required(),
  distance: number().positive().nullable(),
  drop: number().positive().nullable(),
  duration: number().oneOf(Array.from(Durations.keys())).nullable(),
  difficulty: number()
    .oneOf(times(13, (i) => i * 0.5))
    .required(),
  difficultyXtra: string().max(32).nullable(),
  rating: number()
    .oneOf(times(11, (i) => i * 0.5))
    .nullable(),
  tags: array().of(SimpleTagSchema.clone()).required(),
  pois: array().of(PointInputSchema.clone().required()).required(),
  media: array().of(MediaInputSchema.clone().required()).required(),
  hidden: bool().required(),
  helpNeeded: string().nullable(),
  createdBy: string().uuid().notRequired().nullable(),
  importId: string().nullable(),
  copyright: string().nullable(),
  license: LicenseInputSchema.clone().nullable(),
})
  .strict(true)
  .noUnknown();

export const SectionAdminSettingsSchema = object({
  demo: bool().defined(),
})
  .strict(true)
  .noUnknown();

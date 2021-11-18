import { yupSchemas } from '@whitewater-guide/validation';
import times from 'lodash/times';
import * as yup from 'yup';

import { GaugeBindingInput, SectionInput } from '../__generated__/types';
import { LicenseInputSchema } from '../licenses';
import { MediaInputSchema } from '../media';
import { CoordinateSchema, PointInputSchema } from '../points';
import { Durations } from './types';

export const GaugeBindingSchema: yup.SchemaOf<GaugeBindingInput> = yup
  .object({
    __typename: yup.mixed().optional(),
    minimum: yup.number().nullable(),
    maximum: yup.number().nullable(),
    optimum: yup.number().nullable(),
    impossible: yup.number().nullable(),
    approximate: yup.bool().nullable(),
    formula: yup.string().formula().nullable(),
  })
  .strict(true)
  .noUnknown();

const SimpleTagSchema = yup
  .object({
    id: yup.string().required(),
    name: yup.string().optional(),
  })
  .strict(true)
  .noUnknown();

export const SectionInputSchema: yup.SchemaOf<SectionInput> = yup
  .object({
    id: yup.string().uuid().nullable(),
    name: yup.string().nonEmpty(),
    altNames: yup
      .array()
      .of(yup.string().required() as yup.StringSchema<string>)
      .nullable(),
    description: yup.string().nullable(),
    season: yup.string().nullable(),
    seasonNumeric: yup
      .array()
      .of(yup.number().integer().defined().min(0).max(23))
      .max(24)
      .defined(),

    river: yupSchemas.newNode().required(),
    gauge: yupSchemas.refInput().optional().nullable(),
    region: yupSchemas.refInput().optional().nullable(),
    levels: GaugeBindingSchema.clone().nullable(),
    flows: GaugeBindingSchema.clone().nullable(),
    flowsText: yup.string().nullable(),
    timezone: yup.string().nullable(),

    shape: yup
      .array()
      .of(CoordinateSchema as any)
      .min(2)
      .required(),
    distance: yup.number().positive().nullable(),
    drop: yup.number().positive().nullable(),
    duration: yup.mixed().oneOf([null, ...Array.from(Durations.keys())]),
    difficulty: yup
      .mixed()
      .oneOf(times(13, (i) => i * 0.5))
      .required(),
    difficultyXtra: yup.string().max(32).nullable(),
    rating: yup.mixed().oneOf([null, ...times(11, (i) => i * 0.5)]),
    tags: yup.array().of(SimpleTagSchema.clone()).required(),
    pois: yup.array().of(PointInputSchema.clone().required()).required(),
    media: yup.array().of(MediaInputSchema.clone().required()).required(),
    hidden: yup.bool().required(),
    helpNeeded: yup.string().nullable(),
    createdBy: yup.string().uuid().notRequired().nullable(),
    importId: yup.string().nullable(),
    copyright: yup.string().nullable(),
    license: LicenseInputSchema.clone().nullable(true),
  })
  .strict(true)
  .noUnknown();

export const SectionAdminSettingsSchema = yup
  .object({
    demo: yup.bool().defined(),
  })
  .strict(true)
  .noUnknown();

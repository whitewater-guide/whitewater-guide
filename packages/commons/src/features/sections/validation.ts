import { yupTypes } from '@whitewater-guide/validation';
import times from 'lodash/times';
import * as yup from 'yup';

import { MediaInputSchema } from '../media';
import { CoordinateSchema, PointInputSchema } from '../points';
import { Durations, GaugeBinding, SectionInput } from './types';

export const GaugeBindingSchema: yup.SchemaOf<GaugeBinding> = yup
  .object({
    __typename: yup.mixed().optional(),
    minimum: yup.number().nullable(),
    maximum: yup.number().nullable(),
    optimum: yup.number().nullable(),
    impossible: yup.number().nullable(),
    approximate: yup.bool().nullable(),
    formula: yupTypes.formula().nullable(),
  })
  .strict(true)
  .noUnknown();

const SimpleTagSchema = yup
  .object({
    id: yupTypes.nonEmptyString(),
  })
  .strict(true)
  .noUnknown();

export const SectionInputSchema: yup.SchemaOf<SectionInput> = yup
  .object({
    id: yupTypes.uuid().defined().nullable(),
    name: yupTypes.nonEmptyString().defined().nullable(false),
    altNames: yup
      .array()
      .of(yupTypes.nonEmptyString().defined().nullable(false))
      .nullable(),
    description: yup.string().nullable(),
    season: yup.string().nullable(),
    seasonNumeric: yup
      .array()
      .of(yup.number().integer().defined().min(0).max(23))
      .max(24)
      .defined(),

    river: yupTypes.newNode().defined().nullable(false) as any,
    gauge: yupTypes.node().nullable(),
    region: yupTypes.namedNode().notRequired().nullable(),
    levels: GaugeBindingSchema.clone().nullable(),
    flows: GaugeBindingSchema.clone().nullable(),
    flowsText: yup.string().nullable(),

    shape: yup.array().of(CoordinateSchema.clone()).defined().min(2),
    distance: yup.number().positive().nullable(),
    drop: yup.number().positive().nullable(),
    duration: yup
      .mixed()
      .oneOf(Array.from(Durations.keys()).concat(null as any))
      .nullable(),
    difficulty: yup
      .mixed()
      .oneOf(times(13, (i) => i * 0.5))
      .required(),
    difficultyXtra: yup.string().max(32).nullable(),
    rating: yup.mixed().oneOf(times(11, (i) => i * 0.5).concat(null as any)),
    tags: yup.array().of(SimpleTagSchema.clone().defined()).defined() as any,
    pois: yup.array().of(PointInputSchema.clone().defined()).defined(),
    media: yup.array().of(MediaInputSchema.clone().defined()).nullable(false),
    hidden: yup.bool().required(),
    helpNeeded: yup.string().nullable(),
    createdBy: yupTypes.uuid().notRequired().nullable(),
    importId: yup.string().nullable(),
  } as any)
  .strict(true)
  .noUnknown();

export const SectionAdminSettingsSchema = yup
  .object({
    demo: yup.bool().defined(),
  })
  .strict(true)
  .noUnknown();

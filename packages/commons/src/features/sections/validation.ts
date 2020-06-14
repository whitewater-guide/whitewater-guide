import * as yup from 'yup';

import { CoordinateSchema, PointInputSchema } from '../points';
import { Durations, GaugeBinding, SectionInput } from './types';

import { MediaInputSchema } from '../media';
import times from 'lodash/times';
import { yupTypes } from '@whitewater-guide/validation';

export const GaugeBindingSchema = yup
  .object<GaugeBinding>({
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

export const SectionInputSchema = yup
  .object<SectionInput>({
    id: yupTypes
      .uuid()
      .defined()
      .nullable(),
    name: yupTypes
      .nonEmptyString()
      .defined()
      .nullable(false),
    altNames: yup
      .array()
      .of(
        yupTypes
          .nonEmptyString()
          .defined()
          .nullable(false),
      )
      .defined()
      .nullable(),
    description: yup
      .string()
      .defined()
      .nullable(),
    season: yup
      .string()
      .defined()
      .nullable(),
    seasonNumeric: yup
      .array()
      .of(
        yup
          .number()
          .integer()
          .defined()
          .min(0)
          .max(23),
      )
      .max(24)
      .defined(),

    river: yupTypes
      .newNode()
      .defined()
      .nullable(false) as any,
    gauge: yupTypes
      .node()
      .defined()
      .nullable(),
    region: yupTypes
      .namedNode()
      .notRequired()
      .nullable(),
    levels: GaugeBindingSchema.clone()
      .defined()
      .nullable(),
    flows: GaugeBindingSchema.clone()
      .defined()
      .nullable(),
    flowsText: yup
      .string()
      .defined()
      .nullable(),

    shape: yup
      .array()
      .of(CoordinateSchema.clone())
      .defined()
      .min(2),
    distance: yup
      .number()
      .positive()
      .defined()
      .nullable(),
    drop: yup
      .number()
      .defined()
      .positive()
      .nullable(),
    duration: yup
      .mixed()
      .defined()
      .oneOf(Array.from(Durations.keys()).concat(null as any))
      .nullable(),
    difficulty: yup
      .mixed()
      .oneOf(times(13, (i) => i * 0.5))
      .required(),
    difficultyXtra: yup
      .string()
      .defined()
      .max(32)
      .nullable(),
    rating: yup
      .mixed()
      .defined()
      .oneOf(times(11, (i) => i * 0.5).concat(null as any)),
    tags: yup
      .array()
      .of(SimpleTagSchema.clone().defined())
      .defined() as any,
    pois: yup
      .array()
      .of(PointInputSchema.clone().defined())
      .defined(),
    media: yup
      .array()
      .of(MediaInputSchema.clone().defined())
      .defined()
      .nullable(false),
    hidden: yup.bool().required(),
    helpNeeded: yup
      .string()
      .defined()
      .nullable(),
    createdBy: yupTypes
      .uuid()
      .notRequired()
      .nullable(),
    suggestionId: yupTypes
      .uuid()
      .notRequired()
      .nullable(),
    importId: yup.string().nullable(),
  })
  .strict(true)
  .noUnknown();

export const SectionAdminSettingsSchema = yup
  .object({
    demo: yup.bool().defined(),
  })
  .strict(true)
  .noUnknown();

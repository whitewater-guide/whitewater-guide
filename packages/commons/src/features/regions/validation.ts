import { yupTypes } from '@whitewater-guide/validation';
import * as yup from 'yup';

import { CoordinateSchema, PointInputSchema } from '../points';
import { RegionAdminSettings, RegionCoverImage, RegionInput } from './types';

const REGION_SKU = /^region\.\w{3,}$/;

export const RegionInputSchema: yup.SchemaOf<RegionInput> = yup
  .object({
    id: yupTypes.uuid().defined().nullable(),
    name: yupTypes.nonEmptyString().defined().nullable(false),
    description: yup.string().defined().nullable(),
    season: yup.string().defined().nullable(),
    seasonNumeric: yup
      .array()
      .of(yup.number().integer().defined().min(0).max(23))
      .max(24)
      .defined(),
    bounds: yup.array().of(CoordinateSchema).defined().nullable(false).min(3),
    pois: yup
      .array(PointInputSchema.clone().defined())
      .defined()
      .nullable(false),
  })
  .strict(true)
  .noUnknown();

export const RegionCoverImageSchema: yup.SchemaOf<RegionCoverImage> = yup
  .object({
    __typename: yup.string().optional(),
    mobile: yupTypes.nonEmptyString().defined().nullable(),
  })
  .strict(true)
  .noUnknown();

export const RegionAdminSettingsSchema: yup.SchemaOf<RegionAdminSettings> = yup
  .object({
    id: yupTypes.uuid().defined().nullable(false),
    hidden: yup.bool().defined(),
    premium: yup.bool().defined(),
    sku: yup
      .string()
      .defined()
      .max(255)
      .matches(REGION_SKU, 'yup:string.sku')
      .nullable(),
    mapsSize: yup.number().integer().defined(),
    coverImage: RegionCoverImageSchema.clone().defined(),
  })
  .strict(true)
  .noUnknown();

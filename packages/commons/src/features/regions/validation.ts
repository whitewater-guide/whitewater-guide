import * as yup from 'yup';

import { CoordinateSchema, PointInputSchema } from '../points';
import { RegionAdminSettings, RegionCoverImage, RegionInput } from './types';

import { yupTypes } from '@whitewater-guide/validation';

const REGION_SKU = /^region\.\w{3,}$/;

export const RegionInputSchema = yup
  .object<RegionInput>({
    id: yupTypes.uuid(true),
    name: yupTypes.nonEmptyString(),
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
    bounds: yup
      .array()
      .of(CoordinateSchema)
      .defined()
      .min(3),
    pois: yup.array(PointInputSchema).defined(),
  })
  .strict(true)
  .noUnknown();

export const RegionCoverImageSchema = yup
  .object<RegionCoverImage>({
    mobile: yupTypes.nonEmptyString().nullable(),
  })
  .strict(true)
  .noUnknown();

export const RegionAdminSettingsSchema = yup
  .object<RegionAdminSettings>({
    id: yupTypes.uuid(),
    hidden: yup.bool().defined(),
    premium: yup.bool().defined(),
    sku: yup
      .string()
      .defined()
      .max(255)
      .matches(REGION_SKU, 'yup:string.sku')
      .nullable(),
    mapsSize: yup
      .number()
      .integer()
      .defined(),
    coverImage: RegionCoverImageSchema.clone(),
  })
  .strict(true)
  .noUnknown();

import type { ObjectSchema } from 'yup';
import { array, bool, number, object, string } from 'yup';

import type {
  RegionAdminSettings,
  RegionCoverImageInput,
  RegionInput,
} from '../__generated__/types';
import { LicenseInputSchema } from '../licenses';
import { CoordinateSchema, PointInputSchema } from '../points';

const REGION_SKU = /^region\.\w{3,}$/;

export const RegionInputSchema: ObjectSchema<RegionInput> = object({
  id: string().uuid().nullable(),
  name: string().required().nonEmpty(),
  description: string().nullable(),
  copyright: string().nullable(),
  license: LicenseInputSchema.clone().nullable(),
  season: string().nullable(),
  seasonNumeric: array()
    .of(number().integer().defined().min(0).max(23))
    .max(24)
    .optional()
    .nullable(),
  bounds: array().of(CoordinateSchema).min(3).required(),
  pois: array(PointInputSchema.clone().defined()).nonNullable(),
})
  .strict(true)
  .noUnknown();

export const RegionCoverImageSchema: ObjectSchema<RegionCoverImageInput> =
  object({
    __typename: string().optional(),
    mobile: string().min(1).defined().nullable(),
  })
    .strict(true)
    .noUnknown();

export const RegionAdminSettingsSchema: ObjectSchema<RegionAdminSettings> =
  object({
    id: string().uuid().required(),
    hidden: bool().defined(),
    premium: bool().defined(),
    sku: string()
      .defined()
      .max(255)
      .matches(REGION_SKU, 'yup:string.sku')
      .nullable(),
    mapsSize: number().integer().defined(),
    coverImage: RegionCoverImageSchema.clone().required(),
  })
    .strict(true)
    .noUnknown();

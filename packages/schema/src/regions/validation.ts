import * as yup from 'yup';

import {
  RegionAdminSettings,
  RegionCoverImageInput,
  RegionInput,
} from '../__generated__/types';
import { LicenseInputSchema } from '../licenses';
import { CoordinateSchema, PointInputSchema } from '../points';

const REGION_SKU = /^region\.\w{3,}$/;

export const RegionInputSchema: yup.SchemaOf<RegionInput> = yup
  .object({
    id: yup.string().uuid().nullable(),
    name: yup.string().nonEmpty(),
    description: yup.string().nullable(),
    copyright: yup.string().nullable(),
    license: LicenseInputSchema.clone().nullable(true),
    season: yup.string().nullable(),
    seasonNumeric: yup
      .array()
      .of(yup.number().integer().defined().min(0).max(23))
      .max(24)
      .optional()
      .nullable(),
    bounds: yup
      .array()
      .of(CoordinateSchema as any)
      .min(3)
      .required(),
    pois: yup.array(PointInputSchema.clone().defined()).nullable(false),
  })
  .strict(true)
  .noUnknown();

export const RegionCoverImageSchema: yup.SchemaOf<RegionCoverImageInput> = yup
  .object({
    __typename: yup.string().optional(),
    mobile: yup.string().min(1).defined().nullable(),
  })
  .strict(true)
  .noUnknown();

export const RegionAdminSettingsSchema: yup.SchemaOf<RegionAdminSettings> = yup
  .object({
    id: yup.string().uuid().defined().nullable(false),
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

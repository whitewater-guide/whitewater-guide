import { yupSchemas } from '@whitewater-guide/validation';
import type { ObjectSchema } from 'yup';
import { array, bool, mixed, number, object, string } from 'yup';

import type { BannerInput, BannerSourceInput } from '../__generated__/types';
import { BannerKind, BannerPlacement } from '../__generated__/types';

const BannerSourceSchema: ObjectSchema<BannerSourceInput> = object({
  kind: mixed<BannerKind>().oneOf(Object.values(BannerKind)).required(),
  url: string().required(),
}).noUnknown();

export const BannerInputSchema: ObjectSchema<BannerInput> = object({
  id: string().uuid().nullable(),
  slug: string().slug().required(),
  name: string().required(),
  priority: number().integer().required(),
  enabled: bool().required(),
  placement: mixed<BannerPlacement>()
    .oneOf(Object.values(BannerPlacement))
    .required(),
  source: BannerSourceSchema.clone(),
  link: string().url().https().nullable(),
  extras: object().nullable(),
  regions: array(yupSchemas.refInput().required()).required(),
  groups: array(yupSchemas.refInput().required()).required(),
})
  .strict(true)
  .noUnknown(true);

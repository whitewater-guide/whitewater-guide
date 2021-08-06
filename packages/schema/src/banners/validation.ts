import { yupSchemas } from '@whitewater-guide/validation';
import * as yup from 'yup';

import {
  BannerInput,
  BannerKind,
  BannerPlacement,
  BannerSourceInput,
} from '../__generated__/types';

const BannerSourceSchema: yup.SchemaOf<BannerSourceInput> = yup
  .object({
    kind: yup.mixed().oneOf(Object.values(BannerKind)),
    url: yup.string().required(),
  })
  .noUnknown();

export const BannerInputSchema: yup.SchemaOf<BannerInput> = yup
  .object({
    id: yup.string().uuid().nullable(),
    slug: yup.string().slug().required(),
    name: yup.string().required(),
    priority: yup.number().integer().required(),
    enabled: yup.bool().required(),
    placement: yup.mixed().oneOf(Object.values(BannerPlacement)),
    source: BannerSourceSchema.clone(),
    link: yup.string().url().https().nullable(true),
    extras: yup.object().nullable(true),
    regions: yup.array(yupSchemas.refInput()),
    groups: yup.array(yupSchemas.refInput()),
  })
  .strict(true)
  .noUnknown(true);

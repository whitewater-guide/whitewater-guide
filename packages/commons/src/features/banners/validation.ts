import { yupTypes } from '@whitewater-guide/validation';
import * as yup from 'yup';

import { BannerKind, BannerPlacement } from './types';

const BannerSourceSchema = yup
  .object({
    kind: yup.mixed().oneOf(Object.values(BannerKind)),
    url: yupTypes.nonEmptyString(),
  })
  .noUnknown();

export const BannerInputSchema = yup
  .object({
    id: yupTypes.uuid().defined().nullable(),
    slug: yupTypes.slug(),
    name: yupTypes.nonEmptyString(),
    priority: yup.number().integer(),
    enabled: yup.bool(),
    placement: yup.mixed().oneOf(Object.values(BannerPlacement)),
    source: BannerSourceSchema.clone(),
    link: yupTypes.https().nullable(true),
    extras: yup.object().nullable(true),
    regions: yup.array(yupTypes.node()),
    groups: yup.array(yupTypes.node()),
  })
  .strict(true)
  .noUnknown(true);

import * as yup from 'yup';

import { MediaInput, MediaKind } from '../__generated__/types';
import { LicenseInputSchema } from '../licenses';

export const MediaInputSchema: yup.SchemaOf<MediaInput> = yup
  .object({
    id: yup.string().uuid().nullable(),
    description: yup.string().nullable(),
    copyright: yup.string().nullable(),
    license: LicenseInputSchema.clone().nullable(true),
    url: yup.string().nonEmpty(),
    kind: yup.mixed().defined().oneOf(Object.values(MediaKind)),
    resolution: yup
      .array()
      .min(2)
      .max(2)
      .of(yup.number().required().integer().positive())
      .optional()
      .nullable(),
    weight: yup.number().integer().nullable(),
  })
  .strict(true)
  .noUnknown();

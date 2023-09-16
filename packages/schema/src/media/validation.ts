import type { ObjectSchema } from 'yup';
import { mixed, number, object, string, tuple } from 'yup';

import type { MediaInput } from '../__generated__/types';
import { MediaKind } from '../__generated__/types';
import { LicenseInputSchema } from '../licenses';

export const MediaInputSchema: ObjectSchema<MediaInput> = object({
  id: string().uuid().nullable(),
  description: string().nullable(),
  copyright: string().nullable(),
  license: LicenseInputSchema.clone().nullable(),
  url: string().nonEmpty(),
  kind: mixed<MediaKind>().defined().oneOf(Object.values(MediaKind)),
  resolution: tuple([
    number().required().integer().positive(),
    number().required().integer().positive(),
  ]).notRequired(),
  weight: number().integer().nullable(),
})
  .strict(true)
  .noUnknown();

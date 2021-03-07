import { yupTypes } from '@whitewater-guide/validation';
import * as yup from 'yup';

import { LicenseInputSchema } from '../licenses';
import { MediaInput, MediaKind } from './types';

export const MediaInputSchema: yup.SchemaOf<MediaInput> = yup
  .object({
    id: yupTypes.uuid().defined().nullable(),
    description: yup.string().defined().nullable(),
    copyright: yup.string().defined().nullable(),
    license: LicenseInputSchema.clone().nullable(true),
    url: yupTypes.nonEmptyString().defined().nullable(false),
    kind: yup.mixed().defined().oneOf(Object.values(MediaKind)),
    resolution: yup
      .array()
      .defined()
      .min(2)
      .max(2)
      .of(yup.number().defined().integer().positive())
      // yup definitions are flaky again
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .nullable() as any,
    weight: yup.number().defined().integer().nullable(),
  })
  .strict(true)
  .noUnknown();

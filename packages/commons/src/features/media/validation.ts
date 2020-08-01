import * as yup from 'yup';

import { MediaInput, MediaKind } from './types';

import { yupTypes } from '@whitewater-guide/validation';

export const MediaInputSchema = yup
  .object<MediaInput>({
    id: yupTypes
      .uuid()
      .defined()
      .nullable(),
    description: yup
      .string()
      .defined()
      .nullable(),
    copyright: yup
      .string()
      .defined()
      .nullable(),
    url: yupTypes
      .nonEmptyString()
      .defined()
      .nullable(false),
    kind: yup
      .mixed()
      .defined()
      .oneOf(Object.values(MediaKind)),
    resolution: yup
      .array()
      .defined()
      .min(2)
      .max(2)
      .of(
        yup
          .number()
          .defined()
          .integer()
          .positive(),
      )
      .nullable(),
    weight: yup
      .number()
      .defined()
      .integer()
      .nullable(),
  })
  .strict(true)
  .noUnknown();

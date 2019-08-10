import * as yup from 'yup';
import { yupTypes } from '../../validation';
import { MediaInput, MediaKind } from './types';

export const MediaInputSchema = yup
  .object<MediaInput>({
    id: yupTypes.uuid().nullable(),
    description: yup
      .string()
      .defined()
      .nullable(),
    copyright: yup
      .string()
      .defined()
      .nullable(),
    url: yupTypes.nonEmptyString(),
    kind: yup.mixed().oneOf(Object.values(MediaKind)),
    resolution: yup
      .array()
      .defined()
      .min(2)
      .max(2)
      .of(
        yup
          .number()
          .integer()
          .positive(),
      )
      .nullable(),
    weight: yup
      .number()
      .integer()
      .nullable(),
  })
  .strict(true)
  .noUnknown();

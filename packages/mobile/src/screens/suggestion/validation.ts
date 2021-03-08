import { getLocalPhotoSchema } from '@whitewater-guide/clients';
import { yupTypes } from '@whitewater-guide/validation';
import * as yup from 'yup';

import { MAX_PHOTO_MEGAPIXELS } from '../../features/uploads';
import { PhotoSuggestion } from './types';

const LocalPhotoSchema = getLocalPhotoSchema({
  mpxOrResolution: MAX_PHOTO_MEGAPIXELS,
});

export const PhotoSuggestionInputSchema = yup
  .object<PhotoSuggestion>({
    section: yupTypes.node().defined(),
    description: yup.string().defined().nullable(true),
    copyright: yup.string().defined().nullable(true),
    photo: LocalPhotoSchema.clone().defined().nullable(false) as any,
  })
  .strict(true)
  .noUnknown();

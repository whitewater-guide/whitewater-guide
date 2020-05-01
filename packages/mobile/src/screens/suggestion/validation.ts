import * as yup from 'yup';

import { MAX_PHOTO_MEGAPIXELS } from '../../features/uploads';
import { PhotoSuggestion } from './types';
import { getLocalPhotoSchema } from '@whitewater-guide/clients';
import { yupTypes } from '@whitewater-guide/validation';

const LocalPhotoSchema = getLocalPhotoSchema({
  mpxOrResolution: MAX_PHOTO_MEGAPIXELS,
});

export const PhotoSuggestionInputSchema = yup
  .object<PhotoSuggestion>({
    section: yupTypes.node().defined(),
    description: yup.string().nullable(true),
    copyright: yup.string().nullable(true),
    photo: LocalPhotoSchema.clone(),
  })
  .strict(true)
  .noUnknown();

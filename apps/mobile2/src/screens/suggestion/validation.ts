import { getLocalPhotoSchema } from '@whitewater-guide/clients';
import { yupSchemas } from '@whitewater-guide/validation';
import type { ObjectSchema } from 'yup';
import { object, string } from 'yup';

import type { PhotoFile } from '../../features/uploads';
import { MAX_PHOTO_DIMENSION } from '../../features/uploads';
import type { PhotoSuggestion } from './navigation-types';

const MAX_PHOTO_MEGAPIXELS = (MAX_PHOTO_DIMENSION * MAX_PHOTO_DIMENSION) / 1e6;

const LocalPhotoSchema = getLocalPhotoSchema<PhotoFile>({
  mpxOrResolution: MAX_PHOTO_MEGAPIXELS,
}).clone();

export const PhotoSuggestionInputSchema: ObjectSchema<PhotoSuggestion> = object(
  {
    section: yupSchemas.node().required(),
    description: string().notRequired(),
    copyright: string().notRequired(),
    photo: LocalPhotoSchema.clone().required(),
  },
)
  .strict(true)
  .noUnknown();

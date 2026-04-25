import { getLocalPhotoSchema } from '@whitewater-guide/clients';
import { MediaInputSchema, SectionInputSchema } from '@whitewater-guide/schema';
import type { ObjectSchema } from 'yup';
import { array } from 'yup';

import { MAX_PHOTO_DIMENSION } from '../../features/uploads';
import type { PhotoFile } from '../../features/uploads';
import type { MediaFormInput, SectionFormInput } from './types';

const MAX_PHOTO_MEGAPIXELS = (MAX_PHOTO_DIMENSION * MAX_PHOTO_DIMENSION) / 1e6;

const LocalPhotoSchema = getLocalPhotoSchema<PhotoFile>({
  mpxOrResolution: MAX_PHOTO_MEGAPIXELS,
}).clone();

const MediaFormSchema: ObjectSchema<MediaFormInput> = MediaInputSchema.clone()
  .shape({
    photo: LocalPhotoSchema.required(),
  })
  .omit(['url', 'resolution'])
  .defined();

export const SectionFormSchema: ObjectSchema<SectionFormInput> =
  SectionInputSchema.clone()
    .shape({
      media: array().of(MediaFormSchema.clone()).required(),
    })
    .defined()
    .strict(true)
    .noUnknown(true);

import { getLocalPhotoSchema } from '@whitewater-guide/clients';
import { MediaInputSchema, SectionInputSchema } from '@whitewater-guide/schema';
import type { ObjectSchema } from 'yup';
import { array } from 'yup';

import type { PhotoFile } from '~/features/uploads';
import { MAX_PHOTO_MEGAPIXELS } from '~/features/uploads';

import type { MediaFormInput, SectionFormInput } from './types';

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

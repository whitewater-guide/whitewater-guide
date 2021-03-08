import { getLocalPhotoSchema } from '@whitewater-guide/clients';
import {
  MediaInputSchema,
  SectionInputSchema,
} from '@whitewater-guide/commons';
import * as yup from 'yup';

import { MAX_PHOTO_MEGAPIXELS } from '../../features/uploads';
import { MediaFormInput, SectionFormInput } from './types';

const LocalPhotoSchema = getLocalPhotoSchema({
  mpxOrResolution: MAX_PHOTO_MEGAPIXELS,
});

const MediaFormSchema: yup.Schema<MediaFormInput> = MediaInputSchema.clone()
  .shape({
    url: yup.mixed().oneOf([undefined]),
    resolution: yup.mixed().oneOf([undefined]),
    photo: LocalPhotoSchema.clone().defined().nullable(false),
  })
  .defined();

export const SectionFormSchema: yup.Schema<SectionFormInput> = SectionInputSchema.clone()
  .shape({
    media: yup.array().of(MediaFormSchema.clone()),
  })
  .defined()
  .strict(true)
  .noUnknown(true);

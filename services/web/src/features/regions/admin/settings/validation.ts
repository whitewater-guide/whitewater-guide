import { getLocalPhotoSchema } from '@whitewater-guide/clients';
import { RegionAdminSettingsSchema } from '@whitewater-guide/commons';
import * as yup from 'yup';
import { COVER_IMAGE_RESOLUTION } from './constants';
import { RegionAdminFormData } from './types';

export const RegionAdminFormSchema: yup.Schema<
  RegionAdminFormData
> = RegionAdminSettingsSchema.clone()
  .shape({
    coverImage: getLocalPhotoSchema({
      mpxOrResolution: COVER_IMAGE_RESOLUTION,
      nullable: true,
    }),
  })
  .strict(true)
  .noUnknown(true);

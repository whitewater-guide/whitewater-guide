import { getLocalPhotoSchema } from '@whitewater-guide/clients';
import { RegionAdminSettingsSchema } from '@whitewater-guide/schema';

import { COVER_IMAGE_RESOLUTION } from './constants';

export const RegionAdminFormSchema = RegionAdminSettingsSchema.clone()
  .shape({
    coverImage: getLocalPhotoSchema({
      mpxOrResolution: COVER_IMAGE_RESOLUTION,
      nullable: true,
    }),
  })
  .strict(true)
  .noUnknown(true);

import { LocalPhotoStatus } from '@whitewater-guide/clients';
import { nanoid } from 'nanoid';

import { COVER_IMAGE_RESOLUTION } from './constants';
import type { RegionAdminQuery } from './regionAdmin.generated';
import type { RegionAdminFormData } from './types';

export default (result: RegionAdminQuery): RegionAdminFormData => {
  if (!result || !result.settings) {
    throw new Error('only existing regions can be administrated');
  }
  const { hidden, mapsSize, coverImage, premium, ...rest } = result.settings;
  return {
    ...rest,
    premium: !!premium,
    hidden: !!hidden,
    mapsSize: mapsSize || 0,
    coverImage: coverImage.mobile
      ? {
          resolution: COVER_IMAGE_RESOLUTION,
          url: coverImage.mobile,
          status: LocalPhotoStatus.READY,
          id: nanoid(),
        }
      : null,
  };
};

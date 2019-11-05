import { LocalPhotoStatus } from '@whitewater-guide/clients';
import shortid from 'shortid';
import { COVER_IMAGE_RESOLUTION } from './constants';
import { QResult } from './regionAdmin.query';
import { RegionAdminFormData } from './types';

export default (result: QResult): RegionAdminFormData => {
  if (!result || !result.settings) {
    throw new Error('only existing regions can be administrated');
  }
  const { hidden, mapsSize, coverImage, ...rest } = result.settings;
  return {
    ...rest,
    hidden: !!hidden,
    mapsSize: mapsSize || 0,
    coverImage: coverImage.mobile
      ? {
          resolution: COVER_IMAGE_RESOLUTION,
          url: coverImage.mobile,
          status: LocalPhotoStatus.READY,
          id: shortid(),
        }
      : null,
  };
};

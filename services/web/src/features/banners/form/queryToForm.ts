import { LocalPhotoStatus } from '@whitewater-guide/clients';
import {
  BannerKind,
  BannerPlacement,
  BannerResolutions,
} from '@whitewater-guide/commons';
import shortid from 'shortid';
import { fromJSON, squashConnection } from '../../../formik/utils';
import { QResult } from './bannerForm.query';
import { BannerFormData } from './types';

const NEW_BANNER: BannerFormData = {
  id: null,
  slug: '',
  name: '',
  priority: 0,
  enabled: true,
  placement: BannerPlacement.MOBILE_REGION_DESCRIPTION,
  source: {
    status: LocalPhotoStatus.READY,
    resolution: [0, 0],
    id: 'default_id',
  },
  link: null,
  extras: null,
  regions: [],
  groups: [],
};

export default (result?: QResult): BannerFormData => {
  if (!result || !result.banner) {
    return NEW_BANNER;
  }
  const banner = result.banner;
  return {
    ...banner,
    source:
      banner.source.kind === BannerKind.WebView
        ? banner.source.url
        : {
            id: shortid(),
            resolution: BannerResolutions.get(banner.placement)!,
            url: banner.source.url,
            status: LocalPhotoStatus.READY,
          },
    regions: squashConnection(banner, 'regions'),
    groups: squashConnection(banner, 'groups'),
    extras: fromJSON(banner.extras),
  };
};

import { BannerKind, BannerPlacement } from '@whitewater-guide/commons';
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
    kind: BannerKind.Image,
    ratio: null,
    src: null,
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
    regions: squashConnection(banner, 'regions'),
    groups: squashConnection(banner, 'groups'),
    extras: fromJSON(banner.extras),
  };
};

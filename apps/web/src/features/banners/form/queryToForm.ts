import { BannerResolutions, LocalPhotoStatus } from '@whitewater-guide/clients';
import { BannerKind, BannerPlacement } from '@whitewater-guide/schema';
import { nanoid } from 'nanoid';

import { fromJSON } from '../../../formik/utils';
import type { BannerFormQuery } from './bannerForm.generated';
import type { BannerFormData } from './types';

const NEW_BANNER: BannerFormData = {
  id: null,
  slug: '',
  name: '',
  priority: 0,
  enabled: true,
  placement: BannerPlacement.MobileRegionDescription,
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

export default (result?: BannerFormQuery): BannerFormData => {
  if (!result || !result.banner) {
    return NEW_BANNER;
  }
  const { banner } = result;
  return {
    ...banner,
    source:
      banner.source.kind === BannerKind.WebView
        ? banner.source.url
        : {
            id: nanoid(),
            resolution: BannerResolutions[banner.placement],
            url: banner.source.url,
            status: LocalPhotoStatus.READY,
          },
    regions: banner.regions?.nodes ?? [],
    groups: banner.groups?.nodes ?? [],
    extras: fromJSON(banner.extras),
  };
};

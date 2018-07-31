import { Banner, BannerPlacement } from '../../ww-commons';

export const getBannersForPlacement = (banners: Banner[], placement: BannerPlacement, count = 1) =>
  banners
    .filter((banner) => banner.enabled && banner.placement === placement)
    .slice(0, count);

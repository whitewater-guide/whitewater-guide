import { Banner, BannerPlacement } from '@whitewater-guide/commons';

export const getBannersForPlacement = (
  banners: Banner[],
  placement: BannerPlacement,
  count = 1,
) =>
  banners
    .filter((banner) => banner.enabled && banner.placement === placement)
    .slice(0, count);

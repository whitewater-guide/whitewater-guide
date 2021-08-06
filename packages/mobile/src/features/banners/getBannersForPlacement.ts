import {
  BannerPlacement,
  BannerWithSourceFragment,
} from '@whitewater-guide/schema';

export const getBannersForPlacement = (
  banners: BannerWithSourceFragment[],
  placement: BannerPlacement,
  count = 1,
) =>
  banners
    .filter((banner) => banner.enabled && banner.placement === placement)
    .slice(0, count);

import { BannerPlacement } from './types';

export const BannerRatios: Record<BannerPlacement, number> = {
  [BannerPlacement.MOBILE_REGION_DESCRIPTION]: 3,
  [BannerPlacement.MOBILE_SECTION_MEDIA]: 3,
  [BannerPlacement.MOBILE_SECTION_ROW]: 40 / 9,
  [BannerPlacement.MOBILE_SECTION_DESCRIPTION]: 4,
};

export const BannerResolutions: Record<
  BannerPlacement,
  [number, number]
> = Object.entries(BannerRatios).reduce(
  (acc, [placement, ratio]) => ({
    ...acc,
    [placement]: [2048, Math.ceil(2048 / ratio)],
  }),
  {} as Record<BannerPlacement, [number, number]>,
);

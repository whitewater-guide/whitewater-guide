import { BannerPlacement } from '@whitewater-guide/schema';

export const BannerRatios: Record<BannerPlacement, number> = {
  [BannerPlacement.MobileRegionDescription]: 3,
  [BannerPlacement.MobileSectionMedia]: 3,
  [BannerPlacement.MobileSectionRow]: 40 / 9,
  [BannerPlacement.MobileSectionDescription]: 4,
};

export const BannerResolutions: Record<BannerPlacement, [number, number]> =
  Object.entries(BannerRatios).reduce(
    (acc, [placement, ratio]) => ({
      ...acc,
      [placement]: [2048, Math.ceil(2048 / ratio)],
    }),
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    {} as Record<BannerPlacement, [number, number]>,
  );

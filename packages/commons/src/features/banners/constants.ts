import { BannerPlacement } from './types';

export const BannerRatios = new Map<BannerPlacement, number>([
  [BannerPlacement.MOBILE_REGION_DESCRIPTION, 3],
  [BannerPlacement.MOBILE_SECTION_MEDIA, 3],
  [BannerPlacement.MOBILE_SECTION_ROW, 40 / 9],
  [BannerPlacement.MOBILE_SECTION_DESCRIPTION, 4],
]);

export const BannerResolutions = new Map<BannerPlacement, [number, number]>(
  Array.from(BannerRatios.entries()).map(([placement, ratio]) => [
    placement,
    [2048, Math.ceil(2048 / ratio)],
  ]),
);

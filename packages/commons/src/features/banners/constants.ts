import { BannerPlacement } from './types';

export const BannerRatios = new Map<BannerPlacement, number>([
  [BannerPlacement.MOBILE_REGION_DESCRIPTION, 3],
  [BannerPlacement.MOBILE_SECTION_MEDIA, 3],
  [BannerPlacement.MOBILE_SECTION_ROW, 40 / 9],
  [BannerPlacement.MOBILE_SECTION_DESCRIPTION, 4],
]);

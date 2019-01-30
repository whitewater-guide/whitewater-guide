import {
  Banner,
  BannerPlacement,
  Region,
  Section,
} from '@whitewater-guide/commons';
import memoize from 'lodash/memoize';
import { getBannersForPlacement } from '../../../features/banners';

const getSectionsWithBanners = (
  sections: Section[],
  region: Region | null,
  rowsPerScreen: number,
): Array<Section | Banner> => {
  if (!region) {
    return sections;
  }
  const { banners: bannerNodes } = region;
  if (!bannerNodes) {
    return sections;
  }
  const { nodes } = bannerNodes;
  const numSections = sections.length;
  const numBanners = numSections >= 2 * rowsPerScreen + 1 ? 2 : 1;
  const banners = getBannersForPlacement(
    nodes!,
    BannerPlacement.MOBILE_SECTION_ROW,
    numBanners,
  );
  const result: Array<Section | Banner> = [...sections];
  for (let i = 1; i <= banners.length; i++) {
    result.splice(i * rowsPerScreen + 2, 0, banners[i - 1]);
  }
  return result;
};

export default memoize(getSectionsWithBanners);

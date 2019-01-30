import { BannerPlacement, BannerRatios } from '@whitewater-guide/commons';
import { StyleSheet } from 'react-native';

const aspectRatios = StyleSheet.create({
  [BannerPlacement.MOBILE_REGION_DESCRIPTION]: {
    aspectRatio: BannerRatios.get(BannerPlacement.MOBILE_REGION_DESCRIPTION),
  },
  [BannerPlacement.MOBILE_SECTION_DESCRIPTION]: {
    aspectRatio: BannerRatios.get(BannerPlacement.MOBILE_SECTION_DESCRIPTION),
  },
  [BannerPlacement.MOBILE_SECTION_ROW]: {
    aspectRatio: BannerRatios.get(BannerPlacement.MOBILE_SECTION_ROW),
  },
  [BannerPlacement.MOBILE_SECTION_MEDIA]: {
    aspectRatio: BannerRatios.get(BannerPlacement.MOBILE_SECTION_MEDIA),
  },
});

export default aspectRatios;

import { BannerPlacement, BannerRatios } from '@whitewater-guide/commons';
import { StyleSheet } from 'react-native';

const aspectRatios = StyleSheet.create({
  [BannerPlacement.MOBILE_REGION_DESCRIPTION]: {
    aspectRatio: BannerRatios[BannerPlacement.MOBILE_REGION_DESCRIPTION],
  },
  [BannerPlacement.MOBILE_SECTION_DESCRIPTION]: {
    aspectRatio: BannerRatios[BannerPlacement.MOBILE_SECTION_DESCRIPTION],
  },
  [BannerPlacement.MOBILE_SECTION_ROW]: {
    aspectRatio: BannerRatios[BannerPlacement.MOBILE_SECTION_ROW],
  },
  [BannerPlacement.MOBILE_SECTION_MEDIA]: {
    aspectRatio: BannerRatios[BannerPlacement.MOBILE_SECTION_MEDIA],
  },
});

export default aspectRatios;

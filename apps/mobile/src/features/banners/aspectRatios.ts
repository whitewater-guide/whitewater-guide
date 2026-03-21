import { BannerRatios } from '@whitewater-guide/clients';
import { BannerPlacement } from '@whitewater-guide/schema';
import { StyleSheet } from 'react-native';

const aspectRatios = StyleSheet.create({
  [BannerPlacement.MobileRegionDescription]: {
    aspectRatio: BannerRatios[BannerPlacement.MobileRegionDescription],
  },
  [BannerPlacement.MobileSectionDescription]: {
    aspectRatio: BannerRatios[BannerPlacement.MobileSectionDescription],
  },
  [BannerPlacement.MobileSectionRow]: {
    aspectRatio: BannerRatios[BannerPlacement.MobileSectionRow],
  },
  [BannerPlacement.MobileSectionMedia]: {
    aspectRatio: BannerRatios[BannerPlacement.MobileSectionMedia],
  },
});

export default aspectRatios;

import { useRegion } from '@whitewater-guide/clients';
import type { BannerPlacement } from '@whitewater-guide/schema';
import React from 'react';
import { StyleSheet } from 'react-native';

import theme from '../../theme';
import { BannerView } from './BannerView';
import { getBannersForPlacement } from './getBannersForPlacement';

const styles = StyleSheet.create({
  bannerContainer: {
    marginVertical: theme.margin.double,
  },
});

interface Props {
  placement: BannerPlacement;
  count?: number;
}

export const RegionBanners: React.FC<Props> = ({ placement, count = 1 }) => {
  const region = useRegion();
  if (!region || !region.banners) {
    return null;
  }
  const banners = getBannersForPlacement(
    region?.banners?.nodes ?? [],
    placement,
    count,
  );
  return (
    <>
      {banners.map((banner) => (
        <BannerView
          key={banner.id}
          banner={banner}
          containerStyle={styles.bannerContainer}
        />
      ))}
    </>
  );
};

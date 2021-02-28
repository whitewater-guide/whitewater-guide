import { useRegion } from '@whitewater-guide/clients';
import { BannerPlacement } from '@whitewater-guide/commons';
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
  if (!region.node || !region.node.banners) {
    return null;
  }
  const banners = getBannersForPlacement(
    region.node.banners.nodes ?? [],
    placement,
    count,
  );
  return (
    <React.Fragment>
      {banners.map((banner) => (
        <BannerView
          key={banner.id}
          banner={banner}
          containerStyle={styles.bannerContainer}
        />
      ))}
    </React.Fragment>
  );
};

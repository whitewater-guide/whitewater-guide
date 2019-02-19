import { consumeRegion, WithRegion } from '@whitewater-guide/clients';
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

interface OuterProps {
  placement: BannerPlacement;
  count?: number;
}

class RegionBannersInner extends React.PureComponent<OuterProps & WithRegion> {
  render() {
    const { placement, region, count = 1 } = this.props;
    if (!region.node || !region.node.banners) {
      return null;
    }
    const banners = getBannersForPlacement(
      region.node.banners.nodes!,
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
  }
}

export const RegionBanners: React.ComponentType<OuterProps> = consumeRegion()(
  RegionBannersInner,
);

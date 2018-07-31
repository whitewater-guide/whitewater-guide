import React from 'react';
import { consumeRegion, WithRegion } from '../../ww-clients/features/regions';
import { BannerPlacement } from '../../ww-commons';
import { BannerView } from './BannerView';
import { getBannersForPlacement } from './getBannersForPlacement';

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
    const banners = getBannersForPlacement(region.node.banners.nodes!, placement, count);
    return (
      <React.Fragment>
        {banners.map((banner) =>
          (<BannerView key={banner.id} banner={banner} />))
        }
      </React.Fragment>
    );
  }
}

export const RegionBanners: React.ComponentType<OuterProps> = consumeRegion()(RegionBannersInner);

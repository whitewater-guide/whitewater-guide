import type { BannerWithSourceFragment } from '@whitewater-guide/schema';
import React, { memo } from 'react';
import { StyleSheet } from 'react-native';

import { BannerView } from '../../../../features/banners';
import theme from '../../../../theme';
import { ITEM_HEIGHT } from './constants';

const styles = StyleSheet.create({
  banner: {
    alignSelf: 'stretch',
    alignItems: 'center',
    height: ITEM_HEIGHT,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.textLight,
  },
  bannerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

interface Props {
  banner: BannerWithSourceFragment;
}

function SectionListBanner({ banner }: Props) {
  return (
    <BannerView
      banner={banner}
      style={styles.banner}
      containerStyle={styles.bannerContainer}
    />
  );
}

export default memo(SectionListBanner);

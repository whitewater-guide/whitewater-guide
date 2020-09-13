import { Banner } from '@whitewater-guide/commons';
import React from 'react';
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
});

interface Props {
  banner: Banner;
}

export const SectionListBanner: React.FC<Props> = ({ banner }) => (
  <BannerView banner={banner} style={styles.banner} />
);

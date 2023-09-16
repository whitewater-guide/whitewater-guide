import { useFocusEffect } from '@react-navigation/native';
import { BannerPlacement } from '@whitewater-guide/schema';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { RegionBanners } from '~/features/banners';
import theme from '~/theme';

import RegionTabsScreen from '../RegionTabsScreen';
import RegionInfoMenu from './RegionInfoMenu';
import RegionInfoView from './RegionInfoView';
import RegionLicense from './RegionLicense';
import type { RegionInfoNavProps } from './types';

const styles = StyleSheet.create({
  content: {
    padding: theme.margin.single,
  },
});

const RegionInfoScreen: React.FC<RegionInfoNavProps> = ({ navigation }) => {
  useFocusEffect(
    React.useCallback(() => {
      navigation.getParent()?.setOptions({
        // eslint-disable-next-line react/no-unstable-nested-components
        headerRight: () => <RegionInfoMenu />,
      });
    }, [navigation]),
  );

  return (
    <RegionTabsScreen>
      <ScrollView contentContainerStyle={styles.content}>
        <RegionBanners placement={BannerPlacement.MobileRegionDescription} />
        <RegionInfoView />
        <RegionLicense />
      </ScrollView>
    </RegionTabsScreen>
  );
};

export default RegionInfoScreen;

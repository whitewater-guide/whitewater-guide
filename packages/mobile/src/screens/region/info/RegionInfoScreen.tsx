import { BannerPlacement } from '@whitewater-guide/commons';
import { Screen } from 'components/Screen';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { NavigationScreenComponent } from 'react-navigation';
import { RegionBanners } from '../../../features/banners';
import theme from '../../../theme';
import RegionInfoView from './RegionInfoView';

const styles = StyleSheet.create({
  content: {
    padding: theme.margin.single,
  },
});

const RegionInfoScreen: NavigationScreenComponent = () => {
  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <RegionBanners placement={BannerPlacement.MOBILE_REGION_DESCRIPTION} />
        <RegionInfoView />
      </ScrollView>
    </Screen>
  );
};

export default RegionInfoScreen;

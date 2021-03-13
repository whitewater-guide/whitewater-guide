import { useFocusEffect } from '@react-navigation/native';
import { BannerPlacement } from '@whitewater-guide/commons';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { Screen } from '~/components/Screen';

import { RegionBanners } from '../../../features/banners';
import theme from '../../../theme';
import RegionInfoMenu from './RegionInfoMenu';
import RegionInfoView from './RegionInfoView';
import RegionLicense from './RegionLicense';
import { RegionInfoNavProps } from './types';

const styles = StyleSheet.create({
  content: {
    padding: theme.margin.single,
  },
});

const RegionInfoScreen: React.FC<RegionInfoNavProps> = ({ navigation }) => {
  useFocusEffect(
    React.useCallback(() => {
      navigation.dangerouslyGetParent()?.setOptions({
        // eslint-disable-next-line react/display-name
        headerRight: () => <RegionInfoMenu />,
      });
    }, [navigation]),
  );

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <RegionBanners placement={BannerPlacement.MOBILE_REGION_DESCRIPTION} />
        <RegionInfoView />
        <RegionLicense />
      </ScrollView>
    </Screen>
  );
};

export default RegionInfoScreen;

import { useFocusEffect } from '@react-navigation/native';
import { BannerPlacement } from '@whitewater-guide/commons';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Screen } from '~/components/Screen';
import { RegionBanners } from '../../../features/banners';
import theme from '../../../theme';
import RegionInfoMenu from './RegionInfoMenu';
import RegionInfoView from './RegionInfoView';
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
        headerRight: () => <RegionInfoMenu />,
      });
    }, [navigation]),
  );

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

import { BannerPlacement } from '@whitewater-guide/commons';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { NavigationScreenComponent } from 'react-navigation';
import { Icon, Screen } from '../../../components';
import { RegionBanners } from '../../../features/banners';
import { I18nText } from '../../../i18n';
import theme from '../../../theme';
import RegionInfoView from './RegionInfoView';

const styles = StyleSheet.create({
  content: {
    padding: theme.margin.single,
  },
});

export const RegionInfoScreen: NavigationScreenComponent = () => {
  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <RegionBanners placement={BannerPlacement.MOBILE_REGION_DESCRIPTION} />
        <RegionInfoView />
      </ScrollView>
    </Screen>
  );
};

RegionInfoScreen.navigationOptions = {
  tabBarLabel: <I18nText>region:info.title</I18nText>,
  tabBarIcon: () => <Icon icon="information" color={theme.colors.textLight} />,
};

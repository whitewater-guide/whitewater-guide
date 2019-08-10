import { BannerPlacement } from '@whitewater-guide/commons';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { NavigationScreenComponent } from 'react-navigation';
import { Icon, Screen } from '../../../components';
import { RegionBanners } from '../../../features/banners';
import { I18nText } from '../../../i18n';
import theme from '../../../theme';
import { ScreenProps } from '../types';
import RegionInfoView from './RegionInfoView';

const styles = StyleSheet.create({
  content: {
    padding: theme.margin.single,
  },
});

export const RegionInfoScreen: NavigationScreenComponent = (props) => {
  const { region }: ScreenProps = props.screenProps as any;
  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <RegionBanners placement={BannerPlacement.MOBILE_REGION_DESCRIPTION} />
        <RegionInfoView region={region} />
      </ScrollView>
    </Screen>
  );
};

RegionInfoScreen.navigationOptions = {
  tabBarLabel: <I18nText>region:info.title</I18nText>,
  tabBarIcon: () => <Icon icon="information" color={theme.colors.textLight} />,
};

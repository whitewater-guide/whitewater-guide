import { BannerPlacement } from '@whitewater-guide/commons';
import React from 'react';
import { NavigationScreenComponent } from 'react-navigation';
import { Icon, Screen } from '../../../components';
import { RegionBanners } from '../../../features/banners';
import { I18nText } from '../../../i18n';
import theme from '../../../theme';
import { ScreenProps } from '../types';
import RegionInfoView from './RegionInfoView';

export const RegionInfoScreen: NavigationScreenComponent = ({
  screenProps,
}) => {
  const { region }: ScreenProps = screenProps as any;
  return (
    <Screen>
      <RegionBanners placement={BannerPlacement.MOBILE_REGION_DESCRIPTION} />
      <RegionInfoView region={region} />
    </Screen>
  );
};

RegionInfoScreen.navigationOptions = {
  tabBarLabel: <I18nText>region:info.title</I18nText>,
  tabBarIcon: () => <Icon icon="information" color={theme.colors.textLight} />,
};

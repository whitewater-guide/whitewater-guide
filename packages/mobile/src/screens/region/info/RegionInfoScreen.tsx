import React from 'react';
import { NavigationScreenComponent } from 'react-navigation';
import { Icon, Screen } from '../../../components';
import { I18nText } from '../../../i18n';
import theme from '../../../theme';
import RegionInfoView from './RegionInfoView';

export const RegionInfoScreen: NavigationScreenComponent = ({ screenProps }) => (
  <Screen>
    <RegionInfoView region={screenProps!.region} />
  </Screen>
);

RegionInfoScreen.navigationOptions = {
  tabBarLabel: <I18nText>region:info.title</I18nText>,
  tabBarIcon: () => (
    <Icon icon="information" color={theme.colors.textLight} />
  ),
};

import React from 'react';
import { NavigationScreenComponent } from 'react-navigation';
import { Screen } from '../../../components';
import { I18nText } from '../../../i18n';
import RegionInfoView from './RegionInfoView';

export const RegionInfoScreen: NavigationScreenComponent = () =>  (
  <Screen>
    <RegionInfoView />
  </Screen>
);

RegionInfoScreen.navigationOptions = {
  tabBarLabel: <I18nText>region:info.title</I18nText>,
};

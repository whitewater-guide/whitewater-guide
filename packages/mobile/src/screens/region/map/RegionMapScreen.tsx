import React from 'react';
import { NavigationScreenComponent } from 'react-navigation';
import { Icon, Screen } from '../../../components';
import { I18nText } from '../../../i18n';
import theme from '../../../theme';
import { ScreenProps } from '../types';
import RegionMap from './RegionMap';

export const RegionMapScreen: NavigationScreenComponent = ({
  navigation,
  screenProps,
}) => {
  const { region, sections }: ScreenProps = screenProps as any;
  return (
    <Screen noScroll={true}>
      {region.node && <RegionMap region={region.node} sections={sections} />}
    </Screen>
  );
};

RegionMapScreen.navigationOptions = {
  tabBarLabel: <I18nText>region:map.title</I18nText>,
  tabBarIcon: () => <Icon icon="map" color={theme.colors.textLight} />,
};

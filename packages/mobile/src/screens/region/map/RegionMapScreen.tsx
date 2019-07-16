import React from 'react';
import { NavigationScreenComponent } from 'react-navigation';
import { Icon, Screen } from '../../../components';
import { MapLayout } from '../../../components/map';
import { I18nText } from '../../../i18n';
import theme from '../../../theme';
import { ScreenProps } from '../types';

export const RegionMapScreen: NavigationScreenComponent = ({ screenProps }) => {
  const { region, sections }: ScreenProps = screenProps as any;
  return (
    <Screen noScroll={true}>
      {region.node && (
        <MapLayout
          pois={region.node.pois}
          sections={sections}
          initialBounds={region.node.bounds}
        />
      )}
    </Screen>
  );
};

RegionMapScreen.navigationOptions = {
  tabBarLabel: <I18nText>region:map.title</I18nText>,
  tabBarIcon: () => <Icon icon="map" color={theme.colors.textLight} />,
};

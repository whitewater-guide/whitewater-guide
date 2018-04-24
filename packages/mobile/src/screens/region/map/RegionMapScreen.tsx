import React from 'react';
import { NavigationScreenComponent } from 'react-navigation';
import { Icon, Screen } from '../../../components';
import { I18nText } from '../../../i18n';
import theme from '../../../theme';
import FilterButton from '../FilterButton';
import { ScreenProps } from '../types';
import RegionMap from './RegionMap';

export const RegionMapScreen: NavigationScreenComponent = ({ screenProps }) => {
  const { region, sections }: ScreenProps = screenProps as any;
  return (
    <Screen noScroll>
      <RegionMap
        region={region.node}
        sections={sections.nodes}
      />
    </Screen>
  );
};

RegionMapScreen.navigationOptions = {
  tabBarLabel: <I18nText>region:map.title</I18nText>,
  tabBarIcon: () => (
    <Icon icon="map" color={theme.colors.textLight} />
  ),
  headerRight: <FilterButton />,
};

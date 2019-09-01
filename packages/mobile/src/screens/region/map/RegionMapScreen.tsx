import { useRegion, useSectionsList } from '@whitewater-guide/clients';
import React from 'react';
import { NavigationScreenComponent } from 'react-navigation';
import { Icon, Screen } from '../../../components';
import { Map } from '../../../components/map';
import { I18nText } from '../../../i18n';
import theme from '../../../theme';

export const RegionMapScreen: NavigationScreenComponent = () => {
  const { node } = useRegion();
  const { sections } = useSectionsList();
  return (
    <Screen>
      {node && (
        <Map pois={node.pois} sections={sections} initialBounds={node.bounds} />
      )}
    </Screen>
  );
};

RegionMapScreen.navigationOptions = {
  tabBarLabel: <I18nText>region:map.title</I18nText>,
  tabBarIcon: () => <Icon icon="map" color={theme.colors.textLight} />,
};

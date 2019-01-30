import React from 'react';
import { NavigationScreenComponent } from 'react-navigation';
import { Icon, Screen } from '../../../components';
import { I18nText } from '../../../i18n';
import theme from '../../../theme';
import { ScreenProps } from '../types';
import SectionMap from './SectionMap';

export const SectionMapScreen: NavigationScreenComponent = ({
  screenProps,
}) => {
  const { section }: ScreenProps = screenProps as any;
  return (
    <Screen noScroll>
      <SectionMap section={section} />
    </Screen>
  );
};

SectionMapScreen.navigationOptions = {
  tabBarLabel: <I18nText>section:map.title</I18nText>,
  tabBarIcon: () => <Icon icon="map" color={theme.colors.textLight} />,
};

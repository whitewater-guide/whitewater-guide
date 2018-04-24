import React from 'react';
import { Paragraph } from 'react-native-paper';
import { NavigationScreenComponent } from 'react-navigation';
import { Icon, Screen } from '../../../components';
import { I18nText } from '../../../i18n';
import theme from '../../../theme';

export const SectionMapScreen: NavigationScreenComponent = () => (
  <Screen>
    <Paragraph>Section map</Paragraph>
  </Screen>
);

SectionMapScreen.navigationOptions = {
  tabBarLabel: <I18nText>section:map.title</I18nText>,
  tabBarIcon: () => (
    <Icon icon="map" color={theme.colors.textLight} />
  ),
};

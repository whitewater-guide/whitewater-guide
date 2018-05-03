import React from 'react';
import { Paragraph } from 'react-native-paper';
import { NavigationScreenComponent } from 'react-navigation';
import { Icon, Screen } from '../../../components';
import { I18nText } from '../../../i18n';
import theme from '../../../theme';

export const SectionMediaScreen: NavigationScreenComponent = () => (
  <Screen>
    <Paragraph>Section media</Paragraph>
  </Screen>
);

SectionMediaScreen.navigationOptions = {
  tabBarLabel: <I18nText>section:media.title</I18nText>,
  tabBarIcon: () => (
    <Icon icon="image-multiple" color={theme.colors.textLight} />
  ),
};

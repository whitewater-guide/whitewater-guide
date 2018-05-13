import React from 'react';
import { NavigationScreenComponent } from 'react-navigation';
import { Icon, Screen } from '../../../components';
import { I18nText } from '../../../i18n';
import theme from '../../../theme';
import SectionGuideView from './SectionGuideView';

export const SectionGuideScreen: NavigationScreenComponent = ({ screenProps }) => (
  <Screen>
    <SectionGuideView section={screenProps.section} />
  </Screen>
);

SectionGuideScreen.navigationOptions = {
  tabBarLabel: <I18nText>section:guide.title</I18nText>,
  tabBarIcon: () => (
    <Icon icon="book-open-variant" color={theme.colors.textLight} />
  ),
};

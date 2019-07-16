import { useSection } from '@whitewater-guide/clients';
import React from 'react';
import { NavigationScreenComponent } from 'react-navigation';
import { Icon, Screen } from '../../../components';
import { I18nText } from '../../../i18n';
import theme from '../../../theme';
import SectionMediaScreenContent from './SectionMediaScreenContent';

export const SectionMediaScreen: NavigationScreenComponent = () => {
  const { node } = useSection();
  return (
    <Screen>
      <SectionMediaScreenContent section={node} />
    </Screen>
  );
};

SectionMediaScreen.navigationOptions = {
  tabBarLabel: <I18nText>section:media.title</I18nText>,
  tabBarIcon: () => (
    <Icon icon="image-multiple" color={theme.colors.textLight} />
  ),
};

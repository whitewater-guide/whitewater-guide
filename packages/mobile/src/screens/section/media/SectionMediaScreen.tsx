import React from 'react';
import { NavigationScreenComponent } from 'react-navigation';
import { Icon, Screen } from '../../../components';
import { I18nText } from '../../../i18n';
import theme from '../../../theme';
import { ScreenProps } from '../types';
import SectionMediaScreenContent from './SectionMediaScreenContent';

export const SectionMediaScreen: NavigationScreenComponent = (props) => {
  const screenProps: ScreenProps = props.screenProps as any;
  return (
    <Screen>
      <SectionMediaScreenContent section={screenProps.section.node} />
    </Screen>
  );
};

SectionMediaScreen.navigationOptions = {
  tabBarLabel: <I18nText>section:media.title</I18nText>,
  tabBarIcon: () => (
    <Icon icon="image-multiple" color={theme.colors.textLight} />
  ),
};

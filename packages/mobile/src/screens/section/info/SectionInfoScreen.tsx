import React from 'react';
import { NavigationScreenComponent } from 'react-navigation';
import { Icon, Screen } from '../../../components';
import { I18nText } from '../../../i18n';
import theme from '../../../theme';
import { ScreenProps } from '../types';
import SectionInfoView from './SectionInfoView';

export const SectionInfoScreen: NavigationScreenComponent = (props) => {
  const screenProps: ScreenProps = props.screenProps as any;
  return (
    <Screen>
      <SectionInfoView section={screenProps.section} />
    </Screen>
  );
};

SectionInfoScreen.navigationOptions = {
  tabBarLabel: <I18nText>section:info.title</I18nText>,
  tabBarIcon: () => <Icon icon="information" color={theme.colors.textLight} />,
};

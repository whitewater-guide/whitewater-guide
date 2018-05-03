import React from 'react';
import { Paragraph } from 'react-native-paper';
import { NavigationScreenComponent } from 'react-navigation';
import { Icon, Screen } from '../../../components';
import { I18nText } from '../../../i18n';
import theme from '../../../theme';

export const SectionChartScreen: NavigationScreenComponent = () => (
  <Screen>
    <Paragraph>Section chart</Paragraph>
  </Screen>
);

SectionChartScreen.navigationOptions = {
  tabBarLabel: <I18nText>section:chart.title</I18nText>,
  tabBarIcon: () => (
    <Icon icon="chart-line" color={theme.colors.textLight} />
  ),
};

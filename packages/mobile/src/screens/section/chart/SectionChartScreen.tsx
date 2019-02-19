import React from 'react';
import { NavigationScreenComponent } from 'react-navigation';
import { Icon, Screen } from '../../../components';
import { NoChart } from '../../../components/chart/NoChart';
import { I18nText } from '../../../i18n';
import theme from '../../../theme';
import { ScreenProps } from '../types';
import InteractiveChart from './InteractiveChart';

export const SectionChartScreen: NavigationScreenComponent = (props) => {
  const screenProps: ScreenProps = props.screenProps as any;
  const section = screenProps.section.node;
  const gauge = section && section.gauge;
  return (
    <Screen noScroll={true} noPadding={true}>
      {section && gauge ? (
        <InteractiveChart section={section} gauge={gauge} />
      ) : (
        <NoChart />
      )}
    </Screen>
  );
};

SectionChartScreen.navigationOptions = {
  tabBarLabel: <I18nText>section:chart.title</I18nText>,
  tabBarIcon: () => <Icon icon="chart-line" color={theme.colors.textLight} />,
};

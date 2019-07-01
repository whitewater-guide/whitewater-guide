import { useSection } from '@whitewater-guide/clients';
import React from 'react';
import { NavigationScreenComponent } from 'react-navigation';
import { Icon, Screen } from '../../../components';
import { NoChart } from '../../../components/chart';
import { I18nText } from '../../../i18n';
import theme from '../../../theme';
import ChartLayout from './ChartLayout';

export const SectionChartScreen: NavigationScreenComponent = () => {
  const { node } = useSection();
  const gauge = node && node.gauge;
  return (
    <Screen noScroll={true} noPadding={true}>
      {node && gauge ? (
        <ChartLayout section={node} gauge={gauge} />
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

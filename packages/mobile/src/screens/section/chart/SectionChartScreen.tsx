import { useSection } from '@whitewater-guide/clients';
import React from 'react';
import { NavigationScreenComponent } from 'react-navigation';
import { Icon, Screen } from '../../../components';
import { NoChart } from '../../../components/chart/NoChart';
import { I18nText } from '../../../i18n';
import theme from '../../../theme';
import InteractiveChart from './InteractiveChart';

export const SectionChartScreen: NavigationScreenComponent = () => {
  const { node } = useSection();
  const gauge = node && node.gauge;
  return (
    <Screen noScroll={true} noPadding={true}>
      {node && gauge ? (
        <InteractiveChart section={node} gauge={gauge} />
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

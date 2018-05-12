import React from 'react';
import ErrorBoundary from 'react-error-boundary';
import { Unit } from '../../../ww-commons';
import {
  ChartComponentProps,
  ChartLayoutProps,
  FlowToggleProps,
  InteractiveChartInnerProps,
  PeriodToggleProps,
} from './types';

export const createInteractiveChart = (
  Layout: React.ComponentType<ChartLayoutProps>,
  Chart: React.ComponentType<ChartComponentProps>,
  FlowToggle: React.ComponentType<FlowToggleProps>,
  PeriodToggle: React.ComponentType<PeriodToggleProps>,
): React.ComponentType<InteractiveChartInnerProps> => {
  class InteractiveChart extends React.Component<InteractiveChartInnerProps> {

    render() {
      const { gauge, days, measurements, onChangeDays, onChangeUnit, section, unit, unitChangeable } = this.props;
      const chart = (
        <ErrorBoundary>
          <Chart
            data={measurements.data}
            loading={measurements.loading}
            unit={unit}
            gauge={gauge}
            section={section}
          />
        </ErrorBoundary>
      );
      const flowToggle = (
        <FlowToggle
          enabled={unitChangeable}
          unit={unit}
          loading={measurements.loading}
          unitName={unit === Unit.FLOW ? gauge.flowUnit! : gauge.levelUnit!}
          onChange={onChangeUnit}
          gauge={gauge}
        />
      );
      const periodToggle = (
        <PeriodToggle
          onChange={onChangeDays}
          loading={measurements.loading}
          days={days}
        />
      );

      return (
        <ErrorBoundary>
          <Layout
            gauge={gauge}
            section={section}
            chart={chart}
            flowToggle={flowToggle}
            periodToggle={periodToggle}
          />
        </ErrorBoundary>
      );
    }

  }

  return InteractiveChart;
};

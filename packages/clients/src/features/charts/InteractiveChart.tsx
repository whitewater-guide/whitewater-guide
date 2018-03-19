import * as moment from 'moment';
import * as React from 'react';
import { GaugeBinding, Measurement, Unit } from '../../../ww-commons';
import { ChartComponentProps, ChartLayoutProps, FlowToggleProps, PeriodToggleProps } from './types';

// TODO: remove me
type GaugeAndBinding = GaugeBinding & { lastValue: number | null };

export interface Props {
  data: Measurement[];
  loading: boolean;
  startDate: Date;
  endDate: Date;
  onDomainChanged?: (domain: [Date, Date]) => void;
  levels: GaugeAndBinding;
  flows: GaugeAndBinding;
  levelUnit: string | null;
  flowUnit: string | null;
}

interface State {
  chartDomain: [Date, Date];
  unit: Unit;
}

export default (
  Layout: React.ComponentType<ChartLayoutProps>,
  Chart: React.ComponentType<ChartComponentProps>,
  FlowToggle: React.ComponentType<FlowToggleProps>,
  PeriodToggle: React.ComponentType<PeriodToggleProps>,
) => {
  class InteractiveChart extends React.Component<Props, State> {

    constructor(props: Props) {
      super(props);
      this.state = {
        // This is what is selected on chart, available data can contain more measurements
        chartDomain: [props.startDate, props.endDate],
        unit: props.flowUnit ? Unit.FLOW : Unit.LEVEL,
      };
    }

    onDomainChanged = ({ x: chartDomain }: {x: [Date, Date]}) => {
      this.setState({ chartDomain });
      // Ask parent to give us new data (or maybe same, if new domain is more narrow than existing data)
      if (this.props.onDomainChanged) {
        this.props.onDomainChanged(chartDomain);
      }
    };

    onUnitChanged = (unit: Unit) => this.setState({ unit });

    setDomainInDays = (days: number) => {
      const chartDomain: [Date, Date] = [moment().subtract(days, 'days').toDate(), new Date()];
      this.setState({ chartDomain });
      // Ask parent to give us new data (or maybe same, if new domain is more narrow than existing data)
      if (this.props.onDomainChanged) {
        this.props.onDomainChanged(chartDomain);
      }
    };

    render() {
      const { chartDomain, unit } = this.state;
      const { flowUnit, flows, levelUnit, levels } = this.props;
      const start = moment(chartDomain[0]);
      const end = moment(chartDomain[1]);
      // Filter data so chart doesn't draw anything beyond selection
      const data = this.props.data.filter(({ timestamp }) => start.isBefore(timestamp) && end.isAfter(timestamp));
      const binding = unit === 'flow' ? flows : levels;

      const chart = (
        <Chart
          binding={binding}
          data={data}
          unit={unit}
          domain={chartDomain}
          levelUnit={levelUnit}
          flowUnit={flowUnit}
          onDomainChanged={this.onDomainChanged}
        />
      );
      const flowToggle = (
        <FlowToggle
          enabled={!!flowUnit && !!levelUnit}
          measurement={unit}
          unit={unit === 'flow' ? flowUnit : levelUnit}
          value={binding.lastValue!}
          onChange={this.onUnitChanged}
        />
      );
      const periodToggle = (
        <PeriodToggle
          onChange={this.setDomainInDays}
          loading={this.props.loading}
          startDate={chartDomain[0]}
          endDate={chartDomain[1]}
        />
      );

      return (
        <Layout
          chart={chart}
          flowToggle={flowToggle}
          periodToggle={periodToggle}
        />
      );
    }

  }

  return InteractiveChart;
};

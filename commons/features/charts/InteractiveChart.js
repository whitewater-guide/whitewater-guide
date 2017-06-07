import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';
import _ from 'lodash';

export default (Layout, Chart, FlowToggle, PeriodToggle) => {
  class InteractiveChart extends React.Component {
    static propTypes = {
      data: PropTypes.arrayOf(PropTypes.shape({
        level: PropTypes.number,
        flow: PropTypes.number,
        timestamp: PropTypes.instanceOf(Date),
      })).isRequired, // This is all data available to the chart
      startDate: PropTypes.instanceOf(Date).isRequired,
      endDate: PropTypes.instanceOf(Date).isRequired,
      onDomainChanged: PropTypes.func,
      levels: PropTypes.shape({
        minimum: PropTypes.number,
        maximum: PropTypes.number,
        optimum: PropTypes.number,
        impossible: PropTypes.number,
        approximate: PropTypes.number,
      }),
      flows: PropTypes.shape({
        minimum: PropTypes.number,
        maximum: PropTypes.number,
        optimum: PropTypes.number,
        impossible: PropTypes.number,
        approximate: PropTypes.number,
      }),
      levelUnit: PropTypes.string,
      flowUnit: PropTypes.string,
    };

    static defaultProps = {
      onDomainChanged: () => {},
      binding: {},
    };

    constructor(props) {
      super(props);
      this.state = {
        // This is what is selected on chart, available data can contain more measurements
        chartDomain: [props.startDate, props.endDate],
        unit: props.flowUnit ? 'flow' : 'level',
      };
    }

    onDomainChanged = ({ x: chartDomain }) => {
      this.setState({ chartDomain });
      // Ask parent to give us new data (or maybe same, if new domain is more narrow than existing data)
      this.props.onDomainChanged(chartDomain);
    };

    onUnitChanged = unit => this.setState({ unit });

    setDomainInDays = (days) => {
      const chartDomain = [moment().subtract(days, 'days').toDate(), new Date()];
      this.setState({ chartDomain });
      // Ask parent to give us new data (or maybe same, if new domain is more narrow than existing data)
      this.props.onDomainChanged(chartDomain);
    };

    render() {
      const { chartDomain, unit } = this.state;
      const start = moment(chartDomain[0]);
      const end = moment(chartDomain[1]);
      // Filter data so chart doesn't draw anything beyond selection
      const data = _.filter(this.props.data, ({ date }) => start.isBefore(date) && end.isAfter(date));
      const binding = unit === 'flow' ? this.props.flows : this.props.levels;

      const chart = (<Chart
        binding={binding}
        data={data}
        unit={unit}
        domain={chartDomain}
        levelUnit={this.props.levelUnit}
        flowUnit={this.props.flowUnit}
        onDomainChanged={this.onDomainChanged}
      />);
      const flowToggle = <FlowToggle value={unit} onChange={this.onUnitChanged} />;
      const periodToggle = <PeriodToggle onChange={this.setDomainInDays} />;

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

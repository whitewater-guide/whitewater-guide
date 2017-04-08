import React, { PropTypes } from 'react';
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
    };

    static defaultProps = {
      onDomainChanged: () => {
      },
    };

    constructor(props) {
      super(props);
      this.state = {
        // This is what is selected on chart, available data can contain more measurements
        chartDomain: [props.startDate, props.endDate],
        unit: 'flow',
      };
    }

    onDomainChanged = ({ x: chartDomain }) => {
      this.setState({ chartDomain });
      // Ask parent to give us new data (or maybe same, if new domain is more narrow than existing data)
      this.props.onDomainChanged(chartDomain);
    };

    onUnitChanged = unit => this.setState(unit);

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

      const chart = <Chart data={data} unit={unit} domain={chartDomain} onDomainChanged={this.onDomainChanged} />;
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

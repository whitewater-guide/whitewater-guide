import React, { PropTypes } from 'react';
import { branch, compose, flattenProp, hoistStatics, renderComponent, withProps } from 'recompose';
import { Screen, spinnerWhileLoading, TabIcon } from '../../../components';
import { InteractiveChart, NoChart } from '../../../components/chart';
import { withGauge } from '../../../commons/features/gauges';
import GaugeInfo from './GaugeInfo';

class SectionChartScreen extends React.PureComponent {

  static propTypes = {
    section: PropTypes.object,
    sectionLoading: PropTypes.bool,
    gauge: PropTypes.object.isRequired,
    onDomainChanged: PropTypes.func,
    startDate: PropTypes.instanceOf(Date).isRequired, // initial value
    endDate: PropTypes.instanceOf(Date).isRequired, // initial value
  };

  static navigationOptions = {
    tabBar: {
      label: 'Flow',
      icon: () => <TabIcon icon="analytics" />,
    },
  };

  render() {
    const { startDate, endDate, onDomainChanged } = this.props;
    const { flows, levels, measurements } = this.props.gauge;
    return (
      <Screen>
        <InteractiveChart
          data={measurements}
          flows={flows}
          levels={levels}
          startDate={startDate}
          endDate={endDate}
          onDomainChanged={onDomainChanged}
        />
        <GaugeInfo gauge={this.props.gauge} />
      </Screen>
    );
  }

}

const container = compose(
  flattenProp('screenProps'),
  branch(
    ({ section }) => !!section && !!section.gauge,
    compose(
      withProps(({ section }) => ({ gaugeId: section.gauge._id })),
      withGauge({ withMeasurements: true }),
      spinnerWhileLoading(props => props.gaugeLoading),
    ),
    renderComponent(NoChart),
  ),
);

export default hoistStatics(container)(SectionChartScreen);

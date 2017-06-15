import PropTypes from 'prop-types';
import React from 'react';
import { branch, compose, flattenProp, hoistStatics, renderComponent, withProps } from 'recompose';
import { Screen, spinnerWhileLoading, TabIcon, withErrorsView } from '../../../components';
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
    tabBarLabel: 'Flow',
    tabBarIcon: () => <TabIcon icon="stats" />,
  };

  render() {
    const { section, gauge, startDate, endDate, onDomainChanged } = this.props;
    const { flows, levels } = section;
    const { measurements, levelUnit, flowUnit } = gauge;
    return (
      <Screen noScroll>
        <InteractiveChart
          data={measurements}
          flows={flows}
          levels={levels}
          levelUnit={levelUnit}
          flowUnit={flowUnit}
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
      withErrorsView,
      spinnerWhileLoading(props => (props.gaugeLoading && !props.gauge)),
    ),
    renderComponent(NoChart),
  ),
);

export default hoistStatics(container)(SectionChartScreen);

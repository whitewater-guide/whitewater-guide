import React, { PropTypes } from 'react';
import { Container } from 'native-base';
import { branch, compose, flattenProp, renderComponent, withProps } from 'recompose';
import { Screen, spinnerWhileLoading } from '../../../components';
import { InteractiveChart, NoChart } from '../../../components/chart';
import { withGauge } from '../../../commons/features/gauges';

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
    },
  };

  render() {
    const { startDate, endDate, onDomainChanged } = this.props;
    const { measurements } = this.props.gauge;
    return (
      <Container>
        <InteractiveChart
          data={measurements}
          startDate={startDate}
          endDate={endDate}
          onDomainChanged={onDomainChanged}
        />
      </Container>
    );
  }

}

export default compose(
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
)(SectionChartScreen);

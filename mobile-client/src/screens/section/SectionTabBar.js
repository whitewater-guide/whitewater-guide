import { TabNavigator } from 'react-navigation';
import { compose, mapProps } from 'recompose';
import update from 'immutability-helper';
import { withFragment } from '../../commons/core';
import { SectionFragments } from '../../commons/features/sections';

const TabBarComponent = TabNavigator.Presets.Default.tabBarComponent;

// Remove chart from tab bar when no gauge data is present in section
export default compose(
  withFragment({
    fragment: SectionFragments.Measurements,
    fragmentName: 'SectionMeasurements',
    idFromProps: props => `Section:${props.navigationState.params.sectionId}`,
    propName: 'section',
  }),
  mapProps((props) => {
    if (props.section.gauge) {
      return props;
    }
    return update(props, { navigationState: { routes: { $splice: [[1, 1]] } } });
  }),
)(TabBarComponent);

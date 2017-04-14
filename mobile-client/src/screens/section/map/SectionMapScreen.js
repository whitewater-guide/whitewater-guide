import React from 'react';
import { compose, flattenProp, setStatic } from 'recompose';
import { LoadingPlug, TabIcon } from '../../../components';
import { MapMobile } from '../../../components/map';
import { SectionMapView } from '../../../commons/features/sections';
import SectionMapLayout from './SectionMapLayout';

export default compose(
  setStatic(
    'navigationOptions',
    {
      tabBarLabel: 'Map',
      tabBarIcon: () => <TabIcon icon="map" />,
    },
  ),
  flattenProp('screenProps'),
)(
  SectionMapView(SectionMapLayout, MapMobile, () => null, () => null, LoadingPlug),
);

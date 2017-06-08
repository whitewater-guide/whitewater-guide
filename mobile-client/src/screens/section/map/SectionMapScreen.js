import React from 'react';
import { compose, flattenProp, setStatic } from 'recompose';
import { LoadingPlug, TabIcon } from '../../../components';
import { MapLayout, MapMobile, SelectedPOIView } from '../../../components/map';
import { SectionMapView } from '../../../commons/features/sections';

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
  SectionMapView(MapLayout('sectionScreen', false), MapMobile, () => null, SelectedPOIView, LoadingPlug),
);

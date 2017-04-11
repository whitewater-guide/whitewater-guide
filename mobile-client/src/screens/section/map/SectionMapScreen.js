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
      tabBar: {
        label: 'Map',
        icon: () => <TabIcon icon="map" />,
      },
    },
  ),
  flattenProp('screenProps'),
)(
  SectionMapView(SectionMapLayout, MapMobile, () => null, () => null, LoadingPlug),
);

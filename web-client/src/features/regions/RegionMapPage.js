import React from 'react';
import { compose } from 'recompose';
import { LoadingPlug } from '../../core/components';
import { ViewSection } from '../sections';
import { withRegion, RegionMapView } from '../../commons/features/regions';
import { withSectionsList } from '../../commons/features/sections';
import RegionMapLayout from './RegionMapLayout';
import MapOfRegionWeb from './MapOfRegionWeb';

export default compose(
  withRegion({ withBounds: true, withPOIs: false }),
  withSectionsList({ withGeo: true }),
)(RegionMapView(RegionMapLayout, MapOfRegionWeb, ViewSection, () => <div />, LoadingPlug));

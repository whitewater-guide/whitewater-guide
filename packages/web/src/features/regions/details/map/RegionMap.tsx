import * as React from 'react';
import ErrorBoundary from 'react-error-boundary';
import { getMapView, MapProps } from '../../../../ww-clients/features/maps';
import RegionMapBody from './RegionMapBody';
import RegionMapLayout from './RegionMapLayout';

const View: React.ComponentType<MapProps> =
  getMapView<MapProps>(RegionMapLayout, RegionMapBody, () => null, () => null);

const RegionMap: React.StatelessComponent<MapProps> = (props) => (
  <ErrorBoundary>
    <View {...props} />
  </ErrorBoundary>
);

export default RegionMap;

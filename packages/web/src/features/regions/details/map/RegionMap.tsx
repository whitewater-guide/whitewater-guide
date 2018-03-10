import * as React from 'react';
import { getMapView, MapProps } from '../../../../ww-clients/features/maps';
import RegionMapBody from './RegionMapBody';
import RegionMapLayout from './RegionMapLayout';
import ErrorBoundary from 'react-error-boundary';

const View: React.ComponentType<MapProps> =
  getMapView<MapProps>(RegionMapLayout, RegionMapBody, () => null, () => null);

const RegionMap: React.StatelessComponent<MapProps> = (props) => (
  <ErrorBoundary>
    <View {...props} />
  </ErrorBoundary>
);

export default RegionMap;

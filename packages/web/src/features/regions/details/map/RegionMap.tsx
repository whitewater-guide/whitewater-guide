import React from 'react';
import ErrorBoundary from 'react-error-boundary';
import { WebMapLayout } from '../../../../components/maps';
import { getMapView, MapProps } from '../../../../ww-clients/features/maps';
import RegionMapBody from './RegionMapBody';
import SelectedSectionWeb from './SelectedSectionWeb';

const View: React.ComponentType<MapProps> =
  getMapView<MapProps>(WebMapLayout, RegionMapBody, SelectedSectionWeb, () => null);

const RegionMap: React.StatelessComponent<MapProps> = (props) => (
  <ErrorBoundary>
    <View {...props} />
  </ErrorBoundary>
);

export default RegionMap;

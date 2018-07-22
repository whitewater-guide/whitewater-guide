import React from 'react';
import ErrorBoundary from 'react-error-boundary';
import { MapElement, WebMapLayout } from '../../../../components/maps';
import { getMapView, MapProps, SelectedSectionViewProps } from '../../../../ww-clients/features/maps';
import RegionMapBody from './RegionMapBody';
import SelectedSectionWeb from './SelectedSectionWeb';

const View: React.ComponentType<MapProps> =
  getMapView<MapProps, MapElement & SelectedSectionViewProps>(
    WebMapLayout,
    RegionMapBody,
    SelectedSectionWeb,
    () => null,
  );

const RegionMap: React.StatelessComponent<MapProps> = (props) => (
  <ErrorBoundary>
    <View {...props} />
  </ErrorBoundary>
);

export default RegionMap;

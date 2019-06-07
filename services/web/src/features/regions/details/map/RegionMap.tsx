import { getMapView, MapProps } from '@whitewater-guide/clients';
import React from 'react';
import ErrorBoundary from 'react-error-boundary';
import { WebMapLayout } from '../../../../components/maps';
import RegionMapBody from './RegionMapBody';
import SelectedSectionWeb from './SelectedSectionWeb';

const View: React.ComponentType<MapProps> = getMapView(
  WebMapLayout,
  RegionMapBody,
  SelectedSectionWeb as any,
  () => null,
) as any;

const RegionMap: React.FC<MapProps> = (props) => (
  <ErrorBoundary>
    <View {...props} />
  </ErrorBoundary>
);

export default RegionMap;

import React from 'react';
import ErrorBoundary from 'react-error-boundary';
import { ErrorBoundaryFallback } from '../../../components';
import { getMapLayout, Map, SelectedPOIView, SelectedSectionView } from '../../../components/map';
import { trackError } from '../../../core/errors';
import { getMapView, MapProps } from '../../../ww-clients/features/maps';
import { regionMapContainer } from '../../../ww-clients/features/regions/map';

const View: React.ComponentType<MapProps> =
  getMapView<MapProps>(getMapLayout('region'), Map, SelectedSectionView, SelectedPOIView);

const reportError = (error: Error, componentStack: string) =>
  trackError('region_map', error, componentStack);

const RegionMap: React.StatelessComponent<MapProps> = (props) => (
  <ErrorBoundary FallbackComponent={ErrorBoundaryFallback} onError={reportError}>
    <View {...props} />
  </ErrorBoundary>
);

export default regionMapContainer(RegionMap);

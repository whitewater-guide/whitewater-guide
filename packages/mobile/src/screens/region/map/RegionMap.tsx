import {
  getMapView,
  MapProps,
  regionMapContainer,
} from '@whitewater-guide/clients';
import React from 'react';
import ErrorBoundary from 'react-error-boundary';
import { ErrorBoundaryFallback } from '../../../components';
import {
  getMapLayout,
  Map,
  SelectedPOIView,
  SelectedSectionView,
} from '../../../components/map';
import { trackError } from '../../../core/errors';

const View = getMapView(
  getMapLayout('region'),
  Map,
  SelectedSectionView,
  SelectedPOIView,
);

const reportError = (error: Error, componentStack: string) =>
  trackError('region_map', error, componentStack);

const RegionMap: React.FC<MapProps> = (props) => (
  <ErrorBoundary
    FallbackComponent={ErrorBoundaryFallback}
    onError={reportError}
  >
    <View {...props} />
  </ErrorBoundary>
);

export default regionMapContainer(RegionMap);

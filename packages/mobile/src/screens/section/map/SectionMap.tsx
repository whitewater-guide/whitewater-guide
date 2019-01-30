import {
  getMapView,
  MapProps,
  sectionMapContainer,
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

const View: React.ComponentType<MapProps> = getMapView<MapProps>(
  getMapLayout('section'),
  Map,
  SelectedSectionView,
  SelectedPOIView,
);

const reportError = (error: Error, componentStack: string) =>
  trackError('section_map', error, componentStack);

const SectionMap: React.StatelessComponent<MapProps> = (props) => (
  <ErrorBoundary
    FallbackComponent={ErrorBoundaryFallback}
    onError={reportError}
  >
    <View {...props} />
  </ErrorBoundary>
);

export default sectionMapContainer(SectionMap);

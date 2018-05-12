import React from 'react';
import ErrorBoundary from 'react-error-boundary';
import { getMapLayout, Map, SelectedPOIView, SelectedSectionView } from '../../../components/map';
import { getMapView, MapProps } from '../../../ww-clients/features/maps';

const View: React.ComponentType<MapProps> =
  getMapView<MapProps>(getMapLayout('section'), Map, SelectedSectionView, SelectedPOIView);

const SectionMap: React.StatelessComponent<MapProps> = (props) => (
  <ErrorBoundary>
    <View {...props} />
  </ErrorBoundary>
);

export default SectionMap;
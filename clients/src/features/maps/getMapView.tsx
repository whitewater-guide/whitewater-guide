import { find } from 'lodash';
import * as React from 'react';
import { ComponentType } from 'react';
import { Point, Section } from '../../../ww-commons';
import { MapLayoutProps, MapProps, SelectedPOIViewProps, SelectedSectionViewProps } from './types';
import shallowequal = require('shallowequal');

const customizer = (val: any, other: any, key: string) => (key === 'initialBounds' ? true : undefined);

export const getMapView = <M extends MapProps>(
  Layout: ComponentType<MapLayoutProps>,
  Map: ComponentType<M>,
  SelectedSection: ComponentType<SelectedSectionViewProps>,
  SelectedPOI: ComponentType<SelectedPOIViewProps>,
) => {
  class MapViewBase extends React.Component<M> {
    shouldComponentUpdate(nextProps: M) {
      // Initial bounds are initial and should not cause re-rendering
      return !shallowequal(nextProps, this.props, customizer);
    }

    render() {
      const { selectedSectionId, sections, onSectionSelected, selectedPOIId, pois, onPOISelected } = this.props;
      const mapView = <Map {...this.props} />;
      const selectedSection = find(sections, ({ id }: Section) => id === selectedSectionId) || null;
      const selectedSectionView = (
        <SelectedSection
          onSectionSelected={onSectionSelected}
          onPOISelected={onPOISelected}
          selectedSection={selectedSection}
        />
      );
      const selectedPOI = find(pois, ({ id }: Point) => id === selectedPOIId) || null;
      const selectedPOIView = (
        <SelectedPOI
          selectedPOI={selectedPOI}
          onPOISelected={onPOISelected}
          selectedSection={selectedSection}
        />
      );
      return (
        <Layout
          mapView={mapView}
          selectedSectionView={selectedSectionView}
          selectedPOIView={selectedPOIView}
        />
      );
    }
  }

  return MapViewBase;
};
